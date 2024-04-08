import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { store } from "../productsStore/Store";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux-state/CartState";
import BreadCrumb from "./BreadCrumb";
import "../styles/SinglePage.css";
import { FaShippingFast } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import SPFooter from "./SPFooter";
import { GiCardboardBoxClosed } from "react-icons/gi";

const SinglePage = () => {
  const params = useParams();
  const { id } = params;

  const dispatch = useDispatch()

  const [product, setProduct] = useState(null);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        console.log(token);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        };
        const response = await axios.get(`http://localhost:5050/products/${id}`, config);
        console.log(response)
        if (response.data.success) {
          setProduct(response.data.product);
          
        } else {
          // Handle error if needed
        }
      } catch (error) {
        // Handle error if needed
      }
    };

    fetchProduct();
  }, [id]);

  

  const addItemToCartHandler = (e) => {
    if (product) {
      const { product_id, product_name, price, product_image } = product;
      dispatch(
        cartActions.addItemToCart({
          id: product_id,
          title: product_name,
          price,
          image: product_image,
        })
      );
    }
  };
  



 

 

 

  return (
    <div className="singlePageMainParent">
      <div className="productInfo">
      <div className="bgGrey">
          <BreadCrumb name={product ? product.product_name : ""} />
        </div>
        <div className="productDetails">
          <div className="productImage">
            <img
              src={product ? product.product_image : ""}
              className="singlePageMainPic"
              alt={product ? product.product_name : ""}
            />
          </div>
          <div className="productDescription">
            <h2 className="productName">{product ? product.product_name : ""}</h2>
            <p className="productPrice">${product ? product.price : ""}</p>
            <p className="descriptionText">{product ? product.description : ""}</p>
            <button className="addToCartBtn" onClick={addItemToCartHandler}>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
      <div className="productFeatures uppercase">
        <div className="feature">
          <FaShippingFast className="featureIcon" />
          <p className="featureText">2 DAY DELIVERY</p>
        </div>
        <div className="feature">
          <FaLock className="featureIcon" />
          <p className="featureText">secure checkout</p>
        </div>
        <div className="feature">
          <BsCurrencyDollar className="featureIcon" />
          <p className="featureText">royalty points</p>
        </div>
        <div className="feature">
          <GiCardboardBoxClosed className="featureIcon" />
          <p className="featureText">easy returns</p>
        </div>
      </div>
      <div className="spfooterHold">
        <SPFooter />
      </div>
    </div>
  );
};

export default SinglePage;
