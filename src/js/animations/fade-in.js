import gsap from "gsap";

const fadeInAnimation = () => {
  const elements = document.querySelectorAll("[fade-in]");

  elements.forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        yPercent: 10,
      },
      {
        yPercent: 0,
        opacity: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
        },
      }
    );
  });
};

export { fadeInAnimation };
