// Importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';


// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: '1093335',
    key: 'df33a047c3953002cdd4',
    secret: '84a4f1dcd5cf10529c9b',
    cluster: 'us2',
    encrypted: true
});

// middleware
app.use(express.json());
app.use(cors());

// BD Config
const connection_url = 'mongodb+srv://admin:9ZExNWLOUT1iZaQx@cluster0.a9e1b.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;

db.once("open", () => {
    console.log('DB Connected');

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log("A Change occured", change);

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',
            {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            });
        } else {
            console.log('Error triggering Pusher');
        }
    });
});

// Api routes
app.get("/", (req, res) => res.status(200).send('Hola Mundo'));

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err){
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
});

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;
    Messages.create(dbMessage, (err, data) => {
        if(err){
            res.status(500).send(err)
        } else {
            res.status(201).send(data);
        }
    })
});

// Listen
app.listen(port, () => console.log(`Listening on localhost: ${port}`));