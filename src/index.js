import 'dotenv/config';
import express from 'express';
import BullBoard from 'bull-board';
import RequestController from './app/controllers/RequestController';
import Queue from './app/lib/Queue';

const app = express();
BullBoard.setQueues(Queue.queues.map((queue) => queue.bull));

app.use(express.json());

app.get('/api/download/', RequestController.store);
app.use('/api/queues', BullBoard.UI);

app.listen(process.env.PORT, process.env.HOST);
