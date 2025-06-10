'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from '@/app/(home)/styles/navbar1.module.css'
import Link from 'next/link'
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoMdHeartEmpty } from "react-icons/io";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { GoPerson } from "react-icons/go";
import Menu from './Menu';
// import Cart from './Cart';
import { IoSearchOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { usePathname } from 'next/navigation';
// import Search from './search';
import Image from 'next/image';
import { MdOutlineLocalShipping } from "react-icons/md";
import Cart from './Cart';
import { useSelector } from 'react-redux';
import { selectCart } from '@/app/store/cartSlice';

const Navbar1 = ({ user }) => {

  const [menu, setMenu] = useState(false);
  const [cartSlider, setCartSlider] = useState(false);
  const pathname = usePathname();
  const [searchPopup, setSearchPopup] = useState(false);
  const { cart } = useSelector(selectCart);

  return (
    <>
      <header className={`${styles.header}`} >
        {pathname === "/checkout/" ? null : <div className={`${styles.promo} ${styles.promo2}`}>
          <p><MdOutlineLocalShipping /> Free Shipping</p>
        </div>}
        <nav className={`${styles.navbar}`}>
          <div className="d-flex align-items-center" style={{ gap: "8px" }}>
            {pathname === "/checkout/" ? null :
              <>
                <div className={styles.menu} onClick={() => { setMenu(true) }}>
                  <HiOutlineMenuAlt2 />
                  <span>Menu</span>
                </div>
                <div className={`${styles.icon} ${styles.sm_block}`} onClick={() => { setSearchPopup(true) }}>
                  <IoSearchOutline />
                </div>
              </>}
            <Link href="/" className={styles.logo} style={pathname === "/checkout/" ? null : { top: "0px" }}>
              <h2>Ecom</h2>
            </Link>
          </div>
          {pathname === "/checkout/" ? null :
            <ul className={`${styles.links} ${menu ? styles.menu : ''}`}>
              <li><Link href="/" className={pathname === "/" ? styles.active : ''}>Home</Link></li>
              <li><Link href="/shop" className={pathname === "/shop/" ? styles.active : ''}>Shop</Link></li>
              <li><Link href="/about" className={pathname === "/about/" ? styles.active : ''} >About Us</Link></li>
              <li><Link href="/contact" className={pathname === "/contact/" ? styles.active : ''} >Contact</Link></li>
            </ul>}

          {pathname === "/checkout/" ? null :
            <div className="d-flex align-items-center">
              <div className={`${styles.icon} ${styles.bag} ${styles.badge}`} total={cart ? cart.length : "0"} onClick={() => { setCartSlider(true) }}>
                <HiOutlineShoppingBag />
              </div>
              <div className={styles.user}>
                <Link href={user ? "/profile" : "/login"} className={styles.icon}>
                  <GoPerson />
                </Link>
                {user && <Link className={styles.profile} href={"/profile"}>
                  {user.name && <h6>
                    {user.name.includes(' ') // Check if space exists
                      ? user.name
                        .split(' ')
                        .slice(0, 2)
                        .map(word => (word.length > 8 ? word.slice(0, 8) + '...' : word))
                        .join(' ')
                      : user.name.length > 8 // If no space, truncate the single word if necessary
                        ? user.name.slice(0, 8) + '...'
                        : user.name}</h6>}
                  <span>View Profile</span>
                </Link>}
              </div>
            </div>}
        </nav>
      </header>
      {/* <Search searchPopup={searchPopup} toggleSearchPopup={setSearchPopup} /> */}
      <Menu user={user} menu={menu} setMenu={setMenu} />
      <Cart open={cartSlider} close={setCartSlider} />
    </>
  )
}

export default Navbar1
