const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s09u9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)
async function run() {
    try {
        await client.connect();
        const database = client.db('travel');
        const dataCollection = database.collection('data');
        const orderCollection = database.collection('orders');

        //Get data api
        app.get('/data', async (req, res) => {
            const cursor = dataCollection.find({});
            const data = await cursor.toArray();
            res.send(data);
        })
        //Get single data
        app.get('/data/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific offer', id);
            const query = { _id: ObjectId(id) };
            const offer = await dataCollection.findOne(query);
            res.json(offer);
        })

        // Add New Offer data
        app.post('/data', async (req, res) => {
            const newOffer = req.body;
            console.log('hit the post api', newOffer)
            const result = await dataCollection.insertOne(newOffer);
            console.log(result);
            res.json(result)

        });

        //Add new booking
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            console.log('hit the post api', newOrder)
            const result = await orderCollection.insertOne(newOrder);
            console.log(result);
            res.json(result)

        });

        //Get booking data
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const data = await cursor.toArray();
            res.send(data);
        })


        //Delete offer
        app.delete('/data/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await dataCollection.deleteOne(query);
            res.json(result);
        })

        //Delete Booking
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
    }

    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is walking');
});

app.listen(port, () => {
    console.log('server walking at', port);
})