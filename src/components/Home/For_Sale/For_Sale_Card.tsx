import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { toast } from "sonner"; // Assuming sonner is used for toasts, or adjust accordingly

interface ForSaleCardProps {
  id?: string;
  title?: string;
  category?: string;
  originalPrice?: string;
  salePrice?: string;
  rating?: string;
  badgeText?: string;
  imageUrl?: string;
  product?: any;
}

function For_Sale_Card({
  id,
  title,
  category,
  originalPrice,
  salePrice,
  rating = "0", // Default value to prevent undefined
  badgeText,
  imageUrl,
  product
}: ForSaleCardProps) {
  const dispatch = useDispatch();

  // Convert rating to number safely
  const ratingValue = parseInt(rating || "0");
  const fullStars = Math.floor(ratingValue);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addToCart({
      id: Math.random(), // Temporary unique ID, should be managed properly on backend or real unique key
      cartId: 0,
      productId: Number(product.id),
      colorId: product.colorIds?.[0] ? Number(product.colorIds[0]) : undefined,
      sizeId: product.sizeIds?.[0] ? Number(product.sizeIds[0]) : undefined,
      quantity: 1,
      price: product.price,
      product: product
    }));
    
    toast.success("Added to cart");
  };

  return (
    <Card className="w-full pt-0 overflow-hidden rounded-lg border-0 bg-white shadow-md transition-all hover:shadow-lg flex flex-col h-full">
      <div className="relative h-56 w-full flex-shrink-0">
        <Image
          src={imageUrl || "/profileImg.jpg"}
          alt={title || "Product Image"}
          fill
          className="object-cover"
        />
        <Badge className="absolute left-2 top-3 bg-red-500 px-2 py-1 text-xs font-bold">
          {badgeText}
        </Badge>
      </div>
      
      <CardContent className="px-4 py-3 flex-grow">
        <div className="mb-1">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{title}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{category}</p>
        </div>
        
        <div className="mb-2 flex items-center">
          <span className="text-lg font-bold text-gray-900">{salePrice}</span>
          {originalPrice && <span className="ml-2 text-sm text-gray-500 line-through">{originalPrice}</span>}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <div className="mr-1 flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < fullStars 
                      ? "text-yellow-400" 
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">{rating}/10</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 mt-auto">
        <Button 
          onClick={handleAddToCart} 
          className="w-full bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default For_Sale_Card;