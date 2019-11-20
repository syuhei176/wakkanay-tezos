import { Bytes } from 'wakkanay/dist/types/Codables'
import { contract } from 'wakkanay'
import ICommitmentContract = contract.ICommitmentContract
import { ContractHelper } from '../helpers'

export class CommitmentContract implements ICommitmentContract {
  constructor(readonly connection: ContractHelper) {}

  /**
   * submit block
   */
  async submit(blockNumber: number, root: Bytes) {
    const amount = 0
    const entrypoint = 'main'
    const params = `Submit(
      record
        block_number = ${blockNumber};
        block_number_string = ${blockNumber.toString()};
        root = ${root.toHexString()};
      end
    )`

    await this.connection.invokeContract(amount, entrypoint, params)
  }

  /**
   * TODO: implement getBlock and getCurrentBlock after TzCoder
   */
}
