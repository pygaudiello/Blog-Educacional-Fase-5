# 🎓 Blog Aulas — Guia Completo de Execução (Backend + Frontend)

O **Blog Aulas** é uma aplicação educacional de blogging criada para facilitar a comunicação entre docentes e discentes, permitindo publicações, interações e compartilhamento de conteúdo didático.  

Este guia cobre **toda a documentação necessária para rodar o projeto**, tanto **localmente** quanto **via Docker**, incluindo **frontend** e **backend**.

---

## 🧭 Sumário

1. [Visão Geral do Projeto](#-visão-geral-do-projeto)  
2. [Estrutura de Pastas](#-estrutura-de-pastas)  
3. [Requisitos no Windows](#-requisitos-no-windows)  
4. [Execução Local (sem Docker)](#-execução-local-sem-docker)  
5. [Execução via Docker](#-execução-via-docker)  
6. [Testes e Verificação](#-testes-e-verificação)  
7. [Solução de Problemas](#-solução-de-problemas)  
8. [Scripts Úteis](#-scripts-úteis)  
9. [Licença e Créditos](#-licença-e-créditos)

---

## 🧩 Visão Geral do Projeto

- **Backend:** Node.js + Express + SQLite  
- **Frontend:** React (Vite) + TypeScript  
- **Banco de Dados:** SQLite 
- **Execução:** Local (Windows) ou via Docker Compose  

O backend fornece uma API RESTful para gerenciamento de usuários, autenticação e postagens.  
O frontend consome essa API e oferece uma interface moderna e responsiva.

---

## 🗂️ Estrutura de Pastas

```
blog_aulas/
│
├── blog_backend/
│   ├── index.js
│   ├── .env
│   ├── database.sqlite
│   ├── package.json
│   ├── middleware/
│   │   └── auth.js
│   └── ...
│
├── blog_frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   └── pages/
│   └── public/
│
└── docker-compose.yml
```

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend
- **React.js** 
- **Vite**  
- **TypeScript**  
- **Axios** 
- **React Router DOM** 
- **CSS Modules**.

### ⚙️ Backend
- **Node.js**  
- **Express.js** 
- **SQLite**   
- **JWT (JSON Web Token)**
- **Dotenv** 
- **Cors**.  


---

## 💻 Execução Local (sem Docker)

### 1. Clonar o projeto

Abra o **PowerShell** ou **Terminal do VS Code**:

```bash
git clone https://github.com/seu-usuario/blog_aulas.git
cd blog_aulas
```

---

### 2. Instalar dependências

#### Backend
```bash
cd blog_backend
npm install
```

#### Frontend
```bash
cd ../blog_frontend
npm install
```

---

### 3. Configurar o arquivo `.env` no backend

Crie `blog_backend/.env` com o conteúdo:

```
PORT=3000
JWT_SECRET=sua_chave_secreta
DATABASE_URL=./database.sqlite
```

---

### 4. Iniciar o backend

No diretório `blog_backend/`:

```bash
npm start
```

O servidor API estará em:  
👉 **http://localhost:3000**

---

### 5. Iniciar o frontend

Em outro terminal, dentro de `blog_frontend/`:

```bash
npm run dev
```

O frontend rodará em:  
👉 **http://localhost:5173**

---

### 6. Conectar o frontend ao backend

No arquivo de configuração do frontend (geralmente `src/services/api.ts` ou `.env`), defina o endpoint da API:

```
VITE_API_URL=http://localhost:3000
```

---

## 🐳 Execução via Docker

### 1. Criar o arquivo `Dockerfile` no backend (`blog_backend/`)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

---

### 2. Criar o arquivo `Dockerfile` no frontend (`blog_frontend/`)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

### 3. Criar o `docker-compose.yml` na raiz

```yaml
version: "3.9"
services:
  backend:
    build: ./blog_backend
    container_name: blog_aulas_backend
    ports:
      - "3000:3000"
    env_file:
      - ./blog_backend/.env
    volumes:
      - ./blog_backend:/app
    restart: unless-stopped

  frontend:
    build: ./blog_frontend
    container_name: blog_aulas_frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:3000
    volumes:
      - ./blog_frontend:/app
    restart: unless-stopped
```

---

### 4. Subir os containers

Na raiz do projeto:

```bash
docker-compose up --build
```

Após o build:

- Frontend: **http://localhost:5173**  
- Backend: **http://localhost:3000**

---

## 🧪 Testes e Verificação

- Testar API:
  ```bash
  curl http://localhost:3000
  ```
- Testar frontend:
  Acesse [http://localhost:5173](http://localhost:5173)
- Logs do Docker:
  ```bash
  docker logs blog_aulas_backend
  docker logs blog_aulas_frontend
  ```

---

## ⚠️ Solução de Problemas

| Erro | Causa | Solução |
|------|--------|----------|
| `SQLITE_CANTOPEN` | Caminho incorreto do banco | Ajuste `DATABASE_URL` no `.env` |
| `Cannot GET /` | Frontend não iniciado | Rode `npm run dev` no frontend |
| `Invalid token` | JWT inválido | Gere novo token com a chave correta |
| `Port already in use` | Portas 3000/5173 ocupadas | Altere `PORT` e `VITE_PORT` |
| `CORS error` | Conexão bloqueada entre frontend e backend | Habilite CORS no Express (`cors()` middleware) |

---

## 📦 Scripts Úteis

### Backend
| Comando | Descrição |
|----------|------------|
| `npm start` | Inicia o servidor |
| `npm install` | Instala dependências |
| `npm test` | Executa testes (se configurados) |

### Frontend
| Comando | Descrição |
|----------|------------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila para produção |
| `npm run preview` | Executa build localmente |
| `npm install` | Instala dependências |

---

## 🧠 Dica: Rodando Tudo no VS Code

1. Abra o diretório `blog_aulas/` no VS Code.  
2. Abra dois terminais:  
   - **Terminal 1:**  
     ```bash
     cd blog_backend
     npm install
     npm run dev
     ```
   - **Terminal 2:**  
     ```bash
     cd blog_frontend
     npm install
     npm run dev
     ```
3. Acesse:  
   - Frontend → [http://localhost:5173](http://localhost:5173)  
   - API → [http://localhost:3000](http://localhost:3000)

---
     
## 🪶 Testes do sistema como ADM

1. Acessando o sistema vá até a página "ADMIN"
2. Dentro da página coloque as seguintes informações:
   - **Usuário:**  
     ```bash
     prof1
     ```
   - **Senha:**  
     ```bash
     senha123
     ```
3. Pronto agora é só testar.

---
    
## 🧩 Dificuldades Encontradas

Durante o desenvolvimento do projeto **Blog Aulas**, algumas dificuldades foram encontradas nas etapas de integração e execução:

1. **Integração entre Frontend e Backend**  
   A comunicação entre o cliente React e a API Express apresentou falhas iniciais devido a configurações incorretas de CORS e de variáveis de ambiente (URLs de API).

2. **Configuração do Ambiente de Desenvolvimento**  
   Diferenças entre o ambiente local (Windows) e o WSL/Docker dificultaram a padronização das dependências e do banco de dados SQLite.

3. **Autenticação e Rotas Protegidas**  
   A implementação do sistema de autenticação JWT exigiu ajustes no middleware e nas rotas privadas, garantindo segurança e persistência de sessão no navegador.

4. **Build e Deploy do Frontend**  
   Alguns erros ocorreram durante o processo de build do Vite, relacionados à compatibilidade entre versões do Node.js e pacotes TypeScript.

---

## 🧠 Soluções Aplicadas

1. **Correção do CORS e variáveis de ambiente**  
   Foi configurado o middleware `cors()` no backend e ajustado o `.env` para permitir a comunicação entre as portas `3000` (frontend) e `5000` (backend).

2. **Middleware de autenticação JWT**  
   Foi criado um middleware dedicado em `middleware/auth.js` para validar tokens antes de acessar rotas restritas, protegendo dados sensíveis.

4. **Scripts unificados de execução**  
   Foram adicionados scripts `npm run dev`, `npm run build` e `npm start` tanto no frontend quanto no backend, simplificando o processo de execução.

---

## 📚 Aprendizados

O desenvolvimento deste projeto proporcionou diversos aprendizados práticos:

- **Integração completa entre frontend e backend** utilizando APIs RESTful.    
- **Criação de um sistema de autenticação JWT** com rotas seguras.  
- **Organização de código em camadas (controllers, services, models)**, facilitando manutenção e testes.  
- **Melhores práticas no uso do Vite e React** com TypeScript.  
- **Importância da documentação técnica** para reprodutibilidade e entendimento do projeto por terceiros.  

Esses aprendizados reforçam as boas práticas de desenvolvimento full-stack e a importância da documentação clara e detalhada para fins acadêmicos e profissionais.

## 📚 Vídeo do Projeto

Link do Vídeo: 
- Google Drive: [Clique aqui](https://drive.google.com/drive/folders/1VlSmutBPg8NNvxvmzlxdPnzYOmFdDhGN?usp=sharing)
- Youtube: [Clique aqui](https://youtu.be/iZ_Sku2wnTk)

---
## 📜 Licença e Créditos

Este projeto foi desenvolvido para fins educacionais (FIAP Tech Challenge).
# Front_End_Fiap_PosTech
