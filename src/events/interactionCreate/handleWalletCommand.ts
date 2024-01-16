import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { userApi } from "../../db/models/user/userApi"

export const handleWalletCommand  = async (interaction: ChatInputCommandInteraction) => {
  interaction.command

  const userId = interaction.user.id
  
  const walletAddress = interaction.options.data[0]?.value as string
  const isValid = validateWalletAddress(walletAddress)

  if (!isValid) {
    interaction.reply('Wallet address is not valid')
    return
  }
  
  await userApi.setWalletAddress(userId, walletAddress)
  
  interaction.reply('Wallet address successfully added')
}

/**
 * TODO: validate wallet address
 */
const validateWalletAddress = (walletAddress?: string | number | boolean) => {
  if (walletAddress && walletAddress !== '') {
    return true
  }
  return false
}
