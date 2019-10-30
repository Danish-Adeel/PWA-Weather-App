import React from "react";

const LoginPanel = ({ user, handleLogin, toggleCities, signOut }) => {
  return (
    <div className="login-panel">
      {!user ? (
        <button className="login-button" onClick={handleLogin}>
          Log In
        </button>
      ) : (
        <>
          <button onClick={signOut} className="logout-button">
            Sign Out
          </button>
          <h2 className="user-name" onClick={toggleCities}>
            {user.displayName}
          </h2>
        </>
      )}
    </div>
  );
};

export default LoginPanel;
