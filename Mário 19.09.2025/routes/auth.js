const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/conexao');

// Página de cadastro
router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

// Processar cadastro
router.post('/cadastro', async (req, res) => {
    const { nome_completo, email, nome_usuario, senha } = req.body;
    
    try {
        const [existente] = await db.query(
            'SELECT * FROM usuarios WHERE email = ? OR nome_usuario = ?',
            [email, nome_usuario]
        );
        
        if (existente.length > 0) {
            req.session.mensagem = { 
                tipo: 'erro', 
                texto: 'E-mail ou nome de usuário já cadastrado!' 
            };
            return res.redirect('/cadastro');
        }
        
        const senhaHash = await bcrypt.hash(senha, 10);
        
        await db.query(
            'INSERT INTO usuarios (nome_completo, email, nome_usuario, senha) VALUES (?, ?, ?, ?)',
            [nome_completo, email, nome_usuario, senhaHash]
        );
        
        req.session.mensagem = { 
            tipo: 'sucesso', 
            texto: 'Cadastro realizado com sucesso! Faça login para continuar.' 
        };
        res.redirect('/login');
        
    } catch (erro) {
        console.error(erro);
        req.session.mensagem = { 
            tipo: 'erro', 
            texto: 'Erro ao realizar cadastro!' 
        };
        res.redirect('/cadastro');
    }
});

// Página de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Processar login
router.post('/login', async (req, res) => {
    const { nome_usuario, senha } = req.body;
    
    try {
        const [usuarios] = await db.query(
            'SELECT * FROM usuarios WHERE nome_usuario = ?',
            [nome_usuario]
        );
        
        if (usuarios.length === 0) {
            req.session.mensagem = { 
                tipo: 'erro', 
                texto: 'Usuário ou senha inválidos!' 
            };
            return res.redirect('/login');
        }
        
        const usuario = usuarios[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            req.session.mensagem = { 
                tipo: 'erro', 
                texto: 'Usuário ou senha inválidos!' 
            };
            return res.redirect('/login');
        }
        
        req.session.usuario = {
            id: usuario.id,
            nome_usuario: usuario.nome_usuario,
            nome_completo: usuario.nome_completo
        };
        
        req.session.mensagem = { 
            tipo: 'sucesso', 
            texto: 'Login realizado com sucesso!' 
        };
        res.redirect('/postagens');
        
    } catch (erro) {
        console.error(erro);
        req.session.mensagem = { 
            tipo: 'erro', 
            texto: 'Erro ao fazer login!' 
        };
        res.redirect('/login');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;