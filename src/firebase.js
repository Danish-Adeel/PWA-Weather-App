import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyBORWc3ih76mN7SmO19Zn64Mz5uHnq73jg',
	authDomain: 'weatherapp-c383a.firebaseapp.com',
	databaseURL: 'https://weatherapp-c383a.firebaseio.com',
	projectId: 'weatherapp-c383a',
	storageBucket: 'weatherapp-c383a.appspot.com',
	messagingSenderId: '611240097172',
	appId: '1:611240097172:web:64a3a8adfc899618ff0b81',
	measurementId: 'G-REMDRE73PB'
}

app.initializeApp(firebaseConfig)
export const auth = app.auth()
export const db = app.firestore()
export const provider = new app.auth.GoogleAuthProvider()
