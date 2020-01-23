import { Codable } from '@cryptoeconomicslab/primitives'

class CoderError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'AbiError'
  }
}

export class AbiEncodeError extends CoderError {
  static from(codable: Codable): AbiEncodeError {
    return new AbiEncodeError(`Cannot encode object: ${codable.toString()}`)
  }
}

export class AbiDecodeError extends CoderError {
  static from(codable: Codable): AbiDecodeError {
    return new AbiDecodeError(`Cannot decode object: ${codable.toString()}`)
  }
}
