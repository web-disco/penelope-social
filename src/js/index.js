import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import "lenis/dist/lenis.css";

import { navbarEffect } from "./animations/navbar-effect";

import { homeMenusAnimation } from "./animations/home-menus";
import { menuDrawer } from "./animations/menu-drawer";
import lenisInstance from "./utils/lenis";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  ScrollTrigger.normalizeScroll(true);

  lenisInstance.start();

  // animations
  navbarEffect();
  menuDrawer();
  homeMenusAnimation();
});
