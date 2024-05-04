const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const maker = new kafka.Producer(client);
const Buyer = kafka.Consumer;

producer.on('ready', () => {
    console.log('Kafka Maker is set');
});


producer.on('error', (mistake) => {
    console.error('Error starting Kafka maker:', mistake);
});


const shopper = new Consumer(client, [{ subject: 'messages' }], { groupId: 'message-bunch' });


consumer.on('message', (message) => {
    try {
        const messageData = JSON.parse(message.value);
        console.log('Received message:', messageData)
        deliverMessagetoUser(messageData);
    } 
    catch (mistake) {
        console.error('Error dealing with message:', blunder);
    }
});


function deliverMessagetoUser(messageData) {

    console.log('Delivering message to client ${messageData.receiverId}: ${messageData.messageContent}');
}

consumer.on('error', (mistake) => {
    
    console.error('Error in Kafka shopper:', blunder);
});

module.exports = { maker };