import Link from 'next/link';

export default function LandingPage() {
  return (
    <main style={{
      padding: "2rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      lineHeight: "1.6"
    }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Hate Voice Message 🎙️</h1>
      
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>What is this app?</h2>
        <p style={{ marginBottom: "1rem" }}>
          Hate Voice Message is a Progressive Web App (PWA) that helps you transcribe and summarize voice messages from WhatsApp or any other audio files.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          Simply share an audio file to the app, and it will automatically transcribe the content using AI and provide you with a summary.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>How to download and install</h2>
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>📱 On iPhone (Safari):</h3>
          <ol style={{ paddingLeft: "1.5rem" }}>
            <li>Open Safari and navigate to this page</li>
            <li>Tap the Share button (square with arrow)</li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" to confirm</li>
          </ol>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>🤖 On Android (Chrome):</h3>
          <ol style={{ paddingLeft: "1.5rem" }}>
            <li>Open Chrome and navigate to this page</li>
            <li>Tap the menu (three dots) in the top right</li>
            <li>Tap "Add to Home screen" or "Install app"</li>
            <li>Tap "Add" or "Install" to confirm</li>
          </ol>
        </div>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>How to use</h2>
        <ol style={{ paddingLeft: "1.5rem" }}>
          <li>Install the app on your phone using the instructions above</li>
          <li>Open a voice message in WhatsApp</li>
          <li>Tap the Share button</li>
          <li>Select "Hate Voice Message" from the share menu</li>
          <li>The app will automatically transcribe and summarize the audio</li>
        </ol>
      </section>

      <div style={{ marginTop: "3rem", textAlign: "center" }}>
        <Link href="/home" style={{
          display: "inline-block",
          padding: "1rem 2rem",
          backgroundColor: "#0070f3",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "1.1rem",
          fontWeight: "600"
        }}>
          Open App →
        </Link>
      </div>
    </main>
  );
}
