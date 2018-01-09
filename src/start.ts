import { APIServer } from './server';

process.on('unhandledRejection', r => console.log(r));
const as = new APIServer();
as.start(true);
