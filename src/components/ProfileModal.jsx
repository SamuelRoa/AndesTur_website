import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  User,
  Mail,
  Calendar,
  MapPin,
  Users,
  Phone,
  CreditCard,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Hourglass,
  XCircle,
  AlertTriangle,
  Info,
  FileText,
  Search,
  DollarSign,
  Shield,
  History,
  Ban,
} from "lucide-react";
import {
  getPackages,
  initiatePayment,
  getPaymentSummary,
} from "../services/api";

const STATUS_CONFIG = {
  pending: {
    icon: Hourglass,
    bg: "bg-yellow-100 text-yellow-600 dark:bg-yellow-200/10 dark:text-yellow-300",
    label: "Pendiente",
    desc: "Esperando pago para confirmar la reserva",
  },
  partial: {
    icon: Info,
    bg: "bg-blue-100 text-blue-600 dark:bg-blue-200/10 dark:text-blue-300",
    label: "Pago parcial",
    desc: "Se ha recibido un pago parcial",
  },
  paid: {
    icon: CheckCircle2,
    bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-200/10 dark:text-emerald-300",
    label: "Aprobada",
    desc: "Reserva confirmada y pagada",
  },
  cancelled: {
    icon: XCircle,
    bg: "bg-red-100 text-red-600 dark:bg-red-200/10 dark:text-red-300",
    label: "Cancelada",
    desc: "La reserva ha sido cancelada",
  },
  expired: {
    icon: AlertTriangle,
    bg: "bg-orange-100 text-orange-600 dark:bg-orange-200/10 dark:text-orange-300",
    label: "Expirada",
    desc: "El plazo de la reserva ha expirado",
  },
  rejected: {
    icon: Ban,
    bg: "bg-red-100 text-red-600 dark:bg-red-200/10 dark:text-red-300",
    label: "Rechazada",
    desc: "La reserva fue rechazada",
  },
};

const PAYMENT_METHOD_LABELS = {
  card: { icon: CreditCard, label: "Tarjeta", color: "text-blue-600" },
  paypal: { icon: CreditCard, label: "PayPal", color: "text-blue-700" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PAYMENT_METHODS = [
  { value: "card", label: "Tarjeta de crédito", icon: CreditCard },
  { value: "paypal", label: "PayPal", icon: CreditCard },
];

function PaymentHistory({ details }) {
  if (!details || details.length === 0) return null;
  return (
    <div className="bg-muted/50 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-1.5">
        <History className="w-3.5 h-3.5 text-andes-gold" />
        <span className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider">
          Historial de pagos
        </span>
      </div>
      {details.map((d) => {
        const methodConfig = PAYMENT_METHOD_LABELS[d.pay_method] || PAYMENT_METHOD_LABELS.card;
        const Icon = methodConfig.icon;
        return (
          <div key={d.id_payment_detail} className="flex items-center justify-between text-xs py-1.5 border-b border-andes-forest/5 last:border-0">
            <div className="flex items-center gap-1.5">
              <Icon className={`w-3.5 h-3.5 ${methodConfig.color}`} />
              <span className="text-andes-slate">{methodConfig.label}</span>
              {d.reference && (
                <span className="text-andes-slate/50 font-mono text-[10px]">#{d.reference}</span>
              )}
            </div>
            <span className="font-medium text-andes-forest">
              ${Number(d.amount_paid).toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ReservationCard({ reservation, packages, isExpanded, onToggle }) {
  const cfg = STATUS_CONFIG[reservation.pay_state] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const pkg = packages.find((p) => p.id_package === reservation.id_package);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    zelleIdentifier: "",
    transferReference: "",
    bankName: "",
    phoneNumber: "",
    bankOperator: "",
  });
  const [paymentState, setPaymentState] = useState({
    loading: false,
    error: "",
    result: null,
  });
  const [cardFieldErrors, setCardFieldErrors] = useState({});
  const [paymentDetails, setPaymentDetails] = useState([]);

  // PayPal simulation
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [payPalForm, setPayPalForm] = useState({ email: '', password: '' });
  const [payPalErrors, setPayPalErrors] = useState({});
  const [payPalProcessing, setPayPalProcessing] = useState(false);

  const canPay = ["pending", "partial"].includes(reservation.pay_state);

  const handlePayPalApiCall = async () => {
    setPaymentState((prev) => ({ ...prev, loading: true, error: "", result: null }));
    try {
      const payload = {
        id_reservation: reservation.id_reservation,
        amount: Number(pkg?.price || 0),
        payment_method: "paypal",
      };
      const result = await initiatePayment(payload);
      setPaymentState({ loading: false, error: "", result: result.data });
      if (result.data?.payment?.status === "approved") {
        try {
          const summary = await getPaymentSummary(reservation.id_reservation);
          if (summary?.data?.details) {
            setPaymentDetails(summary.data.details);
          }
        } catch (_) {}
      }
    } catch (err) {
      setPaymentState({ loading: false, error: err.message, result: null });
    }
  };

  const handlePayPalSubmit = async () => {
    const errors = {};
    if (!payPalForm.email) errors.email = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payPalForm.email)) errors.email = "Formato de correo inválido";
    if (!payPalForm.password) errors.password = "La contraseña es obligatoria";
    else if (payPalForm.password.length < 4) errors.password = "Mínimo 4 caracteres";
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

  const handlePayment = async () => {
    setCardFieldErrors({});

    if (paymentMethod === "paypal") {
      setShowPayPalModal(true);
      return;
    }

    const cardErrors = {};
    if (!form.cardNumber) cardErrors.cardNumber = 'El número de tarjeta es obligatorio';
    else if (form.cardNumber.replace(/\s/g, '').length < 13) cardErrors.cardNumber = 'Número inválido';
    if (!form.expiry) cardErrors.expiry = 'La fecha es obligatoria';
    else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) cardErrors.expiry = 'Formato MM/AA';
    if (!form.cvv) cardErrors.cvv = 'El CVV es obligatorio';
    else if (!/^\d{3,4}$/.test(form.cvv)) cardErrors.cvv = 'CVV inválido';
    if (Object.keys(cardErrors).length > 0) {
      setCardFieldErrors(cardErrors);
      return;
    }

    setPaymentState((prev) => ({
      ...prev,
      loading: true,
      error: "",
      result: null,
    }));
    try {
      const payload = {
        id_reservation: reservation.id_reservation,
        amount: Number(pkg?.price || 0),
        payment_method: paymentMethod,
        ...form,
      };
      const result = await initiatePayment(payload);
      setPaymentState({ loading: false, error: "", result: result.data });
      if (result.data?.payment?.status === "approved") {
        try {
          const summary = await getPaymentSummary(reservation.id_reservation);
          if (summary?.data?.details) {
            setPaymentDetails(summary.data.details);
          }
        } catch (_) {}
      }
    } catch (err) {
      setPaymentState({ loading: false, error: err.message, result: null });
    }
  };

  const loadPaymentDetails = useCallback(async () => {
    try {
      const summary = await getPaymentSummary(reservation.id_reservation);
      if (summary?.data?.details) {
        setPaymentDetails(summary.data.details);
      }
    } catch (_) {}
  }, [reservation.id_reservation]);

  useEffect(() => {
    if (isExpanded) {
      loadPaymentDetails();
    }
  }, [isExpanded, loadPaymentDetails]);

  return (
    <>
    <div className="bg-white rounded-xl border border-andes-forest/5 overflow-hidden transition-all">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-andes-forest/[0.02] transition-colors"
      >
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${cfg.bg} shrink-0`}
        >
          <Icon className="w-5 h-5" />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-andes-forest">
              {reservation.packageName ||
                pkg?.name ||
                `Reserva #${reservation.id_reservation}`}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg}`}
            >
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-andes-slate/60 mt-0.5">
            #{reservation.id_reservation} ·{" "}
            {formatDate(reservation.created_at || reservation.createdAt)}
          </p>
        </div>

        <div className="text-andes-slate/40 shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {isExpanded && (
          <div
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-andes-forest/5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-andes-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider">
                      Paquete
                    </p>
                    <p className="text-sm text-andes-forest">
                      {reservation.packageName || pkg?.name || "—"}
                    </p>
                    {pkg?.description && (
                      <p className="text-xs text-andes-slate/70 mt-0.5 line-clamp-2">
                        {pkg.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-andes-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider">
                      Fechas
                    </p>
                    {reservation.date && (
                      <p className="text-sm text-andes-forest">
                        Viaje: {formatDate(reservation.date)}
                      </p>
                    )}
                    {pkg?.departure_date && (
                      <p className="text-xs text-andes-slate/70">
                        {formatDate(pkg.departure_date)} →{" "}
                        {formatDate(pkg.return_date)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-andes-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider">
                      Viajeros
                    </p>
                    <p className="text-sm text-andes-forest">
                      {reservation.people
                        ? `${reservation.people} ${reservation.people === "1" ? "persona" : "personas"}`
                        : "No especificado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-andes-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider">
                      Creada
                    </p>
                    <p className="text-sm text-andes-forest">
                      {formatDateTime(
                        reservation.created_at || reservation.createdAt,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-andes-forest/[0.02] rounded-xl p-4 space-y-2.5">
                <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-andes-gold" /> Tus Datos
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-andes-slate">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-andes-slate/40" />
                    <span>
                      {reservation.name} {reservation.lastname || ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-andes-slate/40" />
                    <span className="truncate">{reservation.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-andes-slate/40" />
                    <span>{reservation.dni || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-andes-slate/40" />
                    <span>{reservation.phone_number || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              {paymentDetails.length > 0 && (
                <PaymentHistory details={paymentDetails} />
              )}

              {/* Payment Section */}
              {canPay && (
                <div className="rounded-xl border border-andes-forest/5 bg-white p-4 space-y-3">
                  <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-andes-gold" />
                    Pago en línea
                  </p>

                  <div className="flex items-center justify-between p-3 bg-andes-forest/[0.02] rounded-xl">
                    <span className="text-sm text-andes-slate">Total a pagar:</span>
                    <span className="text-lg font-bold text-andes-gold">
                      ${Number(pkg?.price || 0).toLocaleString()}
                    </span>
                  </div>

                  {!paymentState.result ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        {PAYMENT_METHODS.map((method) => {
                          const isActive = paymentMethod === method.value;
                          return (
                            <button
                              key={method.value}
                              type="button"
                              onClick={() => setPaymentMethod(method.value)}
                              className={`p-2.5 rounded-xl border text-center transition-all ${
                                isActive
                                  ? "border-andes-gold bg-andes-gold/5 ring-1 ring-andes-gold/30"
                                  : "border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.15] dark:hover:border-white/[0.15]"
                              }`}
                            >
                              {method.value === "card" ? (
                                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                                  <span className="w-7 h-4 inline-flex items-center justify-center"><img src="/Visa_Inc._logo.png" alt="Visa" className="w-full h-full object-contain" /></span>
                                  <span className="w-7 h-4 inline-flex items-center justify-center"><img src="/Mastercard-logo.png" alt="Mastercard" className="w-full h-full object-contain" /></span>
                                  <span className="w-7 h-4 inline-flex items-center justify-center"><img src="/AMEX.webp" alt="AmEx" className="w-full h-full object-contain" /></span>
                                </div>
                              ) : (
                                <span className="w-7 h-4 inline-flex items-center justify-center mx-auto mb-1"><img src="/PayPal_Logo.png" alt="PayPal" className="w-full h-full object-contain" /></span>
                              )}
                              <p className="text-[10px] font-medium text-andes-forest dark:text-white/80">{method.label}</p>
                            </button>
                          );
                        })}
                      </div>

                      {paymentMethod === "card" && (
                        <div className="space-y-3">
                          <div>
                            <input
                              value={form.cardNumber}
                              onChange={(e) => {
                                setForm((prev) => ({ ...prev, cardNumber: e.target.value }));
                                setCardFieldErrors((prev) => ({ ...prev, cardNumber: '' }));
                              }}
                              className={`w-full px-3 py-2 glass-input rounded-xl text-sm text-andes-forest ${cardFieldErrors.cardNumber ? '!border-red-400' : ''}`}
                              placeholder="Número de tarjeta"
                            />
                            {cardFieldErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{cardFieldErrors.cardNumber}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <input
                                value={form.expiry}
                                onChange={(e) => {
                                  setForm((prev) => ({ ...prev, expiry: e.target.value }));
                                  setCardFieldErrors((prev) => ({ ...prev, expiry: '' }));
                                }}
                                className={`w-full px-3 py-2 glass-input rounded-xl text-sm text-andes-forest ${cardFieldErrors.expiry ? '!border-red-400' : ''}`}
                                placeholder="MM/AA"
                              />
                              {cardFieldErrors.expiry && <p className="text-xs text-red-500 mt-1">{cardFieldErrors.expiry}</p>}
                            </div>
                            <div>
                              <input
                                value={form.cvv}
                                onChange={(e) => {
                                  setForm((prev) => ({ ...prev, cvv: e.target.value }));
                                  setCardFieldErrors((prev) => ({ ...prev, cvv: '' }));
                                }}
                                className={`w-full px-3 py-2 glass-input rounded-xl text-sm text-andes-forest ${cardFieldErrors.cvv ? '!border-red-400' : ''}`}
                                placeholder="CVV"
                              />
                              {cardFieldErrors.cvv && <p className="text-xs text-red-500 mt-1">{cardFieldErrors.cvv}</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "paypal" && (
                        <div className="text-center py-4 space-y-3">
                          <span className="w-14 h-9 inline-flex items-center justify-center mx-auto">
                            <img src="/PayPal_Logo.png" alt="PayPal" className="w-full h-full object-contain" />
                          </span>
                          <p className="text-xs text-andes-slate/60 dark:text-white/50 font-light">
                            Serás redirigido a PayPal para completar el pago.
                          </p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handlePayment}
                        disabled={paymentState.loading}
                        className="w-full py-2.5 btn-premium text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {paymentState.loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <><Shield className="w-4 h-4" /> Pagar ${Number(pkg?.price || 0).toLocaleString()}</>
                        )}
                      </button>

                      {paymentState.error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          {paymentState.error}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-3">
                      {paymentState.result.payment?.status === "approved" ? (
                        <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-xl p-4 text-center border border-black/[0.04] dark:border-white/[0.05]">
                          <CheckCircle2 className="w-6 h-6 text-andes-forest dark:text-white/80 mx-auto mb-2" />
                          <p className="text-sm font-medium text-andes-forest dark:text-white">Pago aprobado</p>
                          <p className="text-xs text-andes-slate/50 dark:text-white/40 mt-1">Ref: {paymentState.result.payment?.reference}</p>
                        </div>
                      ) : paymentState.result.payment?.status === "pending_verification" ? (
                        <div className="bg-black/[0.02] dark:bg-white/[0.03] rounded-xl p-4 text-center border border-black/[0.04] dark:border-white/[0.05]">
                          <Hourglass className="w-6 h-6 text-andes-forest dark:text-white/60 mx-auto mb-2" />
                          <p className="text-sm font-medium text-andes-forest dark:text-white">Solicitud enviada</p>
                          <p className="text-xs text-andes-slate/50 dark:text-white/40 mt-1">La agencia verificará y confirmará tu reserva.</p>
                        </div>
                      ) : (
                        <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4 text-center border border-red-100 dark:border-red-900/30">
                          <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                          <p className="text-sm font-medium text-red-600 dark:text-red-400">Pago rechazado</p>
                          <p className="text-xs text-red-500/70 dark:text-red-400/70 mt-1">
                            {paymentState.result.payment?.status === "rejected"
                              ? "Los datos ingresados no fueron válidos"
                              : "Error al procesar el pago"}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setPaymentState({ loading: false, error: "", result: null })
                            }
                            className="mt-3 px-4 py-1.5 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                          >
                            Intentar de nuevo
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!canPay && (
                <div className="flex items-center gap-2 p-3 bg-andes-forest/[0.02] rounded-xl text-xs text-andes-slate/60">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  {reservation.pay_state === "paid"
                    ? "Esta reserva ya está pagada y confirmada."
                    : reservation.pay_state === "cancelled"
                      ? "Esta reserva fue cancelada."
                      : reservation.pay_state === "expired"
                        ? "El plazo para pagar esta reserva ha expirado."
                        : "Esta reserva no está disponible para pago en línea."}
                </div>
              )}

              <div className={`text-xs p-3 rounded-xl ${cfg.bg} bg-opacity-50`}>
                <span className="font-semibold">{cfg.label}:</span> {cfg.desc}
              </div>
            </div>
          </div>
      )}
    </div>

      {/* PayPal Simulation Modal */}
      {showPayPalModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => { if (!payPalProcessing) { setShowPayPalModal(false); setPayPalErrors({}); } }}
            />
            <div
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
            </div>
          </div>
      )}
    </>
  );
}

export default function ReservationResultsModal({
  isOpen,
  onClose,
  queryData,
}) {
  const [reservations, setReservations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [resPackages] = await Promise.allSettled([getPackages()]);
      if (resPackages.status === "fulfilled") {
        setPackages(resPackages.value.data || []);
      }

      const raw = queryData?.data?.reservations || [];
      const mapped = raw.map((r) => ({
        id_reservation: r.id_reservation,
        pay_state: r.pay_state,
        id_package: r.id_package,
        packageName: r.package?.name,
        date: r.reservation_date,
        created_at: r.created_at,
        name: r.customer?.name,
        lastname: r.customer?.lastname,
        email: r.customer?.email,
        dni: r.customer?.dni,
        phone_number: r.customer?.phone_number,
      }));
      setReservations(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [queryData]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setExpandedId(null);
    }
  }, [isOpen, fetchData]);

  const handleNewQuery = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 overlay-glass"
      />

      <div
        className="relative w-full max-w-2xl glass-card gold-edge rounded-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
      >
            <div className="p-6 border-b border-andes-forest/5 flex items-center justify-between glass-header shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-andes-gold/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-andes-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-andes-forest">
                    Mis Reservas
                  </h3>
                  <p className="text-xs text-andes-slate mt-0.5">
                    {queryData?.email
                      ? `Reservas encontradas para ${queryData.email}`
                      : "Resultados de la consulta"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-andes-forest/5 text-andes-forest/60 hover:text-andes-forest transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 glass-form rounded-b-2xl">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-andes-gold" />
                <h4 className="text-sm font-semibold text-andes-forest uppercase tracking-wider">
                  Reservas
                </h4>
                {reservations.length > 0 && (
                  <span className="text-[10px] font-semibold bg-andes-gold/20 text-andes-gold px-2 py-0.5 rounded-full">
                    {reservations.length}
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-andes-gold animate-spin" />
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-andes-slate/20 mx-auto mb-3" />
                  <p className="text-sm text-andes-slate/60">
                    No se encontraron reservas
                  </p>
                  <p className="text-xs text-andes-slate/40 mt-1">
                    Verifica que el correo y la cédula sean correctos
                  </p>
                  <button
                    onClick={handleNewQuery}
                    className="mt-4 px-4 py-2 btn-premium text-white text-xs font-semibold rounded-xl"
                  >
                    Nueva Consulta
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {reservations.map((res) => (
                    <ReservationCard
                      key={res.id_reservation || res.id}
                      reservation={res}
                      packages={packages}
                      isExpanded={expandedId === (res.id_reservation || res.id)}
                      onToggle={() =>
                        setExpandedId((prev) =>
                          prev === (res.id_reservation || res.id)
                            ? null
                            : res.id_reservation || res.id,
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
  );
}
