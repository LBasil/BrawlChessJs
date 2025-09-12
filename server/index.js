const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const { initGame, makeMove, getState } = require('./game/mockGame');

// Serve client files statically
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());

// Routes
app.get('/ping', (req, res) => res.send('pong'));

app.get('/start', (req, res) => {
    const gameId = initGame();
    res.json({ gameId });
});

app.post('/move', (req, res) => {
    const { gameId, from, to } = req.body;
    makeMove(gameId, from, to);
    res.json({ success: true });
});

app.get('/state', (req, res) => {
    const { gameId } = req.query;
    const state = getState(gameId);
    res.json(state);
});

// WebSocket
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('move', (data) => {
        io.emit('move', data); // Broadcast move
    });
    socket.on('turn', (data) => {
        io.emit('turn', data); // Broadcast turn change
    });
    socket.on('victory', () => {
        io.emit('victory');
    });
    socket.on('defeat', () => {
        io.emit('defeat');
    });
    socket.on('disconnect', () => console.log('Client disconnected'));
});

http.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});