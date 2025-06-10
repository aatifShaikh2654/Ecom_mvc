'use client'
// my-profile/layout.js
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Breadcrumb from '../components/BreadCrumb';
import styles from '@/app/(home)/styles/Profile.module.css'
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { loader } from '@/app/store/loaderSlice';
import { setCartItems, setTotal } from '@/app/store/cartSlice';
import { GoPerson } from "react-icons/go";
import { IoLocationOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineUserDelete } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { BiLogOutCircle } from "react-icons/bi";
import secureLocalStorage from 'react-secure-storage';
import { logoutUser } from '@/app/api-integeration/auth';
import { toast } from '@/lib/toast';

export default function ProfileLayout({ children }) {

  const pathname = usePathname();
  const dispatch = useDispatch();

  const url = process.env.API_URL
  const cookies = new Cookies();
  const token = cookies.get('token');
  const router = useRouter();


  const Logout = async () => {
    try {
      dispatch(loader(true)); // Turn on the loader
      const json = await logoutUser();
      if (json.success) {
        await cookies.remove('checkout_hashData', {
          path: '/',
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        });
        await cookies.remove('checkout_source', {
          path: '/', // Ensure you match the path used when setting the cookie
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production', // Ensure this matches how the cookie was set
        });
        secureLocalStorage.removeItem("cart_hashData")
        dispatch(setCartItems([]))
        dispatch(setTotal(0))
        toast.success("Logout Successfully")
        window.location.href = "/"
      }
    } catch (error) {
      toast.error(error.message)
      console.error(error); // Log any errors
    } finally {
      dispatch(loader(false)); // Turn off the loader
    }
  };

  return (
    <>
      <div className="container-fluid padd-x mt-3 d-flex align-items-center justify-content-center">
        <div className="row h-100 w-100">
          <div className="p-0">
            <Breadcrumb />
          </div>
          {/* Sidebar */}
          <div className={`col-lg-3 ${styles.sidebar} mb-lg-0 mb-3`}>
            <ul className="list-unstyled m-10">
              <li className="mb-1 mt-2 me-1">
                <Link href="/profile" className={pathname === '/profile/' ? styles.active : ''}>
                  <GoPerson /> My Profile</Link>
              </li>
              <li className="mb-1 me-1">
                <Link href="/profile/orders" className={pathname === '/profile/orders' ? styles.active : ''}>
                  <HiOutlineShoppingBag />  My Orders</Link>
              </li>
              <li className="mb-1 me-1">
                <a>
                  <BiLogOutCircle />
                  <span
                    role="button"
                    className=" cursor-pointer"
                    onClick={Logout} // Show modal on click
                  >
                    Logout
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="col-lg-9 d-flex justify-content-center px-lg-2 px-0">
            {children}
          </div>

        </div>
      </div>
    </>
  );
}
