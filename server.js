//mongodb
require("./config/db");
//dotenv
require('dotenv').config()

const express = require("express");
const port = process.env.PORT || 3000
//cors
const cors = require("cors");
const app = express();
// uuid
const uuid = require("uuid")



const UserRouter = require("./api/User");

// For accepting post form data
app.use(cors());
app.use(express.json());
// app.use(express.bodyParser());
app.use(express.urlencoded({ extended: true }));
app.use("/user", UserRouter);

//stripe
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

app.post("/checkout", async (req, res) => {
  console.log("Request:", req.body)
  let error;
  let status;
  try {
    const { cartItems, token } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    })

    const idempotency_key = uuid()
    const charge = await stripe.charges.create({
      amount: calculateTotal(cartItems) * 100,
      currency: "usd",
      customer: customer.id,
      receipt_email: token.email,
      description: `Purchased the ${cartItems.name}`,
      shipping: {
        name: token.card.name,
        address: {
          line1: token.card.address_line1,
          line2: token.card.address_line2,
          city: token.card.address_city,
          country: token.card.address_country,
          postal_code: token.card.address_zip
        }
      }
    },
      { idempotency_key }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = " failure";
  }
  res.json({ error, status})
})

app.listen(port, () => {
  console.log("Server running on port ${port}");
});
