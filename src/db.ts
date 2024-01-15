import pgp from 'pg-promise'

const db = pgp()(`postgres://kirill:qwer1234@localhost:5432/${process.env['DB_NAME']}`)

type UserId = string
type WalletAddress = `0x${string}` | string // it accepts both decoded and encoded addresses

const mapUserIdToWalletAddress: Record<UserId, {
  walletAddress: WalletAddress,
  lastClaimed?: Date
} | undefined> = {} 
  
export const getWalletAddress = (userId: string) => {
  const userInfo = mapUserIdToWalletAddress[userId]
  return userInfo?.walletAddress
}

export const setWalletAddress = (userId: string, walletAddress: string) => {
  console.log('setUserWalletAddress', userId, walletAddress)

  mapUserIdToWalletAddress[userId] = {
    walletAddress,
    lastClaimed: undefined
  }
}

const howManyHoursPassed = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / 1000 / 60 / 60)
  return hours
}

export const setLastClaimed = (userId: string) => {
  const userInfo = mapUserIdToWalletAddress[userId]
  if (userInfo) {
    userInfo.lastClaimed = new Date()
  }
}

/**
 * Checks if user has already claimed voucher within last 24 hours
 */
export const checkAlreadyClaimed = (userId: string) => {
  const lastClaimed = mapUserIdToWalletAddress[userId]?.lastClaimed
  console.log('lastClaimed', lastClaimed)
  const hoursPassed = lastClaimed != null ? howManyHoursPassed(lastClaimed) : Infinity
  console.log('hoursPassed', hoursPassed)

  const isAlreadyClaimed = hoursPassed < 24
  return isAlreadyClaimed
}
