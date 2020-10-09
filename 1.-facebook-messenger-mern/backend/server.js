// import dependencies
const express = require('express');
const mongoose = require('mongoose');
const Pusher = require('pusher');
const cors = require('cors');

const mongoMessages = require('./messageModel');

// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: '12108731790',
    key: '34701f4dd525c92d2e608034',
    secret: '56c9b172ab3654cebe5e5d76',
    cluster: 'us2',
    useTLS: true
});


// middlewares
app.use(express.json());
app.use(cors());

// db config
const mongoURI = 'mongodb+srv://USER:CODIGO@cluster0.rgrk9.mongodb.net/messengerDB?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.once('open', () => {
    console.log('DB Connected')
    const changeStream = mongoose.connection.collection('messages').watch()
    changeStream.on('change', (change) => {
        pusher.trigger('messages', 'newMessage', {
            'change' : change
        });
    })
})

// api routes
app.get('/', (req, res) => res.status(200).send("Hola Mundo"));

app.post('/save/message', (req, res) => {
    const dbMessage = req.body
    mongoMessages.create(dbMessage, (err, data) => {
        if(err){
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
});

app.get('/retrieve/conversation', (req, res) => {
    mongoMessages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            data.sort((b,a) => {
                return a.timestamp - b.timestamp;
            });

            res.status(200).send(data)
        }
    })
})

// listen
app.listen(port, () => console.log(`listening on localhost: ${port}`));