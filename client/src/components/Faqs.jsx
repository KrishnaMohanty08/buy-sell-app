import { useState } from 'react';
import '../styles/globals.css';

const FAQS = [
  {
    q: 'How quickly can I list an item?',
    a: 'Most sellers publish their first listing in under 10 minutes. Add photos, a short description, and set your price.',
  },
  {
    q: 'How are payments protected?',
    a: 'Buyer payments are held securely until delivery confirmation, then automatically released to the seller.',
  },
  {
    q: 'Can I return an item if it is not as described?',
    a: 'Yes. Buyer Protection supports returns for eligible orders when items significantly differ from listing details.',
  },
  {
    q: 'Do you support nationwide shipping?',
    a: 'Yes, shipping support is available across 180+ cities with real-time tracking and in-app updates.',
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="home-section home-faqs" aria-labelledby="faqs-title">
      <div className="home-section-head">
        <p className="home-kicker">FAQs</p>
        <h2 id="faqs-title" className="home-section-title">Everything you need to know</h2>
      </div>

      <div className="faqs-list">
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <article key={item.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <span className="faq-symbol">{isOpen ? '-' : '+'}</span>
              </button>
              {isOpen && <p className="faq-answer">{item.a}</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
}