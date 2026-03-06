const AmbientGlow = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-amber-900/20 blur-[120px]" />
    <div className="absolute -right-20 -bottom-40 h-[500px] w-[500px] rounded-full bg-red-900/15 blur-[100px]" />
    <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-800/10 blur-[80px]" />
  </div>
);

export default AmbientGlow;
