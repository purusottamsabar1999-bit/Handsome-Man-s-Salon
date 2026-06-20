/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Camera, X, ZoomIn, Eye } from "lucide-react";

export default function GallerySection() {
  const [activeTab, setActiveTab] = React.useState<"all" | "cuts" | "interior" | "before-after">("all");
  const [selectedPhoto, setSelectedPhoto] = React.useState<{ url: string; title: string; category: string } | null>(null);

  const photos = [
    {
      url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600",
      title: "Master Shear Work",
      category: "cuts"
    },
    {
      url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600",
      title: "Signature Hot Shave",
      category: "cuts"
    },
    {
      url: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600",
      title: "Facial Hot Steam & Clay",
      category: "before-after"
    },
    {
      url: "https://images.unsplash.com/photo-1598252571524-ac6727fc9602?auto=format&fit=crop&q=80&w=600",
      title: "Classic Mahogany Chairs",
      category: "interior"
    },
    {
      url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=600",
      title: "Leather & Copper Mirrors",
      category: "interior"
    },
    {
      url: "https://images.unsplash.com/photo-1605497746444-ac9dbd324486?auto=format&fit=crop&q=80&w=600",
      title: "Modern Razor Taper",
      category: "before-after"
    }
  ];

  const filteredPhotos = activeTab === "all" ? photos : photos.filter(p => p.category === activeTab);

  return (
    <section id="gallery-section" className="py-20 bg-stone-900 border-b border-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] font-bold">
            ARTISANAL PORTFOLIO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-stone-100 mt-3 tracking-tight">
            The Gallery Of Distinction
          </h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="text-stone-400 mt-4 text-xs sm:text-sm">
            Explore snapshots of our vintage leather salon interior, customized grooming suites, and immaculately executed styles.
          </p>
        </div>

        {/* Gallery Navigation */}
        <div className="flex justify-center gap-2.5 mb-10 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-xs uppercase font-mono tracking-wider transition-all rounded ${
              activeTab === "all" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-950 text-stone-400 hover:text-white"
            }`}
          >
            Show All
          </button>
          <button
            onClick={() => setActiveTab("cuts")}
            className={`px-4 py-2 text-xs uppercase font-mono tracking-wider transition-all rounded ${
              activeTab === "cuts" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-950 text-stone-400 hover:text-white"
            }`}
          >
            Artisan Cuts
          </button>
          <button
            onClick={() => setActiveTab("interior")}
            className={`px-4 py-2 text-xs uppercase font-mono tracking-wider transition-all rounded ${
              activeTab === "interior" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-950 text-stone-400 hover:text-white"
            }`}
          >
            Salon Interior
          </button>
          <button
            onClick={() => setActiveTab("before-after")}
            className={`px-4 py-2 text-xs uppercase font-mono tracking-wider transition-all rounded ${
              activeTab === "before-after" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-950 text-stone-400 hover:text-white"
            }`}
          >
            Styling Techniques
          </button>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <div 
              key={idx}
              id={`gallery-item-${idx}`}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square overflow-hidden bg-stone-950 border border-stone-850 hover:border-amber-500/20 group cursor-pointer rounded-xl"
            >
              <img 
                src={photo.url} 
                alt={photo.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Dynamic Overlay Mask */}
              <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center space-y-2">
                <div className="p-2.5 bg-amber-500 rounded-full text-stone-950 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <Eye className="w-5 h-5 font-bold" />
                </div>
                <h4 className="text-white font-bold tracking-wider font-sans uppercase text-sm transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                  {photo.title}
                </h4>
                <p className="text-amber-400 font-mono text-[10px] uppercase tracking-widest leading-none">
                  {photo.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div 
            id="gallery-lightbox"
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-stone-950/95 z-55 flex items-center justify-center p-4 animate-fadeIn"
          >
            {/* Close trigger */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 p-2 bg-stone-900 border border-stone-800 text-white rounded-full hover:bg-stone-800 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <div 
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title}
                className="w-full max-h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-6 bg-stone-905 border-t border-stone-850 text-center space-y-1">
                <span className="text-amber-500 font-mono text-[10px] uppercase tracking-widest font-semibold">{selectedPhoto.category}</span>
                <h3 className="text-white font-bold font-sans text-lg tracking-wide uppercase">{selectedPhoto.title}</h3>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
