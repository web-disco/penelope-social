import gsap from "gsap";

const staggerAnimation = () => {
  const staggerElement = document.querySelectorAll("[stagger-animation]");

  let mm = gsap.matchMedia();

  staggerElement.forEach((element) => {
    mm.add("screen and (min-width: 991px)", () => {
      gsap.from(element.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.13,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
        },
      });
    });

    mm.add("screen and (max-width: 990px)", () => {
      Array.from(element.children).forEach((child, index) => {
        gsap.from(child, {
          y: 25,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: child,
            start: "top 85%",
          },
        });
      });
    });
  });
};

export { staggerAnimation };
