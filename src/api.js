import { auth, provider, db } from "./firebase";

export const getWeatherForLocation = city => {
  const [lat, long] = city["latt_long"].split(",");
  return fetch(`https://pwaweatherapp.herokuapp.com/forecast/${lat},${long}`, {
    mode: "cors"
  }).then(res => res.json());
};

export const getCurrentLocation = async () => {
  //const access_key = "80ba8b4ead04f5781e42ef2d89c4d407";
  const res = await fetch("https://json.geoiplookup.io/");
  return await res.json();
};

export const getWeatherByCityName = async cityName => {
  const api_key = "fa80d21367f75d29fbfefacaebc2b5d8";
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}`
  );

  return await res.json();
};

export const login = async () => {
  try {
    const { user } = await auth.signInWithPopup(provider);
    const ref = db.collection("users").doc(user.uid);
    const docSnap = await ref.get();
    if (!docSnap.exists) {
      const newUser = {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL
      };
      await ref.set(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    }
    const data = docSnap.data();
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (err) {
    console.log(err);
  }
};

// export const signOut = () => {
//   return ({ getFirebase }) => {
//     const firebase = getFirebase();
//     firebase.auth().signOut();
//   };
// };

export const addCity = (city, user) => {
  const cities = user && user.cities ? user.cities : [];
  if (user && !cities.includes(city)) {
    return db
      .collection("users")
      .doc(user.uid)
      .update({
        cities: [...cities, city]
      });
  }
};
