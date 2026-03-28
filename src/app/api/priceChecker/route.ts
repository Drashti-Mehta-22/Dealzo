import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeProduct } from "@/actions/firecrawl";
import { sendPriceDropAlert } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: products, error: productsError } = await supabase
      .from("product")
      .select("*")

    if (productsError) throw productsError

    console.log(`Found ${products.length} products to check`)

    const results = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertsSent: 0,
    }

    for (const product of products) {
      try {
        const productData = await scrapeProduct(product.url)

        if (!productData.currentPrice) {
          results.failed++
          continue
        }

        const newPrice = parseFloat(productData.currentPrice)
        const oldPrice = parseFloat(product.currency_price)  

        

        if (oldPrice !== newPrice) {

            await supabase
          .from("product")   
          .update({
            currency_price: newPrice,    
            currency: productData.currencyCode || product.currency,
            name: productData.productName || product.name,
            image_url: productData.imageUrl || product.image_url, 
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id)
   
          await supabase.from("price_history").insert({
            product_id: product.id,
            price: newPrice,
            currency: productData.currencyCode || product.currency,
            checked_at: new Date().toISOString(),            
          })

          results.priceChanges++

          if (newPrice < oldPrice) {
            const { data: { user } } = await supabase.auth.admin.getUserById(product.user_id)
             console.log("User found:", user?.email)

            if (user?.email) {
              const emailResult = await sendPriceDropAlert(
                user.email,
                product,
                oldPrice,
                newPrice
              )

              if (emailResult.success) {
                results.alertsSent++
              }
            }
          }
        }

        results.updated++
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error)
        results.failed++
      }
    }

    return NextResponse.json({
      success: true,
      message: "Price check completed",
      results,
    })
  } catch (error: any) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Price check endpoint is working. Use POST to trigger.",
  })
}

// curl -X POST http://localhost:3000/api/priceChecker -H "Authorization: Bearer 621527c5e1b9628f2ea3a50e37d03b091c8d515be81238617b70333ed392ecae"