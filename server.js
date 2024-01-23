// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const toast = require('react-hot-toast');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3001;

app.use(express.static('build'));

const corsOptions = {
    origin: 'http://localhost:3003, http://locahost:3002',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

// Sử dụng middleware CORS
app.use(cors(corsOptions));

io.on('connection', (socket) => {
    console.log('Admin connected');

    // Nghe sự kiện từ client
    socket.on('clientMessage', (message) => {
        console.log(`Received message from client: ${message}`);
        toast.success("Yêu cầu thêm người dùng đang chờ chấp nhận!")
    });

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
