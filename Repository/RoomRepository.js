
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
// const roomFilePath = '/home/evgeni/IT/Lab8/Room.json'
export default {
    getRoom: function(NameRoom){

    },
    CreateRoom: function(InfoRoom){
        let rooms = GetRooms();
        rooms = AddRoom(rooms, InfoRoom);
        WriteJson(rooms);
    },
    addUserInRoom: function(UserWS, Room){
        let rooms = GetRooms();
        const flag = addUser(rooms, Room, UserWS);
        if (flag){
            WriteJson(rooms);
            const room = rooms[Room.NameRoom];
            return room;
        }
    },
    UpdateCanvasState: function(CanvasState){
        let rooms = GetRooms();
        rooms[CanvasState.NameRoom].CanvasState = CanvasState;
        WriteJson(rooms);
    },
    RemoveUserFromRoom: function(ws){
        let rooms = GetRooms();
        if (rooms[ws.NameRoom]){
            const index = rooms[ws.NameRoom].UserAndWs.findIndex(user => user.id === ws.id);
            if (index !== -1){
                rooms[ws.NameRoom].UserAndWs.splice(index, 1);
            }
            WriteJson(rooms);
        }
        else{
            print("Смысл удалять, его там и нет")
        }
    },
    ClearCanvas: function(NameRoom){
        let rooms = GetRooms();
        rooms[NameRoom].CanvasState = null;
        WriteJson(rooms);
    }
};

function GetRooms(){
    const data = fs.readFileSync("Room.json", 'utf8');
    return JSON.parse(data);
}

function addUser(rooms, Room, UserWS){
    let flag = true;
    if (rooms[Room.NameRoom]){
        const userExists = rooms[Room.NameRoom].UserAndWs.some(user => user.Ws === UserWS);
        if(!userExists){
            const userId = uuidv4();
            rooms[Room.NameRoom].UserAndWs.push({
                id: userId,
                UserName: Room.UserName, 
            })
            console.log(`Пользователь "${Room.UserName}" добавлен в комнату "${Room.NameRoom}".`);
        }
        else{
            flag = false;
            console.log(`Пользователь "${Room.UserName}" уже в комнате "${Room.NameRoom}".`);
        }
    }
    else{
        flag = false
        console.log(`Комната "${Room.NameRoom}" не найдена.`);
    }
    return flag
}

function AddRoom(allRooms, InfoRoom){
    if(!allRooms[InfoRoom.NameRoom]){
        allRooms[InfoRoom.NameRoom] = {
            UserCreated: InfoRoom.UserName,
            CanvasState: {},
            UserAndWs: []
        }
    }
    else{
        console.log(`Комната с именем "${InfoRoom.NameRoom}" уже существует.`);
    }
    return allRooms
}

function WriteJson(rooms){
    try {
        fs.writeFileSync("Room.json", JSON.stringify(rooms, null, 2));
    } catch (err) {
        console.error('Ошибка при записи файла:', err);
    }
}