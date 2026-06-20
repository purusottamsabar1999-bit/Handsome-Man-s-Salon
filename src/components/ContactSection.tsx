/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Phone, CalendarClock, MapPin, MessageCircleCode, Mail, Clock, ExternalLink } from "lucide-react";

export default function ContactSection() {
  const workingHours = [
    { day: "Monday", hours: "9:00 AM - 8:00 PM", status: "open" },
    { day: "Tuesday", hours: "9:00 AM - 8:00 PM", status: "open" },
    { day: "Wednesday", hours: "9:00 AM - 8:00 PM", status: "open" },
    { day: "Thursday", hours: "9:00 AM - 8:00 PM", status: "open" },
    { day: "Friday", hours: "9:00 AM - 8:00 PM", status: "open" },
    { day: "Saturday", hours: "9:00 AM - 8:00 PM", status: "open" },
    { day: "Sunday", hours: "10:00 AM - 6:00 PM", status: "open" }
  ];

  return (
    <section id="contact" className="py-20 bg-stone-950 border-b border-stone-900 font-sans relative scroll-mt-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] font-bold">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-stone-100 mt-3 tracking-tight">
            Location & Working Hours
          </h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="text-stone-400 mt-4 text-xs sm:text-sm">
            We are nestled conveniently in the center of the historic downtown district. Walk-ins are accepted depending on barber availability, online slot booking is highly recommended.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Details column (Address Contact Hours) */}
          <div className="col-span-1 lg:col-span-5 space-y-8 flex flex-col justify-between">
            
            <div className="bg-stone-900 border border-stone-850 p-6 sm:p-8 rounded-xl space-y-6">
              
              <h3 className="text-stone-100 font-bold uppercase tracking-widest text-sm font-mono border-b border-stone-800 pb-3">
                Salon Contact Details
              </h3>

              <div className="space-y-4">
                
                {/* Address */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-stone-950 text-amber-500 border border-stone-800 rounded-lg shrink-0">
                    <MapPin className="w-5 h-5 focus:outline-none" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-stone-500 font-mono font-semibold">Address Location</span>
                    <p className="text-stone-200 mt-0.5 text-sm leading-relaxed">
                      Near Apollo Pharmacy, Panchabati Nagar,<br />New Colony, Rayagada, Odisha 765001
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-stone-950 text-amber-500 border border-stone-800 rounded-lg shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-stone-500 font-mono font-semibold">Primary Contact Telephone</span>
                    <a href="tel:+919124013752" className="block text-amber-400 hover:underline mt-0.5 text-sm font-mono font-bold">
                      +91 91240 13752
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 bg-stone-950 text-amber-500 border border-stone-800 rounded-lg shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-stone-500 font-mono font-semibold">Service Enquiries</span>
                    <a href="mailto:handsomemensalon.ryg@gmail.com" className="text-stone-300 hover:text-amber-300 hover:underline mt-0.5 text-sm">
                      handsomemensalon.ryg@gmail.com
                    </a>
                  </div>
                </div>

              </div>

              {/* Direct call action CTA */}
              <div className="pt-2 border-t border-stone-800/85">
                <a 
                  href="tel:+919124013752"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-widest text-xs py-3 rounded-md text-center inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Call Salon Now
                </a>
              </div>

            </div>

            {/* Float quick chat banner */}
            <div className="p-6 bg-stone-900 border border-stone-850 rounded-xl space-y-4">
              <h3 className="text-stone-100 font-bold uppercase tracking-widest text-sm font-mono flex items-center gap-2">
                <MessageCircleCode className="w-5 h-5 text-emerald-400" /> WhatsApp Instant Consult
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Need color guidance or a custom booking setup? Send a direct WhatsApp line chat, and we will reply within 10 minutes.
              </p>
              <a 
                href="https://wa.me/919124013752?text=Hello%20Handsome%20Men's%20Salon!%20I'd%20like%20to%2520inquire%20about%20booking%20a%20grooming%20session."
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-stone-950 text-emerald-400 font-bold uppercase tracking-widest text-xs py-3 rounded-md text-center inline-flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircleCode className="w-4 h-4" /> Message on WhatsApp
              </a>
            </div>

          </div>

          {/* Working Hours & Interactive Map mock */}
          <div className="col-span-1 lg:col-span-7 space-y-8 flex flex-col justify-between">
            
            {/* Hours Board */}
            <div className="bg-stone-900 border border-stone-850 p-6 sm:p-8 rounded-xl space-y-4">
              <h3 className="text-stone-100 font-bold uppercase tracking-widest text-sm font-mono flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> Operational Working Hours
              </h3>
              
              <div className="space-y-3 font-sans text-sm">
                {workingHours.map((wh, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-stone-950/60 pb-2 last:border-0 last:pb-0">
                    <span className="text-stone-300 font-bold tracking-wide">{wh.day}</span>
                    <span className="text-amber-300 font-mono text-xs">{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Realistic stylized high-contrast dark Google Maps Embed placeholder */}
            <div className="bg-stone-900 border border-stone-850 rounded-xl overflow-hidden h-72 relative">
              <iframe 
                src="https://maps.google.com/maps?q=19.1691732,83.4158401&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                className="w-full h-full border-0 brightness-75 invert-90 hue-rotate-180 contrast-125"
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer"
                title="Salon Location map view"
              />
              <div className="absolute top-4 left-4 bg-stone-950/90 text-amber-300 border border-stone-800 text-[10px] uppercase font-mono px-3 py-1.5 rounded flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Panchabati Nagar, Rayagada</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Sticky site-wide WhatsApp Button as requested */}
      <a 
        href="https://wa.me/919124013752?text=Hello%20Handsome%20Men's%20Salon!%20I'd%20like%20to%2520inquire%20about%20booking%2520an%20appointment." 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Contact Handsome Men's Salon on WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-stone-950 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:rotate-6 flex items-center justify-center animate-bounce border border-emerald-400/20"
      >
        <MessageCircleCode className="w-6 h-6 font-bold" />
      </a>

    </section>
  );
}
