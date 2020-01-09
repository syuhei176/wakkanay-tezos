import { BlockInfoProvider } from '../../src/helpers/BlockInfoProvider'
import { ConseilServerInfo } from 'conseiljs'
import { MichelinePrim } from '../../src/coder'
import { testEventStorage } from './testInitialStorage'

export class MockBlockInfoProvider implements BlockInfoProvider {
  constructor(readonly conseilServerInfo: ConseilServerInfo) {}

  async getContractStorage(
    level: number,
    contractAddress: string
  ): Promise<MichelinePrim> {
    return testEventStorage
  }
}
