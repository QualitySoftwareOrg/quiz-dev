# Novas Funcionalidades e Melhorias (QuizDev)

Data: 2026-02-24
Escopo: propostas para evolucao do produto e da base tecnica.
Objetivo: definir backlog detalhado para implementacao futura.

Cada item inclui:
Objetivo, UX/Fluxo, Backend, Mobile, Dados, Edge cases, Metricas, Prioridade.

---

**1) Auto-login apos cadastro via OTP**

Objetivo: eliminar atrito no cadastro e reduzir abandono.
UX/Fluxo: usuario valida OTP -> ja entra no app (MainTabs).
Backend: `POST /usuarios/verificar-otp` deve retornar `{ token, usuario }`.
Mobile: salvar `token` e `usuario` e navegar direto para `MainTabs`.
Dados: nenhum novo campo.
Edge cases: OTP expirado, usuario ja existe, falha no envio do email.
Metricas: taxa de conversao cadastro->primeira partida.
Prioridade: ALTA.

---

**2) Roles e autorizacao de conteudo**

Objetivo: proteger dados e permitir area administrativa.
UX/Fluxo: usuarios comuns acessam apenas o proprio perfil; admins acessam gestao.
Backend: adicionar campo `role` no usuario, por exemplo `user` e `admin`.
Mobile: esconder funcionalidades admin para `user`.
Dados: migracao para adicionar `role` com default `user`.
Edge cases: usuario sem role legado; permissao negada.
Metricas: tentativas de acesso negadas por endpoint.
Prioridade: ALTA.

---

**3) Gestao de perguntas (painel admin)**

Objetivo: CRUD de perguntas de forma segura e rapida.
UX/Fluxo: lista de perguntas com filtro por categoria e busca; tela de editar/criar.
Backend: manter endpoints atuais e reforcar autorizacao admin.
Mobile: adicionar tela Admin com lista, search, create/edit.
Dados: nenhum novo campo obrigatorio; opcional `dificuldade`.
Edge cases: validacao de campos obrigatorios; limites de tamanho.
Metricas: tempo medio para criar pergunta; taxa de erros de validacao.
Prioridade: ALTA.

---

**4) Dificuldade e adaptacao do quiz**

Objetivo: aumentar engajamento e aprendizado com niveis.
UX/Fluxo: usuario escolhe dificuldade ou app ajusta automaticamente.
Backend: adicionar campo `dificuldade` em `pergunta`; filtro por dificuldade.
Mobile: seletor na tela de temas; indicador no quiz.
Dados: migracao de schema e seed com nivel.
Edge cases: categoria sem perguntas no nivel escolhido.
Metricas: taxa de acerto por dificuldade.
Prioridade: MEDIA.

---

**5) Historico detalhado por categoria no perfil**

Objetivo: mostrar progresso real do usuario.
UX/Fluxo: perfil exibe total, por categoria, ultimas partidas e taxa de acerto.
Backend: manter `historico_pontuacoes` com estrutura padronizada.
Mobile: cards por categoria; grafico simples (barra).
Dados: garantir JSONB consistente e com `por_categoria`.
Edge cases: usuario sem historico.
Metricas: numero de usuarios que abrem perfil e tempo na tela.
Prioridade: MEDIA.

---

**6) Indicador de progresso no quiz**

Objetivo: dar previsibilidade de quantas perguntas faltam.
UX/Fluxo: mostrar "Pergunta X de Y" no topo do quiz.
Backend: nao precisa.
Mobile: atualizar UI do QuizScreen; opcional animacao.
Dados: nenhum.
Edge cases: quiz com menos de 10 perguntas.
Metricas: taxa de conclusao do quiz.
Prioridade: MEDIA.

---

**7) Revisao de erros (modo estudo)**

Objetivo: transformar erros em aprendizado.
UX/Fluxo: ao fim do quiz, lista de perguntas erradas com resposta correta.
Backend: opcional enviar explicacoes no payload das perguntas.
Mobile: armazenar respostas do usuario e renderizar revisao.
Dados: adicionar campo `explicacao` em pergunta, se disponivel.
Edge cases: perguntas sem explicacao.
Metricas: taxa de retorno ao modo estudo.
Prioridade: MEDIA.

---

**8) Desafios diarios e streak**

Objetivo: aumentar recorrencia e habito.
UX/Fluxo: banner "Desafio do dia"; streak semanal no perfil.
Backend: endpoint para quiz diario fixo por data.
Mobile: badge de streak e feedback ao completar desafio.
Dados: salvar `streak_atual`, `melhor_streak`, `ultimo_desafio`.
Edge cases: usuario muda fuso horario; perder streak.
Metricas: DAU, retention D7 e D30.
Prioridade: MEDIA.

---

**9) Ranking por categoria**

Objetivo: engajamento social e competencia saudavel.
UX/Fluxo: leaderboard global e por categoria.
Backend: endpoint para ranking paginado por categoria e total.
Mobile: tela de ranking com filtros.
Dados: indice em historico para performance.
Edge cases: usuarios com mesmo score.
Metricas: tempo em leaderboard e aumento de sessoes.
Prioridade: MEDIA.

---

**10) Modo offline com cache de perguntas**

Objetivo: permitir jogar sem internet.
UX/Fluxo: baixar pacotes de perguntas e jogar offline.
Backend: endpoint para exportar perguntas por categoria.
Mobile: cache local e validade de cache.
Dados: versionamento de perguntas.
Edge cases: cache expirado, conflito de versoes.
Metricas: sessoes offline e taxa de sucesso.
Prioridade: MEDIA.

---

**11) Notificacoes push para retorno**

Objetivo: trazer usuario de volta (desafio diario, streak).
UX/Fluxo: notificacoes configuraveis no perfil.
Backend: scheduler simples ou servico externo.
Mobile: permissao e preferencias de notificacao.
Dados: salvar preferencias e tokens.
Edge cases: usuario bloqueia notificacoes.
Metricas: CTR de push.
Prioridade: BAIXA.

---

**12) Redefinicao de senha (sem OTP de cadastro)**

Objetivo: recuperar conta sem suporte manual.
UX/Fluxo: "Esqueci minha senha" -> OTP -> nova senha.
Backend: endpoints de reset e tokens temporarios.
Mobile: tela de reset com validacao.
Dados: tabela de tokens ou reutilizar tabela de OTPS com tipo.
Edge cases: expiracao do token, email nao encontrado.
Metricas: taxa de conclusao do reset.
Prioridade: MEDIA.

---

**13) Observabilidade e padrao de erros**

Objetivo: reduzir tempo de debug e melhorar suporte.
UX/Fluxo: mensagens amigaveis no app, logs estruturados no backend.
Backend: padronizar erros com `code`, `message`, `details`.
Mobile: mapear `code` para mensagens.
Dados: nenhum.
Edge cases: erros nao mapeados -> fallback.
Metricas: taxa de erro por endpoint.
Prioridade: MEDIA.

---

**14) Refinos de design e identidade**

Objetivo: elevar percepcao de qualidade e diferenciar o produto.
UX/Fluxo: tipografia customizada, gradientes por categoria, cards com sombras consistentes.
Backend: nao precisa.
Mobile: aplicar fontes via `expo-font`; tokens de cor por categoria; uso de `SafeAreaView`.
Dados: nenhum.
Edge cases: dispositivos antigos, acessibilidade.
Metricas: NPS e tempo medio por sessao.
Prioridade: BAIXA.

---

**15) Acessibilidade**

Objetivo: app inclusivo e mais robusto.
UX/Fluxo: suporte a leitor de tela, tamanho de fonte dinamico.
Backend: nao precisa.
Mobile: `accessibilityLabel`, contraste, tamanhos flexiveis.
Dados: nenhum.
Edge cases: textos longos.
Metricas: auditoria de acessibilidade.
Prioridade: BAIXA.

---

**16) Qualidade de dados e conteudo**

Objetivo: manter banco de perguntas consistente e sem erros.
UX/Fluxo: curadoria de perguntas e revisao.
Backend: validacoes de string, tamanho e duplicidade.
Mobile: opcional reportar pergunta incorreta.
Dados: flags de status e revisao.
Edge cases: perguntas duplicadas.
Metricas: taxa de reportes e tempo de resolucao.
Prioridade: MEDIA.

---

Fim do documento.
