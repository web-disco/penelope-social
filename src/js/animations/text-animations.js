import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";

const textAnimations = () => {
  const texts = document.querySelectorAll("[text-animation]");
  const splitTextMap = new Map();

  const runSplit = (text) => {
    const splitText = new SplitText(text, {
      type: "lines",
      linesClass: "line",
    });
    splitTextMap.set(text, splitText); // Store the instance
  };

  texts.forEach((text) => {
    runSplit(text);

    let windowWidth = window.innerWidth;

    const handleResize = () => {
      if (windowWidth !== window.innerWidth) {
        windowWidth = window.innerWidth;

        // Revert the existing splitText for this element
        const existingSplitText = splitTextMap.get(text);
        if (existingSplitText) {
          existingSplitText.revert();
        }

        // Re-run the split text for this element
        runSplit(text);
      }
    };

    window.addEventListener("resize", handleResize);

    gsap.fromTo(
      text.querySelectorAll(".line"), // Target only lines within this text
      {
        yPercent: 50,
        opacity: 0,
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.13,
        ease: "power2.out",
        scrollTrigger: {
          trigger: text,
          start: "top 85%",
        },
      }
    );
  });
};

export { textAnimations };
