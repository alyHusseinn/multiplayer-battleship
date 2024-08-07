import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';


const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

app.use(cors());
app.use(logger('dev'))
/**
 * io workflow
 * on connection -> on 'align ships' -> create new Player with name, and unquie id
 * on 'place ship' -> place ship on the player's board
 * on 'flep ship' -> flip ship and return the direciton
 * on 'start game' -> find a avalibale player on avalibale players' list
 *      -> if found -> emit to that player to start the game if not found -> add player to avalibale players
 * -> when start the game -> create new game(player1, player2) and handle all of the player's movements and game logic 
 */

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on('conection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})
httpServer.listen(3000, () => console.log('Server started on port 3000'));

