"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE = `${process.env.REACT_APP_API_URL}/api`

function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [produtos, setProdutos] = useState([])
  const [fornecedores, setFornecedores] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showItensModal, setShowItensModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedPedidoId, setSelectedPedidoId] = useState(null)
  const [pedidoItens, setPedidoItens] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    fornecedor_id: "",
    status: "pendente",
  })
  const [itemData, setItemData] = useState({
    produto_id: "",
    quantidade: "",
  })

  useEffect(() => {
    fetchPedidos()
    fetchProdutos()
    fetchFornecedores()
  }, [])

  const fetchPedidos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pedidos`)
      setPedidos(Array.isArray(res.data) ? res.data : [])
      setError("")
    } catch (err) {
      setError("Erro ao carregar pedidos")
    }
  }

  const fetchProdutos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/produtos`)
      setProdutos(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error("Erro ao carregar produtos")
    }
  }

  const fetchFornecedores = async () => {
    try {
      const res = await axios.get(`${API_BASE}/fornecedores`)
      setFornecedores(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error("Erro ao carregar fornecedores")
    }
  }

  const fetchPedidoItens = async (pedidoId) => {
    try {
      const res = await axios.get(`${API_BASE}/pedidos/${pedidoId}/itens`)
      setPedidoItens(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error("Erro ao carregar itens do pedido")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.fornecedor_id) {
      setError("Fornecedor é obrigatório")
      return
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/pedidos/${editingId}`, formData)
        setSuccess("Pedido atualizado com sucesso")
      } else {
        await axios.post(`${API_BASE}/pedidos`, formData)
        setSuccess("Pedido criado com sucesso")
      }

      setFormData({ fornecedor_id: "", status: "pendente" })
      setShowModal(false)
      setEditingId(null)
      fetchPedidos()
    } catch (err) {
      setError(err.response?.data?.erro || "Erro ao salvar pedido")
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()

    if (!itemData.produto_id || !itemData.quantidade) {
      setError("Produto e quantidade são obrigatórios")
      return
    }

    try {
      await axios.post(`${API_BASE}/pedidos/${selectedPedidoId}/itens`, itemData)
      setSuccess("Item adicionado com sucesso")
      setItemData({ produto_id: "", quantidade: "" })
      fetchPedidoItens(selectedPedidoId)
    } catch (err) {
      setError(err.response?.data?.erro || "Erro ao adicionar item")
    }
  }

  const handleEdit = (pedido) => {
    setFormData({ fornecedor_id: pedido.fornecedor_id, status: pedido.status })
    setEditingId(pedido.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este pedido?")) {
      try {
        await axios.delete(`${API_BASE}/pedidos/${id}`)
        setSuccess("Pedido deletado com sucesso")
        fetchPedidos()
      } catch (err) {
        setError("Erro ao deletar pedido")
      }
    }
  }

  const handleDeleteItem = async (pedidoId, itemId) => {
    try {
      await axios.delete(`${API_BASE}/pedidos/${pedidoId}/itens/${itemId}`)
      setSuccess("Item removido com sucesso")
      fetchPedidoItens(pedidoId)
    } catch (err) {
      setError("Erro ao remover item")
    }
  }

  const openModal = () => {
    setFormData({ fornecedor_id: "", status: "pendente" })
    setEditingId(null)
    setShowModal(true)
  }

  const openItensModal = (pedidoId) => {
    setSelectedPedidoId(pedidoId)
    fetchPedidoItens(pedidoId)
    setShowItensModal(true)
  }

  return (
    <div>
      <h2 className="page-title">Pedidos</h2>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <button className="button" onClick={openModal}>
        Novo Pedido
      </button>

      <table style={{ marginTop: "2rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fornecedor</th>
            <th>Data</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(pedidos) ? pedidos : []).map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.fornecedor_nome}</td>
              <td>{pedido.data_pedido ? new Date(pedido.data_pedido).toLocaleDateString() : ""}</td>
              <td>{pedido.status}</td>
              <td>
                <button className="button" onClick={() => openItensModal(pedido.id)}>
                  Itens
                </button>
                <button className="button" onClick={() => handleEdit(pedido)}>
                  Editar
                </button>
                <button className="button danger" onClick={() => handleDelete(pedido.id)}>
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
            <h3 className="modal-header">{editingId ? "Editar Pedido" : "Novo Pedido"}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Fornecedor *</label>
                <select
                  value={formData.fornecedor_id}
                  onChange={(e) => setFormData({ ...formData, fornecedor_id: e.target.value })}
                  required
                >
                  <option value="">Selecione um fornecedor</option>
                  {(Array.isArray(fornecedores) ? fornecedores : []).map((forn) => (
                    <option key={forn.id} value={forn.id}>
                      {forn.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pendente">Pendente</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
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

      {showItensModal && (
        <div className="modal" onClick={() => setShowItensModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-header">Itens do Pedido</h3>

            <table style={{ marginBottom: "1.5rem" }}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(pedidoItens) ? pedidoItens : []).map((item) => (
                  <tr key={item.id}>
                    <td>{item.produto_nome}</td>
                    <td>{item.quantidade}</td>
                    <td>R$ {Number.parseFloat(item.preco).toFixed(2)}</td>
                    <td>
                      <button
                        className="button danger"
                        onClick={() => handleDeleteItem(selectedPedidoId, item.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <label>Produto</label>
                <select
                  value={itemData.produto_id}
                  onChange={(e) => setItemData({ ...itemData, produto_id: e.target.value })}
                >
                  <option value="">Selecione um produto</option>
                  {(Array.isArray(produtos) ? produtos : []).map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  value={itemData.quantidade}
                  onChange={(e) => setItemData({ ...itemData, quantidade: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="button secondary" onClick={() => setShowItensModal(false)}>
                  Fechar
                </button>
                <button type="submit" className="button">
                  Adicionar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pedidos
