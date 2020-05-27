var express = require("express");
const { startRecording } = require('./recorder');


const PORT = 8080;
const HOST = '0.0.0.0';

var app = express();

var router = express.Router();
var path = __dirname + '/views/';

//startRecording("https://bbb28.virtual.ufc.br/playback/presentation/2.0/playback.html?meetingId=183f0bf3a0982a127bdb8161e0c44eb696b3e75c-1589336680139", "exportnameteste.webm", 30);


app.get('/', (req, res) => {
    res.send("Olá mundo!");
    startRecording("https://bbb28.virtual.ufc.br/playback/presentation/2.0/playback.html?meetingId=183f0bf3a0982a127bdb8161e0c44eb696b3e75c-1589336680139", "exportname10.webm", 30);
    console.log("1")
    
});


app.get('/1', (req, res) => {
    res.send("Olá mundo 2!");
    console.log("2")

    startRecording("https://bbb28.virtual.ufc.br/playback/presentation/2.0/playback.html?meetingId=183f0bf3a0982a127bdb8161e0c44eb696b3e75c-1589336680139", "exportname11.webm", 30);
});


app.get('/2', (req, res) => {
    res.send("Olá mundo 3!");
    console.log("3")

    startRecording("https://bbb28.virtual.ufc.br/playback/presentation/2.0/playback.html?meetingId=183f0bf3a0982a127bdb8161e0c44eb696b3e75c-1589336680139", "exportname12.webm", 30);
});

app.listen(PORT, HOST);
