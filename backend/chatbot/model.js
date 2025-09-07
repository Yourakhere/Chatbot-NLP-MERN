const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

const responses = { 
  "hello": "Hi there! How can I assist you?",
  "bye": "Goodbye! Have a great day!",
  "help": "Sure! What do you need help with?",
  "how are you": "I'm just a bot, but I'm here to help!",
  "what is your name": "I'm your friendly AI chatbot!",
  "thank you": "You're welcome!",
  "good morning": "Good morning! How can I assist you today?",
  "good night": "Good night! Sleep well!",
  "what can you do": "I can answer questions, tell jokes, and assist with your queries. Just ask!",
  "who created you": "I was created by Abhishek and Abhinav!",
  "tell me a joke": "Why don't programmers like nature? It has too many bugs.",
  "what is the time": "I'm not sure, but you can check your device for the current time.",
  "how old are you": "I exist outside of time, so I don't age!",
  "where are you from": "I'm from the digital world!",
  "what is your purpose": "My purpose is to assist you with your questions.",
  "what is AI": "AI, or Artificial Intelligence, is the simulation of human intelligence in machines.",
  "who is the father of AI": "John McCarthy is considered the father of AI.",
  "what is machine learning": "Machine learning is a subset of AI that enables computers to learn from data without being explicitly programmed.",
  "what is deep learning": "Deep learning is a type of machine learning that uses neural networks with multiple layers to analyze data.",
  "what is NLP": "NLP (Natural Language Processing) is a field of AI that focuses on the interaction between computers and humans using natural language.",
  "is AI dangerous": "AI can be powerful, but its impact depends on how it is used. Ethical AI development is crucial!",
  "will AI take over the world": "AI is a tool created by humans. While it can be advanced, human control and ethics play a key role in its future.",
  "what is the Turing test": "The Turing Test, proposed by Alan Turing, assesses a machine's ability to exhibit intelligent behavior indistinguishable from a human."
};
 
for (let i = 1; i <= 9977; i++) {
  responses[`question${i}`] = `This is an auto-generated response number ${i}`;
}

export default responses;


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
