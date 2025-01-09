import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// users is an instance of the express users.
// We use it to define our routes.
// The users will be added as a middleware and will take control of requests starting with path /record.
const users = express.Router();

// This section will help you get a list of all the records.
users.get("/", async (req, res) => {
  let collection = await db.collection("users");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
  //res.send("dhdt").status(200);
});

// This section will help you get a single record by id
users.get("/:id", async (req, res) => {
  let collection = await db.collection("users");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
users.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      phone: req.body.phone,
      password: req.body.password,
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
users.put("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password,
      },
    };

    let collection = await db.collection("users");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
users.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("users");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});


//Authentication
users.post("/verify", async (req, res) => {

  try {
    let ph = req.body.phone;
    let pass = req.body.password;

    let collection = await db.collection("users");
    let query = { phone: (parseInt(ph)) };
    let result = await collection.findOne(query);

    //console.log(req.body)
    
    if(result){
      if(result.password === pass){
        //res.json({"id": result._id}).status(200);
        res.statusText = result._id;
        res.status(200).end();
      }

      else{
        res.status(401).send("Invalid :(");
      }

    }

    else{
      res.status(404).json({ error: "User not found" }); 
    }

  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});


export default users;
