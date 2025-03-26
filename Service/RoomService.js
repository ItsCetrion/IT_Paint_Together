import roomRepository from "../Repository/RoomRepository.js"

export default {
    getRoom: function(NameRoom){
        return roomRepository.GetRoom(InfoRoom);
    },
    CreateRoom: function(InfoRoom){
        roomRepository.CreateRoom(InfoRoom);
    },
    addUserInRoom: function(UserWs, Room){
        return roomRepository.addUserInRoom(UserWs, Room);
    },
    UpdateCanvasState: function(CanvasState){
        roomRepository.UpdateCanvasState(CanvasState);
    },
    RemoveUserFromRoom: function(ws){
        roomRepository.RemoveUserFromRoom(ws);
    },
    ClearCanvas: function(NameRoom){
        roomRepository.ClearCanvas(NameRoom);
    }
};