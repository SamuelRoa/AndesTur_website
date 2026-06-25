import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, MapPin, CheckCircle, Mail, Phone, User, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { createPreReservation, getDestinations } from '../services/api';

const COUNTRY_CODES = [
  { code: '+58', country: 'Venezuela' },
  { code: '+1', country: 'EE.UU./Canadá' },
  { code: '+54', country: 'Argentina' },
  { code: '+55', country: 'Brasil' },
  { code: '+57', country: 'Colombia' },
  { code: '+51', country: 'Perú' },
  { code: '+56', country: 'Chile' },
  { code: '+593', country: 'Ecuador' },
  { code: '+591', country: 'Bolivia' },
  { code: '+598', country: 'Uruguay' },
  { code: '+595', country: 'Paraguay' },
  { code: '+52', country: 'México' },
  { code: '+507', country: 'Panamá' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+504', country: 'Honduras' },
  { code: '+503', country: 'El Salvador' },
  { code: '+502', country: 'Guatemala' },
  { code: '+34', country: 'España' },
  { code: '+44', country: 'Reino Unido' },
  { code: '+33', country: 'Francia' },
  { code: '+49', country: 'Alemania' },
  { code: '+39', country: 'Italia' },
  { code: '+351', country: 'Portugal' },
];

const INITIAL_FORM = { dni: '', name: '', lastname: '', email: '', phone: '', phoneCode: '+58', date: '', people: '2', selectedDestinationId: '' };

export default function DestinationModal({ isOpen, onClose, defaultDestination = "" }) {
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [ui, setUi] = useState({ isSubmitting: false, submitError: '', isSubmitted: false, submittedData: null });
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchDestinations = useCallback(async () => {
    try {
      const result = await getDestinations();
      setDestinations(result.data || []);
      if (defaultDestination && result.data?.length > 0) {
        const match = result.data.find(
          (d) => d.name === defaultDestination || d.name.includes(defaultDestination.split(" - ")[0])
        );
        if (match) setForm((prev) => ({ ...prev, selectedDestinationId: String(match.id_destination || match.id) }));
      }
    } catch {
      setDestinations([]);
    }
  }, [defaultDestination]);

  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setUi({ isSubmitting: false, submitError: '', isSubmitted: false, submittedData: null });
      setFieldErrors({});
      document.body.style.overflow = 'hidden';
      fetchDestinations();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, fetchDestinations]);

  function validateForm() {
    const errors = {};

    if (!form.selectedDestinationId) errors.selectedDestinationId = 'Selecciona un destino';
    if (!form.dni) errors.dni = 'La cédula es obligatoria';
    else if (!/^\d+$/.test(form.dni)) errors.dni = 'Solo se permiten números';
    if (!form.name) errors.name = 'El nombre es obligatorio';
    if (!form.lastname) errors.lastname = 'El apellido es obligatorio';
    if (!form.email) errors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Formato de correo inválido';
    if (form.phone && !/^\d+$/.test(form.phone)) errors.phone = 'Solo se permiten números';
    if (!form.date) errors.date = 'Selecciona una fecha';

    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUi((prev) => ({ ...prev, submitError: "" }));
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const fullPhone = form.phone ? `${form.phoneCode}${form.phone}` : undefined;

    setUi((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // Assuming createPreReservation supports id_destination or can be extended. 
      // If it only takes id_package, we might have to pass it differently or adapt the backend.
      // But we will send id_destination since this is for destinations.
      const result = await createPreReservation({
        dni: form.dni,
        name: form.name,
        lastname: form.lastname,
        phone_number: fullPhone,
        email: form.email,
        id_destination: Number(form.selectedDestinationId),
      });

      setUi({ isSubmitting: false, submitError: '', isSubmitted: true, submittedData: result.data });
    } catch (err) {
      setUi((prev) => ({ ...prev, submitError: err.message, isSubmitting: false }));
    }
  };

  const selectedDest = destinations.find((d) => String(d.id_destination || d.id) === form.selectedDestinationId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-andes-forest/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-andes-bone dark:bg-zinc-900 border border-andes-forest/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-andes-forest/5 dark:border-white/10 flex items-center justify-between bg-white dark:bg-zinc-950/50">
              <h3 className="text-2xl font-serif text-andes-forest dark:text-andes-bone tracking-wide">Reservar Destino</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-andes-forest/5 dark:hover:bg-white/10 text-andes-forest/60 dark:text-white/60 hover:text-andes-forest dark:hover:text-white transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {!ui.isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {ui.submitError && (
                     <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400">
                       <AlertCircle className="w-4 h-4 shrink-0" />
                       {ui.submitError}
                     </div>
                   )}

                  <div>
                    <label className="block text-xs font-semibold text-andes-forest dark:text-andes-bone uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-andes-gold" /> Destino Seleccionado *
                    </label>
                    <select
                      value={form.selectedDestinationId}
                      onChange={(e) => setForm((prev) => ({ ...prev, selectedDestinationId: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-andes-forest/10 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest dark:text-white transition-all shadow-sm"
                    >
                      <option value="">Selecciona un destino...</option>
                      {destinations.map((dest) => (
                        <option key={dest.id_destination || dest.id} value={dest.id_destination || dest.id}>
                          {dest.name}
                        </option>
                      ))}
                    </select>
                    {selectedDest && selectedDest.description && (
                      <div className="mt-2 p-3 bg-white/50 dark:bg-zinc-800/50 rounded-lg border border-andes-forest/5 dark:border-zinc-700/50">
                        <p className="text-xs text-andes-slate dark:text-white/70 leading-relaxed">
                          {selectedDest.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-andes-forest dark:text-andes-bone uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-andes-gold" /> Fecha *
                      </label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => { setForm((prev) => ({ ...prev, date: e.target.value })); setFieldErrors((prev) => ({ ...prev, date: '' })); }}
                        className={`w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest dark:text-white transition-all shadow-sm ${fieldErrors.date ? 'border-red-400 dark:border-red-500' : 'border-andes-forest/10 dark:border-zinc-700'}`}
                      />
                      {fieldErrors.date && <p className="text-xs text-red-500 mt-1.5">{fieldErrors.date}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-andes-forest dark:text-andes-bone uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-andes-gold" /> Viajeros
                      </label>
                      <select
                        value={form.people}
                        onChange={(e) => setForm((prev) => ({ ...prev, people: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-andes-forest/10 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest dark:text-white transition-all shadow-sm"
                      >
                        <option value="1">1 Persona</option>
                        <option value="2">2 Personas</option>
                        <option value="3">3 Personas</option>
                        <option value="4">4 Personas</option>
                        <option value="5">5 o más</option>
                        <option value="10">Grupo grande (10+)</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-andes-forest/5 dark:border-zinc-800 my-2" />

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-andes-forest dark:text-andes-bone uppercase tracking-wider mb-2">
                        <User className="w-3.5 h-3.5 inline text-andes-gold mr-1.5" /> Nombre *
                      </label>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        value={form.name}
                        onChange={(e) => { setForm((prev) => ({ ...prev, name: e.target.value })); setFieldErrors((prev) => ({ ...prev, name: '' })); }}
                        required
                        className={`w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest dark:text-white transition-all shadow-sm ${fieldErrors.name ? 'border-red-400 dark:border-red-500' : 'border-andes-forest/10 dark:border-zinc-700'}`}
                      />
                      {fieldErrors.name && <p className="text-xs text-red-500 mt-1.5">{fieldErrors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-andes-forest dark:text-andes-bone uppercase tracking-wider mb-2">
                          <CreditCard className="w-3.5 h-3.5 inline text-andes-gold mr-1.5" /> DNI / Cédula *
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. 1098765432"
                          value={form.dni}
                          onChange={(e) => { setForm((prev) => ({ ...prev, dni: e.target.value.replace(/\D/g, '') })); setFieldErrors((prev) => ({ ...prev, dni: '' })); }}
                          required
                          className={`w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest dark:text-white transition-all shadow-sm ${fieldErrors.dni ? 'border-red-400 dark:border-red-500' : 'border-andes-forest/10 dark:border-zinc-700'}`}
                        />
                        {fieldErrors.dni && <p className="text-xs text-red-500 mt-1.5">{fieldErrors.dni}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-andes-forest dark:text-andes-bone uppercase tracking-wider mb-2">
                          <User className="w-3.5 h-3.5 inline text-andes-gold mr-1.5" /> Apellido *
                        </label>
                        <input
                          type="text"
                          placeholder="Tu apellido"
                          value={form.lastname}
                          onChange={(e) => { setForm((prev) => ({ ...prev, lastname: e.target.value })); setFieldErrors((prev) => ({ ...prev, lastname: '' })); }}
                          required
                          className={`w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest dark:text-white transition-all shadow-sm ${fieldErrors.lastname ? 'border-red-400 dark:border-red-500' : 'border-andes-forest/10 dark:border-zinc-700'}`}
                        />
                        {fieldErrors.lastname && <p className="text-xs text-red-500 mt-1.5">{fieldErrors.lastname}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-andes-forest dark:text-andes-bone uppercase tracking-wider mb-2">
                          <Mail className="w-3.5 h-3.5 inline text-andes-gold mr-1.5" /> Correo *
                        </label>
                        <input
                          type="email"
                          placeholder="correo@ejemplo.com"
                          value={form.email}
                          onChange={(e) => { setForm((prev) => ({ ...prev, email: e.target.value })); setFieldErrors((prev) => ({ ...prev, email: '' })); }}
                          required
                          className={`w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest dark:text-white transition-all shadow-sm ${fieldErrors.email ? 'border-red-400 dark:border-red-500' : 'border-andes-forest/10 dark:border-zinc-700'}`}
                        />
                        {fieldErrors.email && <p className="text-xs text-red-500 mt-1.5">{fieldErrors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-andes-forest dark:text-andes-bone uppercase tracking-wider mb-2">
                          <Phone className="w-3.5 h-3.5 inline text-andes-gold mr-1.5" /> Teléfono
                        </label>
                        <div className={`flex w-full bg-white dark:bg-zinc-800 border rounded-xl shadow-sm transition-all focus-within:ring-2 focus-within:ring-andes-gold/30 focus-within:border-andes-gold overflow-hidden ${fieldErrors.phone ? 'border-red-400 dark:border-red-500' : 'border-andes-forest/10 dark:border-zinc-700'}`}>
                          <select
                            value={form.phoneCode}
                            onChange={(e) => setForm((prev) => ({ ...prev, phoneCode: e.target.value }))}
                            className="w-[90px] sm:w-[100px] shrink-0 px-2 py-3 !bg-transparent text-sm focus:outline-none text-andes-forest dark:text-white border-r border-andes-forest/10 dark:border-zinc-700"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code}>{c.code}</option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            placeholder="Número"
                            value={form.phone}
                            onChange={(e) => { setForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '') })); setFieldErrors((prev) => ({ ...prev, phone: '' })); }}
                            className="flex-1 px-3 py-3 bg-transparent text-sm focus:outline-none text-andes-forest dark:text-white"
                          />
                        </div>
                        {fieldErrors.phone && <p className="text-xs text-red-500 mt-1.5">{fieldErrors.phone}</p>}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={ui.isSubmitting}
                    className="w-full py-4 mt-6 bg-andes-gold hover:bg-andes-goldHover disabled:bg-andes-gold/60 text-white text-sm font-bold uppercase rounded-xl tracking-widest shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    {ui.isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Confirmar'
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <CheckCircle className="w-20 h-20 text-andes-gold mb-6 animate-bounce" />
                  <h4 className="text-3xl font-serif text-andes-forest dark:text-andes-bone mb-3">¡Registrado!</h4>
                  <p className="text-sm text-andes-slate dark:text-andes-bone/80 max-w-xs mb-8 leading-relaxed">
                    Hemos registrado tu interés para el destino <strong className="text-andes-forest dark:text-white">{ui.submittedData?.customer?.name || selectedDest?.name}</strong>.
                  </p>
                  
                  <a
                    href={`https://wa.me/584247699792?text=${encodeURIComponent(
                      `¡Hola! Soy ${form.name} ${form.lastname}. Acabo de hacer una reserva de destino en AndesTur (DNI: ${form.dni}). ¿Podrían confirmarme los detalles?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all mb-4 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contactar por WhatsApp
                  </a>
                  
                  <button
                    onClick={onClose}
                    className="w-full py-3.5 border border-andes-forest/10 dark:border-white/10 text-andes-forest dark:text-andes-bone hover:bg-andes-forest/5 dark:hover:bg-white/10 text-sm font-semibold rounded-xl transition-all"
                  >
                    Cerrar
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
