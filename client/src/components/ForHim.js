import React, { useState, useEffect } from "react";
import "../styles/Under20.css";
import axios from "axios";
import { FaShippingFast, FaLock } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import SPFooter from "./SPFooter";
import better from "../assets/better.jpeg";
import u20bg from "../assets/u20bg.png";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@chakra-ui/icons";
import filterBtn from "../assets/filterBtn.png"
const ForHim = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        console.log(token);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        };
        const response = await axios.get("http://localhost:5050/products", config);
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          // Handle error if needed
        }
      } catch (error) {
        // Handle error if needed
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = filter === "all" ? products : products.filter(product => product.category.toLowerCase() === filter);

  const filterShowHandler = () => {
    setShow(!show);
  };
  

  const handleFilterChange = (category) => {
    setFilter(category.toLowerCase());
  };

  const bgAddHandler = (e) => {
    e.target.classList.add("whi");
  };

  const bgRemoveHandler = (e) => {
    e.target.classList.remove("whi");
  };

  return (
    <div className="u20MainParent fof">
      <p className=" bg-white z-50 relative w100vw"> </p>

      <div className="u20Hold">
        <img src={u20bg} className="u20Pic" />
      </div>

      <div className="u20HeadingHold gap-20 justify-center relative flex flex-col">
        <p className="u20Heading">Explore  </p>
        <p className="u20Desc">
          Explore our store's whole range of products
        </p>
      </div>

      <div className="u20BreadCrumbHold absolute text-sm">
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon />}>
          <BreadcrumbItem>
            <Link to={`/`}>Home</Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link to={`/`} href="#">
              Under 20
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="filterSortHold flex flex-row gap-8 absolute text-left">
        <img
          src={filterBtn}
          className=" w-36 cursor-pointer scale"
          alt=""
          onClick={filterShowHandler}

        />
      </div>

      <div className="filterOptionsHold relative">
        {show && (<div className="flex rounded-xl gap-8 flex-col boxSh fof absolute ">
          <p
            className="ml-12 scale cursor-pointer"
            onClick={() => handleFilterChange("Concealer")}
          >
            Concealer
          </p>
          <p
            className="ml-12 scale cursor-pointer"
            onClick={() => handleFilterChange("Lipstick")}
          >
            Lipstick
          </p>
          <p
            className="ml-12 scale cursor-pointer"
            onClick={() => handleFilterChange("Eyeshadow")}
          >
            Eyeshadow
          </p>
          <p
            className="ml-12 scale cursor-pointer"
            onClick={() => handleFilterChange("Foundation")}
          >
            Foundation
          </p>
          <p
            className="ml-12 scale cursor-pointer text-white"
            onClick={() => handleFilterChange("All")}
          >
            All Products
          </p>
        </div>)}
        
      </div>

      {/* Render filtered products */}
      <div className="flex u20prodsHold flex-wrap relative top-96 justify-center text-center">
        {filteredProducts.map((item) => (
          <div key={item.product_id} className="card w-96 bg-base-100 shadow-xl">
            <Link to={`/${item.product_id}`}>
              <figure className="px-10 pt-10">
                <img
                  src={item.product_image}
                  alt=""
                  className="w-32 u20img"
                />
              </figure>
            </Link>
            <div className="card-body items-center text-center">
              <h2 className="mb-1 fof text-lg font-semibold">{item.product_name}</h2>

              <Link to={`/${item.product_id}`}>
                <div className="card-actions">
                  <button className="btn btn-primary knmBtn"
                    onMouseEnter={bgAddHandler}
                    onMouseLeave={bgRemoveHandler}>Know More</button>
                  <p className="btnLine relative bg-black h-8"> </p>
                  <h2 className=" text-xl mb-2 fof u20Price">
                    $15
                  </h2>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="u20Featyres relative">
        <div className="u20FeaturesHold flex flex-row relative">
          <FaShippingFast className="w-16 h-20" />
          <FaLock className="w-12 h-16" />
          <BsCurrencyDollar className="w-16 h-20" />
          <img src={better} className="w-20" alt="Better" />
        </div>

        <div className="u20TextFeatureHold fof flex flex-row relative uppercase">
          <p>2 DAY DELIVERY</p>
          <p>secure checkout</p>
          <p>royalty points</p>
          <p>easy returns</p>
        </div>
      </div>

      <div className="relative u20footer">
        <SPFooter />
      </div>
    </div>
  );
};

export default ForHim;
