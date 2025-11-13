import { IncomingForm } from 'formidable';
import fs from 'fs';
import { useEffect } from 'react';
import Link from 'next/link';

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
    return { props: { text: '❌ No file received.', error: true } };
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
      return { props: { text: `⚠️ Transcription error: ${res.status} ${res.statusText}`, error: true } };
    }

    const text = await res.text();
    return { props: { text, error: false } };
  } catch (error) {
    console.error('Error processing file upload:', error);
    return { props: { text: '⚠️ Internal server error while processing the file.', error: true } };
  }
}

export default function UploadPage({ text, error }) {
  useEffect(() => {
    // Save transcription to localStorage if successful
    if (!error && text && typeof window !== 'undefined') {
      const transcription = {
        id: Date.now().toString(),
        text: text,
        date: new Date().toISOString()
      };

      const stored = localStorage.getItem('transcriptions');
      const transcriptions = stored ? JSON.parse(stored) : [];
      transcriptions.push(transcription);
      localStorage.setItem('transcriptions', JSON.stringify(transcriptions));
    }
  }, [text, error]);

  return (
    <main style={{
      padding: "1rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      maxWidth: "100%",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5"
    }}>
      <header style={{
        marginBottom: "1.5rem",
        paddingBottom: "1rem",
        borderBottom: "2px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        gap: "1rem"
      }}>
        <Link href="/home" style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          backgroundColor: "#0070f3",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "1.2rem",
          flexShrink: 0
        }}>
          ←
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: "1.5rem",
            margin: "0 0 0.25rem 0",
            fontWeight: "600"
          }}>
            Transcription Result
          </h1>
          <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
            {error ? 'Error occurred' : 'Transcription completed'}
          </p>
        </div>
      </header>

      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "1rem"
      }}>
        <div style={{
          fontSize: "0.95rem",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: error ? "#d32f2f" : "#333"
        }}>
          {text}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <Link href="/home" style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#0070f3",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: "600"
        }}>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
