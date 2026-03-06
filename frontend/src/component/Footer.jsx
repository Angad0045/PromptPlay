const Footer = () => {
  return (
    <footer className="relative mt-10 border-t border-white/[0.06] px-6 py-8 text-center">
      {/* Top refraction line */}
      <div className="absolute top-0 right-1/4 left-1/4 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)]" />

      <p className="text-[12px] text-white/25">
        Copyright © 2025{" "}
        <a
          href="https://github.com/Angad0045"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 transition-colors duration-200 hover:text-amber-500/80"
        >
          Angad Patil
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
