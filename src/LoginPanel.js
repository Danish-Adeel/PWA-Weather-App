import React from 'react'

const LoginPanel = ({ user, handleLogin, toggleCities }) => {
	return (
		<div className="login-panel">
			{!user ? (
				<button className="login-button" onClick={handleLogin}>
					LogIn
				</button>
			) : (
				<div>
					<h2 className="user-name" onClick={toggleCities}>
						{user.displayName}
					</h2>
				</div>
			)}
		</div>
	)
}

export default LoginPanel
