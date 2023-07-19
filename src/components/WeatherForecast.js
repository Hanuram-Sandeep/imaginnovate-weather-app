import React, { useState } from "react";
import axios from "axios";
import "./WeatherForecast.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const WeatherForecast = ({ apiKey }) => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=40&appid=${apiKey}`;
      const response = await axios.get(apiUrl);
      const weatherData = extractFirstRecordForEachDay(response.data.list);
      setWeatherData(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractFirstRecordForEachDay = (list) => {
    const firstRecords = {};
    for (const item of list) {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!firstRecords[date] || item.dt_txt.includes("12:00:00")) {
        firstRecords[date] = firstRecords[date] || [];
        firstRecords[date].push(item);
      }
    }
    return Object.values(firstRecords);
  };

  return (
    <div className="container">
      <div className="content">
        <h2 style={{ color: "orange", paddingRight: "40px", marginBottom: "40px" }}>
          Weather in your city
        </h2>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <div className="search-button-wrapper">
          <button onClick={handleSearch} className="search-button">
            <span className="question-mark">?</span> Search
          </button>
        </div>
      </div>
      {weatherData.length > 0 && (
        <div className="table-container">
          {weatherData.map((dayWeather, index) => (
            <div className="weather-card" key={index}>
              <div className="date-row">
                Date: {new Date(dayWeather[0].dt * 1000).toLocaleDateString()}
              </div>
              <table className="weather-table">
                <thead>
                  <tr>
                    <th colSpan="2">Temperature</th>
                  </tr>
                  <tr>
                    <th>Min</th>
                    <th>Max</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="temperature-text min-temp-cell">
                      {dayWeather[0].main.temp_min} °C
                    </td>
                    <td className="temperature-text max-temp-cell">
                      {dayWeather[0].main.temp_max} °C
                    </td>
                  </tr>
                  <tr>
                    <td>Pressure</td>
                    <td>Humidity</td>
                  </tr>
                  {dayWeather.map((item) => (
                    <tr key={item.dt}>
                      <td>{item.main.pressure} hPa</td>
                      <td>{item.main.humidity}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
      {loading && (
        <div style={{ textAlign: "center" }}>
          <FontAwesomeIcon icon={faSpinner} spin />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
