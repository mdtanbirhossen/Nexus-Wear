"use client";

import ProductForm from '@/components/products/ProductForm';
import { useCreateProductMutation } from '@/redux/api/productsApi/productsApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CreateProductPage = () => {
     const [createProduct, { isLoading }] = useCreateProductMutation();
     const router = useRouter();

     const handleCreate = async (data: any) => {
          try {
               await createProduct(data).unwrap();
               toast.success("Product Created Successfully");
               router.push("/management/products");
          } catch (err) {
               console.error("Failed to create product:", err);
               toast.error("Failed to create product");
          }
     };

     return (
          <div className="p-4">
               <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
               <ProductForm 
                    onSubmit={handleCreate} 
                    isSubmitting={isLoading} 
                    buttonLabel="Create Product" 
               />
          </div>
     );
};

export default CreateProductPage;