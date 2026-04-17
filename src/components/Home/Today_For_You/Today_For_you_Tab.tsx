"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Star } from "lucide-react";
import Image from "next/image";
import { useGetAllProductsQuery } from "@/redux/api/productsApi/productsApi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartSlice";
import toast from "react-hot-toast";

export function Today_For_You_Tab() {
  const { data: productsData, isLoading } = useGetAllProductsQuery({ limit: 8 });
  const products = productsData?.data || [];
  const dispatch = useDispatch();

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      id: crypto.randomUUID(),
      cartId: '0',
      productId: product.id,
      colorId: product.colorIds?.[0] || undefined,
      sizeId: product.sizeIds?.[0] || undefined,
      quantity: 1,
      price: product.price,
      product: product
    }));
    toast.success("Added to cart");
  };

  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <Tabs defaultValue="products">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold">Today&apos;s For You!</h2>
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products">
          {isLoading ? (
            <div className="py-10 text-center">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg gap-3 py-4 px-0 transition-shadow">
                  <CardHeader className="px-4">
                    <div className="w-full h-48 relative bg-gray-200 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      ) : (
                        <span className="text-gray-500">Product Image</span>
                      )}
                    </div>
                    <CardTitle className="text-base md:text-lg line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating || "0"}</span>
                      <span>•</span>
                      <span>{product.orderCount || 0} Sold</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 mt-auto">
                    <Button className="w-full" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="collections">
          <Card>
            <CardHeader>
              <CardTitle>Collections</CardTitle>
              <CardDescription>
                Browse our featured collections and special offers.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="collection-search">Search Collections</Label>
                <Input id="collection-search" placeholder="Find your favorite collection" />
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <p>Collections content will be displayed here</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Explore All Collections</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}