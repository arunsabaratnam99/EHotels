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

app.get("/customer", async(req, res) =>{

    const customerid = req.body["CustomerID"];
    const dateofregistration = req.body["DateOfRegistration"];
    const fullname = req.body["FullName"];
    const city = req.body["City"];
    const province = req.body["Province"];
    const streetname = req.body["StreetName"];
    const email = req.body["Email"];
    const phonenumber = req.body["PhoneNumber"];
      
      //const query =  `INSERT INTO "Customer" ("CustomerID", "DateOfRegistration", "FullName", "City", "Province", "StreetName", "Email", "PhoneNumber") VALUES('${customerid}', '${dateofregistration}', '${fullname}', '${city}', '${province}', '${streetname}', '${email}', '${phonenumber}');`;
      const query = 'SELECT * FROM "Customer"';

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


//get all hotel chains
app.get("/get-all-hotelchains", async (req, res) => {
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

app.get("/search-hotels", async (req, res) => {
  try {
    // Destructure and obtain query params
    const { hotelChain, city, priceRange, rating } = req.query;

    // Start the query with a base
    let query = `SELECT * FROM "Hotel"`;

    // Initialize an array to hold query parameters for parameterized queries
    let queryParams = [];

    // Array to hold individual query conditions to be joined with 'AND'
    let conditions = [];

    // Check if each filter is provided and add to the conditions
    if (hotelChain && hotelChain !== 'any') {
      queryParams.push(hotelChain);
      conditions.push(`"ChainID" = $${queryParams.length}`);
    }

    if (city) {
      queryParams.push(city);
      conditions.push(`"City" = $${queryParams.length}`);
    }

    // Assuming priceRange is a string like 'under150', '150to250', etc.
    if (priceRange) {
      // You'll need to define the logic to convert priceRange into actual price conditions
      // This is a simplistic example where I assume the range uses 'to' as a separator
      let [minPrice, maxPrice] = priceRange.split('to').map(Number);
      if (minPrice) {
        queryParams.push(minPrice);
        conditions.push(`"PricePerNight" >= $${queryParams.length}`);
      }
      if (maxPrice) {
        queryParams.push(maxPrice);
        conditions.push(`"PricePerNight" <= $${queryParams.length}`);
      }
    }

    if (rating && rating !== 'any') {
      queryParams.push(rating);
      conditions.push(`"Rating" = $${queryParams.length}`);
    }

    // If there are any conditions, append them to the query
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Execute the query with the collected parameters
    const { rows } = await pool.query(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No hotels found matching the criteria' });
    }

    // Return the matching hotels
    res.json(rows);
  } catch (error) {
    console.error('Error searching for hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




/*
app.listen(4000, () =>{
    console.log("server has started on port 4000");
})
*/