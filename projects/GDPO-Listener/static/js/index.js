document.querySelectorAll("[data-video-carousel]").forEach((carousel) => {
  const video = carousel.querySelector("[data-carousel-video]");
  const previousButton = carousel.querySelector("[data-carousel-previous]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const status = carousel.querySelector("[data-carousel-status]");
  const pagination = carousel.querySelector("[data-carousel-pagination]");
  const sourceData = carousel.querySelector("[data-carousel-sources]");
  const sources = JSON.parse(sourceData.textContent);
  const carouselName = carousel.dataset.carouselName;
  let currentIndex = 0;
  const pageButtons = sources.map((source, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "carousel-page";
    button.textContent = index + 1;
    button.setAttribute("aria-label", `Show ${carouselName} sample ${index + 1}`);
    button.addEventListener("click", () => {
      showVideo(index);
    });
    pagination.append(button);
    return button;
  });

  const showVideo = (nextIndex) => {
    currentIndex = (nextIndex + sources.length) % sources.length;
    video.pause();
    video.src = sources[currentIndex];
    video.load();
    video.setAttribute(
      "aria-label",
      `${carouselName} video ${currentIndex + 1} of ${sources.length}`,
    );
    status.textContent = `Sample ${currentIndex + 1} of ${sources.length}`;
    pageButtons.forEach((button, index) => {
      const isCurrent = index === currentIndex;
      button.classList.toggle("is-active", isCurrent);
      if (isCurrent) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
    video.play().catch(() => {
      // Browsers may defer autoplay even for muted media; controls remain available.
    });
  };

  previousButton.addEventListener("click", () => {
    showVideo(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showVideo(currentIndex + 1);
  });

  carousel.addEventListener("keydown", (event) => {
    const isPageButton = event.target.classList.contains("carousel-page");
    if (event.target !== carousel && !isPageButton) {
      return;
    }

    let nextIndex = null;
    if (event.key === "ArrowLeft") {
      nextIndex = currentIndex - 1;
    }

    if (event.key === "ArrowRight") {
      nextIndex = currentIndex + 1;
    }

    if (event.key === "Home") {
      nextIndex = 0;
    }

    if (event.key === "End") {
      nextIndex = sources.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      showVideo(nextIndex);
      if (isPageButton) {
        pageButtons[currentIndex].focus();
      }
    }
  });

  pageButtons[0].classList.add("is-active");
  pageButtons[0].setAttribute("aria-current", "true");
});
