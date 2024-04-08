import React, { useState, useEffect } from "react";
import axios from "axios";
import OurBestSellers from "./OurBestSellers";

const Products = () => {
  const [products, setProducts] = useState([]);

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
        console.log(response.data.products)
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="ourBestSellersMainParent">
      {products.map((product) => {
          return (
            <OurBestSellers
              key={product.product_id}
              id={product.product_id}
              title={product.product_name}
              price={product.price}
              image={product.product_image}
            />
          );
        
    
      })}
    </div>
  );
};

export default Products;
