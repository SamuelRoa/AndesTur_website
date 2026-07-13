import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, MapPin, CheckCircle, Mail, Phone, User, CreditCard, Loader2, AlertCircle, ArrowLeft, DollarSign, Shield, Hourglass } from 'lucide-react';
import { createPreReservation, getPackages, payAfterPreReservation } from '../services/api';

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

const PAYMENT_METHODS = [
  { value: 'card', label: 'Tarjeta de crédito/débito', icon: CreditCard },
  { value: 'paypal', label: 'PayPal', icon: CreditCard },
];

const INITIAL_FORM = { dni: '', name: '', lastname: '', email: '', phone: '', phoneCode: '+58', date: '', people: '2', selectedPackageId: '' };

export default function ReservationModal({ isOpen, onClose, defaultDestination = "" }) {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [ui, setUi] = useState({ isSubmitting: false, submitError: '', isSubmitted: false, submittedData: null });
  const [fieldErrors, setFieldErrors] = useState({});

  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptRef, setReceiptRef] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    zelleIdentifier: '',
    transferReference: '',
    bankName: '',
    phoneNumber: '',
    bankOperator: '',
  });
  const [paymentState, setPaymentState] = useState({ loading: false, error: '', result: null });

  // PayPal simulation
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [payPalForm, setPayPalForm] = useState({ email: '', password: '' });
  const [payPalErrors, setPayPalErrors] = useState({});
  const [payPalProcessing, setPayPalProcessing] = useState(false);

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
      setShowPayment(false);
      setPaymentState({ loading: false, error: '', result: null });
      setReceiptFile(null);
      setReceiptRef('');
      setPaymentForm({
        cardNumber: '',
        expiry: '',
        cvv: '',
        zelleIdentifier: '',
        transferReference: '',
        bankName: '',
        phoneNumber: '',
        bankOperator: '',
      });
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

  const handlePayPalApiCall = async () => {
    setPaymentState((prev) => ({ ...prev, loading: true, error: '', result: null }));
    try {
      const payload = { payment_method: 'paypal' };
      const result = await payAfterPreReservation(
        ui.submittedData.reservation.id_reservation,
        payload,
        null,
      );
      setPaymentState({ loading: false, error: '', result: result.data });
    } catch (err) {
      setPaymentState({ loading: false, error: err.message, result: null });
    }
  };

  const handlePayPalSubmit = async () => {
    const errors = {};
    if (!payPalForm.email) errors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payPalForm.email)) errors.email = 'Formato de correo inválido';
    if (!payPalForm.password) errors.password = 'La contraseña es obligatoria';
    else if (payPalForm.password.length < 4) errors.password = 'Mínimo 4 caracteres';
    setPayPalErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setPayPalProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPayPalProcessing(false);
    setShowPayPalModal(false);
    setPayPalForm({ email: '', password: '' });
    setPayPalErrors({});
    handlePayPalApiCall();
  };

  const handlePaymentSubmit = async () => {
    if (!ui.submittedData?.reservation?.id_reservation) return;

    if (paymentMethod === 'paypal') {
      setShowPayPalModal(true);
      return;
    }

    setPaymentState((prev) => ({ ...prev, loading: true, error: '', result: null }));
    try {
      const payload = {
        payment_method: paymentMethod,
        ...paymentForm,
      };
      const result = await payAfterPreReservation(
        ui.submittedData.reservation.id_reservation,
        payload,
        null,
      );
      setPaymentState({ loading: false, error: '', result: result.data });
    } catch (err) {
      setPaymentState({ loading: false, error: err.message, result: null });
    }
  };

  const selectedPkg = packages.find((p) => String(p.id_package) === form.selectedPackageId);

  const paymentStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {!paymentState.result && (
          <button
            type="button"
            onClick={() => { setShowPayment(false); setPaymentState({ loading: false, error: '', result: null }); }}
            className="p-1.5 rounded-full hover:bg-andes-forest/5 text-andes-slate/60 hover:text-andes-forest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-andes-gold" />
          <h4 className="text-sm font-semibold text-andes-forest uppercase tracking-wider">Pagar ahora</h4>
        </div>
      </div>

      <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-xl p-4 space-y-2 text-sm border border-black/[0.04] dark:border-white/[0.05]">
        <div className="flex justify-between text-andes-slate/70 dark:text-white/60">
          <span>Paquete</span>
          <span className="font-medium text-andes-forest dark:text-white">{selectedPkg?.name || '—'}</span>
        </div>
        <div className="flex justify-between text-andes-slate/70 dark:text-white/60">
          <span>Reserva</span>
          <span className="font-medium text-andes-forest dark:text-white">#{ui.submittedData?.reservation?.id_reservation}</span>
        </div>
        <div className="flex justify-between text-andes-slate/70 dark:text-white/60 border-t border-black/[0.04] dark:border-white/[0.06] pt-2 mt-2">
          <span className="text-andes-forest dark:text-white font-medium">Total</span>
          <span className="font-bold text-lg">${Number(selectedPkg?.price || 0).toLocaleString()}</span>
        </div>
      </div>

      {!paymentState.result ? (
        <>
          <div>
            <label className="block text-[10px] font-semibold text-andes-slate/50 dark:text-white/50 uppercase tracking-wider mb-3">
              Método de pago
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const isActive = paymentMethod === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-3.5 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'border-andes-gold bg-andes-gold/5 ring-1 ring-andes-gold/30'
                        : 'border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.15] dark:hover:border-white/[0.15] bg-white dark:bg-white/[0.04]'
                    }`}
                  >
                    {method.value === 'card' ? (
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="w-8 h-5 inline-flex items-center justify-center"><img src="/Visa_Inc._logo.png" alt="Visa" className="w-full h-full object-contain" /></span>
                        <span className="w-8 h-5 inline-flex items-center justify-center"><img src="/Mastercard-logo.png" alt="Mastercard" className="w-full h-full object-contain" /></span>
                        <span className="w-8 h-5 inline-flex items-center justify-center"><img src="/AMEX.webp" alt="AmEx" className="w-full h-full object-contain" /></span>
                      </div>
                    ) : (
                      <span className="w-8 h-5 inline-flex items-center justify-center mx-auto mb-1"><img src="/PayPal_Logo.png" alt="PayPal" className="w-full h-full object-contain" /></span>
                    )}
                    <p className="text-[11px] font-medium text-andes-forest dark:text-white/80">{method.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-andes-slate/50 dark:text-white/50 uppercase tracking-wider mb-1.5">Número de tarjeta</label>
                <input
                  value={paymentForm.cardNumber}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, cardNumber: e.target.value }))}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest"
                  placeholder="4111 1111 1111 1111"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-andes-slate/50 dark:text-white/50 uppercase tracking-wider mb-1.5">Vencimiento</label>
                  <input
                    value={paymentForm.expiry}
                    onChange={(e) => setPaymentForm((p) => ({ ...p, expiry: e.target.value }))}
                    className="w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest"
                    placeholder="12/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-andes-slate/50 dark:text-white/50 uppercase tracking-wider mb-1.5">CVV</label>
                  <input
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm((p) => ({ ...p, cvv: e.target.value }))}
                    className="w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest"
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-8 h-5 inline-flex items-center justify-center"><img src="/Visa_Inc._logo.png" alt="Visa" className="w-full h-full object-contain opacity-40" /></span>
                <span className="w-8 h-5 inline-flex items-center justify-center"><img src="/Mastercard-logo.png" alt="Mastercard" className="w-full h-full object-contain opacity-40" /></span>
                <span className="w-8 h-5 inline-flex items-center justify-center"><img src="/AMEX.webp" alt="AmEx" className="w-full h-full object-contain opacity-40" /></span>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="text-center py-6 space-y-4">
              <span className="w-16 h-10 inline-flex items-center justify-center mx-auto">
                <img src="/PayPal_Logo.png" alt="PayPal" className="w-full h-full object-contain" />
              </span>
              <p className="text-sm text-andes-slate/60 dark:text-white/50 font-light">
                Serás redirigido a PayPal para completar el pago de forma segura.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handlePaymentSubmit}
            disabled={paymentState.loading}
            className="w-full py-3 btn-premium text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {paymentState.loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
            ) : (
              <><Shield className="w-4 h-4" /> Pagar ${Number(selectedPkg?.price || 0).toLocaleString()}</>
            )}
          </button>

          {paymentState.error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {paymentState.error}
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-3"
        >
          {paymentState.result.payment?.status === "approved" ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-12 h-12 rounded-full bg-black/[0.03] dark:bg-white/[0.05] flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-andes-forest dark:text-white/80" />
              </div>
              <h4 className="text-base font-serif text-andes-forest dark:text-white">Pago confirmado</h4>
              <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-xl p-3 text-xs text-andes-slate/70 dark:text-white/60 space-y-1 border border-black/[0.04] dark:border-white/[0.05]">
                <p>Referencia: <span className="text-andes-forest dark:text-white font-medium">{paymentState.result.payment?.reference}</span></p>
                <p>Reserva # {paymentState.result.reservation?.id_reservation}</p>
              </div>
            </div>
          ) : paymentState.result.payment?.status === "pending_verification" ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-12 h-12 rounded-full bg-black/[0.03] dark:bg-white/[0.05] flex items-center justify-center mx-auto">
                <Hourglass className="w-6 h-6 text-andes-forest dark:text-white/60" />
              </div>
              <h4 className="text-base font-serif text-andes-forest dark:text-white">Solicitud enviada</h4>
              <p className="text-sm text-andes-slate/60 dark:text-white/50 max-w-xs mx-auto font-light">
                Recibimos tu solicitud. Te notificaremos por correo cuando se confirme.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h4 className="text-base font-serif text-red-600 dark:text-red-400">Pago rechazado</h4>
              <p className="text-sm text-andes-slate/60 dark:text-white/50 font-light">{paymentState.result?.payment?.status === "rejected" ? "Los datos ingresados no fueron válidos." : paymentState.error}</p>
              <button
                type="button"
                onClick={() => setPaymentState({ loading: false, error: '', result: null })}
                className="px-5 py-2 border border-black/[0.08] dark:border-white/[0.12] text-andes-slate dark:text-white/70 text-xs font-medium rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.05] transition-all"
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={showPayment ? undefined : onClose}
            className="fixed inset-0 overlay-glass"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg glass-card gold-edge rounded-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-andes-forest/5 flex items-center justify-between glass-header">
              <div>
                <h3 className="text-2xl font-serif text-andes-forest">
                  {showPayment ? "Pago en línea" : "Reserva tu Aventura"}
                </h3>
                <p className="text-xs text-andes-slate mt-1">
                  {showPayment ? "Selecciona tu método de pago" : "Completa los detalles para planificar tu ruta andina."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-andes-forest/5 text-andes-forest/60 hover:text-andes-forest transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 glass-form rounded-b-2xl">
              {!ui.isSubmitted && !showPayment ? (
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
                      className="w-full px-3 py-2.5 glass-select rounded-xl text-sm text-andes-forest"
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
                        className={`w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest ${fieldErrors.date ? '!border-red-400' : ''}`}
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
                        className="w-full px-3 py-2.5 glass-select rounded-xl text-sm text-andes-forest"
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

                  <hr className="glass-divider my-4" />

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
                        className={`w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest ${fieldErrors.name ? '!border-red-400' : ''}`}
                      />
                      {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className={`w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest ${fieldErrors.lastname ? '!border-red-400' : ''}`}
                        />
                        {fieldErrors.lastname && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastname}</p>}
                      </div>
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
                          className={`w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest ${fieldErrors.dni ? '!border-red-400' : ''}`}
                        />
                        {fieldErrors.dni && <p className="text-xs text-red-500 mt-1">{fieldErrors.dni}</p>}
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
                          className={`w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest ${fieldErrors.email ? '!border-red-400' : ''}`}
                        />
                        {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5">
                          <Phone className="w-3.5 h-3.5 inline text-andes-gold mr-1" /> Teléfono
                        </label>
                        <div className={`flex w-full glass-input rounded-xl overflow-hidden ${fieldErrors.phone ? '!border-red-400' : ''}`}>
                          <select
                            value={form.phoneCode}
                            onChange={(e) => setForm((prev) => ({ ...prev, phoneCode: e.target.value }))}
                            className="w-[100px] sm:w-[110px] shrink-0 px-2 py-2.5 !bg-transparent text-sm focus:outline-none text-andes-forest border-r border-white/20"
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
                            className="flex-1 px-3 py-2.5 bg-transparent text-sm focus:outline-none text-andes-forest placeholder:text-andes-forest/40"
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
                    className="w-full py-3 mt-4 btn-premium disabled:opacity-60 disabled:pointer-events-none text-white text-sm font-semibold rounded-xl tracking-wide flex items-center justify-center gap-2"
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
              ) : !showPayment ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-black/[0.03] dark:bg-white/[0.05] flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-andes-forest dark:text-white/80" />
                    </div>
                    <h4 className="text-lg font-serif text-andes-forest dark:text-white">Pre-reserva registrada</h4>
                    <p className="text-sm text-andes-slate/60 dark:text-white/50 mt-1">
                      Hola {form.name}, los datos de tu reserva están listos.
                    </p>
                  </div>

                  <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-xl p-4 space-y-1.5 text-sm border border-black/[0.04] dark:border-white/[0.05]">
                    {ui.submittedData && (
                      <>
                        <div className="flex justify-between text-andes-slate/70 dark:text-white/60">
                          <span>Reserva</span>
                          <span className="font-medium text-andes-forest dark:text-white">#{ui.submittedData.reservation.id_reservation}</span>
                        </div>
                        <div className="flex justify-between text-andes-slate/70 dark:text-white/60">
                          <span>Cliente</span>
                          <span className="text-andes-forest dark:text-white">{ui.submittedData.customer.name} {ui.submittedData.customer.lastname || ''}</span>
                        </div>
                        <div className="flex justify-between text-andes-slate/70 dark:text-white/60">
                          <span>Correo</span>
                          <span className="text-andes-forest dark:text-white">{ui.submittedData.customer.email}</span>
                        </div>
                        <div className="flex justify-between text-andes-slate/70 dark:text-white/60 border-t border-black/[0.04] dark:border-white/[0.06] pt-1.5 mt-1.5">
                          <span className="text-andes-forest dark:text-white font-medium">Total</span>
                          <span className="font-semibold">${Number(selectedPkg?.price || 0).toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="w-full py-3 btn-premium text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Pagar ahora — ${Number(selectedPkg?.price || 0).toLocaleString()}
                  </button>

                  <div className="flex items-center gap-3">
                    <hr className="flex-1 border-black/[0.06] dark:border-white/[0.08]" />
                    <span className="text-[10px] text-andes-slate/40 dark:text-white/30 uppercase tracking-wider">o</span>
                    <hr className="flex-1 border-black/[0.06] dark:border-white/[0.08]" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`https://wa.me/584247699792?text=${encodeURIComponent(`Hola, soy ${form.name} ${form.lastname}. Acabo de hacer una pre-reserva en AndesTur (DNI: ${form.dni}, Reserva #${ui.submittedData?.reservation?.id_reservation || 'Pendiente'}).`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 border border-black/[0.08] dark:border-white/[0.12] text-andes-slate dark:text-white/70 text-xs font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-black/[0.02] dark:hover:bg-white/[0.05] transition-all"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Pagar después por WhatsApp
                    </a>
                    <p className="text-[10px] text-andes-slate/40 dark:text-white/30 text-center">
                      También puedes pagar desde <span className="font-medium text-andes-slate/60 dark:text-white/50">Consultar Reservas</span>
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-2.5 text-xs font-medium text-andes-slate/50 dark:text-white/40 hover:text-andes-slate dark:hover:text-white/70 transition-colors"
                  >
                    Cerrar
                  </button>
                </motion.div>
              ) : (
                paymentStep()
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

      {/* PayPal Simulation Modal */}
      <AnimatePresence>
        {showPayPalModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => { if (!payPalProcessing) { setShowPayPalModal(false); setPayPalErrors({}); } }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-sm glass-card rounded-2xl overflow-hidden z-10"
            >
              {payPalProcessing ? (
                <div className="p-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-andes-gold/10 flex items-center justify-center mx-auto">
                    <Loader2 className="w-6 h-6 text-andes-gold animate-spin" />
                  </div>
                  <p className="text-sm font-medium text-andes-forest dark:text-white">Procesando pago con PayPal...</p>
                  <p className="text-xs text-andes-slate/50 dark:text-white/40">Por favor espera, estamos conectando con PayPal.</p>
                </div>
              ) : (
                <div className="p-6 space-y-5">
                  <div className="text-center space-y-2">
                    <span className="w-14 h-9 inline-flex items-center justify-center mx-auto">
                      <img src="/PayPal_Logo.png" alt="PayPal" className="w-full h-full object-contain" />
                    </span>
                    <p className="text-xs text-andes-slate/50 dark:text-white/40">Inicia sesión para completar el pago</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-andes-slate/50 dark:text-white/50 uppercase tracking-wider mb-1">Correo electrónico</label>
                      <input
                        type="email"
                        value={payPalForm.email}
                        onChange={(e) => { setPayPalForm((p) => ({ ...p, email: e.target.value })); setPayPalErrors((p) => ({ ...p, email: '' })); }}
                        className={`w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest ${payPalErrors.email ? '!border-red-400' : ''}`}
                        placeholder="correo@ejemplo.com"
                      />
                      {payPalErrors.email && <p className="text-xs text-red-500 mt-1">{payPalErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-andes-slate/50 dark:text-white/50 uppercase tracking-wider mb-1">Contraseña</label>
                      <input
                        type="password"
                        value={payPalForm.password}
                        onChange={(e) => { setPayPalForm((p) => ({ ...p, password: e.target.value })); setPayPalErrors((p) => ({ ...p, password: '' })); }}
                        className={`w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest ${payPalErrors.password ? '!border-red-400' : ''}`}
                        placeholder="••••••••"
                      />
                      {payPalErrors.password && <p className="text-xs text-red-500 mt-1">{payPalErrors.password}</p>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePayPalSubmit}
                    className="w-full py-3 btn-premium text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    Iniciar Sesión y Pagar
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowPayPalModal(false); setPayPalErrors({}); }}
                    className="w-full py-2 text-xs text-andes-slate/50 dark:text-white/40 hover:text-andes-slate dark:hover:text-white/70 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
