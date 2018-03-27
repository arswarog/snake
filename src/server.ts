import * as config from 'config';
import * as express from 'express';
//import * as expressWs from 'express-ws';
import * as bodyParser from 'body-parser';

let app = express();
//let ws = expressWs(app);

app.use(bodyParser.json());

app.use(express.static('web'));

//app.ws('/', function(ws, req) {
//    ws.on('message', function(msg) {
//        console.log(msg);
//    });
//    console.log('socket', req.testing);
//});

app.listen(config.get('port'));
