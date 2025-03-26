import { WebSocketServer } from "ws";
import RoomService from "../Service/RoomService.js";

const wss = new WebSocketServer({port: 4000, host: "0.0.0.0"});

wss.on('connection', (ws) => {

    console.log("Новый клиент подключился!");

    ws.on("message", (message) => {
        const msg = JSON.parse(message);
        if (msg.type == "joinRoom"){
            const Room = RoomService.addUserInRoom(ws, msg)
            if (Room !== undefined) {
                ws.NameRoom = msg.NameRoom;
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
                RoomService.UpdateCanvasState(msg)
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
            RoomService.ClearCanvas(NameRoom);
            if(NameRoom){
                wss.clients.forEach(client => {
                    if (client !== ws && client.readyState == client.OPEN && client.NameRoom == NameRoom){
                        client.send(JSON.stringify(msg));
                    }
                })
            }
        }
    });     
    ws.on("close", () => {
        console.log(`Клиент отключился!`);
        RoomService.RemoveUserFromRoom(ws);
    });
});