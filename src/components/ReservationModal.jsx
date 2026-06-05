import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, MapPin, CheckCircle, Mail, Phone, User, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { createPreReservation, getPackages } from '../services/api';


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

const INITIAL_FORM = { dni: '', name: '', lastname: '', email: '', phone: '', phoneCode: '+58', date: '', people: '2', selectedPackageId: '' };

export default function ReservationModal({ isOpen, onClose, defaultDestination = "" }) {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [ui, setUi] = useState({ isSubmitting: false, submitError: '', isSubmitted: false, submittedData: null });
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchPackages = useCallback(async () => {
    try {
      const result = await getPackages();
      setPackages(result.data);
      if (defaultDestination && result.data.length > 0) {
        const match = result.data.find(
          (p) => p.name === defaultDestination || p.name.includes(defaultDestination.split(" - ")[0])
        );
        if (match) setForm((prev) => ({ ...prev, selectedPackageId: String(match.id_package) }));
      }
    } catch {
      setPackages([]);
    }
  }, [defaultDestination]);

  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setUi({ isSubmitting: false, submitError: '', isSubmitted: false, submittedData: null });
      setFieldErrors({});
      document.body.style.overflow = 'hidden';
      fetchPackages();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, fetchPackages]);

  function validateForm() {
    const errors = {};

    if (!form.selectedPackageId) errors.selectedPackageId = 'Selecciona un paquete';
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
      const result = await createPreReservation({
        dni: form.dni,
        name: form.name,
        lastname: form.lastname,
        phone_number: fullPhone,
        email: form.email,
        id_package: Number(form.selectedPackageId),
      });

      setUi({ isSubmitting: false, submitError: '', isSubmitted: true, submittedData: result.data });
    } catch (err) {
      setUi((prev) => ({ ...prev, submitError: err.message, isSubmitting: false }));
    }
  };

  const selectedPkg = packages.find((p) => String(p.id_package) === form.selectedPackageId);

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
            className="relative w-full max-w-lg bg-andes-bone border border-andes-forest/10 rounded-2xl shadow-xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
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

            <div className="p-6 overflow-y-auto flex-1">
              {!ui.isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {ui.submitError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {ui.submitError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-andes-gold" /> Paquete Turístico *
                    </label>
                    <select
                      value={form.selectedPackageId}
                      onChange={(e) => setForm((prev) => ({ ...prev, selectedPackageId: e.target.value }))}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
                    >
                      <option value="">Selecciona un paquete...</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id_package} value={pkg.id_package}>
                          {pkg.name} - ${pkg.price}
                        </option>
                      ))}
                    </select>
                    {selectedPkg && (
                      <p className="text-xs text-andes-slate mt-1">
                        {new Date(selectedPkg.departure_date).toLocaleDateString()} → {new Date(selectedPkg.return_date).toLocaleDateString()} | {selectedPkg.description?.slice(0, 80)}...
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-andes-gold" /> Fecha de Viaje
                      </label>
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => { setForm((prev) => ({ ...prev, date: e.target.value })); setFieldErrors((prev) => ({ ...prev, date: '' })); }}
                          className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all ${fieldErrors.date ? 'border-red-400' : 'border-andes-forest/10'}`}
                        />
                        {fieldErrors.date && <p className="text-xs text-red-500 mt-1">{fieldErrors.date}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-andes-gold" /> Viajeros
                        </label>
                        <select
                          value={form.people}
                          onChange={(e) => setForm((prev) => ({ ...prev, people: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
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

                  <hr className="border-andes-forest/5 my-4" />

                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-andes-forest uppercase tracking-wider">Tus Datos</h4>

                    <div>
                      <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5">
                        <User className="w-3.5 h-3.5 inline text-andes-gold mr-1" /> Nombre *
                      </label>
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={form.name}
                        onChange={(e) => { setForm((prev) => ({ ...prev, name: e.target.value })); setFieldErrors((prev) => ({ ...prev, name: '' })); }}
                        required
                        className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all ${fieldErrors.name ? 'border-red-400' : 'border-andes-forest/10'}`}
                      />
                      {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5">
                          <CreditCard className="w-3.5 h-3.5 inline text-andes-gold mr-1" /> DNI / Cédula *
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. 1098765432"
                          value={form.dni}
                          onChange={(e) => { setForm((prev) => ({ ...prev, dni: e.target.value.replace(/\D/g, '') })); setFieldErrors((prev) => ({ ...prev, dni: '' })); }}
                          required
                          className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all ${fieldErrors.dni ? 'border-red-400' : 'border-andes-forest/10'}`}
                        />
                        {fieldErrors.dni && <p className="text-xs text-red-500 mt-1">{fieldErrors.dni}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5">
                          <User className="w-3.5 h-3.5 inline text-andes-gold mr-1" /> Apellido *
                        </label>
                        <input
                          type="text"
                          placeholder="Apellido"
                          value={form.lastname}
                          onChange={(e) => { setForm((prev) => ({ ...prev, lastname: e.target.value })); setFieldErrors((prev) => ({ ...prev, lastname: '' })); }}
                          required
                          className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all ${fieldErrors.lastname ? 'border-red-400' : 'border-andes-forest/10'}`}
                        />
                        {fieldErrors.lastname && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastname}</p>}
                      </div>
                    </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5">
                              <Mail className="w-3.5 h-3.5 inline text-andes-gold mr-1" /> Correo *
                            </label>
                            <input
                              type="email"
                              placeholder="correo@ejemplo.com"
                              value={form.email}
                              onChange={(e) => { setForm((prev) => ({ ...prev, email: e.target.value })); setFieldErrors((prev) => ({ ...prev, email: '' })); }}
                              required
                              className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all ${fieldErrors.email ? 'border-red-400' : 'border-andes-forest/10'}`}
                            />
                            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5">
                              <Phone className="w-3.5 h-3.5 inline text-andes-gold mr-1" /> Teléfono
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={form.phoneCode}
                                onChange={(e) => setForm((prev) => ({ ...prev, phoneCode: e.target.value }))}
                                className="w-[110px] shrink-0 px-2 py-2.5 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
                              >
                                {COUNTRY_CODES.map((c) => (
                                  <option key={c.code} value={c.code}>{c.code}</option>
                                ))}
                              </select>
                              <input
                                type="tel"
                                placeholder="Número telefónico"
                                value={form.phone}
                                onChange={(e) => { setForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '') })); setFieldErrors((prev) => ({ ...prev, phone: '' })); }}
                                className={`flex-1 px-3 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all ${fieldErrors.phone ? 'border-red-400' : 'border-andes-forest/10'}`}
                              />
                            </div>
                            {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                            <p className="text-xs text-andes-slate mt-1">Ej: {form.phoneCode}4121234567</p>
                          </div>
                        </div>
                  </div>

                  <button
                    type="submit"
                    disabled={ui.isSubmitting}
                    className="w-full py-3 mt-4 bg-andes-gold hover:bg-andes-goldHover disabled:bg-andes-gold/60 text-white text-sm font-semibold rounded-xl tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    {ui.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Confirmar Pre-Reserva'
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-andes-gold mb-4 animate-bounce" />
                  <h4 className="text-2xl font-serif text-andes-forest mb-2">¡Pre-Reserva Registrada!</h4>
                  <p className="text-sm text-andes-slate max-w-sm mb-6 leading-relaxed">
                    Hola <strong>{form.name}</strong>, hemos registrado tu interés para{' '}
                    <strong>{ui.submittedData?.customer?.name || selectedPkg?.name}</strong>.
                  </p>
                  <div className="bg-white p-4 rounded-xl border border-andes-forest/5 text-xs text-left w-full space-y-1 text-andes-slate mb-6">
                    {ui.submittedData && (
                      <>
                        <p><strong>Reserva #:</strong> {ui.submittedData.reservation.id_reservation}</p>
                        <p><strong>Cliente:</strong> {ui.submittedData.customer.name} {ui.submittedData.customer.lastname || ''}</p>
                        <p><strong>Correo:</strong> {ui.submittedData.customer.email}</p>
                        <p><strong>Estado:</strong> Pendiente de confirmación</p>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-andes-gold font-medium mb-6">
                    Te notificaremos por correo electrónico cuando tu reserva sea validada.
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
