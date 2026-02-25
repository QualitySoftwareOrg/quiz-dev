const perguntasRepository = require('../repositories/perguntasRepository');

class PerguntasService {
    async getPerguntas() {
        return await perguntasRepository.getAll();
    }
    async getPerguntaById(id) {
        return await perguntasRepository.getById(id);
    }
    async getPerguntasByCategoria(categoria) {
        return await perguntasRepository.getByCategoria(categoria);
    }
    async getPerguntasByCategoriaDificuldade(categoria, dificuldade) {
        return await perguntasRepository.getByCategoriaDificuldade(categoria, dificuldade);
    }
    async createPergunta(data) {
        return await perguntasRepository.create(data);
    }
    async updatePergunta(id, data) {
        return await perguntasRepository.update(id, data);
    }
    async removePergunta(id) {
        return await perguntasRepository.remove(id);
    }
}

module.exports = PerguntasService;