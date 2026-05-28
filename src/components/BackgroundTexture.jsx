import React from 'react';

export default function BackgroundTexture() {
  return (
    <>
      <div className="grain-overlay" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Soft decorative organic shapes to break flat surfaces */}
        <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-andes-forest/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-andes-gold/5 blur-[100px] pointer-events-none" />
      </div>
    </>
  );
}
