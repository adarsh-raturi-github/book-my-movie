interface CTASectionProps {
  onSubscribe?: () => void;
}

export function CTASection({ onSubscribe }: CTASectionProps) {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>Don't Miss Out!</h2>
        <p>Get exclusive offers and early access to new releases</p>
        <button className="btn-secondary" onClick={onSubscribe}>
          Subscribe to Newsletter
        </button>
      </div>
    </section>
  );
}
