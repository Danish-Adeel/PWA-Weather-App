import React from "react";
import "./card.css";
import back from "../images/back.svg";
import search from "../images/search.svg";
import WeatherIcon from "./WeatherIcon";

export default ({
  date,
  icon,
  temperature,
  summary,
  apparentTemperature,
  currentCityName,
  onClick,
  searchMode,
  setSearchMode
}) => {
  return (
    <div className={`card is-${icon} ${searchMode ? "blured" : ""}`}>
      <div className="card-row">
        <div className="card-day">{date.format("dddd")}</div>
        <div className="card-day">{date.format("MMM Do")}</div>
      </div>
      <WeatherIcon icon={icon} />
      <div>
        <div className="card-temperature">
          {`${parseInt(temperature, 10)}°`}
          <span className="small">/ {parseInt(apparentTemperature, 10)}°</span>
        </div>
        <div className="card-weather">{summary}</div>
      </div>
      <div className="card-line" />
      <div className="card-row">
        <div className="card-city">{currentCityName}</div>
        <div>
          <button className="card-options" onClick={() => setSearchMode(true)}>
            <img src={search} width={32} alt="search" />
          </button>
          <button className="card-options" onClick={onClick}>
            <img src={back} width={32} alt="Flip" />
          </button>
        </div>
      </div>
    </div>
  );
};
