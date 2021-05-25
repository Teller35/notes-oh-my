const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public.index.html'));
})

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(JSON.parse(data));
        }
    })
})

app.listen(PORT, () => {
    console.log(`We here you on port ${PORT}!`);
})