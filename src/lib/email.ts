import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface Product {
  name: string
  url: string
  currency: string
  image_url?: string
}

export async function sendPriceDropAlert(
  userEmail: string,
  product: Product,
  oldPrice: number,
  newPrice: number
) {
  const priceDrop = (oldPrice - newPrice).toFixed(2)
  const percentDrop = (((oldPrice - newPrice) / oldPrice) * 100).toFixed(1)

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: userEmail,
    subject: `Price dropped ${percentDrop}% — ${product.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111;">
        
        <p style="font-size: 13px; color: #888; margin: 0 0 24px;">DealDrop price alert</p>

        <h2 style="font-size: 18px; font-weight: 500; margin: 0 0 8px;">${product.name}</h2>

        <div style="margin: 24px 0; padding: 20px; background: #fafafa; border-radius: 8px; border: 1px solid #eee;">
          <p style="margin: 0 0 4px; font-size: 13px; color: #888;">old price</p>
          <p style="margin: 0 0 16px; font-size: 16px; text-decoration: line-through; color: #aaa;">${product.currency} ${oldPrice.toFixed(2)}</p>

          <p style="margin: 0 0 4px; font-size: 13px; color: #888;">new price</p>
          <p style="margin: 0; font-size: 28px; font-weight: 600; color: #FA5D19;">${product.currency} ${newPrice.toFixed(2)}</p>
        </div>

        <p style="font-size: 14px; color: #555; margin: 0 0 24px;">
          You save <strong>${product.currency} ${priceDrop}</strong> (${percentDrop}% off)
        </p>

        <a href="${product.url}" style="display: inline-block; background: #FA5D19; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
          View product
        </a>

        <p style="font-size: 12px; color: #bbb; margin: 32px 0 0;">
          You're tracking this on <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #bbb;">DealDrop</a>
        </p>

      </div>
    `
  })

  if (error) {
    console.error("Email error:", error)
    return { error }
  }

  return { success: true }
}