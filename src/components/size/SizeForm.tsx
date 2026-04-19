"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// UI Components
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// Redux API

import { Size} from "@/types/size";
import { useCreateSizeMutation, useGetSizeByIdQuery, useUpdateSizeDetailsMutation } from "@/redux/api/sizeApi/sizeApi";
import Loading from "../shared/Loading";

const SizeForm = () => {
     /* ---------------------- State & Hooks ---------------------- */

     const { id } = useParams();
     const router = useRouter();
     const pathname = usePathname();
     const formattedText = pathname.includes("/update") ? "update" : "create";
     const [loading, setLoading] = useState(false)

     /* ---------------------- API Calls ---------------------- */
     const { data: size } = useGetSizeByIdQuery(id);
     const [createSize] = useCreateSizeMutation();
     const [updateSizeDetails] = useUpdateSizeDetailsMutation();

     const sizeInfo: Size | undefined = size;


     /* ---------------------- Form Setup ---------------------- */
     const {
          handleSubmit,
          register,
          formState: { errors },
          reset,
     } = useForm<Size>();

     
     useEffect(() => {
          if (sizeInfo && formattedText === "update") {
               reset({
                    name: sizeInfo.name || "",
                    description: sizeInfo.description || "",
               });
          }
     }, [sizeInfo, reset, formattedText]);



     /* ---------------------- Submit Handler ---------------------- */
     const onSubmit: SubmitHandler<Size> = async (data) => {
          setLoading(true)
          const formData = new FormData();

          formData.append("name", data.name);
          formData.append("description", data.description);

          try {
               if (formattedText === "create") {
                    await createSize(formData).unwrap();
                    toast.success(`size created successfully`);
               } else {
                    await updateSizeDetails({ formData, sizeId: id }).unwrap();
                    toast.success(`size updated successfully`);
               }
               router.push("/management/size");
          } catch (err) {
               console.error("Failed to save size:", err);
               toast.error("Failed to save size");
          } finally {
               setLoading(false)
          }
     };

     /* ---------------------- JSX ---------------------- */
     return (
          <Card className="p-4 rounded-sm gap-4 shadow-none">
               <h1 className="text-xl font-semibold text-primary">
                    {formattedText === "update" ? "Update Size Info" : "Create Size"}
               </h1>

               <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white grid grid-cols-1 md:grid-cols-3 gap-4"
               >
                    {/* Left Section - Form Inputs */}
                    <Card className="md:col-span-3 p-4 gap-2 rounded-sm shadow-none">
                         {/* Name */}
                         <div>
                              <label className="block text-sm font-medium mb-1 text-primary">Size Name</label>
                              <Input
                                   type="text"
                                   placeholder="Enter size Name"
                                   {...register("name", { required: "Name is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.name && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.name.message}
                                   </p>
                              )}
                         </div>

                         {/* description */}
                         <div>
                              <label className="block text-sm font-medium mb-1 text-primary">Size Description</label>
                              <Input
                                   type="text"
                                   placeholder="Enter size Description"
                                   {...register("description", { required: "description is required" })}
                                   className="h-12 w-full border border-gray-300 rounded-md"
                              />
                              {errors.description && (
                                   <p className="text-red-500 text-sm mt-1">
                                        {errors.description.message}
                                   </p>
                              )}
                         </div>


                    </Card>


                    {/* Action Buttons */}
                    <div className="md:col-span-3 flex justify-end gap-2">
                         <Button
                              type="button"
                              onClick={() => router.back()}
                              className="bg-gray-600"
                         >
                              Go Back
                         </Button>
                         <Button 
                              disabled={loading} 
                              type="submit" 
                              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                         >
                               {
                                    loading ? <Loading /> : formattedText === "update" ? "Update" : "Create"
                               }
                          </Button>
                    </div>
               </form>
          </Card>
     );
};

export default SizeForm;
