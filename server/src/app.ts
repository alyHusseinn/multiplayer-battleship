import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Player from './lib/player';
import Game from './lib/game';
import { Coord } from './lib/types';

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

app.use(cors());
app.use(logger('dev'))

// not ready players 
const notReadyPlayers: Map<string, Player> = new Map();;
// avalibale players
const availablePlayers: Map<string, Player> = new Map();
// games map
const games: Map<string, Game> = new Map();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // New player event
    socket.on('new player', (name: string) => {
        notReadyPlayers.set(socket.id, new Player(name, socket.id));
    });

    // Align ships event
    socket.on('align ships', (coord: Coord) => {
        const player = notReadyPlayers.get(socket.id);
        if (!player) return;

        const result = player.addShip(coord);
        socket.emit('align ships result', result);

        if (player.isReady()) {
            notReadyPlayers.delete(socket.id);
            availablePlayers.set(socket.id, player);
        }
    });

    // Rotate ship event
    socket.on('rotate ship', () => {
        const player = availablePlayers.get(socket.id);
        if (player) player.rotateShip();
    });

    // Start game event
    socket.on('start game', () => {
        const player = availablePlayers.get(socket.id);
        if (!player) return;

        availablePlayers.delete(socket.id);
        const opponentId = [...availablePlayers.keys()][0];

        if (opponentId) {
            const opponent = availablePlayers.get(opponentId) as Player;
            const game = new Game(player, opponent);
            games.set(game.getGameId(), game);

            // Join both players to the game room
            socket.join(game.getGameId());
            io.to(opponentId).socketsJoin(game.getGameId());

            // Notify players about game start
            io.to(game.getGameId()).emit('game started', {
                gameId: game.getGameId(),
                opponent: opponent.getName()
            });

            availablePlayers.delete(opponentId);
        } else {
            availablePlayers.set(socket.id, player);
        }
    });

    // Handle hit event
    socket.on('hit', ({ gameId, cord }: { gameId: string, cord: Coord }) => {
        const game = games.get(gameId);
        if (!game) return;

        try {
            const result = game.playRound(cord, socket.id);
            io.to(gameId).emit('hit result', {
                cord,
                result,
                isYou: socket.id === game.getNonActivePlayerId()
            });

            if (game.isGameOver()) {
                const winner = game.getWinner();
                if (winner) {
                    io.to(gameId).emit('game over', { winner });
                }
            }
        } catch (err) {
            socket.emit('error hitting', "It's not your turn");
        }
    });

    // Handle player disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
        notReadyPlayers.delete(socket.id);
        availablePlayers.delete(socket.id);
        // Consider deleting associated games if needed
    });
});

httpServer.listen(3000, () => console.log('Server started on port 3000'));