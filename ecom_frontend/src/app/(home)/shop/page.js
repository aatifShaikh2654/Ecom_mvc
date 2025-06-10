import React from 'react'
import Shop from './Shop'
import { getProducts } from '@/app/api-integeration/product';

const page = async ({searchParams}) => {

    const params = await searchParams;
    const products = await getProducts(params)

    return (
        <Shop products={products} />
    )
}

export default page
