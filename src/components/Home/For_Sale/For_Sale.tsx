"use client"

import { useEffect, useState, useRef, useCallback } from "react";
import For_Sale_Card from "./For_Sale_Card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FlashSale() {
    const products = [
        {
            title: "EliteShield Performance",
            category: "Men's Jackets",
            originalPrice: "Rp525.000",
            salePrice: "Rp255.000",
            rating: "9",
            badgeText: "Sale",
            imageUrl: "https://www.peakperformance.com/us/media/catalog/product/cache/55c5cdd1c3eb66319904b1430bd35b82/article_images/G79804030/G79804030_db2bfc5ae5835b0d1359d360764e1adf.jpg?optimize=low&format=pjpg&auto=webp&width=408&crop=3:4"
        },
        {
            title: "EliteShield Performance",
            category: "Men's Jackets",
            originalPrice: "Rp525.000",
            salePrice: "Rp255.000",
            rating: "9",
            badgeText: "Sale",
            imageUrl: "https://www.peakperformance.com/us/media/catalog/product/cache/55c5cdd1c3eb66319904b1430bd35b82/article_images/G79804030/G79804030_db2bfc5ae5835b0d1359d360764e1adf.jpg?optimize=low&format=pjpg&auto=webp&width=408&crop=3:4"
        },
        {
            title: "EliteShield Performance",
            category: "Men's Jackets",
            originalPrice: "Rp525.000",
            salePrice: "Rp255.000",
            rating: "9",
            badgeText: "Sale",
            imageUrl: "https://www.peakperformance.com/us/media/catalog/product/cache/55c5cdd1c3eb66319904b1430bd35b82/article_images/G79804030/G79804030_db2bfc5ae5835b0d1359d360764e1adf.jpg?optimize=low&format=pjpg&auto=webp&width=408&crop=3:4"
        },
        {
            title: "Gentlemen's Summer Gray Hat",
            category: "Premium Blend",
            originalPrice: "Rp150.000",
            salePrice: "Rp99.000",
            rating: "9",
            badgeText: "Sale",
            imageUrl: "https://n.nordstrommedia.com/it/3c6d9b5a-07ee-4c52-b300-2b3d7fe5c47d.jpeg?h=368&w=240&dpr=2"
        },
        {
            title: "OptiZoom Camera Shoulder Bag",
            category: "Camera Accessories",
            originalPrice: "Rp425.000",
            salePrice: "Rp250.000",
            rating: "5",
            badgeText: "Sale",
            imageUrl: "https://ae01.alicdn.com/kf/HTB14L5DxsyYBuNkSnfoq6AWgVXaE.jpg"
        },
        {
            title: "OptiZoom Camera Shoulder Bag",
            category: "Camera Accessories",
            originalPrice: "Rp425.000",
            salePrice: "Rp250.000",
            rating: "5",
            badgeText: "Sale",
            imageUrl: "https://ae01.alicdn.com/kf/HTB14L5DxsyYBuNkSnfoq6AWgVXaE.jpg"
        },
        {
            title: "OptiZoom Camera Shoulder Bag",
            category: "Camera Accessories",
            originalPrice: "Rp425.000",
            salePrice: "Rp250.000",
            rating: "5",
            badgeText: "Sale",
            imageUrl: "https://ae01.alicdn.com/kf/HTB14L5DxsyYBuNkSnfoq6AWgVXaE.jpg"
        },
        {
            title: "Cloudy Chic",
            category: "Grey Peep Toe Heeled Sandals",
            originalPrice: "Rp580.000",
            salePrice: "Rp270.000",
            rating: "5",
            badgeText: "Sale",
            imageUrl: "https://m.media-amazon.com/images/I/71N1hjwzuWL._UY900_.jpg"
        }
    ];

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

    // Calculate max slides when component mounts
    useEffect(() => {
        if (sliderRef.current) {
            const containerWidth = sliderRef.current.offsetWidth;
            const cardWidth = 256; // w-64 = 16rem = 256px
            const visibleCards = Math.floor(containerWidth / cardWidth);
            setMaxSlides(products.length - visibleCards);
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

    // Update current slide when scrolling
    const handleScroll = useCallback(() => {
        if (sliderRef.current) {
            const scrollPosition = sliderRef.current.scrollLeft;
            const cardWidth = 256; // w-64 = 16rem = 256px
            const newSlide = Math.round(scrollPosition / cardWidth);
            setCurrentSlide(newSlide);
        }
    }, []);

    // Add scroll event listener
    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            slider.addEventListener('scroll', handleScroll);
            return () => slider.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

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
                {/* Navigation buttons - Only show if there are multiple slides */}
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
                    {products.map((product, index) => (
                        <div key={index} className="flex-shrink-0 w-64">
                            <For_Sale_Card
                                title={product.title}
                                category={product.category}
                                originalPrice={product.originalPrice}
                                salePrice={product.salePrice}
                                rating={product.rating}
                                badgeText={product.badgeText}
                                imageUrl={product.imageUrl}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Slider indicators - Only show if there are multiple slides */}
            {products.length > 0 && (
                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: maxSlides + 1 }).map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-black' : 'w-2 bg-gray-300'
                                }`}
                            onClick={() => {
                                if (sliderRef.current) {
                                    const scrollPosition = index * 256; // w-64 = 256px
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