import { ChatInputCommandInteraction } from "discord.js"
import { ROLE_NAME_TO_LOOK_FOR } from "../../consts"
import { api } from "../../api"
import { userApi } from "../../db/models/user/userApi"

export const handleVoucherCommand  = async (interaction: ChatInputCommandInteraction) => {
  // 0. chieck if interaction has commandName === 'voucher'

  if (interaction.commandName !== 'voucher') {
    await interaction.reply('Unknown command')
  }

  // 1. check if user is verified player

  const { member } = interaction
  const isVerifiedPlayer = member && 'cache' in member.roles && member.roles.cache.some(role => role.name === ROLE_NAME_TO_LOOK_FOR)

  // 2. if not, reply with instructions on how to become verified player

  if (!isVerifiedPlayer) {
    await interaction.reply("You are not a verified player. We've sent you instructions on how to become one.")
    return
  }

  // 3. if yes, check if user has wallet address set

  const userId = member.user.id
  const walletAddress = await userApi.getWalletAddress(userId)

  // 4. if not, reply with instructions on how to set wallet address

  if (!walletAddress) {
    await interaction.reply("We've sent you instructions in DM")
    return
  }

  // 5. if addres is set, check if user has already claimed voucher

  const hasUserAlreadyClaimedVoucher = await userApi.checkAlreadyClaimed(member.user.id)

  // 6. if yes, reply with message that user has already claimed voucher

  if (hasUserAlreadyClaimedVoucher) {
    await interaction.reply("You've already claimed voucher within last 24 hours. Please try again later.")
    return
  }

  // 7. if not, send voucher to user

  try {
    const res = await api.claimVoucher(walletAddress)
    await userApi.setLastClaimed(userId)

    res.json().then((data) => {
      console.log(data);
    })
    
    await interaction.reply("You have successfully received voucher!")
  } catch (error) {
    console.error(error)
  }
}
