const repository = require('../repositories/usuarioRepository');
const bcrypt = require('bcrypt');
const authService = require('./authService');
const { createError } = require('../utils/errorResponse');

const MAX_TENTATIVAS = 5;
const TEMPO_BLOQUEIO_MINUTOS = 15;

const sanitizeUsuario = (usuario) => {
    if (!usuario) return null;
    let historico = usuario.historico_pontuacoes;
    if (typeof historico === 'string') {
        try {
            historico = JSON.parse(historico);
        } catch (error) {
            historico = {};
        }
    }
    if (!historico) {
        historico = {};
    }
    return {
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        data_nascimento: usuario.data_nascimento,
        email: usuario.email,
        role: usuario.role || 'user',
        historico_pontuacoes: historico,
    };
};

class UsuarioService {
    async getAll() {
        const usuarios = await repository.getAll();
        return usuarios.map(sanitizeUsuario);
    }

    async getById (id) {
        const usuarios = await repository.getById(id);
        return sanitizeUsuario(usuarios);
    }

    async create (dados) {
        dados.password = await bcrypt.hash(dados.password, 10);
        const novoUsuario = await repository.create(dados);
        console.log("processando dados")
        return sanitizeUsuario(novoUsuario);
    }

    async update (id, dados) {
        const usuarioExistente = await repository.getById(id);
        if (!usuarioExistente) return null;
        const dadosAtualizados = { ...dados };
        if (!dadosAtualizados.password && dadosAtualizados.senha) {
            dadosAtualizados.password = dadosAtualizados.senha;
        }
        let novaSenha = dadosAtualizados.password;
        if (novaSenha) {
            const mesmaSenha = await bcrypt.compare(novaSenha, usuarioExistente.password)
            if (mesmaSenha === true) {
                throw createError(422, 'PASSWORD_REUSE', 'A nova senha deve ser diferente da senha atual');
            }
            dadosAtualizados.password = await bcrypt.hash(novaSenha, 10);
        }
        delete dadosAtualizados.senha;
        const usuarioAtualizado = await repository.update(id, dadosAtualizados);
        return sanitizeUsuario(usuarioAtualizado);
    }

    async delete (id) {
        const usuarioDeletado = await repository.remove(id);
        return sanitizeUsuario(usuarioDeletado);
    }

    async registrarPontuacao(id, categoria, acertos, total) {
        const usuario = await repository.getById(id);
        if (!usuario) return null;

        const historicoAtual = usuario.historico_pontuacoes || {};
        const porCategoria = historicoAtual.por_categoria || {};

        const dadosCategoria = porCategoria[categoria] || {
            acertos: 0,
            total: 0,
            partidas: 0,
        };

        dadosCategoria.acertos += acertos;
        dadosCategoria.total += total;
        dadosCategoria.partidas += 1;
        dadosCategoria.ultima_partida = new Date().toISOString();

        porCategoria[categoria] = dadosCategoria;

        const historicoNovo = {
            ...historicoAtual,
            total: (historicoAtual.total || 0) + acertos,
            por_categoria: porCategoria,
            ultima_partida: new Date().toISOString(),
        };

        const atualizado = await repository.updateHistoricoPontuacoes(id, historicoNovo);
        return sanitizeUsuario(atualizado);
    }

    async login (email, senha) {
        const usuario = await repository.getByEmail(email);

        if (!usuario) {
            throw createError(401, 'INVALID_CREDENTIALS', 'Email ou senha incorretos');
        }

        if (usuario.tempo_bloqueio && new Date(usuario.tempo_bloqueio) > new Date()) {
            const minutosRestantes = Math.ceil((new Date(usuario.tempo_bloqueio) - new Date()) / 60000);
            throw createError(403, 'ACCOUNT_BLOCKED', `Usuario bloqueado. Tente novamente em ${minutosRestantes} minutos.`, {
                retry_after_minutes: minutosRestantes,
            });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.password);
        if (!senhaValida) {
            await repository.incrementarTentativas(email);
            const tentativasAtuais = (usuario.tentativas_login || 0) + 1;

            if (tentativasAtuais >= MAX_TENTATIVAS) {
                await repository.bloquearUsuario(email, TEMPO_BLOQUEIO_MINUTOS);
                throw createError(403, 'ACCOUNT_BLOCKED', `Usuario bloqueado por ${TEMPO_BLOQUEIO_MINUTOS} minutos devido a muitas tentativas.`, {
                    retry_after_minutes: TEMPO_BLOQUEIO_MINUTOS,
                });
            }
            throw createError(401, 'INVALID_CREDENTIALS', `Email ou senha incorretos. Tentativas restantes: ${Math.max(0, MAX_TENTATIVAS - tentativasAtuais)}`);
        }

        await repository.resetarTentativas(email);

        const token = authService.genereteToken({
            id: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
            role: usuario.role || 'user',
        });

        return {
            message: 'login realizado com sucesso',
            usuario: sanitizeUsuario(usuario),
            token
        };
    }




}

module.exports = new UsuarioService();
