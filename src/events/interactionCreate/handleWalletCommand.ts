import { ChatInputCommandInteraction } from "discord.js"
import { userApi } from "../../db/models/userWallet/userApi"
import { validatePolkadotAddress } from "../../utils/validatePolkadotAddress/validatePolkadotAddress"

/**
 * Wallet address input is now handled by the modal inside the /voucher command.
 * 
 * @deprecated
 */
export const handleWalletCommand  = async (interaction: ChatInputCommandInteraction) => {
  interaction.command

  const userId = interaction.user.id
  
  const walletAddress = interaction.options.data[0]?.value as string
  const isValid = validatePolkadotAddress(walletAddress)

  if (!isValid) {
    interaction.reply('Wallet address is not valid. Please try again.')
    return
  }
  
  try {
    await userApi.setWalletAddress(userId, walletAddress)
  
    interaction.reply('Wallet address successfully added')
  } catch (error) {
    interaction.reply('Something went wrong during "handleWalletCommand" handling. Please try again.')
  }
}


