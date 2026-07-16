import React from 'react';
import { X, Map, MapPin } from 'lucide-react';

export default function SelectorModal({ isOpen, onClose, onSelectRoute, onSelectDestination }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 overlay-glass"
      />

      <div className="relative w-full max-w-md glass-card gold-edge rounded-2xl overflow-hidden z-10 flex flex-col">
        <div className="p-6 border-b border-andes-forest/5 flex items-center justify-between glass-header">
          <h3 className="text-xl font-serif text-andes-forest dark:text-andes-bone tracking-wide">¿Qué deseas reservar?</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-andes-forest/5 dark:hover:bg-white/10 text-andes-forest/60 dark:text-white/60 hover:text-andes-forest dark:hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 glass-form rounded-b-2xl">
          <button
            onClick={() => {
              onClose();
              onSelectRoute();
            }}
            className="flex items-center gap-4 p-5 rounded-xl border border-white/20 dark:border-white/10 hover:border-andes-gold dark:hover:border-andes-gold hover:shadow-lg transition-all text-left group bg-white/40 dark:bg-white/5 backdrop-blur-sm"
          >
            <div className="w-12 h-12 bg-white/60 dark:bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/30 dark:border-white/10 shadow-sm group-hover:bg-andes-gold/15 dark:group-hover:bg-andes-gold/20 group-hover:border-andes-gold/30 transition-all backdrop-blur-sm">
              <Map className="w-6 h-6 text-andes-forest dark:text-andes-bone group-hover:text-andes-gold transition-colors" />
            </div>
            <div>
              <h4 className="font-semibold text-andes-forest dark:text-andes-bone mb-1 text-sm">Paquete Turístico / Ruta</h4>
              <p className="text-xs text-andes-slate dark:text-andes-bone/70 leading-relaxed">Selecciona uno de nuestros paquetes completos prearmados con alojamiento, guías y traslados.</p>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectDestination();
            }}
            className="flex items-center gap-4 p-5 rounded-xl border border-white/20 dark:border-white/10 hover:border-andes-gold dark:hover:border-andes-gold hover:shadow-lg transition-all text-left group bg-white/40 dark:bg-white/5 backdrop-blur-sm"
          >
            <div className="w-12 h-12 bg-white/60 dark:bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/30 dark:border-white/10 shadow-sm group-hover:bg-andes-gold/15 dark:group-hover:bg-andes-gold/20 group-hover:border-andes-gold/30 transition-all backdrop-blur-sm">
              <MapPin className="w-6 h-6 text-andes-forest dark:text-andes-bone group-hover:text-andes-gold transition-colors" />
            </div>
            <div>
              <h4 className="font-semibold text-andes-forest dark:text-andes-bone mb-1 text-sm">Destino Específico</h4>
              <p className="text-xs text-andes-slate dark:text-andes-bone/70 leading-relaxed">Elige un lugar particular para tu reserva y planifica un viaje a la medida a ese destino.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
