let phrases;
exports.connect = () => {
    phrases = require('./uk')
}
exports.getPhrase = (name) => {
    if (!phrases[name]) {
        throw new Error('Phrase is epsent' + name)
    }
    return phrases[name]
} 