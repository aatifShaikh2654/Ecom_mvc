import React from 'react'
import Orders from './Orders'
import { getOrders } from '@/app/api-integeration/orders'

const page = async ({searchParams}) => {

    const params = await searchParams;
    const data = await getOrders(params);

    console.log(data)
    return (
        <Orders orders={data?.data} />
    )
}

export default page
