const { EventEmitter } = require("events");
class Logger extends EventEmitter {}
module.exports = new Logger();
