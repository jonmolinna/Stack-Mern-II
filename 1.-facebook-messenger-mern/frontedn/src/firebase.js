import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBsBY3sgQ4m2Sy6nzsJOJZ5AiPdPsoqTXk",
    authDomain: "facebook-messenger-clone-92dd6.firebaseapp.com",
    databaseURL: "https://facebook-messenger-clone-92dd6.firebaseio.com",
    projectId: "facebook-messenger-clone-92dd6",
    storageBucket: "facebook-messenger-clone-92dd6.appspot.com",
    messagingSenderId: "28643864694",
    appId: "1:28643864694:web:dd170fe8f7713c1474ef57",
    measurementId: "G-YTM0MCYYNV"
})

const db = firebaseApp.firestore()

export default db