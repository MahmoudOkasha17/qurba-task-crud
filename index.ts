import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';
import colors from 'colors';
import { connectDB } from './config/db';

dotenv.config();

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/', router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
