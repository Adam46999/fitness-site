// src/components/home/sections/HomeDomeGallery.jsx
import DomeGallery from "../../ui/DomeGallery";

const domeImages = [
  "https://picsum.photos/1200/1200?grayscale&random=11",
  "https://picsum.photos/1200/1200?grayscale&random=12",
  "https://picsum.photos/1200/1200?grayscale&random=13",
  "https://picsum.photos/1200/1200?grayscale&random=14",
  "https://picsum.photos/1200/1200?grayscale&random=15",
  "https://picsum.photos/1200/1200?grayscale&random=16",
  "https://picsum.photos/1200/1200?grayscale&random=17",
];

export default function HomeDomeGallery() {
  return (
    <section
      style={{
        width: "100%",
        padding: "120px 0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1100px", padding: "0 16px" }}>
        <div style={{ marginBottom: 18 }}>
          <h2
            style={{
              color: "#fff",
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            Dome Gallery
          </h2>
          <p style={{ color: "rgba(255,255,255,.7)", marginTop: 8 }}>
            اسحب للتدوير — واضغط على أي صورة للتكبير
          </p>
        </div>

        <div
          style={{
            width: "100%",
            height: 560,
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(10,10,18,.55)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <DomeGallery
            images={domeImages}
            fit={0.8}
            minRadius={600}
            maxVerticalRotationDeg={0}
            segments={34}
            dragDampening={2}
            grayscale
            openedImageWidth="280px"
            openedImageHeight="380px"
            imageBorderRadius="26px"
            openedImageBorderRadius="26px"
          />
        </div>
      </div>
    </section>
  );
}
