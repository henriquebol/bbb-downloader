"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config');
var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _bullboard = require('bull-board'); var _bullboard2 = _interopRequireDefault(_bullboard);
var _RequestController = require('./app/controllers/RequestController'); var _RequestController2 = _interopRequireDefault(_RequestController);
var _Queue = require('./app/lib/Queue'); var _Queue2 = _interopRequireDefault(_Queue);

const app = _express2.default.call(void 0, );
_bullboard2.default.setQueues(_Queue2.default.queues.map((queue) => queue.bull));

app.use(_express2.default.json());

app.get('/', _RequestController2.default.store);
app.use('/dashboard', _bullboard2.default.UI);

app.listen(process.env.PORT, process.env.HOST);
