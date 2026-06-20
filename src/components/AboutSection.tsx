/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, Flame, Pocket, Sparkles } from "lucide-react";
import aboutImage from "../assets/images/regenerated_image_1781942607806.png";

export default function AboutSection() {
  const brandPillars = [
    {
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      title: "Mastery of Tool & Blade",
      desc: "Our barbers are meticulous draftsmen of hair direction, hair volume weights, and custom contours."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
      title: "Pristine Luxury Protocol",
      desc: "Autoclave surgical sterilization for solid straight razors, fresh single-use blades, and ultra-hygienic premium stations."
    },
    {
      icon: <Pocket className="w-5 h-5 text-amber-500" />,
      title: "Bespoke Grooming Products",
      desc: "Crafted styling creams, pure essential leaf oils, and botanical clay masks sourced directly from global vintage apothecary providers."
    }
  ];

  return (
    <section id="about-section" className="py-20 bg-stone-900 border-b border-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Narrative Column */}
          <div className="col-span-1 lg:col-span-7 space-y-6 text-left">
            <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] font-bold block">
              LEGACY & PHILOSOPHY
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-stone-100 tracking-tight leading-tight">
              A Noble Return To Genuine Men's Grooming Rituals
            </h2>
            
            <div className="w-12 h-1 bg-amber-500 rounded-full" />

            <p className="text-stone-350 text-sm sm:text-base leading-relaxed font-sans font-light">
              Located in the heart of Panchabati Nagar, **Handsome Men's Salon** was established to reclaim the luxury of traditional men's grooming and barbering in Rayagada. We reject the modern rush of assembly-line trims. Here, grooming is treated as a meticulous art form, not a chore.
            </p>

            <blockquote className="border-l-2 border-amber-500 pl-4 py-1 italic text-stone-300 font-sans text-sm tracking-wide">
              "We style physical confidence. Every line, taper, and hot towel compressed massage is engineered to reveal the absolute best version of the modern gentleman."
            </blockquote>

            {/* Brand pillars checklist */}
            <div className="space-y-4 pt-4">
              {brandPillars.map((p, idx) => (
                <div key={idx} className="flex gap-3.5 items-start">
                  <div className="p-1.5 bg-stone-950 border border-stone-850 rounded text-amber-400 shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="text-stone-200 font-bold font-sans text-sm uppercase tracking-wide">
                      {p.title}
                    </h4>
                    <p className="text-stone-400 text-xs mt-0.5 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Graphical/Creative Column */}
          <div className="col-span-1 lg:col-span-5 relative flex justify-center">
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full" />

            <div className="relative border border-stone-800 bg-stone-950 p-4 rounded-2xl shadow-2xl max-w-sm">
              <img 
                src={aboutImage} 
                alt="Vintage barber tools at Handsome Men's Salon" 
                className="rounded-xl w-full h-[380px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-stone-900/95 border border-stone-800 p-4 rounded-lg backdrop-blur text-center space-y-1">
                <span className="text-amber-400 font-mono text-[10px] uppercase font-bold tracking-widest leading-none">THE FOUNDATION</span>
                <p className="text-xs text-stone-300 font-sans">Crafted for the selective gentleman who understands the subtle statements of clean grooming.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
