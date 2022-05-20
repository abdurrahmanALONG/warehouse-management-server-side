const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { verify } = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();


//middleware
app.use(cors());
app.use(express.json());


 

// const verifyJWT = (req, res, next) =>{
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         return res.status(401).send({message: 'unauthorized'});
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) =>{
//         if(err){
//             return res.status(403).send({message: 'forbidden'})
//         }
//         req.decoded= decoded;
//         next();
//     })
// }



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.10o2m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('assignment-11').collection('items');
        const explorCollection = client.db('assignment-11').collection('explor');

        // // AUTH API
        // app.post('/login', async(req, res) => {
        //     const user = req.body;
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: '1d'
        //     });
        //     res.send({accessToken});
        // })




        // SERVER API
        app.get('/item', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            if (email) {
                const query = { email: email };
                const cursor = itemCollection.find(query);
                const items = await cursor.toArray();
                res.send(items);
            }
            else {
                const query = {};
                const cursor = itemCollection.find(query);
                const items = await cursor.toArray();
                res.send(items);
            }
        });

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(id);
            const item = await itemCollection.findOne(query);
            res.send(item);
        });

        app.get('/explor', async (req, res) => {
            const query = {};
            const cursor = explorCollection.find(query);
            const explor = await cursor.toArray();
            res.send(explor);
        });


        // POST
        app.post('/item', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        });

        // UPDATE
        app.put('/item/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity.totalNewQuantity
                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // DELETE
        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running assignment-11');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});


