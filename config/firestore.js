const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Path to service account key
const serviceAccountPath = path.join(__dirname, 'service-account-key.json');

// Check if file exists
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Firebase service account key not found at: ${serviceAccountPath}`);
}

try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    storageBucket: `${serviceAccount.project_id}.appspot.com`
  });

  const db = admin.firestore();
  const bucket = admin.storage().bucket();

  console.log('✅ Firebase initialized successfully');
  module.exports = { db, bucket };
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  process.exit(1);
}