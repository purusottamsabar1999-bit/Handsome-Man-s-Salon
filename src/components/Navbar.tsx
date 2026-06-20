/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Scissors, User, Calendar, Menu, X, Shield } from "lucide-react";

interface NavbarProps {
  onNavigate: (view: 'home' | 'services' | 'booking' | 'barbers' | 'gallery' | 'about' | 'contact' | 'admin') => void;
  activeView: string;
}

export default function Navbar({ onNavigate, activeView }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { label: "Home", value: "home" },
    { label: "Services", value: "services" },
    { label: "Our Barbers", value: "barbers" },
    { label: "Gallery", value: "gallery" },
    { label: "Reviews", value: "home", sectionId: "testimonials" }, // points to section
    { label: "About", value: "about" },
    { label: "Contact", value: "contact" },
  ];

  const handleNav = (value: any, sectionId?: string) => {
    onNavigate(value);
    setIsOpen(false);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => handleNav("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all duration-300">
              <Scissors className="w-6 h-6 text-amber-500 group-hover:text-stone-950 transition-colors" />
            </div>
            <div>
              <span className="block text-xl font-bold tracking-widest text-amber-100 uppercase font-sans">
                HANDSOME
              </span>
              <span className="block text-[10px] tracking-[0.3em] uppercase text-amber-500/80 font-mono font-medium leading-none">
                MAN'S SALON
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                id={`nav-${item.label.toLowerCase()}`}
                onClick={() => handleNav(item.value, item.sectionId)}
                className={`px-4 py-2.5 text-xs uppercase tracking-widest font-medium transition-all duration-200 rounded-md hover:text-amber-400 ${
                  activeView === item.value && !item.sectionId
                    ? "text-amber-500 font-bold bg-amber-500/5 font-mono"
                    : "text-stone-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="nav-btn-admin"
              onClick={() => handleNav("admin")}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs font-mono tracking-wider transition-all duration-300 uppercase ${
                activeView === "admin"
                  ? "bg-amber-500 border-amber-500 text-stone-950 font-bold"
                  : "border-stone-800 text-stone-400 hover:text-amber-400 hover:border-amber-400/30 bg-stone-900/50"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
            <button
              id="nav-btn-book"
              onClick={() => handleNav("booking")}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 px-5 py-2.5 rounded-md font-sans text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-md shadow-amber-500/10 active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNav("admin")}
              className="p-2 sm:hidden text-stone-400 hover:text-amber-400 hover:bg-stone-900/50 rounded-lg transition-colors border border-stone-800/60"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 text-stone-400 hover:text-amber-400 hover:bg-stone-900/50 rounded-lg transition-all border border-stone-800/80"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-amber-500/10 animate-fadeIn">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleNav(item.value, item.sectionId)}
                className="block w-full text-left px-4 py-3 text-sm tracking-widest uppercase text-stone-300 hover:text-amber-400 hover:bg-amber-500/5 rounded-md transition-all font-medium border-l border-transparent hover:border-amber-500"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-stone-900 space-y-2 px-2">
              <button
                onClick={() => handleNav("admin")}
                className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 py-3 rounded-md text-xs uppercase font-mono tracking-widest"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </button>
              <button
                onClick={() => handleNav("booking")}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 py-3 rounded-md text-xs uppercase font-bold tracking-widest shadow-lg shadow-amber-500/15"
              >
                <Calendar className="w-4 h-4" />
                Book Slot Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
