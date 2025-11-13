-- Criar tabelas
CREATE DATABASE estoque;
-- Tabela de Categorias
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos (relação N-1 com Categorias)
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  estoque INT DEFAULT 0,
  categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Fornecedores
CREATE TABLE fornecedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos (relação N-1 com Fornecedores)
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  fornecedor_id INT NOT NULL REFERENCES fornecedores(id) ON DELETE CASCADE,
  data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens do Pedido (relação N-M entre Pedidos e Produtos)
CREATE TABLE pedido_itens (
  id SERIAL PRIMARY KEY,
  pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id INT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  quantidade INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pedido_id, produto_id)
);

-- Inserir dados de exemplo
INSERT INTO categorias (nome, descricao) VALUES
  ('Eletrônicos', 'Produtos eletrônicos em geral'),
  ('Informática', 'Computadores e acessórios'),
  ('Periféricos', 'Teclados, mouses, monitores');

INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id) VALUES
  ('Notebook Dell', 'Notebook i7 com 16GB RAM', 4500.00, 10, 2),
  ('Mouse Logitech', 'Mouse sem fio 2.4GHz', 150.00, 50, 3),
  ('Teclado Mecânico', 'Teclado RGB com switches mecânicos', 350.00, 25, 3),
  ('Monitor 24"', 'Monitor Full HD IPS', 800.00, 15, 3);

INSERT INTO fornecedores (nome, email, telefone) VALUES
  ('Distribuição Tech', 'contato@techdist.com', '(11) 3000-0000'),
  ('Eletrônicos Brasil', 'vendas@eletbrasil.com', '(21) 3500-0000');

INSERT INTO pedidos (fornecedor_id, data_pedido, status) VALUES
  (1, CURRENT_TIMESTAMP, 'entregue'),
  (2, CURRENT_TIMESTAMP, 'pendente');

INSERT INTO pedido_itens (pedido_id, produto_id, quantidade) VALUES
  (1, 1, 5),
  (1, 2, 20),
  (2, 3, 10),
  (2, 4, 3);
