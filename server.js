import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import users from "./routes/users.js";

import 'dotenv/config'
import products from "./routes/products.js";

const PORT =  5000;
const app = express();

//app.use('/static', express.static('public'))
app.use(express.static('public'))

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/users", users)
app.use("/products", products)

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
