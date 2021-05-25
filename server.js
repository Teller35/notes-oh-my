const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public.index.html'));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(JSON.parse(data));
        }
    })
})

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            const notes = JSON.parse(data);
            req.body.id = uuidv4();
            const addNotes = [req.body, ...notes];
            fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(addNotes), (err) => {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    res.json(addNotes);
                }
            })
        }
    })
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            const notes = JSON.parse(data);
            const deleteNote = notes.filter((note) => {
                return note.id != id;
            })
            fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(deleteNote), (err) => {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    res.json(notes);
                }
            })
        }
    })
})

app.listen(PORT, () => {
    console.log(`We hear you on port ${PORT}!`);
})