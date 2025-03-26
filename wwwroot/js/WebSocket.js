let ws;

function connectWebSocket() {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
        ws = new WebSocket('ws://localhost:4000');

        ws.onopen = () => {
            console.log('Подключено к серверу');
        };

        ws.onclose = () => {
            console.log('Отключено от сервера');
        };
    }
}

function getWebSocket() {
    return ws;
}

// export { connectWebSocket, getWebSocket };