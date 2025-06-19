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
