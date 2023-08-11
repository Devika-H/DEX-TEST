const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const PORT = 3000; 


app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    next();
});


app.get('/restaurants', (req, res) => {
    const { city, hasTableBooking, hasOnlineDelivery, cuisine } = req.query;
    const results = [];

    fs.createReadStream('../data/restaurants.csv')
        .pipe(csv())
        .on('data', (row) => {
            
            if (
                (!city || row['City Code'] === city) &&
                (!hasTableBooking || row['Has Table booking'] === hasTableBooking) &&
                (!hasOnlineDelivery || row['Has Online delivery'] === hasOnlineDelivery) &&
                (!cuisine || row['Cuisines'].includes(cuisine))
            ) {
                results.push(row);
            }
        })
        .on('end', () => {
            
            results.sort((a, b) => parseFloat(b['Aggregate rating']) - parseFloat(a['Aggregate rating']));

            res.json(results);
        });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;