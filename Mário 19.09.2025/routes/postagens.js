const express = require('express');
const router = express.Router();
const db = require('../db/conexao');

// Middleware para verificar autenticação
const verificarAuth = (req, res, next) => {
    if (!req.session.usuario) {
        req.session.mensagem = { 
            tipo: 'erro', 
            texto: 'Você precisa estar logado para acessar esta página!' 
        };
        return res.redirect('/login');
    }
    next();
};

// Listar todas as postagens
router.get('/', async (req, res) => {
    try {
        const [postagens] = await db.query(`
            SELECT p.*, u.nome_completo as nome_autor 
            FROM postagens p 
            JOIN usuarios u ON p.usuario_id = u.id 
            ORDER BY p.criado_em DESC
        `);
        
        const postagensFormatadas = postagens.map(p => ({
            ...p,
            ehDono: req.session.usuario && req.session.usuario.id === p.usuario_id
        }));
        
        res.render('postagens', { postagens: postagensFormatadas });
    } catch (erro) {
        console.error(erro);
        req.session.mensagem = { 
            tipo: 'erro', 
            texto: 'Erro ao carregar postagens!' 
        };
        res.render('postagens', { postagens: [] });
    }
});

// Página de nova postagem
router.get('/nova', verificarAuth, (req, res) => {
    res.render('nova-postagem');
});

// Criar nova postagem
router.post('/nova', verificarAuth, async (req, res) => {
    const { titulo, conteudo } = req.body;
    const usuarioId = req.session.usuario.id;
    
    try {
        await db.query(
            'INSERT INTO postagens (titulo, conteudo, usuario_id) VALUES (?, ?, ?)',
            [titulo, conteudo, usuarioId]
        );
        
        req.session.mensagem = { 
            tipo: 'sucesso', 
            texto: 'Postagem criada com sucesso!' 
        };
        res.redirect('/postagens');
    } catch (erro) {
        console.error(erro);
        req.session.mensagem = { 
            tipo: 'erro', 
            texto: 'Erro ao criar postagem!' 
        };
        res.redirect('/postagens/nova');
    }
});

// Página de edição
router.get('/editar/:id', verificarAuth, async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.session.usuario.id;
    
    try {
        const [postagens] = await db.query(
            'SELECT * FROM postagens WHERE id = ? AND usuario_id = ?',
            [id, usuarioId]
        );
        
        if (postagens.length === 0) {
            req.session.mensagem = { 
                tipo: 'erro', 
                texto: 'Postagem não encontrada ou você não tem permissão!' 
            };
            return res.redirect('/postagens');
        }
        
        res.render('editar-postagem', { postagem: postagens[0] });
    } catch (erro) {
        console.error(erro);
        req.session.mensagem = { 
            tipo: 'erro', 
            texto: 'Erro ao carregar postagem!' 
        };
        res.redirect('/postagens');
    }
});

// Atualizar postagem
router.post('/editar/:id', verificarAuth, async (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;
    const usuarioId = req.session.usuario.id;
    
    try {
        const [resultado] = await db.query(
            'UPDATE postagens SET titulo = ?, conteudo = ? WHERE id = ? AND usuario_id = ?',
            [titulo, conteudo, id, usuarioId]
        );
        
        if (resultado.affectedRows === 0) {
            req.session.mensagem = { 
                tipo: 'erro', 
                texto: 'Postagem não encontrada ou você não tem permissão!' 
            };
            return res.redirect('/postagens');
        }
        
        req.session.mensagem = { 
            tipo: 'sucesso', 
            texto: 'Postagem atualizada com sucesso!' 
        };
        res.redirect('/postagens');
    } catch (erro) {
        console.error(erro);
        req.session.mensagem = { 
            tipo: 'erro', 
            texto: 'Erro ao atualizar postagem!' 
        };
        res.redirect('/postagens');
    }
});

// Excluir postagem
router.post('/excluir/:id', verificarAuth, async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.session.usuario.id;
    
    try {
        const [resultado] = await db.query(
            'DELETE FROM postagens WHERE id = ? AND usuario_id = ?',
            [id, usuarioId]
        );
        
        if (resultado.affectedRows === 0) {
            req.session.mensagem = { 
                tipo: 'erro', 
                texto: 'Postagem não encontrada ou você não tem permissão!' 
            };
            return res.redirect('/postagens');
        }
        
        req.session.mensagem = { 
            tipo: 'sucesso', 
            texto: 'Postagem excluída com sucesso!' 
        };
        res.redirect('/postagens');
    } catch (erro) {
        console.error(erro);
        req.session.mensagem = { 
            tipo: 'erro', 
            texto: 'Erro ao excluir postagem!' 
        };
        res.redirect('/postagens');
    }
});

module.exports = router;