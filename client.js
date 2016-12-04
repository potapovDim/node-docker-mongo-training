let clients = []

exports.subscribe = (request, response) => {
    console.log('subscribed')
    clients.push(response)
} 

exports.publish = message => {
    console.log('publish "%s" ',message)
    clients.forEach(res => {
        res.end(message)
    });
    clients = []
}