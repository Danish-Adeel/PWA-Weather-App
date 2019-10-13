import React from "react";
// import CitiesList from "./CitiesList";
import moment from "moment";
import WeatherIcon from "./FrontSide/WeatherIcon";
import dropIcon from './images/drop.svg'
import "./button.css";

export default ({ onClick, forcast, cities, currentCity, onSelect }) => {
  return (
    <div className="card-back">
      {/* <CitiesList
        cities={cities}
        currentCity={currentCity}
        onSelect={onSelect}
      /> */}
      <ul className="list forecast">
        {forcast.map((day, index) => (
          <li className="list-item" key={index}>
            <span style={{ width: '20%' }}>{moment().day(index).format("ddd")}</span>
            <span style={{ width: '20%' }}>{parseFloat(day.temperatureHigh).toFixed(0)}°</span>
            <span style={{ width: '20%' }}><img className="drop" src={dropIcon} alt="drop" />{parseFloat(day.precipProbability * 100).toFixed(0)}%</span>
            <span className="icon"><WeatherIcon icon={day.icon} /></span>
          </li>
        ))}
      </ul>
      <button className="button" onClick={onClick}>
        Flip back
      </button>
    </div>
  );
};
