const db = require('../db/index')
function User (name) {
    this.name = name
}

User.prototype.hello = function(who){
    db.connect();
    console.log(db.getPhrase('Hello') + who.name)
}

module.exports = User