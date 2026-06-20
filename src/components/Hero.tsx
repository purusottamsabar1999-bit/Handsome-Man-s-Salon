/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Clock, Phone, MapPin, Award, Star, ShieldCheck, Sparkles } from "lucide-react";

interface HeroProps {
  onBookNow: () => void;
  onExploreServices: () => void;
}

export default function Hero({ onBookNow, onExploreServices }: HeroProps) {
  // Simple opening hours logic
  const date = new Date();
  const currentHour = date.getHours();
  const currentDay = date.getDay(); // 0 is Sunday, 6 is Saturday

  let isOpen = false;
  let statusText = "Opens today at 9:00 AM";

  if (currentDay === 0) { // Sunday
    if (currentHour >= 10 && currentHour < 18) {
      isOpen = true;
      statusText = "Open now until 6:00 PM";
    } else {
      statusText = "Opens Sunday at 10:00 AM";
    }
  } else { // Monday - Saturday
    if (currentHour >= 9 && currentHour < 20) {
      isOpen = true;
      statusText = "Open now until 8:00 PM";
    } else {
      statusText = "Closed • Opens at 9:00 AM";
    }
  }

  const highlightCards = [
    {
      icon: <Award className="w-6 h-6 text-amber-500" />,
      title: "15+ Years Craft",
      desc: "Delivering immaculate grooming precision since 2011."
    },
    {
      icon: <Star className="w-6 h-6 text-amber-500" />,
      title: "Master Barbers",
      desc: "Sartorial experts specializing in skin fades & hair aesthetics."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: "Premium Materials",
      desc: "Using botanical organic tonics, straight shave steel, & bespoke pomades."
    }
  ];

  return (
    <section id="hero-section" className="relative bg-stone-950 text-white overflow-hidden border-b border-stone-900">
      {/* Background with dramatic gold overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1920&h=1080')`,
        }}
      />
      
      {/* Visual Radial Mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/90 to-stone-950" />

      {/* Decorative Gold Laser Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 sm:pt-28 sm:pb-28 lg:pt-36 lg:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="col-span-1 lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Headline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs tracking-wider text-amber-300 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              SARTORIAL MEN'S GROOMING
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-extrabold tracking-tight font-sans leading-tight text-white">
              Classic Barber Craft.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                Contemporary Class.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto lg:mx-0 text-stone-350 text-lg leading-relaxed font-sans font-light">
              We don't do quick trims. We provide tailored hair designs, traditional hot towel straight-shaves, and complete scalp revitalization. Discover the difference of professional artisan mastery.
            </p>

            {/* Quick action triggers */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-book-btn"
                onClick={onBookNow}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-md shadow-lg shadow-amber-500/10 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Schedule Appointment
              </button>
              <button
                id="hero-explore-btn"
                onClick={onExploreServices}
                className="w-full sm:w-auto border border-stone-800 bg-stone-900/30 hover:bg-stone-900 text-amber-300 hover:text-white hover:border-amber-500/30 font-medium uppercase tracking-widest text-xs px-8 py-4 rounded-md transition-all duration-300"
              >
                Services Menu
              </button>
            </div>

            {/* Live Ticker bar */}
            <div className="pt-4 flex flex-wrap justify-center lg:justify-start items-center gap-6 text-stone-400 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-stone-300">Mon - Sat: 9 AM - 8 PM | Sun: 10 AM - 6 PM</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span id="shop-hours-status" className={isOpen ? "text-emerald-400" : "text-amber-500"}>
                  {statusText}
                </span>
              </div>
            </div>

          </div>

          {/* Large Stylized Front Card/Visual */}
          <div className="col-span-1 lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 to-transparent blur-3xl opacity-60" />
            
            <div className="relative border border-stone-800 bg-stone-900/40 p-5 rounded-2xl max-w-sm sm:max-w-md backdrop-blur-md">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-amber-500 text-stone-950 font-bold font-mono text-[10px] rounded uppercase tracking-widest">
                Top Rated '26
              </div>
              
              <img 
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=500&h=600" 
                alt="Perfect Edge Cut inside Handsome Salon" 
                className="rounded-xl w-full h-[320px] object-cover border border-stone-800 shadow-2xl shadow-stone-950"
                referrerPolicy="no-referrer"
              />

              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="block text-xs text-stone-400 font-mono">LOCATION</span>
                  <span className="text-sm font-medium text-amber-100 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> Panchabati Nagar, Rayagada
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-stone-400 font-mono font-medium">CALL US</span>
                  <a href="tel:+919124013752" className="text-xs text-amber-400 hover:underline font-mono font-bold leading-none">
                    +91 91240 13752
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Feature grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlightCards.map((card, i) => (
            <div 
              key={i} 
              className="bg-stone-900/50 hover:bg-stone-900/80 transition-all duration-300 p-6 rounded-xl border border-stone-900/80 hover:border-amber-500/20 group"
            >
              <div className="mb-4 p-3 bg-stone-950 rounded-lg w-fit border border-stone-800 group-hover:border-amber-500/20 transition-all">
                {card.icon}
              </div>
              <h3 className="text-white text-lg font-bold tracking-wide font-sans mb-1.5">
                {card.title}
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
