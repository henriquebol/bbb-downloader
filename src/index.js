import 'dotenv/config';
import { access, F_OK } from 'fs';
import express, { Router } from "express";
import { startRecording, convertAndCopy } from './lib/bbb-recorder/recorder';

var app = express();

var router = Router();

app.get('/api/download/', async (req, res) => {

    var email = req.query.email
    var url = req.query.url
    var meetingId = url.split("=")[1]
    var file_name = meetingId + '.mp4'
    var path_file = process.env.COPY_TO_PATH + '/' + file_name

    access(path_file, F_OK, (err) => {
        if (err) {
          //console.error(err)            
          //Envia para fila, converte e envia email quando terminar
          //.then(newResult => doThirdThing(newResult)) ENVIA EMAIL
          startRecording(url)
          .then(exportname => convertAndCopy(exportname))
          .then(path => console.log(`Result: ${path}`))
          .catch(() => console.log('Error!!!'));

          return res.json( { msg: "Processando arquivo para download. Por favor, volte mais tarde. O link de download também será enviado para seu email." } )
        }

        //res.download(path_file, file_name)
        return res.json( { msg: "https://webconferencia.virtual.ufc.br/download/" + file_name } )
      })    
});

app.listen(process.env.PORT, process.env.HOST);
