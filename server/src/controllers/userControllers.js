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

async function getSkintone(req, res){
    let { pool } = req
    const { colorCode } = "#E8BFAA";
    const colorRanges = {
        Porcelain: { from: '#F8EFEF', to: '#F5D7D7' },
        Ivory: { from: '#F1E6D8', to: '#EACBBF' },
        Light: { from: '#F4E2D8', to: '#EFC9BB' },
        Beige: { from: '#EFD8C8', to: '#E8BFAA' },
        'Light-medium': { from: '#E9D1BA', to: '#E1B59D' },
        Sand: { from: '#E3C5AB', to: '#DBAA8F' },
        Medium: { from: '#D9BFAE', to: '#D1A591' },
        Neutral: { from: '#D3B19C', to: '#CB947F' },
        Golden: { from: '#CCAC8C', to: '#C38F70' },
        Tan: { from: '#C19D7B', to: '#B9865F' },
        Caramel: { from: '#B5906A', to: '#AD7554' },
        Olive: { from: '#AB8360', to: '#A26946' },
        Deep: { from: '#9F7655', to: '#976A3A' },
        Rich: { from: '#946B4A', to: '#8C502F' },
        Espresso: { from: '#8B6040', to: '#834E26' },
        Dark: { from: '#7F5130', to: '#775518' },
        Ebony: { from: '#744724', to: '#6D3312' },
        Mahogany: { from: '#6A3C17', to: '#62310A' },
    };

    let category = 'Unknown';
    for (const [key, value] of Object.entries(colorRanges)) {
        const from = parseInt(value.from.substring(1), 16);
        const to = parseInt(value.to.substring(1), 16);
        const color = parseInt(colorCode.substring(1), 16);

        if (color >= from && color <= to) {
            category = key;
            break;
        }
    }

    res.json({ category });
}
module.exports = {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductsByBrand,
    searchProductsByName,
    recommendProductsBySkinTone
}