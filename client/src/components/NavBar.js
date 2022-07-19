import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar(props){

  const { logout } = props
  
  return (
    <nav className="navbar">
      <Link to="/profile">profile</Link>
      <Link to="/public">all issues</Link>
      <button className="logout-btn" onClick={logout}>logout</button>
    </nav>
  )
}