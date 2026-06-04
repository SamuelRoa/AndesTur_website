import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CreditCard, Loader2, AlertCircle, Search } from 'lucide-react';
import { queryReservations } from '../services/api';

export default function QueryModal({ isOpen, onClose, onResults }) {
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setDni('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !dni) {
      setError('Completa todos los campos');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo válido');
      return;
    }

    if (dni.trim().length < 5) {
      setError('La cédula debe tener al menos 5 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const result = await queryReservations(email, dni);
      resetForm();
      onResults({ email, dni, data: result.data });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-andes-forest/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-andes-bone border border-andes-forest/10 rounded-2xl shadow-xl overflow-hidden z-10"
          >
            <div className="p-6 border-b border-andes-forest/5 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-andes-gold" />
                <div>
                  <h3 className="text-xl font-serif text-andes-forest">
                    Consultar Reservas
                  </h3>
                  <p className="text-xs text-andes-slate mt-0.5">
                    Ingresa tus datos para ver tus reservas
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-andes-forest/5 text-andes-forest/60 hover:text-andes-forest transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5">
                    <Mail className="w-3.5 h-3.5 inline text-andes-gold mr-1" /> Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-andes-forest uppercase tracking-wider mb-1.5">
                    <CreditCard className="w-3.5 h-3.5 inline text-andes-gold mr-1" /> Cédula / DNI *
                  </label>
                  <input
                    type="text"
                    placeholder="12345678"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-andes-forest/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-andes-gold/30 focus:border-andes-gold text-andes-forest transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-andes-gold hover:bg-andes-goldHover disabled:bg-andes-gold/60 text-white text-sm font-semibold rounded-xl tracking-wide shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Buscar Reservas
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
