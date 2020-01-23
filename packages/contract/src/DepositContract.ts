import { Address, Bytes, Integer, Range } from '@cryptoeconomicslab/primitives'
import { IDepositContract } from '@cryptoeconomicslab/contract'
import { Property } from '@cryptoeconomicslab/ovm'

/**
 * TODO: add implementation
 */
export class DepositContract implements IDepositContract {
  constructor(readonly address: Address) {}

  async deposit(amount: Integer, initialState: Property): Promise<void> {
    throw new Error('Not implemented')
  }
  async finalizeCheckpoint(checkpoint: Property): Promise<void> {
    throw new Error('Not implemented')
  }
  async finalizeExit(exit: Property, depositedRangeId: Integer): Promise<void> {
    throw new Error('Not implemented')
  }
  subscribeCheckpointFinalized(
    handler: (checkpointId: Bytes, checkpoint: [Range, Property]) => void
  ) {
    throw new Error('Not implemented')
  }
  subscribeExitFinalized(handler: (exitId: Bytes) => void) {
    throw new Error('Not implemented')
  }
}
