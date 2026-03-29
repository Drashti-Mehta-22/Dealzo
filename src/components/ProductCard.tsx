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

const ProductCard = ({ product }: ProductCardProps) => {
  const [showChart, setShowChart] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return

    setDeleting(true)
    const result = await deleteProduct(product.id)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Product removed successfully")
    }

    setDeleting(false)
  }

  return (
    <Card className="bg-[#0a0a0a] border border-white/3 rounded-2xl">

      {/* HEADER */}
      <CardHeader className="pb-3">
        <div className="flex gap-4">

          {/* Image / Placeholder */}
          <div className="w-20 h-20 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-orange-400 opacity-80" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            <h3 className="font-semibold text-white line-clamp-2 mb-2 text-lg tracking-tight">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 flex-wrap">

              <span className="text-2xl font-bold text-orange-400">
                {product.currency} {product.currency_price}
              </span>

              {/* Tracking Badge */}
              <Badge className="gap-1 bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <TrendingDown className="w-3 h-3" />
                Tracking
              </Badge>

            </div>
          </div>
        </div>
      </CardHeader>

      {/* ACTIONS */}
      <CardContent>
        <div className="flex flex-wrap gap-2">

          {/* Chart Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChart(!showChart)}
            className="gap-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
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

          {/* View Product */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1 bg-white/5 border-white/10 text-gray-300 hover:bg-orange-500/10 hover:border-orange-400/40 hover:text-orange-400"
          >
            <Link href={product.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              View
            </Link>
          </Button>

          {/* Delete */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </Button>

        </div>
      </CardContent>

      {/* CHART */}
      {showChart && (
        <CardFooter className="pt-2 border-t border-white/10">
          <PriceChart productId={product.id} />
        </CardFooter>
      )}
    </Card>
  );
}

export default ProductCard
