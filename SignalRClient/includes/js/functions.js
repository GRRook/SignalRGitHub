﻿// Set the hubs URL for the connection
$.connection.hub.url = "http://localhost:8080/signalr";
// Declare a proxy to reference the hub.
var chatHubConnection = $.connection.myHub;

// User login event
$('#loginUser').on('click', function() {
    // User the entered username
    login($('#username').val());
});

// Send message event
$('#sendMessage').on('click', function () {
    var msg = $('#secretMessage').val();
    var toId = 'unknown';
    chatHubConnection.server.sendMessage(sessionStorage.getItem("connectionID"), toId, msg);
});

// Select a user event
$(document).on('click', '.user', function () {
    console.log($(this).find('h5').attr('id'));
});

// Receive new online user event
chatHubConnection.client.getNewOnlineUser = function (id, username) {
    // Add the user to the online users list
    addUserToOnlineUserList(id, username);
};

// Receive all online users event
chatHubConnection.client.getAllOnlineUsers = function (users) {
    console.log(users);

    // Save the connectionID in the sessionStorage
    sessionStorage.setItem("connectionID", $.connection.hub.id);

    // Add all online users to the online users list
    $.each(users, function (id, username) {
        addUserToOnlineUserList(id, username)
    });
};

// Receive new message event
chatHubConnection.client.getNewMessage = function (sender, message) {
    console.log(sender);
    console.log(message);
};

// Receive disconnected user event
chatHubConnection.client.getDisconnectedUser = function (id) {
    // Remove the disconnected user from the online users list
    $('#'+id).closest('li').remove();
};

// Add user to online users list
function addUserToOnlineUserList(id, username) {
    if(id != sessionStorage.getItem("connectionID")){
        $('.onlineUsers .panel-body > .media-list').append(
            "<li class=\"media user\"> \
                <div class=\"media-body\"> \
                    <div class=\"media\"> \
                        <a class=\"pull-left\"> \
                            <img class=\"media-object img-circle\" style=\"max-height:40px;\" src=\"includes/images/Vrouw.png\" /> \
                        </a> \
                        <div class=\"media-body\"> \
                            <h5 id=\"" + id + "\"> " + username + " </h5> \
                            <small class=\"text-muted\">Man</small> \
                            <span class=\"badge pull-right warning\">4</span> \
                        </div> \
                    </div> \
                </div> \
            </li>"
        );
    }
}

function addMessageToList(message) {
    $().append(
        "<li class=\"media\"> \
            <div class=\"media-body\"> \
                <div class=\"media\"> \
                    <a class=\"pull-left\"> \
                        <img class=\"media-object img-circle \" src=\"includes/images/Man.png\" /> \
                    </a> \
                    <div class=\"media-body\"> \
                        + message + \
                        <hr /> \
                    </div> \
                </div> \
            </div> \
        </li>"
    );
}
function login(username) {
    // Start connection
    $.connection.hub.start().done(function () {
        chatHubConnection.server.login(username);
    });

    /* Setup OTR */
    // Check if there is a DSA key available
    var myKey = localStorage.getItem("DSA");
    if (myKey == null) {
        // Generate and save a new DSA key
        myKey = new DSA();
        localStorage.setItem("DSA", myKey);
    }
}

//function startConversation() {
//    // provide options
//    var options = {
//        fragment_size: 140
//        , send_interval: 200
//        , priv: localStorage.getItem("DSA")
//    }

//    /*For each user you're communicating with, instantiate an OTR object.*/
//    // How do we do that?

//    var buddy = new OTR(options)

//    buddy.on('ui', function (msg, encrypted, meta) {
//        console.log("message to display to the user: " + msg)
//        // encrypted === true, if the received msg was encrypted
//        console.log("(optional) with receiveMsg attached meta data: " + meta)
//    })

//    buddy.on('io', function (msg, meta) {
//        console.log("message to send to buddy: " + msg)
//        console.log("(optional) with sendMsg attached meta data: " + meta)
//    })

//    buddy.on('error', function (err, severity) {
//        if (severity === 'error')  // either 'error' or 'warn'
//            console.error("error occurred: " + err)
//    })
//}

//function sendMessage(msg) {
//    buddy.REQUIRE_ENCRYPTION = true;
//    buddy.sendMsg(msg);
//}

//function receiveMessage(msg) {
//    return buddy.receiveMsg(msg);
//}

//function endConversation() {
//    buddy.endOtr(function () {
//        // Calls backwhen the 'disconnect' message has been sent.
//    });
//}