import { WebSocketServer } from "ws";
import RoomService from "../Service/RoomService.js";
import api from "./ApiForSocket.js"

const PORT = process.env.WS_PORT || 4000;
const wss = new WebSocketServer({port: PORT, host: "0.0.0.0"});
// const wss = new WebSocketServer({port: 4000});

wss.on('connection', (ws) => {

    console.log("Новый клиент подключился!");

    ws.on("message", async (message) => {
        try {
            const msg = JSON.parse(message);
            if (msg.type == "joinRoom"){
                const Room  = await api.addUserInRoom(ws, msg);
                if (Room !== undefined) {
                    ws.NameRoom = msg.NameRoom;
                    ws.UserName = msg.UserName;
                    let mas = Room.UserAndWs;
                    ws.id = mas[mas.length - 1].id;
                    ws.send(JSON.stringify({ type: 'entryRoom', InfoRoom: Room , NameRoom: msg.NameRoom}));
                }
                else{
                    ws.send(JSON.stringify({
                        type: "ErrorRoom",
                        message: "Вы указали несуществующую комнату, либо вы уже поключены к этой комнате!"}));
                }
            }
            else if (msg.type == "draw"){
                const NameRoom = msg.NameRoom;
                if(NameRoom){
                    await api.UpdateCanvasState(msg);
                    wss.clients.forEach(client => {
                        if (client !== ws && client.readyState == client.OPEN && client.NameRoom == NameRoom){
                            client.send(JSON.stringify(msg));
                        }
                    })
                }
                else{
                    console.log("Клиент не подключен к комнате.");
                }
            }
            else if (msg.type == "cursor"){
                const NameRoom = msg.NameRoom;
                msg.UserName = ws.UserName;
                if(NameRoom){
                    wss.clients.forEach(client => {
                        if (client !== ws && client.readyState == client.OPEN && client.NameRoom == NameRoom){
                            client.send(JSON.stringify(msg));
                        }
                    })
                }
            }
            else if (msg.type == "clear"){
                const NameRoom = msg.NameRoom;
                await api.ClearCanvas(NameRoom);
                if(NameRoom){
                    wss.clients.forEach(client => {
                        if (client !== ws && client.readyState == client.OPEN && client.NameRoom == NameRoom){
                            client.send(JSON.stringify(msg));
                        }
                    })
                }
            }
            else if (msg.type == "UserDisconnect"){
                const NameRoom = msg.NameRoom;
                if(NameRoom){
                    wss.clients.forEach(client => {
                        if (client !== ws && client.readyState == client.OPEN && client.NameRoom == NameRoom){
                            client.send(JSON.stringify(msg));
                        }
                    })
                }
            }
        }
        catch (error) {
            console.error('Ошибка при обработке сообщения:', error);
            ws.send(JSON.stringify({ type: "Error", message: "Произошла ошибка." }));
        }
        
    });     
    ws.on("close", async () => {
        console.log(`Клиент отключился!`);
        await api.RemoveUserFromRoom(ws);
    });
});