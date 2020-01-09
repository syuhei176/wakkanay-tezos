import { db, events, types } from 'wakkanay'
import EventDb = events.EventDb
import KeyValueStore = db.KeyValueStore
import IEventWatcher = events.IEventWatcher
import EventHandler = events.EventHandler
import ErrorHandler = events.ErrorHandler
import CompletedHandler = events.CompletedHandler
import Address = types.Address
import Bytes = types.Bytes
import { ConseilServerInfo, TezosConseilClient, CryptoUtils } from 'conseiljs'
import { BlockInfoProvider, TezosBlockInfoProvider } from '../helpers'
import { MichelinePrim, MichelineString } from '../coder'

export interface EventWatcherOptions {
  interval: number
}

export type TezEventWatcherArgType = {
  conseilServerInfo: ConseilServerInfo
  kvs: KeyValueStore
  contractAddress: string
  options: EventWatcherOptions
  blockInfoProvider?: BlockInfoProvider
}

export default class EventWatcher implements IEventWatcher {
  public blockInfoProvider: BlockInfoProvider
  public eventDb: EventDb
  public checkingEvents: Map<string, EventHandler>
  public options: EventWatcherOptions
  public timer?: number
  public contractAddress: string

  constructor({
    conseilServerInfo,
    kvs,
    contractAddress,
    options,
    blockInfoProvider = new TezosBlockInfoProvider(conseilServerInfo)
  }: TezEventWatcherArgType) {
    this.blockInfoProvider = blockInfoProvider
    this.eventDb = new EventDb(kvs)
    this.checkingEvents = new Map<string, EventHandler>()
    this.options = {
      interval: 1000,
      ...options
    }
    this.contractAddress = contractAddress
  }

  public subscribe(event: string, handler: EventHandler) {
    // FIXME: add multiple handlers to one event
    this.checkingEvents.set(event, handler)
  }

  public unsubscribe(event: string, handler: EventHandler) {
    this.checkingEvents.delete(event)
  }

  public async start(handler: CompletedHandler, errorHandler?: ErrorHandler) {
    try {
      const block = await TezosConseilClient.getBlockHead(
        this.blockInfoProvider.conseilServerInfo,
        this.blockInfoProvider.conseilServerInfo.network
      )
      // TODO: enter the topic
      // ethereum topic is the contract address
      const latestBlock = await this.eventDb.getLastLoggedBlock(
        Bytes.fromString('topic')
      )
      await this.poll(latestBlock + 1, block.level, handler)
    } catch (e) {
      console.log(e)
      if (errorHandler) {
        errorHandler(e)
      }
    }
    this.timer = window.setTimeout(async () => {
      await this.start(handler, errorHandler)
    }, this.options.interval)
  }

  public cancel() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  public async poll(
    fromBlockNumber: number,
    blockNumber: number,
    completedHandler: CompletedHandler
  ) {
    for (let i = fromBlockNumber; i < blockNumber; i++) {
      const storage = await this.blockInfoProvider.getContractStorage(
        i,
        this.contractAddress
      )
      const events = this.parseStorage(storage)
      events
        .filter(async e => {
          const seen = await this.eventDb.getSeen(this.getHash(e))
          return !seen
        })
        .map(e => {
          const eventName = (e.args[0] as MichelineString).string
          const handler = this.checkingEvents.get(eventName)
          if (handler) {
            handler({
              name: eventName,
              values: e.args[1]
            })
          }
          this.eventDb.addSeen(this.getHash(e))
          return true
        })
    }
    await this.eventDb.setLastLoggedBlock(
      Bytes.fromString(this.contractAddress.toString()),
      blockNumber
    )
    completedHandler()
  }

  /**
   * parse storage to get events_storage scope
   * @param storage
   */
  private parseStorage(storage: MichelinePrim): MichelinePrim[] {
    const events = (((storage.args[0] as MichelinePrim)
      .args[1] as MichelinePrim).args[1] as MichelinePrim).args
    return events[0] as MichelinePrim[]
  }

  private getHash(e: MichelinePrim): Bytes {
    return Bytes.from(
      Uint8Array.from(
        CryptoUtils.simpleHash(Buffer.from(JSON.stringify(e), 'utf8'), 12)
      )
    )
  }
}
