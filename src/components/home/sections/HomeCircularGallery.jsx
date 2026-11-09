import CircularGallery from "../../ui/CircularGallery";
export default function HomeCircularGallery() {
  return (
    <section
      style={{
        width: "100%",
        padding: "120px 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          height: "600px",
          width: "100%",
          maxWidth: "1200px",
          position: "relative",
        }}
      >
        <CircularGallery
          bend={2}
          textColor="#ffffff"
          borderRadius={0.14}
          scrollSpeed={2.5}
          scrollEase={0.15}
        />
      </div>
    </section>
  );
}
