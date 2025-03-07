const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // If needed
const path = require('path');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
mongoose
  //mongodb+srv://masoodaaraiz:ug4Z0MWKAwwNBli9@notes-app.ki084.mongodb.net/?retryWrites=true&w=majority&appName=notes-app
  .connect('mongodb://localhost:27017/notesApp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());
app.use(cors());

app.use('/data', express.static(path.join(__dirname, 'data')));

app.use('/api/pdfs', pdfRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
