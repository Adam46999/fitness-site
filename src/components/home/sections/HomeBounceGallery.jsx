import { BounceCards } from "../../ui/BounceCards";

const bounceImages = [
  "https://picsum.photos/1600/1600?grayscale&random=1",
  "https://picsum.photos/1600/1600?grayscale&random=2",
  "https://picsum.photos/1600/1600?grayscale&random=3",
  "https://picsum.photos/1600/1600?grayscale&random=4",
  "https://picsum.photos/1600/1600?grayscale&random=5",
];

const bounceTransforms = [
  "rotate(5deg) translate(-150px)",
  "rotate(0deg) translate(-70px)",
  "rotate(-5deg)",
  "rotate(5deg) translate(70px)",
  "rotate(-5deg) translate(150px)",
];

export default function HomeBounceGallery() {
  return (
    <section
      style={{
        width: "100%",
        padding: "120px 0", // مساحة فوق وتحت
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "1100px", width: "100%" }}>
        <BounceCards
          images={bounceImages}
          containerWidth={700} // حجم متوازن
          containerHeight={350}
          animationDelay={0.8}
          animationStagger={0.06}
          easeType="elastic.out(1, 0.6)"
          transformStyles={bounceTransforms}
          enableHover
          enableLightbox
        />
      </div>
    </section>
  );
}
