"use client"

import React from 'react';
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi/categoryApi';

export default function Navigation_Menu() {
  const pathName = usePathname()
  const { data: categoryData, isLoading } = useGetAllCategoriesQuery({ limit: 6 });
  const categories = categoryData?.data || [];

  if (isLoading) return <div className='flex md:ml-1 lg:ml-3 md:gap-1 lg:gap-3'><Button variant="ghost" disabled>Loading...</Button></div>;

  return (
    <div className='flex md:ml-1 lg:ml-3 md:gap-1 lg:gap-3 overflow-x-auto scrollbar-hide'>
      {categories.map((item: any) => {
        const decodedPath = decodeURIComponent(pathName);
        const isActive = decodedPath === `/products/${item.name.toLowerCase()}` || decodedPath === `/products/${item.name}`;
        return (
          <Link href={`/products?categoryId=${item.id}`} key={item.id}>
            <Button
              variant={isActive ? 'secondary' : 'outline'}
              className="whitespace-nowrap"
            >
              {item.name}
            </Button>
          </Link>
        )
      })}
    </div>
  )
}