const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { Pool } = require("pg")
require("dotenv").config()

const app = express()

const allowedOrigins = [
  "http://localhost:3000", // quando testa local
  "http://frontend:3000",   // dentro da rede docker
];

app.use(cors({
  origin: function(origin, callback){
    // permitir requisições sem origin (ex: Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `O CORS para ${origin} não está permitido`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const pool = new Pool({
  user: process.env.DB_USER || "estoque",
  password: process.env.DB_PASSWORD || "estoque123",
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "estoque_db",
})

// Verifica conexão com banco
pool.on("connect", () => {
  console.log("Conectado ao PostgreSQL")
})



// ==================== ROTAS DE CATEGORIAS ====================
// GET - Listar todas as categorias
app.get("/api/categorias", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categorias ORDER BY id")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar categorias" })
  }
})

// GET - Buscar categoria por ID
app.get("/api/categorias/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categorias WHERE id = $1", [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Categoria não encontrada" })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar categoria" })
  }
})

// POST - Criar categoria
app.post("/api/categorias", async (req, res) => {
  try {
    const { nome, descricao } = req.body
    if (!nome) return res.status(400).json({ erro: "Nome é obrigatório" })

    const result = await pool.query("INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING *", [
      nome,
      descricao || "",
    ])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao criar categoria" })
  }
})

// PUT - Atualizar categoria
app.put("/api/categorias/:id", async (req, res) => {
  try {
    const { nome, descricao } = req.body
    const result = await pool.query("UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *", [
      nome,
      descricao,
      req.params.id,
    ])
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Categoria não encontrada" })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao atualizar categoria" })
  }
})

// DELETE - Deletar categoria
app.delete("/api/categorias/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM categorias WHERE id = $1 RETURNING *", [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Categoria não encontrada" })
    }
    res.json({ mensagem: "Categoria deletada com sucesso" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao deletar categoria" })
  }
})

// ==================== ROTAS DE PRODUTOS ====================
// GET - Listar todos os produtos com categoria
app.get("/api/produtos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nome as categoria_nome 
      FROM produtos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      ORDER BY p.id
    `)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar produtos" })
  }
})

// GET - Buscar produto por ID
app.get("/api/produtos/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT p.*, c.nome as categoria_nome 
      FROM produtos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.id = $1
    `,
      [req.params.id],
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar produto" })
  }
})

// POST - Criar produto
app.post("/api/produtos", async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, categoria_id } = req.body
    if (!nome || !preco || !estoque) {
      return res.status(400).json({ erro: "Nome, preço e estoque são obrigatórios" })
    }

    const result = await pool.query(
      "INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nome, descricao || "", preco, estoque, categoria_id || null],
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao criar produto" })
  }
})

// PUT - Atualizar produto
app.put("/api/produtos/:id", async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, categoria_id } = req.body
    const result = await pool.query(
      "UPDATE produtos SET nome = $1, descricao = $2, preco = $3, estoque = $4, categoria_id = $5 WHERE id = $6 RETURNING *",
      [nome, descricao, preco, estoque, categoria_id, req.params.id],
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao atualizar produto" })
  }
})

// DELETE - Deletar produto
app.delete("/api/produtos/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM produtos WHERE id = $1 RETURNING *", [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" })
    }
    res.json({ mensagem: "Produto deletado com sucesso" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao deletar produto" })
  }
})

// ==================== ROTAS DE FORNECEDORES ====================
// GET - Listar fornecedores
app.get("/api/fornecedores", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM fornecedores ORDER BY id")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar fornecedores" })
  }
})

// POST - Criar fornecedor
app.post("/api/fornecedores", async (req, res) => {
  try {
    const { nome, email, telefone } = req.body
    if (!nome) return res.status(400).json({ erro: "Nome é obrigatório" })

    const result = await pool.query(
      "INSERT INTO fornecedores (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *",
      [nome, email || "", telefone || ""],
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao criar fornecedor" })
  }
})

// PUT - Atualizar fornecedor
app.put("/api/fornecedores/:id", async (req, res) => {
  try {
    const { nome, email, telefone } = req.body
    const result = await pool.query(
      "UPDATE fornecedores SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING *",
      [nome, email, telefone, req.params.id],
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Fornecedor não encontrado" })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao atualizar fornecedor" })
  }
})

// DELETE - Deletar fornecedor
app.delete("/api/fornecedores/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM fornecedores WHERE id = $1 RETURNING *", [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Fornecedor não encontrado" })
    }
    res.json({ mensagem: "Fornecedor deletado com sucesso" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao deletar fornecedor" })
  }
})

// ==================== ROTAS DE PEDIDOS ====================
// GET - Listar pedidos com detalhes
app.get("/api/pedidos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, f.nome as fornecedor_nome
      FROM pedidos p
      LEFT JOIN fornecedores f ON p.fornecedor_id = f.id
      ORDER BY p.id DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar pedidos" })
  }
})

// GET - Listar itens do pedido
app.get("/api/pedidos/:id/itens", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT pi.*, pr.nome as produto_nome, pr.preco
      FROM pedido_itens pi
      JOIN produtos pr ON pi.produto_id = pr.id
      WHERE pi.pedido_id = $1
    `,
      [req.params.id],
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar itens do pedido" })
  }
})

// POST - Criar pedido
app.post("/api/pedidos", async (req, res) => {
  try {
    const { fornecedor_id, data_pedido, status } = req.body
    if (!fornecedor_id) return res.status(400).json({ erro: "Fornecedor é obrigatório" })

    const result = await pool.query(
      "INSERT INTO pedidos (fornecedor_id, data_pedido, status) VALUES ($1, $2, $3) RETURNING *",
      [fornecedor_id, data_pedido || new Date(), status || "pendente"],
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao criar pedido" })
  }
})

// POST - Adicionar item ao pedido (relação N-M)
app.post("/api/pedidos/:id/itens", async (req, res) => {
  try {
    const { produto_id, quantidade } = req.body
    if (!produto_id || !quantidade) {
      return res.status(400).json({ erro: "Produto e quantidade são obrigatórios" })
    }

    const result = await pool.query(
      "INSERT INTO pedido_itens (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3) RETURNING *",
      [req.params.id, produto_id, quantidade],
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao adicionar item ao pedido" })
  }
})

// PUT - Atualizar pedido
app.put("/api/pedidos/:id", async (req, res) => {
  try {
    const { status } = req.body
    const result = await pool.query("UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *", [status, req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Pedido não encontrado" })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao atualizar pedido" })
  }
})

// DELETE - Deletar pedido
app.delete("/api/pedidos/:id", async (req, res) => {
  try {
    // Primeiro deleta os itens do pedido
    await pool.query("DELETE FROM pedido_itens WHERE pedido_id = $1", [req.params.id])
    // Depois deleta o pedido
    const result = await pool.query("DELETE FROM pedidos WHERE id = $1 RETURNING *", [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Pedido não encontrado" })
    }
    res.json({ mensagem: "Pedido deletado com sucesso" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao deletar pedido" })
  }
})

// DELETE - Remover item do pedido
app.delete("/api/pedidos/:pedido_id/itens/:item_id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM pedido_itens WHERE id = $1 AND pedido_id = $2 RETURNING *", [
      req.params.item_id,
      req.params.pedido_id,
    ])
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Item não encontrado" })
    }
    res.json({ mensagem: "Item removido com sucesso" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao remover item" })
  }
})

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
