const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

const responses = {
    "hello": "Hi there! How can I assist you?",
    "bye": "Goodbye! Have a great day!",
    "help": "Sure! What do you need help with?",
    "how are you": "I'm just a bot, but I'm here to help!",
    "what is your name": "I'm your friendly chatbot!",
    "thank you": "You're welcome!",
    "good morning": "Good morning! How can I assist you today?",
    "good night": "Good night! Sleep well!",
    "what can you do": "I can assist you with your queries. Just ask!",
    "who created you": "I was created by a team of developers.",
    "tell me a joke": "Why don't programmers like nature? It has too many bugs.",
    "what is the time": "I'm not sure, but you can check your device for the current time.",
    "how old are you": "I exist outside of time, so I don't age!",
    "where are you from": "I'm from the digital world!",
    "what is your purpose": "My purpose is to assist you with your questions."
};

let model; 
async function loadModel() {
    if (!model) {
        model = await use.load();
    }
    return model;
}

async function getEmbedding(sentence) {
    const model = await loadModel();
    const embeddings = await model.embed([sentence]);
    return embeddings.array();
}

async function getResponse(userMessage) {
       for (let key in responses) {
        if (userMessage.toLowerCase().includes(key)) {
            return responses[key];
        }
    }

      return "I'm not sure how to respond to that.";
}

module.exports = { getResponse };