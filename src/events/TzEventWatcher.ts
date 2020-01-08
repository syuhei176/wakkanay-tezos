import { db, events, types } from 'wakkanay'
import EventDb = events.EventDb
import KeyValueStore = db.KeyValueStore
import IEventWatcher = events.IEventWatcher
import EventHandler = events.EventHandler
import ErrorHandler = events.ErrorHandler
import CompletedHandler = events.CompletedHandler
import Address = types.Address
import Bytes = types.Bytes
import { ConseilServerInfo, TezosConseilClient } from 'conseiljs'
import { BlockInfoProvider } from '../helpers'

export interface EventWatcherOptions {
  interval: number
}

export type TezEventWatcherArgType = {
  conseilServerInfo: ConseilServerInfo
  kvs: KeyValueStore
  contractAddress: string
  options: EventWatcherOptions
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
    options
  }: TezEventWatcherArgType) {
    this.blockInfoProvider = new BlockInfoProvider(conseilServerInfo)
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
    const events = await this.blockInfoProvider.getContractStorage(
      fromBlockNumber,
      blockNumber,
      this.contractAddress
    )
    console.log(events)
    // for (let i = fromBlockNumber; i < blockNumber; i++) {
    // TODO: filter the events
    /**
      const filtered = events
        .filter(async e => {
          if (e.transactionHash) {
            const seen = await this.eventDb.getSeen(
              Bytes.fromHexString(e.transactionHash)
            )
            return !seen
          } else {
            return false
          }
        })
        .map(e => {
          const logDesc = this.contractInterface.parseLog(e)
          const handler = this.checkingEvents.get(logDesc.name)
          if (handler) {
            handler(logDesc)
          }
          if (e.transactionHash) {
            this.eventDb.addSeen(Bytes.fromHexString(e.transactionHash))
          }
          return true
        })
      */
    //}
    await this.eventDb.setLastLoggedBlock(
      Bytes.fromString(this.contractAddress.toString()),
      blockNumber
    )
    completedHandler()
  }
}
