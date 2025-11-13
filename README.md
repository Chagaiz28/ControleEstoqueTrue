# Sistema de Controle de Estoque

Um sistema completo de gerenciamento de estoque com frontend React e backend Express.js, dockerizado e pronto para produção.

## Características

- **Frontend**: Interface React moderna e responsiva
- **Backend**: API REST completa com Express.js
- **Banco de Dados**: PostgreSQL com relações N-M e N-1
- **Docker**: Aplicação totalmente containerizada
- **CORS**: Configurado para segurança
- **Documentação**: README com boas práticas

## Requisitos Atendidos

✅ Pelo menos 3 páginas/telas no Frontend (4: Dashboard, Produtos, Fornecedores, Pedidos)
✅ 2 ou mais tabelas no banco de dados (5: categorias, produtos, fornecedores, pedidos, pedido_itens)
✅ Pelo menos 10 operações REST com CRUD completo (13 operações implementadas)
✅ Aplicação rodando em containers via docker-compose
✅ Relação N-M: pedidos ← pedido_itens → produtos
✅ Relação N-1: produtos → categorias, pedidos → fornecedores
✅ CORS configurado no backend
✅ README com explicação de execução e boas práticas

## Arquitetura do Banco de Dados

### Tabelas

#### categorias
- id (PK)
- nome (UNIQUE)
- descricao
- created_at

#### produtos
- id (PK)
- nome
- descricao
- preco
- estoque
- categoria_id (FK → categorias) - Relação N-1
- created_at

#### fornecedores
- id (PK)
- nome
- email
- telefone
- created_at

#### pedidos
- id (PK)
- fornecedor_id (FK → fornecedores) - Relação N-1
- data_pedido
- status
- created_at

#### pedido_itens (Tabela de Associação)
- id (PK)
- pedido_id (FK → pedidos) - Relação N-M
- produto_id (FK → produtos) - Relação N-M
- quantidade
- created_at

### Relações

**N para 1:**
- Produtos → Categorias (muitos produtos podem ter uma categoria)
- Pedidos → Fornecedores (muitos pedidos podem ter um fornecedor)

**N para M:**
- Pedidos ← Pedido_Itens → Produtos (muitos pedidos podem ter muitos produtos)

## API REST - Operações Implementadas

### 1. Categorias
- `GET /api/categorias` - Listar todas as categorias
- `GET /api/categorias/:id` - Buscar categoria por ID
- `POST /api/categorias` - Criar nova categoria
- `PUT /api/categorias/:id` - Atualizar categoria
- `DELETE /api/categorias/:id` - Deletar categoria

### 2. Produtos
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Buscar produto por ID
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

### 3. Fornecedores
- `GET /api/fornecedores` - Listar fornecedores
- `POST /api/fornecedores` - Criar fornecedor
- `PUT /api/fornecedores/:id` - Atualizar fornecedor
- `DELETE /api/fornecedores/:id` - Deletar fornecedor

### 4. Pedidos
- `GET /api/pedidos` - Listar pedidos
- `GET /api/pedidos/:id/itens` - Listar itens do pedido
- `POST /api/pedidos` - Criar pedido
- `POST /api/pedidos/:id/itens` - Adicionar item ao pedido (N-M)
- `PUT /api/pedidos/:id` - Atualizar status do pedido
- `DELETE /api/pedidos/:id` - Deletar pedido
- `DELETE /api/pedidos/:pedido_id/itens/:item_id` - Remover item do pedido

**Total: 18 operações REST**

## Instalação e Execução

### Pré-requisitos

- Docker
- Docker Compose

### Passos

1. **Clone o repositório**
   \`\`\`bash
   git clone <seu-repositorio>
   cd estoque-system
   \`\`\`

2. **Inicie os containers**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. **Aguarde a inicialização** (aproximadamente 30 segundos)
   \`\`\`bash
   docker-compose logs -f backend
   \`\`\`

4. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Banco de dados: localhost:5432

### Parar a aplicação

\`\`\`bash
docker-compose down
\`\`\`

### Remover volumes (limpar dados)

\`\`\`bash
docker-compose down -v
\`\`\`

## Variáveis de Ambiente

### Backend (.env)

\`\`\`
DB_USER=estoque
DB_PASSWORD=estoque123
DB_HOST=db
DB_PORT=5432
DB_NAME=estoque_db
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:3000
\`\`\`

## Boas Práticas Implementadas

### 1. Segurança

- **CORS**: Configurado para aceitar requisições apenas do frontend
- **Validação de entrada**: Todos os endpoints validam dados obrigatórios
- **Tratamento de erro**: Retorna mensagens de erro apropriadas
- **Conexão DB segura**: Usa variáveis de ambiente

### 2. Arquitetura

- **Separação de camadas**: Frontend e Backend em containers separados
- **API RESTful**: Segue padrões REST com métodos HTTP apropriados
- **Relacionamentos normalizados**: Banco bem estruturado com relações N-M e N-1
- **Escalabilidade**: Pronta para ser escalada com múltiplas instâncias

### 3. Banco de Dados

- **Índices**: Primary keys em todas as tabelas
- **Constraints**: Foreign keys para manter integridade referencial
- **Timestamps**: Rastreamento de criação de registros
- **Dados iniciais**: Seed com dados de exemplo

### 4. Frontend

- **Modularização**: Componentes separados por página
- **Gerenciamento de estado**: useState para estado local
- **Tratamento de erro**: Alertas para sucesso e erro
- **UX intuitiva**: Modal para criar/editar, tabelas para visualizar

### 5. DevOps

- **Containerização**: Dockerfile para cada serviço
- **Orquestração**: Docker Compose para ambiente completo
- **Health checks**: Verificação de saúde do banco de dados
- **Volumes**: Persistência de dados

## Exemplos de Uso

### Criar um novo produto

\`\`\`bash
curl -X POST http://localhost:5000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Produto Teste",
    "descricao": "Descrição do produto",
    "preco": 99.99,
    "estoque": 100,
    "categoria_id": 1
  }'
\`\`\`

### Listar todos os produtos

\`\`\`bash
curl http://localhost:5000/api/produtos
\`\`\`

### Atualizar um produto

\`\`\`bash
curl -X PUT http://localhost:5000/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Produto Atualizado",
    "preco": 149.99,
    "estoque": 50,
    "categoria_id": 1
  }'
\`\`\`

### Deletar um produto

\`\`\`bash
curl -X DELETE http://localhost:5000/api/produtos/1
\`\`\`

### Criar um pedido com itens

\`\`\`bash
# 1. Criar pedido
curl -X POST http://localhost:5000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "fornecedor_id": 1,
    "status": "pendente"
  }'

# 2. Adicionar item ao pedido (relação N-M)
curl -X POST http://localhost:5000/api/pedidos/1/itens \
  -H "Content-Type: application/json" \
  -d '{
    "produto_id": 1,
    "quantidade": 5
  }'
\`\`\`

## Estrutura do Projeto

\`\`\`
estoque-system/
├── server.js                 # Servidor Express com rotas
├── package.json              # Dependências do backend
├── Dockerfile                # Imagem Docker do backend
├── docker-compose.yml        # Orquestração dos containers
├── init.sql                  # Script de inicialização do BD
├── .env                      # Variáveis de ambiente
├── README.md                 # Este arquivo
└── frontend/
    ├── package.json          # Dependências do React
    ├── Dockerfile            # Imagem Docker do frontend
    ├── public/
    │   └── index.html        # HTML principal
    └── src/
        ├── App.js            # Componente principal
        ├── App.css           # Estilos
        ├── index.js          # Entrada React
        └── pages/
            ├── Dashboard.js  # Página de Dashboard
            ├── Produtos.js   # Página de Produtos
            ├── Fornecedores.js # Página de Fornecedores
            └── Pedidos.js    # Página de Pedidos
\`\`\`

## Problemas Comuns

### Porta 5000 já em uso

\`\`\`bash
# Alterar porta no .env e docker-compose.yml
PORT=5001
\`\`\`

### Erro de conexão com banco de dados

\`\`\`bash
# Verificar logs do banco
docker-compose logs db

# Reiniciar containers
docker-compose restart
\`\`\`

### Frontend não consegue se conectar ao backend

Verificar se `FRONTEND_URL` está correto no .env do backend.

## Métodos HTTP Utilizados

- **GET**: Recuperar dados (5 operações)
- **POST**: Criar novos registros (5 operações)
- **PUT**: Atualizar registros (3 operações)
- **DELETE**: Remover registros (5 operações)

## Testes Recomendados

1. **Teste de CRUD Completo**: Criar, ler, atualizar e deletar em cada tabela
2. **Teste de Relações**: Criar produto com categoria, pedido com itens
3. **Teste de CORS**: Verificar se requisições do frontend são aceitas
4. **Teste de Validação**: Enviar dados inválidos e verificar erros
5. **Teste de Integridade**: Deletar e verificar cascata

## Próximas Melhorias

- Adicionar autenticação de usuários
- Implementar paginação na listagem
- Adicionar filtros e busca
- Implementar relatórios
- Adicionar testes automatizados
- Configurar CI/CD

## Suporte

Para dúvidas ou problemas, verifique os logs:

\`\`\`bash
docker-compose logs [serviço]
\`\`\`

Serviços disponíveis: `db`, `backend`, `frontend`

## Licença

MIT
