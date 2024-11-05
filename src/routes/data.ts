import express from 'express';
import { db } from '../firebase/config';
import { json } from 'body-parser';
import { error } from 'console';

const database = db;

const router = express.Router();

router.get('/:collection/:document', async (req, res) => {
	const collection = req.params.collection as string;
	const document = req.params.document as string;

	try {
		const chatDoc = db.collection(collection).doc(document);

		chatDoc.get().then((doc) => {
			if (doc.exists) {
				console.log('Document data:', doc.data());
				res.json(doc.data());
			} else {
				console.log('No such document!');
			}
		});
	} catch (error) {
		console.error('Error searching places:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router;
