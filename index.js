const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mt8kgrw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const volunteerCollection = client.db('volunteerDB').collection('volunteer');
    const bookingCollection = client.db("volunteerDB").collection("bookings");

    //volunteer routes
    app.get('/volunteer', async (req, res) => {
      const result = await volunteerCollection.find().toArray();
      res.send(result); 
    })

    app.get('/volunteer/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await volunteerCollection.findOne(query);
      res.send(result);
    })

    //BOOKINGS ROUTES
    app.get('/allBookings', async (req, res) =>{
      const result = await bookingCollection.find().toArray();
      res.send(result);
    })
    
    app.get('/myBookings/:email', async (req, res) =>{
      //console.log(req.params.email);
      const email =req.params.email
      const result = await bookingCollection
      .find({ email: email })
      .toArray();
      res.send(result);
    })

    app.post("/bookings", async (req, res) => {
      const bookings = req.body;
      //console.log(bookings);
      const result = await bookingCollection.insertOne(bookings);
      res.send(result);
    });

    app.delete('/allBookings/:id', async (req, res) =>{
      const id = req.params.id;
      //console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Volunteer network is running!");
  });
  
  app.listen(port, () => {
    console.log(`Volunteer network server is running on port ${port}`);
  });