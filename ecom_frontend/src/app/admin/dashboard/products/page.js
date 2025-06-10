import React from 'react'
import { Products } from './Products'
import { getProducts } from '@/app/api-integeration/product'

const page = async ({searchParams}) => {

    const params = await searchParams
    const data = await getProducts(params)

    return (
        <Products data={data} />
    )
}

export default page
