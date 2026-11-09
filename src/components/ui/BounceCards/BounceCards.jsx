import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./BounceCards.module.css";

export default function BounceCards({
  className = "",
  images = [],
  containerWidth = 500,
  containerHeight = 250,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = "elastic.out(1, 0.8)",
  transformStyles = [
    "rotate(10deg) translate(-170px)",
    "rotate(5deg) translate(-85px)",
    "rotate(-3deg)",
    "rotate(-10deg) translate(85px)",
    "rotate(2deg) translate(170px)",
  ],
  enableHover = true,
  enableLightbox = true,
}) {
  const containerRef = useRef(null);

  // Lightbox state
  const [open, setOpen] = useState(false);
  const [activeSrc, setActiveSrc] = useState(null);
  const lastActiveElRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.card}`,
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  // Lock scroll + ESC close + restore focus
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (lastActiveElRef.current?.focus) lastActiveElRef.current.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const openLightbox = (src, e) => {
    if (!enableLightbox) return;
    lastActiveElRef.current = e?.currentTarget || null;
    setActiveSrc(src);
    setOpen(true);
  };

  const closeLightbox = () => {
    setOpen(false);
    setTimeout(() => setActiveSrc(null), 0);
  };

  const getNoRotationTransform = (transformStr) => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate)
      return transformStr.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
    if (transformStr === "none") return "rotate(0deg)";
    return `${transformStr} rotate(0deg)`;
  };

  const getPushedTransform = (baseTransform, offsetX) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);

    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    }

    return baseTransform === "none"
      ? `translate(${offsetX}px)`
      : `${baseTransform} translate(${offsetX}px)`;
  };

  const pushSiblings = (hoveredIdx) => {
    if (!enableHover || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    images.forEach((_, i) => {
      const target = q(`.${styles[`card-${i}`]}`);
      gsap.killTweensOf(target);

      const baseTransform = transformStyles[i] || "none";

      if (i === hoveredIdx) {
        const noRotationTransform = getNoRotationTransform(baseTransform);
        gsap.to(target, {
          transform: noRotationTransform,
          duration: 0.4,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        gsap.to(target, {
          transform: pushedTransform,
          duration: 0.4,
          ease: "back.out(1.4)",
          delay,
          overwrite: "auto",
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    images.forEach((_, i) => {
      const target = q(`.${styles[`card-${i}`]}`);
      gsap.killTweensOf(target);

      const baseTransform = transformStyles[i] || "none";
      gsap.to(target, {
        transform: baseTransform,
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`${styles.bounceCardsContainer} ${className}`}
        style={{ width: containerWidth, height: containerHeight }}
      >
        {images.map((src, idx) => (
          <button
            key={`${src}-${idx}`}
            type="button"
            className={`${styles.card} ${styles[`card-${idx}`]} ${styles.cardBtn}`}
            style={{ transform: transformStyles[idx] ?? "none" }}
            onMouseEnter={() => pushSiblings(idx)}
            onMouseLeave={resetSiblings}
            onClick={(e) => openLightbox(src, e)}
            aria-label="Open image"
          >
            <img
              className={styles.image}
              src={src}
              alt={`card-${idx}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {open && activeSrc && (
        <div
          className={styles.lightboxBackdrop}
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={closeLightbox}
            aria-label="Close"
          >
            ✕
          </button>

          {/* ✅ الحجم مضبوط من CSS (لا يعتمد على حجم الصورة الصغير) */}
          <img className={styles.lightboxImage} src={activeSrc} alt="Preview" />
        </div>
      )}
    </>
  );
}
