import { useEffect, useMemo, useRef, useState } from "react";

export default function Header() {
  // ===== حالات عامة =====
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const [openMenu, setOpenMenu] = useState(false);

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

  const langBtnRef = useRef(null);
  const langMenuRef = useRef(null);
  const menuBtnRef = useRef(null);
  const menuPanelRef = useRef(null);

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
      ) {
        setOpenLang(false);
      }
      if (
        openMenu &&
        !menuBtnRef.current?.contains(e.target) &&
        !menuPanelRef.current?.contains(e.target)
      ) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openLang, openMenu]);

  // روابط وتسميات
  const LINKS = useMemo(
    () => [
      { href: "#home", label: { ar: "الرئيسية", en: "Home" } },
      { href: "#classes", label: { ar: "الحصص", en: "Classes" } },
      { href: "#trainers", label: { ar: "المدربون", en: "Trainers" } },
      { href: "#contact", label: { ar: "تواصل", en: "Contact" } },
    ],
    []
  );

  const TX = {
    join: { ar: "انضم الآن", en: "Join Now" },
    openMenu: { ar: "افتح القائمة", en: "Open menu" },
    closeMenu: { ar: "أغلق القائمة", en: "Close menu" },
    langSwitcher: { ar: "مبدّل اللغة", en: "Language switcher" },
    arabic: { ar: "العربية", en: "Arabic" },
    english: { ar: "الإنجليزية", en: "English" },
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
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
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
      const id = href.slice(1);
      const el = document.getElementById(id);
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

  // شعار دمبل بسيط
  const DumbbellIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 9h2v6H3V9zm2-2h2v10H5V7zm12 0h2v10h-2V7zm2 2h2v6h-2V9zM9 11h6v2H9v-2z" />
    </svg>
  );

  // ألوان النص
  const headerText = scrolled ? "text-neutral-900" : "text-white";
  const linkIdle = scrolled
    ? "text-neutral-700 hover:text-neutral-900"
    : "text-white/70 hover:text-white";

  // أي جانب يفتح منه الـSidebar
  const sideClass = lang === "ar" ? "right-0" : "left-0";
  const translateStart =
    lang === "ar" ? "translate-x-full" : "-translate-x-full";
  const translateEnd = "translate-x-0";

  return (
    <header
      className={[
        "sticky top-0 z-40 transition-all duration-500",
        scrolled
          ? "backdrop-blur supports-[backdrop-filter]:bg-white/65 dark:supports-[backdrop-filter]:bg-neutral-900/55 border-b border-black/5 shadow-sm"
          : "bg-transparent",
      ].join(" ")}
      role="banner"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#home"
            onClick={handleLinkClick("#home")}
            aria-label="GYMX Home"
            className="flex items-center gap-2"
          >
            <span className={`md:hidden inline-flex w-6 h-6 ${headerText}`}>
              <DumbbellIcon />
            </span>
            <span
              className={[
                "hidden md:inline font-extrabold tracking-tight text-lg sm:text-xl lg:text-2xl origin-left transition-transform duration-500",
                headerText,
                scrolled ? "scale-[0.95]" : "scale-100",
              ].join(" ")}
            >
              GYM<span className="font-black">X</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-3 xl:gap-6"
            aria-label="Primary"
          >
            {LINKS.map((l) => {
              const isActive = active === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={handleLinkClick(l.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "group relative px-3 py-2 text-[15px] xl:text-[16px] rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
                    isActive ? headerText + " font-medium" : linkIdle,
                    isActive && scrolled ? "bg-neutral-900/5" : "",
                    "hover:-translate-y-[1px]",
                  ].join(" ")}
                >
                  {t(l.label)}
                  {/* Underline أنيق بدون لمعة */}
                  <span
                    className={[
                      "pointer-events-none absolute left-2 right-2 -bottom-1 h-[2px]",
                      "bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500",
                      "transition-all duration-300 origin-center rounded-full",
                      isActive
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100",
                    ].join(" ")}
                  />
                </a>
              );
            })}
          </nav>

          {/* يمين: مبدّل لغة + CTA + زر منيو */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                ref={langBtnRef}
                type="button"
                onClick={() => setOpenLang((v) => !v)}
                className={[
                  "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition",
                  scrolled
                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                    : "bg-white/85 text-neutral-900 hover:bg-white",
                  "focus:outline-none focus-visible:ring focus-visible:ring-blue-500/50",
                ].join(" ")}
                aria-haspopup="menu"
                aria-expanded={openLang}
                aria-label={t(TX.langSwitcher)}
              >
                <span aria-hidden>{lang === "ar" ? "🇦🇪" : "🇬🇧"}</span>
                {lang === "ar" ? "AR" : "EN"}
                <span aria-hidden className="opacity-70">
                  ▾
                </span>
              </button>

              {openLang && (
                <div
                  ref={langMenuRef}
                  className="absolute mt-2 min-w-[160px] rounded-xl border border-black/5 bg-white/95 text-neutral-900 shadow-lg backdrop-blur p-1 right-0"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLang("ar");
                      setOpenLang(false);
                    }}
                    className={[
                      "w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                      lang === "ar" ? "font-semibold" : "",
                    ].join(" ")}
                    role="menuitem"
                  >
                    🇦🇪 {t(TX.arabic)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLang("en");
                      setOpenLang(false);
                    }}
                    className={[
                      "w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                      lang === "en" ? "font-semibold" : "",
                    ].join(" ")}
                    role="menuitem"
                  >
                    🇬🇧 {t(TX.english)}
                  </button>
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              className={[
                "hidden lg:inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition-all",
                scrolled
                  ? "bg-neutral-900 text-white hover:bg-neutral-800"
                  : "bg-white text-neutral-900 border border-white/20 shadow-sm hover:shadow",
                "focus:outline-none focus-visible:ring focus-visible:ring-blue-500/40",
                "hover:scale-[1.02]",
              ].join(" ")}
            >
              {t(TX.join)}
            </button>

            {/* زر منيو للموبايل */}
            <button
              ref={menuBtnRef}
              onClick={() => setOpenMenu((v) => !v)}
              className={[
                "lg:hidden inline-flex items-center justify-center rounded-xl w-10 h-10 transition-colors",
                scrolled
                  ? "text-neutral-900 hover:bg-black/5"
                  : "text-white hover:bg-white/10",
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

      {/* خط زخرفي سفلي */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Mobile Sidebar */}
      <div
        className={[
          "lg:hidden fixed inset-0 z-50",
          openMenu ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!openMenu}
      >
        {/* Backdrop */}
        <div
          className={[
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
            openMenu ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setOpenMenu(false)}
        />

        {/* Panel */}
        <div
          ref={menuPanelRef}
          id="mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          className={[
            "absolute top-0 bottom-0 w-[78%] max-w-sm bg-white text-neutral-900 shadow-xl border-s border-black/5",
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

            {/* CTA داخل المنيو */}
            <div className="pt-2">
              <button
                className="w-full rounded-xl px-3 py-3 text-base font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition"
                onClick={() => setOpenMenu(false)}
              >
                {t(TX.join)}
              </button>
            </div>

            {/* محوّل لغة داخل المنيو */}
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
                🇦🇪 {t(TX.arabic)}
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
                🇬🇧 {t(TX.english)}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
