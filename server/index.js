const express = require("express");
const db = require("./controllers/queries.js");
const dbpost = require('./modules/DB_Connection.js')
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require('fs');

const app = express();
const cors = require("cors");
const PORT = 5000;

app.use(cors());

app.use(express.json());

// getByToken
// app.get("/get_user", authenticateToken, db.getCustomerByToken);
// app.get("/get_admin", authenticateToken, db.getAdminByToken);

// Customer
app.post("/users", db.createCustomer);
app.get("/users", db.getCustomer);
app.get("/users_count", db.getCustomercount);
app.get("/users/:id", db.getCustomerById);
app.put("/users/:id", db.updateCustomerCreaditCard);
app.put("/delete_user/:id", db.deleteCustomer);
app.put("/update_user/:id", db.updateUser);
// app.put("/update_card/:id", db.fillCreditCard);
// app.post("/createMoveCustomer/:id", db.createMoveCustomer);

// admin
app.get("/admin", db.getAdmin);
app.post("/admin", db.createAdmin);
app.put("/delete_admin/:id", db.deleteAdmin);
app.put("/update_admin/:id", db.updateAdmin);


// provider
// app.post("/provider", db.createProvider);
// app.get("/provider", db.getProvider);
// app.get("/not_active_provider", db.getNotAcceptedProvider);
// app.get("/provider_count", db.getProvidercount);
// app.get("/provider/:id", db.getProviderById);
// app.put("/delete_provider/:id", db.deleteProvider);
// app.put("/accept_provider/:id", db.acceptProvider);
// app.put("/update_provider/:id", db.updateProvider);


// auction
// app.get("/auction", db.getAuction);


app.get("/auction/:type",db.getAuction);
app.get("/end_auction_with_user/:id",db.getEndAuction);
app.get("/user_auction/:id",db.getUserAuction);
app.get("/auction_count", db.getAuctioncount);
app.get("/request_auction_count", db.getRequestAuctioncount);
app.get("/bid_auctioncount", db.getBidAuctioncount);
app.get("/not_active_auction", db.getNotActiveAuction);
// app.get("/join_auction_provider", db.joinAuctionprovider);
app.put("/accept_auction/:id", db.acceptAuction);
app.put("/bid_on_auction", db.BidOnAuction);

app.get("/auctionid/:id", db.getAuctionById);
// app.post("/auction",upload.array("images", 9), db.createAuction);
app.post("/auction", upload.array("images", 4), (req, res) => {
  const files = req.files;
  console.log(files);
  console.log(req.body)
  const {
    discrabtion,
    type,
    title,
    user_id,
    current_bid,
    productVideo,
    auction_date,
  } = req.body;

  if (!files || files.length === 0) {
    return res.status(400).send("No images provided");
  }

  const imageDatas = files.map((file) => file.buffer);

  // Insert data into the database

  dbpost
  .query("INSERT INTO public.auctions (discrabtion,type,title,current_user_id,user_id,current_bid,auction_date,available,productimage,productvideo,is_delete,active) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",   [
    discrabtion,
    type,
    title,
    null,
    user_id,
    current_bid,
    auction_date,
    true,
    imageDatas,
    productVideo,
    false,
    true
  ])
  .then((result) => {
    const insertedPitch = result.rows[0];
    console.log("Data sent");
    res.send(insertedPitch); // Send the inserted pitch data to the client
  })
  .catch((error) => {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data");
  });
});
app.put("/delete_auction/:id", db.deleteAuction);
// app.put("/bookauction/:id", db.bookAuction);
//app.get('/rented_auction_count', db.getRentedAuctioncount)
app.get("/rentedauction", db.rentedAuction);



// Sign
app.get("/checkToken", authenticateToken, (req, res) => {
  res.send(req.user);
} )

app.post("/login_user", db.checkCustomer, (req, res) => {

  const user = req.body;

  const token = jwt.sign(user, process.env.ACCESS_TOKEN_KEY);
  console.log("Generated token:", token);
  res.json(token);
});


app.post("/logIn_admin", db.checkAdmin, (req, res) => {
  const user = req.body;

  const token = jwt.sign(user, process.env.ACCESS_TOKEN_KEY);
  console.log("Generated token:", token);
  res.json(token);

});


function authenticateToken(req, res, next) {

  const authHeader = req.headers.authorization;
  console.log(authHeader)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Not found" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid" });
    }

    req.user = decoded;
    next();
  });
}

app.listen(PORT);