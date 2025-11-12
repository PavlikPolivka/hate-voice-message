import { IncomingForm } from 'formidable';
import fs from 'fs';

export async function getServerSideProps({ req }) {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return reject(err);
      }
      if (!files.file || files.file.length === 0) {
        return resolve({ file: null });
      }
      resolve({ file: files.file[0] });
    });
  });

  const { file } = data;

  if (!file) {
    return { props: { text: '❌ Žádný soubor nepřišel.' } };
  }

  try {
    const fileContent = fs.readFileSync(file.filepath);

    let mimeType = file.mimetype;
    if (mimeType === 'application/octet-stream') {
      const fileExtension = file.originalFilename.split('.').pop()?.toLowerCase();
      switch (fileExtension) {
        case 'opus':
          mimeType = 'audio/opus';
          break;
        case 'mp3':
          mimeType = 'audio/mpeg';
          break;
        case 'wav':
          mimeType = 'audio/wav';
          break;
        case 'm4a':
          mimeType = 'audio/mp4';
          break;
        case 'flac':
          mimeType = 'audio/flac';
          break;
        case 'aac':
          mimeType = 'audio/aac';
          break;
        case 'amr':
          mimeType = 'audio/amr';
          break;
        default:
          // Keep original mime type if extension is unknown
          break;
      }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/transcribe-gemini`, {
      method: "POST",
      headers: {
        'Content-Type': mimeType,
      },
      body: fileContent,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error from transcribe API:', errorText);
      return { props: { text: `⚠️ Chyba při přepisu: ${res.status} ${res.statusText}` } };
    }

    const text = await res.text();
    return { props: { text } };
  } catch (error) {
    console.error('Error processing file upload:', error);
    return { props: { text: '⚠️ Interní chyba serveru při zpracování souboru.' } };
  }
}

export default function UploadPage({ text }) {
  return (
    <main style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>📜 Výsledek:</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </main>
  );
}