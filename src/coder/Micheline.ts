import { types } from 'wakkanay'
import Bytes = types.Bytes

export interface MichelinePrim {
  prim: string
  args: MichelinePrimItem[]
}
export interface MichelineNumber {
  number: number
}
export interface MichelineString {
  string: string
}
export type MichelinePrimItem =
  | MichelinePrim
  | MichelineNumber
  | MichelineString
  | any[]

const PRIM_PAIR_START = '{ "prim": "Pair", "args": [ '
const PRIM_PAIR_END = ' ] }'
const LIST_START = '[ '
const LIST_END = ' ]'

export function isMichelineString(arg: any): arg is MichelineString {
  return (
    arg !== null && typeof arg === 'object' && typeof arg.string === 'string'
  )
}
export function isMichelineNumber(arg: any): arg is MichelineNumber {
  return (
    arg !== null && typeof arg === 'object' && typeof arg.number === 'number'
  )
}
export function isMichelinePrim(arg: any): arg is MichelinePrim {
  return arg !== null && typeof arg === 'object' && typeof arg.args === 'object'
}

function encodeItemToMicheline(arg: MichelinePrimItem): string {
  if (isMichelineString(arg)) {
    return `{ "string": "${arg.string}" }`
  } else if (isMichelineNumber(arg)) {
    return `{ "int": "${arg.number}" }`
  } else if (isMichelinePrim(arg)) {
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

export function encodeToMicheline(pairItem: MichelinePrimItem): Bytes {
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
