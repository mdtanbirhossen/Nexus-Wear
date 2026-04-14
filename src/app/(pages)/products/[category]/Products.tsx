"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useGetAllProductsQuery } from '@/redux/api/productsApi/productsApi'
import ProductCard from '@/components/shared/ProductCard'
import Loading from '@/components/shared/Loading'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'
import { useState } from 'react'

const Products = () => {
    const searchParams = useSearchParams()
    const [limit, setLimit] = useState(12)
    
    // Extract filters from URL
    const params = {
        page: 1,
        limit,
        search: searchParams.get('search') || undefined,
        categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
        subcategoryId: searchParams.get('subcategoryId') ? Number(searchParams.get('subcategoryId')) : undefined,
        colorId: searchParams.get('colorId') ? Number(searchParams.get('colorId')) : undefined,
        sizeId: searchParams.get('sizeId') ? Number(searchParams.get('sizeId')) : undefined,
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    }

    const { data, isLoading, isError, isFetching } = useGetAllProductsQuery(params)

    const handleLoadMore = () => {
        setLimit(prev => prev + 12)
    }

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
            <Loading />
            <p className="text-sm text-gray-500 mt-4 animate-pulse">Fetching the latest collection...</p>
        </div>
    )

    if (isError) return (
        <div className="text-center py-20 bg-red-50/50 rounded-lg border border-red-100">
            <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
            <p className="text-gray-600 mt-2">Failed to load products. Please try again later.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
        </div>
    )

    const products: Product[] = data?.data || []

    return (
        <div className="w-full">
            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="flex items-center gap-1">
                                <Home className="w-3 h-3" /> Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Stats Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                     {params.search && (
                          <h2 className="text-2xl font-black text-primary uppercase italic tracking-tight">
                             Search Results for: <span className="text-secondary">&quot;{params.search}&quot;</span>
                          </h2>
                     )}
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    Discovering <span className="text-secondary">{products.length}</span> of <span className="text-primary">{data?.total || 0}</span> Masterpieces
                </p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <h3 className="text-lg font-bold text-primary italic uppercase underline decoration-secondary decoration-2 underline-offset-4">No Products Found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                </div>
            )}
            
            {/* Pagination */}
            {data?.total && data.total > params.limit && (
                <div className="flex justify-center mt-12 pb-10">
                    <Button 
                        onClick={handleLoadMore}
                        disabled={isFetching}
                        variant="outline" 
                        className="border-primary text-primary hover:bg-primary hover:text-white px-10 h-14 uppercase font-black tracking-widest transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-50"
                    >
                        {isFetching ? "Loading Masterpieces..." : "Load More Experience"}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Products
