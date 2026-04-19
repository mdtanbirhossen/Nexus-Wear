"use client";

import ProductForm from '@/components/products/ProductForm';
import { useGetProductByIdQuery, useUpdateProductDetailsMutation } from '@/redux/api/productsApi/productsApi';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import Loading from '@/components/shared/Loading';

const UpdateProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
     const { id: productId } = React.use(params);
     const { data: productData, isLoading: isFetching } = useGetProductByIdQuery(productId);
     const [updateProduct, { isLoading: isUpdating }] = useUpdateProductDetailsMutation();
     const router = useRouter();

     const handleUpdate = async (data: any) => {
          try {
               await updateProduct({ productId, data }).unwrap();
               toast.success("Product Updated Successfully");
               router.push("/management/products");
          } catch (err) {
               console.error("Failed to update product:", err);
               toast.error("Failed to update product");
          }
     };

     if (isFetching) {
          return (
               <div className="flex justify-center items-center h-screen">
                    <Loading />
               </div>
          );
     }

     return (
          <div className="p-4">
               <h1 className="text-2xl font-bold mb-4">Update Product</h1>
               <ProductForm 
                    initialData={productData} 
                    onSubmit={handleUpdate} 
                    isSubmitting={isUpdating} 
                    buttonLabel="Update Product" 
               />
          </div>
     );
};

export default UpdateProductPage;