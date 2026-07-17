import { motion } from "framer-motion";

export default function InteractiveCard({ cardNumber = "", expiry = "", cvv = "", cardHolder = "", focusedField = "" }) {
  // Detect card network
  const cleanNumber = cardNumber.replace(/\s+/g, "");
  let brand = "generic";
  let brandLogo = "💳";
  let cardBg = "from-slate-800 to-slate-950 text-white"; // default

  if (cleanNumber.startsWith("4")) {
    brand = "visa";
    brandLogo = "Visa";
    cardBg = "from-[#00579F] via-[#003C71] to-[#001D38] text-white";
  } else if (cleanNumber.startsWith("5")) {
    brand = "mastercard";
    brandLogo = "Mastercard";
    cardBg = "from-[#1F1F1F] via-[#2D2D2D] to-[#FF5F00] text-white";
  } else if (/^(34|37)/.test(cleanNumber)) {
    brand = "amex";
    brandLogo = "AmEx";
    cardBg = "from-[#DFBA6B] via-[#C5A059] to-[#8E6D2F] text-andes-forest font-semibold";
  }

  // Format Card Number for display
  const getDisplayNumber = () => {
    const rawDigits = cardNumber.replace(/\s+/g, "");
    if (brand === "amex") {
      if (!rawDigits) return "•••• •••••• •••••";
      let finalStr = "";
      let digitIdx = 0;
      for (let i = 0; i < 17; i++) {
        if (i === 4 || i === 11) {
          finalStr += " ";
        } else {
          finalStr += rawDigits[digitIdx] ? rawDigits[digitIdx] : "•";
          digitIdx++;
        }
      }
      return finalStr;
    } else {
      if (!rawDigits) return "•••• •••• •••• ••••";
      let finalStr = "";
      for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) finalStr += " ";
        finalStr += rawDigits[i] ? rawDigits[i] : "•";
      }
      return finalStr;
    }
  };

  const isFlipped = focusedField === "cvv";

  return (
    <div className="w-full max-w-[320px] h-[190px] mx-auto mb-6 [perspective:1000px]">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative w-full h-full [transform-style:preserve-3d] select-none pointer-events-none"
      >
        {/* Front of the Card */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br shadow-xl border border-white/10 [backface-visibility:hidden] ${cardBg}`}
        >
          {/* Card Header */}
          <div className="flex justify-between items-center">
            {/* Chip */}
            <div className="w-10 h-7 rounded-md bg-gradient-to-r from-amber-200 to-yellow-400 opacity-80 relative overflow-hidden">
              <div className="absolute inset-x-2 top-0 bottom-0 border-r border-black/10" />
              <div className="absolute inset-y-1.5 left-0 right-0 border-b border-black/10" />
            </div>
            {/* Brand Logo */}
            <span className="font-serif font-bold text-sm tracking-widest bg-white/15 px-2 py-0.5 rounded backdrop-blur-sm">
              {brandLogo}
            </span>
          </div>

          {/* Card Number */}
          <div className="font-mono text-lg tracking-wider text-center mt-4 text-white/95">
            {getDisplayNumber()}
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-end mt-auto text-[10px] uppercase tracking-widest text-white/70">
            <div className="flex-1 mr-2 truncate">
              <p className="text-[8px] text-white/50 mb-0.5">Titular</p>
              <p className="font-medium text-xs truncate text-white">
                {cardHolder.trim() ? cardHolder.toUpperCase() : "TITULAR DE LA TARJETA"}
              </p>
            </div>
            <div className="w-12 shrink-0">
              <p className="text-[8px] text-white/50 mb-0.5">Vence</p>
              <p className="font-medium text-xs text-white">
                {expiry || "MM/YY"}
              </p>
            </div>
          </div>
        </div>

        {/* Back of the Card */}
        <div
          style={{ transform: "rotateY(180deg)" }}
          className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-xl border border-white/10 [backface-visibility:hidden] flex flex-col justify-between py-5"
        >
          {/* Magnetic Strip */}
          <div className="w-full h-10 bg-black/80 mt-2" />

          {/* Signature Strip & CVV */}
          <div className="px-5 mt-4">
            <div className="w-full h-8 bg-white/15 rounded flex items-center justify-end px-3 relative">
              <div className="absolute left-3 right-12 top-0 bottom-0 flex flex-col justify-center space-y-0.5 opacity-30">
                <div className="h-0.5 bg-white/80 w-full" />
                <div className="h-0.5 bg-white/80 w-full" />
                <div className="h-0.5 bg-white/80 w-full" />
              </div>
              <span className="font-mono text-sm font-semibold tracking-wider text-black bg-white px-2 py-0.5 rounded shadow">
                {cvv || "•••"}
              </span>
            </div>
            <p className="text-[7px] text-white/40 text-right mt-1 tracking-wider uppercase">Código CVV</p>
          </div>

          {/* Back Footer */}
          <div className="px-5 mt-auto flex justify-between items-center text-[7px] text-white/40 uppercase tracking-widest">
            <span>AndesTur Simulación</span>
            <span>Seguro SSL 🔒</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
