# 🚀 Modo de Desenvolvimento - MoneyMaker

## 🔓 Bypass de Autenticação para Desenvolvimento

Durante o desenvolvimento, implementamos um sistema de **bypass de autenticação** que permite acesso direto ao dashboard sem necessidade de login, similar ao que foi discutido no [GitHub issue sobre desenvolvimento local](https://github.com/okta/okta-oidc-js/issues/809).

## ⚙️ Como Funciona

### **Configuração Automática**

- **Desenvolvimento**: Autenticação **DESABILITADA** por padrão
- **Produção**: Autenticação **HABILITADA** automaticamente

### **Controle Manual (Opcional)**

Se quiser forçar a autenticação em desenvolvimento, crie um arquivo `.env.local`:

```bash
# Para HABILITAR autenticação em desenvolvimento
NEXT_PUBLIC_ENABLE_AUTH=true

# Para DESABILITAR (padrão)
# NEXT_PUBLIC_ENABLE_AUTH=false
```

## 👤 Usuário de Desenvolvimento

Quando a autenticação está desabilitada, o sistema usa um usuário fictício:

```typescript
{
  id: 'dev-user-1',
  name: 'Desenvolvedor',
  email: 'dev@moneymaker.com.br',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

## 🎯 Funcionalidades Disponíveis

### **✅ Dashboard Liberado**

- Acesso direto via `/dashboard`
- Todas as funcionalidades disponíveis
- Estatísticas mockadas para desenvolvimento

### **✅ Indicadores Visuais**

- **Badge amarelo**: 🚀 MODO DEV (canto superior direito)
- **Info do usuário**: Card azul com dados do dev
- **Botão especial**: 🚀 Dashboard (Dev) no header

### **✅ Header Adaptado**

- **Dev Mode**: Mostra "🚀 Dashboard (Dev)"
- **Prod Mode**: Mostra "Login" normal

## 🔧 Arquivos Envolvidos

```
lib/auth-config.ts          # Configuração principal
components/ui/DevModeIndicator.tsx  # Indicadores visuais
app/dashboard/layout.tsx     # Bypass no layout
components/layout/Header.tsx # Header adaptativo
```

## 🌐 URLs de Acesso

### **Desenvolvimento** (Auth OFF)

- **Dashboard**: `http://localhost:3000/dashboard` ✅ Direto
- **Login**: `http://localhost:3000/login` ⚠️ Desnecessário

### **Produção** (Auth ON)

- **Dashboard**: `http://localhost:3000/dashboard` 🔒 Redireciona para login
- **Login**: `http://localhost:3000/login` ✅ Obrigatório

## 🚨 Segurança

⚠️ **IMPORTANTE**: Este bypass é **APENAS para desenvolvimento**!

### **Proteções Implementadas**

1. **Detecção automática** de ambiente
2. **Indicadores visuais** para lembrar que está em modo dev
3. **Logs no console** para rastreabilidade
4. **Desabilitação automática** em produção

### **Em Produção**

```javascript
// Em produção, sempre exige autenticação
process.env.NODE_ENV === 'production' // = Auth HABILITADA
```

## 🔄 Alternando Modos

### **Para Desabilitar Autenticação** (Desenvolvimento)

```bash
# Apagar .env.local ou garantir que não tem:
# NEXT_PUBLIC_ENABLE_AUTH=true
npm run dev
```

### **Para Habilitar Autenticação** (Teste de Produção)

```bash
# Criar .env.local com:
echo "NEXT_PUBLIC_ENABLE_AUTH=true" > .env.local
npm run dev
```

## 📊 Logs e Debug

O sistema exibe logs úteis:

```bash
🔓 [DEV MODE] Autenticação desabilitada - Acesso livre ao dashboard
```

## 🔮 Próximos Passos

Quando estiver pronto para implementar autenticação real:

1. **Manter** o sistema de bypass para desenvolvimento
2. **Implementar** autenticação real (JWT, OAuth, etc.)
3. **Configurar** variáveis de ambiente de produção
4. **Testar** alternando entre modos

---

💡 **Dica**: Este sistema permite desenvolvimento **offline** e **sem configuração externa**, exatamente como solicitado no issue original do GitHub!

# Guia de Desenvolvimento - MoneyMaker

Este documento contém informações essenciais para desenvolvedores trabalhando no projeto MoneyMaker.

## 🚀 Configuração Inicial

### Requisitos

- Node.js 18+
- npm ou yarn
- Backend MoneyMaker rodando na porta 3001

### Instalação

```bash
npm install
# ou
yarn install
```

### Variáveis de Ambiente

Copie o arquivo `env.example` para `.env.local` e configure as variáveis:

```bash
cp env.example .env.local
```

Principais configurações:

```bash
# URLs da API
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_URL=http://localhost:3001/api

# Cliente padrão (obtenha do backend)
NEXT_PUBLIC_DEFAULT_CLIENT_ID=seu-client-id

# Autenticação
NEXT_PUBLIC_ENABLE_AUTH=true
```

### Executar Projeto

```bash
npm run dev
# ou
yarn dev
```

## 🔧 Integração Backend Corrigida

### Problemas Resolvidos ✅

1. **Header x-client-id**: Agora incluído automaticamente em todas as requisições
2. **Configuração de API**: URLs unificadas e configuração centralizada
3. **Autenticação SSR**: Tokens corretos em Server Actions
4. **Headers Padronizados**: Uso consistente em todo o projeto
5. **Multi-tenant**: Suporte completo a múltiplos clientes
6. **Refresh de Token**: Renovação automática quando necessário
7. **CORS**: Configuração adequada para produção

### Sistema de API

#### Client-side (Componentes React)

```typescript
import { get, post, put, del } from '@/lib/api'

// Requisições automáticas com headers
const data = await get('/users')
const result = await post('/users', userData)
```

#### Server Actions

```typescript
import { serverGet, serverPost } from '@/lib/api'

export async function getUsers() {
  const result = await serverGet('/users')
  return result
}
```

#### Hook de Autenticação

```typescript
import { useAuth } from '@/lib/hooks/useAuth'

function MyComponent() {
  const { user, login, logout, switchTenant, isLoading } = useAuth()

  // Login
  const handleLogin = async (credentials) => {
    const result = await login(credentials)
    if (!result.success) {
      console.error(result.message)
    }
  }

  // Trocar cliente/tenant
  const handleSwitchTenant = async (clientId) => {
    await switchTenant(clientId)
  }
}
```

## 📁 Estrutura do Projeto

```
MoneyMaker/
├── app/                      # App Router (Next.js 13+)
│   ├── (public)/            # Rotas públicas
│   │   ├── page.tsx         # Landing page
│   │   ├── servicos/        # Página de serviços
│   │   └── contato/         # Página de contato
│   ├── dashboard/           # Área autenticada
│   │   ├── page.tsx         # Dashboard principal
│   │   ├── clientes/        # Gestão de clientes
│   │   ├── agendamentos/    # Agendamentos
│   │   └── relatorios/      # Relatórios
│   ├── login/               # Página de login
│   ├── api/                 # API routes
│   │   └── auth/            # Rotas de autenticação
│   └── globals.css          # Estilos globais
├── components/              # Componentes reutilizáveis
│   ├── ui/                  # Componentes básicos
│   ├── cards/               # Cards específicos
│   ├── layout/              # Layout components
│   ├── dashboard/           # Componentes do dashboard
│   └── animations/          # Componentes de animação
├── actions/                 # Server Actions
│   ├── auth.ts              # Autenticação
│   ├── clients.ts           # Clientes
│   ├── dashboard.ts         # Dashboard
│   └── contact.ts           # Contato
├── lib/                     # Utilitários e configurações
│   ├── api.ts               # Sistema de API (RENOVADO)
│   ├── auth-config.ts       # Config de autenticação
│   ├── utils.ts             # Funções utilitárias
│   ├── validations.ts       # Schemas de validação
│   └── hooks/               # Custom hooks
│       └── useAuth.ts       # Hook de autenticação
└── types/                   # Definições de tipos
    └── index.ts             # Tipos TypeScript
```

## 🔐 Sistema de Autenticação

### Fluxo de Login

1. Usuário insere credenciais
2. `loginAction` faz requisição para backend
3. Backend retorna token + client_id
4. Frontend salva em cookies httpOnly
5. `setCurrentTenant` configura tenant atual
6. Redirecionamento para dashboard

### Gerenciamento de Token

- **Armazenamento**: Cookies httpOnly (seguro)
- **Refresh**: Automático em erro 401
- **Expiração**: Redirecionamento para login
- **Multi-tenant**: Troca dinâmica de cliente

### Headers Automáticos

Todas as requisições incluem:

```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>',
  'x-client-id': '<client-id>'
}
```

## 🎨 Sistema de Design

### Paleta de Cores

- **Primary**: Tons de laranja (#f97316)
- **Secondary**: Tons de ciano (#06b6d4)
- **Accent**: Tons de cinza para contraste

### Componentes Base

- `Button`: Botão reutilizável com variantes
- `Modal`: Modal genérico
- `ServiceCard`: Card de serviços
- `AnimatedDiv`: Animações com Framer Motion

### Animações

- **Biblioteca**: Framer Motion
- **Variantes**: 9 tipos de animação disponíveis
- **Scroll**: Animações baseadas em visibilidade
- **Performance**: Otimizadas para mobile

## 🧪 Testando Integração

### Verificar Headers

1. Abra DevTools (F12)
2. Acesse aba Network
3. Faça login no dashboard
4. Verifique se requisições incluem:
   - `Authorization: Bearer <token>`
   - `x-client-id: <client-id>`

### Testar Multi-tenant

```typescript
// No console do browser
const { switchTenant } = useAuth()
await switchTenant('novo-client-id')
```

### Debug de API

```typescript
import { checkBackendConnection } from '@/lib/api'

// Verificar conexão com backend
const isConnected = await checkBackendConnection()
console.log('Backend conectado:', isConnected)
```

## 🚀 Deploy e Produção

### Variáveis de Ambiente (Produção)

```bash
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api
API_URL=https://api.seudominio.com/api
NEXT_PUBLIC_DEFAULT_CLIENT_ID=prod-client-id
NEXT_PUBLIC_ENABLE_AUTH=true
NODE_ENV=production
```

### Configurações de Segurança

- Cookies httpOnly em produção
- HTTPS obrigatório
- CORS configurado adequadamente
- Headers de segurança

## 📝 Convenções de Código

### Server Actions

- Prefixo `Action` no nome
- Sempre async
- Tratamento de erro consistente
- Revalidação de cache quando necessário

### Componentes

- PascalCase para nomes
- Props tipadas com TypeScript
- Use client quando necessário
- Hooks personalizados para lógica complexa

### API Calls

- Use `serverGet/Post/Put/Delete` em Server Actions
- Use `get/post/put/del` em componentes client
- Headers automáticos (não adicionar manualmente)
- Tratamento de erro consistente

## 🔍 Troubleshooting

### Erro 401 - Não Autorizado

- Verificar se token existe em cookies
- Verificar se x-client-id está sendo enviado
- Tentar refresh manual: `refreshTokenAction()`

### Erro 403 - Cliente Não Identificado

- Verificar NEXT_PUBLIC_DEFAULT_CLIENT_ID
- Verificar se client_id foi salvo após login
- Tentar login novamente

### CORS Error

- Verificar configuração do backend
- Verificar variáveis ALLOWED_ORIGINS
- Verificar se URLs coincidem

### Refresh Token Error

- Limpar localStorage e cookies
- Fazer logout/login novamente
- Verificar se backend suporta refresh

## 📚 Recursos Adicionais

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Faça commits com mensagens claras
4. Teste a integração com backend
5. Abra um Pull Request

Para dúvidas sobre integração backend, consulte `BACKEND_INTEGRATION.md`.
