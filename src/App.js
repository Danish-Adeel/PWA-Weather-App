import FrontSide from "./FrontSide";
import "./panel.css";
import React, { Component } from "react";
import BackSide from "./BackSide";
import LoginPanel from "./LoginPanel";
import Cities from "./Cities";
import cities from "./cities.json";
import { db, auth, messaging } from "./firebase";

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
    messaging.getToken().then(token => {
      console.log(token);
    });
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

    for (let hour = 6; hour < 24; hour += 6) {
      this.scheduleNotification(hour, 0, 0);
    }

    document.addEventListener("touchstart", this.handleTouchStart, false);
    document.addEventListener("touchmove", this.handleTouchMove, false);

    this.xDown = null;
    this.yDown = null;
  }

  getTouches = e => {
    return e.touches || e.originalEvent.touches;
  };

  handleTouchStart = evt => {
    const firstTouch = this.getTouches(evt)[0];
    this.xDown = firstTouch.clientX;
    this.yDown = firstTouch.clientY;
  };

  handleTouchMove = evt => {
    if (!this.xDown || !this.yDown) {
      return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = this.xDown - xUp;
    const yDiff = this.yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        /* left swipe */
        this.setState({ flipped: true });
      } else {
        /* right swipe */
        this.setState({ flipped: false });
      }
    }
    /* reset values */
    this.xDown = null;
    this.yDown = null;
  };

  scheduleNotification = (hours, minutes, second) => {
    const showNotificationOn =
      new Date().setHours(hours, minutes, second, 0) - Date.now();
    if (showNotificationOn > 0) {
      setTimeout(() => {
        navigator.serviceWorker.getRegistration().then(reg => {
          const { currentCity } = this.state;
          getWeatherForLocation(currentCity).then(weather => {
            const {
              temperature,
              apparentTemperature,
              summary
            } = weather.currently;
            reg.showNotification(
              `${parseInt(temperature, 10)}° / ${parseInt(
                apparentTemperature,
                10
              )}° in ${currentCity.title}\n${summary}`
            );
          });
          // reg.showNotification(`timer ${new Date().toLocaleString()}`)
        });
      }, showNotificationOn);
    }
  };

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
    auth.signOut().then(
      () => {
        this.setState({ user: null });
        localStorage.removeItem("user");
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
          signOut={this.signOut}
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
      </>
    );
  }
}

export default App;
