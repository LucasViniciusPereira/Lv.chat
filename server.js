/*Request Modules*/
var express = require('express');
app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = Number(process.env.PORT || 3000);

/*Global*/
var usersConnected = 0;
var listUsers = {};

/*Rota para os arquivos*/
app.use('/img-emotions/', express.static(__dirname + '/public/img-emotions'));
app.use('/js/', express.static(__dirname + '/public/js'));
app.use('/css/', express.static(__dirname + '/public/css'));

/*Rota para pagina incial*/
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    socket.on('new message', function (data, callback) {
        //Recuperando as horas
        var _dateNow = new Date(), hora = _dateNow.getHours(), min = _dateNow.getMinutes();
        //PadLeft nas horas
        var _horaBR = "" + (hora - 3), _minBR = "" + min, padLeft = "00";
        var horaBR = padLeft.substring(0, padLeft.length - _horaBR.length) + _horaBR;
        var minBR = padLeft.substring(0, padLeft.length - _minBR.length) + _minBR;

        str_hora = horaBR + ':' + minBR;
        var msg = data.trim();

        io.emit('new message', { msg: data, usuario: socket.usuario, date: str_hora });
    });

    socket.on('disconnect', function () {
        if (usersConnected > 0)
            usersConnected = usersConnected - 1;
        //Remove usuario conectado
        if (!socket.usuario)
            return;
        //Enviar mensagem quando o usuario Desconetar
        io.sockets.emit('cnnUserDisconnect', { msg: 'desconectou-se do chat...', usuario: socket.usuario });

        delete listUsers[socket.usuario];
        getUsersConnected();
    });

    socket.on('connected', function (data, callback) {
        //Se usuário já estiver connected 
        if (data in listUsers) {
            callback(false);
        }
        else {
            usersConnected = usersConnected + 1;
            callback(true);

            //Enviar mensagem quando o usuario conectar
            io.sockets.emit('cnnUserConnected', { msg: 'esta connectado...', usuario: data });

            //Adiciona user na lista de usuarios conectados
            socket.usuario = data;
            listUsers[socket.usuario] = socket;
            getUsersConnected();
        }
    });

    getUsersConnected();
});

/* Retorna quantidade de usuarios conectados */
function getUsersConnected() {
    //Quantidada de usuarios
    io.sockets.emit('qtdUsers', { "qtdUsers": usersConnected });

    //retorna os nomes dos usuarios
    io.sockets.emit('listaUsuarios', Object.keys(listUsers));
}

http.listen(port, function () {
    console.log('Executando na porta ', port);
});

//Envia mensagem no modo privado
//if (msg.substring(0, 1) === '@') {
//    msg = msg.substring(1);
//    var index = msg.indexOf(' ');

//    //Removendo os espaço do '@'
//    if (index !== -1) {
//        var name = msg.substring(0, index);
//        var _msg = msg.substring(index + 1);

//        //Se encontrar o usuario conectado
//        if (name in lstUsuarios) {
//            if (socket.usuario !== name) {
//                lstUsuarios[name].emit('privado', { msg: _msg, usuario: socket.usuario, date: str_hora });
//                lstUsuarios[socket.usuario].emit('privado', { msg: _msg, usuario: socket.usuario, date: str_hora });
//            }
//            else {
//                callback('Erro! Não é possível enviar mensagem para você mesmo.')
//            }
//        }
//        else {
//            callback('Erro! Informe um usuário válido.')
//        }
//    }
//    else {
//        callback('Erro! Não foi possivel enviar a mensagem. Tente novamente!');
//    }
//}