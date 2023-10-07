require('dotenv').config();
const express = require('express');
const Stripe= require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const hbs= require("hbs")

const app = express();
const PORT = process.env.PORT || 5000;

const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticpath));
app.set("view engine", "hbs");
app.set("views", templatepath);
hbs.registerPartials(partials_path);


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/payment', (req, res) => {
  const amount = 2500;
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Web Development Ebook',
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});


const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`I am live on port ${PORT}`);
    })
  } catch (error) { }
}
start();