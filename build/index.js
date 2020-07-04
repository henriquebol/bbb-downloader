"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("dotenv/config");

var _express = _interopRequireDefault(require("express"));

var _bullBoard = _interopRequireDefault(require("bull-board"));

var _RequestController = _interopRequireDefault(require("./app/controllers/RequestController"));

var _Queue = _interopRequireDefault(require("./app/lib/Queue"));

var app = (0, _express["default"])();

_bullBoard["default"].setQueues(_Queue["default"].queues.map(function (queue) {
  return queue.bull;
}));

app.use(_express["default"].json());
app.get('/', _RequestController["default"].store);
app.get('/clean', _RequestController["default"].clean);
app.use('/dashboard', _bullBoard["default"].UI);
app.listen(process.env.PORT, process.env.HOST);