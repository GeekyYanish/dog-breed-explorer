const express = require('express');  
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const connection = require('./db'); 
const cors = require('cors') 
const app = express();  
app.use(express.json());  
app.use(cors())
app.get('/flights', (req, res) => {  
  connection.query('SELECT * FROM flights', (err, results) => {  
    if (err) {
      return res.status(500).json({ error: 'Database error' });  
    }  
    res.json({ flights: results });  
  });  
});  

app.get('/passengers', (req, res) => {  
  connection.query('SELECT * FROM passengers', (err, results) => {  
    if (err) return res.status(500).json({ error: 'Database error' });  
    res.json({ passengers: results });  
  });  
});  

//Insert
app.post('/flights', (req, res) => {  
  const { flight_number, destination, departure_time, seats } = req.body;  
  if (!flight_number || !destination || !departure_time || !seats) {  
    return res.status(400).json({ error: 'Missing required fields' });  
  }  
  connection.query(  
    'INSERT INTO flights (flight_number, destination, departure_time, seats) VALUES (?, ?, ?, ?)',  
    [flight_number, destination, departure_time, seats],  
    (err, results) => {  
      if (err) return res.status(500).json({ error: 'Database error' });  
      res.status(201).json({ message: 'Flight created', id: results.insertId });  
    }  
  );  
});  
// Update: Modify a flight  
app.put('/flights/:id', (req, res) => {  
  const { destination } = req.body;  
  const id = req.params.id;  
  if (!destination) return res.status(400).json({ error: 'Missing destination' });  
  connection.query(  
    'UPDATE flights SET destination = ? WHERE id = ?',  
    [destination, id],  
    (err, results) => {  
      if (err) return res.status(500).json({ error: 'Database error' });  
      if (results.affectedRows === 0) return res.status(404).json({ error: 'Flight not found' });  
      res.json({ message: 'Flight updated' });  
    }  
  );  
});  
// Delete: Remove a flight  
app.delete('/flights/:id', (req, res) => {  
  const id = req.params.id;  
  connection.query('DELETE FROM flights WHERE id = ?', [id], (err, results) => {  
    if (err) return res.status(500).json({ error: 'Database error' });  
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Flight not found' });  
    res.json({ message: 'Flight deleted' });  
  });  
});  

app.post('/book', (req, res) => {
  const { flight_id, passenger_id } = req.body;

  connection.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: 'Transaction start failed' });
    }

    const insertBooking = 'INSERT INTO bookings (flight_id, passenger_id, booking_date) VALUES (?, ?, NOW())';
    connection.query(insertBooking, [flight_id, passenger_id], (err, bookingResult) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ error: 'Failed to insert booking' });
        });
      }

      const updateSeats = 'UPDATE flights SET seats = seats - 1 WHERE id = ? AND seats > 0';
      connection.query(updateSeats, [flight_id], (err, updateResult) => {
        if (err || updateResult.affectedRows === 0) {
          return connection.rollback(() => {
            res.status(500).json({ error: 'Failed to update seats (maybe full)' });
          });
        }

        connection.commit(err => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ error: 'Commit failed' });
            });
          }

          res.json({ message: 'Booking successful' });
        });
      });
    });
  });
});

// Upload image
app.post('/upload', upload.single('document'), (req, res) => {
  console.log('Received file:', req.file);  // Debugging
  console.log('Received name:', req.body.name);

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const name = req.body.name;
  const img = fs.readFileSync(req.file.path);

  connection.query(
    'INSERT INTO file_upload (name, document) VALUES (?, ?)',
    [name, img],
    (err, result) => {
      if (err) {
        console.error('Insert Error:', err);
        return res.status(500).send('Upload failed');
      }
      res.send('Uploaded successfully');
    }
  );
});

app.get('/download/:id', (req, res) => {
  const id = req.params.id;

  connection.query(
    'SELECT name, document FROM file_upload WHERE id = ?',
    [id],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).send('File not found');
      }

      const fileName = result[0].name || 'downloaded_file';
      const fileBuffer = result[0].document;

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}.jpg"`, // You can change extension
      });

      res.send(fileBuffer);
    }
  );
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));  
