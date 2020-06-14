var url = "http://localhost:8080"
var socket = io(url);

//User selected
function connexion() {
    // debugger
    var pseudo = $('#pseudo').val();
    var password = $('#password').val();

    console.log(pseudo + '$ : ---- ' + password);
    var data = {
        pseudo: pseudo,
        password: password
    };
    console.info(data)
        // debugger
        //Get previous message
    $.ajax({
        type: "POST",
        url: url + '/auth',
        // The key needs to match your method's input parameter (case-sensitive).
        data: data,
        dataType: "json",
        success: function(data) {
            console.info(data);
            if (data.success == true && data.connected == true) {
                // toastr.info(pseudo + " connected!");
                socket.emit('user_connected', {
                    username: pseudo,
                    importance: 1
                });
                //Rediriger l'utilisateur vers la page de chat
                var redirectUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/groupe';
                document.location.href = redirectUrl;
                sessionStorage.setItem('pseudo', data.pseudo);
            } else {
                toastr.error(data.message)
                return;
            }

        },
        failure: function(errMsg) {
            toastr.error("Une erreur est survenue veuillez réessayer!")
            consolelog(errMsg)
                // debugger
        }
    });

    return false;
}