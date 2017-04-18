/**
 * Created by Home on 15/03/2017.
 */
var Message = require('../models/message');
var debug = require('debug')('nodejs-project:users');
var extend = require('util')._extend;

var addMessage = function(senderId, roomId, text, link, img, isOnlyForConnected, then) {
    var message = new Message({
        sender: senderId,
        room: roomId,
        text: text,
        link: link,
        img: img,
        submitDate: new Date(),
        positiveVotes: 0,
        negativeVotes: 0,
        isOnlyForConnected: isOnlyForConnected
    });
    message.save(then);
};

var addVote = function(msg_id, isPositive, ip, then) {
    Message.findById(msg_id, function (err, msg) {
        if (err) return then(err);
        for (var i = 0; i < msg.votes.length; i++) {
            if (msg.votes[i].ip == ip) {
                return then("IP already voted");
            }
        }
        msg.votes.push({isPositive: isPositive, ip:ip});
        if (isPositive) {
            msg.positiveVotes++;
        }
        else {
            msg.negativeVotes++;
        }

        msg.save(then);
    });
};

var getMessagesBySender = function (senderId, then) {
    Message.find({sender: senderId, isOnlyForConnected: false}, then);
};

var getMsgsBySenderBetweenDates = function (senderId, date_start, date_end, then) {
    Message.find({sender: senderId, isOnlyForConnected: false, submitDate: {$gte: date_start, $lte: date_end}}, then);
};

var getVotesOfUser = function (userId, then) {
    if (!userId) {
        return then('user empty', 0, 0);
    }
    Message.find({sender: userId, isOnlyForConnected: false}, function (err, msgs) {
        if (err) {
            return then(err, 0, 0);
        }
        var pos = 0, neg = 0;
        for (var i = 0; i < msgs.length; i++) {
            pos += msgs[i].positiveVotes;
            neg += msgs[i].negativeVotes;
        }
        return then(null, pos, neg);
    })
};

var exporter = {};
exporter.addMessage = addMessage;
exporter.addVote = addVote;
exporter.getMessagesBySender = getMessagesBySender;
exporter.getMsgsBySenderBetweenDates = getMsgsBySenderBetweenDates;
exporter.getVotesOfUser = getVotesOfUser;
module.exports = exporter;
