const API_KEY = "API_KEY";

const getCurrentmathData = async () => {
    const city = 'Navi Mumbai';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return response.json();
}

const formatTemperature = (temp) => `${temp?.toFixed(1)}\u00B0`; // Fixed the degree symbol

const createIconUrl = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;

const getHourlyForecast = async ({ name: city }) => { // Fixed the function name
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`); // Changed the API endpoint
    const data = await response.json();
    return data.list.map(forecast => {
        const { main: { temp, temp_max, temp_min }, dt, dt_txt, weather: [{ description, icon }] } = forecast;
        return { temp, temp_max, temp_min, dt, dt_txt, description, icon }
    })
}

const loadCurrentForecast = ({ name, main: { temp, temp_max, temp_min }, weather: [{ description }] }) => {
    const currentForcastElement = document.querySelector("#current-forecast");

    if (currentForcastElement) {
        currentForcastElement.querySelector(".city").textContent = name;
        currentForcastElement.querySelector(".temp").textContent = formatTemperature(temp);
        currentForcastElement.querySelector(".description").textContent = description;
        currentForcastElement.querySelector(".min-max-temp").textContent = `H: ${formatTemperature(temp_max)} L:${formatTemperature(temp_min)}`;
    } else {
        console.error("#current-forecast element not found");
    }
}

const loadHourlyForecast = (hourlyForecast) => { // Fixed the function name
    console.log(hourlyForecast);
    let dataFor12Hours = hourlyForecast.slice(1, 13); // Fixed the slicing
    const hourlyContainer = document.querySelector(".hourly-container");
    let innerHTMLString = "";

    for (let { temp, icon, dt_txt } of dataFor12Hours) {
        innerHTMLString += `<article>
            <h2 class="time">${dt_txt.split(" ")[1]}</h2>
            <img class="icon" src="${createIconUrl(icon)}" alt="Weather Icon">
            <p class="Hourly-temp">${formatTemperature(temp)}</p>
        </article>`;
    }

    hourlyContainer.innerHTML = innerHTMLString;
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const currentWeather = await getCurrentmathData();
        loadCurrentForecast(currentWeather);
        const hourlyForecast = await getHourlyForecast(currentWeather); // Fixed the function name
        loadHourlyForecast(hourlyForecast); // Fixed the function name
    } catch (error) {
        console.error(error);
    }
});
