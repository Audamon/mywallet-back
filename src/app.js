import './setup.js';
import server from './server.js';

server.listen(process.env.PORT, () => { console.log('listening on port ' + process.env.PORT)});