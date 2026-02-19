# Tech Challenge – Fase 5

## Descrição do Projeto

Este projeto foi desenvolvido como parte do **Tech Challenge – Fase 4** da Pós-Graduação em Tecnologia. O objetivo é a construção de uma aplicação completa, composta por **Backend em Node.js** e **Aplicação Mobile utilizando Expo (React Native + TypeScript)**, simulando uma plataforma educacional interativa com autenticação, controle de perfis, publicação de conteúdos pedagógicos, aplicação de quizzes e consumo de API.

A aplicação permite que professores realizem login, gerenciem publicações e criem quizzes avaliativos vinculados aos conteúdos, enquanto alunos podem visualizar postagens, responder aos quizzes e interagir por meio de comentários.

---

## Tecnologias Utilizadas

### Backend
* Node.js
* Express
* Sequelize
* SQLite
* JWT (JSON Web Token)
* Bcrypt
* Nodemon
* Dotenv

### Mobile
* Expo
* React Native
* TypeScript
* Axios
* React Navigation
* JWT Decode
* Expo Vector Icons

### Justificativa do Uso do Expo (Expo Go)

O **Expo** foi utilizado no desenvolvimento da aplicação mobile por simplificar o processo de configuração do ambiente React Native, permitindo maior foco na lógica da aplicação e na integração com o backend.

O uso do **Expo Go** possibilita a execução e testes da aplicação diretamente em dispositivos físicos ou em ambiente web, sem a necessidade de configurações complexas de build nativo. Essa abordagem é especialmente adequada para fins acadêmicos e prototipação, garantindo agilidade no desenvolvimento, compatibilidade multiplataforma e facilidade de validação das funcionalidades implementadas.

---

## Estrutura do Projeto Simplificada

```
Fase-4-Pos-Tech-Fiap
│
├── Projeto_FrontEnd_Fiap-main
│   └── blog_aulas
│       ├── blog_backend
│       └── blog_frontend 
│
└── Projeto_Mobile_Fiap
```
### Observação sobre o diretório blog_frontend

O diretório **blog_frontend** faz parte de uma versão anterior do projeto, desenvolvida em uma etapa prévia do curso.  
Na presente entrega, a camada de frontend foi substituída pelo módulo mobile desenvolvido em **Expo + React Native**, localizado em `Projeto_Mobile_Fiap`.

Dessa forma, o conteúdo deste diretório não é utilizado na execução atual do sistema e pode ser desconsiderado para fins de avaliação.

---

## Configuração e Execução do Backend

### Acessar o diretório

```bash
cd Fase-4-Pos-Tech-Fiap
cd Projeto_FrontEnd_Fiap-main
cd blog_aulas
cd blog_backend
```

### Instalar dependências

```bash
npm install
npm install nodemon --save-dev
npm audit fix --force
```

### Criar arquivo de ambiente

Criar um arquivo `.env` na raiz do diretório `blog_backend` com o seguinte conteúdo:

```
JWT_SECRET=super_chave_secreta_123
```

### Executar o servidor

```bash
npm run dev
```
O servidor será iniciado na porta **4000**.

---

## Configuração e Execução do Mobile

### Acessar o diretório

```bash
cd Fase-4-Pos-Tech-Fiap
cd Projeto_Mobile_Fiap
cd blog-mobile
```

### Instalar dependências

```bash
npm install
npm install expo
npm install axios
npm install @react-navigation/native
npx expo install react-dom react-native-web
npm install @react-navigation/native-stack
npx expo install react-dom react-native-web @expo/metro-runtime
npx expo install react-native-screens react-native-safe-area-context
npm install jwt-decode
npm install @expo/vector-icons
```

### Configurar API

No Windows, executar no terminal:

```bash
ipconfig
```

Copiar o **Endereço IPv4** e substituir no arquivo:

```
blog-mobile/src/api/api.ts
```

Exemplo:

```
http://192.168.0.10:4000
```
Obvervação: Coloque no formato 'https://seu.ip.aqui:porta', sugerimos a porta 4000.

### Executar aplicação

```bash
npx expo start -c
```

A aplicação pode ser acessada via:

* Navegador (Web) -> Se você for utilizar esta opção e ainda não apareceu um link web, aperte w após rodar o ```npx expo start -c``` e entre no link sugerido. No meu caso apareceu como ``` › Web is waiting on http://localhost:8081```
* Expo Go (QR Code) -> Se você for utilizar esta opção no terminal terá um QR Code para você escanear com o aplicativo do Expo Go instalado
* Emulador Android

---

### Credenciais de Acesso para Testes

#### Professores

| Usuário              | Senha     |
|----------------------|-----------|
| prof1                | senha123  |
| Professor Girafales  | senha123  |

#### Alunos

| Usuário        | Senha  |
|----------------|--------|
| aluno1         | 123654 |
| Peter Parker   | 123654 |


---

## Funcionalidades

### Autenticação e Perfis

* Sistema de autenticação via JWT.
* Perfis de usuário diferenciados: **Professor** e **Aluno**.
* O **Professor** possui permissões administrativas adicionais.

### Gerenciamento de Usuários (Professor)

* Professores podem **gerenciar perfis de outros professores e alunos**.
* É possível listar, criar, editar e remover usuários conforme as regras do sistema.

### Postagens

* Professores podem **criar, editar e excluir postagens**.
* As postagens ficam disponíveis para visualização pública.
* Listagem de posts com ordenação por data e busca por texto.

### Comentários

* **Todos os usuários (professores e alunos)** podem comentar nas postagens.
* **Professores** podem excluir **qualquer comentário**, independentemente do autor.
* **Alunos** podem excluir **apenas os próprios comentários**.

### Quizzes 
* **Professores** podem criar quizzes vinculados às postagens.
* Cada quiz pode conter uma ou mais questões de múltipla escolha.
* **Alunos** podem responder aos quizzes diretamente pela aplicação.
* O sistema registra as respostas enviadas.
* **Professores** conseguem visualizar o desempenho por questão, identificando quantos alunos acertaram ou erraram cada alternativa.
* A funcionalidade de quizzes permite que as respostas dos alunos sejam transformadas em dados pedagógicos, possibilitando ao professor identificar dificuldades coletivas da turma e direcionar reforços nos conteúdos com maior índice de erro.
  
---

## Demonstração da Aplicação

Foi gravado um vídeo demonstrando integração entre múltiplas camadas da aplicação, autenticação segura, consumo de API em diferentes plataformas e implementação de mecanismos avaliativos por meio de quizzes educacionais.

📺 **Link para o vídeo de demonstração no YouTube:** [Clique aqui]([https://youtu.be/CZi5rMJGcq0?si=vee4j1s3f6W1u9kN](https://youtu.be/adEofkwIG2E))

---

## Imagens da Aplicação

Abaixo estão algumas imagens que ilustram o funcionamento da aplicação mobile:

- Tela de inicial e de login
<img width="877" height="600" alt="image" src="https://github.com/user-attachments/assets/cc1b6eee-88b6-43ba-b294-fd148d7581e6" />
<img width="1359" height="747" alt="image" src="https://github.com/user-attachments/assets/e9f47b60-5769-4a60-b82e-3e780ea3d070" />

- Listagem de postagens
<img width="1360" height="746" alt="image" src="https://github.com/user-attachments/assets/da9ed9a1-6c92-484d-afe1-320c176bf83a" />

- Visualização de post
<img width="1360" height="850" alt="image" src="https://github.com/user-attachments/assets/2dbd0a6c-e230-43d0-bfff-2ffe060aa027" />

- Visualização de post com Quiz, visão do Professor, com informativo de quantidade de respostas em cada questão
<img width="1907" height="891" alt="image" src="https://github.com/user-attachments/assets/f215a9bf-e654-4252-8a90-b6be77d39484" />

-  Visualização de post com Quiz, visão do Aluno que não respondeu
<img width="1895" height="894" alt="image" src="https://github.com/user-attachments/assets/84d3d6d1-a072-4d4b-b33a-bec4a5a605c5" />

-  Visualização de post com Quiz, visão do Aluno que respondeu
<img width="1915" height="899" alt="image" src="https://github.com/user-attachments/assets/3a2e4835-86f3-4f3b-aea5-1a8662db2686" />

- Criação e exclusão de comentários
<img width="1315" height="582" alt="image" src="https://github.com/user-attachments/assets/18e0843e-6562-4b91-aaa0-e879f5849339" />

- Funcionalidade específica do perfil de professor - Criação de post com quiz
<img width="383" height="367" alt="image" src="https://github.com/user-attachments/assets/c8dc6207-4f2e-44da-b817-1f6274efb584" />
<img width="357" height="850" alt="image" src="https://github.com/user-attachments/assets/8d21ecce-e929-4370-823d-c9a975568f9e" />

- Funcionalidade específica do perfil de professor - Listagem da edição de post e edição de post com botão de exclusão selecionado
<img width="1373" height="582" alt="image" src="https://github.com/user-attachments/assets/b3b981c4-1170-47d1-9562-2d0d862b20bb" />
<img width="582" height="710" alt="image" src="https://github.com/user-attachments/assets/6cff0d25-e75c-40c3-9b49-30a1e43e2cdb" />

- Funcionalidade específica do perfil de professor - Edição de post com quiz
<img width="428" height="866" alt="image" src="https://github.com/user-attachments/assets/21515d76-eae0-466d-81f1-7e5ef3d27dc4" />

- Funcionalidade específica do perfil de professor - Listagem do gerenciamento de professores, criação de um novo cadastro de professor e edição de professores
<img width="1368" height="624" alt="image" src="https://github.com/user-attachments/assets/3ecf78fa-84c9-42e6-a8fd-24838b52a8a1" />
<img width="551" height="379" alt="image" src="https://github.com/user-attachments/assets/3c7a9e14-f381-4e27-bae0-825b32bd1b67" />
<img width="571" height="401" alt="image" src="https://github.com/user-attachments/assets/f36865ee-2394-49a1-af8c-5b1d68acca9c" />

- Funcionalidade específica do perfil de professor - Listagem do gerenciamento de alunos, criação de um novo cadastro de aluno e edição de aluno
<img width="1370" height="838" alt="image" src="https://github.com/user-attachments/assets/29103b6f-83d1-4826-b040-2efa07daadbb" />
<img width="537" height="371" alt="image" src="https://github.com/user-attachments/assets/6ee5aaab-f92c-431a-aea5-fe6d4874e7ff" />
<img width="542" height="385" alt="image" src="https://github.com/user-attachments/assets/4ab3715e-e0cd-48db-8bf1-b6aef6976487" />

---

## Dificuldades Encontradas

Durante o desenvolvimento do projeto, algumas dificuldades foram identificadas e solucionadas ao longo do processo, contribuindo para o amadurecimento técnico da solução:
* Modelagem e persistência dos quizzes: foi necessário estruturar entidades para perguntas, alternativas e respostas dos alunos, garantindo integridade relacional e correta associação às postagens.
* Modelagem dos quizzes: estruturação de entidades para perguntas, alternativas e respostas, garantindo vínculo correto com as postagens.
* Fluxo de respostas dos alunos: implementação do registro das respostas evitando duplicidades e assegurando consistência dos dados.
* Apresentação de resultados: organização das métricas de acertos e erros por questão para visualização pedagógica pelo professor.
* Integração backend e mobile: ajustes de rotas, payloads e tratamento de erros nas funcionalidades de quizzes.
* Controle de permissões: definição de regras para criação e análise de quizzes restritas ao perfil de professor.
* Autenticação JWT: proteção das rotas sensíveis relacionadas às avaliações.
  
A evolução para a Fase 5 amplia o papel da plataforma, que deixa de ser apenas um portal de publicações e passa a atuar como ferramenta de apoio à avaliação formativa no ensino público.

---
