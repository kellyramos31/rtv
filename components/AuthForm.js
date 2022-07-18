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
      <button className="sign-up-btn">{ btnText }</button>
      <p style={{color: "red"}}>{errMsg}</p>
    </form>
  )
}