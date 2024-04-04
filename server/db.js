const {Client} = require("pg");

const client = new Client({
    user: "postgres",
    password: "book6449",
    host: "localhost",
    port: 5432,
    database: "postgres",
});


client
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');
	})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err);
	});

    /*
client.query('SELECT * FROM "EHotels".public."Employee"', (err, result) => {
        if (err) {
            console.error('Error executing query', err);
        } else {
            console.log('Query result:', result.rows);
        }
});

*/

//const q = pool.query('SELECT * FROM "Customer"');
//console.log(q);
//pool.connect();

module.exports = client;