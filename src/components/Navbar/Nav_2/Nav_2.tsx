"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import Navigation_Menu from './Navigation_Menu'
import Nav_Search from '../Nav_Search'
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi/categoryApi'

export default function Nav_2() {
  const { data: categoryData } = useGetAllCategoriesQuery({ limit: 12 });
  const categories = categoryData?.data || [];
  const router = useRouter();

  const handleCategoryClick = (id: string) => {
    router.push(`/products?categoryId=${id}`);
  };

  return (
    <div className='flex items-center w-full gap-2 relative'>
      <div className='flex-shrink-0 text-black'>
        <DropdownMenu>
          <DropdownMenuTrigger className='bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors rounded-md text-sm font-medium flex items-center gap-2 outline-none'>
            All categories
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px] p-2 bg-white shadow-xl border border-gray-100 rounded-lg relative z-[1001]">
            <ul className="grid gap-1">
              {categories.map((item: any) => (
                <li key={item.id}>
                  <DropdownMenuItem
                    onSelect={() => handleCategoryClick(item.id)}
                    className="cursor-pointer rounded-md p-3 text-sm leading-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    {item.name}
                  </DropdownMenuItem>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-sm p-3 text-gray-500 text-center">No categories found</li>
              )}
            </ul>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='flex-1 min-w-0'>
        <div className='hidden md:block'>
          <Navigation_Menu />
        </div>
        <div className="w-full md:hidden flex">
          <Nav_Search />
        </div>
      </div>
    </div>
  )
}