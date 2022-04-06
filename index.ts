import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import router from './routes';
import { connectDB } from './config/db';
import { initializePassport } from './utils/passport_strategy';
import { errorHandler, notFound } from './middleware/errorMiddleware';
const { errors } = require('celebrate');

connectDB();

const app = express();
const port = process.env.PORT || 3000;

initializePassport(app);

app.use(express.json());
app.use(cors());

app.use('/api/', router);

app.use(notFound);
app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
