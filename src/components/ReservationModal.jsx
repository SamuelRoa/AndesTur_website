import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, MapPin, CheckCircle, Mail, Phone, User } from 'lucide-react';

export default function ReservationModal({ isOpen, onClose, defaultDestination = "" }) {
  const [destination, setDestination] = useState(defaultDestination);
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDestination(defaultDestination);
      setIsSubmitted(false);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, defaultDestination]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination || !date || !people || !name || !email) {
      alert("Por favor rellena los campos requeridos.");
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-andes-forest/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-andes-bone border border-andes-forest/10 rounded-2xl shadow-xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-andes-forest/5 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-2xl font-serif text-andes-forest">Reserva tu Aventura</h3>
                <p className="text-xs text-andes-slate mt-1">Completa los detalles para planificar tu ruta andina.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-andes-forest/5 text-andes-forest/60 hover:text-andes-forest transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Destino */}
                  <div>
                    <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-andes-gold" /> Destino Andino *
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
                    >
                      <option value="" disabled>Selecciona tu destino...</option>
                      <option value="Mérida - Teleférico Mukumbarí">Mérida - Teleférico Mukumbarí & Páramos</option>
                      <option value="Pico Bolívar - Ruta Alta Montaña">Pico Bolívar - Ruta de Alta Montaña</option>
                      <option value="Ruta de los Pueblos del Sur">Ruta Cultural de los Pueblos del Sur</option>
                      <option value="Páramo La Culata y Aguas Termales">Páramo La Culata y Aguas Termales</option>
                      <option value="Sierra de la Culata - Trekking Lagunas">Sierra de la Culata - Trekking de Lagunas</option>
                    </select>
                  </div>

                  {/* Fila de Fecha y Personas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-andes-gold" /> Fecha de Viaje *
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-andes-gold" /> Nro. de Viajeros *
                      </label>
                      <select
                        value={people}
                        onChange={(e) => setPeople(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
                      >
                        <option value="1">1 Persona</option>
                        <option value="2">2 Personas</option>
                        <option value="3">3 Personas</option>
                        <option value="4">4 Personas</option>
                        <option value="5">5 o más Personas</option>
                        <option value="10">Grupo grande (10+)</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-andes-forest/5 my-4" />

                  {/* Datos del Cliente */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-andes-forest uppercase tracking-wider">Tus Datos de Contacto</h4>
                    
                    <div>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-andes-forest/40" />
                        <input
                          type="text"
                          placeholder="Nombre completo *"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-andes-forest/40" />
                        <input
                          type="email"
                          placeholder="Correo electrónico *"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-andes-forest/40" />
                        <input
                          type="tel"
                          placeholder="Teléfono móvil (ej. +58 412...)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón enviar */}
                  <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-andes-gold hover:bg-andes-goldHover text-white text-sm font-semibold rounded-xl tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95"
                  >
                    Confirmar Pre-Reserva
                  </button>
                </form>
              ) : (
                /* Éxito */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-andes-gold mb-4 animate-bounce" />
                  <h4 className="text-2xl font-serif text-andes-forest mb-2">¡Pre-Reserva Registrada!</h4>
                  <p className="text-sm text-andes-slate max-w-sm mb-6 leading-relaxed">
                    Hola <strong>{name}</strong>, hemos registrado tu interés para la ruta <strong>{destination}</strong> para el día {date} (Grupo: {people} pers.).
                  </p>
                  <div className="bg-white p-4 rounded-xl border border-andes-forest/5 text-xs text-left w-full space-y-1 text-andes-slate mb-6">
                    <p><strong>Destino:</strong> {destination}</p>
                    <p><strong>Fecha:</strong> {date}</p>
                    <p><strong>Viajeros:</strong> {people}</p>
                    <p><strong>Correo:</strong> {email}</p>
                  </div>
                  <p className="text-xs text-andes-gold font-medium mb-6">
                    Te enviaremos los detalles de pago y el itinerario en las próximas 2 horas.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-andes-forest/10 text-andes-forest hover:bg-andes-forest/5 text-xs font-semibold rounded-xl transition-all"
                  >
                    Cerrar ventana
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
