import '../styles/globals.css';

const COLUMNS = [
  {
    title: "Shop",
    links: ["New Arrivals", "Trending Now", "Categories", "Curated Drops", "Flash Sales"],
  },
  {
    title: "Sell",
    links: ["Start Selling", "Seller Dashboard", "Pricing & Fees", "Seller Guide", "Become a Pro"],
  },
  {
    title: "Support",
    links: ["Help Centre", "Buyer Protection", "Returns Policy", "Track Order", "Contact Us"],
  },
];

const SOCIALS = ["li", "tw", "ig", "yt"];
const LEGAL   = ["Privacy", "Terms", "Cookies", "Accessibility"];

export default function Footer() {
  return (
    <footer className="footer-root">
        <div className="footer-top">
          {/* Brand column */}
          <div>
            <span className="footer-logo">BAZAAR</span>
            <p className="footer-brand-desc">
              The premium marketplace for rare, vintage, and curated goods.
              Trade with confidence.
            </p>
            <div className="social-row">
              {SOCIALS.map((s) => (
                <a key={s} href="#" className="social-btn" aria-label={s}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <h5 className="footer-col-title">{title}</h5>
              <ul className="footer-col-list">
                {links.map((link) => (
                  <li key={link}>
                    <button className="footer-col-link">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} BAZAAR Ltd. All rights reserved.
          </p>
          <ul className="footer-legal">
            {LEGAL.map((item) => (
              <li key={item}>
                <button className="footer-legal-link">{item}</button>
              </li>
            ))}
          </ul>
        </div>
      </footer>
  );
}
