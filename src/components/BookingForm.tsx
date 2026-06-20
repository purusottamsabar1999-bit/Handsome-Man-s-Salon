/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Service, Barber } from "../types";
import { Calendar, Phone, Mail, User, Clock, FileText, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

interface BookingFormProps {
  services: Service[];
  barbers: Barber[];
  selectedServiceId?: string;
  onBookingSuccess: () => void;
}

export default function BookingForm({ services, barbers, selectedServiceId, onBookingSuccess }: BookingFormProps) {
  // Form State
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [serviceId, setServiceId] = React.useState(selectedServiceId || "");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [barberId, setBarberId] = React.useState(""); // Premium additions

  // Status State
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [confirmationReceipt, setConfirmationReceipt] = React.useState<any>(null);

  // Sync selected service if updated from outer component
  React.useEffect(() => {
    if (selectedServiceId) {
      setServiceId(selectedServiceId);
    }
  }, [selectedServiceId]);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM",
    "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM",
    "06:30 PM", "07:00 PM"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (!name.trim()) return setError("Please input your full name.");
    if (!phone.trim() || phone.length < 8) return setError("Please enter a valid phone number.");
    if (!serviceId) return setError("Please specify a grooming service.");
    if (!date) return setError("Please select a date for your appointment.");
    if (!time) return setError("Please pick a preferred layout time slot.");

    setLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          serviceId,
          date,
          time,
          notes,
          barberId // optional metadata
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setConfirmationReceipt(data.appointment);
        // Clear inputs
        setName("");
        setPhone("");
        setEmail("");
        setServiceId("");
        setDate("");
        setTime("");
        setNotes("");
        setBarberId("");
        
        if (onBookingSuccess) {
          onBookingSuccess();
        }
      } else {
        setError(data.error || "An error occurred while scheduling your appointment.");
      }
    } catch (err) {
      setError("Failed to connect to the salon scheduler. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || "Select Service";
  };

  const getServicePrice = (id: string) => {
    return services.find(s => s.id === id)?.price || 0;
  };

  return (
    <section id="booking-section" className="py-20 bg-stone-950 border-b border-stone-900 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.25em] font-bold">
            FRICTIONLESS APPOINTMENTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-stone-100 mt-3 tracking-tight">
            Reserve Your Grooming Slot
          </h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          <p className="text-stone-400 mt-4 text-xs sm:text-sm">
            Book securely as a guest in just 60 seconds. No passwords or account registration required.
          </p>
        </div>

        {success && confirmationReceipt ? (
          /* Receipt Success Modal Card */
          <div id="booking-success-container" className="bg-stone-900 border border-amber-500/20 rounded-2xl p-8 shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-sans text-white uppercase tracking-wider">
                Appointment Registered!
              </h3>
              <p className="text-stone-400 text-sm">
                Your luxury slot has been reserved. Please find your reservation details below.
              </p>
            </div>

            {/* Receipt Summary Sheet */}
            <div className="bg-stone-950 rounded-xl p-6 border border-stone-850 text-left max-w-md mx-auto space-y-4 font-sans">
              <div className="flex justify-between border-b border-stone-905 pb-3">
                <span className="text-xs text-stone-400 font-mono">RESERVATION ID</span>
                <span className="text-xs text-amber-400 font-mono font-bold uppercase">{confirmationReceipt.id}</span>
              </div>
              <div className="space-y-2.5 text-sm text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-500">Name:</span>
                  <span className="font-semibold text-stone-100">{confirmationReceipt.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Service:</span>
                  <span className="font-semibold text-stone-100">{getServiceName(confirmationReceipt.serviceId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Date:</span>
                  <span className="font-semibold text-stone-100">{confirmationReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Time:</span>
                  <span className="font-semibold text-amber-300 font-mono">{confirmationReceipt.time}</span>
                </div>
                <div className="flex justify-between border-t border-stone-900 pt-3 text-base">
                  <span className="font-bold text-amber-500">Est. Total:</span>
                  <span className="font-extrabold text-amber-400">₹{getServicePrice(confirmationReceipt.serviceId)}</span>
                </div>
              </div>
            </div>

            <p className="text-stone-500 text-xs italic">
              Please click the link below to send your reservation invoice summary directly to Handsome Men's Salon on WhatsApp at +91 91240 13752.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/919124013752?text=${encodeURIComponent(
                  `Hello Handsome Men's Salon! I have just booked my grooming appointment online.\n\n*Reservation Summary*\n- ID: ${confirmationReceipt.id}\n- Name: ${confirmationReceipt.name}\n- Service: ${getServiceName(confirmationReceipt.serviceId)}\n- Date: ${confirmationReceipt.date}\n- Time: ${confirmationReceipt.time}\n- Total price: ₹${getServicePrice(confirmationReceipt.serviceId)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold uppercase tracking-widest text-[11px] rounded-md transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                Send WhatsApp Confirmation
              </a>
              <button
                onClick={() => setSuccess(false)}
                className="w-full sm:w-auto px-6 py-3 bg-stone-850 hover:bg-stone-800 text-amber-500 border border-stone-800 font-bold uppercase tracking-widest text-[11px] rounded-md transition-all inline-flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Book Another Session
              </button>
            </div>
          </div>
        ) : (
          /* Input Booking Layout */
          <form 
            onSubmit={handleSubmit} 
            className="bg-stone-900 p-6 sm:p-10 rounded-2xl border border-stone-850/80 shadow-2xl space-y-6 font-sans relative overflow-hidden"
          >
            {/* Visual Gold Border Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

            {error && (
              <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-300 rounded-lg text-xs sm:text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Input fields grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-mono text-stone-400 font-semibold">
                  Full Name <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Finch"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-md pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder-stone-600"
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-mono text-stone-400 font-semibold">
                  Phone Number <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    maxLength={15}
                    placeholder="e.g. (323) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-md pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder-stone-600"
                  />
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-mono text-stone-400 font-semibold">
                  Email Address <span className="text-stone-500">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. liam@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-md pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder-stone-600"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                </div>
              </div>

              {/* Service Select */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-mono text-stone-400 font-semibold">
                  Grooming Service <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full appearance-none bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-md pl-4 pr-10 py-3 text-sm outline-none transition-all font-sans cursor-pointer"
                  >
                    <option value="" disabled className="text-stone-600">-- Choose Service --</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} (₹{s.price} - {s.duration} min)
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-4 right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-stone-400" />
                </div>
              </div>

              {/* Preferred Date */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-mono text-stone-400 font-semibold">
                  Preferred Date <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]} // Disable past days
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-md px-4 py-3 text-sm outline-none transition-all font-sans [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Preferred Barber */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-mono text-stone-400 font-semibold">
                  Preferred Barber <span className="text-stone-500">(Optional)</span>
                </label>
                <div className="relative">
                  <select
                    value={barberId}
                    onChange={(e) => setBarberId(e.target.value)}
                    className="w-full appearance-none bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-md pl-4 pr-10 py-3 text-sm outline-none transition-all font-sans cursor-pointer"
                  >
                    <option value="">Any Master Barber (Highly Recommended)</option>
                    {barbers.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <div className="absolute top-4 right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-stone-400" />
                </div>
              </div>

            </div>

            {/* Time Slot Selector */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs uppercase tracking-widest font-mono text-stone-400 font-semibold">
                Select Consultation / Grooming Time <span className="text-amber-500">*</span>
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-2 px-1 text-[11px] font-mono tracking-wider transition-all rounded-md border text-center font-bold ${
                      time === slot
                        ? "bg-amber-500 text-stone-950 border-amber-500 font-extrabold"
                        : "bg-stone-950 text-stone-300 border-stone-850 hover:border-amber-500/30 hover:text-amber-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest font-mono text-stone-400 font-semibold">
                Special Requests or Service Notes <span className="text-stone-500">(Optional)</span>
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="e.g. Please preserve the sideburn taper, extra sharp razor edges desired."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-white rounded-md pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder-stone-600 font-sans"
                />
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold uppercase tracking-widest text-xs py-4 rounded-md transition-all shadow-lg shadow-amber-500/10 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Routing Your Slot...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 font-bold" />
                    Confirm Reservation
                  </>
                )}
              </button>
            </div>

            <p className="text-stone-500 text-[10px] text-center uppercase tracking-wider font-mono">
              ● Server protected via advanced rate limiters and standard encryption.
            </p>

          </form>
        )}

      </div>
    </section>
  );
}
