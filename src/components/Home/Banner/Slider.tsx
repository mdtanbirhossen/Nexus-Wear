"use client"

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const bannerItems = [
  {
    id: 1,
    title: "Summer Collection",
    description: "Discover our latest summer fashion line with fresh designs and premium fabrics. Stay cool and stylish all season long.",
    imageUrl: "https://i.ibb.co.com/39k7LBWr/bg-image-2-removebg-preview.png",
    buttonText: "Shop Now",
    price: "From $29.99",
    originalPrice: "$49.99",
    discount: "40% OFF",
    rating: 4.7,
    reviews: 342,
    category: "Seasonal Collection",
    isNew: "2025",
    orderPrice: "100"
  },
  {
    id: 2,
    title: "Premium Denim Jeans",
    description: "Experience ultimate comfort with our stretch denim collection. Perfect fit for every body type with premium quality fabric.",
    imageUrl: "https://i.ibb.co.com/yFRF9QZY/banner-img-1-removebg-preview.png",
    buttonText: "Explore Denim",
    price: "$59.99",
    originalPrice: "$79.99",
    discount: "25% OFF",
    rating: 4.8,
    reviews: 512,
    category: "Bottoms",
    isNew: "2025",
    orderPrice: "100"
  },
  {
    id: 3,
    title: "Elegant Formal Wear",
    description: "Look professional and polished with our premium formal wear collection. Perfect for office and business meetings.",
    imageUrl: "https://i.ibb.co.com/B2WJ6XCK/ho-slider-3-removebg-preview.png",
    buttonText: "Browse Collection",
    price: "From $39.99",
    originalPrice: "$69.99",
    discount: "30% OFF",
    rating: 4.9,
    reviews: 278,
    category: "Formal Wear",
    isNew: "2025",
    orderPrice: "100"
  }
];

export function Slider() {
  return (
    <Carousel
      opts={{ loop: true, watchDrag: false }}
      className="w-full rounded-xl h-full min-h-[500px] md:min-h-[600px] lg:min-h-[500px] relative group"
    >
      <CarouselContent className="rounded-xl">
        {bannerItems.map((item) => (
          <CarouselItem key={item.id}>
            <div className="h-full rounded-xl">
              <Card className="border-none rounded-xl shadow-none h-full md:h-[700px] lg:h-full overflow-hidden">
                <CardContent className={`flex flex-col lg:flex-row h-full p-0 relative bg-[#F9F9F9] rounded-xl`}>
                  {/* Text Content */}
                  <div className={`w-full lg:w-1/2 flex flex-col justify-center px-6 py-6 md:p-8 lg:px-16  order-2 lnpg:order-1`}>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3 ">
                      {item.title} {item.isNew}
                    </h2>
                    <p className="text-base hidden lg:block sm:text-lg mb-4 md:mb-6 opacity-90">
                      {item.description}
                    </p>

                    {/* Category */}
                    <div className="mb-3 md:mb-3 lg:mb-4">
                      <span className="text-xs sm:text-sm font-medium bg-black/10 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="hidden lg:flex items-center mb-3 md:mb-4">
                      <div className="flex text-amber-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs  sm:text-sm">{item.rating} ({item.reviews} reviews)</span>
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-wrap items-center mb-4 md:mb-3 lg:mb-6">
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold mr-3 md:mr-4">{item.price}</span>
                      <span className="text-base sm:text-lg text-gray-500 line-through mr-3 md:mr-4">{item.originalPrice}</span>
                      <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded">
                        {item.discount}
                      </span>
                    </div>

                    <Button className="w-full sm:w-fit cursor-pointer bg-black hover:bg-gray-800 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 mb-3 md:mb-0">
                      {item.buttonText}
                    </Button>

                    <div className="flex items-center mt-2 md:mt-4 text-xs sm:text-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 5.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 10l1.293-1.293zm4 0a1 1 0 010 1.414L11.414 10l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Free shipping on orders over ${item.orderPrice}
                    </div>
                  </div>

                  {/* Image with subtle overlay */}
                  <div className="w-full lg:w-1/2 md:min-h-[400px] lg:h-full py-2 md:py-8 lg:pt-14 relative overflow-hidden order-1 lg:order-2">
                    <div className="absolute h-[400px] inset-0 bg-gradient-to-l from-white/20 to-transparent z-10  lg:block"></div>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-[400px] object-contain object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Premium badge */}
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 bg-white rounded-full shadow-md p-1 sm:p-2 z-20">
                      <div className="bg-black text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                        PREMIUM
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 md:p-4 shadow-xl border border-gray-200 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100" />
      <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 md:p-4 shadow-xl border border-gray-200 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100" />
    </Carousel>
  );
}