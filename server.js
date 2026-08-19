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
        // console.log(userData);

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
                                zodiac_type: 'Tropical',
                                houses_system_identifier: 'P'
                        },
                        theme: 'dark',
                        language: 'EN',
                        transparent_background: true,
                        custom_title: `${userData.wizardName}'s Birth Chart`,
                }
        };

        try {
                const response = await axios.request(options);
                // // Send the data back to your frontend
                // console.log(response.data.chart_data.subject.sun);
                // console.log(response.data.chart_data.subject.moon);
                // console.log(response.data.chart_data.subject.mercury);
                // console.log(response.data.chart_data.subject.venus);
                // console.log(response.data.chart_data.subject.mars);
                // console.log(response.data.chart_data.subject.jupiter);
                // console.log(response.data.chart_data.subject.saturn);
                // console.log(response.data.chart_data.subject.uranus);
                // console.log(response.data.chart_data.subject.neptune);
                // console.log(response.data.chart_data.subject.pluto);
                // console.log(response.data.chart_data.subject.ascendant);
                // console.log(response.data.chart_data.subject.descendant);
                // console.log(response.data.chart_data.subject.medium_coeli);
                // console.log(response.data.chart_data.subject.imum_coeli);
                // console.log(response.data.chart_data.subject.chiron);
                // console.log(response.data.chart_data.subject.mean_lilith);
                //
                // res.json(response.data.chart_data.subject);
                res.json(response.data);
        } catch (error) {
                console.error("Backend API Error:", error.response?.data || error.message);
                res.status(500).json({ error: 'Failed to fetch data', details: error.response?.data });
        }
});

// Start the server
app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
});
