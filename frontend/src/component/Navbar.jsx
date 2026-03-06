import Avatar from "./Avatar";
import { cn } from "../libs/utils";
import { Heading } from "./Heading";
import { Container } from "./Container";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { SearchBar } from "./SearchBar";
import { Menu, X } from "lucide-react";

const NAVBAR_ITEM = [
  {
    name: "Home",
    href: "/home",
  },
  {
    name: "Wishlist",
    href: "/list",
  },
];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

const Navbar = () => {
  const user = useSelector((store) => store?.user);
  const isMobile = useIsMobile();

  const [hovered, setHovered] = useState(null);
  const [isScrolled, setIsScrolled] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.nav
      animate={{
        width: isScrolled && !isMobile ? "75%" : "100%",
        y: isScrolled && !isMobile ? 5 : 0,
      }}
      transition={{ duration: 0.4, ease: "linear" }}
      className={cn(
        "fixed inset-x-0 top-0 z-30 m-auto w-full p-4 lg:px-10 lg:py-5",
        isScrolled && [
          "bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)]",
          "backdrop-blur-[40px]",
          "border border-white/[0.18]",
          "shadow-[0_32px_64px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)]",
        ],
        !isScrolled && "bg-transparent",
        isScrolled && !isMobile && "rounded-[40px]",
      )}
    >
      <Container className="justify-between text-white">
        <div className="flex items-center justify-center gap-5">
          <Heading className="cursor-pointer">
            <a href="/home">
              {" "}
              Prompt<span className="text-amber-500">Play</span>
            </a>
          </Heading>
          {user && (
            <div className="hidden items-center md:flex">
              {NAVBAR_ITEM.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="relative px-4 py-3"
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {hovered === index && (
                    <motion.span
                      layoutId="hovered-span"
                      className={`absolute inset-0 -z-10 h-full w-full bg-white/5 text-white ${isScrolled ? "backdrop-blur-xl" : "backdrop-blur-xs"} rounded-[40px] shadow-xl`}
                    />
                  )}
                  <p className="text-sm">{item.name}</p>
                </a>
              ))}
            </div>
          )}
        </div>
        {/* Right section */}
        {user && (
          <div className="flex items-center gap-3 md:gap-5">
            <SearchBar />
            <div className="hidden md:block">
              <Avatar />
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.15] bg-white/10 text-white/70 transition-colors hover:text-white md:hidden"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        )}
      </Container>
      <AnimatePresence>
        {mobileMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="mx-2 mt-3 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]" />
            <div className="flex flex-col gap-1 p-2 pt-3">
              {NAVBAR_ITEM.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center rounded-[16px] px-4 py-3 text-sm text-white/80 transition-colors duration-150 hover:bg-white/[0.08] hover:text-white"
                >
                  {item.name}
                </motion.a>
              ))}
              <div className="my-1 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]" />
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar />
                <div className="flex flex-col">
                  <p className="text-[13px] font-semibold text-white/80">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-white/40">{user?.email}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
