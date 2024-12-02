import gsap from "gsap";
import lenisInstance from "../utils/lenis";

const navbarEffect = () => {
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  lenisInstance.on("scroll", (e) => {
    const { targetScroll } = e;

    if (targetScroll > 100) {
      // Apply background with slight transparency and blur effect
      gsap.to(navbar, {
        background: "rgba(40, 38, 41, 0.75)", // Slightly transparent background
        backdropFilter: "blur(10px)", // Add blur effect
        ease: "none",
        duration: 0.3,
      });
    } else {
      // Remove blur and transition back to transparent background
      gsap.to(navbar, {
        background: "rgba(40, 38, 41, 0)", // Fully transparent
        backdropFilter: "blur(0px)", // Remove blur
      });
    }
  });
};

export { navbarEffect };
