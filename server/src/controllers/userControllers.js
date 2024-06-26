const axios = require('axios');
const { tokenVerifier } = require('../utils/token');

async function getAllProducts(req, res) {

    let { pool } = req;

    try {
        let products = await pool.request().execute("GetAllProducts");
        res.status(200).send({
            success: true,
            message: "Products retrieved successfully",
            products: products.recordsets[0]
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });
    }
}

async function getProductById(req, res) {

    let { pool } = req

    const { id } = req.params

    try {
        let product = await pool.request()
            .input("product_id", id)
            .execute("GetProductById")

        if (product.recordset.length > 0) {
            res.status(200).send({
                success: true,
                message: "Product retrieved successfully",
                product: product.recordset[0]
            });
        } else {
            res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });
    }
}


async function getProductsByCategory(req, res) {

    let { pool } = req

    const { category } = req.params

    try {
        let products = await pool.request()
            .input("category", category)
            .execute("GetProductsByCategory")
        console.log(products)

        if (products.recordset.length > 0) {
            res.status(200).send({
                success: true,
                message: "Products retrieved successfully",
                products: products.recordset
            });
        } else {
            res.status(404).send({
                success: false,
                message: "Products not found",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });
    }
}

async function getProductsByBrand(req, res) {

    let { pool } = req

    const { brand } = req.params


    try {
        let products = await pool.request()
            .input("brand", brand)
            .execute("GetProductsByBrand")
        console.log(products)

        if (products.recordset.length > 0) {
            res.status(200).send({
                success: true,
                message: "Products retrieved successfully",
                products: products.recordset
            });
        } else {
            res.status(404).send({
                success: false,
                message: "Products not found",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });
    }
}

async function editUserDetails(req, res) {
    let { pool } = req;
    const userId = req.user.user.user_id;

    const {
        username,
        email,
        password,
        name,
        profilePic,
        skinTone
    } = req.body;

    try {
        const result = await pool.request()
            .input('userId', userId)
            .input('newUsername', username)
            .input('newEmail', email)
            .input('newPassword', password)
            .input('newName', name)
            .input('newProfilePic', profilePic)
            .input('newSkinTone', skinTone)
            .execute('editUser');

        console.log(result)
        if (result.rowsAffected[0] > 0) {
            res.status(200).send({
                success: true,
                message: 'User details updated successfully'
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'User not found or unable to update details'
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'An error occurred while updating user details',
            error: error.message
        });
    }
}


async function searchProductsByName(req, res) {
    let { pool } = req
    const product_name = req.params.term;

    try {
        let products = await pool.request()
            .input('product_name', product_name)
            .execute('SearchProductsByName')

        res.json({
            success: true,
            message: "Searched users successfully",
            data: products.recordset
        })

    } catch (error) {
        res.json({
            success: false,
            message: "An error occurred",
            error: error
        })
    }

}

async function recommendProductsBySkinTone(req, res) {
    let { pool } = req
    const skin_tone = req.user.user.skin_tone


    try {
        let products = await pool.request()
            .input('skin_tone', skin_tone)
            .execute('RecommendProductsBySkinTone')

        res.json({
            success: true,
            message: "Recommended Products retrieved successfully",
            products: products.recordsets[0]
        })

    } catch (error) {
        res.json({
            success: false,
            message: "An error occurred",
            error: error
        })
    }

}


async function getSkintone(req, res) {
   const { image_url } = req.body
    try {
        let colorCode;
        const response = await axios.post('http://127.0.0.1:8000/myapp/process-image/', {
            image_url: image_url
        });
         colorCode = response.data.faces[0].dominant_colors[0].color;
        console.log(colorCode)
        let { pool } = req
    
    const colorRanges = {
        Porcelain: { from: 0xF8EFEF, to: 0xF5D7D7 },
        Ivory: { from: 0xF1E6D8, to: 0xEACBBF },
        Light: { from: 0xF4E2D8, to: 0xEFC9BB },
        Beige: { from: 0xEFD8C8, to: 0xE8BFAA },
        'Light-medium': { from: 0xE9D1BA, to: 0xE1B59D },
        Sand: { from: 0xE3C5AB, to: 0xDBAA8F },
        Medium: { from: 0xD9BFAE, to: 0xD1A591 },
        Neutral: { from: 0xD3B19C, to: 0xCB947F },
        Golden: { from: 0xCCAC8C, to: 0xC38F70 },
        Tan: { from: 0xC19D7B, to: 0xB9865F },
        Caramel: { from: 0xB5906A, to: 0xAD7554 },
        Olive: { from: 0xAB8360, to: 0xA10000 },
        Deep: { from: 0x9F7655, to: 0x976A3A },
        Rich: { from: 0x946B4A, to: 0x8C502F },
        Espresso: { from: 0x8B6040, to: 0x834E26 },
        Dark: { from: 0x7F5130, to: 0x775518 },
        Ebony: { from: 0x744724, to: 0x6D3312 },
        Mahogany: { from: 0x6A3C17, to: 0x62310A },
    };

    let category = 'Unknown';
    const color = parseInt(colorCode.substring(1), 16);

    for (const [key, value] of Object.entries(colorRanges)) {
        const from = value.from;
        const to = value.to;

        

        if (color <= from && color >= to) {
            category = key;
            break;
        }
    }

    

    if(category !== 'Unknown'){
        const userId = req.user.user.user_id;
        try {
            let results = await pool.request()
                            .input('user_id', userId)
                            .input('skin_tone', category)
                            .execute('UpdateUserProfile')
       

        res.json( {
            success: true,
            message: "Skin updated",
            category,
            colorCode
        });
        } catch (error) {
            res.send(error)
        }
        
    } else {
        res.status(500).json({
            success: false,
            message: "Upload another image"
        })
    }
   
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        
        })
    }
        

        
    
}

async function checkLogin(req, res) {
    const { token } = req.body;
  
    try {
      // Assuming you have a function to verify the token
      const isValidToken = await tokenVerifier(token);
      
      if (isValidToken) {
        // Token is valid, user is logged in
        res.status(200).send({
          loggedIn: true,
          message: "User is logged in",
        });
      } else {
        // Token is invalid or expired, user is not logged in
        res.status(200).send({
          loggedIn: false,
          message: "User is not logged in",
        });
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      res.status(500).send({
        loggedIn: false,
        message: "Internal server error",
      });
    }
  }
  



module.exports = { getSkintone };
module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductsByBrand,
    searchProductsByName,
    recommendProductsBySkinTone,
    getSkintone,
    checkLogin,
    editUserDetails
}