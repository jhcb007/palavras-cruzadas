function statusChangeCallback(response) {
    if (response.status === 'connected') {
        testAPI();
    } else {
        document.getElementById('status').innerHTML = 'Você não está logado';
    }
}

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
        cosole.log(response)
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '1061421020656966',
        cookie: true,  // enable cookies to allow the server to access
        xfbml: true,  // parse social plugins on this page
        version: 'v2.8' // use graph api version 2.8
    });
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.8";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function setAluno() {
    if (!_ID_FACEBOOK) {
        return;
    }
    var dados = {
        nome: _NOME,
        id_facebook: _ID_FACEBOOK
    }
    $.ajax({
        type: 'POST',
        url: _url,
        data: JSON.stringify(dados),
        success: function (data) {
            //console.log(data);
        },
        contentType: "application/json",
        dataType: 'json'
    });
}


function testAPI() {
    FB.api('/me', function (response) {
        _ID_FACEBOOK = response.id;
        _NOME = response.name;
        setAluno();
        document.getElementById('status').innerHTML = 'Você está logado como ' + response.name + '!';
        document.getElementById("acessar_turma").style.display = "block";
    });
}