/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Appointment, Service, Barber, Review } from "../types";
import { Shield, Lock, Eye, Calendar, Plus, Trash2, Edit2, LogOut, CheckCircle, Clock, XCircle, Users, Award, ShieldAlert } from "lucide-react";

interface AdminPanelProps {
  services: Service[];
  barbers: Barber[];
  reviews: Review[];
  onRefreshData: () => void;
}

export default function AdminPanel({ services, barbers, reviews, onRefreshData }: AdminPanelProps) {
  // Session Authentication state
  const [token, setToken] = React.useState<string | null>(() => {
    return localStorage.getItem("handsome_admin_token");
  });
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [authLoading, setAuthLoading] = React.useState(false);

  // Administrative States
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [tblLoading, setTblLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"appointments" | "services" | "barbers" | "reviews">("appointments");

  // Editorial states (CRUD Forms)
  const [serviceForm, setServiceForm] = React.useState<{ id?: string, name: string, price: string, duration: string, description: string } | null>(null);
  const [barberForm, setBarberForm] = React.useState<{ id?: string, name: string, specialty: string, photo: string } | null>(null);

  const [formErr, setFormErr] = React.useState<string | null>(null);
  const [crudLoading, setCrudLoading] = React.useState(false);

  // Fetch admin appointments if authenticated
  const fetchAppointments = React.useCallback(async () => {
    if (!token) return;
    setTblLoading(true);
    try {
      const response = await fetch("/api/admin/appointments", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTblLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token, fetchAppointments]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("handsome_admin_token", data.token);
        setToken(data.token);
        setPassword("");
        setUsername("");
      } else {
        setAuthError(data.error || "Authentication credentials mismatch.");
      }
    } catch (err) {
      setAuthError("Failed to issue credentials. Please test backend connection.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("handsome_admin_token");
    setToken(null);
    setAppointments([]);
  };

  // Appointment Actions
  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/appointments/${id}/status`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const response = await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Service CRUD Actions
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm) return;
    setFormErr(null);
    setCrudLoading(true);

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(serviceForm)
      });
      const data = await response.json();
      if (response.ok) {
        onRefreshData();
        setServiceForm(null);
      } else {
        setFormErr(data.error || "Failed to commit service state.");
      }
    } catch (err) {
      setFormErr("Network disconnect.");
    } finally {
      setCrudLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm("Verify: Are you sure you want to delete this service? This affects future appointments.")) return;
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Barber CRUD Actions
  const handleBarberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barberForm) return;
    setFormErr(null);
    setCrudLoading(true);

    try {
      const response = await fetch("/api/admin/barbers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(barberForm)
      });
      const data = await response.json();
      if (response.ok) {
        onRefreshData();
        setBarberForm(null);
      } else {
        setFormErr(data.error || "Failed to commit barber profile.");
      }
    } catch (err) {
      setFormErr("Barber submit failed.");
    } finally {
      setCrudLoading(false);
    }
  };

  const deleteBarber = async (id: string) => {
    if (!window.confirm("Verify: Are you sure you want to delete this master barber profile?")) return;
    try {
      const response = await fetch(`/api/admin/barbers/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Utility to locate service name
  const matchServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || "Original Service Deleted";
  };

  // If NOT Authenticated, render minimal polished login page
  if (!token) {
    return (
      <section id="admin-login-layout" className="py-24 bg-stone-950 flex justify-center items-center font-sans px-4">
        <div className="w-full max-w-md bg-stone-900 border border-stone-850 p-8 rounded-2xl shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 rounded-t-2xl" />
          
          <div className="text-center space-y-3 mb-8">
            <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-500">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest text-white leading-none">
                Grooming Registry
              </h2>
              <span className="text-[10px] tracking-widest font-mono text-stone-500 uppercase block mt-1">
                SECURE ADMIN SESSION AUTHENTICATION
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 text-sm">
            {authError && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/20 text-red-300 rounded text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-stone-400 font-mono">Username</label>
              <input
                type="text"
                required
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-white rounded-md px-3.5 py-2.5 outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-stone-400 font-mono">Password</label>
              <input
                type="password"
                required
                placeholder="Password (handsome123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-white rounded-md px-3.5 py-2.5 outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-widest text-xs rounded transition-all active:scale-[0.98]"
            >
              {authLoading ? "Logging in..." : "Access Control Center"}
            </button>
          </form>

          <p className="text-stone-600 text-[10px] text-center uppercase tracking-widest font-mono mt-6">
            ● Authorized personnel only • IP logs registered.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="admin-dashboard-layout" className="py-12 bg-stone-950 min-h-screen text-stone-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-850 pb-6">
          <div className="space-y-1">
            <span className="text-amber-500 font-mono text-[10px] uppercase tracking-widest font-bold">CONTROL CONSOLE</span>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">HANDSOME Master Dashboard</h2>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono rounded font-bold uppercase uppercase tracking-wider">LIVE</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-stone-900 border border-stone-800 hover:bg-red-950/20 hover:text-red-300 text-stone-400 rounded-md font-mono text-xs uppercase tracking-widest transition-all inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Session
          </button>
        </div>

        {/* Console Nav Tabs */}
        <div className="flex flex-wrap border-b border-stone-900 gap-1 pb-1">
          <button
            onClick={() => { setActiveTab("appointments"); fetchAppointments(); }}
            className={`px-5 py-3 text-xs uppercase font-mono tracking-widest rounded-t-md transition-all ${
              activeTab === "appointments" ? "bg-stone-900 border-t-2 border-amber-500 text-amber-400 font-semibold" : "text-stone-400 hover:text-white hover:bg-stone-900/50"
            }`}
          >
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => { setActiveTab("services"); setServiceForm(null); }}
            className={`px-5 py-3 text-xs uppercase font-mono tracking-widest rounded-t-md transition-all ${
              activeTab === "services" ? "bg-stone-900 border-t-2 border-amber-500 text-amber-400 font-semibold" : "text-stone-400 hover:text-white"
            }`}
          >
            Manage Services ({services.length})
          </button>
          <button
            onClick={() => { setActiveTab("barbers"); setBarberForm(null); }}
            className={`px-5 py-3 text-xs uppercase font-mono tracking-widest rounded-t-md transition-all ${
              activeTab === "barbers" ? "bg-stone-900 border-t-2 border-amber-500 text-amber-400 font-semibold" : "text-stone-400 hover:text-white"
            }`}
          >
            Manage Barbers ({barbers.length})
          </button>
          <button
            onClick={() => { setActiveTab("reviews"); }}
            className={`px-5 py-3 text-xs uppercase font-mono tracking-widest rounded-t-md transition-all ${
              activeTab === "reviews" ? "bg-stone-900 border-t-2 border-amber-500 text-amber-400 font-semibold" : "text-stone-400 hover:text-white"
            }`}
          >
            Guest Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content Rendering */}
        <div className="bg-stone-900 border border-stone-850 rounded-xl p-6 shadow-2xl relative overflow-hidden">
          
          {/* TAB 1: APPOINTMENTS VIEW */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-stone-100 font-bold uppercase text-sm font-mono tracking-wide flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" /> Appointment Registrations
                </h3>
                <button 
                  onClick={fetchAppointments} 
                  className="px-3 py-1 bg-stone-950 border border-stone-850 hover:border-amber-500/20 text-stone-400 text-xs rounded transition-all font-mono uppercase"
                >
                  Refresh Table
                </button>
              </div>

              {tblLoading ? (
                <p className="text-stone-500 font-mono text-xs">Accessing record files...</p>
              ) : appointments.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-stone-850">
                  <table className="min-w-full divide-y divide-stone-950 text-left text-xs text-stone-300">
                    <thead className="bg-stone-950 text-stone-400 font-mono uppercase tracking-widest text-[10px]">
                      <tr>
                        <th className="px-5 py-4">Client Detail</th>
                        <th className="px-5 py-4">Requested Service</th>
                        <th className="px-5 py-4">Schedule Date & Slot</th>
                        <th className="px-5 py-4">Workflow Status</th>
                        <th className="px-5 py-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-950">
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-stone-905 transition-colors">
                          <td className="px-5 py-4 space-y-0.5">
                            <span className="block font-bold text-stone-200">{apt.name}</span>
                            <span className="block text-stone-400 font-mono">{apt.phone}</span>
                            {apt.email && <span className="block text-stone-500">{apt.email}</span>}
                            {apt.notes && (
                              <p className="text-[11px] text-amber-500/80 italic mt-1.5 max-w-xs">{apt.notes}</p>
                            )}
                          </td>
                          <td className="px-5 py-4 text-stone-300 font-semibold uppercase tracking-wide">
                            {matchServiceName(apt.serviceId)}
                          </td>
                          <td className="px-5 py-4">
                            <span className="block text-stone-200">{apt.date}</span>
                            <span className="block font-mono text-amber-400 font-bold uppercase mt-0.5">{apt.time}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold leading-none ${
                              apt.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              apt.status === "Confirmed" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
                              apt.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right space-y-1 sm:space-x-1 sm:space-y-0">
                            
                            <select 
                              onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                              value={apt.status}
                              className="bg-stone-950 border border-stone-850 text-stone-300 hover:text-white rounded py-1 px-1.5 outline-none text-[11px] font-mono cursor-pointer transition-all"
                            >
                              <option value="Pending">Set Pending</option>
                              <option value="Confirmed">Confirm</option>
                              <option value="Completed">Complete</option>
                              <option value="Cancelled">Cancel</option>
                            </select>

                            <button 
                              onClick={() => deleteAppointment(apt.id)}
                              className="p-1 px-2 border border-red-500/20 hover:bg-red-500 hover:text-stone-950 text-red-400 text-[10px] font-mono rounded"
                              title="Delete Appointment Log"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 bg-stone-950/40 rounded-lg border border-stone-850">
                  <p className="text-stone-400 font-mono text-sm">No appointments on file currently.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MANAGE SERVICES CRUD */}
          {activeTab === "services" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-stone-100 font-bold uppercase text-sm font-mono tracking-wide flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-500" /> Services Directory Configuration
                </h3>
                {!serviceForm && (
                  <button 
                    onClick={() => setServiceForm({ name: "", price: "", duration: "", description: "" })}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold font-mono tracking-wider rounded uppercase transition-all"
                  >
                    Add Service
                  </button>
                )}
              </div>

              {serviceForm ? (
                /* Service CRUD Form */
                <form onSubmit={handleServiceSubmit} className="bg-stone-950 border border-stone-800 p-6 rounded-xl space-y-4 max-w-lg mx-auto font-sans text-sm">
                  <h4 className="text-stone-200 uppercase tracking-wider font-bold border-b border-stone-900 pb-2 flex justify-between items-center">
                    <span>{serviceForm.id ? "Edit Service Parameters" : "Create Service Entry"}</span>
                    <button 
                      type="button" 
                      onClick={() => setServiceForm(null)}
                      className="text-stone-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </h4>

                  {formErr && <div className="p-3 bg-red-950/25 border border-red-500/20 text-red-300 text-xs rounded">{formErr}</div>}

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-mono tracking-widest text-stone-400">Service Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Traditional Beard Trim"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 text-white rounded px-3 py-2 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-mono tracking-widest text-stone-400">Price (₹ INR)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 150"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 text-white rounded px-3 py-2 outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-mono tracking-widest text-stone-400">Duration (Minutes)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 30"
                        value={serviceForm.duration}
                        onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 text-white rounded px-3 py-2 outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-mono tracking-widest text-stone-400">Description</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe the styling methods and experience details..."
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 text-white rounded px-3 py-2 outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={crudLoading}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono tracking-wider text-xs uppercase rounded transition-all"
                  >
                    Commit Configuration
                  </button>
                </form>
              ) : (
                /* Services table list */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((srv) => (
                    <div key={srv.id} className="bg-stone-950 border border-stone-850 p-5 rounded-lg flex justify-between items-start">
                      <div className="space-y-2 max-w-xs">
                        <span className="block text-stone-200 font-bold uppercase text-xs tracking-wider">{srv.name}</span>
                        <div className="flex gap-4 text-xs font-mono text-amber-400">
                          <span>₹{srv.price}</span>
                          <span>•</span>
                          <span>{srv.duration} mins</span>
                        </div>
                        <p className="text-stone-450 text-xs leading-relaxed line-clamp-2">{srv.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setServiceForm({ id: srv.id, name: srv.name, price: srv.price.toString(), duration: srv.duration.toString(), description: srv.description })}
                          className="p-1.5 bg-stone-900 border border-stone-800 hover:border-amber-500/20 text-stone-300 rounded text-xs"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteService(srv.id)}
                          className="p-1.5 bg-stone-900 border border-stone-800 hover:border-red-500/25 text-red-400 rounded text-xs"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANAGE BARBERS CRUD */}
          {activeTab === "barbers" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-stone-100 font-bold uppercase text-sm font-mono tracking-wide flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" /> Barbers Team Roster
                </h3>
                {!barberForm && (
                  <button 
                    onClick={() => setBarberForm({ name: "", specialty: "", photo: "" })}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold font-mono tracking-wider rounded uppercase transition-all"
                  >
                    Add Barber
                  </button>
                )}
              </div>

              {barberForm ? (
                /* Barber CRUD Form */
                <form onSubmit={handleBarberSubmit} className="bg-stone-950 border border-stone-800 p-6 rounded-xl space-y-4 max-w-lg mx-auto font-sans text-sm">
                  <h4 className="text-stone-200 uppercase tracking-wider font-bold border-b border-stone-900 pb-2 flex justify-between items-center">
                    <span>{barberForm.id ? "Edit Barber profile" : "Add Barber Profile"}</span>
                    <button 
                      type="button" 
                      onClick={() => setBarberForm(null)}
                      className="text-stone-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </h4>

                  {formErr && <div className="p-3 bg-red-950/25 border border-red-500/20 text-red-300 text-xs rounded">{formErr}</div>}

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-mono tracking-widest text-stone-400">FullName Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Christian Cole"
                      value={barberForm.name}
                      onChange={(e) => setBarberForm({ ...barberForm, name: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 text-white rounded px-3 py-2 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-mono tracking-widest text-stone-400">Specialty / Achievements</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Classic Scissors, Beard Line definition"
                      value={barberForm.specialty}
                      onChange={(e) => setBarberForm({ ...barberForm, specialty: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 text-white rounded px-3 py-2 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-mono tracking-widest text-stone-400">Photo URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={barberForm.photo}
                      onChange={(e) => setBarberForm({ ...barberForm, photo: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 text-white rounded px-3 py-2 outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={crudLoading}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-mono tracking-wider text-xs uppercase rounded transition-all"
                  >
                    Commit Barber profile
                  </button>
                </form>
              ) : (
                /* Barbers template list */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {barbers.map((bar) => (
                    <div key={bar.id} className="bg-stone-950 border border-stone-850 p-4 rounded-lg flex items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-3">
                        <img 
                          src={bar.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"} 
                          alt={bar.name} 
                          className="w-12 h-12 rounded-full object-cover border border-stone-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="block text-stone-200 font-bold text-sm tracking-wide">{bar.name}</span>
                          <span className="block text-[11px] font-mono text-amber-400 mt-0.5">{bar.specialty}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setBarberForm({ id: bar.id, name: bar.name, specialty: bar.specialty, photo: bar.photo || "" })}
                          className="p-1.5 bg-stone-900 border border-stone-800 hover:border-amber-500/20 text-stone-300 rounded text-xs"
                          title="Edit Barber"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteBarber(bar.id)}
                          className="p-1.5 bg-stone-900 border border-stone-800 hover:border-red-500/25 text-red-400 rounded text-xs"
                          title="Delete Barber"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VIEW GUEST REVIEWS */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              
              <h3 className="text-stone-100 font-bold uppercase text-sm font-mono tracking-wide flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Submitted Customer Testimonials
              </h3>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-stone-950 p-5 rounded-lg border border-stone-850 text-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{rev.name}</span>
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[9px] rounded font-bold uppercase">
                          {rev.rating} STARS
                        </span>
                      </div>
                      <span className="text-xs text-stone-600 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-stone-400 italic">"{rev.comment}"</p>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="text-center py-12 bg-stone-950/45 rounded border border-stone-850">
                    <p className="text-stone-400 font-mono text-sm">No client reviews registered.</p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
