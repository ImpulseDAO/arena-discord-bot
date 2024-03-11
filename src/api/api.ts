import { VoucherIssuedData } from "../types"

const voucherIssuerUrl = process.env.VOUCHER_ISSUER_URL

export const claimVoucher = async (walletAddress: string) => {
  if (!voucherIssuerUrl) throw new Error('VOUCHER_ISSUER_URL is not set')
  
  console.info('issuing voucher for', walletAddress)
  
  const response = await fetch(voucherIssuerUrl, {
    method: 'POST',
    body: JSON.stringify({
      account: walletAddress
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return {
    data: response.ok ? await response.json() as VoucherIssuedData : null,
    rawResponse: response
  }
}
