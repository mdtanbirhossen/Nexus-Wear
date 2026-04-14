import { Category, Subcategory } from "./categoryAndSubcategory"
import { Color } from "./color"
import { Size } from "./size"

export type Product = {
     id: string,
     deletedAt: string,
     createdAt:string,
     updatedAt:string,
     name: string,
     images: string[],
     file: FileList,
     productCode: string,
     description:string,
     price: number,
     originalPrice?: number,
     rating?: number,
     availability: string,
     category: Category,
     categoryId: number,
     subCategory: Subcategory,
     subcategoryId: number,
     colorIds:string[],
     sizeIds:string[],
     colors: Color[],
     sizes: Size[],
     viewCount: number,
     lastViewedAt: string,
     orderCount: number,
     lastOrderedAt: string
}



export type ProductResponse = {
     data: Product[];
     limit: number;
     page: number;
     total: number;
}