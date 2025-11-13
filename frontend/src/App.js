"use client"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Produtos from "./pages/Produtos"
import Fornecedores from "./pages/Fornecedores"
import Pedidos from "./pages/Pedidos"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="logo">Estoque Manager</h1>
            <ul className="nav-links">
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/produtos">Produtos</Link>
              </li>
              <li>
                <Link to="/fornecedores">Fornecedores</Link>
              </li>
              <li>
                <Link to="/pedidos">Pedidos</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/pedidos" element={<Pedidos />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
