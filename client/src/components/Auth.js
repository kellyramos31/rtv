import React, { useState, useContext } from "react";
import AuthForm from "./AuthForm.js";
import { UserContext } from "../context/UserProvider.js";

const initInputs = { username: "", password: "" };

export default function Auth() {
  const [inputs, setInputs] = useState(initInputs);
  const [toggle, setToggle] = useState(false);

  const { signup, login, errMsg, resetAuthErr } = useContext(UserContext);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  }

  function handleSignup(e) {
    e.preventDefault();
    signup(inputs);
  }

  function handleLogin(e) {
    e.preventDefault();
    login(inputs);
  }

  function toggleForm() {
    setToggle((prev) => !prev);
    resetAuthErr();
  }

  return (
    <div className="auth-container">
      {!toggle ? (
        <>
          <AuthForm
            handleChange={handleChange}
            handleSubmit={handleSignup}
            inputs={inputs}
            btnText="Sign up"
            errMsg={errMsg}
          />
          <p onClick={toggleForm} className="member-or-not">
            Already a member?
          </p>
          <div className="sign-in-instructions">
            <div className="title-instructions">SIGN-IN</div>
            <div className="instruct">Click the "Already a member?" button</div>
            <div className="instruct">and login with the following:</div>
            <div className="login-instruct">username: guest</div>
            <div className="login-instruct">password: guest</div>
          </div>
        </>
      ) : (
        <>
          <AuthForm
            handleChange={handleChange}
            handleSubmit={handleLogin}
            inputs={inputs}
            btnText="Login"
            errMsg={errMsg}
          />
          <p onClick={toggleForm} className="member-or-not">
            Not a member?
          </p>
        </>
      )}
    </div>
  );
}
