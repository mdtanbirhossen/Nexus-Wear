"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart } from 'lucide-react'
import { Product } from '@/types/product'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/redux/features/cart/cartSlice'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, price, originalPrice, images, rating, availability } = product
  const dispatch = useDispatch()
  
  const discount = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(addToCart({
      id: crypto.randomUUID(), 
      cartId: '0',
      productId: id,
      colorId: product.colorIds?.[0] || undefined,
      sizeId: product.sizeIds?.[0] || undefined,
      quantity: 1,
      price: price,
      product: product
    }))
    toast.success("Added to cart")
  }

  return (
    <Card className="group overflow-hidden rounded-xl border border-transparent shadow-sm hover:shadow-2xl hover:border-border transition-all duration-500 bg-card flex flex-col h-full transform hover:-translate-y-1">
      <Link href={`/products/details/${id}`} className="block relative w-full aspect-[4/5] overflow-hidden bg-gray-50/50">
        {images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/10">No Image</div>
        )}
        
        {/* Overlays */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-black rounded text-[10px] uppercase tracking-wider px-2 py-1 shadow-sm border-none">
              -{discount}% OFF
            </Badge>
          )}
          {availability === 'out_of_stock' && (
             <Badge variant="destructive" className="font-bold rounded text-[10px] uppercase tracking-wider px-2 py-1 shadow-sm border-none">
               Out of Stock
             </Badge>
          )}
        </div>

        {/* Hover quick action overlay (optional visual enhancement) */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 pointer-events-none" />
      </Link>

      <div className="flex flex-col flex-grow">
        <CardHeader className="p-4 pb-2 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
            <Star className="w-3 h-3 fill-secondary text-secondary" />
            <span className="text-foreground">{rating ?? 0}</span>
            <span className="text-border mx-1">|</span>
            <span className="truncate">Nexus-Wear Official</span>
          </div>
          <Link href={`/products/details/${id}`} className="block group-hover:text-secondary transition-colors duration-300">
            <CardTitle className="text-sm md:text-base font-bold line-clamp-2 min-h-[2.5rem] leading-tight text-primary transition-colors">
              {name}
            </CardTitle>
          </Link>
        </CardHeader>

        <CardContent className="px-4 py-0 flex-grow">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-lg md:text-xl font-black text-primary leading-none">
              BDT {price.toLocaleString()}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs md:text-sm text-muted-foreground line-through font-medium leading-none pb-[2px]">
                BDT {originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-4 mt-auto">
          <Button 
              onClick={handleAddToCart}
              disabled={availability === 'out_of_stock'}
              className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 uppercase text-[11px] font-black tracking-[0.15em] h-11 shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Bag
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export default ProductCard
