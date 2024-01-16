import pgPromise from 'pg-promise';

interface User {
  wallet_address: string;
  last_claimed?: Date;
}

export class UserAPI {
  db: pgPromise.IDatabase<any>;

  constructor(db: pgPromise.IDatabase<any>) {
    this.db = db;

    this.initialize();
  }

  /**
   * Initialize (create user_wallets table if not exists)
   */
  async initialize(): Promise<void> {
    await this.db.none('CREATE TABLE IF NOT EXISTS user_wallets (user_id VARCHAR PRIMARY KEY, wallet_address VARCHAR NOT NULL, last_claimed TIMESTAMP)');
  }
  
  async getWalletAddress(userId: string): Promise<string | null> {
    const result = await this.db.oneOrNone<User>('SELECT wallet_address FROM user_wallets WHERE user_id = $1', [userId]);
    return result ? result.wallet_address : null;
  }

  async setWalletAddress(userId: string, walletAddress: string): Promise<void> {
    await this.db.none('INSERT INTO user_wallets (user_id, wallet_address) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET wallet_address = EXCLUDED.wallet_address', [userId, walletAddress]);
  }

  async setLastClaimed(userId: string): Promise<void> {
    await this.db.none('UPDATE user_wallets SET last_claimed = $1 WHERE user_id = $2', [new Date(), userId]);
  }

  async checkAlreadyClaimed(userId: string): Promise<boolean> {
    const result = await this.db.oneOrNone<User>('SELECT last_claimed FROM user_wallets WHERE user_id = $1', [userId]);
    const lastClaimed = result ? result.last_claimed : null;

    const hoursPassed = lastClaimed ? howManyHoursPassed(lastClaimed) : Infinity;

    return hoursPassed < 24;
  }
}

/**
 * Utils
 */

const howManyHoursPassed = (date: Date): number => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = diff / 1000 / 60 / 60;
  return hours
}
