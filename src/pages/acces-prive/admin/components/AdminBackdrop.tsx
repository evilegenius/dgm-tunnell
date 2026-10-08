export default function AdminBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 adm-grid-bg opacity-60" />

      <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#00f0ff]/10 blur-[150px] adm-float" />
      <div
        className="absolute -right-40 top-1/3 h-[26rem] w-[26rem] rounded-full bg-[#8b5cf6]/10 blur-[150px] adm-float"
        style={{ animationDelay: "1.6s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-[#34d399]/10 blur-[150px] adm-float"
        style={{ animationDelay: "3.2s" }}
      />

      <div className="absolute inset-x-0 top-0 h-24 adm-scan bg-gradient-to-b from-transparent via-[#00f0ff]/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,240,255,0.07),transparent_55%)]" />
    </div>
  );
}