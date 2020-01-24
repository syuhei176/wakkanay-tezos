import {
  Address,
  BigNumber,
  Bytes,
  Integer,
  Range
} from '@cryptoeconomicslab/primitives'
import { IDepositContract, EventLog } from '@cryptoeconomicslab/contract'
import { KeyValueStore } from '@cryptoeconomicslab/db'
import { Property } from '@cryptoeconomicslab/ovm'
import { ContractManager, TzWallet } from '@cryptoeconomicslab/tezos-wallet'
import EventWatcher, { EventType } from './events'

/**
 * TODO: add implementation
 */
export class DepositContract implements IDepositContract {
  private eventWatcher: EventWatcher
  private connection: ContractManager

  constructor(
    readonly address: Address,
    eventDb: KeyValueStore,
    wallet: TzWallet
  ) {
    this.connection = new ContractManager(wallet, address)
    this.eventWatcher = new EventWatcher({
      conseilServerInfo: wallet.conseilServerInfo,
      kvs: eventDb,
      contractAddress: address.data
    })
  }

  async deposit(amount: Integer, initialState: Property) {
    const param = {
      prim: 'Left',
      args: [
        {
          prim: 'Left',
          args: [
            {
              prim: 'Right',
              args: [
                {
                  prim: 'Pair',
                  args: [
                    {
                      prim: 'Pair',
                      args: [
                        { int: `'${amount}'` },
                        {
                          prim: 'Pair',
                          args: [
                            [
                              {
                                prim: 'Elt',
                                args: [
                                  { int: '0' },
                                  {
                                    bytes: `'${initialState.inputs[0].toHexString()}'`
                                  }
                                ]
                              }
                            ],
                            { string: `'${initialState.deciderAddress.data}'` }
                          ]
                        }
                      ]
                    },
                    { string: `'${'TOKEN_TYPE_ADDRESS'}'` }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    await this.connection.invokeContract(
      amount.data,
      'main',
      JSON.stringify(param)
    )
  }

  async finalizeCheckpoint(checkpoint: Property) {
    const param = {
      prim: 'Left',
      args: [
        {
          prim: 'Right',
          args: [
            {
              prim: 'Left',
              args: [
                {
                  prim: 'Pair',
                  args: [
                    {
                      prim: 'Pair',
                      args: [
                        [
                          {
                            prim: 'Elt',
                            args: [
                              { int: '0' },
                              {
                                bytes: `'${checkpoint.inputs[0].toHexString()}'`
                              }
                            ]
                          },
                          {
                            prim: 'Elt',
                            args: [
                              { int: '1' },
                              {
                                bytes: `'${checkpoint.inputs[1].toHexString()}'`
                              }
                            ]
                          }
                        ],
                        { string: `'${checkpoint.deciderAddress}'` }
                      ]
                    },
                    { string: `${'TOKEN_TYPE_ADDRESS'}` }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    await this.connection.invokeContract(0, 'main', JSON.stringify(param))
  }

  async finalizeExit(exit: Property, depositedRangeId: Integer) {
    const param = {
      prim: 'Left',
      args: [
        {
          prim: 'Right',
          args: [
            {
              prim: 'Right',
              args: [
                {
                  prim: 'Pair',
                  args: [
                    {
                      prim: 'Pair',
                      args: [
                        { int: `'${depositedRangeId.data}'` },
                        {
                          prim: 'Pair',
                          args: [
                            [
                              {
                                prim: 'Elt',
                                args: [
                                  { int: '0' },
                                  { bytes: `'${exit.inputs[0].toHexString()}'` }
                                ]
                              },
                              {
                                prim: 'Elt',
                                args: [
                                  { int: '1' },
                                  { bytes: `'${exit.inputs[1].toHexString()}'` }
                                ]
                              }
                            ],
                            { string: `'${exit.deciderAddress}'` }
                          ]
                        }
                      ]
                    },
                    { string: `${'TOKEN_TYPE_ADDRESS'}` }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    await this.connection.invokeContract(0, 'main', JSON.stringify(param))
  }

  subscribeCheckpointFinalized(
    handler: (checkpointId: Bytes, checkpoint: [Range, Property]) => void
  ) {
    this.eventWatcher.subscribe('CheckpointFinalized', (log: EventLog) => {
      // TODO: delete
      // NOTE: this is the image data
      // const d = [
      //   { string: 'TOKEN_TYPE_ADDRESS' },
      //   { bytes: 'CHECKPOINT_ID' },
      //   {
      //     prim: 'Pair',
      //     args: [
      //       {
      //         prim: 'Pair',
      //         args: [{ int: 0 }, { int: 1 }]
      //       },
      //       {
      //         prim: 'Pair',
      //         args: [
      //           { string: 'PREDICATE_ADDRESS' },
      //           [{ bytes: '' }, { bytes: '' }]
      //         ]
      //       }
      //     ]
      //   }
      // ]
      const checkpointId = log.values[1].string
      const checkpoint = log.values[2].args
      const stateUpdate = new Property(
        Address.from(checkpoint[1].args[0].string),
        checkpoint[1].args[1].map(i => Bytes.fromHexString(i.bytes))
      )
      const subrange = new Range(
        BigNumber.fromString(checkpoint[0].args[0].int.toString()),
        BigNumber.fromString(checkpoint[0].args[1].int.toString())
      )
      handler(Bytes.fromHexString(checkpointId), [subrange, stateUpdate])
    })
    this.eventWatcher.cancel()
    this.eventWatcher.start(() => {
      console.log('event polled')
    })
  }

  subscribeExitFinalized(handler: (exitId: Bytes) => void) {
    this.eventWatcher.subscribe(EventType.EXIT_FINALIZED, (log: EventLog) => {
      const [exitId] = log.values[1].string
      handler(Bytes.fromHexString(exitId))
    })
    this.eventWatcher.cancel()
    this.eventWatcher.start(() => {
      console.log('event polled')
    })
  }
}
