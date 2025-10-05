const repository = require('../repositories/usuarioRepository');
const bcrypt = require('bcrypt');
const authService = require('./authService');

const MAX_TENTATIVAS = 5;
const TEMPO_BLOQUEIO_MINUTOS = 15;

class UsuarioService {
    async getAll() {
        const usuarios = await repository.getAll();
        return usuarios;
    }

    async getById (id) {
        const usuarios = await repository.getById(id);
        return usuarios;
    }

    async create (dados) {
        dados.password = await bcrypt.hash(dados.password, 10);
        const novoUsuario = await repository.create(dados);
        console.log("processando dados")
        return novoUsuario;
    }

    async update (id, dados) {
        const usuarioExistente = await repository.getById(id);
        let novaSenha = dados.senha;
        if (novaSenha) {
            const mesmaSenha = await bcrypt.compare(novaSenha, usuarioExistente.password)
            if (mesmaSenha === true) {
                throw { message: 'A nova senha deve ser diferente da senha atual' };
            }
            dados.senha = await bcrypt.hash(novaSenha, 10);
        }
        const usuarioAtualizado = await repository.update(id, dados);
        return usuarioAtualizado;
    }

    async delete (id) {
        const usuarioDeletado = await repository.remove(id);
        return usuarioDeletado;
    }

    async login (email, senha) {
        const usuario = await repository.getByEmail(email);

        if (!usuario) {
            throw { status: 401, message: 'Email ou senha incorretos' };
        }

        if (usuario.tempo_bloqueio && new Date(usuario.tempo_bloqueio) > new Date()) {
            const minutosRestantes = Math.ceil((new Date(usuario.tempo_bloqueio) - new Date()) / 60000);
            throw { status: 403, message: `Usuario bloqueado. Tente novamente em ${minutosRestantes} minutos.` }
        }

        const senhaValida = await bcrypt.compare(senha, usuario.password);
        if (!senhaValida) {
            await repository.incrementarTentativas(email);
            const tentativasAtuais = (usuario.tentativasLogin || 0) + 1;

            if ((usuario.tentativas_login >= MAX_TENTATIVAS)) {
                await repository.bloquearUsuario(email, TEMPO_BLOQUEIO_MINUTOS);
                throw { status: 403, message: `Usuario bloqueado por ${TEMPO_BLOQUEIO_MINUTOS} minutos devido a muitas tentativas.` };
        }
        throw { staus: 401, message: `Email ou senha incorretos. Tentativas restantes: ${MAX_TENTATIVAS - tentativasAtuais}`};
    }

    await repository.resetarTentativas(email);

    const token = authService.genereteToken({
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome
    });

    return {
        message: 'login realizado com sucesso',
        usuario,
        token
    }
    };




}

module.exports = new UsuarioService();