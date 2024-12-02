import Swiper from "swiper";

const productSlider = () => {
  new Swiper(".swiper.is-merch", {
    slidesPerView: 1,
  });
};

export { productSlider };
