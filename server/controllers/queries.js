const db = require('../modules/DB_Connection.js')
const bcrypt = require('bcrypt')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Customer
const getCustomer = (req, res) => {
  db.query(
    "SELECT * FROM public.users WHERE is_delete = false ORDER BY user_id ASC",
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).json(results.rows);
    }
  );
};

const getCustomercount = (req, res) => {
  db.query(
    "SELECT * FROM public.users WHERE is_delete = false",
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).json(results.rows.length);
    }
  );
};

const getCustomerById = (req, res) => {
  const id = parseInt(req.params.id);

  db.query(
    "SELECT * FROM public.users WHERE user_id = $1",
    [id],
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).json(results.rows);
    }
  );
};

const createCustomer = async (req, res) => {
  const { name, email, password, phone } = req.body;
  console.log(req.body);

  let sql = "SELECT * FROM public.users where email = $1";
  const oldUser = await db.query(sql, [email]);
  const hash_password = bcrypt.hashSync(password, 10)


  if (oldUser.rows.length != 0) {
    res.status(409).send("User Already Exist.");
    console.log("User already exists")
  } else {
    db.query(
      "INSERT INTO public.users (role,username,phone, email,password,interested_auctions,credit_card,cardholder_name,card_expiration_date,cvv_cvc_code,balance,is_delete) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
      [
        "user",
        name,
        phone,
        email,
        hash_password,
        null,
        null,
        null,
        null,
        null,
        0,
        false,
      ],
      (error, results) => {
        if (error) {
          return res.status(400).json(error);
        }
        res.status(201).json(results.rows[0]);
        console.log(results.rows[0])
      }
    );
  }
};

const updateCustomerCreaditCard = (req, res) => {
  const id = parseInt(req.params.id);
  const { creditcard, cardholdername, cardexp, cardcvc } = req.body;

  db.query(
    "UPDATE public.users SET credit_card = $1, cardholder_name = $2,card_expiration_date=$3,cvv_cvc_code=$4 WHERE user_id = $5",
    [creditcard, cardholdername, cardexp, cardcvc, id],
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).send(`User credit card info modified with ID: ${id}`);
    }
  );
};

const deleteCustomer = (req, res) => {
  const id = parseInt(req.params.id);

  db.query(
    "UPDATE public.users SET is_delete = $1 WHERE user_id = $2",
    [true, id],
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).send(`User deleted with ID: ${id}`);
    }
  );
};

// const getCustomerByToken = (req, res) => {
//   const { user_id } = req.user;
//   console.log(user_id);

//   db.query(
//     "SELECT * FROM public.users WHERE user_id = $1",
//     [user_id],
//     (error, results) => {
//       if (error) {
//         return res.status(400).json(error);
//       }
//       res.status(200).json(results.rows);
//     }
//   );
// };

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, password, phone } = req.body;
  console.log(req.body);

  db.query(
    "UPDATE public.users SET username = $1, email = $2,password=$3,phone=$4 WHERE user_id = $5",
    [name, email, password, phone, id],
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).send(`Admin info  with ID: ${id} updated`);
    }
  );
};

// const fillCreditCard = (req, res) => {
//   const id = parseInt(req.params.id);
//   const { credit_card, cardholder_name, card_expiration_date, cvv_cvc_code } = req.body;
//   console.log([credit_card, cardholder_name, card_expiration_date, cvv_cvc_code, id])
//   db.query(
//     "UPDATE public.customers SET credit_card = $1,cardholder_name= $2,card_expiration_date=$3,cvv_cvc_code=$4 WHERE customers_id = $5",
//     [credit_card, cardholder_name, card_expiration_date, cvv_cvc_code, id],
//     (error, results) => {
//       if (error) {
//         return res.status(400).json(error);
//       }
//       res.status(200).send(`Car with ID: ${id} Booked`);
//     }
//   );
// };

// const createMoveCustomer = async (req, res) => {
//   const { move_type, date, car_id, customers_id } = req.body;

//     db.query(
//       "INSERT INTO public.customer_movements (move_type, date, car_id, customers_id) VALUES ($1, $2,$3,$4) RETURNING *",
//       [move_type, date, car_id, customers_id],
//       (error, results) => {
//         if (error) {
//           return res.status(400).json(error);
//         }
//         res.status(201).json(results.rows[0]);
//       }
//     );
// };



// Admin
const getAdmin = (req, res) => {
  db.query(
    "SELECT * FROM public.admin WHERE is_delete = false ORDER BY admin_id ASC ",
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).json(results.rows);
    }
  );
};

const createAdmin = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  console.log(name, email, password, phone, address);

  let sql = "SELECT * FROM public.admin where email = $1";
  const oldAdmin = await db.query(sql, [email]);
  console.log(oldAdmin.rows.length)

  if (oldAdmin.rows.length != 0) {
    res.status(409).send("Admin Email Already Exist.");
  } else {
    db.query(
      "INSERT INTO public.admin (role, username, email, password, phone) VALUES ($1,$2,$3,$4,$5,$6)",
      ["admin", name, email, password, phone, address],
      (error, results) => {
        if (error) {
          return res.status(400).json(error);
        }
        res.status(201).send(`Admin added with ID: ${results.rows[0].admin_id}`);
      }
    );
  }
};

// const getAdminByToken = (req, res) => {
//   const { admin_id } = req.user;

//   console.log(req.body);
//   db.query(
//     "SELECT * FROM public.admin WHERE admin_id = $1",
//     [admin_id],
//     (error, results) => {
//       if (error) {
//         return res.status(400).json(error);
//       }
//       res.status(200).json(results.rows);
//     }
//   );
// };

const deleteAdmin = (req, res) => {
  const id = parseInt(req.params.id);

  db.query(
    "UPDATE public.admin SET is_delete = $1 WHERE admin_id = $2",
    [true, id],
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).send(`admin deleted with ID: ${id}`);
    }
  );
};

// Car

const getNotActiveAuction = (req, res) => {
 const  query = "SELECT * FROM auctions WHERE active = false AND is_delete = false ORDER BY auction_id DESC;";
  db
  .query(query)
  .then((result) => {
    const auctions = result.rows.map((auction) => {
      const images = auction?.productimage.map((imageData, index) => {
        const base64Image = Buffer.from(imageData, 'base64').toString('base64');
        return `data:image/png;base64,${base64Image}`;
      });
      return { ...auction, productimage: images };
    });
    res.json(auctions);
  })
  .catch((error) => {
    console.error("Error retrieving data:", error);
    const errorMessage = "Error retrieving data";
    res.status(500).json({ error: errorMessage });
  })
};

const getAuction = (req, res) => {
  const type = req.params.type
  console.log(req.params.type)
  let query;
  //console.log("type"+type)
  if (type ==='null'){
      query = "SELECT * FROM auctions WHERE active = true AND is_delete = false ORDER BY auction_id DESC;";
     //query =  "SELECT discrabtion, auction_id,auction_date, username,phone,email,title,current_bid,productimage FROM public.auctions INNER JOIN public.users ON public.auctions.current_user_id =public.users.user_id WHERE active=true  ORDER BY auction_id DESC;";
     db
     .query(query)
     .then((result) => {
       const auctions = result.rows.map((auction) => {
         const images = auction?.productimage.map((imageData, index) => {
           const base64Image = Buffer.from(imageData, 'base64').toString('base64');
           return `data:image/png;base64,${base64Image}`;
         });
         return { ...auction, productimage: images };
       });
       res.json(auctions);
     })
     .catch((error) => {
       console.error("Error retrieving data:", error);
       const errorMessage = "Error retrieving data";
       res.status(500).json({ error: errorMessage });
     });
  }else{
    console.log("amro2")
     //query = "SELECT auction_id,auction_date, username,phone,email,title,current_bid,productimage FROM public.auctions INNER JOIN public.users ON public.auctions.current_user_id =public.users.user_id  ORDER BY auction_id DESC";
     query = 'SELECT * FROM auctions WHERE active = true AND is_delete = false AND type=$1 ORDER BY auction_id DESC';
     db
     .query(query,[type])
     .then((result) => {
       const auctions = result.rows.map((auction) => {
         const images = auction?.productimage.map((imageData, index) => {
           const base64Image = Buffer.from(imageData, 'base64').toString('base64');
           return `data:image/png;base64,${base64Image}`;
         });
         return { ...auction, productimage: images };
       });
       res.json(auctions);
     })
     .catch((error) => {
       console.error("Error retrieving data:", error);
       const errorMessage = "Error retrieving data";
       res.status(500).json({ error: errorMessage });
     });
  }
}

const getEndAuction = (req, res) => {
  const id = req.params.id
  console.log(req.params.type)
  let query = "SELECT auction_id,auction_date, username,phone,email,title,current_bid,productimage FROM public.auctions INNER JOIN public.users ON public.auctions.user_id =public.users.user_id WHERE public.auctions.user_id = $1"
     db
     .query(query,[id])
     .then((result) => {
       const auctions = result.rows.map((auction) => {
         const images = auction?.productimage.map((imageData, index) => {
           const base64Image = Buffer.from(imageData, 'base64').toString('base64');
           return `data:image/png;base64,${base64Image}`;
         });
         return { ...auction, productimage: images };
       });
       res.json(auctions);
     })
     .catch((error) => {
       console.error("Error retrieving data:", error);
       const errorMessage = "Error retrieving data";
       res.status(500).json({ error: errorMessage });
     });
}

const getUserAuction = (req, res) => {
  const id = req.params.id
  let query = "SELECT * FROM auctions WHERE current_user_id =$1";
     db
     .query(query,[id])
     .then((result) => {
       const auctions = result.rows.map((auction) => {
         const images = auction?.productimage.map((imageData, index) => {
           const base64Image = Buffer.from(imageData, 'base64').toString('base64');
           return `data:image/png;base64,${base64Image}`;
         });
         return { ...auction, productimage: images };
       });
       res.json(auctions);
     })
     .catch((error) => {
       console.error("Error retrieving data:", error);
       const errorMessage = "Error retrieving data";
       res.status(500).json({ error: errorMessage });
     });
  
}
// const joincarprovider = (req, res) => {
//   db.query(
//     "SELECT * FROM public.cars RIGHT OUTER JOIN public.provider ON public.cars.provider_id = public.provider.provider_id WHERE public.cars.is_delete = false AND public.cars.active = true ORDER BY public.cars.cars_id DESC",
//     (error, results) => {
//       if (error) {
//         return res.status(400).json(error);
//       }
//       res.status(200).json(results.rows);
//     }
//   );
// };

const getAuctioncount = (req, res) => {
  db.query(
    "SELECT * FROM public.auctions WHERE is_delete = false AND active = true",
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).json(results.rows.length);
    }
  );
};

const getRequestAuctioncount = (req, res) => {
  db.query(
    "SELECT * FROM public.auctions WHERE is_delete = false AND active = false",
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).json(results.rows.length);
    }
  );
};

const getBidAuctioncount = (req, res) => {
  
  db.query(
    "SELECT * FROM public.auctions WHERE available = false AND active = true ",
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).json(results.rows.length);
    }
  );
};

const acceptAuction = (req, res) => {
  const id = parseInt(req.params.id);

  db.query(
    "UPDATE public.auctions SET active = $1 WHERE auction_id = $2",
    [true, id],
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).send(`Auction with ID: ${id} Accepted`);
    }
  );
};

const getAuctionById = (req, res) => {
  const id = parseInt(req.params.id);
  const query = `SELECT * FROM auctions WHERE auction_id=${id}`;

  db.query(query)
    .then((result) => {
      const auctions = result.rows.map((auction) => {
        const images = auction?.productimage.map((imageData, index) => {
          const base64Image = Buffer.from(imageData, 'base64').toString('base64');
          return `data:image/png;base64,${base64Image}`;
        });
        return { ...auction, productimage: images };
      });
      res.json(auctions);
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
      const errorMessage = "Error retrieving data";
      res.status(500).json({ error: errorMessage });
    });
};




const createAuction = async (req, res, next) => {
  upload.array('images')(req, res, async (error) => {
    if (error) {
      console.error('An error occurred while uploading files', error);
      return res.status(500).json({ error: 'An error occurred while uploading files' });
    }

    try {
      // Extract form field values from the request body
      const {
        discrabtion,
        type,
        title,
        user_id,
        current_bid,
        productVideo,
        auction_date,
      } = req.body;
      let images = [];

      // Check if files were uploaded
      if (req.files && req.files.length > 0) {
        // Extract image files from the request
        images = req.files.map((file) => file.buffer);
      }
      // Save the problem to the database
      db.query(
        "INSERT INTO public.auctions (discrabtion,type,title,current_user_id,user_id,current_bid,auction_date,available,productimage,productvideo,is_delete,active) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
        [
          discrabtion,
          type,
          title,
          null,
          user_id,
          current_bid,
          auction_date,
          true,
          images,
          productVideo,
          false,
          true
        ],
        (error, results) => {
          if (error) {
            return res.status(400).json(error);
          }
          res.status(201).send(`auction added with ID: ${results.rows[0].auction_id}`);
        }
      );

      res.status(201).json({ message: 'Problem submitted successfully' });
    } catch (error) {
      console.error('An error occurred while submitting the problem', error);
      res.status(500).json({ error: 'An error occurred while submitting the problem' });
    }
  });
};


// const createAuction = async (req, res) => {

//   upload.array('images')(req, res, async (error) => {
//     if (error) {
//       console.error('An error occurred while uploading files', error);
//       return res.status(500).json({ error: 'An error occurred while uploading files' });
//     }

//     try {
//       // Extract form field values from the request body
//       const {
//         discrabtion,
//         type,
//         title,
//         user_id,
//         current_bid,
//         productVideo,
//         auction_date,
//       } = req.body;

//       let images = [];

//       // Check if files were uploaded
//       if (req.files && req.files.length > 0) {
//         // Extract image files from the request
//         images = req.files.map((file) => file.buffer);
//       }



//   if (!files || files.length === 0) {
//     return res.status(400).send("No images provided");
//   }

//   const productImg = files.map((file) => file.buffer);

//   db.query(
//     "INSERT INTO public.auctions (discrabtion,type,title,current_user_id,user_id,current_bid,auction_date,available,productimage,productvideo,is_delete,active) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",
//     [
//       discrabtion,
//       type,
//       title,
//       null,
//       user_id,
//       current_bid,
//       auction_date,
//       true,
//       productImg,
//       productVideo,
//       false,
//       true
//     ],
//     (error, results) => {
//       if (error) {
//         return res.status(400).json(error);
//       }
//       res.status(201).send(`auction added with ID: ${results.rows[0].auction_id}`);
//     }
//   );
// };

const rentedAuction = (req, res) => {
  db.query(
    "SELECT * FROM public.cars WHERE is_delete = false AND available = false AND active = true  ORDER BY cars_id DESC",
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).json(results.rows);
    }
  );
};

// const getCarsByIdProvider = (req, res) => {
//   const id = parseInt(req.params.id);

//   db.query(
//     "SELECT * FROM public.cars WHERE provider_id = $1 AND is_delete = false",
//     [id],
//     (error, results) => {
//       if (error) {
//         return res.status(400).json(error);
//       }
//       res.status(200).json(results.rows);
//     }
//   );
// };

// const updateCar = (req, res) => {
//   const id = parseInt(req.params.id);
//   const {
//     discrabtion,
//     type,
//     energy_type,
//     model,
//     year,
//     rental_price,
//     images_data,
//     seats_number,
//   } = req.body;
//   console.log(req.body);

//   db.query(
//     "UPDATE public.cars SET discrabtion = $1, type = $2, energy_type = $3, model = $4, year = $5, rental_price = $6, images_data = $7, seats_number = $8 WHERE cars_id = $9",
//     [
//       discrabtion,
//       type,
//       energy_type,
//       model,
//       year,
//       rental_price,
//       images_data,
//       seats_number,
//       id,
//     ],
//     (error, results) => {
//       if (error) {
//         return res.status(400).json(error);
//       }
//       res.status(200).send(`Admin info  with ID: ${id} updated`);
//     }
//   );
// };

const BidOnAuction = (req, res) => {
  const { auction_id, user_id, current_bid ,user_name} =
    req.body;

  db.query(
    "UPDATE public.auctions SET current_user_id = $1, current_bid = $2,user_name=$3 WHERE auction_id = $4",
    [user_id, current_bid,user_name, auction_id],
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).send(`Bid on Auction with ID: ${auction_id} `);
    }
  );
};

const deleteAuction = (req, res) => {
  const id = parseInt(req.params.id);

  db.query(
    "UPDATE public.auctions SET is_delete = $1 WHERE auction_id = $2",
    [true, id],
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).send(`Auction  with ID: ${id} deleted`);
    }
  );
};



const checkCustomer = (req, res, next) => {

  const { email, password } = req.body;

  db.query(
    'SELECT * FROM public.users WHERE is_delete = false ORDER BY user_id ASC',
    (error, results) => {
      if (error) {
        return res.status(400).json(error)
      }
      const result = results.rows.find((user) => {
        return user.email === email && bcrypt.compare(password,user.password);
      });

      if (result) {
        req.body = result;
        next();
      }
      else {
        res.status(404).send("user not exist");
      }

    }
  );
}

const checkAdmin = (req, res, next) => {

  const { email, password } = req.body;
  db.query(
    'SELECT * FROM public.admin WHERE is_delete = false ORDER BY admin_id ASC',
    (error, results) => {
      console.log(results)
      if (error) {
        return res.status(400).json(error)
      }

      const result = results.rows.find((user) => {
        return user.email === email && user.password === password;
      });

      if (result) {
        req.body = result;
        next();
      }
      else {
        res.status(404).send("admin not exist");
      }

    }
  );
}

const updateAdmin = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, password, phone, address } = req.body;
  console.log(req.body);

  db.query(
    "UPDATE public.admin SET username = $1, email = $2,address=$3,password=$4,phone=$5 WHERE admin_id = $6",
    [name, email, address, password, phone, id],
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).send(`Admin info  with ID: ${id} updated`);
    }
  );
};

const updateProvider = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, password, phone, address } = req.body;
  console.log(req.body);

  db.query(
    "UPDATE public.provider SET username = $1, email = $2,address=$3,password=$4,phone=$5 WHERE provider_id = $6",
    [name, email, address, password, phone, id],
    (error, results) => {
      if (error) {
        return res.status(400).json(error);
      }
      res.status(200).send(`Admin info  with ID: ${id} updated`);
    }
  );
};



const getCarWithProvider = (req, res) => {
  pool.query(
    'SELECT * FROM public.cars INNER JOIN public.provider ON public.cars.provider_id  = public.provider.provider_id WHERE is_delete = falseORDER BY cars_id DESC',
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

module.exports = {
  getCustomer,
  getCustomerById,
  createCustomer,
  updateCustomerCreaditCard,
  deleteCustomer,
  getCustomercount,
  // getCustomerByToken,
  updateUser,

  getAdmin,
  createAdmin,
  deleteAdmin,
  // getAdminByToken,
  updateAdmin,

  // getProvider,
  // getProvidercount,
  // getProviderById,
  // getNotAcceptedProvider,
  // createProvider,
  // acceptProvider,
  // deleteProvider,
  // getProviderByToken,

  getAuction,
  getEndAuction,
  getUserAuction,
  getAuctioncount,
  getRequestAuctioncount,
  getAuctionById,
  createAuction,
  deleteAuction,
  getBidAuctioncount,
  // getAuctionByIdProvider,
  rentedAuction,
  // updateAuction,
  getNotActiveAuction,
  acceptAuction,
  // joincarprovider,
  BidOnAuction,


  checkCustomer,
  getCarWithProvider,
  updateProvider,
  checkAdmin,
  // createMoveCustomer,
  // fillCreditCard,

};