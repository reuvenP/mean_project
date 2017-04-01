/**
 * Created by Home on 15/03/2017.
 */
var Message = require('../models/message');

var addMessage = function(sender, room, text, link, img, isOnlyForConnected, then) {
    var message = new Message({
        sender: sender,
        room: room,
        text: text,
        link: link,
        img: img,
        isOnlyForConnected: isOnlyForConnected
    });
    message.save(function (err) {
        if (err) return then(err);
        then();
    });
}

var addVote = function(msg_id, isPositive, ip, then) {
    Message.findById(msg_id, function (err, msg) {
        if (err) return then(err);
        for (var i = 0; i < msg.votes.length; i++) {
            if (msg.votes[i].ip == ip) {
                return then("IP already voted");
            }
        }
        msg.votes.push({isPositive: isPositive, ip:ip});
        msg.save(function (err) {
            if (err) return then(err);
            then();
        })
    });
}
