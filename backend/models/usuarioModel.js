class Usuario  {
    constructor ({id, nome, sobrenome, data_nascimento, email, role, password, historico_pontuacoes, tentativas_login, tempo_bloqueio}) {
        this.id = id
        this.nome = nome
        this.sobrenome = sobrenome
        this.data_nascimento = data_nascimento
        this.email = email
        this.role = role
        this.password = password
        this.historico_pontuacoes = historico_pontuacoes
        this.tentativas_login = tentativas_login
        this.tempo_bloqueio = tempo_bloqueio
    };


    toJson() {
        return{
            id: this.id,
            nome: this.nome,
            sobrenome: this.sobrenome,
            data_nascimento: this.data_nascimento,
            email: this.email,
            role: this.role,
            historico_pontuacoes: this.historico_pontuacoes
        };
    }
}

module.exports =  Usuario;
