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
        submitDate: new Date(),
        isOnlyForConnected: isOnlyForConnected
    });
    message.save(function (err) {
        if (err) return then(err);
        then();
    });
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
        msg.save(function (err) {
            if (err) return then(err);
            then();
        })
    });
};

var getMessages = function (then) {
    Message.find({}, function (err, msgs) {
        then(err, msgs);
    });
};

var getVotes = function (msg, then) {
    if (!msg) return then('message empty', 0, 0);
    var pos = 0, neg = 0;
    for (var i = 0; i < msg.votes.length; i++) {
        if (msg.votes[i].isPositive) {
            pos++;
        }
        else {
            neg++;
        }
    }
    return then(null, pos, neg);
};

var getMsgsBySenderBetweenDates = function (sender, date_start, date_end, then) {
    Message.find({sender: sender, submitDate: {$gte: date_start, $lte: date_end}}, function (err, msgs) {
        then(err, msgs);
    })
};

var getVotesOfUser = function (user, then) {
    if (!user) {
        return then('user empty', 0, 0);
    }
    Message.find({sender: user}, function (err, msgs) {
        if (err) {
            return then(err, 0, 0);
        }
        var pos = 0, neg = 0;
        for (var i = 0; i < msgs.length; i++) {
            for (var j = 0; j < msgs[i].votes.length; j++) {
                if (msgs[i].votes[j].isPositive) {
                    pos++;
                }
                else {
                    neg++;
                }
            }
        }
        return then(null, pos, neg);
    })
};




