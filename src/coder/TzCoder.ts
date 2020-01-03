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
import flattenDeep from 'lodash.flattendeep'
import { AbiEncodeError, AbiDecodeError } from './Error'
import { MichelinePrimItems, isMichelinePrim } from './MichelineTypes'

function encodeToPair(
  codables: Codable[],
  input: Tuple[] | Struct[]
): MichelinePrimItems {
  if (codables.length === 0) {
    throw new Error('Input codables have to have at least one element')
  } else if (codables.length === 1) {
    return encodeInnerToMichelinePrimItems(codables[0], input[0])
  } else {
    const i = codables.length - 1
    return {
      prim: 'Pair',
      args: [
        encodeToPair(codables.slice(0, i), input.slice(0, i)),
        encodeInnerToMichelinePrimItems(codables[i], input[i])
      ]
    } as MichelinePrimItems
  }
}
export function encodeInnerToMichelinePrimItems(
  d: Codable,
  input: any
): MichelinePrimItems {
  if (d instanceof Integer) {
    return { int: input }
  } else if (d instanceof BigNumber) {
    return { string: input }
  } else if (d instanceof Address) {
    return { string: input }
  } else if (d instanceof Bytes) {
    return { string: Bytes.from(input).intoString() }
  } else if (d instanceof List) {
    return input.map((item: any) =>
      encodeInnerToMichelinePrimItems(d.getC().default(), item)
    )
  } else if (d instanceof Tuple) {
    return encodeToPair(d.data, input)
  } else if (d instanceof Struct) {
    return encodeToPair(
      Object.keys(d.data)
        .sort()
        .map(k => d.data[k]),
      Object.keys(d.data)
        .sort()
        .map(k => input[k])
    )
  } else {
    throw AbiEncodeError.from(d)
  }
}

/**
 * decode layerd Micheline data
 * @param list decoded data list
 * @param arg Micheline data
 */
function decodeArgs(arg: MichelinePrimItems): MichelinePrimItems[] {
  if (isMichelinePrim(arg)) {
    return flattenDeep(
      arg.args.map((item: MichelinePrimItems) => decodeArgs(item))
    )
  } else if (arg instanceof Array) {
    return arg.map((item: MichelinePrimItems) => item)
  } else {
    return [arg]
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
    const list: MichelinePrimItems[] = decodeArgs(input)
    d.setData(d.data.map((d, i) => decodeInner(d, list[i])))
  } else if (d instanceof Struct) {
    const list: MichelinePrimItems[] = decodeArgs(input)
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
    const michelinePrimItems = encodeInnerToMichelinePrimItems(input, input.raw)
    return Bytes.fromString(
      JSON.stringify(michelinePrimItems, function(key, val) {
        if (key === 'int') {
          return val.toString()
        } else {
          return val
        }
      })
    )
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
