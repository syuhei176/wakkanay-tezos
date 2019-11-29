import TzCoder from '../../src/coder/TzCoder'
import {
  Address,
  Bytes,
  Integer,
  List,
  Tuple,
  Struct
} from 'wakkanay/dist/types/Codables'

describe('TzCoder', () => {
  describe('encode', () => {
    test('encode Struct', () => {
      const struct = Struct.from({
        num: Integer.from(5),
        addr: Address.from('0x0472ec0185ebb8202f3d4ddb0226998889663cf2'),
        greet: Bytes.fromString('hello')
      })
      expect(TzCoder.encode(struct).intoString()).toBe(
        '{ "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "5" }, { "string": "0x0472ec0185ebb8202f3d4ddb0226998889663cf2" } ] }, { "string": "hello" } ] }'
      )
    })

    test('encode Tuple', () => {
      const tuple = Tuple.from([
        Integer.from(5),
        Address.from('0x0472ec0185ebb8202f3d4ddb0226998889663cf2'),
        Bytes.fromString('hello')
      ])

      expect(TzCoder.encode(tuple).intoString()).toBe(
        '{ "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "5" }, { "string": "0x0472ec0185ebb8202f3d4ddb0226998889663cf2" } ] }, { "string": "hello" } ] }'
      )
    })

    test('encode List of Integer', () => {
      const factory = {
        default: () => Integer.default()
      }
      const list = List.from(factory, [
        Integer.from(1),
        Integer.from(2),
        Integer.from(3),
        Integer.from(4),
        Integer.from(5)
      ])

      expect(TzCoder.encode(list).intoString()).toBe(
        '{ "prim": "Pair", "args": [ { "int": "1" }, { "int": "2" }, { "int": "3" }, { "int": "4" }, { "int": "5" } ] }'
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
        }),
        Struct.from({
          num: Integer.from(3),
          greet: Bytes.fromString('hello')
        }),
        Struct.from({
          num: Integer.from(4),
          greet: Bytes.fromString('hello')
        }),
        Struct.from({
          num: Integer.from(5),
          greet: Bytes.fromString('hello')
        })
      ])

      expect(TzCoder.encode(list).intoString()).toBe(
        '{ "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "1" }, { "string": "hello" } ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "2" }, { "string": "hello" } ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "3" }, { "string": "hello" } ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "4" }, { "string": "hello" } ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "5" }, { "string": "hello" } ] } ] } ] }'
      )
    })

    test('encode empty List', () => {
      const list = List.from(Bytes, [])

      expect(TzCoder.encode(list).intoString()).toBe('')
    })
  })

  describe('decode', () => {
    test('decode Struct', () => {
      const b = Bytes.fromString(
        '{ "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "5" }, { "string": "0x0472ec0185ebb8202f3d4ddb0226998889663cf2" } ] }, { "string": "hello" } ] }'
      )
      const t = Struct.from({
        num: Integer.default(),
        addr: Address.default(),
        greet: Bytes.default()
      })

      expect(TzCoder.decode(t, b)).toStrictEqual(
        Struct.from({
          num: Integer.from(5),
          addr: Address.from('0x0472ec0185ebb8202f3d4ddb0226998889663cf2'),
          greet: Bytes.from(new Uint8Array([104, 101, 108, 108, 111]))
        })
      )
    })

    test('decode Tuple', () => {
      const b = Bytes.fromString(
        '{ "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "string": "0x0472ec0185ebb8202f3d4ddb0226998889663cf2" }, { "string": "hello" } ] }, { "int": "5" } ] }'
      )
      const t = Tuple.from([
        Address.default(),
        Bytes.default(),
        Integer.default()
      ])

      expect(1).toBeTruthy()
      expect(TzCoder.decode(t, b)).toStrictEqual(
        Tuple.from([
          Address.from('0x0472ec0185ebb8202f3d4ddb0226998889663cf2'),
          Bytes.fromString('hello'),
          Integer.from(5)
        ])
      )
    })

    test('decode List of Integer', () => {
      const b = Bytes.fromString(
        '{ "prim": "Pair", "args": [ { "int": "1" },{ "int": "2" },{ "int": "3" },{ "int": "4" },{ "int": "5" } ] }'
      )
      const t = List.default(Integer, Integer.default())

      expect(TzCoder.decode(t, b)).toStrictEqual(
        List.from(Integer, [
          Integer.from(1),
          Integer.from(2),
          Integer.from(3),
          Integer.from(4),
          Integer.from(5)
        ])
      )
    })

    test('decode List of Tuple', () => {
      const factory = {
        default: () => Tuple.from([Integer.default(), Bytes.default()])
      }
      const b = Bytes.fromString(
        '{ "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "1" }, { "string": "hello" } ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "2" }, { "string": "hello" } ] } ] } ] }'
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
        '{ "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "1" }, { "string": "hello" } ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "2" }, { "string": "hello" } ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "3" }, { "string": "hello" } ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "4" }, { "string": "hello" } ] } ] }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ { "int": "5" }, { "string": "hello" } ] } ] } ] }'
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
          }),
          Struct.from({
            num: Integer.from(3),
            greet: Bytes.fromString('hello')
          }),
          Struct.from({
            num: Integer.from(4),
            greet: Bytes.fromString('hello')
          }),
          Struct.from({
            num: Integer.from(5),
            greet: Bytes.fromString('hello')
          })
        ])
      )
    })
  })
})
