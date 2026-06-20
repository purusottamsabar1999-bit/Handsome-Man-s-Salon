/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesList from "./components/ServicesList";
import BookingForm from "./components/BookingForm";
import BarbersList from "./components/BarbersList";
import GallerySection from "./components/GallerySection";
import TestimonialsList from "./components/TestimonialsList";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import AdminPanel from "./components/AdminPanel";
import { Service, Barber, Review } from "./types";
import { Sparkles, Star, Shield, HelpCircle, Scissors, FileCode, CheckCircle } from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = React.useState<'home' | 'services' | 'booking' | 'barbers' | 'gallery' | 'about' | 'contact' | 'admin'>('home');
  
  // Public Dynamic Data states
  const [services, setServices] = React.useState<Service[]>([]);
  const [barbers, setBarbers] = React.useState<Barber[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Prefilled states for Booking Form triggers
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | undefined>(undefined);

  const fetchPublicData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/public-data");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        setBarbers(data.barbers || []);
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error("Error accessing public-data endpoint:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  // Handler for service choice triggers
  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveView('booking');
    setTimeout(() => {
      const el = document.getElementById("booking-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Handler for barber selection triggers
  const handleSelectBarber = (barberId: string) => {
    // Scroll straight to booking form
    setActiveView('booking');
    setTimeout(() => {
      const el = document.getElementById("booking-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Local addition of submitted review to keep frontend updated instantly
  const handleReviewAdded = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950 font-sans">
      
      {/* Sticky Header Nav */}
      <Navbar activeView={activeView} onNavigate={(view) => setActiveView(view)} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {loading ? (
          /* High-Fidelity luxury loader screen */
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-stone-950 space-y-4">
            <div className="p-4 bg-amber-500/5 rounded-full border border-amber-500/10 animate-pulse">
              <Scissors className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-xs font-mono text-amber-500 uppercase tracking-widest leading-none font-bold">HANDSOME Man's Salon</p>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest block mt-2">Loading styling sheets & materials...</span>
            </div>
          </div>
        ) : (
          /* Views router */
          <div className="animate-fadeIn">
            
            {activeView === 'home' && (
              <>
                <Hero 
                  onBookNow={() => {
                    setActiveView('booking');
                    setSelectedServiceId(undefined);
                  }}
                  onExploreServices={() => setActiveView('services')}
                />
                
                {/* Featured previews on Home */}
                <div className="bg-stone-900/40 border-b border-stone-900 py-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                    <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] font-medium block">FEATURED SERVICES</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">Impeccable Scissors & Spa Treatment</h3>
                    <div className="w-10 h-[2px] bg-amber-500 mx-auto" />
                    <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                      Explore precision styling, beard shaping, and therapeutic skin remedies. Select any service to pre-lodge inside the booking assistant.
                    </p>
                    
                    <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                      {services.slice(0, 3).map((s) => (
                        <div 
                          key={s.id} 
                          onClick={() => handleSelectService(s.id)}
                          className="bg-stone-950 p-6 rounded-xl border border-stone-850 hover:border-amber-500/20 cursor-pointer shadow-lg group transition-all"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-stone-200 font-bold font-sans text-xs uppercase tracking-wider group-hover:text-amber-400 transition-all">{s.name}</span>
                            <span className="text-amber-400 font-mono text-xs font-bold font-semibold">₹{s.price}</span>
                          </div>
                          <p className="text-stone-450 text-xs leading-relaxed line-clamp-3">{s.description}</p>
                          <span className="text-[10px] text-amber-500/80 font-mono uppercase tracking-widest block mt-4 font-bold">Select & Book &rarr;</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8">
                      <button 
                        onClick={() => setActiveView('services')}
                        className="text-xs uppercase tracking-widest text-amber-400 font-mono hover:underline font-bold"
                      >
                        Browse all services ({services.length}) &rarr;
                      </button>
                    </div>

                  </div>
                </div>

                {/* Testimonials on Home */}
                <TestimonialsList reviews={reviews} onReviewAdded={handleReviewAdded} />

                {/* About section on home */}
                <AboutSection />
                
                {/* Contact coordinates on home */}
                <ContactSection />
              </>
            )}

            {activeView === 'services' && (
              <ServicesList services={services} onSelectService={handleSelectService} />
            )}

            {activeView === 'booking' && (
              <BookingForm 
                services={services} 
                barbers={barbers} 
                selectedServiceId={selectedServiceId}
                onBookingSuccess={() => {
                  fetchPublicData();
                }}
              />
            )}

            {activeView === 'barbers' && (
              <BarbersList barbers={barbers} onSelectBarber={handleSelectBarber} />
            )}

            {activeView === 'gallery' && (
              <GallerySection />
            )}

            {activeView === 'about' && (
              <AboutSection />
            )}

            {activeView === 'contact' && (
              <ContactSection />
            )}

            {activeView === 'admin' && (
              <AdminPanel 
                services={services} 
                barbers={barbers} 
                reviews={reviews}
                onRefreshData={fetchPublicData}
              />
            )}

          </div>
        )}
      </main>

      {/* Premium Dark Tone Footer */}
      <footer className="bg-stone-950 border-t border-stone-900 py-12 text-sm text-stone-400 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-900">
            
            {/* Branding Column */}
            <div className="col-span-1 md:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/5 border border-amber-500/15 rounded-lg text-amber-500">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-black uppercase tracking-wider text-white">HANDSOME</span>
                  <span className="block text-[8px] font-mono tracking-widest text-amber-500">MAN'S SALON</span>
                </div>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                Reclaiming high-end vintage grooming rituals with modern, sartorial attention. Impeccable hair styling, fades, and skin treatments.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="space-y-3.5">
              <span className="text-white font-mono text-[10px] uppercase tracking-widest font-bold">DIRECTORY LINKS</span>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setActiveView("home")} className="hover:text-amber-400 transition-colors">Home Page</button></li>
                <li><button onClick={() => setActiveView("services")} className="hover:text-amber-400 transition-colors">Grooming Services</button></li>
                <li><button onClick={() => setActiveView("booking")} className="hover:text-amber-400 transition-colors">Book Consultation</button></li>
                <li><button onClick={() => setActiveView("barbers")} className="hover:text-amber-400 transition-colors">Our Master Barbers</button></li>
                <li><button onClick={() => setActiveView("gallery")} className="hover:text-amber-400 transition-colors">Portfolio Gallery</button></li>
              </ul>
            </div>

            {/* Quick Contact Block */}
            <div className="space-y-3.5">
              <span className="text-white font-mono text-[10px] uppercase tracking-widest font-bold">SALON DETAILS</span>
              <p className="text-stone-500 text-xs leading-relaxed">
                Near Apollo Pharmacy, Panchabati Nagar,<br/>
                New Colony, Rayagada, Odisha 765001<br/>
                Tel: <a href="tel:+919124013752" className="hover:text-amber-400 font-mono">+91 91240 13752</a><br/>
                Email: <a href="mailto:handsomemensalon.ryg@gmail.com" className="hover:text-amber-300">handsomemensalon.ryg@gmail.com</a>
              </p>
            </div>

            {/* Hours Block */}
            <div className="space-y-3.5">
              <span className="text-white font-mono text-[10px] uppercase tracking-widest font-bold">HOURS & WALKINS</span>
              <p className="text-stone-500 text-xs leading-relaxed">
                Monday to Saturday: 9:00 AM - 8:00 PM<br/>
                Sunday: 10:00 AM - 6:00 PM<br/>
                <span className="text-amber-500/80 font-mono font-bold uppercase text-[10px] tracking-wider block mt-2">● Online reservations highly recommended</span>
              </p>
            </div>

          </div>

          {/* Legal Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-4">
            <p>
              &copy; {new Date().getFullYear()} HANDSOME Man's Salon. All rights reserved. Built with pride & leather shears.
            </p>
            <div className="flex gap-4 font-mono text-[10px] uppercase tracking-widest">
              <button onClick={() => setActiveView("admin")} className="hover:text-stone-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-stone-700" /> Admin Access
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
