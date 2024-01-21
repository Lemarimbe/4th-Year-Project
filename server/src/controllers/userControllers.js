async function getAllProducts(req, res) {

    let { pool } = req;

    try {
        let products = await pool.request().execute("GetAllProducts");
        res.status(200).send({
            success: true,
            message: "Products retrieved successfully",
            products: products.recordsets
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

async function recommendProductsBySkinTone (req, res) {
    let { pool } = req
    const  skin_tone  = req.user.user.skin_tone


    try {
        let products = await pool.request()
            .input('skin_tone', skin_tone)
            .execute('RecommendProductsBySkinTone')

            res.json({
                success: true,
                message: "Recommended Products retrieved successfully",
                data: products.recordsets
            })

    } catch (error) {
        res.json({
            success: false,
            message: "An error occurred",
            error: error
        })
    }

}
module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductsByBrand,
    searchProductsByName,
    recommendProductsBySkinTone
}