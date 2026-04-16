"use client"

import { useEffect, useState, useRef, useCallback } from "react";
import For_Sale_Card from "./For_Sale_Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllProductsQuery } from "@/redux/api/productsApi/productsApi";
import { Product } from "@/types/product";

export default function FlashSale() {
    const { data: productsData, isLoading } = useGetAllProductsQuery({ limit: 10 });
    const products: Product[] = productsData?.data || [];

    const [timeLeft, setTimeLeft] = useState({
        hours: 8,
        minutes: 17,
        seconds: 56
    });

    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [maxSlides, setMaxSlides] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                const { hours, minutes, seconds } = prevTime;

                let newSeconds = seconds - 1;
                let newMinutes = minutes;
                let newHours = hours;

                if (newSeconds < 0) {
                    newSeconds = 59;
                    newMinutes = minutes - 1;

                    if (newMinutes < 0) {
                        newMinutes = 59;
                        newHours = hours - 1;

                        if (newHours < 0) {
                            clearInterval(timer);
                            return { hours: 0, minutes: 0, seconds: 0 };
                        }
                    }
                }

                return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (sliderRef.current) {
            const containerWidth = sliderRef.current.offsetWidth;
            const cardWidth = 256; // w-64 = 16rem = 256px
            const visibleCards = Math.floor(containerWidth / cardWidth);
            setMaxSlides(Math.max(0, products.length - visibleCards));
        }
    }, [products.length]);

    const formatTime = (time: number) => {
        return time.toString().padStart(2, '0');
    };

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -256, behavior: 'smooth' });
            setCurrentSlide(prev => Math.max(0, prev - 1));
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 256, behavior: 'smooth' });
            setCurrentSlide(prev => Math.min(maxSlides, prev + 1));
        }
    };

    const handleScroll = useCallback(() => {
        if (sliderRef.current) {
            const scrollPosition = sliderRef.current.scrollLeft;
            const cardWidth = 256;
            const newSlide = Math.round(scrollPosition / cardWidth);
            setCurrentSlide(newSlide);
        }
    }, []);

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener('scroll', handleScroll);
            return () => slider.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    if (isLoading) {
        return <div className="py-10 text-center">Loading flash sale products...</div>;
    }

    return (
        <div className="bg-[#F9F9F9] rounded-xl px-5 max-w-7xl mx-auto py-10">
            {/* Header with countdown */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-0">Flash Sale</h2>
                <div className="flex items-center space-x-4 bg-white px-6 py-3 rounded-lg shadow-sm">
                    <span className="text-sm text-black">Time left:</span>
                    <div className="flex items-center space-x-2">
                        <div className="bg-black text-white px-3 py-1 rounded-md">
                            <span className="text-lg font-bold">{formatTime(timeLeft.hours)}</span>
                        </div>
                        <span className="text-black font-bold">:</span>
                        <div className="bg-black text-white px-3 py-1 rounded-md">
                            <span className="text-lg font-bold">{formatTime(timeLeft.minutes)}</span>
                        </div>
                        <span className="text-black font-bold">:</span>
                        <div className="bg-black text-white px-3 py-1 rounded-md">
                            <span className="text-lg font-bold">{formatTime(timeLeft.seconds)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slider container with navigation buttons */}
            <div className="relative">
                {products.length > 0 && (
                    <>
                        <button
                            onClick={scrollLeft}
                            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={currentSlide === 0}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            onClick={scrollRight}
                            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors ${currentSlide >= maxSlides ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={currentSlide >= maxSlides}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                {/* Products slider */}
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div key={product.id} className="flex-shrink-0 w-64">
                            <For_Sale_Card
                                id={product.id}
                                title={product.name}
                                category={product.category?.name || "General"}
                                originalPrice={product.originalPrice ? `$${product.originalPrice}` : undefined}
                                salePrice={`$${product.price}`}
                                rating={product.rating?.toString()}
                                badgeText={"Sale"}
                                imageUrl={product.images && product.images.length > 0 ? product.images[0] : ""}
                                product={product}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {products.length > 0 && (
                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: maxSlides + 1 }).map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-black' : 'w-2 bg-gray-300'
                                }`}
                            onClick={() => {
                                if (sliderRef.current) {
                                    const scrollPosition = index * 256; 
                                    sliderRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
                                    setCurrentSlide(index);
                                }
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}