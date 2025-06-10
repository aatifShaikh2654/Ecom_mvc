"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/(home)/styles/checkout.module.css";
import Cart from "@/app/(home)/styles/cart.module.css";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  selectCart,
} from "@/app/store/cartSlice";
import {
  loadCheckout,
  selectCheckoutItems,
} from "@/app/store/checkoutSlice";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "universal-cookie";
import { usePathname, useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { checkout } from "@/app/api-integeration/orders";
import { Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

const Checkout = ({ user }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { items, source } = useSelector(selectCheckoutItems);
  const { cart, total } = useSelector(selectCart);
  const [Error, setError] = useState(null);
  const country = Country.getCountryByCode("IN");
  const stateOptions = State.getStatesOfCountry("IN").map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));
  const [cityOptions, setCityOptions] = useState([]);

  const url = process.env.API_URL;
  const cookies = new Cookies();
  const token = cookies.get("token")
  const SECRET_KEY = process.env.COOKIE_SECRET || "default_secret_key";
  // Utility: Encrypt data
  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  };

  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Decryption failed:", error);
      return [];
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      country: country.name,
      name: user?.name,
      email: user?.email,
      phone: user?.phone
    },
  });

  const data = watch();

  useEffect(() => {
    dispatch(loadCheckout());
  }, [dispatch]);

  const onSubmit = async (data) => {
    if(token){
      data.type = source;
      data.product = items.item?.product
      data.quantity = items.item?.quantity
      data.total = source === "cart" ? total : (items.item?.price * items.quantity).toFixed(2);
      const json = await checkout(data);
      if (json.success) {
        toast.success(json.message)
        router.push(`/order-confirm?id=${json.data.id}`)
      } else {
        toast.error(json.message)
      }
    } else {
      router.push("/login/?redirect=/checkout/")
    }
  }



  const returnItems = () => {
    if (source === "cart") {
      return cart && cart.length > 0
        ? cart.map((item, index) => {
          return (
            <div className={Cart.item} key={index}>
              <Link
                href={`/shop/${items?.product?.category?.name}/${item?.product?.slug}/`}
                className={Cart.image}
              >
                {item?.product?.images && item?.product?.images.length > 0 && <Image
                  src={
                    process.env.IMAGE_URL + item.product.images[0]
                  }
                  width={70}
                  height={70}
                  alt=""
                  className="img-fluid"
                />}
              </Link>
              <div className={Cart.product_content}>
                <Link
                  href={`/shop/${items?.product?.category?.name}/${item?.product?.slug}/`}
                >
                  <h6>{item?.product?.name}</h6>
                </Link>
                <span className={Cart.price}>
                  &#8377; {(item?.product?.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })
        : null;
    } else if (source === "buynow") {
      return (
        items.item && (
          <div className={Cart.item}>
            <Link
              href={`/shop/${items.item?.category?.name}/${items.item?.slug}/`}
              className={Cart.image}
            >
              {items.item?.images && items.item?.images.length > 0 && <Image
                src={
                  process.env.IMAGE_URL + items.item.images[0]
                }
                width={70}
                height={100}
                alt=""
                className="img-fluid"
              />}
            </Link>
            <div className={Cart.product_content}>
              <Link
                href={`/shop/${items.item?.category?.name}/${items.item?.slug}/`}
              >
                <h6>{items.item?.name}</h6>
              </Link>
              <span className={Cart.price}>
                &#8377; {(items.item?.price * items.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        )
      );
    } else {
      return null;
    }
  };

  const handleStateChange = (state) => {
    setValue("state", state.label);
    const cities = City.getCitiesOfState("IN", state.value).map((city) => ({
      value: city.name,
      label: city.name,
    }));
    setCityOptions(cities);
  };

  return (
    <div className={`${styles.container} container-fluid padd-x`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${styles.container1} row`}>
          <div className={`${styles.section1} col-lg-7 col-12`}>
            <h1 className="mb-4">Checkout</h1>

            <div className="row">
              <div className="col-12">
                <div className="input-field">
                  <label htmlFor="name">Name</label>
                  <div className="input">
                    <input
                      type="text"
                      placeholder="Enter your Name"
                      id="name"
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-red-500 text-xs">
                      {errors.name.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-sm-6">
                <div className="input-field">
                  <label htmlFor="email">Email Address</label>
                  <div className="input">
                    <input
                      type="email"
                      placeholder="Enter your Email"
                      id="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-red-500 text-xs">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="col-sm-6">
                <div className="input-field">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input">
                    <input
                      type="text"
                      placeholder="Enter your Phone Number"
                      id="phone"
                      {...register("phone", {
                        required: "Phone Number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-red-500 text-xs">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="input-field">
              <label htmlFor="address">Address</label>
              <div className="input">
                <textarea
                  name="address"
                  id="address"
                  placeholder="Enter your Address"
                  rows={1}
                  {...register("address", { required: "Address is required" })}
                ></textarea>
              </div>
              {errors.address && (
                <span className="text-red-500 text-xs">
                  {errors.address.message}
                </span>
              )}
            </div>

            <div className="row">
              <div className="col-sm-6 col-12">
                <div className="input-field">
                  <label htmlFor="country">Country</label>
                  <div className="input">
                    <input
                      type="text"
                      placeholder="Enter your Country"
                      id="country"
                      disabled
                      {...register("country", {
                        required: "Country is required",
                      })}
                    />
                  </div>
                  {errors.country && (
                    <span className="text-red-500 text-xs">
                      {errors.country.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-sm-6 col-12">
                <div className="input-field">
                  <label>State</label>
                  <Select
                    options={stateOptions}
                    value={{ label: data.state }}
                    onChange={handleStateChange}
                    placeholder="Select State"
                    className="w-100"
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="col-sm-6 col-12">
                <div className="input-field">
                  <label>City</label>
                  <Select
                    options={cityOptions}
                    value={{ label: data.city }}
                    onChange={(value) => setValue("city", value.label)}
                    placeholder="Select City"
                    className="w-100"
                    classNamePrefix="select"
                  />
                </div>
              </div>
              <div className="col-sm-6 col-12">
                <div className="input-field">
                  <label htmlFor="Pin-code">Pin Code</label>
                  <div className="input">
                    <input
                      type="text"
                      placeholder="Enter pin code"
                      id="Pin-code"
                      {...register("pincode", {
                        required: "Pin code is required",
                      })}
                    />
                  </div>
                  {errors.pincode && (
                    <span className="text-red-500 text-xs">
                      {errors.pincode.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.section2} col-lg-5`}>
            <div className={`${styles.cart} pt-4`}>
              <h4 className="mt-12 mb-3">Review your cart</h4>
              <div className={styles.cart_list}>{returnItems()}</div>
            </div>
            <div className={`${styles.payment}`}>
              <div className={`${styles.totals}`}>
                <table border="1">
                  <tbody>
                    <tr>
                      <th>Total</th>
                      <th className="text-right">
                        &#8377; {source === "cart" ? total : (items.item?.price * items.quantity).toFixed(2)}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              {Error && <span className="text-red-500 text-md">{Error}</span>}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.pay} ${Cart.btn} mb-4`}
              >
                {isSubmitting ? <Loader2 /> : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
