// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use( express.json() );

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://bookUser:${process.env.DBPASSWORD}@cluster0.20iyx.mongodb.net/bookdata?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db("bookdata").collection("book")
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  
// route to get all docs
app.get( '/dreams', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.post('/add', bodyParser.json(), function(req, res) {
  collection.insertOne(req.body)
  .then (dbresponse => {
    console.log(dbresponse.ops[0])
    res.json(dbresponse.ops[0])
  })
})

app.post('/delete', bodyParser.json(), function(req, res) {
  console.log(req.body)
  collection
    .deleteOne({ _id:mongodb.ObjectID( req.body.id ) })
    .then( result => res.json( result ) )
})