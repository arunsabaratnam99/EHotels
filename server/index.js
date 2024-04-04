const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//

app.post("/customer", async(req, res) =>{

    const customerid = req.body["CustomerID"];
    const dateofregistration = req.body["DateOfRegistration"];
    const fullname = req.body["FullName"];
    const city = req.body["City"];
    const province = req.body["Province"];
    const streetname = req.body["StreetName"];
    const email = req.body["Email"];
    const phonenumber = req.body["PhoneNumber"];
      
      const query =  `INSERT INTO "Customer" ("CustomerID", "DateOfRegistration", "FullName", "City", "Province", "StreetName", "Email", "PhoneNumber") VALUES('${customerid}', '${dateofregistration}', '${fullname}', '${city}', '${province}', '${streetname}', '${email}', '${phonenumber}');`;
      //const query = 'SELECT * FROM "Customer"';

      try {
        const newCustomer = await pool.query(query);
        res.json(newCustomer);
        console.log(res);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
      }
      
})

app.get("/get-all-customers", async (req, res) => {
  try {
    const query = 'SELECT * FROM "public"."Customer"';
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No customers found' });
    }

    res.json(rows); // Return all rows as JSON response
  } catch (error) {
    console.error('Error retrieving customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*
//get all hotel chains
app.get("/hotelchain", async (req, res) => {
  try {
      const allHotelChains = await pool.query('SELECT * FROM "HotelChain"');
      res.json(allHotelChains);

  } catch (err){
    console.error(err.message);
  }

})

//get a hotel chain
app.get("/hotelchain/:chainid", async (req, res) =>{
  try{
    const { id } = req.params;
    const hotelchain = await pool.query('SELECT * FROM "HotelChain" WHERE "ChainID" = $1', [id]);

  } catch (err) {
    console.error(err.message)
  }
})
*/

/*
app.listen(4000, () =>{
    console.log("server has started on port 4000");
})
*/