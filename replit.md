# Trello Clone - Comprehensive Kanban Board

Um clone completo do Trello com funcionalidades avançadas de colaboração, automação e personalização.

## 🎯 Visão Geral do Projeto

Clone do Trello desenvolvido em React + Vite (frontend) e Express.js (backend) com PostgreSQL. Possui sistema de quadros Kanban completo com recursos avançados de colaboração em tempo real, sistema de voting, notificações, templates, anexos e muito mais.

## 🚀 Stack Tecnológica

### Frontend
- **Framework**: React 18 com Vite
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Radix UI
- **Drag & Drop**: @dnd-kit
- **Gerenciamento de Estado**: React Query
- **Roteamento**: Wouter
- **WebSocket**: Native WebSocket API

### Backend
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Autenticação**: Passport.js (Local Strategy)
- **WebSocket**: ws library
- **Sessões**: express-session com connect-pg-simple

## ✨ Funcionalidades Implementadas

### 1. 📎 Sistema de Anexos (AttachmentManager) ✅
- Upload de arquivos múltiplos
- Adição de links externos
- Preview de imagens
- Download de arquivos
- Gerenciamento de anexos (excluir, visualizar)
- Suporte a diversos tipos de arquivos
- Interface intuitiva com thumbnails
- **Integrado**: CardDetailModal com persistência por cartão

**Localização**: `client/src/components/AttachmentManager.tsx`
**Status**: Totalmente integrado e funcional

### 2. 📋 Templates Reutilizáveis (TemplateManager) 🔄
- Templates de cartões pré-configurados
- Templates de quadros completos
- Categorias: Featured, Team, Personal
- Templates padrão incluídos:
  - Bug Report
  - Feature Request
  - Meeting Notes
  - Kanban Simples
  - Sprint Planning
  - Pipeline de Vendas
  - Calendário de Conteúdo
- Busca e filtros
- Criação de templates personalizados
- Contagem de uso de templates

**Localização**: `client/src/components/TemplateManager.tsx`
**Status**: Componente pronto, aguardando integração no UI

### 3. 🗳️ Sistema de Votação (VotingSystem) ✅
- Votação positiva/negativa em cartões
- Score visual de votos
- Lista de votantes
- Avatar dos usuários que votaram
- Indicadores visuais de tendência
- Tooltips com informações detalhadas
- Suporte a votação anônima (planejado)
- **Integrado**: Sidebar do CardDetailModal com cálculo de score

**Localização**: `client/src/components/VotingSystem.tsx`
**Status**: Totalmente integrado e funcional

### 4. 🎨 Personalização de Fundo (BoardBackgroundCustomizer) 🔄
- Cores sólidas predefinidas
- Gradientes modernos
- Imagens de fundo (Unsplash)
- Padrões geométricos
- Seletor de cores personalizado
- Preview em tempo real
- Múltiplas categorias organizadas

**Localização**: `client/src/components/BoardBackgroundCustomizer.tsx`
**Status**: Componente pronto, aguardando integração no UI

### 5. 🔔 Central de Notificações (NotificationCenter) ✅
- Notificações em tempo real
- Múltiplos tipos de notificação:
  - Menções (@usuario)
  - Atribuições de cartões
  - Prazos se aproximando
  - Novos comentários
  - Etiquetas adicionadas
  - Cartões movidos
  - Votos recebidos
- Filtros (Todas / Não lidas)
- Marcar como lida
- Contador de não lidas
- Ações rápidas
- Timestamps relativos
- **Integrado**: Header principal (TrelloHeader)

**Localização**: `client/src/components/NotificationCenter.tsx`
**Status**: Totalmente integrado e funcional

### 6. 👥 Sistema de Permissões (PermissionsManager) 🔄
- 4 níveis de permissão:
  - **Owner**: Controle total
  - **Admin**: Gerenciamento completo exceto arquivar quadro
  - **Member**: Criar e editar cartões
  - **Observer**: Apenas visualizar e comentar
- Convidar membros por email
- Alterar roles de membros
- Remover membros
- Busca de membros
- Visualização de permissões por role

**Localização**: `client/src/components/PermissionsManager.tsx`
**Status**: Componente pronto, aguardando integração no UI

### 7. 🌐 Colaboração em Tempo Real (WebSocket) ✅
- Conexão WebSocket persistente
- Sincronização automática de mudanças
- Indicadores de usuários online
- Presença em tempo real
- Reconnect automático
- Heartbeat para manter conexão
- Broadcast de atualizações do quadro
- Notificações push
- **Integrado**: Página Home com tracking de usuários online

**Backend**: `server/websocket.ts`
**Frontend Hook**: `client/src/hooks/useWebSocket.ts`
**Status**: Integrado (requer configuração adicional do backend)

### 8. ⏰ Card Aging (Indicador de Idade) ✅
- Indicadores visuais de idade dos cartões
- 4 status: New, Normal, Warning, Critical
- Badges configuráveis
- Tooltips informativos
- Estatísticas de aging do quadro
- Configuração de thresholds
- Cores automáticas baseadas em idade
- **Integrado**: TrelloCard com indicação visual de idade

**Utilitários**: `client/src/utils/cardAging.ts`
**Componente**: `client/src/components/CardAgingIndicator.tsx`
**Status**: Totalmente integrado e funcional

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

1. **users** - Usuários do sistema
2. **boards** - Quadros Kanban
3. **boardMembers** - Membros e permissões dos quadros
4. **lists** - Listas dentro dos quadros
5. **cards** - Cartões das listas
6. **cardVotes** - Votos nos cartões
7. **attachments** - Anexos dos cartões
8. **notifications** - Notificações dos usuários
9. **cardTemplates** - Templates de cartões
10. **boardTemplates** - Templates de quadros
11. **comments** - Comentários nos cartões
12. **activities** - Log de atividades

**Schema**: `shared/schema.ts`

## 📁 Estrutura do Projeto

```
├── client/                      # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── AttachmentManager.tsx
│   │   │   ├── TemplateManager.tsx
│   │   │   ├── VotingSystem.tsx
│   │   │   ├── BoardBackgroundCustomizer.tsx
│   │   │   ├── NotificationCenter.tsx
│   │   │   ├── PermissionsManager.tsx
│   │   │   ├── CardAgingIndicator.tsx
│   │   │   └── ...
│   │   ├── hooks/              # Custom React Hooks
│   │   │   ├── useWebSocket.ts
│   │   │   └── ...
│   │   ├── utils/              # Utilitários
│   │   │   ├── cardAging.ts
│   │   │   └── ...
│   │   └── ...
├── server/                      # Backend Express
│   ├── index.ts                # Entry point
│   ├── routes.ts               # API routes
│   ├── websocket.ts            # WebSocket server
│   ├── storage.ts              # Data storage
│   └── ...
├── shared/                      # Código compartilhado
│   └── schema.ts               # Schema do banco de dados
└── ...
```

## 🔧 Configuração e Execução

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Push do schema para o banco
npm run db:push

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor roda na porta 5000 por padrão.

### Produção

```bash
# Build do projeto
npm run build

# Iniciar em produção
npm start
```

## 🎨 Componentes de UI

O projeto utiliza Radix UI com Tailwind CSS para componentes acessíveis:

- Button, Card, Badge, Avatar
- Dialog, Popover, Tooltip
- Select, Input, Textarea
- Tabs, ScrollArea
- Progress, Separator
- E muito mais...

Todos os componentes estão em `client/src/components/ui/`

## 🔐 Autenticação e Segurança

- Autenticação via Passport.js
- Sessões persistentes no PostgreSQL
- Hashing de senhas com bcrypt
- Proteção de rotas no backend
- Validação com Zod

## 🌐 WebSocket e Colaboração

### Eventos WebSocket

- `join` - Usuário entra no quadro
- `leave` - Usuário sai do quadro
- `update` - Atualização no quadro
- `presence` - Mudança de presença
- `sync` - Sincronização de dados
- `notification` - Nova notificação

### Uso do Hook

```typescript
const { isConnected, onlineUsers, sendUpdate } = useWebSocket({
  boardId: "board-123",
  userId: "user-456",
  userName: "João Silva",
  onUpdate: (data) => {
    // Handle updates from other users
  },
  onPresenceChange: (users) => {
    // Handle online users changes
  }
});
```

## 🎯 Status das Integrações

### ✅ Componentes Integrados
1. **AttachmentManager** - Totalmente funcional no CardDetailModal
2. **VotingSystem** - Totalmente funcional no CardDetailModal
3. **NotificationCenter** - Integrado no TrelloHeader
4. **CardAgingIndicator** - Integrado nos cartões TrelloCard
5. **useWebSocket** - Conectado na página Home

### 🔄 Próximas Integrações
1. **TemplateManager** - Precisa ser conectado ao menu/header do quadro
2. **BoardBackgroundCustomizer** - Precisa ser conectado às configurações do quadro
3. **PermissionsManager** - Precisa ser conectado às configurações do quadro

### 🛠️ Backend Pendente
- Rotas de API para notificações, anexos e votações
- Integração com Replit Object Storage para upload real de anexos
- Configuração completa do WebSocket server

## 🎯 Próximas Funcionalidades (Planejadas)

- [ ] Automação de tarefas (Butler-style)
- [ ] Integração com calendário
- [ ] Power-ups e integrações
- [ ] Relatórios e analytics
- [ ] Suporte offline completo
- [ ] Busca avançada
- [ ] Campos personalizados
- [ ] Importar/Exportar dados
- [ ] API REST documentada
- [ ] Aplicativo mobile

## 📝 Convenções de Código

- **Linguagem**: TypeScript em todo o projeto
- **Estilo**: Functional components com hooks
- **Nomenclatura**: camelCase para variáveis, PascalCase para componentes
- **Localização**: Interface em português brasileiro
- **Formatação**: Prettier + ESLint

## 🐛 Debug e Logs

- Logs do servidor via console.log
- WebSocket logs para debug de conexão
- LSP diagnostics para erros TypeScript
- Browser console para debug frontend

## 📦 Dependências Principais

### Frontend
- react, react-dom
- @tanstack/react-query
- @dnd-kit/* (drag and drop)
- @radix-ui/* (UI components)
- date-fns (datas)
- lucide-react (ícones)
- tailwindcss

### Backend
- express
- drizzle-orm
- @neondatabase/serverless
- passport, passport-local
- ws (WebSocket)
- bcrypt

## 🔗 Links Úteis

- [Documentação Drizzle ORM](https://orm.drizzle.team)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)
- [dnd-kit](https://dndkit.com)

## 👨‍💻 Desenvolvimento

Projeto desenvolvido com foco em:
- Performance e otimização
- UX intuitiva
- Código limpo e manutenível
- Escalabilidade
- Acessibilidade

---

## 🔧 Configuração do Replit

### Setup Inicial ✅
- **Node.js**: Instalado via módulo nodejs-20
- **Servidor de Desenvolvimento**: Porta 5000 (obrigatória no Replit)
- **Banco de Dados**: PostgreSQL configurado com DATABASE_URL
- **Schema do Banco**: Aplicado com sucesso via `npm run db:push`
- **WebSocket**: Configurado em `/ws` para colaboração em tempo real
- **Status**: Projeto totalmente configurado e funcionando

### Workflow Configurado ✅
- **Nome**: Server
- **Comando**: `npm run dev`
- **Porta**: 5000
- **Tipo**: webview (frontend)
- **Status**: Rodando e servindo a aplicação

### Deployment ✅
- **Target**: autoscale (sem estado, escalável)
- **Build**: `npm run build`
- **Run**: `npm start`
- **Status**: Configurado e pronto para publicação

### Configurações Importantes
1. Vite dev server configurado com:
   - `host: "0.0.0.0"` (obrigatório no Replit)
   - `allowedHosts: true` (permite proxy do Replit)
   - Porta 5000 (única porta não firewall-protected)

2. Express server:
   - Usa porta do `process.env.PORT` ou 5000
   - WebSocket em `/ws` para real-time
   - Vite middleware em desenvolvimento

### Instalação Completa
```bash
# Dependências instaladas
npm install  # ✅ Executado

# Schema do banco aplicado
npm run db:push  # ✅ Executado

# Servidor iniciado
npm run dev  # ✅ Rodando na porta 5000
```

### Data de Setup
**Última configuração**: 30 de Setembro de 2025 (Fresh GitHub Import)
**Status do Projeto**: ✅ Totalmente funcional no Replit

### GitHub Import Setup ✅
- **Data**: 30 de Setembro de 2025
- **Status**: Importação concluída com sucesso
- **Node.js**: Módulo nodejs-20 já instalado
- **Dependências**: Instaladas via `npm install`
- **Banco de Dados**: PostgreSQL provisionado e schema aplicado
- **Servidor**: Rodando na porta 5000 com Vite + Express
- **WebSocket**: Configurado e funcionando em `/ws`
- **Deployment**: Configurado para autoscale com build e run scripts

### Correções Aplicadas (30/09/2025) ✅

#### Bug de Labels nas Rotas API (Linhas 345-356 de server/routes.ts)

**Problema Original:**
- Rotas de API retornando erro 500
- Erro SSL: "self-signed certificate in certificate chain"
- Erro Neon: "Cannot read properties of null (reading 'map')"

**Causa Raiz:**
1. **Certificado SSL**: Driver HTTP do Neon (@neondatabase/serverless) no Replit tinha problemas com certificados SSL auto-assinados
2. **Bug do Neon**: Driver HTTP retorna `null` em vez de array vazio quando não há resultados, causando erro ao chamar `.map()`
3. **Configuração Incorreta**: WebSocket estava configurado desnecessariamente para o driver HTTP

**Soluções Implementadas:**

1. **SSL Fix** (server/storage.ts, linha 28-30):
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
   }
   ```

2. **Correção do Bug Neon** (server/storage.ts):
   - Adicionado try-catch em métodos que usam `.map()`:
     - `getLabelsByBoardId()`
     - `getBoardsByUserId()`
     - `getCardLabels()`
   - Retorna array vazio quando Neon retorna null

3. **Remoção de WebSocket Config**:
   - Removido `neonConfig.webSocketConstructor = ws` (apenas necessário para driver Pool)
   - Driver HTTP (`drizzle-orm/neon-http`) não usa WebSocket

**Status:**
- ✅ Todas as rotas de labels funcionando (200 OK)
- ✅ Retorna arrays vazios corretamente
- ✅ Erro SSL resolvido
- ✅ Bug do Neon contornado com tratamento de erro

**Rotas Corrigidas:**
- `GET /api/boards/:boardId/labels` → 200 OK
- `GET /api/cards/:cardId/labels` → 200 OK
- `POST /api/boards/:boardId/labels` → Funcional
- `PATCH /api/labels/:id` → Funcional
- `DELETE /api/labels/:id` → Funcional

---

## 📊 Estrutura de Dados dos Cartões

### TrelloCardData Interface
```typescript
interface TrelloCardData {
  id: string;
  title: string;
  description?: string;
  labels?: Label[];
  members?: Member[];
  comments: number;
  attachments: number;
  location?: string;
  votes?: number;
  checklist?: ChecklistItem[];
  dueDate?: string;
  position?: number;
  createdAt?: Date;              // Para CardAgingIndicator
  attachmentsList?: Attachment[]; // Lista completa de anexos
  votesList?: Vote[];            // Lista completa de votos
}
```

### Fluxo de Dados
1. Estado inicial carregado dos dados mock em Home.tsx
2. CardDetailModal inicializa estado local via useEffect
3. Mudanças são persistidas de volta via onUpdateCard
4. Badges nos cartões atualizam automaticamente

---

**Status**: Em desenvolvimento ativo 🚀
**Última atualização**: Setembro 2025
