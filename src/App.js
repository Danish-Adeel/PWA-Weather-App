//import React from "react";

import FrontSide from "./FrontSide";
import "./panel.css";
import React, { Component } from "react";
import BackSide from "./BackSide";
import LoginPanel from "./LoginPanel";
import Cities from "./Cities";
import cities from "./cities.json";
import { db } from "./firebase";
import app from "firebase/app";

import {
  getCurrentLocation,
  getWeatherForLocation,
  login,
  addCity,
  getWeatherByCityName
} from "./api";

class App extends Component {
  state = {
    flipped: false,
    currentCity: cities[0],
    cities,
    latt_long: null,
    forcast: [],
    loadingWeather: false,
    user: null,
    showCities: false
  };

  updateWeather = currentCity => {
    this.setState({ loadingWeather: true });
    if (this.state.user) {
      addCity(currentCity.title, this.state.user);
    }
    getWeatherForLocation(currentCity).then(weather => {
      this.setState({
        currentWeather: weather.currently,
        forcast: weather.daily.data,
        loadingWeather: false
      });
    });
  };

  componentDidMount() {
    let user;
    const userData = localStorage.getItem("user");
    if (userData) {
      user = JSON.parse(userData);

      this.getUser(user.uid);
    }
    this.setState({ user });
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latt_long: `${position.coords.latitude},${position.coords.longitude}`
      });
      getCurrentLocation().then(data => {
        const city = {
          // title: data.city || data.location.capital,
          // woeid: Number(data.zip),
          // latt_long: this.state.latt_long || `${data.latitude},${data.longitude}`,
          // location_type: 'City'
          title: data.city || data.capital,
          woeid: Number(data.postal_code),
          latt_long:
            this.state.latt_long || `${data.latitude},${data.longitude}`,
          location_type: "City"
        };
        this.setState({
          cities: [...this.state.cities, city],
          currentCity: city
        });
        addCity(city.title, this.state.user);
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  onFlip = () => {
    this.setState({ flipped: !this.state.flipped });
  };

  onSelectCity = city => {
    getWeatherByCityName(city).then(data => {
      if (data.id) {
        const currentCity = {
          woeid: data.id,
          latt_long: `${data.coord.lat},${data.coord.lon}`,
          title: data.name
        };
        this.setState({ currentCity });
        this.updateWeather(currentCity);
      }
      console.log(data);
    });
  };

  getUser = uid => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.unsubscribe = db
      .collection("users")
      .doc(uid)
      .onSnapshot(snap => {
        if (snap.exists) {
          const user = snap.data();
          localStorage.setItem("user", JSON.stringify(user));
          this.setState({ user });
        }
      });
  };

  handleLogin = () => {
    login().then(user => {
      this.getUser(user.uid);
    });
  };

  signOut = () => {
    app
      .auth()
      .signOut()
      .then(
        function() {
          console.log("Signed Out");
        },
        function(error) {
          console.error("Sign Out Error", error);
        }
      );
  };

  render() {
    const { user, showCities } = this.state;
    return (
      <>
        <LoginPanel
          user={user}
          handleLogin={this.handleLogin}
          toggleCities={() => this.setState({ showCities: !showCities })}
        />

        <div className={`panel ${this.state.flipped ? "flip" : ""}`}>
          <>
            <div className="panel-front">
              <FrontSide
                onClick={this.onFlip}
                currentCity={this.state.currentCity}
                updateWeather={this.updateWeather}
                currentWeather={this.state.currentWeather}
              />
            </div>

            <div className="panel-back">
              <BackSide
                cities={this.state.cities}
                forcast={this.state.forcast}
                onClick={this.onFlip}
                currentCity={this.state.currentCity}
              />
            </div>
          </>
        </div>
        {user && (
          <Cities
            user={user}
            showCities={showCities}
            onSelect={this.onSelectCity}
          />
        )}
        <button onClick={this.signOut} className="logout-button">
          SignOut
        </button>
      </>
    );
  }
}

export default App;
