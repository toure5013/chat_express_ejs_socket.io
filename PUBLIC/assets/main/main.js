var idUser = "";

var socket = io();
var date = new Date();
// Socket code
socket.on('newUser', (message) => {
    // console.log(message);
    toastr.info(message, tostrOptions);

});

function envoyerMessage() {
    var message = document.getElementById('msg').value;
    socket.emit('message', {
        content: message,
        importance: 1
    });
    document.getElementById('msg').value = '';
}

//Le message que j'ai envoyé
socket.on('monmsg', (message) => {
    var temp = `<div class="d-flex justify-content-start mb-4">
        <div class="img_cont_msg">
            <img src="assets/images/me.png" class="rounded-circle user_img_msg">
        </div>
        <div class="msg_cotainer">
            ${message.content}
            <span class="msg_time">${date.getHours()} h:  ${date.getMinutes()} min</span>
        </div>
    </div>`;
    $('#chatBody').append(temp);
});


//Le message que j'ai reçu
socket.on('newmsgrecive', (message) => {
    var temp = `<div class="d-flex justify-content-end mb-4">
                    <div class="msg_cotainer_send">
                        ${message.content}
                        <span class="msg_time_send">${date.getHours()} h:  ${date.getMinutes()} min</span>
                    </div>
                    <div class="img_cont_msg">
                        <img src="" class="rounded-circle user_img_msg">
                    </div>
                </div>`
    $('#chatBody').append(temp);
});