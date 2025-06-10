import React from 'react'
import { Categories } from './Categories'
import { getCategory } from '@/app/api-integeration/product'

const page = async ({searchParams}) => {

  const params = await searchParams
  const data = await getCategory(params)

  return (
    <Categories data={data?.data} />
  )
}

export default page
