import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [transcriptions, setTranscriptions] = useState([]);

  useEffect(() => {
    // Load transcriptions from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('transcriptions');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Sort by date, newest first
          const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
          setTranscriptions(sorted);
        } catch (e) {
          console.error('Error parsing transcriptions:', e);
        }
      }
    }
  }, []);

  const deleteTranscription = (id) => {
    const updated = transcriptions.filter(t => t.id !== id);
    setTranscriptions(updated);
    localStorage.setItem('transcriptions', JSON.stringify(updated));
  };

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
        borderBottom: "2px solid #e0e0e0"
      }}>
        <h1 style={{
          fontSize: "1.5rem",
          margin: "0 0 0.5rem 0",
          fontWeight: "600"
        }}>
          Hate Voice Message 🎙️
        </h1>
        <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
          Share audio files to transcribe and summarize
        </p>
      </header>

      {transcriptions.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem 1rem",
          color: "#999"
        }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            No transcriptions yet
          </p>
          <p style={{ fontSize: "0.9rem" }}>
            Share an audio file from WhatsApp or other apps to get started
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {transcriptions.map((transcription) => (
            <div
              key={transcription.id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.5rem"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "#666",
                    marginBottom: "0.5rem"
                  }}>
                    {new Date(transcription.date).toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word"
                  }}>
                    {transcription.text}
                  </div>
                </div>
                <button
                  onClick={() => deleteTranscription(transcription.id)}
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    flexShrink: 0
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

