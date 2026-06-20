/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Review } from "../types";
import { Star, MessageSquareCode, Plus, CheckCircle, Quote, Sparkles } from "lucide-react";

interface TestimonialsListProps {
  reviews: Review[];
  onReviewAdded: (newReview: Review) => void;
}

export default function TestimonialsList({ reviews, onReviewAdded }: TestimonialsListProps) {
  // Input Form States
  const [name, setName] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [rating, setRating] = React.useState(5);
  
  // Status states
  const [submitting, setSubmitting] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // simple validation
    if (!name.trim()) return setError("Name is required.");
    if (!comment.trim()) return setError("Please input some supportive text commentary.");

    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comment })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        onReviewAdded(data.review);
        // Clear input states
        setName("");
        setComment("");
        setRating(5);
        
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormOpen(false);
        }, 3000);
      } else {
        setError(data.error || "Failed to catalog your review.");
      }
    } catch (err) {
      setError("Unable to submit reviews. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-20 bg-stone-950 border-b border-stone-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl text-left">
            <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] font-bold">
              CUSTOMER TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-stone-100 tracking-tight mt-3">
              Words From The Distinguished
            </h2>
            <div className="w-12 h-1 bg-amber-500 mt-4 rounded-full" />
            <p className="text-stone-400 mt-4 text-xs sm:text-sm leading-relaxed">
              Real reviews submitted. Read about the level of detail, hot towel therapy, and immaculate clipper fades enjoyed by our guests.
            </p>
          </div>

          <button
            onClick={() => setFormOpen(!formOpen)}
            id="write-review-toggle"
            className="px-5 py-3 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500 hover:text-stone-950 text-amber-300 font-semibold px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest font-mono transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {formOpen ? "Cancel Review" : "Write A Review"}
          </button>
        </div>

        {/* Floating Review submission tray */}
        {formOpen && (
          <div id="review-form-container" className="mb-12 max-w-lg mx-auto bg-stone-900 border border-amber-500/20 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-4 animate-slideDown">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider font-sans flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Share Your Experience
            </h3>

            {submitSuccess ? (
              <div id="review-success" className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>Thank you! Your testimonial has been posted.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 font-sans text-sm">
                {error && <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-300 text-xs rounded">{error}</div>}
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-mono">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Finch"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-md px-3 py-2.5 outline-none transition-all placeholder-stone-700"
                  />
                </div>

                {/* Rating selection (1-5 Stars) */}
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-mono">Rating (Stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-stone-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-stone-400 font-mono">Your Review</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the services and craft you received..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-md px-3 py-2.5 outline-none transition-all placeholder-stone-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-widest text-xs rounded-md transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 active:scale-[0.98]"
                >
                  Post Review Now
                </button>
              </form>
            )}
          </div>
        )}

        {/* Testimonials Masonry or Grid */}
        <div id="reviews-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-stone-900 p-6 rounded-xl border border-stone-850/80 shadow-xl flex flex-col justify-between items-start space-y-4 relative group hover:border-amber-500/10 transition-all duration-300"
            >
              {/* Quote Mark */}
              <Quote className="absolute right-6 top-6 w-8 h-8 text-amber-500/5 group-hover:text-amber-500/10 transition-colors" />

              <div className="space-y-3">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-800'}`} 
                    />
                  ))}
                </div>

                {/* Comment text */}
                <p className="text-stone-350 text-sm italic leading-relaxed font-sans font-light">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-stone-950/60 w-full flex items-center justify-between">
                <div>
                  <span className="block text-stone-200 font-bold font-sans text-xs uppercase tracking-wide">
                    {rev.name}
                  </span>
                  <span className="block text-stone-500 text-[10px] uppercase font-mono tracking-widest mt-0.5">
                    VERIFIED GUEST REVIEW
                  </span>
                </div>
                <span className="text-[10px] text-stone-600 font-mono font-medium">
                  {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12 bg-stone-900 rounded-xl border border-stone-850">
            <MessageSquareCode className="w-10 h-10 text-stone-700 mx-auto mb-3" />
            <p className="text-stone-400 font-mono text-sm">No reviews added yet. Be the first to write one!</p>
          </div>
        )}

      </div>
    </section>
  );
}
