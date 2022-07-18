import React from "react"
import { Outlet } from "react-router-dom"
import Auth from "./Auth.js"


export default function ProtectedRoute(props){

    console.log("ProtectedRoute Component props", props)
    
    const { token } = props
    
    console.log("ProtectedRoute Component token", token)


        return (token ?
            <Outlet />
            :
            <Auth />
        )
}