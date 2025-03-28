let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
const inputColor = document.getElementById("color");
const SelectLineWidth = document.getElementById("lineWidth");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let isDrawing = false;
let lastSentTime = 0;
let UserColor;
let UserLineWidth;
(() => {
  UserColor = inputColor.value;
  UserLineWidth = SelectLineWidth.value
})()

inputColor.addEventListener("change", (event) => {
  UserColor = event.target.value;
})

SelectLineWidth.addEventListener("change", (event) => {
  UserLineWidth = event.target.value;
  console.log(UserLineWidth.type);
})

document.querySelector(".clear").addEventListener("click", () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(
      {
        type: "clear",
        NameRoom: sessionStorage.getItem("NameRoom")
      }));
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
})

function generateUniqueId() {
  return `id-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
}

// ws = new WebSocket('ws://localhost:4000');
ws = new WebSocket('wss://my-websocket-service.onrender.com');

ws.onopen = () => {
  console.log('Подключено к серверу');
  room.type = "joinRoom";
  ws.send(JSON.stringify(room));
};

ws.onerror = (error) => {
  console.error('Ошибка WebSocket:', error);
};

ws.onmessage = (event) => {
  data = JSON.parse(event.data);
  if (data.type == "entryRoom"){
    sessionStorage.setItem("NameRoom", data.NameRoom);
    const img = new Image();
    if (data.InfoRoom.CanvasState && Object.keys(data.InfoRoom.CanvasState).length > 0){
      img.src = data.InfoRoom.CanvasState.CanvasState;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    }
    else{
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    ws.id = generateUniqueId();
  }
  else if (data.type == "clear"){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  else if (data.type == "ErrorRoom"){
    alert(data.message);
    // window.location.href = `http://localhost:3000/home`;
    window.location.href = "https://it-paint-together.onrender.com/home";
  }
  else if (data.type == "draw"){
    const { x, y, color, lineWidth } = data;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    if (data.subType == "mousedown"){
      ctx.beginPath();
      ctx.moveTo(x, y); 
    }
    else if (data.subType == "mousemove") {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y); 
    }
  }
  else if (data.type == "cursor"){
    const cursorElement = document.getElementById(`cursor-${data.id}`) || document.createElement('div');
    cursorElement.id = `cursor-${data.id}`;
    cursorElement.style.position = 'absolute';
    cursorElement.style.width = '10px';
    cursorElement.style.height = '10px';
    cursorElement.style.backgroundColor = 'red';
    cursorElement.style.borderRadius = '50%';

    // Устанавливаем позицию курсора, смещая его на половину ширины и высоты
    cursorElement.style.left = `${data.x - 5}px`; // 5 = 10px / 2
    cursorElement.style.top = `${data.y - 5}px`; // 5 = 10px / 2

    // Добавляем курсор в документ, если его еще нет
    if (!document.body.contains(cursorElement)) {
        document.body.appendChild(cursorElement);
    }

    // Создаем или получаем элемент для имени пользователя
    const nameElement = document.getElementById(`name-${data.id}`) || document.createElement('div');
    nameElement.id = `name-${data.id}`;
    nameElement.textContent = data.UserName;
    nameElement.style.position = 'absolute';
    nameElement.style.left = `${data.x}px`;
    nameElement.style.top = `${data.y - 20}px`;
    nameElement.style.color = 'black';
    nameElement.style.fontSize = '12px';
    nameElement.style.pointerEvents = 'none';

    // Добавляем имя пользователя в документ, если его еще нет
    if (!document.body.contains(nameElement)) {
        document.body.appendChild(nameElement);
    }
  }
  else if (data.type == "UserDisconnect"){
    const idCursor = `cursor-${data.userId}`
    document.getElementById(idCursor).remove();
  }
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const x = e.offsetX;
  const y = e.offsetY;
  ctx.beginPath();
  ctx.moveTo(x, y);

  const drawData = {
    type: 'draw',
    subType: 'mousedown',
    NameRoom: sessionStorage.getItem("NameRoom"),
    x: x,
    y: y,
    color: UserColor,
    lineWidth: UserLineWidth
  };
  
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(drawData));
  }
});

canvas.addEventListener('mousemove', (e) => {

  const x = e.offsetX;
  const y = e.offsetY;

  const cursorData = {
    type: 'cursor',
    NameRoom: sessionStorage.getItem("NameRoom"),
    x: x,
    y: y,
    id: ws.id
  };
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(cursorData));
  }

  if (!isDrawing){
    return
  }
  requestAnimationFrame(() => {
    const currentTime = Date.now();
    if (currentTime - lastSentTime > 50) {
      const drawData = {
        type: 'draw',
        subType: 'mousemove',
        NameRoom: sessionStorage.getItem("NameRoom"),
        x: x,
        y: y,
        CanvasState: canvas.toDataURL(),
        color: UserColor, 
        lineWidth: UserLineWidth
      };
  
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(drawData));
        lastSentTime = currentTime;
      } 
    }
    
    ctx.strokeStyle = UserColor;
    ctx.lineWidth = UserLineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  })
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  ctx.beginPath(); // Сброс пути
});

canvas.addEventListener('mouseout', () => {
  isDrawing = false;
  ctx.beginPath();
});

window.addEventListener('beforeunload', () => {
  const disconnectMessage = {
    type: "UserDisconnect",
    NameRoom: sessionStorage.getItem("NameRoom"),
    userId: ws.id
  };
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(disconnectMessage));
  }
});

ws.onclose = () => {
  console.log('Отключено от сервера');
};