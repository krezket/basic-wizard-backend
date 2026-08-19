const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your frontend can communicate with this backend
app.use(cors());
app.use(express.json());

// Create the proxy route
app.get('/api/countries', async (req, res) => {
        // Grab the search query from the frontend request (e.g., ?q=Canada)
        const searchQuery = req.query.q;

        if (!searchQuery) {
                return res.status(400).json({ error: 'Search query is required' });
        }

        const options = {
                method: 'GET',
                url: 'https://city-and-state-search-api.p.rapidapi.com/countries/search',
                params: {
                        q: searchQuery,
                },
                headers: {
                        'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Safely hidden on the server!
                        'x-rapidapi-host': 'city-and-state-search-api.p.rapidapi.com',
                        'Content-Type': 'application/json'
                }
        };

        try {
                const response = await axios.request(options);
                // Send the data back to your frontend
                res.json(response.data);
        } catch (error) {
                console.error("Backend API Error:", error.message);
                res.status(500).json({ error: 'Failed to fetch data' });
        }
});

app.get('/api/cities', async (req, res) => {
        const searchQuery = req.query.q;
        const countryID = req.query.country_id;

        if (!searchQuery) {
                return res.status(400).json({ error: 'Search query is required' });
        }

        const options = {
                method: 'GET',
                url: 'https://city-and-state-search-api.p.rapidapi.com/cities/search',
                params: {
                        q: searchQuery,
                        country_id: countryID
                },
                headers: {
                        'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Safely hidden on the server!
                        'x-rapidapi-host': 'city-and-state-search-api.p.rapidapi.com',
                        'Content-Type': 'application/json'
                }
        };

        try {
                const response = await axios.request(options);
                // Send the data back to your frontend
                res.json(response.data);
        } catch (error) {
                console.error("Backend API Error:", error.message);
                res.status(500).json({ error: 'Failed to fetch data' });
        }
});

app.get('/api/citydetails/:id', async (req, res) => {
        const cityid = req.params.id;

        if (!cityid) {
                return res.status(400).json({ error: 'Search query is required' });
        }

        const options = {
                method: 'GET',
                url: `https://city-and-state-search-api.p.rapidapi.com/cities/${cityid}`,
                headers: {
                        'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Safely hidden on the server!
                        'x-rapidapi-host': 'city-and-state-search-api.p.rapidapi.com',
                        'Content-Type': 'application/json'
                }
        };

        try {
                const response = await axios.request(options);
                // Send the data back to your frontend
                res.json(response.data);
        } catch (error) {
                console.error("Backend API Error:", error.message);
                res.status(500).json({ error: 'Failed to fetch data' });
        }
});

app.post('/api/astrologer', async (req, res) => {
        const userData = req.body;
        console.log(userData);

        if (!userData) {
                return res.status(400).json({ error: 'userData is required' });
        }

        const options = {
                method: 'POST',
                url: 'https://astrologer.p.rapidapi.com/api/v5/chart/birth-chart',
                headers: {
                        'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Safely hidden on the server!
                        'x-rapidapi-host': 'astrologer.p.rapidapi.com',
                        'Content-Type': 'application/json'
                },
                data: {
                        subject: {
                                name: userData.wizardName,
                                year: userData.year,
                                month: userData.month,
                                day: userData.day,
                                hour: userData.hour,
                                minute: userData.minute,
                                city: userData.city,
                                nation: userData.nation,
                                longitude: userData.longitude,
                                latitude: userData.latitude,
                                timezone: userData.timezone,
                                zodiac_type: 'Tropic',
                                houses_system_identifier: 'P'
                        },
                        theme: 'classic',
                        language: 'EN',    
                        custom_title: `${userData.wizardName}'s Birth Chart`,
                }
        };

        try {
                const response = await axios.request(options);
                // Send the data back to your frontend
                res.json(response.data);
        } catch (error) {
                console.error("Backend API Error:", error.message);
                res.status(500).json({ error: 'Failed to fetch data' });
        }
});

// Start the server
app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
});
