import TzCoder from '../../src/coder/TzCoder'
import { types } from 'wakkanay'
import Address = types.Address
import Bytes = types.Bytes
import Integer = types.Integer
import BigNumber = types.BigNumber
import List = types.List
import Tuple = types.Tuple
import Struct = types.Struct
import { TezosLanguageUtil } from 'conseiljs'

describe('TzCoder', () => {
  describe('encode', () => {
    test('encode Address', () => {
      const addr = Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va')
      expect(TzCoder.encode(addr).toHexString()).toBe(
        '0x0100000024747a31647775396179623763726e713479327a616a6970646a667573766b686873387661'
      )
    })

    test('encode BigNumber', () => {
      const addr = BigNumber.from(1)
      expect(TzCoder.encode(addr).toHexString()).toBe('0x010000000131')
    })

    test('encode Struct', () => {
      const struct = Struct.from([
        {
          key: 'addr',
          value: Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va')
        },
        { key: 'greet', value: Bytes.fromString('hello') },
        { key: 'num', value: Integer.from(5) }
      ])
      expect(TzCoder.encode(struct).toHexString()).toBe(
        '0x070707070100000024747a31647775396179623763726e713479327a616a6970646a667573766b686873387661010000000568656c6c6f0005'
      )
    })

    test('encode Tuple', () => {
      const tuple = Tuple.from([
        Integer.from(5),
        Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va'),
        Bytes.fromString('hello')
      ])
      expect(TzCoder.encode(tuple).toHexString()).toBe(
        '0x0707070700050100000024747a31647775396179623763726e713479327a616a6970646a667573766b686873387661010000000568656c6c6f'
      )
    })

    test('encode List of Integer', () => {
      const factory = {
        default: () => Integer.default()
      }
      const list = List.from(factory, [
        Integer.from(1),
        Integer.from(2),
        Integer.from(3)
      ])
      expect(TzCoder.encode(list).toHexString()).toBe(
        '0x0200000006000100020003'
      )
    })

    test('encode List of Struct', () => {
      const factory = {
        default: () =>
          Struct.from([
            { key: 'greet', value: Bytes.default() },
            { key: 'num', value: Integer.default() }
          ])
      }
      const list = List.from(factory, [
        Struct.from([
          { key: 'greet', value: Bytes.fromString('hello') },
          { key: 'num', value: Integer.from(1) }
        ]),
        Struct.from([
          { key: 'greet', value: Bytes.fromString('hello') },
          { key: 'num', value: Integer.from(2) }
        ])
      ])
      expect(TzCoder.encode(list).toHexString()).toBe(
        '0x020000001c0707010000000568656c6c6f00010707010000000568656c6c6f0002'
      )
    })

    test('encode List of List of Integer', () => {
      const childFactory = {
        default: () => Integer.default()
      }
      const factory = {
        default: () => List.from(childFactory, [])
      }
      const list = List.from(factory, [
        List.from(childFactory, [Integer.from(1), Integer.from(4)]),
        List.from(childFactory, [Integer.from(6), Integer.from(9)])
      ])
      expect(TzCoder.encode(list).toHexString()).toBe(
        '0x0200000012020000000400010004020000000400060009'
      )
    })

    test('encode empty List', () => {
      const list = List.from(Bytes, [])
      expect(TzCoder.encode(list).toHexString()).toBe('0x0200000000')
    })
  })

  describe('decode', () => {
    test('decode Address', () => {
      const b = Bytes.fromHexString(
        '0x0100000024747a31647775396179623763726e713479327a616a6970646a667573766b686873387661'
      )
      expect(TzCoder.decode(Address.default(), b)).toStrictEqual(
        Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va')
      )
    })

    test('decode BigNumber', () => {
      const b = Bytes.fromHexString('0x010000000131')
      expect(TzCoder.decode(BigNumber.default(), b)).toStrictEqual(
        BigNumber.from(1)
      )
    })

    test('decode Struct', () => {
      console.log(
        TezosLanguageUtil.hexToMicheline(
          '070707070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d010000000568656c6c6f0005'
        ).code
      )
      const b = Bytes.fromHexString(
        '0x070707070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d010000000568656c6c6f0005'
      )
      const t = Struct.from([
        { key: 'addr', value: Address.default() },
        { key: 'greet', value: Bytes.default() },
        { key: 'num', value: Integer.default() }
      ])
      expect(TzCoder.decode(t, b)).toStrictEqual(
        Struct.from([
          {
            key: 'addr',
            value: Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va')
          },
          {
            key: 'greet',
            value: Bytes.fromString('hello')
          },
          { key: 'num', value: Integer.from(5) }
        ])
      )
    })

    test('decode Tuple', () => {
      const b = Bytes.fromHexString(
        '0x0707070700050100000024747a31647775396179623763726e713479327a616a6970646a667573766b686873387661010000000568656c6c6f'
      )
      const t = Tuple.from([
        Address.default(),
        Bytes.default(),
        Integer.default()
      ])
      expect(TzCoder.decode(t, b)).toStrictEqual(
        Tuple.from([
          Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va'),
          Bytes.fromString('hello'),
          Integer.from(5)
        ])
      )
    })

    test('decode List of Integer', () => {
      const b = Bytes.fromHexString('0x0200000006000100020003')
      const t = List.default(Integer, Integer.default())
      expect(TzCoder.decode(t, b)).toStrictEqual(
        List.from(Integer, [Integer.from(1), Integer.from(2), Integer.from(3)])
      )
    })

    test('decode List of Tuple', () => {
      const factory = {
        default: () => Tuple.from([Integer.default(), Bytes.default()])
      }
      const b = Bytes.fromString(
        '[{"prim":"Pair","args":[{"int":"1"},{"string":"hello"}]},{"prim":"Pair","args":[{"int":"2"},{"string":"hello"}]}]'
      )
      const t = List.default(
        factory,
        Tuple.from([Integer.default(), Bytes.default()])
      )
      expect(TzCoder.decode(t, b)).toStrictEqual(
        List.from(factory, [
          Tuple.from([Integer.from(1), Bytes.fromString('hello')]),
          Tuple.from([Integer.from(2), Bytes.fromString('hello')])
        ])
      )
    })

    test('decode List of Struct', () => {
      const factory = {
        default: () =>
          Struct.from([
            { key: 'num', value: Integer.default() },
            { key: 'greet', value: Bytes.default() }
          ])
      }
      const b = Bytes.fromHexString(
        '0x020000001c0707010000000568656c6c6f00010707010000000568656c6c6f0002'
      )
      const t = List.default(
        factory,
        Struct.from([
          { key: 'num', value: Integer.default() },
          { key: 'greet', value: Bytes.default() }
        ])
      )
      expect(TzCoder.decode(t, b)).toStrictEqual(
        List.from(factory, [
          Struct.from([
            { key: 'num', value: Integer.from(1) },
            { key: 'greet', value: Bytes.fromString('hello') }
          ]),
          Struct.from([
            { key: 'num', value: Integer.from(2) },
            { key: 'greet', value: Bytes.fromString('hello') }
          ])
        ])
      )
    })

    test('decode List of List of Integer', () => {
      const childFactory = {
        default: () => Integer.default()
      }
      const factory = {
        default: () => List.from(childFactory, [])
      }
      const b = Bytes.fromHexString(
        '0x0200000012020000000400010004020000000400060009'
      )
      const t = List.default(
        factory,
        List.default(childFactory, Integer.default())
      )
      expect(TzCoder.decode(t, b)).toStrictEqual(
        List.from(factory, [
          List.from(childFactory, [Integer.from(1), Integer.from(4)]),
          List.from(childFactory, [Integer.from(6), Integer.from(9)])
        ])
      )
    })
  })
})
