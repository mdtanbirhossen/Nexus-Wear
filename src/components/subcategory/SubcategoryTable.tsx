"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
     Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
     Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
     PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
     AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
     AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

// Icons
import { Pencil, Trash, Eye } from "lucide-react"

// Redux
import { useDeleteSubCategoryMutation, useGetAllSubCategoriesQuery } from "@/redux/api/subCategoryApi/subCategoryApi"
import { Subcategory } from "@/types/categoryAndSubcategory"
import Loading from "../shared/Loading"

export default function SubcategoryTable() {
     // State
     const [currentPage, setCurrentPage] = useState(1)
     const [itemsPerPage, setItemsPerPage] = useState(10)
     const [searchTerm, setSearchTerm] = useState("")
     const [statusFilter, setStatusFilter] = useState("all")
     const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)

     React.useEffect(() => {
          const timeout = setTimeout(() => {
               setDebouncedSearch(searchTerm)
          }, 500)
          return () => clearTimeout(timeout)
     }, [searchTerm])

     const router = useRouter()

     // API calls
     const { data, isLoading } = useGetAllSubCategoriesQuery({
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          status: statusFilter === "all" ? undefined : statusFilter,
     })

     const [deleteSubCategory, { isLoading: isDeleting }] = useDeleteSubCategoryMutation()

     // Data
     const subcategories: Subcategory[] = data?.data || []
     const total = data?.total || 0
     const totalPages = Math.ceil(total / itemsPerPage)

     // Handlers
     const handleDelete = async (subCategoryId: string) => {
          if (subCategoryId) {
               try {
                    await deleteSubCategory(subCategoryId).unwrap()
               } catch (error) {
                    console.error("Delete failed", error)
               }
          }
     }

     return (
          <div className="w-full pb-6">
               <div className="flex flex-wrap gap-3 items-center justify-between mb-4 w-auto">
                    <Input
                         placeholder="Search subcategories..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full md:max-w-sm"
                    />

                    <div className="flex gap-3 items-center">
                         <Select value={String(itemsPerPage)} onValueChange={(val) => {
                              setItemsPerPage(Number(val))
                              setCurrentPage(1)
                         }}>
                              <SelectTrigger className="">
                                   <SelectValue placeholder="Rows" />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="5">5</SelectItem>
                                   <SelectItem value="10">10</SelectItem>
                                   <SelectItem value="20">20</SelectItem>
                              </SelectContent>
                         </Select>

                         <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger className="">
                                   <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="all">All</SelectItem>
                                   <SelectItem value="active">Active</SelectItem>
                                   <SelectItem value="inactive">Inactive</SelectItem>
                                   <SelectItem value="pending">Pending</SelectItem>
                                   <SelectItem value="deleted">Deleted</SelectItem>
                              </SelectContent>
                         </Select>

                         <Button 
                              onClick={() => router.push("/management/sub-categories/create")}
                              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                         >
                              Add Subcategory
                         </Button>
                    </div>
               </div>

               {/* Table */}
               <div className="overflow-hidden rounded-md border text-center">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead className="text-center font-extrabold text-secondary">*</TableHead>
                                   <TableHead className="font-extrabold text-secondary">Image</TableHead>
                                   <TableHead className="text-center font-extrabold text-secondary">Name</TableHead>
                                   <TableHead className="text-center font-extrabold text-secondary">Parent Category</TableHead>
                                   <TableHead className="text-center font-extrabold text-secondary">Description</TableHead>
                                   <TableHead className="text-center font-extrabold text-secondary">CreatedAt</TableHead>
                                   <TableHead className="text-center font-extrabold text-secondary">Actions</TableHead>
                              </TableRow>
                         </TableHeader>

                         <TableBody>
                              {isLoading ? (
                                   <TableRow>
                                        <TableCell colSpan={7} className="w-full py-6">
                                             <Loading />
                                        </TableCell>
                                   </TableRow>
                              ) : subcategories.length ? (
                                   subcategories.map((sub, idx) => (
                                        <TableRow key={sub.id}>
                                             <TableCell>
                                                  {(currentPage - 1) * itemsPerPage + idx + 1}
                                             </TableCell>

                                             <TableCell>
                                                  <Image
                                                       src={sub.image ?? "/profileImg.jpg"}
                                                       alt="images"
                                                       width={50}
                                                       height={50}
                                                       quality={75}
                                                       className="h-12 w-12 object-contain"
                                                       draggable={false}
                                                  />
                                             </TableCell>

                                             <TableCell>{sub.name}</TableCell>
                                             <TableCell>
                                                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                                                       {sub.category?.name || "N/A"}
                                                  </span>
                                             </TableCell>
                                             <TableCell>{sub.description.slice(0, 20) + "...."}</TableCell>
                                             <TableCell>{sub.createdAt.slice(0, 10)}</TableCell>
                                             
                                             <TableCell>
                                                  <Button
                                                       onClick={() => router.push(`/management/sub-categories/update/${sub.id}`)}
                                                       variant="ghost"
                                                       className="h-8 w-8 p-0"
                                                  >
                                                       <Pencil className="h-4 w-4" />
                                                  </Button>

                                                  <Button
                                                       onClick={() => router.push(`/management/sub-categories/details/${sub.id}`)}
                                                       variant="ghost"
                                                       className="h-8 w-8 p-0"
                                                  >
                                                       <Eye className="h-4 w-4" />
                                                  </Button>

                                                  <AlertDialog>
                                                       <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" disabled={isDeleting}>
                                                                 <Trash className="h-4 w-4" />
                                                            </Button>
                                                       </AlertDialogTrigger>

                                                       <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                 <AlertDialogDescription>
                                                                      This action cannot be undone. This will permanently delete the subcategory.
                                                                 </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                 <AlertDialogAction
                                                                      disabled={isDeleting}
                                                                      onClick={() => handleDelete(sub.id)}
                                                                      className="bg-red-600 font-extrabold text-white"
                                                                 >
                                                                      Continue
                                                                 </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                       </AlertDialogContent>
                                                  </AlertDialog>
                                             </TableCell>
                                        </TableRow>
                                   ))
                              ) : (
                                   <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6">
                                             No results found.
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </div>

               {/* Pagination */}
               <div className="mt-4 flex justify-center">
                    <Pagination>
                         <PaginationContent>
                              <PaginationItem>
                                   <PaginationPrevious
                                        href="#"
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                   />
                              </PaginationItem>

                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                   <PaginationItem key={page}>
                                        <PaginationLink
                                             href="#"
                                             isActive={currentPage === page}
                                             onClick={() => setCurrentPage(page)}
                                        >
                                             {page}
                                        </PaginationLink>
                                   </PaginationItem>
                              ))}

                              {totalPages > 5 && <PaginationEllipsis />}

                              <PaginationItem>
                                   <PaginationNext
                                        href="#"
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                   />
                              </PaginationItem>
                         </PaginationContent>
                    </Pagination>
               </div>
          </div>
     )
}
