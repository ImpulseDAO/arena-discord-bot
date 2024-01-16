const { UserAPI } = require('./user');
require('dotenv').config({ path: './.env.test' });
const  pgPromise = require('pg-promise')

const { connectionString } = require('../../dbConfig')
const db = pgPromise()(connectionString)

/**
 * @type {UserAPI}
 */
let userApi

beforeAll(async () => {
  await db.connect().catch(error => {
    console.error('Error connecting to db:', error);
  })
  console.log('Successfully connected to db');
  await db.none('CREATE TABLE IF NOT EXISTS user_wallets (user_id VARCHAR PRIMARY KEY, wallet_address VARCHAR NOT NULL, last_claimed TIMESTAMP)');
});

afterAll(async () => {
  await db.none('DROP TABLE IF EXISTS user_wallets');
});

it('creates class instance', async () => {
  userApi = new UserAPI(db)
  expect(userApi).toBeDefined();
  expect(userApi.getWalletAddress).toBeDefined()
  expect(userApi.setWalletAddress).toBeDefined()
  expect(userApi.setLastClaimed).toBeDefined()
  expect(userApi.checkAlreadyClaimed).toBeDefined()
})

describe('Wallet Functions', () => {
  beforeEach(async () => {
    await db.none('TRUNCATE TABLE user_wallets');
  });

  it('gets wallet address', async () => {
    const userId = 'user1';
    const expectedWalletAddress = '0x123';
    await db.none('INSERT INTO user_wallets (user_id, wallet_address) VALUES ($1, $2)', [userId, expectedWalletAddress]);

    const walletAddress = await userApi.getWalletAddress(userId);

    expect(walletAddress).toEqual(expectedWalletAddress);
  });

  describe('sets wallet address', () => {
    const userId = 'user2';
    
    it('sets once', async () => {
      const walletAddress_1 = '0x456';
      await userApi.setWalletAddress(userId, walletAddress_1);
      const result = await db.one('SELECT wallet_address FROM user_wallets WHERE user_id = $1', [userId]);

      expect(result.wallet_address).toEqual(walletAddress_1);
    })

    it('re-sets', async () => {
      const walletAddress_2 = '0x123';
      await userApi.setWalletAddress(userId, walletAddress_2);
      const result = await db.one('SELECT wallet_address FROM user_wallets WHERE user_id = $1', [userId]);

      expect(result.wallet_address).toEqual(walletAddress_2);
    })
  });

  it('sets last claimed date and checks claim status', async () => {
    const userId = 'user3';
    await db.none('INSERT INTO user_wallets (user_id, wallet_address) VALUES ($1, $2)', [userId, '0x789']);

    await userApi.setLastClaimed(userId);
    const result = await db.one('SELECT last_claimed FROM user_wallets WHERE user_id = $1', [userId]);

    expect(result.last_claimed).toBeDefined();

    const alreadyClaimed = await userApi.checkAlreadyClaimed(userId);
    expect(alreadyClaimed).toBe(true);
  });

});
