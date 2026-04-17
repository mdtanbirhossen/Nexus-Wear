"use client";
import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi/categoryApi';
import { useGetAllColorsQuery } from '@/redux/api/colorApi/colorApi';
import { ChevronDown, X, Filter, Check } from 'lucide-react';
import { useGetAllsizesQuery } from '@/redux/api/sizeApi/sizeApi';
import { useGetAllSubCategoriesQuery } from '@/redux/api/subCategoryApi/subCategoryApi';
import { Category, Subcategory } from '@/types/categoryAndSubcategory';
import { Color } from '@/types/color';
import { Size } from '@/types/size';

const ProductPageSideBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentCategoryId = searchParams.get('categoryId');
  const currentColorId = searchParams.get('colorId');
  const currentSizeId = searchParams.get('sizeId');
  const currentMinPrice = searchParams.get('minPrice');
  const currentSubCategoryId = searchParams.get('subcategoryId');

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    subcategories: true,
    colors: true,
    sizes: true,
    prices: true
  });

  // Fetch real data
  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 50 });
  const { data: colorsData } = useGetAllColorsQuery({ limit: 50 });
  const { data: sizesData } = useGetAllsizesQuery({ limit: 50 });
  const { data: subcategoriesData } = useGetAllSubCategoriesQuery(
    { categoryId: currentCategoryId as string, limit: 50 },
    { skip: !currentCategoryId }
  );

  const categories = categoriesData?.data || [];
  const colors = colorsData?.data || [];
  const sizes = sizesData?.data || [];
  const subcategories = subcategoriesData?.data || [];

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const priceRanges = [
    { label: 'Under 1000', min: 0, max: 1000 },
    { label: '1000 - 5000', min: 1000, max: 5000 },
    { label: '5000 - 10000', min: 5000, max: 10000 },
    { label: '10000+', min: 10000, max: 1000000 },
  ];


  return (
    <div className="w-full bg-white p-6 border rounded-lg shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-primary uppercase tracking-tight">
          <Filter className="w-4 h-4 text-secondary" />
          Catalogue
        </h2>
        <button 
          onClick={clearAllFilters}
          className="text-xs font-bold text-gray-400 hover:text-secondary uppercase transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative">
          <input 
            type="text"
            placeholder="Search items..."
            defaultValue={searchParams.get('search') || ''}
            onChange={(e) => {
               const val = e.target.value;
               const timeout = setTimeout(() => {
                  updateFilter('search', val || null);
               }, 500);
               return () => clearTimeout(timeout);
            }}
            className="w-full bg-gray-50 border border-gray-100 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
          />
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <div className="flex justify-between items-center cursor-pointer group" onClick={() => toggleSection('categories')}>
          <h3 className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-secondary transition-colors">Categories</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.categories ? 'rotate-180' : ''}`} />
        </div>
        {openSections.categories && (
          <div className="pt-3 space-y-2">
            {categories.map((cat: Category) => (
              <div 
                key={cat.id} 
                onClick={() => updateFilter('categoryId', cat.id.toString() === currentCategoryId ? null : cat.id.toString())}
                className={`text-sm cursor-pointer flex items-center gap-2 hover:translate-x-1 transition-transform ${currentCategoryId === cat.id.toString() ? 'text-secondary font-bold' : 'text-gray-600'}`}
              >
                 <div className={`w-1.5 h-1.5 rounded-full ${currentCategoryId === cat.id.toString() ? 'bg-secondary' : 'bg-gray-200'}`} />
                 {cat.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subcategories (Dynamic) */}
      {currentCategoryId && subcategories.length > 0 && (
        <div className="mb-6 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center cursor-pointer group" onClick={() => toggleSection('subcategories')}>
            <h3 className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-secondary transition-colors">Collections</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.subcategories ? 'rotate-180' : ''}`} />
            </div>
            {openSections.subcategories && (
            <div className="pt-3 space-y-2">
                {subcategories.map((sub: Subcategory) => (
                <div 
                    key={sub.id} 
                    onClick={() => updateFilter('subcategoryId', sub.id.toString() === currentSubCategoryId ? null : sub.id.toString())}
                    className={`text-sm cursor-pointer flex items-center gap-2 hover:translate-x-1 transition-transform ${currentSubCategoryId === sub.id.toString() ? 'text-secondary font-bold' : 'text-gray-500'}`}
                >
                    <div className={`w-3 h-3 border rounded-sm flex items-center justify-center transition-colors ${currentSubCategoryId === sub.id.toString() ? 'bg-secondary border-secondary' : 'bg-white border-gray-200 group-hover:border-secondary'}`}>
                        {currentSubCategoryId === sub.id.toString() && <Check className="w-2.5 h-2.5 text-secondary-foreground" />}
                    </div>
                    {sub.name}
                </div>
                ))}
            </div>
            )}
        </div>
      )}

      {/* Colors */}
      <div className="mb-6">
        <div className="flex justify-between items-center cursor-pointer group" onClick={() => toggleSection('colors')}>
          <h3 className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-secondary transition-colors">Colors</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.colors ? 'rotate-180' : ''}`} />
        </div>
        {openSections.colors && (
          <div className="pt-3 flex flex-wrap gap-2">
            {colors.map((color: Color) => (
              <button
                key={color.id}
                onClick={() => updateFilter('colorId', color.id.toString() === currentColorId ? null : color.id.toString())}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-tighter rounded-full border transition-all ${currentColorId === color.id.toString() ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-600 border-gray-100 hover:border-secondary'}`}
              >
                {color.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <div className="flex justify-between items-center cursor-pointer group" onClick={() => toggleSection('sizes')}>
          <h3 className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-secondary transition-colors">Sizes</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.sizes ? 'rotate-180' : ''}`} />
        </div>
        {openSections.sizes && (
          <div className="pt-3 flex flex-wrap gap-2">
            {sizes.map((size: Size) => (
              <button
                key={size.id}
                onClick={() => updateFilter('sizeId', size.id.toString() === currentSizeId ? null : size.id.toString())}
                className={`w-10 h-10 flex items-center justify-center text-xs font-bold uppercase border transition-all ${currentSizeId === size.id.toString() ? 'bg-secondary text-secondary-foreground border-secondary shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-primary hover:text-primary'}`}
              >
                {size.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex justify-between items-center cursor-pointer group" onClick={() => toggleSection('prices')}>
          <h3 className="text-xs font-black uppercase tracking-widest text-primary group-hover:text-secondary transition-colors">Price Range</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.prices ? 'rotate-180' : ''}`} />
        </div>
        {openSections.prices && (
          <div className="pt-3 space-y-2">
            {priceRanges.map((range) => (
              <div 
                key={range.label}
                onClick={() => {
                  updateFilter('minPrice', currentMinPrice === range.min.toString() ? null : range.min.toString());
                  updateFilter('maxPrice', currentMinPrice === range.min.toString() ? null : range.max.toString());
                }}
                className={`text-sm cursor-pointer hover:text-primary transition-colors flex justify-between items-center ${currentMinPrice === range.min.toString() ? 'text-primary font-bold' : 'text-gray-500'}`}
              >
                <span>{range.label}</span>
                {currentMinPrice === range.min.toString() && <X className="w-3 h-3 text-secondary" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPageSideBar;