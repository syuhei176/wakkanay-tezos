import { Coder } from 'wakkanay/dist/coder/Coder'
import {
  Codable,
  Address,
  Bytes,
  Integer,
  List,
  Tuple,
  Struct
} from 'wakkanay/dist/types/Codables'
import { AbiEncodeError, AbiDecodeError } from './Error'

const PRIM_PAIR_START = '{ "prim": "Pair", "args": [ '
const PRIM_PAIR_END = ' ] }'
function hasNext(i: number, length: number): boolean {
  return length - 1 > i
}
/**
 * encode object in List / Tuple / Struct
 * allocate input data in the order of an object
 * @param length Codable data length
 * @param i current index of Codable data
 * @param d Codable of inner data
 * @param input inner data
 * @param isList whether Codable data is List or not
 */
function encodeLayer(
  length: number,
  i: number,
  d: Codable,
  input: any,
  isList = false
): string {
  let code = ''
  if (i === 0) code += PRIM_PAIR_START
  if (!isList && hasNext(i, length) && i % 2 === 0) code += PRIM_PAIR_START
  code += encodeInner(d, input).intoString()
  if (!isList && i % 2 === 1) code += PRIM_PAIR_END
  if (hasNext(i, length)) {
    code += ', '
  } else {
    code += PRIM_PAIR_END
  }
  return code
}
export function encodeInner(d: Codable, input: any): Bytes {
  let b: Bytes = Bytes.default()
  if (d instanceof Integer) {
    b = Bytes.fromString(`{ "int": "${input}" }`)
  } else if (d instanceof Address) {
    b = Bytes.fromString(`{ "string": "${input}" }`)
  } else if (d instanceof Bytes) {
    b = Bytes.fromString(`{ "string": "${Bytes.from(input).intoString()}" }`)
  } else if (d instanceof List) {
    let code = ''
    input.map((ld: any, i: number) => {
      const di = d.getC().default()
      code += encodeLayer(d.data.length, i, di, ld, true)
    })
    b = Bytes.fromString(code)
  } else if (d instanceof Tuple) {
    let code = ''
    d.data.map((td, i) => {
      code += encodeLayer(d.data.length, i, td, input[i])
    })
    b = Bytes.fromString(code)
  } else if (d instanceof Struct) {
    let code = ''
    Object.keys(d.data).forEach((k, i) => {
      code += encodeLayer(Object.keys(d.data).length, i, d.data[k], input[k])
    })
    b = Bytes.fromString(code)
  } else {
    throw AbiEncodeError.from(d)
  }
  return b
}

/**
 * decode inner list
 * split a list to make up the number
 * allocate input data in the order of an object
 * @param d Codable data
 * @param l all input data list
 * @param length length each data
 */
function decodeInnerList(d: List<any>, l: Array<any>, length: number) {
  const sl: Array<any> = []
  const i = 0
  while (i < l.length) {
    sl.push(l.splice(i, i + length))
  }
  d.setData(
    sl.map((i: any) => {
      const target: Codable = d.getC().default()
      decodeInner(target, i)
      return target
    })
  )
}
/**
 * decode layerd Micheline data
 * @param l decoded data list
 * @param args Micheline data
 */
function decodeArgs(l: Array<any>, args: any) {
  if (args.prim && args.prim === 'Pair') {
    args.args.map((a: any) => decodeArgs(l, a))
  } else {
    if (args.length) {
      args.map((a: any) => l.push(a))
    } else {
      l.push(args)
    }
  }
}
export function decodeInner(d: Codable, input: any): Codable {
  if (d instanceof Integer) {
    d.setData(Number(input.int))
  } else if (d instanceof Address) {
    d.setData(input.string)
  } else if (d instanceof Bytes) {
    d.setData(Bytes.fromString(input.string).data)
  } else if (d instanceof List) {
    const l: Array<any> = []
    decodeArgs(l, input)

    const di: Codable = d.getC().default()
    if (di instanceof Tuple) {
      decodeInnerList(d, l, di.data.length)
    } else if (di instanceof Struct) {
      decodeInnerList(d, l, Object.keys(di.data).length)
    } else if (di instanceof List) {
      // TODO: support list in list pattern
    } else {
      d.setData(
        l.map((i: any) => {
          const target: Codable = d.getC().default()
          decodeInner(target, i)
          return target
        })
      )
    }
  } else if (d instanceof Tuple) {
    const l: Array<any> = []
    decodeArgs(l, input)
    d.setData(d.data.map((d, i) => decodeInner(d, l[i])))
  } else if (d instanceof Struct) {
    const l: Array<any> = []
    decodeArgs(l, input)

    const data: { [key: string]: Codable } = {}
    Object.keys(d.data).forEach((k, i) => {
      data[k] = decodeInner(d.data[k], l[i])
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
    return encodeInner(input, input.raw)
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
