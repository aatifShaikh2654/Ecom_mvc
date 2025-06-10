import React from 'react'
import Add from './Add'
import { getCategory } from '@/app/api-integeration/product'

const page = async () => {

    const category = await getCategory();

    return (
        <Add category={category?.data} />
    )
}

export default page
