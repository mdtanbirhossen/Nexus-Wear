'use client'
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import Image from 'next/image';
import { useGetProductByIdQuery } from '@/redux/api/productsApi/productsApi';
import Loading from '../shared/Loading';

const ProductDetails = () => {
     const { id } = useParams();
     const { data, isLoading, isError } = useGetProductByIdQuery(id as string);
     const router = useRouter();

     if (isLoading) return <div className='flex items-center justify-center w-full h-[calc(100vh-100px)]'><Loading /></div>;
     if (isError) return <p className="text-center py-10 text-red-500">Failed to load product details.</p>;
     if (!data) return <p className="text-center py-10">No Product found</p>;

     const {
          name,
          images,
          productCode,
          description,
          price,
          availability,
          viewCount,
          orderCount,
          createdAt,
          updatedAt,
     } = data;

     const tableData = [
          { label: "name", value: name },
          { label: "productCode", value: productCode },
          { label: "description", value: description },
          { label: "price", value: price },
          { label: "availability", value: availability },
          // { label: "category", value: category },
          // { label: "subCategory", value: subCategory },
          // { label: "colors", value: colors },
          // { label: "sizes", value: sizes },
          { label: "viewCount", value: viewCount },
          { label: "orderCount", value: orderCount },
          { label: "Created At", value: new Date(createdAt).toLocaleString() },
          { label: "Updated At", value: new Date(updatedAt).toLocaleString() },
     ]

     return (
          <Card className="w-full  p-4 sm:p-6 bg-white rounded-lg shadow">
               {/* Top Section */}
               <div className="flex flex-wrap gap-4 sm:gap-6 items-center mb-4">
                    {
                         images?.map((image, idx) => (
                              <Image
                                   key={idx}
                                   src={image ?? "/profileImg.jpg"}
                                   alt={name}
                                   width={100}
                                   height={100}
                                   quality={75}
                                   className="w-32 h-32 sm:w-42 sm:h-42  object-contain "
                              />
                         ))
                    }
               </div>

               {/* Table Section */}
               <div className="overflow-x-auto rounded">
                    <h1 className="text-xl sm:text-2xl font-extrabold mb-4 text-primary">Product Details:</h1>
                    <table className="w-full border-collapse border border-gray-100 text-sm sm:text-base">
                         <tbody>
                              {tableData.map((item, idx) => (
                                   <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                                        <td className="font-bold p-4 border border-gray-100 whitespace-nowrap text-primary uppercase text-xs tracking-wider w-1/3">{item.label}</td>
                                        <td className="p-4 border border-gray-100 font-medium text-gray-700">{item.value}</td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>

                    <div className="mt-6 flex gap-3">
                         <Button variant="outline" onClick={() => router.back()} className="px-8 flex-1 sm:flex-none">Go Back</Button>
                         <Button 
                              onClick={() => router.push(`/management/products/update/${id}`)}
                              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 flex-1 sm:flex-none shadow-lg shadow-secondary/20"
                         >
                              Edit Product
                         </Button>
                    </div>
               </div>
          </Card>
     );
};

export default ProductDetails;
