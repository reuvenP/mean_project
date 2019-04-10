var User = require('./models/user');

User.create({
    name: 'Reuven Plevinsky',
    username: 'reuven',
    password: '12345',
    email: 'plevreuven@gmail.com',
    apartment: 2,
    isAdmin: true
}, function(err, user) {
    if (err) throw err;
    console.log('User created:' + user);
});

User.create({
    name: 'Dan Zilberstein0',
    username: 'dzilbers0',
    password: '123',
    email: 'aba40000@gmail.com',
    apartment: 1,
    isAdmin: true
}, function(err, user) {
    if (err) throw err;
    console.log('User created:' + user);
});
