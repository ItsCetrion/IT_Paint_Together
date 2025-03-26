async function Login(Data){
    const response = await fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Data)
    });
    if (!response.ok){
        throw new Error('Ошибка сети: ' + response.status);
    }
    const data = await response.json();
    return data.isValid;
}

async function CreateRoom(Room){
    const response = await fetch("/createRoom", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Room)
    })
    if(!response.ok){
        throw new Error('Ошибка сети: ' + response.status);
    }
    return true;
}