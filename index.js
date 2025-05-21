// server.js
const express = require('express');
const app = express();
const schoolRoutes = require('./routes/schoolRoute');
require('dotenv').config();

app.use(express.json());
app.use('/api', schoolRoutes);
app.get('/', (req, res) => {
  res.send('School Management API is running successfully');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
