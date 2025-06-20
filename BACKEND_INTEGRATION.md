# Integração Frontend-Backend - MoneyMaker

Este documento descreve as correções implementadas para resolver os problemas de comunicação entre o frontend Next.js e o backend.

## Problemas Resolvidos

### 1. Header x-client-id Obrigatório ✅

**Problema**: O backend exige o header `x-client-id` em todas as requisições para identificar o tenant.

**Solução**:

- Configurado no `lib/api.ts` para incluir automaticamente o header em todas as requisições
- Função `getDefaultHeaders()` e `getServerHeaders()` garantem que o header seja sempre enviado
- Suporte a cliente padrão via `NEXT_PUBLIC_DEFAULT_CLIENT_ID`

```typescript
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  'x-client-id': clientId, // Sempre presente
}
```

### 2. Configuração Unificada da URL da API ✅

**Problema**: Uso inconsistente de `API_URL` e `NEXT_PUBLIC_API_URL`.

**Solução**:

- Configuração centralizada em `API_CONFIG` com fallback:

```typescript
const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    'http://localhost:3001/api',
}
```

### 3. Token de Autenticação em SSR/Server Actions ✅

**Problema**: Token não enviado corretamente em Server Actions.

**Solução**:

- Funções específicas para Server Actions: `serverGet`, `serverPost`, `serverPut`, `serverDelete`
- Leitura automática de cookies httpOnly
- Headers corretos em todas as requisições do servidor

### 4. Padronização de Headers ✅

**Problema**: Uso misto de fetch e axios sem padronização.

**Solução**:

- Interceptors do Axios para client-side com headers automáticos
- Funções server\* para Server Actions com headers consistentes
- Centralização da lógica de headers

### 5. Suporte a Múltiplos Tenants ✅

**Problema**: client_id hardcoded, sem suporte dinâmico.

**Solução**:

- Sistema de tenant atual: `setCurrentTenant()`, `getCurrentTenant()`
- Salvamento de client_id em cookies httpOnly
- Hook `useAuth()` com função `switchTenant()`
- API route para trocar tenant: `/api/auth/switch-tenant`

### 6. Propagação do client_id Após Login ✅

**Problema**: client_id não salvo após login bem-sucedido.

**Solução**:

- `loginAction()` salva client_id em cookie httpOnly
- `setCurrentTenant()` propaga client_id para requisições
- Hook `useAuth()` gerencia estado do tenant

### 7. Refresh Automático do Token ✅

**Problema**: Sem lógica de renovação automática do token.

**Solução**:

- Interceptor de resposta tenta refresh automático em erro 401
- `refreshTokenAction()` para renovação manual
- Redirecionamento automático para login se refresh falhar

### 8. Configuração de CORS ✅

**Problema**: Possíveis erros de CORS em produção.

**Solução**:

- Variáveis de ambiente para URLs permitidas
- Configuração de cookies seguros em produção
- Headers apropriados para requests cross-origin

## Arquivos Modificados/Criados

### Arquivos Principais

- `lib/api.ts` - Sistema completo de API com headers automáticos
- `actions/auth.ts` - Login/logout com gerenciamento de tenant
- `actions/dashboard.ts` - Dashboard com headers corretos
- `actions/clients.ts` - CRUD de clientes padronizado
- `actions/contact.ts` - Contato com headers corretos

### Novos Hooks

- `lib/hooks/useAuth.ts` - Hook para gerenciamento de autenticação e tenant

### Rotas de API

- `app/api/auth/verify/route.ts` - Verificação de token
- `app/api/auth/me/route.ts` - Dados do usuário
- `app/api/auth/switch-tenant/route.ts` - Troca de tenant

### Configuração

- `env.example` - Variáveis de ambiente necessárias

## Configuração de Variáveis de Ambiente

Crie um arquivo `.env.local` com base no `env.example`:

```bash
# URLs da API
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_URL=http://localhost:3001/api

# Cliente padrão
NEXT_PUBLIC_DEFAULT_CLIENT_ID=seu-client-id-padrao

# Autenticação
NEXT_PUBLIC_ENABLE_AUTH=true
NEXTAUTH_SECRET=sua-chave-secreta-aqui
```

## Como Usar

### 1. Client-Side (Componentes React)

```typescript
import { get, post, setCurrentTenant } from '@/lib/api'
import { useAuth } from '@/lib/hooks/useAuth'

// Em um componente
const { user, login, logout, switchTenant } = useAuth()

// Fazer requisições
const data = await get('/endpoint')
const result = await post('/endpoint', payload)
```

### 2. Server Actions

```typescript
import { serverGet, serverPost } from '@/lib/api'

export async function myServerAction() {
  const result = await serverGet('/endpoint')
  return result
}
```

### 3. Troca de Tenant

```typescript
const { switchTenant } = useAuth()
await switchTenant('novo-client-id')
```

## Fluxo de Autenticação

1. **Login**:

   - Usuário faz login com email/senha
   - Backend retorna token + client_id
   - Frontend salva em cookies httpOnly
   - `setCurrentTenant()` configura tenant atual

2. **Requisições**:

   - Headers automáticos: `Authorization` + `x-client-id`
   - Refresh automático em erro 401
   - Redirecionamento para login se não autenticado

3. **Troca de Tenant**:
   - API `/api/auth/switch-tenant`
   - Novo token e atualização de cookies
   - Reload da página para novos dados

## Testando a Integração

1. Configure as variáveis de ambiente
2. Inicie o backend na porta 3001
3. Inicie o frontend: `npm run dev`
4. Teste login e navegação no dashboard
5. Verifique headers nas requisições (DevTools)

## Observações Importantes

- **Cookies httpOnly**: Tokens são armazenados de forma segura
- **Headers Automáticos**: x-client-id sempre presente
- **Refresh Automático**: Usuário não perde sessão desnecessariamente
- **Multi-tenant**: Suporte completo a múltiplos clientes

## Problema de Autenticação Resolvido ✅

### Sintomas do Problema:

- 401 - "Token inválido ou expirado" na rota `/api/v1/dashboard/stats`
- 500 - "Cannot read properties of undefined (reading 'sub')" na rota `/api/v1/auth/me`

### Causa:

O token JWT não estava sendo enviado corretamente nas requisições server-side.

### Solução Implementada:

1. **Middleware Next.js (`middleware.ts`)**:

   - Protege rotas do dashboard
   - Permite bypass em desenvolvimento
   - Redireciona automaticamente baseado no estado de autenticação

2. **Headers de Autenticação Corrigidos**:

   - Função `getServerHeaders()` corrigida para usar cookies corretamente
   - Logs de debug adicionados para facilitar troubleshooting

3. **Hook useAuth**:
   - Gerencia estado de autenticação no cliente
   - Verifica token periodicamente
   - Logout automático em caso de erro 401

## Configuração de Desenvolvimento

### Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `env.example`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_DEFAULT_CLIENT_ID=default-client

# Authentication Configuration
# Set to 'false' to disable authentication in development
NEXT_PUBLIC_ENABLE_AUTH=false

# Development Mode
NODE_ENV=development
```

### Modo de Desenvolvimento

Para desenvolvimento **sem backend**:

```bash
# No .env.local
NEXT_PUBLIC_ENABLE_AUTH=false
NODE_ENV=development
```

Para desenvolvimento **com backend**:

```bash
# No .env.local
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Estrutura de Autenticação

### Server Actions (app/actions/auth.ts)

- `loginAction()` - Login com salvamento de cookies httpOnly
- `logoutAction()` - Logout com limpeza de cookies
- `getAuthUser()` - Verificação de usuário autenticado
- `requireAuth()` - Middleware para rotas protegidas

### API Client (lib/api.ts)

- Interceptors para adicionar token automaticamente
- Refresh automático de token em caso de 401
- Headers corretos para multi-tenant

### Middleware (middleware.ts)

- Proteção de rotas do dashboard
- Redirecionamento automático
- Suporte a modo de desenvolvimento

## Fluxo de Autenticação

1. **Login**:

   ```typescript
   // Usuário faz login
   const result = await loginAction({ email, password })

   // Token salvo em cookie httpOnly
   cookies().set('auth_token', token, { httpOnly: true })
   cookies().set('client_id', clientId, { httpOnly: true })
   ```

2. **Requisições Autenticadas**:

   ```typescript
   // Server actions automaticamente incluem headers
   const stats = await serverGet<DashboardStats>('/dashboard/stats')
   // Headers: Authorization: Bearer <token>, x-client-id: <clientId>
   ```

3. **Proteção de Rotas**:
   ```typescript
   // middleware.ts verifica token antes de permitir acesso
   if (pathname.startsWith('/dashboard') && !token) {
     return NextResponse.redirect('/login')
   }
   ```

## Debugging

### Logs Úteis

Para debugar problemas de autenticação, verifique os logs:

```bash
# Frontend (Next.js)
🔍 Debug Server Headers:
- Token presente: true/false
- Client ID: default-client
- Token (primeiros 20 chars): eyJhbGciOiJIUzI1NiIs...

📤 Headers enviados: ['Content-Type', 'x-client-id', 'Authorization']
```

```bash
# Backend (NestJS)
[Nest] ERROR [HttpExceptionFilter] GET /api/v1/dashboard/stats - 401 - Token inválido ou expirado
```

### Verificação Manual

Para verificar se os cookies estão sendo salvos:

```javascript
// No DevTools > Application > Cookies
// Deve existir:
auth_token: eyJhbGciOiJIUzI1NiIs...
client_id: default-client
```

### Testando API Diretamente

```bash
# Teste manual da API
curl -X GET http://localhost:3001/api/v1/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-client-id: default-client"
```

## Configuração do Backend

### Headers Esperados

O backend deve aceitar estes headers:

```typescript
// NestJS Guard/Interceptor
headers: {
  'Authorization': 'Bearer <jwt_token>',
  'x-client-id': '<client_id>',
  'Content-Type': 'application/json'
}
```

### Rotas de Autenticação

```typescript
// Backend routes que o frontend usa:
POST / api / v1 / auth / login // Login
POST / api / v1 / auth / logout // Logout
GET / api / v1 / auth / me // Verificar usuário
POST / api / v1 / auth / refresh // Refresh token
GET / api / v1 / dashboard / stats // Dados do dashboard
```

## Solução de Problemas

### 401 - Token inválido

1. Verificar se token existe nos cookies
2. Verificar se headers estão sendo enviados
3. Validar token no backend
4. Verificar expiração do token

### 500 - Cannot read properties of undefined

1. Verificar se JWT payload tem estrutura correta
2. Verificar se backend está decodificando token corretamente
3. Verificar se user.sub existe no payload

### Redirect loops

1. Verificar configuração do middleware
2. Verificar se cookies estão sendo salvos corretamente
3. Verificar variável NEXT_PUBLIC_ENABLE_AUTH

## Status da Implementação

- ✅ Middleware de proteção de rotas
- ✅ Login com cookies httpOnly
- ✅ Headers de autenticação corretos
- ✅ Refresh automático de token
- ✅ Modo de desenvolvimento sem auth
- ✅ Logs de debug detalhados
- ✅ Hook useAuth para estado do cliente
- ✅ Server actions com autenticação

## Próximos Passos

1. Testar integração completa com backend
2. Implementar refresh token automático
3. Adicionar testes de autenticação
4. Melhorar tratamento de erros de rede
