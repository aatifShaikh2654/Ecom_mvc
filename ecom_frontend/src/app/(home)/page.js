import Image from "next/image";
import { getCategory, getProducts } from "../api-integeration/product";
import Product2 from "./components/Product2";
import ProductGrid from "./components/ProductGrid";
import Link from "next/link";

export default async function Home({ searchParams }) {

  const params = await searchParams;
  const products = await getProducts(params)
  const categories = await getCategory();

  return (
    <div className="w-full h-full padd-x">
      <div className="d-lg-block d-sm-none">
        <Image src={"/images/banner.webp"} width={1400} height={450} alt="Banner" className="w-full h-full object-cover" />
      </div>
      <div className="d-lg-none d-sm-block">
        <Image src={"/images/banner_mobile.webp"} width={1400} height={1000} alt="Banner" className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center justify-center w-full my-4">
        <h2 className="mb-0  font-bold text-lg">Our Category</h2>
      </div>
      <div className="row justify-center">
        {categories?.data.length > 0 &&
          categories?.data.map((item, index) => {
            return <div key={index} className="col-lg-3 col-md-4 col-sm-6 cool-12">
              <Link href={`/shop/${item.slug}`} className="block rounded-md overflow-hidden">
                <Image src={process.env.IMAGE_URL + item.image} width={500} height={500} className="w-full h-full object-cover" alt={item.name} />
              </Link>
            </div>
          })}
      </div>
      <div className="flex items-center justify-center w-full my-4">
        <h2 className="mb-0  font-bold text-lg">Trending T shirts</h2>
      </div>
      <ProductGrid data={products} />
    </div>
  );
}
