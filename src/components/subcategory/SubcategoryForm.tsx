"use client"

import React, { useEffect, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Image from "next/image"

// UI Components
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

// Redux
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi/categoryApi"
import { useCreateSubCategoryMutation, useGetSubCategoryByIdQuery, useUpdateSubCategoryDetailsMutation } from "@/redux/api/subCategoryApi/subCategoryApi"
import { Category, Subcategory } from "@/types/categoryAndSubcategory"
import Loading from "../shared/Loading"

const SubcategoryForm = () => {
     /* ---------------------- State & Hooks ---------------------- */
     const [imagePreview, setImagePreview] = useState<string | null>(null)
     const [loading, setLoading] = useState(false)

     const { id } = useParams()
     const router = useRouter()
     const pathname = usePathname()
     const mode = pathname.split("/")[2] // create | update

     // Queries
     const { data: subcategory } = useGetSubCategoryByIdQuery(id, { skip: mode !== "update" })
     const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 100 })
     const categories = categoriesData?.data || []

     // Mutations
     const [createSubcategory] = useCreateSubCategoryMutation()
     const [updateSubcategory] = useUpdateSubCategoryDetailsMutation()

     /* ---------------------- Form Setup ---------------------- */
     const {
          handleSubmit,
          register,
          formState: { errors },
          reset,
          setValue,
          watch,
     } = useForm<Subcategory>()

     const selectedCategoryId = watch("categoryId")

     useEffect(() => {
          if (subcategory && mode === "update") {
               reset({
                    name: subcategory.name || "",
                    description: subcategory.description || "",
                    categoryId: subcategory.categoryId || "",
               })
          }
     }, [subcategory, reset, mode])

     /* ---------------------- Submit Handler ---------------------- */
     const onSubmit: SubmitHandler<Subcategory> = async (data) => {
          if (!data.categoryId) {
               toast.error("Please select a parent category")
               return
          }

          setLoading(true)
          const formData = new FormData()
          formData.append("name", data.name)
          formData.append("description", data.description)
          formData.append("categoryId", data.categoryId)

          if (data.image && data.image[0]) {
               formData.append("image", data.image[0])
          }

          try {
               if (mode === "create") {
                    await createSubcategory(formData).unwrap()
                    toast.success("Subcategory created successfully")
               } else {
                    await updateSubcategory({ formData, subCategoryId: id }).unwrap()
                    toast.success("Subcategory updated successfully")
               }
               router.push("/management/subcategories")
          } catch (err) {
               console.error("Failed to save subcategory:", err)
               toast.error("Failed to save subcategory")
          } finally {
               setLoading(false)
          }
     }

     return (
          <Card className="p-6 rounded-md shadow-none border border-gray-100">
               <h1 className="text-2xl font-bold text-primary mb-6">
                    {mode === "update" ? "Update Subcategory Info" : "Create Subcategory"}
               </h1>

               <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Section - Form Inputs */}
                    <div className="md:col-span-2 space-y-6">
                         {/* Name */}
                         <div className="space-y-2">
                              <label className="text-sm font-semibold text-primary">Subcategory Name</label>
                              <Input
                                   type="text"
                                   placeholder="e.g. T-Shirts, Denim Jeans"
                                   {...register("name", { required: "Name is required" })}
                                   className="h-12 border-gray-200 focus:border-secondary focus:ring-secondary transition-all"
                              />
                              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                         </div>

                         {/* Category Selection */}
                         <div className="space-y-2">
                              <label className="text-sm font-semibold text-primary">Parent Category</label>
                              <Select 
                                   value={selectedCategoryId} 
                                   onValueChange={(val) => setValue("categoryId", val)}
                              >
                                   <SelectTrigger className="h-12 border-gray-200">
                                        <SelectValue placeholder="Select a category" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {categories.map((cat: Category) => (
                                             <SelectItem key={cat.id} value={cat.id}>
                                                  {cat.name}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                              {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
                         </div>

                         {/* Description */}
                         <div className="space-y-2">
                              <label className="text-sm font-semibold text-primary">Description</label>
                              <Input
                                   type="text"
                                   placeholder="Brief description of this subcategory"
                                   {...register("description", { required: "Description is required" })}
                                   className="h-12 border-gray-200"
                              />
                              {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                         </div>
                    </div>

                    {/* Right Section - Image Upload */}
                    <div className="space-y-4">
                         <label className="text-sm font-semibold text-primary block">Subcategory Image</label>
                         <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-secondary/50 transition-colors bg-gray-50/30">
                              <div className="relative w-40 h-40 mb-4 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100">
                                   {imagePreview ? (
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                   ) : subcategory?.image ? (
                                        <Image src={subcategory.image} alt="Current" fill className="object-cover" />
                                   ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                             No Image
                                        </div>
                                   )}
                              </div>

                              <label className="w-full">
                                   <div className="text-center cursor-pointer bg-white border border-gray-200 rounded-md py-2 px-4 text-xs font-medium hover:bg-gray-50 transition-colors">
                                        {imagePreview || subcategory?.image ? "Change Image" : "Upload Image"}
                                   </div>
                                   <Input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...register("image", {
                                             onChange: (e) => {
                                                  const file = e.target.files?.[0]
                                                  if (file) setImagePreview(URL.createObjectURL(file))
                                             }
                                        })}
                                   />
                              </label>
                         </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-3 flex justify-end gap-3 pt-6 border-t border-gray-100">
                         <Button
                              type="button"
                              onClick={() => router.back()}
                              variant="outline"
                              className="px-8 border-gray-200 text-gray-600 hover:bg-gray-50"
                         >
                              Cancel
                         </Button>
                         <Button 
                              disabled={loading} 
                              type="submit" 
                              className="px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                         >
                              {loading ? <Loading /> : (mode === "update" ? "Update Subcategory" : "Create Subcategory")}
                         </Button>
                    </div>
               </form>
          </Card>
     )
}

export default SubcategoryForm
