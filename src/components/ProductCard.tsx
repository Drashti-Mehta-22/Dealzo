"use client"
import { deleteProduct } from '@/actions/serverAction';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronUp, ExternalLink, ShoppingBag, Trash2, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import PriceChart from './PriceChart';

interface Product {
  id: string
  user_id: string
  url: string
  name: string
  currency_price: number
  currency: string
  image_url?: string
  updated_at: string
  created_at: string
}

interface ProductCardProps {
  product: Product
}

const ProductCard = ({product}: ProductCardProps) => {
    const [showChart, setShowChart] = useState(false)
  const [deleting, setDeleting] = useState(false)

 const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return

    setDeleting(true)
    const result = await deleteProduct(product.id)

    if(result.error){
      toast.error(result.error)
    } else {
      toast.success("Product removed successfully")
    }

    setDeleting(false)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          {product.image_url && (
    
            <div className="w-20 h-20 rounded-md border bg-orange-50 flex items-center justify-center">
  <ShoppingBag className="w-8 h-8 text-orange-300" />
</div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-00 line-clamp-2 mb-2 text-lg">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-orange-500">
                {product.currency} {product.currency_price}
              </span>
              <Badge variant="secondary" className="gap-1">
                <TrendingDown className="w-3 h-3" />
                Tracking
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChart(!showChart)}
            className="gap-1"
          >
            {showChart ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Chart
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Chart
              </>
            )}
          </Button>

          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link href={product.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              View Product
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </Button>
        </div>
      </CardContent>

      {showChart && (
        <CardFooter className="pt-0">
          <PriceChart productId={product.id} />
        </CardFooter>
  )}
  </Card>
  )
}

export default ProductCard
