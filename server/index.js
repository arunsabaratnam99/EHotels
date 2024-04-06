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


app.get("/available-rooms", async (req, res) => {
  try {
    const hotelId = req.query.hotelId;
    const checkInDate = req.query.checkIn; // Expected format YYYY-MM-DD
    const checkOutDate = req.query.checkOut; // Expected format YYYY-MM-DD

    if (!hotelId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: "Missing hotelId, checkIn, or checkOut parameters" });
    }

    const queryStr = `
      SELECT r."RoomID", r."RoomCapacity"
      FROM "Room" r
      WHERE r."HotelID" = $1
      AND NOT EXISTS (
        SELECT 1
        FROM "Booking" b
        WHERE b."RoomID" = r."RoomID"
        AND NOT (b."Day" <= $2 OR b."cDay" >= $3)
      )
    `;

    const queryResult = await pool.query(queryStr, [hotelId, checkInDate, checkOutDate]);
    res.json(queryResult.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/search-rooms", async (req, res) => {
  try {
    // Log received query parameters for debugging
    console.log("Received query params:", req.query);

    // Extract query parameters
    const {
      hotelChain,
      rating,
      priceMin,
      priceMax,
      checkIn,
      checkOut,
      destination,
      rooms,
      guests
    } = req.query;

    // Start building the query
    let queryStr = `
      SELECT h."HotelID", c."Name" as "ChainName", h."Rating", COUNT(r."RoomID") AS "NumberOfRooms",
      h."StreetName", h."Province", h."City", h."Email", h."PhoneNum"
      FROM "Hotel" h
      JOIN "Room" r ON h."HotelID" = r."HotelID"
      JOIN "HotelChain" c ON h."ChainID" = c."ChainID"
      WHERE 1=1
    `;

    // List to hold query parameters for parameterized query
    let queryParams = [];
    let nextParamIndex = 1;

    // Add conditions based on provided parameters
    if (destination) {
      queryStr += ` AND (h."City" = $${nextParamIndex} OR h."Province" = $${nextParamIndex} OR h."StreetName" = $${nextParamIndex})`;
      queryParams.push(destination);
      nextParamIndex++;
    }

    if (hotelChain && hotelChain.toLowerCase() !== 'any') {
      queryStr += ` AND h."ChainID" = $${nextParamIndex}`;
      queryParams.push(hotelChain);
      nextParamIndex++;
    }

    if (rating && rating.toLowerCase() !== 'any') {
      queryStr += ` AND h."Rating" = $${nextParamIndex}`;
      queryParams.push(rating);
      nextParamIndex++;
    }

    if (priceMin && priceMax) {
      queryStr += ` AND r."Price" BETWEEN $${nextParamIndex} AND $${nextParamIndex + 1}`;
      queryParams.push(priceMin, priceMax);
      nextParamIndex += 2;
    } else if (priceMax) {
      queryStr += ` AND r."Price" <= $${nextParamIndex}`;
      queryParams.push(priceMax);
      nextParamIndex++;
    }

    if (guests) {
      queryStr += ` AND r."RoomCapacity" >= $${nextParamIndex}`;
      queryParams.push(guests);
      nextParamIndex++;
    }

    if (checkIn && checkOut) {
      queryStr += ` AND r."RoomID" NOT IN (
        SELECT b."RoomID"
        FROM "Booking" b
        WHERE b."RoomID" = r."RoomID" 
        AND (b."cDay" BETWEEN $${nextParamIndex} AND $${nextParamIndex + 1} OR b."Day" BETWEEN $${nextParamIndex} AND $${nextParamIndex + 1})
      )`;
      queryParams.push(checkIn, checkOut);
      nextParamIndex += 2;
    }

    queryStr += ` GROUP BY h."HotelID", c."Name"`;

    if (rooms) {
      queryStr += ` HAVING COUNT(r."RoomID") >= $${nextParamIndex}`;
      queryParams.push(rooms);
    }

    console.log("SQL Query:", queryStr);
    console.log("Query Parameters:", queryParams);

    const queryResult = await pool.query(queryStr, queryParams);

    console.log("Query Result:", queryResult.rows);

    res.json(queryResult.rows);
  } catch (err) {
    console.error("Error executing query:", err.message);
    res.status(500).send('Internal Server Error');
  }
});


app.get("/hotels/:hotelId", async (req, res) => {
  const { hotelId } = req.params;

  try {
    const hotelQuery = 'SELECT * FROM "Hotel" WHERE "HotelID" = $1';
    const hotelData = await pool.query(hotelQuery, [hotelId]);

    if (hotelData.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(hotelData.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/hotelchains/:chainId", async (req, res) => {
  const { chainId } = req.params;

  try {
    const hotelChainQuery = 'SELECT * FROM "HotelChain" WHERE "ChainID" = $1';
    const hotelChainData = await pool.query(hotelChainQuery, [chainId]);

    if (hotelChainData.rows.length === 0) {
      return res.status(404).json({ message: "Hotel chain not found" });
    }

    res.json(hotelChainData.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/book-room", async (req, res) => {
  const { roomId, customerId, checkIn, checkOut } = req.body;

  try {
    const reservationIdQuery = 'SELECT nextval(\'reservation_id_seq\') AS reservation_id';
    const { rows } = await pool.query(reservationIdQuery);
    const reservationId = rows[0].reservation_id;

    const bookingQuery = `
      INSERT INTO "Booking" ("ReservationID", "RoomID", "CustomerID", "cDay", "Day")
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(bookingQuery, [reservationId, roomId, customerId, checkIn, checkOut]);

    res.status(201).json({ message: 'Room booked successfully', reservationId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});














/*
app.listen(4000, () =>{
    console.log("server has started on port 4000");
})
*/