/**
 * Claude generated carousel with seamless looping and random card flipping.
 *
 * @requires GSAP
 *
 * @todo rewrite this
 */

function initCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;
  carousel.style.overflow = "hidden";
  carousel.style.position = "relative";
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.gap = "16px";
  wrapper.style.width = "max-content";
  while (carousel.firstChild) {
    wrapper.appendChild(carousel.firstChild);
  }
  carousel.appendChild(wrapper);
  const originalCards = Array.from(wrapper.querySelectorAll(".card"));
  originalCards.forEach((card) => {
    card.style.perspective = "1000px";
    card.style.flexShrink = "0";
    const inner = document.createElement("div");
    inner.style.position = "relative";
    inner.style.transformStyle = "preserve-3d";
    inner.style.transition = "transform 0.6s ease-in-out";
    const front = card.querySelector(".front");
    const back = card.querySelector(".back");
    if (front) {
      front.style.backfaceVisibility = "hidden";
      front.style.position = "relative";
      front.classList.remove("hidden");
      inner.appendChild(front);
    }
    if (back) {
      back.style.backfaceVisibility = "hidden";
      back.style.position = "absolute";
      back.style.top = "0";
      back.style.left = "0";
      back.style.transform = "rotateY(180deg)";
      back.classList.remove("hidden");
      inner.appendChild(back);
    }
    card.appendChild(inner);
  });
  function startAnimation() {
    const singleSetWidth = wrapper.offsetWidth;
    const gap = 16;
    const carouselWidth = carousel.offsetWidth;
    const clones = originalCards.map((card) => card.cloneNode(true));
    clones.reverse().forEach((clone) => {
      wrapper.insertBefore(clone, wrapper.firstChild);
    });
    const speed = window.innerWidth < 640 ? 15 : 30;
    const loopDistance = singleSetWidth + gap;
    const loopDuration = loopDistance / speed;
    const allCards = Array.from(wrapper.querySelectorAll(".card"));
    const allCardInners = allCards.map((card) => card.querySelector("div"));
    const numOriginalCards = originalCards.length;
    function getPairedIndex(index) {
      return 2 * numOriginalCards - 1 - index;
    }
    function scheduleFlips() {
      const wrapperX = gsap.getProperty(wrapper, "x");
      allCardInners.forEach((inner) => {
        inner.dataset.flipping = "false";
      });
      allCards.forEach((card, index) => {
        const inner = allCardInners[index];
        const pairedIndex = getPairedIndex(index);
        const pairedInner = allCardInners[pairedIndex];
        if (inner.dataset.flipping === "true") return;
        if (pairedInner.dataset.flipping === "true") return;
        if (Math.random() > 0.5) return;
        const cardLeft = wrapperX + card.offsetLeft;
        const timeUntilExit = (carouselWidth - cardLeft) / speed;
        const backShowTime = 20;
        const flipDuration = 0.6;
        const totalFlipTime = backShowTime + flipDuration * 2;
        if (timeUntilExit < totalFlipTime) return;
        const maxDelay = timeUntilExit - totalFlipTime;
        const flipDelay = Math.random() * maxDelay;
        inner.dataset.flipping = "true";
        pairedInner.dataset.flipping = "true";
        setTimeout(() => {
          inner.style.transform = "rotateY(180deg)";
          pairedInner.style.transform = "rotateY(180deg)";
          setTimeout(() => {
            inner.style.transform = "rotateY(0deg)";
            pairedInner.style.transform = "rotateY(0deg)";
            setTimeout(() => {
              inner.dataset.flipping = "false";
              pairedInner.dataset.flipping = "false";
            }, 600);
          }, backShowTime * 1000);
        }, flipDelay * 1000);
      });
    }
    const initialX = carouselWidth - (2 * singleSetWidth + gap);
    gsap.set(wrapper, { x: initialX });
    gsap.to(wrapper, {
      x: initialX + loopDistance,
      duration: loopDuration,
      ease: "none",
      repeat: -1,
    });
    scheduleFlips();
    setInterval(() => {
      scheduleFlips();
    }, loopDuration * 1000);
  }
  const images = carousel.querySelectorAll("img");
  let loadedCount = 0;
  function checkAllLoaded() {
    loadedCount++;
    if (loadedCount === images.length) {
      startAnimation();
    }
  }
  images.forEach((img) => {
    if (img.complete) {
      checkAllLoaded();
    } else {
      img.addEventListener("load", checkAllLoaded);
    }
  });
}
document.addEventListener("DOMContentLoaded", initCarousel);
