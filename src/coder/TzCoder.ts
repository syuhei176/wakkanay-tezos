import { coder, types } from 'wakkanay'
import Coder = coder.Coder
import Codable = types.Codable
import Address = types.Address
import Bytes = types.Bytes
import Integer = types.Integer
import BigNumber = types.BigNumber
import List = types.List
import Tuple = types.Tuple
import Struct = types.Struct
import { AbiEncodeError, AbiDecodeError } from './Error'
import {
  Primitive,
  PrimitiveItem,
  encodeToMicheline,
  implementsPrimitive
} from './Primitive'

export function encodeInnerToPrimitiveItem(
  d: Codable,
  input: any
): PrimitiveItem {
  if (d instanceof Integer) {
    return { number: input }
  } else if (d instanceof BigNumber) {
    return { string: input }
  } else if (d instanceof Address) {
    return { string: input }
  } else if (d instanceof Bytes) {
    return { string: Bytes.from(input).intoString() }
  } else if (d instanceof List) {
    const pairItems: PrimitiveItem[] = []
    input.map((item: any) => {
      const di = d.getC().default()
      pairItems.push(encodeInnerToPrimitiveItem(di, item))
    })
    return pairItems
  } else if (d instanceof Tuple) {
    let primitiveTmp: Primitive = { prim: '', args: [] }
    const primitive: Primitive = { prim: '', args: [] }
    d.data.map((td, i) => {
      if (i % 2 === 0) primitiveTmp = { prim: '', args: [] }
      primitiveTmp.args.push(encodeInnerToPrimitiveItem(td, input[i]))
      if (primitiveTmp.args.length > 1) primitiveTmp.prim = 'Pair'
      if (primitiveTmp.args.length > 1 || !(d.data.length - 1 > i))
        primitive.args.push(primitiveTmp)
    })
    if (primitive.args.length > 1) primitive.prim = 'Pair'
    return primitive
  } else if (d instanceof Struct) {
    let primitiveTmp: Primitive = { prim: '', args: [] }
    const primitive: Primitive = { prim: '', args: [] }
    Object.keys(d.data).forEach((k, i) => {
      if (i % 2 === 0) primitiveTmp = { prim: '', args: [] }
      primitiveTmp.args.push(encodeInnerToPrimitiveItem(d.data[k], input[k]))
      if (primitiveTmp.args.length > 1) primitiveTmp.prim = 'Pair'
      if (primitiveTmp.args.length > 1 || !(Object.keys(d.data).length - 1 > i))
        primitive.args.push(primitiveTmp)
    })
    if (primitive.args.length > 1) primitive.prim = 'Pair'
    return primitive
  } else {
    throw AbiEncodeError.from(d)
  }
}

/**
 * decode layerd Micheline data
 * @param list decoded data list
 * @param arg Micheline data
 */
function decodeArgs(list: Array<any>, arg: any) {
  if (implementsPrimitive(arg)) {
    arg.args.map((item: any) => decodeArgs(list, item))
  } else if (arg instanceof Array) {
    arg.map((item: any) => list.push(item))
  } else {
    list.push(arg)
  }
}
export function decodeInner(d: Codable, input: any): Codable {
  if (d instanceof Integer) {
    d.setData(Number(input.int))
  } else if (d instanceof BigNumber) {
    d.setData(BigInt(input.string))
  } else if (d instanceof Address) {
    d.setData(input.string)
  } else if (d instanceof Bytes) {
    d.setData(Bytes.fromString(input.string).data)
  } else if (d instanceof List) {
    d.setData(
      input.map((item: any) => {
        const di = d.getC().default()
        decodeInner(di, item)
        return di
      })
    )
  } else if (d instanceof Tuple) {
    const list: Array<any> = []
    decodeArgs(list, input)
    d.setData(d.data.map((d, i) => decodeInner(d, list[i])))
  } else if (d instanceof Struct) {
    const list: Array<any> = []
    decodeArgs(list, input)

    const data: { [key: string]: Codable } = {}
    Object.keys(d.data).forEach((k, i) => {
      data[k] = decodeInner(d.data[k], list[i])
    })
    d.setData(data)
  } else {
    throw AbiDecodeError.from(d)
  }
  return d
}

const TzCoder: Coder = {
  /**
   * encode given codable object into Micheline string representation
   * @param input codable object to encode
   */
  encode(input: Codable): Bytes {
    const primitiveItem = encodeInnerToPrimitiveItem(input, input.raw)
    return encodeToMicheline(primitiveItem)
  },
  /**
   * decode given Micheline string into given codable object
   * @param d Codable object to represent into what type data is decoded
   * @param data Micheline string to decode
   */
  decode<T extends Codable>(d: T, data: Bytes): T {
    return decodeInner(d, JSON.parse(data.intoString())) as T
  }
}

export default TzCoder
