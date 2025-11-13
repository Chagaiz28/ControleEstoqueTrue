"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE = `${process.env.REACT_APP_API_URL}/api`

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  })

  useEffect(() => {
    fetchFornecedores()
  }, [])

  const fetchFornecedores = async () => {
    try {
      const res = await axios.get(`${API_BASE}/fornecedores`)
      setFornecedores(res.data)
      setError("")
    } catch (err) {
      setError("Erro ao carregar fornecedores")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.nome) {
      setError("Nome é obrigatório")
      return
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/fornecedores/${editingId}`, formData)
        setSuccess("Fornecedor atualizado com sucesso")
      } else {
        await axios.post(`${API_BASE}/fornecedores`, formData)
        setSuccess("Fornecedor criado com sucesso")
      }

      setFormData({ nome: "", email: "", telefone: "" })
      setShowModal(false)
      setEditingId(null)
      fetchFornecedores()
    } catch (err) {
      setError(err.response?.data?.erro || "Erro ao salvar fornecedor")
    }
  }

  const handleEdit = (fornecedor) => {
    setFormData(fornecedor)
    setEditingId(fornecedor.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este fornecedor?")) {
      try {
        await axios.delete(`${API_BASE}/fornecedores/${id}`)
        setSuccess("Fornecedor deletado com sucesso")
        fetchFornecedores()
      } catch (err) {
        setError("Erro ao deletar fornecedor")
      }
    }
  }

  const openModal = () => {
    setFormData({ nome: "", email: "", telefone: "" })
    setEditingId(null)
    setShowModal(true)
  }

  return (
    <div>
      <h2 className="page-title">Fornecedores</h2>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <button className="button" onClick={openModal}>
        Novo Fornecedor
      </button>

      <table style={{ marginTop: "2rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((fornecedor) => (
            <tr key={fornecedor.id}>
              <td>{fornecedor.id}</td>
              <td>{fornecedor.nome}</td>
              <td>{fornecedor.email || "-"}</td>
              <td>{fornecedor.telefone || "-"}</td>
              <td>
                <button className="button" onClick={() => handleEdit(fornecedor)}>
                  Editar
                </button>
                <button className="button danger" onClick={() => handleDelete(fornecedor.id)}>
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-header">{editingId ? "Editar Fornecedor" : "Novo Fornecedor"}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="button secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="button">
                  {editingId ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Fornecedores
