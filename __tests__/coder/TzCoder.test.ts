import TzCoder from '../../src/coder/TzCoder'
import { types } from 'wakkanay'
import Address = types.Address
import Bytes = types.Bytes
import Integer = types.Integer
import BigNumber = types.BigNumber
import List = types.List
import Tuple = types.Tuple
import Struct = types.Struct

describe('TzCoder', () => {
  describe('encode', () => {
    test('encode Address', () => {
      const addr = Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va')
      expect(TzCoder.encode(addr).intoString()).toBe(
        '{"string":"tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va"}'
      )
    })

    test('encode BigNumber', () => {
      const addr = BigNumber.from(1)
      expect(TzCoder.encode(addr).intoString()).toBe('{"string":"1"}')
    })

    test('encode Struct', () => {
      const struct = Struct.from({
        num: Integer.from(5),
        addr: Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va'),
        greet: Bytes.fromString('hello')
      })
      expect(TzCoder.encode(struct).intoString()).toBe(
        '{"prim":"Pair","args":[{"prim":"Pair","args":[{"string":"tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va"},{"string":"hello"}]},{"int":"5"}]}'
      )
    })

    test('encode Tuple', () => {
      const tuple = Tuple.from([
        Integer.from(5),
        Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va'),
        Bytes.fromString('hello')
      ])
      expect(TzCoder.encode(tuple).intoString()).toBe(
        '{"prim":"Pair","args":[{"prim":"Pair","args":[{"int":"5"},{"string":"tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va"}]},{"string":"hello"}]}'
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
      expect(TzCoder.encode(list).intoString()).toBe(
        '[{"int":"1"},{"int":"2"},{"int":"3"}]'
      )
    })

    test('encode List of Struct', () => {
      const factory = {
        default: () =>
          Struct.from({
            num: Integer.default(),
            greet: Bytes.default()
          })
      }
      const list = List.from(factory, [
        Struct.from({
          num: Integer.from(1),
          greet: Bytes.fromString('hello')
        }),
        Struct.from({
          num: Integer.from(2),
          greet: Bytes.fromString('hello')
        })
      ])
      expect(TzCoder.encode(list).intoString()).toBe(
        '[{"prim":"Pair","args":[{"string":"hello"},{"int":"1"}]},{"prim":"Pair","args":[{"string":"hello"},{"int":"2"}]}]'
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
      expect(TzCoder.encode(list).intoString()).toBe(
        '[[{"int":"1"},{"int":"4"}],[{"int":"6"},{"int":"9"}]]'
      )
    })

    test('encode empty List', () => {
      const list = List.from(Bytes, [])
      expect(TzCoder.encode(list).intoString()).toBe('[]')
    })
  })

  describe('decode', () => {
    test('decode Address', () => {
      const b = Bytes.fromString(
        '{"string":"tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va"}'
      )
      expect(TzCoder.decode(Address.default(), b)).toStrictEqual(
        Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va')
      )
    })

    test('decode BigNumber', () => {
      const b = Bytes.fromString('{"string":"1"}')
      expect(TzCoder.decode(BigNumber.default(), b)).toStrictEqual(
        BigNumber.from(1)
      )
    })

    test('decode Struct', () => {
      const b = Bytes.fromString(
        '{"prim":"Pair","args":[{"prim":"Pair","args":[{"int": "5"},{"string":"tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va"}]},{"string":"hello"}]}'
      )
      const t = Struct.from({
        num: Integer.default(),
        addr: Address.default(),
        greet: Bytes.default()
      })
      expect(TzCoder.decode(t, b)).toStrictEqual(
        Struct.from({
          num: Integer.from(5),
          addr: Address.from('tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va'),
          greet: Bytes.from(new Uint8Array([104, 101, 108, 108, 111]))
        })
      )
    })

    test('decode Tuple', () => {
      const b = Bytes.fromString(
        '{"prim":"Pair","args":[{"prim":"Pair","args":[{"string":"tz1dwu9ayb7crnq4y2zajipdjfusvkhhs8va"},{"string":"hello"}]},{"int":"5"}]}'
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
      const b = Bytes.fromString('[{"int":"1"},{"int":"2"},{"int":"3"}]')
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
          Struct.from({
            num: Integer.default(),
            greet: Bytes.default()
          })
      }
      const b = Bytes.fromString(
        '[{"prim":"Pair","args":[{"int":"1"},{"string":"hello"}]},{"prim":"Pair","args":[{"int":"2"},{"string":"hello"}]}]'
      )
      const t = List.default(
        factory,
        Struct.from({
          num: Integer.default(),
          greet: Bytes.default()
        })
      )
      expect(TzCoder.decode(t, b)).toStrictEqual(
        List.from(factory, [
          Struct.from({
            num: Integer.from(1),
            greet: Bytes.fromString('hello')
          }),
          Struct.from({
            num: Integer.from(2),
            greet: Bytes.fromString('hello')
          })
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
      const b = Bytes.fromString(
        '[[{"int":"1"},{"int":"4"}],[{"int":"6"},{"int":"9"}]]'
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
