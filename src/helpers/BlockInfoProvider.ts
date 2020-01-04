import { types } from 'wakkanay'
import Address = types.Address
import {
  OperationKindType,
  TezosConseilClient,
  ConseilServerInfo
} from 'conseiljs'

export class BlockInfoProvider {
  constructor(readonly conseilServerInfo: ConseilServerInfo) {}

  async estimateFee(
    operationKindType: OperationKindType = OperationKindType.Transaction
  ): Promise<number> {
    const result = await TezosConseilClient.getFeeStatistics(
      this.conseilServerInfo,
      this.conseilServerInfo.network,
      operationKindType
    )
    return result[0].medium
  }

  async getContractStorage(
    level: number,
    contractAddress: Address
  ): Promise<object> {
    // curl https://tezos-prod.cryptonomic-infra.tech/chains/main/blocks/765131/context/contracts/KT1PzYG3eUARDqJoK7kfUgz3R5LyTufXTPCf/storage
    // return {"prim":"Pair","args":[{"prim":"Pair","args":[{"string":"tz3bQSqnLF3SKXuddVTDj6z3N9zUqZp7BAnd"},{"prim":"Pair","args":[{"prim":"Pair","args":[{"int":"2899982"},{"int":"86400"}]},{"prim":"Pair","args":[[{"prim":"Pair","args":[{"string":"2019-12-18T02:22:45Z"},{"int":"3"}]}],[{"prim":"Pair","args":[{"string":"2019-12-18T02:26:45Z"},{"int":"100000"}]},{"prim":"Pair","args":[{"string":"2019-12-18T02:25:45Z"},{"int":"9"}]},{"prim":"Pair","args":[{"string":"2019-12-18T02:24:45Z"},{"int":"6"}]}]]}]}]},{"prim":"Pair","args":[{"string":"tz1XTGDcNE1LzSXxpFcpkFEWWcrtpjzYG7eX"},{"prim":"Pair","args":[{"int":"24"},{"int":"9"}]}]}]}
    throw Error('Not implemented')
  }
}
