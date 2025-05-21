// controllers/schoolController.js
const pool = require('../db');

// Add School
exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Latitude and Longitude must be valid numbers' });
  }

  try {
    await pool.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added successfully' });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ message: 'Error adding school', error: error.message });
  }
};

// List Schools
exports.listSchools = async (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLong = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLong)) {
    return res.status(400).json({ message: 'Invalid coordinates' });
  }

  try {
    const result = await pool.query('SELECT * FROM schools');
    const schools = result.rows;

    const haversine = (lat1, lon1, lat2, lon2) => {
      const toRad = (x) => x * Math.PI / 180;
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance: haversine(userLat, userLong, school.latitude, school.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({ message: 'Error retrieving schools', error: error.message });
  }
};
