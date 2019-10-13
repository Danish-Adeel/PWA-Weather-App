import React, { Component } from "react";
import FrontSideView from "./FrontSideView";
import moment from "moment";
import { getWeatherByCityName } from "../api";
import search from "../images/search.svg";

class FrontSide extends Component {
  state = { currentWeather: null, prevCityId: null, cityName: "" };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentCity.woeid !== prevState.prevCityId) {
      return {
        prevCityId: nextProps.currentCity.woeid,
        currentCity: nextProps.currentCity
        // currentWeather: null
      };
    }
    return null;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.currentCity.woeid !== this.props.currentCity.woeid) {
  //     this.props.updateWeather();
  //   }
  // }

  componentDidMount() {
    this.props.updateWeather(this.state.currentCity);
  }

  setSearchMode = searchMode => {
    this.setState({
      searchMode
    });
  };

  changeCityName = e => {
    this.setState({
      cityName: e.target.value
    });
  };

  findCity = () => {
    getWeatherByCityName(this.state.cityName).then(data => {
      if (data.id) {
        this.setState(
          {
            currentCity: {
              woeid: data.id,
              latt_long: `${data.coord.lat},${data.coord.lon}`,
              title: data.name
            }
          },
          () => this.props.updateWeather(this.state.currentCity)
        );
      }
      console.log(data);
    });
  };

  render() {
    if (!this.props.currentWeather) {
      return null;
    }

    const {
      icon,
      temperature,
      apparentTemperature,
      summary
    } = this.props.currentWeather;

    return (
      <>
        {this.state.searchMode && (
          <div className="searchbar" onClick={() => this.setSearchMode(false)}>
            <input
              type="text"
              placeholder="Search City ..."
              spellCheck="false"
              value={this.state.cityName}
              onChange={this.changeCityName}
              onClick={e => e.stopPropagation()}
            />
            <button onClick={() => this.findCity()}>
              <img src={search} width={32} alt="search" />
            </button>
          </div>
        )}
        <FrontSideView
          date={moment()}
          icon={icon}
          temperature={temperature}
          apparentTemperature={apparentTemperature}
          summary={summary}
          currentCityName={this.state.currentCity.title}
          onClick={this.props.onClick}
          searchMode={this.state.searchMode}
          setSearchMode={this.setSearchMode}
        />
      </>
    );
  }
}
export default FrontSide;
