import { Address, Bytes } from '@cryptoeconomicslab/primitives'
import { decodeRawBytesToAddress, removeBytesPrefix } from '../src'

describe('Utils', () => {
  describe('decodeRawBytesToAddress', () => {
    it('succeed decodeRawBytesToAddress', () => {
      const bytes = Bytes.fromHexString(
        '050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
      )
      expect(decodeRawBytesToAddress(bytes)).toStrictEqual(
        Address.from('tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV')
      )
    })
  })

  describe('removeBytesPrefix', () => {
    it('succeed removeBytesPrefix', () => {
      const bytes = Bytes.fromHexString(
        '050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
      )
      expect(removeBytesPrefix(bytes)).toBe(
        '050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
      )
    })
  })
})
