let formEntry = document.querySelector(".form-entry");
let formCreateRoom = document.querySelector(".form-create-room");
const btnCreateRoom = document.querySelector(".create-room");
const btnBack = document.querySelector(".Back");

swapVisible(formEntry, formCreateRoom);

function swapVisible(ObjectVisible, ObjectInVisible){
    ObjectInVisible.style.display = "none";
    ObjectVisible.style.display = "flex";
    console.log("произошел свап");
}

btnCreateRoom.addEventListener("click", () => {
    swapVisible(formCreateRoom, formEntry);
})

btnBack.addEventListener("click", () => {
    swapVisible(formEntry, formCreateRoom);
})

formCreateRoom.addEventListener("submit", async function(event) {
    event.preventDefault();
    const Room = {
        NameRoom: this.NameRoomCreate.value,
        UserName: this.UserNameCreate.value
    }
    if(await CreateRoom(Room)){
        const roomString = encodeURIComponent(JSON.stringify(Room));
        // window.location.href = `http://localhost:3000/painting?room=${roomString}`
        window.location.href = `https://it-paint-together.onrender.com/painting?room=${roomString}`
    };
})

formEntry.addEventListener("submit", function(event) {
    event.preventDefault();
    const Room = {
        NameRoom: this.NameRoomEntry.value,
        UserName: this.UserNameEntry.value
    }
    const roomString = encodeURIComponent(JSON.stringify(Room));
    // window.location.href = `http://localhost:3000/painting?room=${roomString}`
    window.location.href = `https://it-paint-together.onrender.com/painting?room=${roomString}`
})
