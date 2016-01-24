var socket = io.connect();

$nameUser = $("#txtNome"); $message = $("#txtMensagem"); $btnSendMessage = $("#btnSend"); $btnConnect = $("#btnConnect");
$erroAplication = $('#appErro'); $lstUsers = $('#lstUsersConncted'); $step1 = $('#step-1'); $step2 = $('#step-2');

//Config lv.emotions
$(document).ready(function () {
    $("#step-2").emotions({
        campoMensagemID: $message, btnEnviaMensagemID: $btnSendMessage,
        listaEmotionsView: "#lista-emotions", exibeMensagemView: "#lstMensagens",
        path: "/img-emotions/", extension: ".png", elementoRetorno: "li"
    })
});

/*Visibilidade*/
$step2.addClass("display");
$erroAplication.hide();

/*Validação de login*/
$("#frmCadastro").submit(function () {
    if ($.trim($nameUser.val()) === "" || $.trim($nameUser.val()) === undefined) {
        $erroAplication.html('Informe um nome válido.');
    }
    else {
        socket.emit('connected', $nameUser.val(), function (data) {
            if (data == false) {
                $erroAplication.show(); $nameUser.focus();
                $erroAplication.text('Este nome ja esta em uso, tente outro nome');
            }
            else {
                $step1.fadeOut(500).delay(10).slideUp(300);
                $step2.slideUp(300).delay(500).fadeIn(700);
            }
        });
    }
    return false;
}).slideUp(250).delay(400).fadeIn(500);

/*Enviar mensagem para o server*/
$('#frmChat').submit(function () {
    socket.emit('new message', $message.val(), function (data) {
        $('#lstMensagens').append($('<li class="error">').html("<i class='fa fa-exclamation-circle'></i> " + data));
    });
    $message.val(''); $message.focus();
    return false;
});

/*Mensagem enviada*/
socket.on('new message', function (data) {
    msg = $(this).retornaMensagemEmotion(data.msg);
    mensagem = '<b>[<i>' + data.date + '</i>]</b><i class="blue"> ' + data.usuario + ':</i> ' + msg;
    $('#lstMensagens').append($('<li>').html(mensagem));
});

//Mensagem PRIVADO
socket.on('privado', function (data) {
    //Template msg Privado
    mensagem = '<b><i>' + data.usuario + ' _privado' + '</i></b>' + ': ' + data.msg + '  <small class="hours">' + data.date + '</small>';
    $('#lstMensagens').append($('<li class="privado">').html(mensagem));
});

//Mensagem conectado
socket.on('cnnUserConnected', function (data) {
    mensagem = '<i class="fa fa-child"></i> <b><i>' + data.usuario + '</i></b> ' + data.msg;
    $('#lstMensagens').append($('<li class="conectado">').html(mensagem));
});

//Mensagem desconectado
socket.on('cnnUserDisconnect', function (data) {
    mensagem = '<i class="fa fa-child"></i> <b><i>' + data.usuario + '</i></b> ' + data.msg;
    $('#lstMensagens').append($('<li class="desconectado">').html(mensagem));
});

/*Usuários conectados -- Emit*/
socket.on('listaUsuarios', function (data) {
    var element = '';

    for (var i = 0; i < data.length; i++) {
        element += '<div class="row user-connected no-margin-right"><div class="col-md-11"><i class="fa fa-user"></i> <span class="font-size-17">' + data[i] + '</span></div></div>';
    };
    $lstUsers.html(element);
});

/*Quantidade de usuarios conectados -- Emit*/
socket.on('qtdUsers', function (msg) {
    $("#qtdUsersConncted").text(msg.qtdUsers);
});