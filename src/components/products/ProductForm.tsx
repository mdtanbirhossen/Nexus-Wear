"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useUploadImagesMutation } from "@/redux/api/imagesUploadApi/imagesUploadApi";
import { Product } from "@/types/product";
import { useGetAllColorsQuery } from "@/redux/api/colorApi/colorApi";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Color } from "@/types/color";
import { Label } from "../ui/label";
import { useGetAllsizesQuery } from "@/redux/api/sizeApi/sizeApi";
import { Size } from "@/types/size";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi/categoryApi";
import { Category, Subcategory } from "@/types/categoryAndSubcategory";
import { useGetAllSubCategoriesQuery } from "@/redux/api/subCategoryApi/subCategoryApi";
import Select from "react-select";
import Image from "next/image";
import Loading from "../shared/Loading";
import toast from "react-hot-toast";

interface ProductFormProps {
     initialData?: Product;
     onSubmit: (data: any) => Promise<void>;
     isSubmitting: boolean;
     buttonLabel: string;
}

const ProductForm = ({ initialData, onSubmit, isSubmitting, buttonLabel }: ProductFormProps) => {
     const [images, setImages] = useState<string[]>([]);
     const [uploadImages] = useUploadImagesMutation();
     const [loading, setLoading] = useState(false)
     const router = useRouter();



     /* ---------------------- API Calls ---------------------- */
     const { data: colorData } = useGetAllColorsQuery(undefined);
     const { data: sizeData } = useGetAllsizesQuery(undefined);
     const { data: categoryData } = useGetAllCategoriesQuery(undefined);
     const { data: subCategoryData } = useGetAllSubCategoriesQuery(undefined);


     // categories
     const categories: Category[] = categoryData?.data || [];
     const categoryOptions = categories.map(category => ({
          value: category.id,
          label: category.name,
     }));

     // subCategories
     const subCategories: Subcategory[] = subCategoryData?.data || [];
     const subCategoryOptions = subCategories.map(subCategory => ({
          value: subCategory.id,
          label: subCategory.name,
     }));

     // colors
     const colors: Color[] = colorData?.data || [];
     const colorOptions = colors.map(color => ({
          value: color.id,
          label: color.name,
     }));

     // sizes
     const sizes: Size[] = sizeData?.data || [];
     const sizeOptions = sizes.map(size => ({
          value: size.id,
          label: size.name,
     }));

     // statusOption
     const statusOptions = [
          { value: 'published', label: "PUBLISHED" },
          { value: 'out_of_stock', label: "OUT_OF_STOCK" },
          { value: 'in_stock', label: "IN_STOCK" },
          { value: 'discontinued', label: "DISCONTINUED" },
          { value: 'up_coming', label: "UP_COMING" },
     ];






     /* ---------------------- Form Setup ---------------------- */

     const {
          handleSubmit,
          register,
          control,
          formState: { errors },
          setValue,
          reset,
     } = useForm<Product>();


     /* ---------------------- Pre-fill Form ---------------------- */
     useEffect(() => {
          if (initialData) {
               reset({
                    name: initialData.name,
                    productCode: initialData.productCode,
                    description: initialData.description,
                    price: initialData.price,
                    availability: initialData.availability,
                    categoryId: initialData.category?.id || initialData.categoryId,
                    subcategoryId: initialData.subCategory?.id || initialData.subcategoryId,
                    colorIds: initialData.colors?.map(c => c.id) || [],
                    sizeIds: initialData.sizes?.map(s => s.id) || [],
               });
               setImages(initialData.images || []);
          }
     }, [initialData, reset]);


     /* ---------------------- Submit Handler ---------------------- */
     const handleFormSubmit: SubmitHandler<Product> = async (data) => {
          const payload = {
               name: data.name,
               productCode: data.productCode,
               description: data.description,
               price: Number(data.price),
               originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
               availability: data.availability,
               categoryId: data.categoryId,
               subcategoryId: data.subcategoryId,
               colorIds: data.colorIds || [],
               sizeIds: data.sizeIds || [],
               images,
          };
          await onSubmit(payload);
     };





     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          setLoading(true)
          const file = e.target.files?.[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("file", file);

          try {
               const result = await uploadImages(formData).unwrap();
               const imageUrl =
                    typeof result === "string"
                         ? result
                         : result?.data || result?.url;

               setImages((prev) => [...prev, imageUrl]);
          } catch (error) {
               console.error("Upload failed:", error);
          } finally {
               setLoading(false)
          }
     };

     return (
          <Card className="p-6 space-y-4 flex gap-4">

               {/* Left Section - Form Inputs */}
               <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Card className="md:col-span-2 p-4 gap-2 rounded-sm shadow-none ">


                         {/* image upload section */}
                         <div className="w-full">
                              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50/50 hover:border-secondary transition-all group bg-gray-50/30">
                                   <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                             <Image src="/upload.svg" alt="Upload" width={24} height={24} className="opacity-60" />
                                        </div>
                                        <p className="text-sm text-primary font-medium">
                                             Click to upload or drag & drop product images
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG (max 2MB)</p>
                                   </div>
                                   <Input
                                        type="file"
                                        accept="image/*"
                                        {...register("file", {
                                             validate: {
                                                  lessThan2MB: (value) => {
                                                       const files = value as unknown as FileList;
                                                       return (
                                                            !files?.[0] ||
                                                            files[0].size <= 2_000_000 ||
                                                            "File size should be less than 2MB"
                                                       );
                                                  },
                                             },
                                        })}
                                        onChange={handleFileChange}
                                        className="hidden"
                                   />
                              </label>
                              {errors.file && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.file.message}
                                   </p>
                              )}
                         </div>

                         {/* Uploaded images preview */}
                         <div className="flex gap-4">
                              {images.length > 0 && (
                                   <div className="flex flex-wrap gap-3 mt-4">
                                        {images.map((img, index) => (
                                             <Image
                                                  key={index}
                                                  src={img}
                                                  alt={`Uploaded ${index + 1}`}
                                                  width={100}
                                                  height={100}
                                                  className="w-24 h-24 object-contain rounded-b-md border"
                                             />
                                        ))}
                                   </div>
                              )}
                              {
                                   loading && (
                                        <div className="w-24 h-24  rounded-b-md border bg-gray-200 mt-4 flex items-center  justify-center">
                                             <Loading />
                                        </div>
                                   )
                              }
                         </div>





                         {/* Name */}
                         <div>
                              <Label className="text-sm font-semibold text-primary mb-1">Product Name</Label>
                              <Input
                                   type="text"
                                   placeholder="Enter Product Name"
                                   {...register("name", { required: "Name is required" })}
                                   className="w-full border-gray-200 h-11"
                              />
                              {errors.name && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                   </p>
                              )}
                         </div>

                         {/* productCode */}
                         <div>
                              <Label className="block text-sm font-medium mb-1">Product Code</Label>
                              <Input
                                   type="text"
                                   placeholder="Enter Product Code"
                                   {...register("productCode", { required: "productCode is required" })}
                                   className=" w-full border border-gray-300 "
                              />
                              {errors.productCode && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.productCode.message}
                                   </p>
                              )}
                         </div>

                         {/* Description */}
                         <div>
                              <Label className="block text-sm font-medium mb-1">Description</Label>
                              <Input
                                   type="text"
                                   placeholder="Enter  Description"
                                   {...register("description", { required: "Description is required" })}
                                   className=" w-full border border-gray-300 "
                              />
                              {errors.description && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.description.message}
                                   </p>
                              )}
                         </div>

                         {/* Price */}
                         <div>
                              <Label className="text-sm font-semibold text-primary mb-1">
                                   Price
                              </Label>
                              <Input
                                   type="text"
                                   placeholder="Enter Price"
                                   {...register("price", { required: "Price is required" })}
                                   className=" w-full border border-gray-300 "
                              />
                              {errors.price && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.price.message}
                                   </p>
                              )}
                         </div>


                         {/* Categories */}
                         <div className="space-y-2">
                              <Label className="block text-sm font-medium mb-1">Categories</Label>
                              <Controller
                                   name="categoryId"
                                   control={control}
                                   rules={{ required: "Category is required" }}
                                   render={({ field }) => (
                                        <Select
                                             options={categoryOptions}
                                             value={categoryOptions.find(opt => opt.value === field.value)}
                                             onChange={(selected) => field.onChange(selected?.value)}
                                             placeholder="Select category..."
                                        />
                                   )}
                              />
                              {errors.categoryId && (
                                   <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
                              )}

                         </div>

                         {/* subCategories */}
                         <div className="space-y-2">
                              <Label className="block text-sm font-medium mb-1">Sub Categories</Label>
                              <Controller
                                   name="subcategoryId"
                                   control={control}
                                   render={({ field }) => (
                                        <Select
                                             options={subCategoryOptions}
                                             value={subCategoryOptions.find(opt => opt.value === field.value)}
                                             onChange={(selected) => field.onChange(selected?.value)}
                                             placeholder="Select subcategory..."
                                        />
                                   )}
                              />
                              {errors.subcategoryId && (
                                   <p className="text-red-500 text-sm">{errors.subcategoryId.message}</p>
                              )}
                         </div>

                         {/* Colors */}
                         <div className="space-y-2">
                              <Label className="block text-sm font-medium mb-1">Colors</Label>
                              <Controller
                                   name="colorIds"
                                   control={control}
                                   render={({ field }) => (
                                        <Select
                                             isMulti
                                             options={colorOptions}
                                             value={colorOptions.filter(opt => field.value?.includes(opt.value))}
                                             onChange={(selected) => field.onChange(selected.map(s => s.value))}
                                             placeholder="Select colors..."
                                        />
                                   )}
                              />
                              {errors.colorIds && (
                                   <p className="text-red-500 text-sm">{errors.colorIds.message}</p>
                              )}
                         </div>

                         {/* sizes */}
                         <div className="space-y-2">
                              <Label className="block text-sm font-medium mb-1">Sizes</Label>
                              <Controller
                                   name="sizeIds"
                                   control={control}
                                   render={({ field }) => (
                                        <Select
                                             isMulti
                                             options={sizeOptions}
                                             value={sizeOptions.filter(opt => field.value?.includes(opt.value))}
                                             onChange={(selected) => field.onChange(selected.map(s => s.value))}
                                             placeholder="Select sizes..."
                                        />
                                   )}
                              />
                              {errors.sizeIds && (
                                   <p className="text-red-500 text-sm">{errors.sizeIds.message}</p>
                              )}
                         </div>

                         {/* availability */}
                         <div className="space-y-2">
                              <Label className="block text-sm font-medium mb-1">Status</Label>
                              <Controller
                                   name="availability"
                                   control={control}
                                   render={({ field }) => (
                                        <Select
                                             options={statusOptions}
                                             value={statusOptions.find(opt => opt.value === field.value)}
                                             onChange={(selected) => field.onChange(selected?.value)}
                                             placeholder="Select Status..."
                                        />
                                   )}
                              />
                              {errors.availability && (
                                   <p className="text-red-500 text-sm">{errors.availability.message}</p>
                              )}
                         </div>


                         <Button
                              disabled={loading || isSubmitting}
                              type="submit"
                              className="mt-6 w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20 transition-all font-bold tracking-wide"
                         >
                              {loading || isSubmitting ? <Loading /> : buttonLabel}
                         </Button>
                    </Card>
               </form>

          </Card>
     );
};

export default ProductForm;
