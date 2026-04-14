"use client"
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useGetProductByIdQuery } from '@/redux/api/productsApi/productsApi'
import Loading from '../shared/Loading'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Heart, ShieldCheck, RotateCcw } from 'lucide-react'

const StorefrontProductDetails = () => {
    const { id } = useParams()
    const { data: product, isLoading, isError } = useGetProductByIdQuery(id as string)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)

    if (isLoading) return <div className="py-20 flex justify-center"><Loading /></div>
    if (isError || !product) return <div className="p-10 text-center text-red-500 font-bold">Product not found.</div>

    const { name, price, originalPrice, description, images, colors, sizes, category, subCategory } = product
    const discount = originalPrice && originalPrice > price 
        ? Math.round(((originalPrice - price) / originalPrice) * 100) 
        : 0

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border shadow-sm group">
                        {images && images.length > 0 ? (
                            <Image 
                                src={images[selectedImage]} 
                                alt={name}
                                fill
                                className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-300">No Image Available</div>
                        )}
                        {discount > 0 && (
                            <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground font-black px-4 py-1">
                                SAVE {discount}%
                            </Badge>
                        )}
                    </div>
                    {images && images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-secondary shadow-md scale-105' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    <Image src={img} alt={`${name} thumbnail ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Info */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-secondary border-secondary font-bold uppercase tracking-widest text-[10px]">
                                {category?.name || 'Top Wear'}
                            </Badge>
                            <span className="text-gray-300">/</span>
                            <Badge variant="outline" className="text-gray-400 border-none font-medium uppercase text-[10px]">
                                {subCategory?.name}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-black text-primary uppercase tracking-tight leading-none">{name}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                                <span className="text-sm font-bold text-primary ml-1">5.0</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-500 font-medium">120 Reviews</span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-black text-primary italic">BDT {price.toLocaleString()}</span>
                        {originalPrice && (
                            <span className="text-xl text-gray-300 line-through">BDT {originalPrice.toLocaleString()}</span>
                        )}
                    </div>

                    <p className="text-gray-600 leading-relaxed font-medium">
                        {description}
                    </p>

                    {/* Selectors */}
                    <div className="space-y-6 pt-4 border-t">
                        {colors && colors.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    Available Colors
                                </span>
                                <div className="flex gap-3">
                                    {colors.map(color => (
                                        <button 
                                            key={color.id}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`px-4 py-2 rounded-md border text-xs font-bold uppercase transition-all ${selectedColor === color.name ? 'bg-primary text-white border-primary shadow-lg ring-2 ring-secondary' : 'bg-white text-gray-500 border-gray-200 hover:border-secondary'}`}
                                        >
                                            {color.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {sizes && sizes.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-xs font-black uppercase tracking-widest text-primary">Available Sizes</span>
                                <div className="flex gap-3">
                                    {sizes.map(size => (
                                        <button 
                                            key={size.id}
                                            onClick={() => setSelectedSize(size.name)}
                                            className={`w-12 h-12 flex items-center justify-center font-black border uppercase transition-all ${selectedSize === size.name ? 'bg-secondary text-secondary-foreground border-secondary shadow-lg' : 'bg-white text-gray-400 border-gray-200 hover:border-primary'}`}
                                        >
                                            {size.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex items-center border-2 border-primary rounded-md overflow-hidden h-12">
                            <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="px-4 hover:bg-gray-100 font-black">-</button>
                            <span className="px-4 font-black w-12 text-center border-x-2 border-primary leading-10">{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} className="px-4 hover:bg-gray-100 font-black">+</button>
                        </div>
                        <Button className="flex-1 h-12 bg-primary text-white hover:bg-secondary hover:text-secondary-foreground transition-all uppercase font-black tracking-widest gap-2">
                            <ShoppingCart className="w-5 h-5" /> Add to Cart
                        </Button>
                        <Button variant="outline" className="h-12 w-12 p-0 border-gray-200 hover:text-red-500 hover:border-red-500 transition-all shadow-sm">
                            <Heart className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-[10px] font-black uppercase tracking-widest">
                         <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <ShieldCheck className="w-5 h-5 text-secondary" />
                            <span>100% Authentic Product</span>
                         </div>
                         <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <RotateCcw className="w-5 h-5 text-secondary" />
                            <span>7 Days Return Policy</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StorefrontProductDetails
