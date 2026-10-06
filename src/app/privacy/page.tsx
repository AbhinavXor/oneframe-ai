import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export default function PrivacyPage() {
  return <main className="subpage">
    <header className="site-header"><div className="page-width header-inner"><Link href="/" className="brand-link"><BrandMark/></Link><nav><Link href="/">Back to studio</Link></nav></div></header>
    <section className="subpage-hero page-width"><p className="eyebrow">Prototype privacy notes</p><h1>Personal photos deserve explicit handling, not vague copy.</h1><p>These notes describe the current prototype behaviour. They are not a substitute for a production privacy policy.</p></section>
    <section className="page-width prose">
      <h2>Current prototype</h2><p>The app requires the user to confirm that they own the uploaded photo or have permission to use it. The application itself does not persist biometric face embeddings.</p>
      <p>Uploaded and generated media is sent to the configured generation provider. Provider-side storage, retention, and processing are governed by the provider account and terms, so a production launch must document those rules precisely.</p>
      <h2>Before production</h2><p>Add authenticated ownership, private object storage, explicit retention windows, delete controls, signed delivery URLs, provider data review, abuse reporting, and a full privacy policy.</p>
    </section>
  </main>;
}
