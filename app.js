import express, { response } from "express";
import expressHbs from "express-handlebars";
import hbs from "hbs";
import { checkUser  } from "./Service/UserService.js";
import roomService from "./Service/RoomService.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { request } from "http";

const jsonParser = express.json();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.engine("hbs", expressHbs.engine(
    {
        layoutsDir: "View/layouts",
        defaultLayout: 'layout',
        extname: "hbs"
    }
));

app.set("view engine", "hbs");
app.set("views", __dirname + "/View");

const dir = __dirname + "/View/partials"
hbs.registerPartials(dir);
app.use("/wwwroot", express.static(__dirname + "/wwwroot"))

app.get("/", (_, response) => {
    response.render("index.hbs", {
        title: "Главная страница",
        styles: `<link rel="stylesheet" href="/wwwroot/css/index.css">`,
        scripts: `<script src="/wwwroot/js/index.js"></script>`
    })
});
app.get("/authorization", (_, response) => {
    response.render("authorization.hbs", {
        title: "Авторизация",
        styles: `<link rel="stylesheet" href="/wwwroot/css/authorization.css">`,
        scripts: `<script src="/wwwroot/js/authorization.js"></script>`,
    })
});
app.post("/submit", jsonParser, (request, response) => {
    const user = request.body;
    if(!user){
        return response.sendStatus(400);
    }
    const isUserValid = checkUser(user);
    response.json({ isValid: isUserValid })
});
app.get("/home", (_, response) => {
    response.render("home.hbs", {
        title: "Домашняя страница",
        styles: `<link rel="stylesheet" href="/wwwroot/css/home.css">`,
        scripts: `<script src="/wwwroot/js/home.js"></script>`,
    })
});
app.get("/contact", (_, response) => {
    response.render("contact.hbs", {
        title: "Контакты",
        styles: `<link rel="stylesheet" href="/wwwroot/css/contact.css">`,
    })
});

app.post("/createRoom", jsonParser, (request, response) => {
    const data = request.body;
    if(!data){
        return response.sendStatus(404);
    }
    roomService.CreateRoom(data);
    response.sendStatus(200);
})


app.post("/addUserInRoom", jsonParser, (request, response) => {
    const data = request.body;
    if(!data){
        return response.sendStatus(404);
    }
    const room = roomService.addUserInRoom(data.ws, data.msg);
    response.json({data: room});
})

app.post("/UpdateCanvasState", jsonParser, (request, response) => {
    const msg = request.body;
    if(!msg){
        return response.sendStatus(404);
    }
    roomService.UpdateCanvasState(msg);
    response.sendStatus(200);
})

app.post("/ClearCanvas", jsonParser, (request, response) => {
    const data = request.body;
    if(!data){
        return response.sendStatus(404);
    }
    roomService.ClearCanvas(data.NameRoom);
    response.sendStatus(200);
})

app.post("/RemoveUserFromRoom", jsonParser, (request, response) => {
    const ws = request.body;
    if(!ws){
        return response.sendStatus(404);
    }
    roomService.RemoveUserFromRoom(ws);
    response.sendStatus(200);
})

app.get("/painting", (request, response) => {
    const roomString = request.query.room;
    let room;
    if (roomString){
        room = JSON.parse(decodeURIComponent(roomString));
    }
    response.render("painting.hbs", {
        layout: false,
        styles: `<link rel="stylesheet" href="/wwwroot/css/painting.css">`,
        scripts: `<script src="/wwwroot/js/painting.js"></script>`,
        room: JSON.stringify(room)
    })
})

app.listen(3000, "0.0.0.0", () => { console.log("Сервер запущен на http://0.0.0.0:3000")})
// app.listen(3000, () => { console.log("Сервер запущен на порту 3000")})