const User = require('./user');
const firstUser = new User('Vasya');
const seconduser = new User('Petya');


if(module.parent){
     exports.helloUser = firstUser.hello(firstUser);
} else {
    firstUser.hello(seconduser);
}