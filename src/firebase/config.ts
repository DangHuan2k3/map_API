'use strict';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccount = {
	project_id: process.env.PROJECT_ID,
	private_key: process.env.PRIVATE_KEY?.replace(/\\n/gm, '\n'),
	client_email: process.env.CLIENT_EMAIL,
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const firebaseAdmin = admin;
export const db = admin.firestore();
