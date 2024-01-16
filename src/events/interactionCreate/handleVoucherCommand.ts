import { ChatInputCommandInteraction, ActionRow, ActionRowBuilder, TextInputStyle, ComponentType, ButtonBuilder, TextInputBuilder, ButtonStyle, ModalBuilder, ModalActionRowComponentBuilder, Events, ModalSubmitInteraction } from "discord.js"
import { api } from "../../api"
import { userApi } from "../../db/models/userWallet/userApi"
import { discordClient } from "../../botApp"
import { validatePolkadotAddress } from "../../utils/validatePolkadotAddress"

export const handleVoucherCommand = async (interaction: ChatInputCommandInteraction) => {
  // 0. chieck if interaction has commandName === 'voucher'

  if (interaction.commandName !== 'voucher') {
    await interaction.reply('Unknown command')
  }

  // 1. check if user is verified player

  const { member } = interaction
  const ROLE_NAME_TO_LOOK_FOR = process.env.ROLE_NAME_TO_LOOK_FOR
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
    try {
      await showModal(interaction)
    } catch (error) {
      console.error("Something went wrong while trying to show modal.")
    }
    return
  }

  // 5. 6. 7. if yes, check if user has already claimed voucher

  checkUserAndClaimVoucher({ interaction, userId, walletAddress })
   
}

const checkUserAndClaimVoucher = async ({
  interaction,
  userId,
  walletAddress
}: {
  interaction: ChatInputCommandInteraction | ModalSubmitInteraction,
  userId: string,
  walletAddress: string
}) => {
  // 5. if addres is set, check if user has already claimed voucher

  const hasUserAlreadyClaimedVoucher = await userApi.checkAlreadyClaimed(userId) 

  // 6. if yes, reply with message that user has already claimed voucher

  if (hasUserAlreadyClaimedVoucher) {
    await interaction.reply("You've already claimed voucher within last 24 hours. Please try again later.")
    return
  }

  // 7. if not, send voucher to user

  try {
    interaction.reply("Please wait while we're issuing voucher...")
    
    const res = await api.claimVoucher(walletAddress)

    if (res.status !== 200) {
      await interaction.followUp("Voucher issuing service returned error. Please try again later.")
      return
    }
    
    await userApi.setLastClaimed(userId)

    
    await interaction.followUp(`${`<@${userId}>`} have successfully received voucher!`)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Modal submit event listener
 */
setTimeout( () => {
  discordClient.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return

    const fields = Array.from(interaction.fields.fields.values())
    const walletAddress = fields[0].value
    const userId = interaction.member?.user.id || ''

    const isValid =  validatePolkadotAddress(walletAddress)
    
    if (!isValid) {
      interaction.reply('The address is invalid. Please try again.')
      return
    }

    /**
     * 
     */
    userApi.setWalletAddress(userId, walletAddress)
    
    /**
     * 
     */
    checkUserAndClaimVoucher({ interaction, userId, walletAddress })
  })

  console.info('Listening for modal submit...')
}, 500)

const showModal = async (interaction: ChatInputCommandInteraction) => {
  // Create the modal
  const modal = new ModalBuilder()
    .setCustomId('wallet_input_modal')
    .setTitle('Wallet Input')

  // Create the text input components
  const favoriteColorInput = new TextInputBuilder()
    .setCustomId('wallet_address')
    .setLabel("Please enter your wallet address.")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)


  const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
    .addComponents(favoriteColorInput)

  // Add inputs to the modal
  modal.addComponents(actionRow)

  // Show the modal to the user
  interaction.showModal(modal)
}
