// npm install assemblyai

import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
	apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function getTranscript(audioUrl: string) {
	const transcript = await client.transcripts.transcribe({
		audio_url: audioUrl,
		language_detection: true,
	});
	console.log(transcript);
	return transcript.text;
}
