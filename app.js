const express = require("express");
const cors = require("cors");
const {
  asyncTables,
  insertProducts,
  insertProductReviews,
} = require("./DataBase/dbManager");
const userRoute = require("./Routes/userRoute");
const productRoute = require("./Routes/productRoute");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/user", userRoute);
app.use("/product", productRoute);

(async () => {
  try {
    await asyncTables();
    await insertProducts();
    // await insertProductReviews();
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
  }
})();
