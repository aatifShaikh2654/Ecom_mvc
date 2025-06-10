import React from 'react'
import Product2 from './Product2'
import styles from '@/app/(home)/styles/section.module.css'

const ProductGrid = ({ data }) => {
    return (
        <div className={styles.section}>
            <div className="row p-3 w-full">
                {data?.data.length > 0 &&
                    data?.data.map((item, index) => {
                        return <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <Product2 data={item} />
                        </div>
                    })}
            </div>
        </div>
    )
}

export default ProductGrid
