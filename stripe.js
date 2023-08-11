require('dotenv').config()
const express = require('express');
const app = express();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

app.post("/checkout", async(req, res)=>{
    stripe.charges.create({
        amount: 2000,  // Amount in cents
        currency: 'INR',
        source: 'tok_visa',  // Test card token
        description: 'Example charge'
      }, function(err, charge) {
        // Handle the response or error here
      });
      
})