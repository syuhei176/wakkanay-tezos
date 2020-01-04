import { Address } from 'wakkanay/dist/types/Codables'
import {
  OperationKindType,
  OperationResult,
  TezosConseilClient,
  TezosNodeWriter,
  TezosParameterFormat
} from 'conseiljs'
import { TzWallet } from '../wallet'

// TODO: research default limits per operation
export const DefaultTransactionStorageLimit = 300
export const DefaultTransactionGasLimit = 10600

export class ContractHelper {
  constructor(readonly tzWallet: TzWallet, readonly contractAddress: Address) {}

  /**
   * get optimal fee
   */
  public async estimateFee(
    operationKindType: OperationKindType = OperationKindType.Transaction
  ): Promise<number> {
    const result = await TezosConseilClient.getFeeStatistics(
      this.tzWallet.conseilServerInfo,
      this.tzWallet.conseilServerInfo.network,
      operationKindType
    )

    return result[0].medium
  }

  /**
   * invoke contract
   */
  public async invokeContract(
    amount: number,
    entrypoint: string,
    params: string,
    storageLimit: number = DefaultTransactionStorageLimit,
    gasLimit: number = DefaultTransactionGasLimit,
    parameterFormat: TezosParameterFormat = TezosParameterFormat.Micheline
  ): Promise<OperationResult> {
    // BIP44 Derivation Path if signed with hardware, empty if signed with software
    const derivationPath = ''

    const fee: number = await this.estimateFee()
    const result = await TezosNodeWriter.sendContractInvocationOperation(
      this.tzWallet.conseilServerInfo.url,
      this.tzWallet.keyStore,
      this.contractAddress.raw,
      amount,
      fee,
      derivationPath,
      storageLimit,
      gasLimit,
      entrypoint,
      params,
      parameterFormat
    )

    return result
  }
}
