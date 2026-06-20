/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Barber } from "../types";
import { Sparkles, Calendar, Award } from "lucide-react";

interface BarbersListProps {
  barbers: Barber[];
  onSelectBarber: (barberId: string) => void;
}

export default function BarbersList({ barbers, onSelectBarber }: BarbersListProps) {
  return (
    <section id="barbers-section" className="py-20 bg-stone-950 border-b border-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] font-bold">
            ARTISANS OF REFINEMENT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-stone-100 mt-3 tracking-tight">
            Meet Our Master Barbers
          </h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="text-stone-400 mt-4 text-xs sm:text-sm">
            Our scissors are extensions of our sartorial code. Each team member has a minimum of 7 years top-tier barbering experience.
          </p>
        </div>

        {/* Barbers Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.map((barber) => (
            <div 
              key={barber.id}
              className="bg-stone-900 border border-stone-850 hover:border-amber-500/20 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Photo space */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-stone-950">
                  <img 
                    src={barber.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
                    alt={barber.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
                  
                  {/* Years badge dynamically placed */}
                  <span className="absolute top-4 left-4 bg-amber-500 text-stone-950 font-mono font-bold text-[10px] tracking-widest px-2.5 py-1 uppercase rounded">
                    MASTER CRAFT
                  </span>
                </div>

                {/* Info Text */}
                <div className="p-6 space-y-3">
                  <h3 className="text-white text-xl font-bold tracking-wide font-sans group-hover:text-amber-400 transition-colors">
                    {barber.name}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-amber-500/80 font-mono text-xs">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Specialty: {barber.specialty}</span>
                  </div>

                  <p className="text-stone-400 text-xs leading-relaxed">
                    Dedicated to providing modern custom styles and classic treatments. Refined scissor craftsmanship with complete attention to scalp hydration and geometry.
                  </p>
                </div>
              </div>

              {/* Book with this Barber action */}
              <div className="p-6 pt-0">
                <button
                  id={`select-barber-btn-${barber.id}`}
                  onClick={() => onSelectBarber(barber.id)}
                  className="w-full border border-stone-800 bg-stone-950 group-hover:border-amber-500/30 group-hover:bg-amber-500 group-hover:text-stone-950 text-amber-300 transition-all font-mono text-[11px] font-bold tracking-widest uppercase py-3 rounded-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book with {barber.name.split(" ")[0]}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
