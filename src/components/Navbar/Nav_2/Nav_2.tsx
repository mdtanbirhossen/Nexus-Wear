"use client"

import React from 'react'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import Link from 'next/link'
import Navigation_Menu from './Navigation_Menu'
import Nav_Search from '../Nav_Search'
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi/categoryApi'

export default function Nav_2() {
  const { data: categoryData } = useGetAllCategoriesQuery({ limit: 6 });
  const categories = categoryData?.data || [];

  return (
    <div className='flex items-center w-full relative z-10'>
      <NavigationMenu className='list-none w-full'> {/* Single NavigationMenu wrapper */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className='bg-black text-white hover:bg-black hover:text-white'>All categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-2 p-4">
              {categories.map((item: any) => (
                <li key={item.id}>
                  <NavigationMenuLink asChild>
                    <Link href={`/products?categoryId=${item.id}`} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
              {categories.length === 0 && (
                <li className="text-sm p-2 text-gray-500">No categories found</li>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <div className='w-full'>
          <div className='hidden md:block'>
            <Navigation_Menu></Navigation_Menu>
          </div>
          <div className="w-full md:hidden flex">
            <Nav_Search></Nav_Search>
          </div>
        </div>
      </NavigationMenu>
    </div>
  )
}