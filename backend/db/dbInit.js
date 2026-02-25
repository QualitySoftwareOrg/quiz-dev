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
            role VARCHAR(20) DEFAULT 'user' NOT NULL,
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
        await db.query(`ALTER TABLE usuario ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'`);
        await db.query(`UPDATE usuario SET role = 'user' WHERE role IS NULL`);
        await db.query(`ALTER TABLE usuario ALTER COLUMN role SET DEFAULT 'user'`);
        await db.query(`ALTER TABLE usuario ALTER COLUMN role SET NOT NULL`);
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
            dificuldade TEXT NOT NULL CHECK (dificuldade IN ('facil', 'medio', 'dificil')),
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

const createTableOtps = async () => {
    const checkTableOtpsQuery = `SELECT to_regclass('public.otps')`;

    try {
        const result = await db.query(checkTableOtpsQuery);

        if (result.rows[0].to_regclass === null) {
            const createQueryOtps = `
            CREATE TABLE otps (
            email VARCHAR(100) PRIMARY KEY,
            otp VARCHAR(10) NOT NULL,
            criado_em TIMESTAMP DEFAULT NOW(),
            expira_em TIMESTAMP NOT NULL
            );`;

            await db.query(createQueryOtps);
            console.log("Tabela OTPS criada com sucesso!");
        } else {
            // garante coluna de expiracao caso a tabela exista sem ela
            await db.query(`ALTER TABLE otps ADD COLUMN IF NOT EXISTS expira_em TIMESTAMP`);
            console.log("Tabela OTPS ja existe!");
        }
    } catch (error) {
        console.log("Erro ao criar a tabela OTPS!", error.message);
    }
};

const initDb = async () => {
    await createTableUsuario();
    await createTablePergunta();
    await createTableOtps();
};

module.exports = initDb;
