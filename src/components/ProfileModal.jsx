import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { getPackages } from '../services/api';

const STATUS_CONFIG = {
  pending: {
    icon: Hourglass,
    bg: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-200/10 dark:text-yellow-300',
    label: 'Pendiente',
    desc: 'Esperando confirmación del operador',
  },
  partial: {
    icon: Info,
    bg: 'bg-blue-100 text-blue-600 dark:bg-blue-200/10 dark:text-blue-300',
    label: 'Pago parcial',
    desc: 'Se ha recibido un pago parcial',
  },
  paid: {
    icon: CheckCircle2,
    bg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-200/10 dark:text-emerald-300',
    label: 'Aprobada',
    desc: 'Reserva confirmada y aprobada',
  },
  cancelled: {
    icon: XCircle,
    bg: 'bg-red-100 text-red-600 dark:bg-red-200/10 dark:text-red-300',
    label: 'Cancelada',
    desc: 'La reserva ha sido cancelada',
  },
  expired: {
    icon: AlertTriangle,
    bg: 'bg-orange-100 text-orange-600 dark:bg-orange-200/10 dark:text-orange-300',
    label: 'Expirada',
    desc: 'El plazo de la reserva ha expirado',
  },
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ReservationCard({ reservation, packages, isExpanded, onToggle }) {
  const cfg = STATUS_CONFIG[reservation.pay_state] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const pkg = packages.find((p) => p.id_package === reservation.id_package);

  return (
    <div className="bg-white rounded-xl border border-andes-forest/5 overflow-hidden transition-all">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-andes-forest/[0.02] transition-colors"
      >
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${cfg.bg} shrink-0`}>
          <Icon className="w-5 h-5" />
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-andes-forest">
              {reservation.packageName || pkg?.name || `Reserva #${reservation.id_reservation}`}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg}`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-andes-slate/60 mt-0.5">
            #{reservation.id_reservation} · {formatDate(reservation.created_at || reservation.createdAt)}
          </p>
        </div>

        <div className="text-andes-slate/40 shrink-0">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-andes-forest/5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-andes-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider">Paquete</p>
                    <p className="text-sm text-andes-forest">{reservation.packageName || pkg?.name || '—'}</p>
                    {pkg?.description && (
                      <p className="text-xs text-andes-slate/70 mt-0.5 line-clamp-2">{pkg.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-andes-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider">Fechas</p>
                    {reservation.date && (
                      <p className="text-sm text-andes-forest">Viaje: {formatDate(reservation.date)}</p>
                    )}
                    {pkg?.departure_date && (
                      <p className="text-xs text-andes-slate/70">
                        {formatDate(pkg.departure_date)} → {formatDate(pkg.return_date)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-andes-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider">Viajeros</p>
                    <p className="text-sm text-andes-forest">
                      {reservation.people
                        ? `${reservation.people} ${reservation.people === '1' ? 'persona' : Number(reservation.people) >= 5 ? 'personas' : 'personas'}`
                        : 'No especificado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-andes-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-andes-slate/60 uppercase tracking-wider">Creada</p>
                    <p className="text-sm text-andes-forest">{formatDateTime(reservation.created_at || reservation.createdAt)}</p>
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
                    <span>{reservation.name} {reservation.lastname || ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-andes-slate/40" />
                    <span className="truncate">{reservation.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-andes-slate/40" />
                    <span>{reservation.dni || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-andes-slate/40" />
                    <span>{reservation.phone_number || '—'}</span>
                  </div>
                </div>
              </div>

              <div className={`text-xs p-3 rounded-xl ${cfg.bg} bg-opacity-50`}>
                <span className="font-semibold">{cfg.label}:</span> {cfg.desc}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ReservationResultsModal({ isOpen, onClose, queryData }) {
  const [reservations, setReservations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [resPackages] = await Promise.allSettled([getPackages()]);
      if (resPackages.status === 'fulfilled') {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 overlay-glass"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl glass-card gold-edge rounded-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-andes-forest/5 flex items-center justify-between glass-header shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-andes-gold/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-andes-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-andes-forest">Mis Reservas</h3>
                  <p className="text-xs text-andes-slate mt-0.5">
                    {queryData?.email ? `Reservas encontradas para ${queryData.email}` : 'Resultados de la consulta'}
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

            <div className="p-6 overflow-y-auto flex-1">
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
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-andes-slate/20 mx-auto mb-3" />
                  <p className="text-sm text-andes-slate/60">No se encontraron reservas</p>
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
                          prev === (res.id_reservation || res.id) ? null : (res.id_reservation || res.id)
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
