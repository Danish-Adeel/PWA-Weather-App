import React from 'react'
import deleteIcon from './images/delete-button.svg'
import { db } from './firebase'

const Cities = ({ user, showCities, onSelect }) => {
	const deleteCity = city => {
		const cities = [...user.cities]
		cities.splice(cities.indexOf(city), 1)
		db.collection('users')
			.doc(user.uid)
			.update({
				cities
			})
	}

	const selectCity = (e, city) => {
		e.stopPropagation()
		onSelect(city)
	}

	return (
		<div className="panel cities">
			<div className={`card-back ${showCities ? 'open' : ''}`}>
				<h3>Favorite Cities</h3>
				<ul className="list forecast">
					{user.cities &&
						user.cities.map((city, index) => (
							<li className="list-item" key={index}>
								<span onClick={e => selectCity(e, city)}>{city}</span>
								<span onClick={deleteCity}>
									<img src={deleteIcon} alt="delete" />
								</span>
							</li>
						))}
				</ul>
			</div>
		</div>
	)
}

export default Cities
