import { gsap } from "gsap";
import lenisInstance from "../utils/lenis";

const menuDrawer = () => {
  const menuButton = document.querySelector(".menu-toggle");
  const menuDrawer = document.querySelector(".menu-drawer");
  const menuButtonBars = menuButton.querySelectorAll(".menu-toggle-bar");
  const menuLinks = menuDrawer.querySelectorAll(".menu-drawer-link");

  let isOpen = false;

  const openMenu = () => {
    // Stop lenis to prevent scrolling
    lenisInstance.stop();

    const mobileBreakpoint = 479;
    let windowWidth = window.innerWidth;

    // Open the menu
    gsap.to(menuDrawer, {
      duration: 1.5,
      ease: "expo.inOut",
      left: 0,
    });

    gsap.to(menuButtonBars[0], {
      duration: 0.5,
      rotate: 45,
      y: 6,
      delay: 0.5,
    });

    gsap.to(menuButtonBars[1], {
      duration: 0.5,
      autoAlpha: 0,
      delay: 0.5,
    });

    gsap.to(menuButtonBars[2], {
      duration: 0.5,
      rotate: -45,
      y: windowWidth > mobileBreakpoint ? -13 : -10,
      delay: 0.5,
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
        stagger: 0.15,
        delay: 0.85,
      }
    );
  };

  const closeMenu = (callback) => {
    // Start lenis to allow scrolling
    lenisInstance.start();

    gsap.fromTo(
      menuLinks,
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.15,
      },
      {
        yPercent: 40,
        opacity: 0,
        stagger: -0.15,
      }
    );

    // Close the menu
    gsap.to(menuDrawer, {
      duration: 1.5,
      ease: "expo.inOut",
      left: "-100%", // Adjust based on your drawer's off-screen position
      delay: 0.5,
      onComplete: () => {
        if (callback) {
          callback();
        }
      },
    });

    gsap.to(menuButtonBars[0], {
      duration: 0.5,
      rotate: 0,
      y: 0,
      delay: 0.5,
    });

    gsap.to(menuButtonBars[1], {
      duration: 0.5,
      autoAlpha: 1,
      delay: 0.5,
    });

    gsap.to(menuButtonBars[2], {
      duration: 0.5,
      rotate: 0,
      y: 0,
      delay: 0.5,
    });
  };

  menuLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      // check if link is anchor
      if (link.href.includes("#")) {
        // prevent default behavior
        e.preventDefault();

        closeMenu(() => {
          const target = link.getAttribute("href");

          // Scroll to target
          gsap.delayedCall(0.5, () => {
            lenisInstance.scrollTo(target);
          });
        });
      }
    });
  });

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
