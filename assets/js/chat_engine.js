class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox=`#${chatBoxId}`;
        this.userEmail=userEmail;
        this.socket=io.connect('http://localhost:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self=this;
        this.socket.on('connect',function(){
            console.log('Connection established using sockets.');
            self.socket.emit('join_room',{
                user_email: self.userEmail,
                chatroom: 'codial'
            });
            self.socket.on('user_joined',function(data){
                console.log('User joined.',data);
            });
        });

        $('#send-message button').click(function(){
            let msg=$('#send-message textarea').val();
            if(msg != ''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codial'
                });
            }
        });

        this.socket.on('receive_message',function(data){
            console.log('Message received',data.message);
            let newMessage=$('<div>');
            let messageType='left';
            console.log(data.user_email,self.userEmail);
            if(data.user_email === self.userEmail){
                console.log('true same hai ');
                messageType='right';
            }
            newMessage.append($('<p>',{
                'html': data.message
            }));
            newMessage.addClass(messageType);
            newMessage.addClass('message');
            $('#message-window').append(newMessage);
        });

    };
};