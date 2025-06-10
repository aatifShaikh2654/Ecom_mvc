import React from 'react'
import Add from '../add/Add'
import { getCategory, getSingleProduct } from '@/app/api-integeration/product';

const page = async ({ searchParams }) => {

    const params = await searchParams
    const category = await getCategory();
    const product = await getSingleProduct(params?.slug);

    return (
        <Add
            type="edit"
            category={category?.data}
            product={product?.data}
        />
    )
}

export default page
