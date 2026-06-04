import { useState } from "react";
import { apiFetch } from "../utils/api";
import { useForm, Controller } from "react-hook-form";
import {
  BadgeDollarSign,
  Camera,
  FileText,
  Film,
  FolderUp,
  Gauge,
  Headphones,
  Image,
  Lamp,
  PartyPopper,
  Rocket,
  ShoppingBag,
  Smartphone,
  Sparkles,
  ThumbsUp,
  UploadCloud,
  Wrench,
} from "lucide-react";
import "../styles/globals.css";
import "../styles/pageStyles.css";
import { createListing } from "../api/sell";

const CATEGORIES = ["Electronics", "Fashion", "Home & Living", "Books", "Sports", "Collectibles", "Automotive", "Music", "Art", "Other"];
const CONDITIONS = [
  { label: "New", icon: Sparkles, desc: "Never used" },
  { label: "Like New", icon: BadgeDollarSign, desc: "Barely used" },
  { label: "Good", icon: ThumbsUp, desc: "Minor wear" },
  { label: "Fair", icon: Wrench, desc: "Visible wear" },
  { label: "Just Working", icon: Gauge, desc: "working" },
];



// Step-specific validation rules
const STEP_FIELDS = {
  0: ["title", "category", "description", "condition"],
  1: ["askingPrice", "stockQuantity", "shipping"],
  2: ["images"],
  3: [],
};

export default function SellPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    trigger,
    watch,
    setValue,
    getValues,
  } = useForm({
    mode: "onBlur",
    shouldUnregister: false,
    defaultValues: {
      // Details step
      title: "",
      category: "",
      brand: "",
      description: "",
      condition: "Like New",
      tags: ["vintage", "rare"],
      // Pricing step
      askingPrice: "",
      originalPrice: "",
      stockQuantity: 1,
      yearOfPurchase: "",
      negotiable: false,
      shipping: "Free shipping",
      // Photos step
      images: [0, 1],
    },
  });

  const watchValues = watch();
  const tags = watchValues.tags;
  const images = watchValues.images;
  const condition = watchValues.condition;
  const negotiable = watchValues.negotiable;
  const title = watchValues.title;
  const category = watchValues.category;
  const askingPrice = watchValues.askingPrice;
  const stockQuantity = watchValues.stockQuantity;

  const STEPS = ["Details", "Pricing", "Photos", "Review"];

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const currentTags = getValues("tags");
      setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = getValues("tags");
    setValue("tags", currentTags.filter((t) => t !== tagToRemove));
  };

  const removeImage = (indexToRemove) => {
    const currentImages = getValues("images");
    setValue("images", currentImages.filter((_, i) => i !== indexToRemove));
  };

  const handleNextStep = async () => {
    const isValid = await trigger(STEP_FIELDS[step]);
    if (isValid) {
      setStep((p) => p + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((p) => p - 1);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitError("");

      const payload = {
        ...data, askingPrice: Number(data.askingPrice),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        stockQuantity: Number(data.stockQuantity),
        yearOfPurchase: data.yearOfPurchase ? Number(data.yearOfPurchase) : null,
        negotiable: Boolean(data.negotiable),
        tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
        images: Array.isArray(data.images) ? data.images : [],
      };
      await createListing(payload);
      setDone(true);
    } catch (error) {
      console.error("Failed to publish listing:", error);
      setSubmitError(error.message || "An error occurred while publishing your listing.");
    }
  }


  if (done) {
    return (
      <>
        <div className="sell-page">
          <div className="sell-inner">
            <div className="success-state">
              <div className="success-icon">
                <PartyPopper size={34} strokeWidth={1.8} />
              </div>
              <h2 className="success-title">Listing Live!</h2>
              <p className="success-sub">
                Your item is now live on BAZAAR. You'll be notified when someone shows interest.
              </p>
              <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setDone(false);
                    setStep(0);
                  }}
                >
                  List Another
                </button>
                <button className="btn-ghost">View Listing →</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sell-page">
        <div className="sell-inner">
          {/* Header */}
          <div className="sell-header">
            <div className="sell-eyebrow">New Listing</div>
            <h1 className="sell-title">
              Sell <span>Your Item</span>
            </h1>
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

          {/* Form Layout */}
          <div className="sell-layout">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                {/* STEP 0 — Details */}
                {step === 0 && (
                  <>
                    <div className="form-card">
                      <div className="form-card-header">
                        <FileText size={18} strokeWidth={2} />
                        <h3>Basic Details</h3>
                      </div>
                      <div className="form-body">
                        <div className="field">
                          <label>
                            Title <span className="req">*</span>
                          </label>
                          <input
                            className="f-input"
                            placeholder="e.g. Sony WH-1000XM5 Headphones (Black)"
                            {...register("title", { required: "Title is required" })}
                          />
                          {errors.title && <p style={{ color: "red", fontSize: "0.75rem" }}>{errors.title.message}</p>}
                        </div>

                        <div className="field-row col2">
                          <div className="field">
                            <label>
                              Category <span className="req">*</span>
                            </label>
                            <select
                              className="f-select"
                              {...register("category", { required: "Category is required" })}
                            >
                              <option value="">Select category</option>
                              {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                            {errors.category && (
                              <p style={{ color: "red", fontSize: "0.75rem" }}>{errors.category.message}</p>
                            )}
                          </div>
                          <div className="field">
                            <label>Brand</label>
                            <input
                              className="f-input"
                              placeholder="e.g. Sony, Nike, IKEA"
                              {...register("brand")}
                            />
                          </div>
                        </div>

                        <div className="field">
                          <label>
                            Description <span className="req">*</span>
                          </label>
                          <textarea
                            className="f-textarea"
                            placeholder="Describe your item honestly — condition, features, reason for selling, included accessories..."
                            {...register("description", { required: "Description is required" })}
                          />
                          {errors.description && (
                            <p style={{ color: "red", fontSize: "0.75rem" }}>{errors.description.message}</p>
                          )}
                        </div>

                        <div className="field">
                          <label>
                            Condition <span className="req">*</span>
                          </label>
                          <div className="condition-grid">
                            {CONDITIONS.map((c) => (
                              <div
                                key={c.label}
                                className={`cond-option ${condition === c.label ? "selected" : ""}`}
                                onClick={() => setValue("condition", c.label)}
                              >
                                <div className="cond-emoji">
                                  <c.icon size={20} strokeWidth={2} />
                                </div>
                                <div className="cond-label">{c.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="field">
                          <label>Tags</label>
                          <div className="tags-wrap">
                            {tags.map((t) => (
                              <div className="tag-chip" key={t}>
                                {t}
                                <span className="tag-x" onClick={() => removeTag(t)}>
                                  ✕
                                </span>
                              </div>
                            ))}
                            <input
                              className="tag-input-inline"
                              placeholder="Add tag + Enter"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
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
                      <BadgeDollarSign size={18} strokeWidth={2} />
                      <h3>Pricing</h3>
                    </div>
                    <div className="form-body">
                      <div className="field-row col2">
                        <div className="field">
                          <label>
                            Asking Price <span className="req">*</span>
                          </label>
                          <div className="price-wrap">
                            <span className="price-prefix">₹</span>
                            <input
                              className="f-input"
                              type="number"
                              placeholder="0"
                              {...register("askingPrice", {
                                required: "Asking price is required",
                                min: { value: 1, message: "Price must be at least 1" },
                              })}
                            />
                          </div>
                          {errors.askingPrice && (
                            <p style={{ color: "red", fontSize: "0.75rem" }}>{errors.askingPrice.message}</p>
                          )}
                        </div>
                        <div className="field">
                          <label>Original Price</label>
                          <div className="price-wrap">
                            <span className="price-prefix">₹</span>
                            <input
                              className="f-input"
                              type="number"
                              placeholder="0"
                              {...register("originalPrice")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="field-row col2">
                        <div className="field">
                          <label>
                            Stock Quantity <span className="req">*</span>
                          </label>
                          <input
                            className="f-input"
                            type="number"
                            {...register("stockQuantity", {
                              required: "Quantity is required",
                              min: { value: 1, message: "Quantity must be at least 1" },
                            })}
                          />
                          {errors.stockQuantity && (
                            <p style={{ color: "red", fontSize: "0.75rem" }}>{errors.stockQuantity.message}</p>
                          )}
                        </div>
                        <div className="field">
                          <label>Year of Purchase</label>
                          <input className="f-input" type="number" placeholder="e.g. 2022" {...register("yearOfPurchase")} />
                        </div>
                      </div>

                      <div className="toggle-row">
                        <div className="toggle-info">
                          <h4>Open to Negotiation</h4>
                          <p>Allow buyers to send you offers below your listed price</p>
                        </div>
                        <div
                          className={`toggle ${negotiable ? "on" : ""}`}
                          onClick={() => setValue("negotiable", !negotiable)}
                        >
                          <div className="toggle-thumb" />
                        </div>
                      </div>

                      <div className="field">
                        <label>Shipping</label>
                        <select className="f-select" {...register("shipping")}>
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
                      <Camera size={18} strokeWidth={2} />
                      <h3>Photos</h3>
                    </div>
                    <div className="form-body">
                      <div className="upload-zone">
                        <div className="upload-icon">
                          <FolderUp size={28} strokeWidth={1.8} />
                        </div>
                        <div className="upload-text">
                          <strong>Click to upload</strong> or drag & drop
                        </div>
                        <div className="upload-sub">PNG, JPG, WEBP up to 8MB — max 8 images</div>
                      </div>
                      <div className="image-previews">
                        {images.map((img, i) => (
                          <div className={`preview-thumb ${i === 0 ? "primary" : ""}`} key={i}>
                            {(() => {
                              const ThumbIcon = MOCK_IMAGES[i % MOCK_IMAGES.length];
                              return <ThumbIcon size={26} strokeWidth={1.8} />;
                            })()}
                            <button type="button" className="thumb-remove" onClick={() => removeImage(i)}>
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                        First image is the primary photo shown in listings. Drag to reorder.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 3 — Review */}
                {step === 3 && (
                  <div className="form-card">
                    <div className="form-card-header">
                      <UploadCloud size={18} strokeWidth={2} />
                      <h3>Review & Publish</h3>
                    </div>
                    <div className="form-body">
                      {[
                        { label: "Title", value: title },
                        ...(watchValues.brand ? [{ label: "Brand", value: watchValues.brand }] : []),
                        { label: "Category", value: category },
                        { label: "Condition", value: condition },
                        { label: "Price", value: `₹${askingPrice}` },
                        { label: "Stock", value: `${stockQuantity} unit${stockQuantity !== 1 ? "s" : ""}` },
                        { label: "Negotiable", value: negotiable ? "Yes" : "No" },
                        { label: "Shipping", value: watchValues.shipping },
                        ...(tags && tags.length > 0 ? [{ label: "Tags", value: tags.join(", ") }] : []),
                      ].map((row) => (
                        <div
                          key={row.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.7rem 0",
                            borderBottom: "1px solid var(--border)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--muted)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {row.label}
                          </span>
                          <span style={{ fontSize: "0.9rem", color: "var(--light)", fontWeight: 500 }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {submitError && (
                  <p style={{ color: "red", fontSize: "0.8rem", marginBottom: "0.75rem" }}>{submitError}</p>
                )}
                <div className="form-actions">
                  {step > 0 && (
                    <button type="button" className="btn-ghost" onClick={handlePrevStep}>
                      ← Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button type="button" className="btn-primary" onClick={handleNextStep}>
                      Continue →
                    </button>
                  ) : (
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                      <Rocket
                        size={16}
                        strokeWidth={2}
                        style={{ display: "inline", verticalAlign: "-3px", marginRight: "0.35rem" }}
                      />
                      {isSubmitting ? "Publishing..." : "Publish Listing"}
                    </button>
                  )}
                </div>
              </div>

              {/* Preview panel */}
              <aside>
                <div className="preview-panel">
                  <div className="preview-title">Live Preview</div>
                  <div className="preview-card">
                    <div className="preview-img">
                      <Smartphone size={44} strokeWidth={1.8} />
                    </div>
                    <div className="preview-body">
                      <div className="preview-cat">{category || "Select Category"}</div>
                      {watchValues.brand && <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.25rem" }}>{watchValues.brand}</div>}
                      <div className="preview-name">{title || "Your item title"}</div>
                      <div className="preview-price">₹{askingPrice || "0"}</div>
                      <div className="preview-cond">{condition} · {watchValues.shipping}</div>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "0.8rem",
                      background: "rgba(242,185,73,0.06)",
                      border: "1px solid rgba(242,185,73,0.15)",
                      borderRadius: "6px",
                    }}
                  >
                    <p style={{ fontSize: "0.72rem", color: "var(--muted)", lineHeight: "1.6" }}>
                      Complete all 4 steps to publish. Listings go live instantly after review.
                    </p>
                  </div>
                </div>
              </aside>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
