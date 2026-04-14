"use client"

import React from 'react';
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const categories = [
  "Mens",
  "Womans",
  "Shoes",
  "Accessories",
  "Wedding Dresses",
  "Terms ",
]

export default function Navigation_Menu() {
  const pathName = usePathname()

  return (
    <div className='flex md:ml-1 lg:ml-3 md:gap-1 lg:gap-3'>
      {categories.map((item, ind) => (
        <Link href={`/categories/${item}`} key={ind}>
          <Button
            variant={pathName === `/categories/${item}` ? 'secondary' : 'outline'}

          >
            {item}
          </Button>
        </Link>
      ))}
    </div>
  )
}