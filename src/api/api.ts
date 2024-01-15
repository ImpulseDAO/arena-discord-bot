const voucherIssuerUrl = process.env.VOUCHER_ISSUER_URL

export const claimVoucher = async (walletAddress: string) => {
  if (!voucherIssuerUrl) throw new Error('VOUCHER_ISSUER_URL is not set')
  
  console.log('issuing voucher for', walletAddress)
  
  return await fetch(voucherIssuerUrl, {
    method: 'POST',
    body: JSON.stringify({
      account: walletAddress
    })
  })
}
