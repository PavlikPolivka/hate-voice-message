import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = { runtime: "edge" };

export default async function handler(req) {
  console.log("--- New Request ---");
  console.log("Time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  if (req.method !== "POST") {
    console.log("Invalid method:", req.method);
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const audioBlob = await req.blob();
    const mimeType = audioBlob.type;
    console.log(`Received audio blob. Type: ${mimeType}, Size: ${audioBlob.size} bytes`);

    if (!mimeType || !mimeType.startsWith("audio/")) {
        console.log("Invalid MIME type:", mimeType);
        return new Response(`Unsupported file type: ${mimeType}`, { status: 400 });
    }

    const arrayBuffer = await audioBlob.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = "Transcribe this audio recording. IMPORTANT: Transcribe the text in the same language as the audio is spoken. Do not translate it. After the transcription, provide a brief summary in the same language as the audio.";
    const audioPart = {
      inlineData: {
        data: base64Audio,
        mimeType: mimeType,
      },
    };

    console.log("Sending request to Gemini API via SDK...");
    const result = await model.generateContent([prompt, audioPart]);
    const response = await result.response;
    const output = response.text();

    console.log("Successfully extracted text from Gemini response.");

    return new Response(output, { status: 200 });

  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return new Response("An internal server error occurred.", { status: 500 });
  }
}
