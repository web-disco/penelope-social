import { gsap } from "gsap";
import lenisInstance from "../utils/lenis";

const menuDrawer = () => {
  const menuButton = document.querySelector(".menu-toggle");
  const menuDrawer = document.querySelector(".menu-drawer");
  const menuButtonBars = menuButton.querySelectorAll(".menu-toggle-bar");
  const menuLinks = menuDrawer.querySelectorAll(".menu-drawer-link");

  let isOpen = false;

  const openMenu = () => {
    const mobileBreakpoint = 479;
    let windowWidth = window.innerWidth;

    // Open the menu
    gsap.to(menuDrawer, {
      duration: 0.5,
      ease: "expo.inOut",
      left: 0,
    });

    gsap.to(menuButtonBars[0], {
      duration: 0.3,
      rotate: 45,
      y: 6,
      delay: 0.3,
    });

    gsap.to(menuButtonBars[1], {
      duration: 0.3,
      autoAlpha: 0,
      delay: 0.3,
    });

    gsap.to(menuButtonBars[2], {
      duration: 0.3,
      rotate: -45,
      y: windowWidth > mobileBreakpoint ? -13 : -10,
      delay: 0.3,
    });

    gsap.fromTo(
      menuLinks,
      {
        yPercent: 40,
        opacity: 0,
        stagger: 0.15,
      },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.085,
        delay: 0.4,
      }
    );
  };

  const closeMenu = (callback) => {
    // Close the menu
    gsap.to(menuDrawer, {
      duration: 0.5,
      ease: "expo.inOut",
      left: "-100%", // Adjust based on your drawer's off-screen position
      // delay: 0.3,
      onComplete: () => {
        if (callback) {
          callback();
        }
      },
    });

    gsap.to(menuButtonBars[0], {
      duration: 0.3,
      rotate: 0,
      y: 0,
      delay: 0.3,
    });

    gsap.to(menuButtonBars[1], {
      duration: 0.3,
      autoAlpha: 1,
      delay: 0.3,
    });

    gsap.to(menuButtonBars[2], {
      duration: 0.3,
      rotate: 0,
      y: 0,
      delay: 0.3,
    });
  };

  menuButton.addEventListener("click", () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
    isOpen = !isOpen;
  });
};

export { menuDrawer };
