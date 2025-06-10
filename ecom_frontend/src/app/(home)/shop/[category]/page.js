import React from 'react'
import Category from './Category'
import { getProducts, getSingleCategory } from '@/app/api-integeration/product'

const page = async ({ params, searchParams }) => {

    const { category } = await params;
    const searchP = await searchParams;
    searchP.category = category;
    
    const products = await getProducts(searchP)
    const categoryData = await getSingleCategory(category)

    if (!products?.success) {
        return <div className="flex items-center justify-center">
            <h1 className='!text-lg'>No Product Found</h1>
        </div>
    }

    return (
        <Category category={categoryData?.data} products={products} />
    )
}

export default page
