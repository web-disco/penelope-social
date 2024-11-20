import gsap from "gsap";
import lenisInstance from "../utils/lenis";

const navbarEffect = () => {
  const navbar = document.querySelector(".navbar");
  const navbarLogoText = document.querySelector(".navbar-logo-text");

  if (!navbar || !navbarLogoText) return;

  lenisInstance.on("scroll", (e) => {
    const { targetScroll } = e;

    if (targetScroll > 0) {
      // Apply background with slight transparency and blur effect
      gsap.to(navbar, {
        background: "rgba(40, 38, 41, 0.75)", // Slightly transparent background
        backdropFilter: "blur(10px)", // Add blur effect
        ease: "none",
        duration: 0.3,
      });
      gsap.to(navbarLogoText, {
        autoAlpha: 0,
        duration: 0.3,
      });
    } else {
      // Remove blur and transition back to transparent background
      gsap.to(navbar, {
        background: "rgba(40, 38, 41, 0)", // Fully transparent
        backdropFilter: "blur(0px)", // Remove blur
      });
      gsap.to(navbarLogoText, {
        autoAlpha: 1,
        duration: 0.3,
        delay: 0.8,
      });
    }
  });
};

export { navbarEffect };
