export interface MichelineNumber {
  int: string
}
export interface MichelineString {
  string: string
}
export interface MichelineBytes {
  bytes: string
}
export interface MichelinePrim {
  prim: string
  args: MichelinePrimItem[]
}
export type MichelinePrimItem =
  | MichelinePrim[]
  | MichelinePrim
  | MichelineNumber
  | MichelineString
  | MichelineBytes

export function isMichelinePrim(arg: any): arg is MichelinePrim {
  return arg !== null && typeof arg === 'object' && typeof arg.args === 'object'
}
