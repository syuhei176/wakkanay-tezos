import { TezosWalletFactory, IWallet, IWalletFactory } from '../../src/wallet'
import { Bytes } from '../../src/types/Codables'

describe('TezosWallet', () => {
  let factory: IWalletFactory, wallet: IWallet
  beforeEach(async () => {
    factory = new TezosWalletFactory()
    wallet = await factory.fromPrivateKey(
      'edskRpVqFG2FHo11aB9pzbnHBiPBWhNWdwtNyQSfEEhDf5jhFbAtNS41vg9as7LSYZv6rEbtJTwyyEg9cNDdcAkSr9Z7hfvquB'
    )
  })
  describe('signMessage', () => {
    it('succeed to sign hex string', async () => {
      const message = Bytes.fromHexString('0x00123456')
      const signature = await wallet.signMessage(message)
      expect(signature).toBeTruthy()
    })
  })
  describe('verifySignature', () => {
    it('succeed to verify signature', async () => {
      const message = Bytes.fromHexString('0x00123456')
      const signature = await wallet.signMessage(message)
      const publicKey = Bytes.fromString('edpkuuGJ4ssH3N5k7ovwkBe16p8rVX1XLENiZ4FAayrcwUf9sCKXnG')
      const verify = await wallet.verifySignature(message, signature, publicKey)
      expect(verify).toBeTruthy()
    })
    it('fail to verify signature', async () => {
      const bobWallet = await factory.fromPrivateKey(
        'edskS5pf29PwnxHN7P7UhyR5t8mKsh3CiH86mAKZZ9E3Y46d1AULDk4N9CxugkeD5UAGvL7UyXVFRptSy439YT1jvMoGA8GMoR'
      )
      const message = Bytes.fromHexString('0x00123456')
      const signature = await bobWallet.signMessage(message)
      const publicKey = Bytes.fromString('edpkuuGJ4ssH3N5k7ovwkBe16p8rVX1XLENiZ4FAayrcwUf9sCKXnG')
      const verify = await wallet.verifySignature(message, signature, publicKey)
      expect(verify).toBeFalsy()
    })
  })
  describe('getL1Balance', () => {
    it('succeed to get L1 balance', async () => {
      const balance = await wallet.getL1Balance()
      expect(balance).toBeTruthy()
    })
  })
})
