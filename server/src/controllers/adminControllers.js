async function addProducts(req, res) {
  let { product_name, price, description, category, product_image, color_category, brand } = req.body;
  let { pool } = req;
  try {
    let results = await pool
    .request()
    .input("product_name", product_name)
    .input("price", price)
    .input("brand", brand)
    .input("description", description)
    .input("category", category)
    .input("product_image", product_image)
    .input("color_category", color_category)
    .execute("AddProduct");
    console.log(results)

    if(results.rowsAffected[0]>0){
        res.status(200).json({ message: "Product added successfully" });
    } else {
        res.status(500).json({
            message:"An error occurred"

        })
    }
  } catch (error) {
    res.status(500).json({
        message:"An error occurred",
        error: error
    })
  }
  
 
}

module.exports = {
    addProducts
}