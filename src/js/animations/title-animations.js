import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";

const titleAnimations = () => {
  const titles = document.querySelectorAll("[title-animation]");
  const splitTitleMap = new Map();

  const runSplit = (title) => {
    const splitTitle = new SplitText(title, {
      type: "chars",
      charsClass: "char",
    });
    splitTitleMap.set(title, splitTitle); // Store the instance
  };

  titles.forEach((title) => {
    runSplit(title);

    let windowWidth = window.innerWidth;

    const handleResize = () => {
      if (windowWidth !== window.innerWidth) {
        windowWidth = window.innerWidth;

        // Revert the existing splitText for this element
        const existingSplitTitle = splitTitleMap.get(title);
        if (existingSplitTitle) {
          existingSplitTitle.revert();
        }

        // Re-run the split text for this element
        runSplit(title);
      }
    };

    window.addEventListener("resize", handleResize);

    gsap.fromTo(
      title.querySelectorAll(".char"),
      {
        yPercent: 50,
        opacity: 0,
      },
      {
        yPercent: 0,
        opacity: 1,
        // duration: 1,
        stagger: 0.03,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
        },
      }
    );
  });
};

export { titleAnimations };
