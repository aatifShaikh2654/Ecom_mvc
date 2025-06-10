import React from 'react'
import ProductGrid from '../../components/ProductGrid'

const Category = ({ category, products }) => {

    return (
        <>
            <div className="flex items-center justify-center w-full my-4">
                <h2 className="mb-0  font-bold text-lg">{category?.name}</h2>
            </div>
            <ProductGrid data={products} />
        </>
    )
}

export default Category
