import { Address, Bytes } from '@cryptoeconomicslab/primitives'
import { TezosLanguageUtil, TezosMessageUtils } from 'conseiljs'

export function removeBytesPrefix(bytes: Bytes, length = 2): string {
  return bytes.toHexString().slice(length)
}

// TODO: move to coder
export function decodeRawBytesToAddress(bytes: Bytes): Address {
  return Address.from(
    TezosMessageUtils.readAddress(
      JSON.parse(
        TezosLanguageUtil.hexToMicheline(
          // remove 0x05
          removeBytesPrefix(bytes, 4)
        ).code
      ).bytes
    )
  )
}
