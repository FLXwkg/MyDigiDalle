/**
 * NodeJS Utils Server
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config();

/**
 * Route
 */
const router = require('./route');

/**
 * Stripe Utils
 */
const stripe = require('stripe')(process.env.STRIPE_API_KEY_SECRET);

/**
 * Function Import
 */
const { incrementDonator } = require('./funcDonator');

app.use(bodyParser.json())

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.use('/donate', router)

app.get('/create-payment-intent/:price', async (req, res) => {
    const price = req.params.price * 100
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            currency: 'eur',
        })
        res.status(200).json({ client_secret: paymentIntent.client_secret });
        if (res.status(200)) {
            incrementDonator()
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message });
    }
})

app.get('/balance', async (req, res) => {
    try {
        const balance = await stripe.balance.retrieve();
        res.status(200).json(balance);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

app.get('/donator', (req, res) => {
    try {
        fs.readFile('./counter.json', 'utf-8', (err, data) => {
            if (err) {
                console.error("Erreur lors de la lecture du fichier", err);
                res.status(500).json({ error: err.message });
                return;
            }

            let counterData;
            
            try {
                counterData = JSON.parse(data);
            } catch (e) {
                console.error("Erreur Parse JSON", e);
                res.status(500).json({ error: e.message });
                return;
            }

            res.status(200).json({ counter: counterData.counter });
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
})


app.listen(4242, () => console.log('Running on http://localhost:4242'));