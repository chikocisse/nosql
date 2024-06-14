const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

const mongoURI = "mongodb://mongo1:27017,mongo2:27018,mongo3:27019/DBLP?replicaSet=rs0";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected with replica set"))
.catch(err => {
  console.error("Error connecting to MongoDB", err);
});


app.use(express.json());


app.use(cors());


const publicationSchema = new mongoose.Schema({
  _id: String,
  type: String,
  title: String,
  pages: {
    start: Number,
    end: Number
  },
  year: Number,
  booktitle: String,
  url: String,
  authors: [String]
}, { collection: 'publis' });

const Publication = mongoose.model('Publication', publicationSchema);

app.get('/api/publis', async (req, res) => {
  try {
    console.log("Fetching publications from DB");
    const publications = await Publication.find();
    console.log("Publications fetched successfully", publications);
    res.json(publications);
  } catch (err) {
    console.error("Error fetching publications", err);
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

