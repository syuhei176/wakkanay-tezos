import { MichelinePrim } from '@cryptoeconomicslab/tezos-coder'

// remove unnecessary array []
/**
 * { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ [], { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ [ { "prim": "Elt", "args": [ { "int": "0" }, { "bytes": "010200000000" } ] } ], { "int": "0" } ] }, { "string": "tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" } ] } ] }, { "prim": "Pair", "args": [ [ { "prim": "Elt", "args": [ { "string": "tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ [ { "prim": "Elt", "args": [ { "bytes": "fe8d90f7c18f4ca33a92fe2ce1d93326314ccfecaebdb88c7a49b21e5cb80f21" }, { "prim": "Pair", "args": [ { "prim": "Pair", "args": [ [ { "prim": "Elt", "args": [ { "int": "0" }, { "bytes": "050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d" } ] }, { "prim": "Elt", "args": [ { "int": "1" }, { "bytes": "05070700000001" } ] }, { "prim": "Elt", "args": [ { "int": "2" }, { "bytes": "050000" } ] }, { "prim": "Elt", "args": [ { "int": "3" }, { "bytes": "0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d02000000210a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d" } ] } ], { "string": "tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" } ] }, { "prim": "Pair", "args": [ { "int": "1" }, { "int": "0" } ] } ] } ] } ], [ { "prim": "Elt", "args": [ { "int": "2" }, { "prim": "Pair", "args": [ { "int": "2" }, { "int": "0" } ] } ] } ] ] }, { "int": "2" } ] } ] } ], { "prim": "Pair", "args": [ [ { "prim": "Elt", "args": [ { "string": "BlockSubmitted" }, [ { "prim": "Pair", "args": [ { "int": "0" }, [ { "bytes": "010200000000" }, { "bytes": "010200000000" } ] ] } ] ] }, { "prim": "Elt", "args": [ { "string": "CheckpointFinalized" }, [ { "prim": "Pair", "args": [ { "int": "0" }, [ { "bytes": "010200000001" }, { "bytes": "010200000002" }, { "bytes": "010200000003" } ] ] } ] ] } ], { "string": "1970-01-01T00:00:01Z" } ] } ] } ] }
 */

export const testEventStorage: MichelinePrim = {
  prim: 'Pair',
  args: [
    {
      prim: 'Pair',
      args: [
        [],
        {
          prim: 'Pair',
          args: [
            {
              prim: 'Pair',
              args: [
                [
                  {
                    prim: 'Elt',
                    args: [{ int: '0' }, { bytes: '010200000000' }]
                  }
                ],
                { int: '0' }
              ]
            },
            { string: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV' }
          ]
        }
      ]
    },
    {
      prim: 'Pair',
      args: [
        [
          {
            prim: 'Elt',
            args: [
              { string: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV' },
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
                            {
                              bytes:
                                'fe8d90f7c18f4ca33a92fe2ce1d93326314ccfecaebdb88c7a49b21e5cb80f21'
                            },
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
                                            bytes:
                                              '050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
                                          }
                                        ]
                                      },
                                      {
                                        prim: 'Elt',
                                        args: [
                                          { int: '1' },
                                          { bytes: '05070700000001' }
                                        ]
                                      },
                                      {
                                        prim: 'Elt',
                                        args: [
                                          { int: '2' },
                                          { bytes: '050000' }
                                        ]
                                      },
                                      {
                                        prim: 'Elt',
                                        args: [
                                          { int: '3' },
                                          {
                                            bytes:
                                              '0507070a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d02000000210a0000001c050a00000016000053c1edca8bd5c21c61d6f1fd091fa51d562aff1d'
                                          }
                                        ]
                                      }
                                    ],
                                    {
                                      string:
                                        'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
                                    }
                                  ]
                                },
                                {
                                  prim: 'Pair',
                                  args: [{ int: '1' }, { int: '0' }]
                                }
                              ]
                            }
                          ]
                        }
                      ],
                      [
                        {
                          prim: 'Elt',
                          args: [
                            { int: '2' },
                            { prim: 'Pair', args: [{ int: '2' }, { int: '0' }] }
                          ]
                        }
                      ]
                    ]
                  },
                  { int: '2' }
                ]
              }
            ]
          }
        ],
        {
          prim: 'Pair',
          args: [
            [
              {
                prim: 'Elt',
                args: [
                  { string: 'BlockSubmitted' },
                  [
                    {
                      prim: 'Pair',
                      args: [
                        { int: '0' },
                        [{ bytes: '001' }, { bytes: '0100000004726f6f74' }]
                      ]
                    }
                  ]
                ]
              },
              {
                prim: 'Elt',
                args: [
                  { string: 'CheckpointFinalized' },
                  [
                    {
                      prim: 'Pair',
                      args: [
                        { int: '0' },
                        [
                          { bytes: '010200000001' },
                          { bytes: '010200000002' },
                          { bytes: '010200000003' }
                        ]
                      ]
                    }
                  ]
                ]
              }
            ],
            { string: '1970-01-01T00:00:01Z' }
          ]
        }
      ]
    }
  ]
}
