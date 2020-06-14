var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;


var io = io(url);
//params
var sender = "";
var receiver = "";
//Js code here
function enterUserName() {
    var username = $('#username').val();
    //save my name to global variable
    sender = username
        //send username to server
    io.emit('user_connected', {
        username: username,
        importance: 1
    });

    return false;
}

//Listen to the server
io.on('user_connected', (username) => {
    console.log(username);
    toastr.info(username + " connected!");
    var tempuserlist = `<li><button class="btn btn-xs btn-success" onclick='onUserSelected(this.innerHTML)'>${username}</button></li>`;
    $('#userlist').append(tempuserlist)
});

//User selected
function onUserSelected(username) {
    console.log('receiver : ---- ' + username);
    receiver = username;
    //Get previous message
    $.ajax({
        type: "POST",
        url: url + '/message_historique',
        // The key needs to match your method's input parameter (case-sensitive).
        data: {
            sender: sender,
            receiver: receiver
        },
        dataType: "json",
        success: function(data) {
            console.info(data);
            var messages = data;
            messages.map((data, index) => {
                var temppreviousmessage = "<li>" + data.sender + " say :  " + data.message + '</li>';
                $('#messagelist').append(temppreviousmessage);
            });
        },
        failure: function(errMsg) {
            toastr.error("Une erreur est survenue veuillez réessayer!")
        }
    });
}


//send Message
function sendMessage() {
    var messageContent = $('#message').val();
    if (receiver == "") {
        toastr.warning("Veuillez selectionner un destinataire ! ");
        return false;
    }
    if (sender == "") {
        toastr.warning("Connectez-vous au chat svp ! ");
        return false;
    }
    var data = {
        sender: sender,
        receiver: receiver,
        message: messageContent
    };
    io.emit('send_message', {
        sender: sender,
        receiver: receiver,
        message: messageContent
    });
    var tempnewmessage = "<li> You say :  " + messageContent + '</li>';
    $('#messagelist').append(tempnewmessage);
    return false;
}

//new message received 
io.on('new_message', function(data) {
    var tempnewmessage = "<li>" + data.sender + " say :  " + data.message + '</li>';
    $('#messagelist').append(tempnewmessage);
});