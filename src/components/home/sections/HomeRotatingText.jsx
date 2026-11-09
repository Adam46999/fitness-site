// src/components/home/sections/HomeRotatingText.jsx
import RotatingText from "../../ui/RotatingText";

export default function HomeRotatingText() {
  return (
    <section
      style={{
        width: "100%",
        padding: "90px 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1100, padding: "0 16px" }}>
        <h2
          style={{
            color: "#fff",
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: -0.5,
            marginBottom: 18,
          }}
        >
          Rotating Text
        </h2>

        <div
          style={{
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(10,10,18,.55)",
            padding: 26,
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,.9)",
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            Creative
          </span>

          <RotatingText
            texts={["React", "Bits", "Is", "Cool!"]}
            mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>
      </div>
    </section>
  );
}
