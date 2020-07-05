import 'dotenv/config';
import express from 'express';
import basicAuth from 'express-basic-auth';
import BullBoard from 'bull-board';
import RequestController from './app/controllers/RequestController';
import Queue from './app/lib/Queue';

const app = express();
BullBoard.setQueues(Queue.queues.map((queue) => queue.bull));

app.use(express.json());
const user = JSON.parse(process.env.LOGIN_PASS);

app.get('/', RequestController.store);
// app.get('/clean', RequestController.clean);
app.use('/dashboard', basicAuth({
  users: user,
  challenge: true,
}), BullBoard.UI);

app.listen(process.env.PORT, process.env.HOST);
