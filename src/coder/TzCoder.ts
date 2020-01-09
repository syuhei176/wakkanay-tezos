import { coder, types } from 'wakkanay'
import Coder = coder.Coder
import Codable = types.Codable
import Bytes = types.Bytes
import List = types.List
import Tuple = types.Tuple
import Struct = types.Struct
import flattenDeep from 'lodash.flattendeep'
import { AbiEncodeError, AbiDecodeError } from './Error'
import { MichelinePrimItem, isMichelinePrim } from './MichelineTypes'

function encodeToPair(
  codables: Codable[],
  input: Tuple[] | Struct[]
): MichelinePrimItem {
  if (codables.length === 0) {
    throw new Error('Input codables have to have at least one element')
  } else if (codables.length === 1) {
    return encodeInnerToMichelinePrimItem(codables[0], input[0])
  } else {
    const i = codables.length - 1
    return {
      prim: 'Pair',
      args: [
        encodeToPair(codables.slice(0, i), input.slice(0, i)),
        encodeInnerToMichelinePrimItem(codables[i], input[i])
      ]
    } as MichelinePrimItem
  }
}
export function encodeInnerToMichelinePrimItem(
  d: Codable,
  input: any
): MichelinePrimItem {
  const c = d.constructor.name
  if (c === 'Integer') {
    return { int: input }
  } else if (c === 'BigNumber') {
    return { string: input }
  } else if (c === 'Address') {
    return { string: input }
  } else if (c === 'Bytes') {
    return { string: Bytes.from(input).intoString() }
  } else if (c === 'List') {
    return input.map((item: any) =>
      encodeInnerToMichelinePrimItem(
        (d as List<Codable>).getC().default(),
        item
      )
    )
  } else if (c === 'Tuple') {
    return encodeToPair((d as Tuple).data, input)
  } else if (c === 'Struct') {
    return encodeToPair((d as Struct).data.map(item => item.value), input)
  } else {
    throw AbiEncodeError.from(d)
  }
}

/**
 * decode layerd Micheline data
 * @param list decoded data list
 * @param arg Micheline data
 */
function decodeArgs(arg: MichelinePrimItem): MichelinePrimItem[] {
  if (isMichelinePrim(arg)) {
    return flattenDeep(
      arg.args.map((item: MichelinePrimItem) => decodeArgs(item))
    )
  } else if (arg instanceof Array) {
    return arg.map((item: MichelinePrimItem) => item)
  } else {
    return [arg]
  }
}
export function decodeInner(d: Codable, input: any): Codable {
  const c = d.constructor.name
  if (c === 'Integer') {
    d.setData(Number(input.int))
  } else if (c === 'BigNumber') {
    d.setData(BigInt(input.string))
  } else if (c === 'Address') {
    d.setData(input.string)
  } else if (c === 'Bytes') {
    d.setData(Bytes.fromString(input.string).data)
  } else if (c === 'List') {
    d.setData(
      input.map((item: any) => {
        const di = (d as List<Codable>).getC().default()
        decodeInner(di, item)
        return di
      })
    )
  } else if (c === 'Tuple') {
    const list: MichelinePrimItem[] = decodeArgs(input)
    d.setData((d as Tuple).data.map((di, i) => decodeInner(di, list[i])))
  } else if (c === 'Struct') {
    const list: MichelinePrimItem[] = decodeArgs(input)
    d.setData(
      (d as Struct).data.map(({ key, value }, i) => {
        return { key: key, value: decodeInner(value, list[i]) }
      })
    )
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
    const MichelinePrimItem = encodeInnerToMichelinePrimItem(input, input.raw)
    return Bytes.fromString(
      JSON.stringify(MichelinePrimItem, function(key, val) {
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
