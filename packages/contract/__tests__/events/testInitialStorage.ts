import { MichelinePrim } from '@cryptoeconomicslab/tezos-coder'

// remove unnecessary array []
//
/**
 * {int: string} -> {int: number}
 * {"prim":"Pair","args":[{"prim":"Pair","args":[{"prim":"Pair","args":[[{"prim":"Elt","args":[{"string":"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV"},{"prim":"Pair","args":[{"prim":"Pair","args":[[{"prim":"Elt","args":[{"bytes":"0001"},{"prim":"Pair","args":[{"prim":"Pair","args":[{"prim":"Pair","args":[{"string":"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV"},{"int":"1"}]},{"prim":"Pair","args":[{"prim":"Pair","args":[[{"prim":"Elt","args":[{"int":"0"},{"string":"hoge"}]}],{"string":"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV"}]},{"prim":"Pair","args":[{"int":"1"},{"int":"1"}]}]}]},{"prim":"Pair","args":[{"int":"1"},{"int":"1"}]}]}]}],[{"prim":"Elt","args":[{"string":"hoge"},{"prim":"Pair","args":[{"prim":"Pair","args":[{"int":"1"},{"int":"1"}]},{"prim":"Pair","args":[[{"prim":"Elt","args":[{"int":"0"},{"string":"hoge"}]}],{"string":"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV"}]}]}]}]]},{"prim":"Pair","args":[[{"prim":"Elt","args":[{"int":"0"},{"prim":"Pair","args":[{"int":"0"},{"int":"0"}]}]}],{"int":"0"}]}]}]}],[{"prim":"Elt","args":[{"int":"0"},{"string":"root"}]}]]},{"prim":"Pair","args":[{"int":"0"},{"prim":"Pair","args":[[{"prim":"Elt","args":[{"string":"BlockSubmitted"},[{"prim":"Pair","args":[{"int":"0"},{"prim":"Right","args":[{"prim":"Pair","args":[{"int":"0"},{"string":"root"}]}]}]}]]}],{"string":"1970-01-01T00:00:01Z"}]}]}]},{"string":"tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV"}]}
 */
export const testEventStorage: MichelinePrim = {
  prim: 'Pair',
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
                                { bytes: '0001' },
                                {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      prim: 'Pair',
                                      args: [
                                        {
                                          prim: 'Pair',
                                          args: [
                                            {
                                              string:
                                                'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
                                            },
                                            { int: '1' }
                                          ]
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
                                                      { string: 'hoge' }
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
                                              args: [{ int: '1' }, { int: '1' }]
                                            }
                                          ]
                                        }
                                      ]
                                    },
                                    {
                                      prim: 'Pair',
                                      args: [{ int: '1' }, { int: '1' }]
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
                                { string: 'hoge' },
                                {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      prim: 'Pair',
                                      args: [{ int: '1' }, { int: '1' }]
                                    },
                                    {
                                      prim: 'Pair',
                                      args: [
                                        [
                                          {
                                            prim: 'Elt',
                                            args: [
                                              { int: '0' },
                                              { string: 'hoge' }
                                            ]
                                          }
                                        ],
                                        {
                                          string:
                                            'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV'
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        ]
                      },
                      {
                        prim: 'Pair',
                        args: [
                          [
                            {
                              prim: 'Elt',
                              args: [
                                { int: '0' },
                                {
                                  prim: 'Pair',
                                  args: [{ int: '0' }, { int: '0' }]
                                }
                              ]
                            }
                          ],
                          { int: '0' }
                        ]
                      }
                    ]
                  }
                ]
              }
            ],
            [{ prim: 'Elt', args: [{ int: '0' }, { string: 'root' }] }]
          ]
        },
        {
          prim: 'Pair',
          args: [
            { int: '0' },
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
                            {
                              prim: 'Right',
                              args: [
                                {
                                  prim: 'Pair',
                                  args: [{ int: '0' }, { string: 'root' }]
                                }
                              ]
                            }
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
    },
    { string: 'tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV' }
  ]
}
