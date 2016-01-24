/*!
 * lv.emotions v1.0.0
 * Criado para utilizar emoticons em suas páginas web
 * https://github.com/LucasViniciusPereira
 * License : MIT
 * Author : Lucas Vinicius Pereira (http://lucasvinicius.eti.br/)
 */
(function ($) {
    $.fn.emotions = function (options) {
        // Definição dos valores padrões
        var arrayEmotions = {
            "0": "Undefined", "1": "o:)", "2": ":3", "3": "o.O", "4": ":'(", "5": "3:)", "6": ":(", "7": ":O", "8": "88)", "9": ":D",
            "10": "s2", "11": "<3", "12": "-_^", "13": ":*", "14": ":v", "15": ":}~", "16": "´x_x´", "17": "8|", "18": ":p", "19": ":/", "20": "&gt:Z", "21": ";["
        };
        var nameEmotions = ["undefined", "angel", "smiling", "confused", "cry", "devil", "frown", "wonder", "gratters", "grin", "love", "heart", "boredom", "kiss", "shame", "funny", "squint", "sunglasses", "tongue", "unsure", "sleep", "nervous"];

        var defaults = {
            'path': 'img-emotions/',
            'extension': '.gif',
            'campoMensagemID': '#txtMensagem',
            'btnEnviaMensagemID': '#btnEnviarMensagem',
            'listaEmotionsView': '#lista-emotions',
            'exibeMensagemView': '#showHere',
            'elementoRetorno': "p"
        };

        // Geração das settings do seu plugin
        var settings = $.extend({}, defaults, options);

        /*
        * Monta a lista de emotions para o usuário clicar no emotion
        */
        $.fn.montaListaEmotionView = function () {
            var lista = "";
            $.each(nameEmotions, function (key, value) {
                if (value != 'undefined')
                    lista = lista + "<a onclick='$(this).recuperarEmotion(" + key + ")'>" + $(this).montaImagemEmotion(value) + '</a>';
            });
            $(settings.listaEmotionsView).prepend(lista);
        };

        /*
        * Ao clicar no emotion ele recupera em qual elemento foi clicado
        * keyEmotion => index do emotion
        */
        $.fn.recuperarEmotion = function (keyEmotion) {
            $.each(arrayEmotions, function (key, value) {
                if (parseInt(key) == keyEmotion)
                    element = value;
            });
            $(settings.campoMensagemID).val($(settings.campoMensagemID).val() + ' ' + element + ' ');
        };

        /*
        * Monta a imagem do emotion e retorna o html
        *_name =>   Qual o nome do arquivo da imagem
        */
        $.fn.montaImagemEmotion = function (_name) {
            return "<img class='img-emotion' src='" + settings.path + _name + settings.extension + "' />";
        }

        /*
        * Retorna a mensagem com os emotion
        *message =>   Parametro da mensagem
        */
        $.fn.retornaMensagemEmotion = function (message) {
            //Remove os espaços e separa em array
            textoDigitado = message.trimLeft().trimRight().toString().split(" ");
            textoCompleto = "";

            //Substitui o carecter digitado pelo emotion
            for (i = 0; i < textoDigitado.length; i++) {
                $.each(arrayEmotions, function (key, value) {
                    if (textoDigitado[i] == value) {
                        textoDigitado[i] = $(this).montaImagemEmotion(nameEmotions[key]);
                    }
                });
            }

            //Imprime todo o texto digitado
            $.each(textoDigitado, function (key, value) {
                textoCompleto = textoCompleto + ' ' + value;
            });

            return textoCompleto;
        }

        //Init method
        $(this).montaListaEmotionView();
    };
})(jQuery);