import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, MapPin, CheckCircle, Mail, Phone, User, CreditCard, Loader2, AlertCircle, ArrowLeft, DollarSign, Shield, Banknote, Upload, Building, FileText, Hourglass } from 'lucide-react';
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
  { value: 'card', label: 'Tarjeta de crédito/débito', icon: CreditCard, badge: 'Visa · MC · Amex' },
  { value: 'zelle', label: 'Zelle', icon: Banknote, badge: 'Transferencia USA' },
  { value: 'pago_movil', label: 'Pago Móvil', icon: Phone, badge: 'Bancos Venezuela' },
  { value: 'transfer', label: 'Transferencia', icon: DollarSign, badge: 'Referencia bancaria' },
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
  const fileInputRef = useRef(null);
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

  const handlePaymentSubmit = async () => {
    if (!ui.submittedData?.reservation?.id_reservation) return;
    setPaymentState((prev) => ({ ...prev, loading: true, error: '', result: null }));

    try {
      const payload = {
        payment_method: paymentMethod,
        ...paymentMethod === 'pago_movil' ? { receiptReference: receiptRef || `PM-${Date.now()}` } : {},
        ...paymentForm,
      };
      const result = await payAfterPreReservation(
        ui.submittedData.reservation.id_reservation,
        payload,
        paymentMethod === 'pago_movil' ? receiptFile : null,
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

      <div className="bg-andes-forest/[0.02] rounded-xl p-3 space-y-1 text-sm">
        <div className="flex justify-between text-andes-slate">
          <span>Paquete:</span>
          <span className="font-medium text-andes-forest">{selectedPkg?.name || '—'}</span>
        </div>
        <div className="flex justify-between text-andes-slate">
          <span>Reserva #:</span>
          <span className="font-medium text-andes-forest">{ui.submittedData?.reservation?.id_reservation}</span>
        </div>
        <div className="flex justify-between text-andes-slate border-t border-andes-forest/5 pt-2 mt-2">
          <span className="font-semibold text-andes-forest">Total:</span>
          <span className="font-bold text-andes-gold text-lg">${Number(selectedPkg?.price || 0).toLocaleString()}</span>
        </div>
      </div>

      {!paymentState.result ? (
        <>
          <div>
            <label className="block text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider mb-2">
              Método de pago
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isActive = paymentMethod === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'border-andes-gold bg-andes-gold/10 ring-1 ring-andes-gold'
                        : 'border-andes-forest/10 hover:border-andes-forest/30 bg-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-andes-gold' : 'text-andes-slate/60'}`} />
                    <p className="text-xs font-medium text-andes-forest">{method.label}</p>
                    <p className="text-[10px] text-andes-slate/50 mt-0.5">{method.badge}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider mb-1">Número de tarjeta</label>
                <input
                  value={paymentForm.cardNumber}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, cardNumber: e.target.value }))}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest"
                  placeholder="4111 1111 1111 1111"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider mb-1">Vencimiento</label>
                  <input
                    value={paymentForm.expiry}
                    onChange={(e) => setPaymentForm((p) => ({ ...p, expiry: e.target.value }))}
                    className="w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest"
                    placeholder="12/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider mb-1">CVV</label>
                  <input
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm((p) => ({ ...p, cvv: e.target.value }))}
                    className="w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'zelle' && (
            <div>
              <label className="block text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider mb-1">Correo o teléfono Zelle</label>
              <input
                value={paymentForm.zelleIdentifier}
                onChange={(e) => setPaymentForm((p) => ({ ...p, zelleIdentifier: e.target.value }))}
                className="w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest"
                placeholder="correo@ejemplo.com"
              />
              <p className="text-[10px] text-andes-slate/50 mt-1">Recibirás una solicitud de pago en tu app Zelle</p>
            </div>
          )}

          {paymentMethod === 'pago_movil' && (
            <div className="space-y-4">
              <div className="bg-andes-forest/[0.02] rounded-xl p-4 space-y-2 border border-andes-gold/20">
                <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-andes-gold" />
                  Datos para Pago Móvil
                </p>
                <div className="text-sm text-andes-forest space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-andes-slate/60">Banco:</span>
                    <span className="font-medium">Banesco</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-andes-slate/60">Teléfono:</span>
                    <span className="font-medium">0412-7699792</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-andes-slate/60">Cédula/RIF:</span>
                    <span className="font-medium">V-12345678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-andes-slate/60">Titular:</span>
                    <span className="font-medium">AndesTur C.A.</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-andes-slate/70 bg-andes-gold/5 p-3 rounded-xl border border-andes-gold/10">
                Realiza el pago desde la app de tu banco usando los datos de arriba.
                Luego ingresa la referencia y sube el comprobante.
              </p>

              <div>
                <label className="block text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider mb-1">N° de referencia del pago</label>
                <input
                  value={receiptRef}
                  onChange={(e) => setReceiptRef(e.target.value)}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest"
                  placeholder="Ej: 12345678"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider mb-1">Comprobante (opcional)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-andes-forest/20 rounded-xl p-4 text-center cursor-pointer hover:border-andes-gold/50 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {receiptFile ? (
                    <div className="flex items-center justify-center gap-2 text-andes-gold">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm font-medium">{receiptFile.name}</span>
                    </div>
                  ) : (
                    <div className="text-andes-slate/50">
                      <Upload className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs">Arrastra o haz clic para subir el comprobante</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'transfer' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider mb-1">Referencia de transferencia</label>
                <input
                  value={paymentForm.transferReference}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, transferReference: e.target.value }))}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest"
                  placeholder="TR-001234"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider mb-1">Banco de origen</label>
                <input
                  value={paymentForm.bankName}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, bankName: e.target.value }))}
                  className="w-full px-3 py-2.5 glass-input rounded-xl text-sm text-andes-forest"
                  placeholder="Banesco, Mercantil..."
                />
              </div>
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
            ) : paymentMethod === 'pago_movil' ? (
              <><Upload className="w-4 h-4" /> Enviar solicitud de pago</>
            ) : (
              <><Shield className="w-4 h-4" /> Pagar ${Number(selectedPkg?.price || 0).toLocaleString()}</>
            )}
          </button>

          {paymentState.error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
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
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-emerald-700">¡Pago Exitoso!</h4>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700 space-y-1">
                <p>Referencia: <strong>{paymentState.result.payment?.reference}</strong></p>
                <p>Reserva # {paymentState.result.reservation?.id_reservation}</p>
                <p>Recibirás la factura en tu correo electrónico</p>
              </div>
            </>
          ) : paymentState.result.payment?.status === "pending_verification" ? (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                <Hourglass className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-amber-700">Solicitud Enviada</h4>
              <p className="text-sm text-andes-slate max-w-sm mx-auto">
                Hemos recibido tu solicitud de pago. La agencia verificará el comprobante y confirmará tu reserva pronto.
              </p>
              <p className="text-xs text-andes-slate/60">Te notificaremos por correo electrónico.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-red-700">Pago Rechazado</h4>
              <p className="text-sm text-andes-slate">{paymentState.result?.payment?.status === "rejected" ? "Los datos ingresados no fueron válidos. Intenta de nuevo." : paymentState.error}</p>
              <button
                type="button"
                onClick={() => setPaymentState({ loading: false, error: '', result: null })}
                className="mt-2 px-4 py-2 border border-andes-forest/10 text-andes-forest hover:bg-andes-forest/5 text-xs font-semibold rounded-xl"
              >
                Intentar de nuevo
              </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );

  return (
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

            <div className="p-6 overflow-y-auto flex-1">
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-6 text-center"
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
                        <p><strong>Estado:</strong> Pendiente de pago</p>
                        <p><strong>Total:</strong> ${Number(selectedPkg?.price || 0).toLocaleString()}</p>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPayment(true)}
                    className="w-full py-3 btn-premium text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 mb-3"
                  >
                    <DollarSign className="w-4 h-4" />
                    Pagar ahora — ${Number(selectedPkg?.price || 0).toLocaleString()}
                  </button>

                  <div className="w-full text-center">
                    <a
                      href={`https://wa.me/584247699792?text=${encodeURIComponent(
                        `¡Hola! 🎉 Soy ${form.name} ${form.lastname}. Acabo de hacer una pre-reserva en AndesTur 🏔️ (DNI: ${form.dni}, Reserva #${ui.submittedData?.reservation?.id_reservation || 'Pendiente'}). ¿Podrían confirmarme los detalles? 🙏`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-xl transition-all mb-3 shadow-md hover:shadow-lg w-full"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Pagar después por WhatsApp
                    </a>
                    <br />
                    <p className="text-xs text-andes-slate/60 mb-2">O puedes pagar después desde <strong>"Consultar Reservas"</strong> con tu email y cédula.</p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 border border-andes-forest/10 text-andes-forest hover:bg-andes-forest/5 text-xs font-semibold rounded-xl transition-all"
                    >
                      Cerrar ventana
                    </button>
                  </div>
                </motion.div>
              ) : (
                paymentStep()
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
