import '../styles/globals.css';



const stars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);

export default function Reviews() {
  // TODO: Fetch real community reviews from API
  const REVIEWS = [];
  
  if (REVIEWS.length === 0) {
    return null; // Hide section when no real reviews are available
  }

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
