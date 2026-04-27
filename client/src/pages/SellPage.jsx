import { useState } from "react";
import "../styles/globals.css";
import "../styles/pageStyles.css";

const CATEGORIES = ["Electronics","Fashion","Home & Living","Books","Sports","Collectibles","Automotive","Music","Art","Other"];
const CONDITIONS = [
  {label:"New",     emoji:"✨", desc:"Never used"},
  {label:"Like New",emoji:"💎", desc:"Barely used"},
  {label:"Good",    emoji:"👍", desc:"Minor wear"},
  {label:"Fair",    emoji:"🔧", desc:"Visible wear"},
];

const MOCK_IMAGES = ["📱","🎧","👜","💡"];

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [condition, setCondition] = useState("Like New");
  const [negotiable, setNegotiable] = useState(false);
  const [tags, setTags] = useState(["vintage","rare"]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([0,1]);

  const STEPS = ["Details","Pricing","Photos","Review"];

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      setTags(p => [...p, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (t) => setTags(p => p.filter(x => x !== t));

  if (done) return (
    <>
      <div className="sell-page">
        <div className="sell-inner">
          <div className="success-state">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Listing Live!</h2>
            <p className="success-sub">Your item is now live on AURUM. You'll be notified when someone shows interest.</p>
            <div style={{display:"flex",gap:"0.8rem",justifyContent:"center",flexWrap:"wrap"}}>
              <button className="btn-primary" onClick={()=>{setDone(false);setStep(0);}}>List Another</button>
              <button className="btn-ghost">View Listing →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="sell-page">
        <div className="sell-inner">
          {/* Header */}
          <div className="sell-header">
            <div className="sell-eyebrow">New Listing</div>
            <h1 className="sell-title">Sell <span>Your Item</span></h1>
            <p className="sell-sub">List in minutes. Reach thousands of buyers.</p>
          </div>

          {/* Steps */}
          <div className="steps-nav">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`step-tab ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
                onClick={() => i < step && setStep(i)}
              >
                <div className="step-num">{i < step ? "✓" : i + 1}</div>
                <div className="step-label">{s}</div>
              </div>
            ))}
          </div>

          {/* Two-col */}
          <div className="sell-layout">
            <div>
              {/* STEP 0 — Details */}
              {step === 0 && (
                <>
                  <div className="form-card">
                    <div className="form-card-header">
                      <span>📝</span>
                      <h3>Basic Details</h3>
                    </div>
                    <div className="form-body">
                      <div className="field">
                        <label>Title <span className="req">*</span></label>
                        <input className="f-input" placeholder="e.g. Sony WH-1000XM5 Headphones (Black)" />
                      </div>
                      <div className="field-row col2">
                        <div className="field">
                          <label>Category <span className="req">*</span></label>
                          <select className="f-select">
                            <option value="">Select category</option>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="field">
                          <label>Brand</label>
                          <input className="f-input" placeholder="e.g. Sony, Nike, IKEA" />
                        </div>
                      </div>
                      <div className="field">
                        <label>Description <span className="req">*</span></label>
                        <textarea className="f-textarea" placeholder="Describe your item honestly — condition, features, reason for selling, included accessories..." />
                      </div>
                      <div className="field">
                        <label>Condition <span className="req">*</span></label>
                        <div className="condition-grid">
                          {CONDITIONS.map(c => (
                            <div
                              key={c.label}
                              className={`cond-option ${condition === c.label ? "selected" : ""}`}
                              onClick={() => setCondition(c.label)}
                            >
                              <div className="cond-emoji">{c.emoji}</div>
                              <div className="cond-label">{c.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="field">
                        <label>Tags</label>
                        <div className="tags-wrap">
                          {tags.map(t => (
                            <div className="tag-chip" key={t}>
                              {t}
                              <span className="tag-x" onClick={() => removeTag(t)}>✕</span>
                            </div>
                          ))}
                          <input
                            className="tag-input-inline"
                            placeholder="Add tag + Enter"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={addTag}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 1 — Pricing */}
              {step === 1 && (
                <div className="form-card">
                  <div className="form-card-header">
                    <span>💰</span>
                    <h3>Pricing</h3>
                  </div>
                  <div className="form-body">
                    <div className="field-row col2">
                      <div className="field">
                        <label>Asking Price <span className="req">*</span></label>
                        <div className="price-wrap">
                          <span className="price-prefix">₹</span>
                          <input className="f-input" type="number" placeholder="0" />
                        </div>
                      </div>
                      <div className="field">
                        <label>Original Price</label>
                        <div className="price-wrap">
                          <span className="price-prefix">₹</span>
                          <input className="f-input" type="number" placeholder="0" />
                        </div>
                      </div>
                    </div>
                    <div className="field-row col2">
                      <div className="field">
                        <label>Stock Quantity <span className="req">*</span></label>
                        <input className="f-input" type="number" placeholder="1" defaultValue="1" />
                      </div>
                      <div className="field">
                        <label>Year of Purchase</label>
                        <input className="f-input" type="number" placeholder="e.g. 2022" />
                      </div>
                    </div>
                    <div className="toggle-row">
                      <div className="toggle-info">
                        <h4>Open to Negotiation</h4>
                        <p>Allow buyers to send you offers below your listed price</p>
                      </div>
                      <div className={`toggle ${negotiable ? "on" : ""}`} onClick={() => setNegotiable(p => !p)}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                    <div className="field">
                      <label>Shipping</label>
                      <select className="f-select">
                        <option>Free shipping</option>
                        <option>Flat rate — ₹99</option>
                        <option>Flat rate — ₹199</option>
                        <option>Calculated at checkout</option>
                        <option>Pickup only</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Photos */}
              {step === 2 && (
                <div className="form-card">
                  <div className="form-card-header">
                    <span>📸</span>
                    <h3>Photos</h3>
                  </div>
                  <div className="form-body">
                    <div className="upload-zone">
                      <div className="upload-icon">📂</div>
                      <div className="upload-text"><strong>Click to upload</strong> or drag & drop</div>
                      <div className="upload-sub">PNG, JPG, WEBP up to 8MB — max 8 images</div>
                    </div>
                    <div className="image-previews">
                      {images.map((img, i) => (
                        <div className={`preview-thumb ${i === 0 ? "primary" : ""}`} key={i}>
                          {MOCK_IMAGES[i % MOCK_IMAGES.length]}
                          <button className="thumb-remove" onClick={() => setImages(p => p.filter((_, j) => j !== i))}>✕</button>
                        </div>
                      ))}
                    </div>
                    <p style={{fontSize:"0.75rem",color:"var(--muted)"}}>First image is the primary photo shown in listings. Drag to reorder.</p>
                  </div>
                </div>
              )}

              {/* STEP 3 — Review */}
              {step === 3 && (
                <div className="form-card">
                  <div className="form-card-header">
                    <span>✅</span>
                    <h3>Review & Publish</h3>
                  </div>
                  <div className="form-body">
                    {[
                      {label:"Title",     value:"Sony WH-1000XM5 Headphones"},
                      {label:"Category",  value:"Electronics"},
                      {label:"Condition", value:condition},
                      {label:"Price",     value:"₹24,999"},
                      {label:"Stock",     value:"1 unit"},
                      {label:"Negotiable",value:negotiable?"Yes":"No"},
                      {label:"Shipping",  value:"Free shipping"},
                    ].map(row => (
                      <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.7rem 0",borderBottom:"1px solid var(--border)"}}>
                        <span style={{fontSize:"0.78rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{row.label}</span>
                        <span style={{fontSize:"0.9rem",color:"var(--light)",fontWeight:500}}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="form-actions">
                {step > 0 && <button className="btn-ghost" onClick={() => setStep(p => p - 1)}>← Back</button>}
                {step < 3
                  ? <button className="btn-primary" onClick={() => setStep(p => p + 1)}>Continue →</button>
                  : <button className="btn-primary" onClick={() => setDone(true)}>🚀 Publish Listing</button>
                }
              </div>
            </div>

            {/* Preview panel */}
            <aside>
              <div className="preview-panel">
                <div className="preview-title">Live Preview</div>
                <div className="preview-card">
                  <div className="preview-img">📱</div>
                  <div className="preview-body">
                    <div className="preview-cat">Electronics</div>
                    <div className="preview-name">Sony WH-1000XM5 Headphones</div>
                    <div className="preview-price">₹24,999</div>
                    <div className="preview-cond">{condition} · Free shipping</div>
                  </div>
                </div>
                <div style={{marginTop:"1rem",padding:"0.8rem",background:"rgba(242,185,73,0.06)",border:"1px solid rgba(242,185,73,0.15)",borderRadius:"6px"}}>
                  <p style={{fontSize:"0.72rem",color:"var(--muted)",lineHeight:"1.6"}}>
                    Complete all 4 steps to publish. Listings go live instantly after review.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
