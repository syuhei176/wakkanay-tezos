import { Bytes } from '@cryptoeconomicslab/primitives'

export function removeBytesPrefix(bytes: Bytes): string {
  return bytes.toHexString().slice(2)
}
