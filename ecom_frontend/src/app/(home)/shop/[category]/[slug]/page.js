import { getSingleProduct } from '@/app/api-integeration/product'
import React from 'react'
import Detail from './Detail';
import { notFound } from 'next/navigation';

const page = async ({ params, searchParams }) => {

    const { slug } = await params;
    const searchP = await searchParams;
    const data = await getSingleProduct(slug)

    if(!data.success){
        notFound()
    }

    return (
        <Detail data={data?.data} />
    )
}

export default page
