CREATE DATABASE E_Auction

CREATE TABLE users  (
  user_id SERIAL PRIMARY KEY,
  role VARCHAR(10) NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  interested auctions TEXT,
  credit_card TEXT,
  cardholder_name TEXT,
  card_expiration_date DATE,
  CVV_CVC_code TEXT,
  balance DOUBLE DEFAULT 0,
  is_delete BOOLEAN DEFAULT false
);

CREATE TABLE auctions  (
  auction_id SERIAL PRIMARY KEY,
  discrabtion TEXT NOT NULL,
  type VARCHAR(20) NOT NULL,
  title VARCHAR(60) NOT NULL,
  current_user_id INTEGER REFERENCES users(user_id),
  user_id INTEGER REFERENCES users(user_id),
  current_bid DOUBLE DEFAULT,
  auction_image1 text DEFAULT "https://i1.wp.com/www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg?ssl=1",
  auction_image2 text DEFAULT "https://i1.wp.com/www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg?ssl=1",
  auction_image3 text DEFAULT "https://i1.wp.com/www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg?ssl=1",
  auction_date text NOT NULL,
  available BOOLEAN DEFAULT true,
  is_delete BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT false
);

CREATE TABLE favorite  (
  favorite_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id)
  auction_id INTEGER REFERENCES auctions(auction_id)
);

CREATE TABLE cart  (
  cart_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id)
  auction_id INTEGER REFERENCES auctions(auction_id)
);

CREATE TABLE admin  (
  admin_id SERIAL PRIMARY KEY,
  role VARCHAR(10) NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  is_delete BOOLEAN DEFAULT false 
);