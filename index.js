const apiKey = "d679041828d625fdf90cb49eabcbe26f";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  if (!city.trim()) {
    console.error("Please enter a city name!");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);

    if (!response.ok) {
      throw new Error(`Weather data not found (${response.status})`);
    }

    const data = await response.json();
    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = `${Math.round(
      data.main.temp
    )}°C`;
    document.querySelector(".humidity").innerHTML = `${data.main.humidity} %`;
    document.querySelector(".wind").innerHTML = `${data.wind.speed} km/h`;

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
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value.trim());
});

searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value.trim());
  }
});
