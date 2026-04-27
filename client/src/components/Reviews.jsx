import '../styles/globals.css';

const REVIEWS = [
  {
    id: 1,
    name: 'Rhea Kapoor',
    role: 'Vintage Seller',
    quote: 'I listed three pieces in under ten minutes and got my first buyer the same evening.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Arjun Menon',
    role: 'Collector',
    quote: 'The quality filters are top-tier. I finally found authentic collectibles without endless scrolling.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sana Qureshi',
    role: 'Home Decor Buyer',
    quote: 'Checkout felt safe, shipping updates were clear, and the item matched the listing perfectly.',
    rating: 4,
  },
];

const stars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);

export default function Reviews() {
  return (
    <section className="home-section home-reviews" aria-labelledby="reviews-title">
      <div className="home-section-head">
        <p className="home-kicker">Community Stories</p>
        <h2 id="reviews-title" className="home-section-title">Loved by buyers and sellers</h2>
      </div>

      <div className="reviews-grid">
        {REVIEWS.map((review) => (
          <article key={review.id} className="review-card">
            <p className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
              {stars(review.rating)}
            </p>
            <p className="review-quote">"{review.quote}"</p>
            <p className="review-name">{review.name}</p>
            <p className="review-role">{review.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
