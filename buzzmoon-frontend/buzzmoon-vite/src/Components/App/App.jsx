import * as React from "react"
import {
  BrowserRouter,
  Route,
  Routes,
  Link
} from "react-router-dom"

import CompeteView from "../CompeteView/CompeteView"
import Navbar from "../Navbar/Navbar"
import './App.css'


function App() {


  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <CompeteView />

      </BrowserRouter>
    </div>
  )
}

export default App
