export default{
    addUserInRoom: async function (ws, msg) {
        const data = {
            ws: ws,
            msg: msg
        }
        // const response = await fetch("http://localhost:3000/addUserInRoom", {
        const response = await fetch("http://it-paint-together.onrender.com/addUserInRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if(!response.ok){
            throw new Error('Ошибка сети: ' + response.status);
        }
        const res = await response.json();
        return res.data
    },
    UpdateCanvasState: async function (msg) {
        // const response = await fetch("http://localhost:3000/UpdateCanvasState", {
        const response = await fetch("http://it-paint-together.onrender.com/UpdateCanvasState", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(msg)
        });
        if(!response.ok){
            throw new Error('Ошибка сети: ' + response.status);
        }
    },
    ClearCanvas: async function (NameRoom) {
        // const response = await fetch("http://localhost:3000/ClearCanvas", {
        const response = await fetch("http://it-paint-together.onrender.com/ClearCanvas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({NameRoom: NameRoom})
        });
        if(!response.ok){
            throw new Error('Ошибка сети: ' + response.status);
        }
    },
    RemoveUserFromRoom: async function (ws) {
        // const response = await fetch("http://localhost:3000/RemoveUserFromRoom", {
        const response = await fetch("http://it-paint-together.onrender.com/RemoveUserFromRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ws)
        });
        if(!response.ok){
            throw new Error('Ошибка сети: ' + response.status);
        }
    }
}
