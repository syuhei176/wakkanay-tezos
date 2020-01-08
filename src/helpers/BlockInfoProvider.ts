import { types } from 'wakkanay'
import Address = types.Address
import {
  OperationKindType,
  TezosConseilClient,
  ConseilServerInfo,
  ConseilQueryBuilder,
  ConseilOperator,
  TezosMessageUtils
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
    fromLevel: number,
    toLevel: number,
    contractAddress: string
  ): Promise<object> {
    let sendQuery = ConseilQueryBuilder.blankQuery()
    sendQuery = ConseilQueryBuilder.addPredicate(
      sendQuery,
      'account_id',
      ConseilOperator.EQ,
      [
        TezosMessageUtils.readAddress(
          TezosMessageUtils.writeAddress(contractAddress)
        )
      ],
      false
    )
    sendQuery = ConseilQueryBuilder.addPredicate(
      sendQuery,
      'block_level',
      ConseilOperator.GT,
      [fromLevel],
      false
    )
    sendQuery = ConseilQueryBuilder.addPredicate(
      sendQuery,
      'block_level',
      ConseilOperator.LT,
      [toLevel],
      false
    )
    const result = await TezosConseilClient.getTezosEntityData(
      this.conseilServerInfo,
      this.conseilServerInfo.network,
      'accounts',
      sendQuery
    )
    return result
    // curl https://tezos-dev.cryptonomic-infra.tech/chains/main/blocks/193552/context/contracts/KT1T2Zy4THwShihhqsaFWTubUVnFmjddHzew/storage
    // return {"prim":"Pair","args":[{"prim":"Pair","args":[{"string":"tz3bQSqnLF3SKXuddVTDj6z3N9zUqZp7BAnd"},{"prim":"Pair","args":[{"prim":"Pair","args":[{"int":"2899982"},{"int":"86400"}]},{"prim":"Pair","args":[[{"prim":"Pair","args":[{"string":"2019-12-18T02:22:45Z"},{"int":"3"}]}],[{"prim":"Pair","args":[{"string":"2019-12-18T02:26:45Z"},{"int":"100000"}]},{"prim":"Pair","args":[{"string":"2019-12-18T02:25:45Z"},{"int":"9"}]},{"prim":"Pair","args":[{"string":"2019-12-18T02:24:45Z"},{"int":"6"}]}]]}]}]},{"prim":"Pair","args":[{"string":"tz1XTGDcNE1LzSXxpFcpkFEWWcrtpjzYG7eX"},{"prim":"Pair","args":[{"int":"24"},{"int":"9"}]}]}]}
    // throw Error('Not implemented')
  }
}
