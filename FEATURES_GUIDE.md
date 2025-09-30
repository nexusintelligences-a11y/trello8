# Guia de Funcionalidades - Trello Clone

Este documento descreve como usar todas as funcionalidades avançadas implementadas no Trello Clone.

## 📎 Sistema de Anexos

### Como Usar
1. Abra um cartão
2. Procure pela seção "Anexos"
3. Clique em **"Carregar arquivo"** para adicionar arquivos do seu computador
4. Ou clique em **"Adicionar link"** para adicionar URLs externas

### Funcionalidades
- ✅ Upload múltiplo de arquivos
- ✅ Preview automático de imagens
- ✅ Download de arquivos
- ✅ Visualização de tamanho e tipo do arquivo
- ✅ Histórico de quando foi adicionado
- ✅ Excluir anexos

### Tipos Suportados
- Imagens (JPG, PNG, GIF, etc.)
- PDFs e documentos
- Vídeos e áudio
- Links externos

---

## 📋 Templates

### Templates de Cartões

#### Templates Incluídos
1. **Bug Report** - Para reportar bugs
2. **Feature Request** - Para solicitar funcionalidades
3. **Meeting Notes** - Para atas de reunião

#### Como Usar
1. Clique no botão de templates no menu
2. Navegue para a aba **"Templates de Cartões"**
3. Pesquise pelo template desejado
4. Clique no ícone de copiar para usar o template

#### Criar Template Personalizado
1. Clique em **"Criar template"**
2. Dê um nome e descrição
3. O template será salvo com a estrutura do cartão atual

### Templates de Quadros

#### Templates Incluídos
1. **Kanban Simples** - 4 listas básicas
2. **Sprint Planning** - Para desenvolvimento ágil
3. **Pipeline de Vendas** - Para gerenciar vendas
4. **Calendário de Conteúdo** - Para produção de conteúdo

#### Como Usar
1. Clique no botão de templates
2. Navegue para **"Templates de Quadros"**
3. Escolha um template
4. Clique em copiar para aplicar ao quadro atual

---

## 🗳️ Sistema de Votação

### Como Votar
1. Abra um cartão
2. Encontre a seção de votação
3. Clique em **👍** para votar a favor
4. Clique em **👎** para votar contra
5. Clique novamente no mesmo botão para remover seu voto

### Visualização
- **Score**: Mostra a diferença entre votos positivos e negativos
- **Votantes**: Veja quem votou passando o mouse sobre os avatares
- **Cores**: 
  - Verde = Score positivo
  - Vermelho = Score negativo
  - Cinza = Score neutro

### Casos de Uso
- Priorização de features
- Decisões em equipe
- Feedback de ideias
- Ranking de importância

---

## 🎨 Personalização de Fundo

### Como Personalizar
1. No menu do quadro, clique em **"Alterar fundo"**
2. Escolha entre 4 categorias:

#### Cores Sólidas
- 9 cores predefinidas
- Seletor de cor personalizado

#### Gradientes
- 8 gradientes modernos
- Efeitos visuais atraentes

#### Imagens
- 6 imagens do Unsplash
- Paisagens, abstrato, espaço, etc.

#### Padrões
- Pontos
- Linhas diagonais
- Grade

### Aplicar
1. Clique na opção desejada
2. O fundo é aplicado instantaneamente
3. A escolha é salva automaticamente

---

## 🔔 Central de Notificações

### Acessar Notificações
1. Clique no ícone de sino 🔔 no cabeçalho
2. Veja o contador de notificações não lidas

### Tipos de Notificação

#### 💬 Menções
Quando alguém menciona você com @seunome

#### 👥 Atribuições
Quando você é atribuído a um cartão

#### 📅 Prazos
- Alerta quando o prazo está próximo
- Notificação quando o prazo passou

#### 💬 Comentários
Novos comentários em cartões que você participa

#### 🏷️ Etiquetas
Quando etiquetas são adicionadas aos seus cartões

#### 📊 Movimentações
Quando cartões são movidos entre listas

#### 🗳️ Votos
Quando alguém vota em seus cartões

### Gerenciar Notificações
- **Marcar como lida**: Clique na notificação ou no ✓
- **Marcar todas**: Botão "Marcar todas" no topo
- **Excluir**: Clique no ícone de lixeira
- **Limpar tudo**: Botão "Limpar" remove todas
- **Filtrar**: Alterne entre "Todas" e "Não lidas"

---

## 👥 Sistema de Permissões

### Níveis de Acesso

#### 👑 Owner (Proprietário)
**Pode fazer tudo:**
- Editar e arquivar o quadro
- Convidar e remover membros
- Alterar roles de todos
- Gerenciar power-ups e automação
- Todas as ações de cartões

#### 🛡️ Admin (Administrador)
**Quase tudo, exceto:**
- ❌ Não pode arquivar o quadro
- ❌ Não pode alterar role do owner
- ✅ Pode convidar e remover membros
- ✅ Gerenciar power-ups e automação

#### ✏️ Member (Membro)
**Ações básicas:**
- ✅ Criar e editar cartões
- ✅ Mover cartões
- ✅ Adicionar comentários
- ✅ Votar
- ❌ Não pode gerenciar membros
- ❌ Não pode excluir cartões

#### 👁️ Observer (Observador)
**Apenas visualização:**
- ✅ Ver o quadro
- ✅ Adicionar comentários
- ✅ Votar
- ❌ Não pode criar/editar cartões
- ❌ Não pode mover cartões

### Gerenciar Membros

#### Convidar Novo Membro
1. Clique em **"Convidar membro"**
2. Digite o email
3. Escolha o role (Admin, Member ou Observer)
4. Clique em **"Enviar convite"**

#### Alterar Role
1. Encontre o membro na lista
2. Clique no dropdown de role
3. Selecione o novo role
4. A mudança é imediata

#### Remover Membro
1. Encontre o membro
2. Clique no ícone de lixeira 🗑️
3. Confirme a ação

### Buscar Membros
Use a barra de busca quando houver mais de 5 membros no quadro.

---

## 🌐 Colaboração em Tempo Real

### Recursos WebSocket

#### Presença Online
- Veja quem está online no quadro
- Avatares dos usuários ativos
- Atualização em tempo real

#### Sincronização Automática
- Mudanças aparecem instantaneamente para todos
- Sem necessidade de recarregar a página
- Conflitos resolvidos automaticamente

#### Indicadores
- **Online**: ✅ Conexão ativa
- **Offline**: ❌ Sem conexão (modo offline ativo)
- **Reconectando**: 🔄 Tentando reconectar

### O que é Sincronizado
- Criação/edição/exclusão de cartões
- Movimentação de cartões
- Alterações em listas
- Novos comentários
- Votos
- Anexos
- Atribuições

---

## ⏰ Card Aging (Idade dos Cartões)

### O que é?
Sistema visual que mostra a idade dos cartões para identificar tarefas antigas.

### Status de Aging

#### 🆕 Novo (< 24h)
- Badge azul "Novo" ou "Hoje"
- Cartão com fundo azul claro

#### ✅ Normal (< 7 dias)
- Sem indicador especial
- Cartão com fundo padrão

#### ⚠️ Atenção (7-14 dias)
- Badge amarelo com dias
- Fundo amarelo claro
- Requer atenção

#### 🚨 Crítico (> 14 dias)
- Badge vermelho com dias
- Fundo vermelho claro
- Requer atenção urgente

### Visualizar Aging
1. Passe o mouse sobre o ícone do relógio ⏰
2. Veja tooltip com idade exata
3. Badge mostra idade de forma visual

### Estatísticas do Quadro
No topo do quadro, veja resumo:
- X novos
- X atenção
- X críticos

### Configuração
Thresholds podem ser ajustados:
- `yellowThresholdDays`: Dias para ficar amarelo (padrão: 7)
- `redThresholdDays`: Dias para ficar vermelho (padrão: 14)

---

## 💡 Dicas de Uso

### Atalhos de Teclado
- `Ctrl+K` ou `⌘+K`: Busca global
- `F`: Abrir filtros
- `N`: Novo cartão
- `1-4`: Alternar entre visualizações
- `Ctrl+D`: Alternar tema
- `Esc`: Fechar modais

### Boas Práticas

#### Organização
1. Use templates para padronizar cartões
2. Configure permissões adequadas para cada membro
3. Ative notificações para ficar atualizado

#### Colaboração
1. Mencione membros com @ nos comentários
2. Use votação para decisões em equipe
3. Anexe arquivos relevantes aos cartões

#### Gestão
1. Monitore cards aging para identificar tarefas antigas
2. Personalize o fundo para diferenciar quadros
3. Use a busca global para encontrar rapidamente

---

## 🔧 Solução de Problemas

### WebSocket não conecta
1. Verifique sua conexão com internet
2. Recarregue a página
3. O sistema tentará reconectar automaticamente

### Arquivos não carregam
1. Verifique o tamanho do arquivo
2. Certifique-se de ter permissão para editar
3. Tente usar links externos como alternativa

### Notificações não aparecem
1. Verifique se está conectado (indicador online)
2. Recarregue a página
3. Verifique suas permissões no quadro

---

## 📱 Próximas Funcionalidades

Em desenvolvimento:
- Automação de tarefas (regras Butler-style)
- Calendário integrado
- Power-ups personalizados
- Relatórios e analytics
- App mobile
- Suporte offline completo
- Campos personalizados avançados

---

**Documentação atualizada**: Setembro 2025  
**Versão**: 1.0.0
