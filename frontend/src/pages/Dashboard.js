"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE = `${process.env.REACT_APP_API_URL}/api`

function Dashboard() {
  const [stats, setStats] = useState({
    produtos: 0,
    categorias: 0,
    fornecedores: 0,
    pedidos: 0,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produtosRes, categoriasRes, fornecedoresRes, pedidosRes] = await Promise.all([
          axios.get(`${API_BASE}/produtos`),
          axios.get(`${API_BASE}/categorias`),
          axios.get(`${API_BASE}/fornecedores`),
          axios.get(`${API_BASE}/pedidos`),
        ])

        setStats({
          produtos: produtosRes.data.length,
          categorias: categoriasRes.data.length,
          fornecedores: fornecedoresRes.data.length,
          pedidos: pedidosRes.data.length,
        })
      } catch (err) {
        setError("Erro ao carregar dados do dashboard")
        console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>

      {error && <div className="alert error">{error}</div>}

      <div className="grid">
        <div className="card">
          <div className="card-title">Produtos</div>
          <div className="card-value">{stats.produtos}</div>
        </div>
        <div className="card">
          <div className="card-title">Categorias</div>
          <div className="card-value">{stats.categorias}</div>
        </div>
        <div className="card">
          <div className="card-title">Fornecedores</div>
          <div className="card-value">{stats.fornecedores}</div>
        </div>
        <div className="card">
          <div className="card-title">Pedidos</div>
          <div className="card-value">{stats.pedidos}</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
