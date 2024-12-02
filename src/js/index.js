import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import "lenis/dist/lenis.css";

import { navbarEffect } from "./animations/navbar-effect";

import { homeMenusAnimation } from "./animations/home-menus";
import { menuDrawer } from "./animations/menu-drawer";
import lenisInstance from "./utils/lenis";
import { productSlider } from "./sliders/product-slider";
import { titleAnimations } from "./animations/title-animations";
import { textAnimations } from "./animations/text-animations";
import { fadeInAnimation } from "./animations/fade-in";
import { staggerAnimation } from "./animations/stagger-animation";
import { pageLoader } from "./animations/page-loader";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  ScrollTrigger.normalizeScroll(true);

  lenisInstance.start();

  // animations
  navbarEffect();
  menuDrawer();
  homeMenusAnimation();
  titleAnimations();
  textAnimations();
  fadeInAnimation();
  staggerAnimation();
  pageLoader();

  // sliders
  productSlider();
});
