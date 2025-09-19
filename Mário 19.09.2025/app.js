const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    helpers: {
        eq: (a, b) => a === b,
        formatDate: (date) => {
            return new Date(date).toLocaleDateString('pt-BR');
        }
    }
}));
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Configuração da sessão
app.use(session({
    secret: 'chave_secreta_blog',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));

// Middleware para passar dados da sessão para as views
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    res.locals.mensagem = req.session.mensagem || null;
    delete req.session.mensagem;
    next();
});

// Rotas
const authRoutes = require('./routes/auth');
const postagensRoutes = require('./routes/postagens');

app.use('/', authRoutes);
app.use('/postagens', postagensRoutes);

// Rota principal
app.get('/', (req, res) => {
    res.redirect('/postagens');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});