"use client";

import React, { useEffect } from "react";
import styles from "@/app/(home)/styles/cart.module.css";
import { IoCloseOutline } from "react-icons/io5";
import Image from "next/image";
import { LuPlus, LuMinus } from "react-icons/lu";
import Link from "next/link";
import { cartDrawer, decreaseQty, fetchCart, increaseQty, removeFromCart, selectCart } from "@/app/store/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { setCheckoutItems } from "@/app/store/checkoutSlice";
import { useRouter } from "next/navigation";

const Cart = ({ open, close }) => {
  const cookies = new Cookies();
  const url = process.env.API_URL;
  const router = useRouter();

  const dispatch = useDispatch();
  const { status, error, openCart, cart, total } = useSelector(selectCart);
  const token = cookies.get("token")

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleCheckout = () => {
    dispatch(setCheckoutItems());
    router.push("/checkout/");
    close(false);
    dispatch(cartDrawer(false));
  };

  // Manage URL state for popup and back button behavior
  useEffect(() => {
    const handlePopState = () => {
      // Close the cart if the back button is pressed while it's open
      if (open || openCart) {
        close(false);
        dispatch(cartDrawer(false));
      }
    };

    // Open the cart: update history state with shallow routing (no page reload)
    if (open || openCart) {
      const currentState = window.history.state;
      if (!currentState || !currentState.cartOpen) {
        window.history.pushState({ ...currentState, cartOpen: true }, 'Cart Open', router.asPath);
      }
    }

    // Listen for back/forward navigation
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [open, openCart, close, dispatch, router]);


  const handleClosePopup = () => {
    close(false);
    dispatch(cartDrawer(false));
    if (window.innerWidth < 499) {
      router.back()
    }
  };

  console.log(cart)

  return (
    <>
      <div
        className={`${styles.backdrop} ${open || openCart ? styles.active : ""}`}
        onClick={handleClosePopup}
      ></div>
      <div className={`${styles.cart} ${open || openCart ? styles.active : ""}`}>
        <div className={styles.head}>
          <h3>Cart</h3>
          <div className={`${styles.icon}`}>
            <IoCloseOutline onClick={handleClosePopup} />
          </div>
        </div>

        <div className={styles.cart_list}>
          {cart && cart.length > 0 ? (
            cart.map((item, index) => (
              <div className={styles.item} key={index}>
                <Link
                  href={`/shop/${item?.product?.slug}/`}
                  className={styles.image}
                >
                  {item?.product?.images && item?.product?.images.length > 0 && <Image
                    src={
                      process.env.IMAGE_URL + item.product.images[0]
                    }
                    width={100}
                    height={100}
                    alt=""
                    className="img-fluid"
                  />}
                </Link>
                <div className={styles.item.product_content}>
                  <Link
                    href={`/shop/${item?.product?.slug}/`}
                  >
                    <h6>{item?.product?.name}</h6>
                  </Link>
                  <span className={styles.price}>
                    &#8377; {(item?.product?.price * item.quantity).toFixed(2)}
                  </span>
                  <div className="quantity">
                    <button
                      className={`svg ${item?.quantity === 1 ? "disabled" : ""}`}
                      onClick={() => {
                        dispatch(decreaseQty(item?.product._id));
                      }}
                      disabled={item?.quantity === 1}
                    >
                      <LuMinus />
                    </button>
                    <input type="number" minLength={0} value={item?.quantity} readOnly />
                    <button
                      className="svg"
                      onClick={() => {
                        dispatch(increaseQty({ id: item?.product?._id, quantity: 1 }));
                      }}
                    >
                      <LuPlus />
                    </button>
                  </div>
                </div>
                <IoCloseOutline
                  className={styles.delete}
                  onClick={() => {
                    dispatch(removeFromCart(item.product._id));
                  }}
                />
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              <p>Your cart is empty. Please add items to the cart.</p>
            </div>
          )}
        </div>

        {cart && cart.length > 0 ? (
          <div className={styles.bottom}>
            <div className={styles.total}>
              <h5>Subtotal</h5>
              <h5 style={{ fontWeight: "500" }}>GBP {total.toFixed(2)}</h5>
            </div>
            <button onClick={handleCheckout} className={styles.btn}>
              Checkout
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Cart;
