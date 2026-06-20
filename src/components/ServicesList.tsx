/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Service } from "../types";
import { Clock, Search, Sparkles, SlidersHorizontal } from "lucide-react";

interface ServicesListProps {
  services: Service[];
  onSelectService: (serviceId: string) => void;
}

export default function ServicesList({ services, onSelectService }: ServicesListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState<"all" | "hair" | "beard" | "spa">("all");

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterCategory === "all") return matchesSearch;
    if (filterCategory === "hair") {
      return matchesSearch && (service.name.toLowerCase().includes("hair") || service.name.toLowerCase().includes("groom"));
    }
    if (filterCategory === "beard") {
      return matchesSearch && (service.name.toLowerCase().includes("beard") || service.name.toLowerCase().includes("shave"));
    }
    if (filterCategory === "spa") {
      return matchesSearch && (service.name.toLowerCase().includes("facial") || service.name.toLowerCase().includes("massage") || service.name.toLowerCase().includes("spa"));
    }
    return matchesSearch;
  });

  return (
    <section id="services-section" className="py-20 bg-stone-900 border-b border-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] font-bold">
            OUR COMPREHENSIVE MENU
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-stone-100 tracking-tight mt-3">
            Elite Barbering & Grooming Services
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="text-stone-400 mt-5 text-sm sm:text-base">
            Every session begins with a short style formulation consultation, hot lather razor neck-cleanup, and premium aromatic cologne misting.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between bg-stone-950 p-6 rounded-xl border border-stone-800">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md transition-all ${
                filterCategory === "all"
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "bg-stone-900 text-stone-400 hover:text-white"
              }`}
            >
              All Services ({services.length})
            </button>
            <button
              onClick={() => setFilterCategory("hair")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md transition-all ${
                filterCategory === "hair"
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "bg-stone-900 text-stone-400 hover:text-white"
              }`}
            >
              Hair Styling
            </button>
            <button
              onClick={() => setFilterCategory("beard")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md transition-all ${
                filterCategory === "beard"
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "bg-stone-900 text-stone-400 hover:text-white"
              }`}
            >
              Beard & Shave
            </button>
            <button
              onClick={() => setFilterCategory("spa")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md transition-all ${
                filterCategory === "spa"
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "bg-stone-900 text-stone-400 hover:text-white"
              }`}
            >
              Therapies & Facial
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 text-white rounded-md pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder-stone-500"
            />
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
          </div>

        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => {
              // Select beautiful representative image key based on index or title keywords
              let imageUrl = "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600";
              if (service.name.toLowerCase().includes("haircut")) {
                imageUrl = "https://images.unsplash.com/photo-1549444528-91a092822a3b?auto=format&fit=crop&q=80&w=600";
              } else if (service.name.toLowerCase().includes("beard") || service.name.toLowerCase().includes("shave")) {
                imageUrl = "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600";
              } else if (service.name.toLowerCase().includes("facial")) {
                imageUrl = "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600";
              } else if (service.name.toLowerCase().includes("massage") || service.name.toLowerCase().includes("spa")) {
                imageUrl = "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600";
              } else if (service.name.toLowerCase().includes("royal")) {
                imageUrl = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600";
              }

              return (
                <div 
                  key={service.id} 
                  id={`service-card-${service.id}`}
                  className="bg-stone-950/80 border border-stone-850 hover:border-amber-500/20 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-amber-500/5 group flex flex-col justify-between"
                >
                  <div>
                    {/* Card Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-stone-900 border-b border-stone-900">
                      <img 
                        src={imageUrl} 
                        alt={service.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                      
                      {/* Price Badge */}
                      <span className="absolute bottom-3 right-4 bg-stone-950/90 text-amber-400 font-mono text-base font-bold px-3 py-1.5 border border-amber-500/20 rounded-md">
                        ₹{service.price}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-stone-100 font-bold uppercase text-base tracking-wide group-hover:text-amber-400 transition-colors">
                        {service.name}
                      </h3>
                      
                      {/* Duration Indicator */}
                      <div className="flex items-center gap-1.5 text-stone-400 text-xs font-mono font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Duration: {service.duration} mins</span>
                      </div>

                      <p className="text-stone-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Booking CTA inside Card Footer */}
                  <div className="p-6 pt-0 border-t border-stone-900/40">
                    <button
                      id={`book-btn-${service.id}`}
                      onClick={() => onSelectService(service.id)}
                      className="w-full mt-4 flex items-center justify-center gap-2 border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500 hover:text-stone-950 transition-all py-2.5 text-xs font-bold tracking-widest text-amber-300 uppercase rounded-md"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Select & Book Slot
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-stone-950 rounded-xl border border-stone-850">
            <SlidersHorizontal className="w-10 h-10 text-stone-700 mx-auto mb-3" />
            <p className="text-stone-400 font-mono text-sm leading-relaxed">
              No grooming services matched your search filter parameters.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setFilterCategory("all"); }}
              className="mt-4 px-4 py-2 border border-amber-500/25 text-amber-300 hover:bg-amber-500 hover:text-stone-950 text-xs uppercase tracking-widest font-semibold transition-all rounded-md"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
