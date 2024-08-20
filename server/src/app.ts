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

        const isAligned = player.addShip(coord);
        socket.emit('align ships result', { isAligned, board: player.getPlayerBoard() });

        if (player.isReady()) {
            socket.emit('player is ready');
            notReadyPlayers.delete(socket.id);
            availablePlayers.set(socket.id, player);
        }
    });

    // Rotate ship event
    socket.on('rotate ship', () => {
        const player = notReadyPlayers.get(socket.id);
        player?.rotateShip();
    });

    // Start game event
    socket.on('start game', async () => {
        const player = availablePlayers.get(socket.id);
        if (!player) return;

        // Remove the player from the available players list
        availablePlayers.delete(socket.id);

        // Get the first available opponent
        const opponentId = [...availablePlayers.keys()][0];

        if (opponentId) {
            const opponent = availablePlayers.get(opponentId) as Player;

            // Create a new game instance
            const game = new Game(player, opponent);
            const gameId = game.getGameId();

            // Store the game
            games.set(gameId, game);

            // Join both players to the game room
            socket.join(gameId);  // Add current player to the room
            io.to(opponentId).socketsJoin(gameId);  // Add opponent to the room

            console.log(`Player ${player.getId()} and Opponent ${opponent.getId()} joined room: ${gameId}`);

            // Notify both players about the game start
            io.to(player.getId()).emit('game started', {
                gameId,
                opponent: opponent.getName()
            });

            io.to(opponentId).emit('game started', {
                gameId,
                opponent: player.getName()
            });

            // Remove the opponent from the available players list
            availablePlayers.delete(opponentId);

        } else {
            // If no opponent is available, add the player back to the available players list
            availablePlayers.set(socket.id, player);
            console.log("No opponent available. Player added back to availablePlayers.");
        }
    });


    socket.on('player board', (gameId: string) => {
        // after deleted from the avaliable players
        const game = games.get(gameId);
        if (!game) return;
        const player = game.getPlayerWithId(socket.id);
        if (!player) return;
        socket.emit('player board', player.getPlayerBoard());
    })

    // Handle hit event
    socket.on('hit', ({ gameId, cord }: { gameId: string, cord: Coord }) => {
        const game = games.get(gameId);
        if (!game) return;

        try {
            const result = game.playRound(cord, socket.id);
            socket.emit("you hitted", { cord, result });
            // Send hit result to the other player
            io.to(game.getActivePlayerId()).emit('opponent hitted', {
                cord,
                result,
            })

            if (game.isGameOver()) {
                const winner = game.getWinner();
                if (winner) {
                    io.to(gameId).emit('game over', { winner });
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error)
                socket.emit('error hitting', err.message);
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