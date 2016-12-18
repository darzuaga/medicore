var firebase = require('firebase')

var config = {
    apiKey: "AIzaSyBpmjWGKcQNieZqfnwSGR7ojfpAgO87DR0",
    authDomain: "medicore-9c7ec.firebaseapp.com",
    databaseURL: "https://medicore-9c7ec.firebaseio.com",
    storageBucket: "medicore-9c7ec.appspot.com",
    messagingSenderId: "552584429319"
};

export const db = firebase.initializeApp(config);
