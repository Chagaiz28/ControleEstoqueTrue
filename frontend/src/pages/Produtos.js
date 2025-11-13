"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE = `${process.env.REACT_APP_API_URL}/api`

function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    categoria_id: "",
  })

  useEffect(() => {
    fetchProdutos()
    fetchCategorias()
  }, [])

  const fetchProdutos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/produtos`)
      setProdutos(res.data)
      setError("")
    } catch (err) {
      setError("Erro ao carregar produtos")
    }
  }

  const fetchCategorias = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categorias`)
      setCategorias(res.data)
    } catch (err) {
      console.error("Erro ao carregar categorias")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.nome || !formData.preco || !formData.estoque) {
      setError("Nome, preço e estoque são obrigatórios")
      return
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/produtos/${editingId}`, formData)
        setSuccess("Produto atualizado com sucesso")
      } else {
        await axios.post(`${API_BASE}/produtos`, formData)
        setSuccess("Produto criado com sucesso")
      }

      setFormData({ nome: "", descricao: "", preco: "", estoque: "", categoria_id: "" })
      setShowModal(false)
      setEditingId(null)
      fetchProdutos()
    } catch (err) {
      setError(err.response?.data?.erro || "Erro ao salvar produto")
    }
  }

  const handleEdit = (produto) => {
    setFormData(produto)
    setEditingId(produto.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await axios.delete(`${API_BASE}/produtos/${id}`)
        setSuccess("Produto deletado com sucesso")
        fetchProdutos()
      } catch (err) {
        setError("Erro ao deletar produto")
      }
    }
  }

  const openModal = () => {
    setFormData({ nome: "", descricao: "", preco: "", estoque: "", categoria_id: "" })
    setEditingId(null)
    setShowModal(true)
  }

  return (
    <div>
      <h2 className="page-title">Produtos</h2>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <button className="button" onClick={openModal}>
        Novo Produto
      </button>

      <table style={{ marginTop: "2rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.id}</td>
              <td>{produto.nome}</td>
              <td>{produto.descricao}</td>
              <td>R$ {Number.parseFloat(produto.preco).toFixed(2)}</td>
              <td>{produto.estoque}</td>
              <td>{produto.categoria_nome || "Sem categoria"}</td>
              <td>
                <button className="button" onClick={() => handleEdit(produto)}>
                  Editar
                </button>
                <button className="button danger" onClick={() => handleDelete(produto.id)}>
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
            <h3 className="modal-header">{editingId ? "Editar Produto" : "Novo Produto"}</h3>

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
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Preço *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estoque *</label>
                <input
                  type="number"
                  value={formData.estoque}
                  onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
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

export default Produtos
