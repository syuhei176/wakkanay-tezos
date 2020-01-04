export interface MichelineNumber {
  int: number
}
export interface MichelineString {
  string: string
}
export interface MichelinePrim {
  prim: string
  args: MichelinePrimItem[]
}
export type MichelinePrimItem =
  | MichelinePrim
  | MichelineNumber
  | MichelineString
export type MichelinePrimItems = MichelinePrimItem | MichelinePrimItem[]

export function isMichelinePrim(arg: any): arg is MichelinePrim {
  return arg !== null && typeof arg === 'object' && typeof arg.args === 'object'
}
