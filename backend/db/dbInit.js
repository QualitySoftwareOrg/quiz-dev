const db = require('./db');

const createTableUsuario = async () => {
    const checkTableUsuarioQUery = `SELECT to_regclass('public.usuario')`;

    try {
        const result = await db.query(checkTableUsuarioQUery);

        if (result.rows[0].to_regclass === null) {
            const createQueryUsuario = `
            CREATE TABLE usuario (
            id SERIAL PRIMARY KEY NOT NULL,
            nome VARCHAR(100) NOT NULL,
            sobrenome VARCHAR(100) NOT NULL,
            data_nascimento DATE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            historico_pontuacoes JSONB,
            tentativas_login INT DEFAULT 0,
            tempo_bloqueio TIMESTAMP NULL
            );`

            await db.query(createQueryUsuario);
            console.log("Tabela Usuário criada com sucessso!")
        } else {
            console.log("Tabela Usuário já existe!")
        };
    } catch (error){
        console.log("Erro ao criar a tebela Usuário!", error.message);
    }
};

const createTablePergunta = async () => {
    const checkTablePerguntaQuery = `SELECT to_regclass('public.pergunta')`;    

    try {
        const result = await db.query(checkTablePerguntaQuery);

        if (result.rows[0].to_regclass === null) {
            const createQueryPergunta = `
            CREATE TABLE pergunta (
            id SERIAL PRIMARY KEY NOT NULL,
            categoria TEXT NOT NULL,
            pontuacao INTEGER NOT NULL,
            pergunta TEXT NOT NULL,
            resposta_correta TEXT NOT NULL,
            respostas_incorretas JSONB NOT NULL
            );`

            await db.query(createQueryPergunta);
            console.log("Tabela Pergunta criada com sucesso!");
        } else {
            console.log("Tabela Pergunta já existe!");
        }
    } catch (error) {
        console.log("Erro ao criar a tabela Pergunta!", error.message);
    }
};

const initDb = async () => {
    await createTableUsuario();
    await createTablePergunta();
};

module.exports = initDb;