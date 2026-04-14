export type Color = {
     id: string;
     name: string;
     description: string;
     image: string | null;
     createdAt: string;
     updatedAt: string;
     deletedAt: string;
}



export type ColorResponse = {
     data: Color[];
     limit: number;
     page: number;
     total: number;
}