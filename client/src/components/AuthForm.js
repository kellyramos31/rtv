import React from 'react'

export default function AuthForm(props){
  const {
    handleChange, 
    handleSubmit, 
    btnText, 
    errMsg,
    inputs: {
      username, 
      password
    } 
  } = props
  
  return (
    <div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="app-title">RTV App</h1>
        <input
          type="text"
          value={username}
          name="username"
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="text"
          value={password}
          name="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <button className="sign-up-btn">{btnText}</button>
        <p style={{ color: "red" }}>{errMsg}</p>
      </form>

      <div className="sign-in-instructions">
        <div className="title-instructions">SIGN-IN</div>
        <div className="instruct">Click the "Already a member?" button</div>
        <div className="instruct">and login with the following:</div>
        <div className="login-instruct">username: guest</div>
        <div className="login-instruct">password: guest</div>
      </div>
    </div>
  );
}