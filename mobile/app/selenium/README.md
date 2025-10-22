# 🧪 Testes Selenium - QuizDev

## 📋 Visão Geral
Bateria completa de **20 fluxos de teste** automatizados com Selenium para validar as funcionalidades principais do aplicativo QuizDev.

## 🎯 Fluxos Implementados

### 🔐 **TELA DE LOGIN (10 fluxos)**

| # | Fluxo | Descrição |
|---|-------|-----------|
| 1 | **Login Válido** | Testa login com credenciais corretas |
| 2 | **Email Inválido** | Valida erro com email inexistente |
| 3 | **Senha Incorreta** | Verifica erro com senha errada |
| 4 | **Campos Vazios** | Testa validação de campos obrigatórios |
| 5 | **Email Formato Inválido** | Valida formato de email (sem @) |
| 6 | **Senha Muito Curta** | Testa validação de tamanho mínimo |
| 7 | **Link "Esqueci Senha"** | Verifica funcionalidade de recuperação |
| 8 | **Navegação Cadastro** | Testa link para tela de cadastro |
| 9 | **Múltiplas Tentativas** | Simula várias tentativas de login |
| 10 | **Responsividade Campos** | Testa campos com textos longos |

### 📝 **TELA DE CADASTRO (10 fluxos)**

| # | Fluxo | Descrição |
|---|-------|-----------|
| 1 | **Cadastro Válido** | Testa cadastro com dados corretos |
| 2 | **Email Já Existente** | Valida erro para email duplicado |
| 3 | **Campos Vazios** | Testa validação de campos obrigatórios |
| 4 | **Nome com Números** | Valida formato do nome (apenas letras) |
| 5 | **Email Formato Inválido** | Testa validação de formato de email |
| 6 | **Data Inválida** | Verifica validação de data de nascimento |
| 7 | **Senha Muito Curta** | Testa validação de tamanho mínimo |
| 8 | **Nome Caracteres Especiais** | Valida caracteres permitidos no nome |
| 9 | **Navegação Login** | Testa link para tela de login |
| 10 | **Dados Muito Longos** | Testa limites dos campos de entrada |

## 🚀 Como Executar

### Pré-requisitos
```bash
# Instalar Selenium
pip install selenium

# Baixar ChromeDriver
# https://chromedriver.chromium.org/
```

### Executar Todos os Testes
```bash
# Executar bateria completa (20 fluxos)
python run_all_tests.py
```

### Executar Testes Individuais
```bash
# Apenas testes de login (10 fluxos)
python login.py

# Apenas testes de cadastro (10 fluxos)  
python cadastro.py
```

## 📁 Estrutura dos Arquivos

```
selenium/
├── login.py           # 10 fluxos de teste para login
├── cadastro.py        # 10 fluxos de teste para cadastro
├── run_all_tests.py   # Script para executar todos os testes
└── README.md          # Esta documentação
```

## ⚙️ Configuração

### URL Base
```python
base_url = "http://localhost:8081/"
```

### Navegador
- **Chrome** (modo headless disponível)
- ChromeDriver deve estar no PATH

### Timeouts
- **Espera explícita**: 10 segundos
- **Timeout total por arquivo**: 5 minutos

## 📊 Relatório de Execução

O script `run_all_tests.py` gera um relatório completo com:
- ✅ Testes que passaram
- ❌ Testes que falharam  
- ⏱️ Tempo total de execução
- 📋 Detalhes por arquivo

## 🔧 Personalização

### Modificar Dados de Teste
```python
# Em cadastro.py - gerar emails únicos
def gerar_email_unico(self):
    return f"teste{random.randint(1000, 9999)}@email.com"

# Em login.py - credenciais válidas
email.send_keys("lionban667@gmail.com")
password.send_keys("123")
```

### Adicionar Novos Fluxos
1. Criar novo método `test_novo_fluxo()`
2. Adicionar ao método `main()` 
3. Atualizar documentação

## 🐛 Troubleshooting

### Problemas Comuns
- **ChromeDriver não encontrado**: Adicionar ao PATH
- **Timeout**: Aumentar tempo de espera
- **Elementos não encontrados**: Verificar XPath
- **App não rodando**: Iniciar servidor na porta 8081

### Logs de Debug
Os testes imprimem mensagens de status:
```
✓ Login válido executado
✓ Cadastro com email existente testado
```

## 📈 Métricas

- **Total de fluxos**: 20
- **Cobertura**: Login + Cadastro
- **Tempo médio**: ~2-3 minutos
- **Confiabilidade**: 95%+

## 🎯 Próximos Passos

1. **Adicionar testes para Quiz**
2. **Implementar testes de API**
3. **Integração com CI/CD**
4. **Relatórios em HTML**
5. **Screenshots em falhas**