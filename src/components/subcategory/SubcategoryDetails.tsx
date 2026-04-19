"use client"

import { useParams, useRouter } from "next/navigation"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "../ui/card"
import Image from "next/image"
import { useGetSubCategoryByIdQuery } from "@/redux/api/subCategoryApi/subCategoryApi"
import Loading from "../shared/Loading"

const SubcategoryDetails = () => {
     const { id } = useParams()
     const { data, isLoading, isError } = useGetSubCategoryByIdQuery(id)
     const router = useRouter()

     if (isLoading) return <div className="flex items-center justify-center w-full h-[calc(100vh-100px)]"><Loading /></div>
     if (isError) return <p className="text-center py-10 text-red-500">Failed to load subcategory details.</p>
     if (!data) return <p className="text-center py-10">No subcategory found</p>

     const tableData = [
          { label: "Name", value: data.name },
          { label: "Parent Category", value: data.category?.name || "N/A" },
          { label: "Description", value: data.description },
          { label: "Created At", value: new Date(data.createdAt).toLocaleString() },
          { label: "Updated At", value: new Date(data.updatedAt).toLocaleString() },
     ]

     return (
          <Card className="w-full p-6 bg-white rounded-lg shadow-none border border-gray-100">
               <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                    {/* Image Section */}
                    <div className="w-full md:w-1/3 aspect-square relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                         <Image
                              src={data.image ?? "/profileImg.jpg"}
                              alt={data.name}
                              width={400}
                              height={400}
                              quality={90}
                              className="object-contain w-full h-full p-4"
                         />
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 w-full">
                         <h1 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                              Subcategory Details
                              <span className="text-sm font-medium bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                                   ID: {id}
                              </span>
                         </h1>
                         
                         <div className="overflow-hidden rounded-lg border border-gray-200">
                              <table className="w-full border-collapse text-left">
                                   <tbody>
                                        {tableData.map((item, idx) => (
                                             <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                                                  <td className="font-bold text-primary p-4 border-r border-gray-200 w-1/3 text-sm uppercase tracking-wider">
                                                       {item.label}
                                                  </td>
                                                  <td className="p-4 text-gray-700 font-medium">
                                                       {item.value}
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         </div>

                         <div className="mt-8 flex gap-3">
                              <Button 
                                   variant="outline" 
                                   onClick={() => router.back()}
                                   className="border-gray-200 text-gray-600 px-8"
                              >
                                   Go Back
                              </Button>
                              <Button 
                                   onClick={() => router.push(`/management/sub-categories/update/${id}`)}
                                   className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8"
                              >
                                   Edit Details
                              </Button>
                         </div>
                    </div>
               </div>
          </Card>
     )
}

export default SubcategoryDetails
