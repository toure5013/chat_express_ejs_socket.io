var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;


var io = io(url);
var date = new Date();

const chatBody = document.getElementById('chatBody');

function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
    $("#chatBody").stop().animate({ scrollTop: $("#chatBody")[0].scrollHeight }, 1000);

}


scrollToBottom();


//params*
// sessionStorage.setItem("pseudo", "mira");
var sender = sessionStorage.getItem("pseudo");
var receiver = "mira-groupe";

console.log('sender  : ' + sender);
console.log('receiver  : ' + receiver);
$('#img').attr("src", `${sender}.png`);

//User selected
function getPreviousMsg() {
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
            // console.info(data);
            var messages = data;
            messages.map((data, index) => {
                // messages.map((data, index) => {});
                console.log(data)
                if (data.sender == sender) {
                    var temp = `<div class="d-flex justify-content-start mb-4">
                            <div class="img_cont_msg">
                                <img src="assets/images/${data.sender}.png" class="rounded-circle user_img_msg">
                            </div>
                            <div class="msg_cotainer">
                                ${data.message}
                                <span class="msg_time">${date.getHours()} h:  ${date.getMinutes()} min</span>
                            </div>
                        </div>`;
                    $('#chatBody').append(temp);
                } else {
                    var temp = `<div class="d-flex justify-content-end mb-4">

                            <div class="msg_cotainer_send">
                                ${data.message}
                                <span class="msg_time_send">${date.getHours()} h:  ${date.getMinutes()} min</span>
                            </div>
                            <div class="img_cont_msg">
                                <img src="assets/images/${data.sender}.png" class="rounded-circle user_img_msg">
                                 <span class="mb-1">${data.sender}</span>

                            </div>
                        </div>`
                    $('#chatBody').append(temp);
                }
            });

        },
        failure: function(errMsg) {
            toastr.error("Une erreur est survenue veuillez réessayer!")
        }
    });
}


//Listen to the server
io.on('user_connected', (username) => {
    console.log(username);
    toastr.info(username + " connected!");
    var tempuserlist = `<li><button class="btn btn-xs btn-success" onclick='onUserSelected(this.innerHTML)'>${username}</button></li>`;
    $('#userlist').append(tempuserlist)
});
getPreviousMsg();

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
    if (messageContent == "") {
        toastr.info("Entrer le message à envoyer svp ! ");
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
    $('#message').val('');
    shouldScroll = chatBody.scrollTop + chatBody.clientHeight === chatBody.scrollHeight;
    // After getting your messages.
    if (!shouldScroll) {
        scrollToBottom();
    }
    $("#chatBody").stop().animate({ scrollTop: $("#chatBody")[0].scrollHeight }, 1000);
    return false;
}


//new message received 
io.on('new_message', function(data) {
    var tempnewmessage = "<li>" + data.sender + " say :  " + data.message + '</li>';
    $('#messagelist').append(tempnewmessage);
});



//Le message que j'ai envoyé
io.on('monmsg', (data) => {
    var temp = `<div class="d-flex justify-content-start mb-4">
        <div class="img_cont_msg">
        <img src="assets/images/${sender}.png" class="rounded-circle user_img_msg">
        </div>
        <div class="msg_cotainer">
            ${data.message}
            <span class="msg_time">${date.getHours()} h:  ${date.getMinutes()} min</span>
        </div>
    </div>`;
    $('#chatBody').append(temp);
});

//Le message que j'ai reçu
io.on('newmsgrecive', (data) => {
    var temp = `<div class="d-flex justify-content-end mb-4">
                    <div class="msg_cotainer_send">
                        ${data.message}
                        <span class="msg_time_send">${date.getHours()} h:  ${date.getMinutes()} min</span>
                    </div>
                    <div class="img_cont_msg">
                    <img src="assets/images/${data.sender}.png" class="rounded-circle user_img_msg">
                    </div>
                </div>`
    $('#chatBody').append(temp);
});