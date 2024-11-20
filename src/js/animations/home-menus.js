import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";

const homeMenusAnimation = () => {
  const menus = document.querySelectorAll(".home-menu");

  if (!menus) return;

  menus.forEach((menu, index) => {
    const hover = menu.querySelector(".home-menu-hover");

    if (!hover) return;

    hover.addEventListener("mouseenter", () => {
      const media = menu.querySelector(".home-menu-hover-media");

      if (!media) return;

      gsap.to(media, {
        opacity: 1,
      });
    });

    hover.addEventListener("mouseleave", () => {
      const media = menu.querySelector(".home-menu-hover-media");

      if (!media) return;
      gsap.to(media, {
        opacity: 0,
      });
    });
  });
};

export { homeMenusAnimation };
