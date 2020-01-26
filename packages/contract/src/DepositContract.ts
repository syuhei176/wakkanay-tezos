import { TezosMessageUtils } from 'conseiljs'
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
import {
  MichelineBytes,
  MichelinePrim,
  removeBytesPrefix
} from '@cryptoeconomicslab/tezos-coder'
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
                                    bytes: `'${removeBytesPrefix(
                                      initialState.inputs[0]
                                    )}'`
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
                                bytes: `'${removeBytesPrefix(
                                  checkpoint.inputs[0]
                                )}'`
                              }
                            ]
                          },
                          {
                            prim: 'Elt',
                            args: [
                              { int: '1' },
                              {
                                bytes: `'${removeBytesPrefix(
                                  checkpoint.inputs[1]
                                )}'`
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
                                  {
                                    bytes: `'${removeBytesPrefix(
                                      exit.inputs[0]
                                    )}'`
                                  }
                                ]
                              },
                              {
                                prim: 'Elt',
                                args: [
                                  { int: '1' },
                                  {
                                    bytes: `'${removeBytesPrefix(
                                      exit.inputs[1]
                                    )}'`
                                  }
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
      /**
       * TODO: delete
       * NOTE: this is the image data
      const d = [
        // token type
        { bytes: '000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d' },
        // checkpoint id
        {
          bytes:
            '28f3a910172a1fd70d8d172600485c764c82761702e650e45448ca53c2135092'
        },
        // checkpoint
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
                        // token type address
                        bytes:
                          '050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
                      }
                    ]
                  },
                  {
                    prim: 'Elt',
                    // range
                    args: [{ int: '1' }, { bytes: '05070700020003' }]
                  },
                  // current block
                  { prim: 'Elt', args: [{ int: '2' }, { bytes: '050000' }] },
                  {
                    // property
                    prim: 'Elt',
                    args: [
                      { int: '3' },
                      {
                        bytes:
                          '0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d0200000025070400000a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
                      }
                    ]
                  }
                ],
                // predicateAddress
                { bytes: '000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d' }
              ]
            },
            // subrange
            { prim: 'Pair', args: [{ int: '3' }, { int: '2' }] }
          ]
        }
      ]
      */
      const checkpointId = log.values[1].bytes
      const checkpoint = log.values[2].args
      const stateUpdate = new Property(
        Address.from(
          TezosMessageUtils.readAddress(checkpoint[0].args[1].bytes)
        ),
        checkpoint[0].args[0].map((i: MichelinePrim) =>
          Bytes.fromHexString(
            // remove 05
            (i.args[1] as MichelineBytes).bytes.slice(2)
          )
        )
      )
      const subrange = new Range(
        BigNumber.fromString(checkpoint[1].args[1].int.toString()),
        BigNumber.fromString(checkpoint[1].args[0].int.toString())
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
