import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
console.log("API KEY:", process.env.FIRECRAWL_API_KEY)

interface ScrapedProduct {
    productName: string
    currentPrice: string
    currencyCode?: string
    imageUrl?: string
}

export async function scrapeProduct(url: string) {
    try {
        const result = await firecrawl.scrape(url, {
            timeout: 60000,
            actions: [
        { type: "wait", milliseconds: 3000 }  // ✅ wait for JS to render
    ],
            formats : [{
                type: 'json', 
                schema: {
                type: "object",
                required: ["productName", "currentPrice"],
                properties: {
                    productName: {
                        type: "string"
                    },
                    currentPrice: {
                        type: "string"
                    },
                    currencyCode: {
                        type: "string"
                    },
                    imageUrl: {
                        type: "string"
                    }
                }
            },
            prompt: "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code(USD, INR etc) as 'currencyCode', and product image URL as 'imageUrl' if available"}]
        })

        const extractedData = result.json as ScrapedProduct

        if(!extractedData || !extractedData.productName){
            throw new Error("No data extracted")
        }

        return extractedData
    } catch (error: any) {
        console.error("Error scraping product:", error)
        throw new Error(`Failed to scrape product data: ${error.message}`)
    }
    
}