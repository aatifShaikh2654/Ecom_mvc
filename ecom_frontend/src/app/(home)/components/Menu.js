import React, { useEffect, useState } from 'react'
import styles from '@/app/(home)/styles/menu.module.css'
import { IoCloseOutline } from "react-icons/io5";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoPerson } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";
import { GoHome } from "react-icons/go";
import { BsShopWindow } from "react-icons/bs";
import { RiContactsBook3Line } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi2";

const Menu = ({ user, menu, setMenu }) => {

    const pathname = usePathname();

    return (
        <div className={styles.menuBar}>
            <div className={`${styles.backdrop} ${menu ? styles.menu : ''}`} onClick={() => { setMenu(false) }}></div>
            <ul className={`${styles.links} ${menu ? styles.menu : ''}`}>
                <div className="d-flex align-items-end justify-content-end w-full">
                    <div className={`${styles.icon} ${styles.menu} ${styles.active}`}><IoCloseOutline onClick={() => { setMenu(false) }} /></div>
                </div>
                <li><Link href="/" className={pathname === "/" ? styles.active : ''} style={{ display: "flex", alignItems: "center", gap: ".5em" }} onClick={() => { setMenu(false) }}><GoHome /> Home</Link></li>
                <li><Link href="/shop" className={pathname === "/shop/" ? styles.active : ''} style={{ display: "flex", alignItems: "center", gap: ".5em" }} onClick={() => { setMenu(false) }}><BsShopWindow /> Shop</Link></li>
                <li><Link href="/about" className={pathname === "/about/" ? styles.active : ''} style={{ display: "flex", alignItems: "center", gap: ".5em" }} onClick={() => { setMenu(false) }}><HiOutlineUsers /> About Us</Link></li>
                <li><Link href="/contact" className={pathname === "/contact/" ? styles.active : ''} style={{ display: "flex", alignItems: "center", gap: ".5em" }} onClick={() => { setMenu(false) }}><RiContactsBook3Line /> Contact</Link></li>
                <li><Link href="/wishlist" className={pathname === "/wishlist/" ? styles.active : ''} style={{ display: "flex", alignItems: "center", gap: ".5em" }} onClick={() => { setMenu(false) }}><IoMdHeartEmpty /> Wishlist</Link></li>
                <li><Link href={user ? "/profile" : "/login"} className={pathname === "/login" ? styles.active : ''} style={{ display: "flex", alignItems: "center", gap: ".5em" }} onClick={() => { setMenu(false) }}><GoPerson /> Account</Link></li>
            </ul>
        </div>
    )
}

export default Menu
