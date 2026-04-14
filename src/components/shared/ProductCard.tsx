"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, price, originalPrice, images, rating, availability } = product
  const discount = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0

  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <Link href={`/products/details/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100 uppercase">
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
          )}
          
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground font-bold rounded-sm">
              -{discount}%
            </Badge>
          )}

          {availability === 'out_of_stock' && (
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Badge variant="destructive" className="text-xs uppercase px-3 py-1">Out of Stock</Badge>
             </div>
          )}
        </div>
      </Link>

      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
            <Link href={`/products/details/${id}`} className="hover:text-secondary transition-colors">
                <CardTitle className="text-sm font-bold line-clamp-2 min-h-[40px] text-primary uppercase tracking-tight">
                    {name}
                </CardTitle>
            </Link>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 font-medium">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{rating ?? 0}</span>
          <span>|</span>
          <span>Nexus-Wear Official</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex flex-col">
          <span className="text-lg font-extrabold text-primary">BDT {price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">BDT {originalPrice.toLocaleString()}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
            disabled={availability === 'out_of_stock'}
            className="w-full bg-primary text-white hover:bg-secondary hover:text-secondary-foreground transition-colors uppercase text-xs font-bold tracking-widest gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
