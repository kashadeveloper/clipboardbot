import EventEmitter from 'events'

class Logger extends EventEmitter {}

const logger = new Logger()
export { logger }
