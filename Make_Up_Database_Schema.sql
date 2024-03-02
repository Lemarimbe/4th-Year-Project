-- Create Users Table
CREATE TABLE users (
    user_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    profile_pic VARCHAR(255),
    skin_tone VARCHAR(255),
    date_of_entry DATE
);

-- Create Products Table
CREATE TABLE products (
    product_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10, 2),
    color_category VARCHAR(50),
    product_image VARCHAR(MAX)
);

-- Create Orders Table
CREATE TABLE orders (
    order_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES users(user_id),
    order_date DATE,
    arrival_date DATE,
    total_amount DECIMAL(10, 2),
    status VARCHAR(255)
);

-- Create Order_Items Table
CREATE TABLE order_items (
    order_item_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    order_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES orders(order_id),
    product_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES products(product_id),
    quantity INT,
    subtotal DECIMAL(10, 2)
);

-- Create Cart Table
CREATE TABLE cart (
    cart_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES users(user_id),
    creation_date DATE,
    status VARCHAR(255)
);

-- Create Cart_Items Table
CREATE TABLE cart_items (
    cart_item_id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    cart_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES cart(cart_id),
    product_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES products(product_id),
    quantity INT
);


	-- Modify Users Table to Make Username and Email Unique
ALTER TABLE users
ADD CONSTRAINT UQ_Username UNIQUE (username);

ALTER TABLE users
ADD CONSTRAINT UQ_Email UNIQUE (email);

-- Modify Users table to add role column
ALTER TABLE users
ADD role VARCHAR(50) DEFAULT 'user';

ALTER TABLE orders
ADD shipping_address VARCHAR(255);



--Procedures
--Insert User
CREATE OR ALTER PROCEDURE InsertUser
    @username VARCHAR(255),
    @email VARCHAR(255),
    @password VARCHAR(255),
    @name VARCHAR(255) = NULL,
    @profile_pic VARCHAR(255) = NULL,
    @skin_tone VARCHAR(255) = NULL,
	@role VARCHAR(50) = NULL
AS
BEGIN
    INSERT INTO users (username, email, password, name, profile_pic, skin_tone, date_of_entry, role)
    VALUES (@username, @email, @password, @name, @profile_pic, @skin_tone, GETDATE(), @role);
END;

-- Procedure to Add an Order
CREATE PROCEDURE AddOrder
    @user_id UNIQUEIDENTIFIER,
    @order_date DATE,
    @arrival_date DATE,
    @total_amount DECIMAL(10, 2),
    @status VARCHAR(255)
AS
BEGIN
    INSERT INTO orders (user_id, order_date, arrival_date, total_amount, status)
    VALUES (@user_id, @order_date, @arrival_date, @total_amount, @status);
END;


---- Procedure to Add an Order item
CREATE PROCEDURE AddOrderItem
    @order_id UNIQUEIDENTIFIER,
    @product_id UNIQUEIDENTIFIER,
    @quantity INT,
    @subtotal DECIMAL(10, 2)
AS
BEGIN
    INSERT INTO order_items (order_id, product_id, quantity, subtotal)
    VALUES (@order_id, @product_id, @quantity, @subtotal);
END

-- Procedure to Add a Product to the Cart
CREATE PROCEDURE AddProductToCart
    @user_id UNIQUEIDENTIFIER,
    @product_id UNIQUEIDENTIFIER,
    @quantity INT
AS
BEGIN
    DECLARE @cart_id UNIQUEIDENTIFIER;

    -- Check if a cart exists for the user
    IF NOT EXISTS (SELECT 1 FROM cart WHERE user_id = @user_id AND status = 'Open')
    BEGIN
        -- If no cart exists, create a new cart
        INSERT INTO cart (user_id, creation_date, status)
        VALUES (@user_id, GETDATE(), 'Open');
    END

    -- Retrieve the cart_id for the user
    SET @cart_id = (SELECT TOP 1 cart_id FROM cart WHERE user_id = @user_id AND status = 'Open');

    -- Add the product to the cart_items table
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES (@cart_id, @product_id, @quantity);
END;

--Add products to db

CREATE PROCEDURE AddProduct
    @product_name VARCHAR(255),
    @brand VARCHAR(255),
    @category VARCHAR(255),
    @description VARCHAR(255),
    @price DECIMAL(10, 2),
    @color_category VARCHAR(50),
    @product_image VARCHAR(MAX) = NULL
AS
BEGIN
    INSERT INTO products (product_name, brand, category, description, price, color_category, product_image)
    VALUES (@product_name, @brand, @category, @description, @price, @color_category, @product_image);
END;

--Get all products

CREATE PROCEDURE GetAllProducts
AS
BEGIN
    SELECT * FROM products;
END;

--Get products by category

CREATE PROCEDURE GetProductsByCategory
    @category VARCHAR(255)
AS
BEGIN
    SELECT * FROM products WHERE category = @category;
END;

--Get products by brand

CREATE PROCEDURE GetProductsByBrand
    @brand VARCHAR(255)
AS
BEGIN
    SELECT * FROM products WHERE brand = @brand;
END;

--get products by name 

CREATE PROCEDURE SearchProductsByName
    @product_name VARCHAR(255)
AS
BEGIN
    SELECT * FROM products WHERE product_name LIKE '%' + @product_name + '%';
END;

CREATE   PROCEDURE [dbo].[GetUser]
    @inputUsername  VARCHAR(255)
AS
BEGIN
   SELECT * FROM users WHERE username = @inputUsername  
END


CREATE PROCEDURE [dbo].[RecommendProductsBySkinTone]
    @skin_tone VARCHAR(255)
AS
BEGIN
    SELECT * FROM products WHERE color_category LIKE '%' + @skin_tone + '%';
END;


CREATE PROCEDURE [dbo].[GetProductById]
    @product_id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT * FROM products WHERE product_id = @product_id;
END;

CREATE PROCEDURE UpdateUserProfile
    @user_id UNIQUEIDENTIFIER,
    @profile_pic VARCHAR(255) = NULL,
    @skin_tone VARCHAR(255) = NULL
AS
BEGIN
    UPDATE users
    SET
        profile_pic = ISNULL(@profile_pic, profile_pic),
        skin_tone = ISNULL(@skin_tone, skin_tone)
    WHERE
        user_id = @user_id;
END;



