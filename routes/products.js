import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

import { ObjectId } from "mongodb";

import multer from "multer";
import path from 'path'


const products = express.Router();

// This section will help you get a list of all the records.
products.get("/", async (req, res) => {
  let collection = await db.collection("products");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
  //res.send("dhdt").status(200);
});

// This section will help you get a single record by id
products.get("/:id", async (req, res) => {
  let collection = await db.collection("products");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});


// This section will help you create a new record.



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + path.extname(file.originalname);
      cb(null, file.fieldname + '_' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })
  


products.post("/", upload.single('img'), async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      image: req.file.filename,
      price: req.body.price,
      unit: req.body.unit,
    };
    let collection = await db.collection("products");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// This section will help you update a record by id.
products.put("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        image: req.file.filename,
        price: req.body.price,
        unit: req.body.unit,
      },
    };

    let collection = await db.collection("products");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// This section will help you delete a record
products.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("products");
    let result = await collection.deleteOne(query);

/*     const fs = require('fs-extra');
    await fs.remove('../public/images/abc.png'); */

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default products;
