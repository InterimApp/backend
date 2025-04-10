const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Download from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "manpower-f9e5d.firebasestorage.app" // Replace with your bucket
});

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };