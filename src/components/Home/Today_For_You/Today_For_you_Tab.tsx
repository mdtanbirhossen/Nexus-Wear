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

export function Today_For_You_Tab() {
  // Product data
  const products = [
    {
      title: "UrbanEdge Men's Jeans Collection",
      rating: 4.9,
      sold: "10K+",
      price: "Rp253.000",
      originalPrice: "Rp370.000",
      discount: true,
    },
    {
      title: "Essentials Men's Long-Sleeve Oxford Shirt",
      rating: 4.9,
      sold: "10K+",
      price: "Rp179.000",
      originalPrice: null,
      discount: false,
    },
    {
      title: "StyleHaven Men's Fashionable Brogues",
      rating: 4.9,
      sold: "8K+",
      price: "Rp199.000",
      originalPrice: "Rp325.000",
      discount: true,
    },
    {
      title: "Essential Long-Sleeve Crewneck Shirt for Men",
      rating: 4.9,
      sold: "5K+",
      price: "Rp120.000",
      originalPrice: null,
      discount: false,
    },
    {
      title: "ClassicGent Men's Formal Shoes",
      rating: 4.9,
      sold: "4K+",
      price: "Rp199.000",
      originalPrice: null,
      discount: false,
    },
    {
      title: "UrbanFlex Men's Short Pants Collection",
      rating: 4.9,
      sold: "2K+",
      price: "Rp162.000",
      originalPrice: null,
      discount: false,
    },
    {
      title: "ChicCarry - Elegant Women's Tote Collection",
      rating: 4.9,
      sold: "500+",
      price: "Rp650.000",
      originalPrice: null,
      discount: false,
    },
    {
      title: "Sophisticated Women's Parka Line",
      rating: 4.9,
      sold: "100+",
      price: "Rp324.000",
      originalPrice: "Rp550.000",
      discount: true,
    },
  ];

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
          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg gap-3 py-4 px-0 transition-shadow">
                <CardHeader className="px-4">
                  <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                    <span className="text-gray-500">Product Image</span>
                  </div>
                  <CardTitle className="text-base md:text-lg">{product.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    <span>•</span>
                    <span>{product.sold} Sold</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="px-4">
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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