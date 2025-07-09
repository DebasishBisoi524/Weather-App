const apiKey = "d679041828d625fdf90cb49eabcbe26f";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// Initialize alert box animation and get the function to show it
const { showAlertBox } = alertBoxAnimation();

async function checkWeather(city) {
  if (!city.trim()) {
    console.error("Please enter a city name!");
    showAlertBox();
    return;
  }

  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);

    if (!response.ok) {
      throw new Error(`Weather data not found (${response.status})`);
    }

    const data = await response.json();
    console.log(data);

    // Update weather UI
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = `${Math.round(
      data.main.temp
    )}°C`;
    document.querySelector(".humidity").innerHTML = `${data.main.humidity} %`;
    document.querySelector(".wind").innerHTML = `${data.wind.speed} km/h`;

    // Change weather icon based on condition
    if (weatherIcon) {
      const weatherImages = {
        Clouds: "./images/clouds.png",
        Clear: "./images/clear.png",
        Rain: "./images/rain.png",
        Drizzle: "./images/drizzle.png",
        Mist: "./images/mist.png",
      };
      const weatherCondition = data.weather[0].main;
      weatherIcon.src =
        weatherImages[weatherCondition] || "./images/default.png";

      // Animate weather icon and stats
      gsap.fromTo(
        weatherIcon,
        { scale: 0, opacity: 0, rotate: -30 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        }
      );

      gsap.fromTo(
        ".temp, .humidity, .wind",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    } else {
      console.error("Weather icon element not found!");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    showAlertBox();
  }
}

// Button click to search
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value.trim());
});

// Enter key to search
searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value.trim());
  }
});

// Custom alert box logic
function alertBoxAnimation() {
  const alertBox = document.querySelector("#customAlert");
  const backdrop = document.querySelector("#backdrop");
  const okayBtn = document.querySelector("#OkayBtn");
  const video = document.querySelector("#bgvideo"); // optional, remove if you don't have

  let isBouncing = false;

  function showAlertBox() {
    document.body.style.overflow = "hidden";

    backdrop.style.display = "block";
    alertBox.style.display = "block";

    if (video) video.pause();

    // Animate backdrop fade in
    gsap.fromTo(
      backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power1.out" }
    );

    // Animate alertBox slide from top
    gsap.fromTo(
      alertBox,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }

  function hideAlertBox() {
    // Animate alertBox slide back up
    gsap.to(alertBox, {
      y: -100,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        alertBox.style.display = "none";
      },
    });

    // Animate backdrop fade out
    gsap.to(backdrop, {
      opacity: 0,
      duration: 0.4,
      ease: "power1.inOut",
      onComplete: () => {
        backdrop.style.display = "none";
        document.body.style.overflow = "auto";
        if (video) video.play();
      },
    });
  }

  function bounceAlertBox() {
    if (isBouncing) return;
    isBouncing = true;

    gsap.fromTo(
      alertBox,
      { y: 0 },
      {
        y: -20,
        duration: 0.2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          gsap.to(alertBox, {
            y: 0,
            duration: 0.2,
            ease: "sine.out",
            clearProps: "y",
            onComplete: () => {
              isBouncing = false;
            },
          });
        },
      }
    );
  }

  // Events
  okayBtn.addEventListener("click", hideAlertBox);
  backdrop.addEventListener("click", bounceAlertBox);

  return { showAlertBox, hideAlertBox, bounceAlertBox };
}
