import EventWatcher from '../../src/events/TzEventWatcher'
import { db, types } from 'wakkanay'
import { Address } from 'wakkanay/dist/types'
import { KeyValueStore } from 'wakkanay/dist/db'

describe('TzEventWatcher', () => {
  let kvs: KeyValueStore
  beforeEach(async () => {
    kvs = new db.InMemoryKeyValueStore(types.Bytes.default())
  })
  describe('poll', () => {
    it('succeed to poll events', async () => {
      const eventWatcher = new EventWatcher({
        conseilServerInfo: {
          url: 'https://tezos-dev.cryptonomic-infra.tech',
          apiKey: 'hooman',
          network: 'babylonnet'
        },
        kvs,
        contractAddress: 'KT1T2Zy4THwShihhqsaFWTubUVnFmjddHzew',
        options: { interval: 1000 }
      })
      await eventWatcher.poll(193552, 193555, () => {})
      // expect(signature).toBeTruthy()
    })
  })
})
