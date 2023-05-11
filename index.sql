CREATE TABLE monsuu.products (
    _id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    weight INTEGER NOT NULL,
    img VARCHAR(250) NOT NULL,
    price INTEGER NOT NULL,
    package VARCHAR(250) NOT NULL,
    calorie INTEGER NOT NULL,
    keep_date INTEGER NOT NULL,
    keep_condition VARCHAR(250) NOT NULL,
    product_advantage VARCHAR(250) NOT NULL,
    pros VARCHAR(250) NOT NULL
    )