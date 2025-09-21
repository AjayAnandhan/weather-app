import { useEffect, useState } from "react";
import clearIcon from "../assets/clear.png";
import cloudIcon from "../assets/cloud.png";
import drizzleIcon from "../assets/drizzle.png";
import humidityIcon from "../assets/humidity.png";
import rainIcon from "../assets/rain.png";
import searchIcon from "../assets/search.png";
import snowIcon from "../assets/snow.png";
import windIcon from "../assets/wind.png";

let api_key = "5a3f9d79836a5f168fa183aec63fac29";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  long,
  wind,
  humidity,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Lattitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="long">Longitude</span>
          <span>{long}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="humidity-percent">{wind}km/h</div>
            <div className="text">Wind speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function WeatherApp() {
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Mannargudi");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [wind, setWind] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [error, setError] = useState("");

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": rainIcon,
    "13n": rainIcon,
  };

  const defaultCity = "Mannargudi";

  const search = async (cityName = text) => {
    if (!cityName) return;
    setLoading(true);
    let URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}&units=metric`;
    try {
      let res = await fetch(URL);
      let data = await res.json();
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      } else {
        setCityNotFound(false);
        setTemp(Math.floor(data.main.temp));
        setCity(data.name);
        setCountry(data.sys.country);
        setLat(data.coord.lat);
        setLong(data.coord.lon);
        setWind(data.wind.speed);
        setHumidity(data.main.humidity);
        const weatherIconCode = data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(text);
    }
  };

  useEffect(function () {
    search(defaultCity);
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={(e) => handleCity(e)}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-city" onClick={() => search(text)}>
            <img src={searchIcon} alt="search" />
          </div>
        </div>
        {!loading && !error && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            long={long}
            wind={wind}
            humidity={humidity}
          />
        )}
        {loading && <div className="loading-message">Loading...</div>}
        {cityNotFound && <div className="error-message">{error}</div>}
        {error && <div className="city-not-found">City not found</div>}
        <p className="copyright">
          Designed by{" "}
          <a href="https://github.com/AjayAnandhan/weather-app" target="_blank">
            Ajay
          </a>
        </p>
      </div>
    </>
  );
}

export default WeatherApp;
