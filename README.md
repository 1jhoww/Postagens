# Sistema de Blog - Node.js + Express + MySQL2

## Descrição

Este projeto é um mini sistema de blog simples e funcional. Ele permite cadastro de usuários, login, criação, edição e exclusão de postagens, com todas as rotas, garantindo fácil entendimento e usabilidade.

## Funcionalidades

O sistema permite que os usuários se cadastrem fornecendo nome completo, e-mail, nome de usuário e senha, com validação de e-mail e username únicos. As senhas são armazenadas de forma segura usando bcrypt. Usuários autenticados podem criar, editar e excluir suas próprias postagens, enquanto todos podem visualizar as postagens, que exibem título, conteúdo, autor e data. O login utiliza express-session para manter a sessão ativa e proteger rotas sensíveis.

## Estrutura do Projeto

sistema-blog/  
├── package.json # Gerenciamento de dependências  
├── app.js # Arquivo principal do sistema  
├── db/  
│ └── conexao.js # Configuração da conexão com MySQL2  
├── routes/  
│ ├── auth.js # Rotas de autenticação  
│ └── postagens.js # Rotas de gerenciamento de postagens  
├── views/  
│ ├── layouts/  
│ │ └── main.handlebars # Layout principal  
│ ├── cadastro.handlebars # Página de cadastro  
│ ├── login.handlebars # Página de login  
│ ├── postagens.handlebars # Listagem de postagens  
│ ├── novaPostagem.handlebars # Formulário de nova postagem  
│ └── editarPostagem.handlebars # Formulário de edição  
├── public/  
│ ├── css/  
│ ├── imagens/  
│ └── js/  
└── README.md

## Rotas Principais

| Rota | Método | Função |
| --- | --- | --- |
| /cadastro | GET/POST | Exibir e processar cadastro |
| /login | GET/POST | Exibir e processar login |
| /logout | GET | Finalizar sessão do usuário |
| /postagens | GET | Listar todas as postagens |
| /postagens/nova | GET/POST | Criar nova postagem (apenas logado) |
| /postagens/editar/:id | GET/POST | Editar postagem (apenas autor) |
| /postagens/excluir/:id | POST | Excluir postagem (apenas autor) |

## Banco de Dados

O banco de dados MySQL2 possui duas tabelas principais: usuarios e postagens. A tabela usuarios armazena id, nome, e-mail, nome de usuário, senha e data de criação. A tabela postagens armazena id, título, conteúdo, id do usuário criador e data de criação. Cada postagem pertence a um único usuário, e cada usuário pode ter várias postagens.

## Tecnologias Utilizadas

- Node.js
- Express
- Handlebars
- MySQL2
- bcrypt
- express-session
- Bootstrap ou CSS puro

## Instalação e Execução

1. Clone o projeto:

git clone <https://github.com/1jhoww/Postagens>

1. Instale as dependências:

npm install

1. Crie o banco de dados MySQL executando o script SQL fornecido.
2. Configure a conexão com o MySQL em db/conexao.js.
3. Execute o sistema:

npm start

1. Acesse: <http://localhost:3000>

## Como Usar

Para utilizar o sistema, siga os passos abaixo: 1. **Cadastro de Usuário:** acesse /cadastro, preencha os campos e clique em ‘Cadastrar’. Verifique mensagens de erro caso e-mail ou nome de usuário já existam. 2. **Login:** acesse /login, insira e-mail ou nome de usuário e senha, e clique em ‘Entrar’. Usuários não autenticados não podem acessar rotas de criação, edição ou exclusão. 3. **Visualizar Postagens:** acesse /postagens para ver todas as postagens, incluindo título, conteúdo, autor e data. 4. **Criar Nova Postagem:** após login, acesse /postagens/nova, preencha título e conteúdo, e clique em ‘Publicar’. 5. **Editar Postagem:** para editar uma postagem própria, clique em ‘Editar’ na listagem, altere o título e/ou conteúdo e confirme. 6. **Excluir Postagem:** para excluir uma postagem própria, clique em ‘Excluir’ na listagem e confirme a ação. 7. **Logout:** clique em ‘Sair’ para finalizar a sessão.

O sistema garante que apenas o autor da postagem possa editá-la ou excluí-la, mantendo segurança e integridade das informações.

O sistema é funcional, simples, seguro e 100% em português, ideal para blogs pequenos ou projetos de aprendizado.
