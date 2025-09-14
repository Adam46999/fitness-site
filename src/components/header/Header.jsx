import { useEffect, useMemo, useRef, useState, useCallback } from "react";

const NATIVE_LANG = { ar: "العربية", en: "English" };
const LANG_CODE = { ar: "AE", en: "GB" };

export default function Header() {
  // ===== حالات عامة =====
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const [openMenu, setOpenMenu] = useState(false);

  // الصفحة فاتحة دائمًا
  const onLightBg = true;

  // ===== لغة/اتجاه =====
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("site_lang");
      if (saved === "ar" || saved === "en") return saved;
      const nav = navigator.language?.toLowerCase() || "";
      return nav.startsWith("ar") ? "ar" : "en";
    }
    return "ar";
  });
  const [openLang, setOpenLang] = useState(false);

  // refs
  const langBtnRef = useRef(null);
  const langMenuRef = useRef(null);
  const menuBtnRef = useRef(null);
  const menuPanelRef = useRef(null);

  const capsuleRef = useRef(null);
  const linkRefs = useRef({});
  const sliderRef = useRef(null);

  // طبّق dir/lang واحفظ اللغة
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", lang);
    localStorage.setItem("site_lang", lang);
  }, [lang]);

  // قفل تمرير عند فتح المنيو
  useEffect(() => {
    if (!openMenu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [openMenu]);

  // إغلاق عند الضغط خارج/ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setOpenLang(false);
        setOpenMenu(false);
      }
    }
    function onClick(e) {
      if (
        openLang &&
        !langBtnRef.current?.contains(e.target) &&
        !langMenuRef.current?.contains(e.target)
      )
        setOpenLang(false);
      if (
        openMenu &&
        !menuBtnRef.current?.contains(e.target) &&
        !menuPanelRef.current?.contains(e.target)
      )
        setOpenMenu(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openLang, openMenu]);

  // روابط
  const LINKS = useMemo(
    () => [
      { href: "#home", label: { ar: "الرئيسية", en: "Home" }, icon: HomeIcon },
      {
        href: "#classes",
        label: { ar: "الحصص", en: "Classes" },
        icon: DumbbellIcon,
      },
      {
        href: "#trainers",
        label: { ar: "المدربون", en: "Trainers" },
        icon: UserIcon,
      },
      {
        href: "#contact",
        label: { ar: "تواصل", en: "Contact" },
        icon: PhoneIcon,
      },
    ],
    []
  );

  const TX = {
    join: { ar: "انضم الآن", en: "Join Now" },
    openMenu: { ar: "افتح القائمة", en: "Open menu" },
    closeMenu: { ar: "أغلق القائمة", en: "Close menu" },
  };
  const t = (obj) => obj?.[lang] ?? obj?.en ?? "";

  // تمرير + ScrollSpy
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = LINKS.map((l) =>
      l.href.startsWith("#") ? l.href.slice(1) : null
    ).filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(`#${vis[0].target.id}`);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.2, 0.5, 0.8, 1] }
    );
    sections.forEach((sec) => io.observe(sec));
    return () => io.disconnect();
  }, [LINKS]);

  useEffect(() => {
    const applyHash = () => setActive(window.location.hash || "#home");
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const handleLinkClick =
    (href, extra = {}) =>
    (e) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      const id = href.slice(1),
        el = document.getElementById(id);
      setActive(href);
      const prefersReduced = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      )?.matches;
      if (el) {
        el.scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
          block: extra.block || "start",
        });
        history.pushState(null, "", href);
      } else {
        window.location.hash = href;
      }
      setOpenMenu(false);
    };

  // ألوان النص (داكن على خلفية فاتحة)
  const headerText = onLightBg || scrolled ? "text-neutral-900" : "text-white";
  const linkIdle =
    onLightBg || scrolled
      ? "text-neutral-600 hover:text-neutral-900"
      : "text-white/80 hover:text-white";

  // Sidebar RTL/LTR
  const sideClass = lang === "ar" ? "right-0" : "left-0";
  const translateStart =
    lang === "ar" ? "translate-x-full" : "-translate-x-full";
  const translateEnd = "translate-x-0";

  // تحريك السلايدر (محايد للـRTL)
  const moveSlider = useCallback(() => {
    const capsule = capsuleRef.current;
    const slider = sliderRef.current;
    const current = linkRefs.current[active];
    if (!capsule || !slider || !current) return;

    let scroll = capsule.scrollLeft;
    if (document?.dir === "rtl" && scroll < 0) scroll = Math.abs(scroll);

    const left = current.offsetLeft - scroll;
    const width = current.offsetWidth;

    slider.style.width = `${width}px`;
    slider.style.transform = `translateX(${left}px)`;
    slider.style.transition = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches
      ? "none"
      : "transform 220ms, width 220ms";
  }, [active]);

  useEffect(() => {
    moveSlider();
    const onResize = () => moveSlider();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [moveSlider, lang, scrolled]);

  return (
    <header
      className={[
        "sticky top-0 z-40 transition-all duration-500",
        // Glassmorphism دائم (اختيارك 7)
        "backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-black/5 shadow-[0_8px_30px_rgb(0_0_0/0.06)]",
      ].join(" ")}
      role="banner"
    >
      {/* أنماط بسيطة للـpulse الناعم + underline من المنتصف (اختياراتك 3 و9) */}
      <style>{`
        @keyframes pulse-soft { 
          0%, 92%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(239,68,68,0)); }
          96% { transform: scale(1.035); filter: drop-shadow(0 6px 10px rgba(239,68,68,.35)); }
        }
        .animate-softpulse { animation: pulse-soft 8s ease-in-out infinite; }
        .hover-underline::after {
          content: ""; position: absolute; left: 50%; bottom: 0;
          width: 64%; height: 2px; background: currentColor;
          transform: translateX(-50%) scaleX(0); transform-origin: center;
          transition: transform 200ms ease;
          opacity: .9;
        }
        .hover-underline:hover::after { transform: translateX(-50%) scaleX(1); }
      `}</style>

      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
        {/* Grid: شعار | وسط مرن | أدوات */}
        <div className="h-14 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 md:gap-3">
          {/* الشعار */}
          <a
            href="#home"
            onClick={handleLinkClick("#home")}
            aria-label="GYMX Home"
            className="flex items-center gap-2 justify-self-start"
          >
            <span className={`sm:hidden inline-flex w-6 h-6 ${headerText}`}>
              <DumbbellIcon />
            </span>
            <span
              className={[
                "hidden sm:inline font-extrabold tracking-tight text-[18px] md:text-xl lg:text-2xl",
                headerText,
              ].join(" ")}
            >
              GYM<span className="font-black">X</span>
            </span>
          </a>

          {/* كبسولة الناڤ (وسط) */}
          <nav aria-label="Primary" className="justify-self-center w-full">
            <div
              ref={capsuleRef}
              className={[
                "relative hidden sm:inline-flex items-center gap-1.5 rounded-[28px] px-2 py-1",
                "backdrop-blur",
                "bg-white/90 border border-black/5 shadow-sm",
                "mx-auto justify-center",
                // حدود عرض + تمرير أفقي عند الحاجة
                "w-full max-w-[calc(100vw-220px)] md:max-w-[calc(100vw-260px)] lg:max-w-[760px]",
                "overflow-x-auto overscroll-x-contain whitespace-nowrap",
                "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              ].join(" ")}
            >
              {/* Slider نشط */}
              <span
                ref={sliderRef}
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] rounded-full bg-blue-600/90"
                style={{ width: 0, transform: "translateX(0px)" }}
              />

              {LINKS.map((l) => {
                const Icon = l.icon;
                const isActive = active === l.href;
                return (
                  <a
                    key={l.href}
                    ref={(el) => (linkRefs.current[l.href] = el)}
                    href={l.href}
                    onClick={handleLinkClick(l.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "group relative rounded-full transition-colors hover:bg-neutral-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                      // (2) Hover واضح
                      "px-2.5 sm:px-3 md:px-3.5 lg:px-4 py-2 md:py-1.5",
                      "text-[14px] sm:text-[15px] lg:text-[16px]",
                      isActive ? headerText + " font-medium" : linkIdle,
                      "hover-underline", // (9) خط من المنتصف عند hover
                    ].join(" ")}
                  >
                    <span className="inline-flex items-center gap-2">
                      {/* (1) أيقونة قبل النص */}
                      <Icon
                        className={[
                          "w-[18px] h-[18px]",
                          isActive
                            ? "opacity-100"
                            : "opacity-80 group-hover:opacity-100",
                        ].join(" ")}
                      />
                      {t(l.label)}
                    </span>
                  </a>
                );
              })}
            </div>
          </nav>

          {/* أدوات يمين */}
          <div className="justify-self-end flex items-center gap-1.5 sm:gap-2">
            {/* مبدّل اللغة */}
            <div className="relative">
              <button
                ref={langBtnRef}
                type="button"
                onClick={() => setOpenLang((v) => !v)}
                className={[
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium transition",
                  "bg-neutral-900 text-white hover:bg-neutral-800",
                  "focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50",
                ].join(" ")}
                aria-haspopup="menu"
                aria-expanded={openLang}
                aria-label={lang === "ar" ? "مبدّل اللغة" : "Language switcher"}
              >
                <span aria-hidden>{lang === "ar" ? "🇦🇪" : "🇬🇧"}</span>
                {lang === "ar" ? "AR" : "EN"}{" "}
                <span aria-hidden className="opacity-70">
                  ▾
                </span>
              </button>

              {openLang && (
                <div
                  ref={langMenuRef}
                  className={[
                    "absolute z-50 mt-2 min-w-[160px] max-w-[calc(100vw-24px)]",
                    "rounded-xl border border-black/5 bg-white/95 text-neutral-900 shadow-lg backdrop-blur p-1",
                    lang === "ar"
                      ? "right-0 left-auto origin-top-right"
                      : "left-0 right-auto origin-top-left",
                  ].join(" ")}
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLang("ar");
                      setOpenLang(false);
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    role="menuitem"
                  >
                    🇦🇪 {NATIVE_LANG.ar} {LANG_CODE.ar}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLang("en");
                      setOpenLang(false);
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    role="menuitem"
                  >
                    🇬🇧 {NATIVE_LANG.en} {LANG_CODE.en}
                  </button>
                </div>
              )}
            </div>

            {/* (3) CTA نبض لطيف */}
            <button
              className={[
                "hidden lg:inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
                "bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-95",
                "focus:outline-none focus-visible:ring focus-visible:ring-blue-400/50",
                "animate-softpulse",
              ].join(" ")}
            >
              {t(TX.join)}
            </button>

            {/* زر منيو (XS وMD الضيقة) */}
            <button
              ref={menuBtnRef}
              onClick={() => setOpenMenu((v) => !v)}
              className={[
                "inline-flex items-center justify-center rounded-xl w-10 h-10 transition-colors",
                "sm:hidden md:inline-flex md:lg:hidden",
                "text-neutral-900 hover:bg-black/5",
                "focus:outline-none focus-visible:ring focus-visible:ring-blue-500/40",
              ].join(" ")}
              aria-label={openMenu ? t(TX.closeMenu) : t(TX.openMenu)}
              aria-expanded={openMenu}
              aria-controls="mobile-menu-panel"
            >
              <span
                className={[
                  "transition-transform duration-300",
                  openMenu ? "rotate-90" : "rotate-0",
                ].join(" ")}
                aria-hidden
              >
                {openMenu ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* خط زخرفي سفلي خفيّف */}
      <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      {/* Sidebar للموبايل */}
      <div
        className={[
          "fixed inset-0 z-50",
          openMenu ? "pointer-events-auto" : "pointer-events-none",
          "sm:hidden",
        ].join(" ")}
        aria-hidden={!openMenu}
      >
        <div
          className={[
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
            openMenu ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setOpenMenu(false)}
        />
        <div
          ref={menuPanelRef}
          id="mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          className={[
            "absolute top-0 bottom-0 w-[78%] max-w-[330px] bg-white text-neutral-900 shadow-xl border-s border-black/5",
            "transition-transform duration-300",
            sideClass,
            openMenu ? translateEnd : translateStart,
          ].join(" ")}
          tabIndex={-1}
        >
          <div className="px-4 py-4 flex items-center justify-between border-b border-black/5">
            <span className="font-extrabold tracking-tight text-lg">GYMX</span>
            <button
              onClick={() => setOpenMenu(false)}
              className="inline-flex w-9 h-9 items-center justify-center rounded-lg hover:bg-black/5 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/40"
              aria-label={t(TX.closeMenu)}
            >
              ✕
            </button>
          </div>

          <nav className="px-3 py-3 space-y-1" aria-label="Mobile">
            {LINKS.map((l) => {
              const isActive = active === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={handleLinkClick(l.href, { block: "start" })}
                  className={[
                    "block rounded-xl px-3 py-3 text-base transition-colors",
                    isActive ? "bg-blue-50 text-blue-700" : "hover:bg-black/5",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {t(l.label)}
                </a>
              );
            })}

            <div className="pt-2">
              <button
                className="w-full rounded-xl px-3 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition"
                onClick={() => setOpenMenu(false)}
              >
                {t(TX.join)}
              </button>
            </div>

            <div className="pt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setLang("ar");
                  setOpenMenu(false);
                }}
                className={[
                  "rounded-xl px-3 py-3 text-base border border-black/5 hover:bg-black/5 transition",
                  lang === "ar" ? "bg-black/5 font-semibold" : "",
                ].join(" ")}
                aria-label="Switch to Arabic"
              >
                🇦🇪 {NATIVE_LANG.ar} {LANG_CODE.ar}
              </button>
              <button
                onClick={() => {
                  setLang("en");
                  setOpenMenu(false);
                }}
                className={[
                  "rounded-xl px-3 py-3 text-base border border-black/5 hover:bg-black/5 transition",
                  lang === "en" ? "bg-black/5 font-semibold" : "",
                ].join(" ")}
                aria-label="Switch to English"
              >
                🇬🇧 {NATIVE_LANG.en} {LANG_CODE.en}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* ==== أيقونات بسيطة (SVG inline) ==== */
function DumbbellIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 9h2v6H3V9zm2-2h2v10H5V7zm12 0h2v10h-2V7zm2 2h2v6h-2V9zM9 11h6v2H9v-2z" />
    </svg>
  );
}
function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
    </svg>
  );
}
function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z" />
    </svg>
  );
}
function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2c.3-.3.8-.4 1.1-.2 1.2.5 2.6.8 4 .8.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.8 21 3 12.2 3 1c0-.6.4-1 1-1h3.2c.6 0 1 .4 1 1 0 1.4.3 2.8.8 4 .2.4.1.8-.2 1.1L6.6 10.8z" />
    </svg>
  );
}
