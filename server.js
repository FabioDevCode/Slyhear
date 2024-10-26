import http from 'node:http';
import app from './src/app.js';

const PORT = process.env.PORT || 3324;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`✅ Slyhear started on : ${PORT} !`);
});