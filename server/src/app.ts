import express from 'express';
import cors from 'cors';
import logger from 'morgan';

const app = express();

app.use(cors());
app.use(logger('dev'))

app.listen(3000, () => console.log('Server started on port 3000'));

app.get('/', (req, res) => {
    res.send('Hello World!');
})