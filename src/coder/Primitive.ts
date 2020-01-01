import { types } from 'wakkanay'
import Bytes = types.Bytes

export interface Primitive {
  prim: string
  args: PrimitiveItem[]
}
export interface PrimitiveNumber {
  number: number
}
export interface PrimitiveString {
  string: string
}
export type PrimitiveItem =
  | Primitive
  | PrimitiveNumber
  | PrimitiveString
  | any[]

const PRIM_PAIR_START = '{ "prim": "Pair", "args": [ '
const PRIM_PAIR_END = ' ] }'
const LIST_START = '[ '
const LIST_END = ' ]'

export function implementsString(arg: any): arg is PrimitiveString {
  return (
    arg !== null && typeof arg === 'object' && typeof arg.string === 'string'
  )
}
export function implementsNumber(arg: any): arg is PrimitiveNumber {
  return (
    arg !== null && typeof arg === 'object' && typeof arg.number === 'number'
  )
}
export function implementsPrimitive(arg: any): arg is Primitive {
  return arg !== null && typeof arg === 'object' && typeof arg.args === 'object'
}

function encodeItemToMicheline(arg: PrimitiveItem): string {
  if (implementsString(arg)) {
    return `{ "string": "${arg.string}" }`
  } else if (implementsNumber(arg)) {
    return `{ "int": "${arg.number}" }`
  } else if (implementsPrimitive(arg)) {
    let code = ''
    arg.args.map((item: any, i: number) => {
      if (arg.args.length - 1 > i && arg.prim === 'Pair')
        code += PRIM_PAIR_START
      code += encodeItemToMicheline(item)

      if (arg.args.length - 1 > i) {
        code += ', '
      } else if (!(arg.args.length - 1 > i) && arg.prim === 'Pair') {
        code += PRIM_PAIR_END
      }
    })
    return code
  } else {
    throw Error(`Type does not exist ${JSON.stringify(arg)}`)
  }
}

export function encodeToMicheline(pairItem: PrimitiveItem): Bytes {
  let code = ''
  if (pairItem instanceof Array) {
    const length = pairItem.length
    code += LIST_START
    pairItem.map((item, i) => {
      if (item instanceof Array) {
        code += encodeToMicheline(item).intoString()
      } else {
        code += encodeItemToMicheline(item)
      }
      if (length - 1 > i) code += ', '
    })
    code += LIST_END
  } else {
    code += encodeItemToMicheline(pairItem)
  }
  return Bytes.fromString(code)
}
