import React from "react";
import WeatherForecast from "./components/WeatherForecast";

const App = () => {
  const apiKey = "1635890035cbba097fd5c26c8ea672a1";

  return (
    <div>
      <WeatherForecast apiKey={apiKey} />
    </div>
  );
};

export default App;
