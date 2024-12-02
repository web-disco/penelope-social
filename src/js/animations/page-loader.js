import gsap from "gsap";
import lenisInstance from "../utils/lenis";

const pageLoader = () => {
  const loader = document.querySelector(".page-loader");

  if (!loader) return;

  lenisInstance.stop();

  gsap.fromTo(
    ".page-loader-logo",
    {
      opacity: 0,
      scale: 1.05,
    },
    {
      opacity: 1,
      scale: 1,
      delay: 0.2,
      onComplete: () => {
        gsap.fromTo(
          loader,
          {
            "clip-path": "polygon(0 100%, 100% 100%, 100% 0, 0 0)",
          },
          {
            "clip-path": "polygon(0 0%, 100% 0%, 100% 0, 0 0)",
            ease: "power4.inOut",
            delay: 0.2,
            duration: 1.3,
            onComplete: () => {
              lenisInstance.start();
              loader.remove();
            },
          }
        );
      },
    }
  );
};

export { pageLoader };
