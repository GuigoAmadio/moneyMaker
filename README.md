# MoneyMaker - Plataforma de Serviços Digitais 🚀

Uma plataforma completa para empresas de serviços digitais, desenvolvida com Next.js 14, React, TypeScript, Tailwind CSS e sistema avançado de animações com Framer Motion.

## 🚀 Funcionalidades

### Site Institucional (Público)

- **Landing Page** - Apresentação da empresa e serviços
- **Página de Serviços** - Detalhamento dos serviços oferecidos
- **Página de Contato** - Formulário de contato com validação
- **Design Responsivo** - Otimizado para desktop e mobile
- **Animações Avançadas** - Sistema completo de animações com Framer Motion
- **Paleta Moderna** - Cores laranja, ciano e branco em harmonia

### Dashboard Administrativo (Privado)

- **Autenticação** - Sistema de login seguro com JWT
- **Dashboard Principal** - Estatísticas e resumo dos negócios
- **Gestão de Clientes** - CRUD completo de clientes
- **Agendamentos** - Controle de agendamentos e serviços
- **Relatórios** - Análises de performance e receita

## 🛠️ Tecnologias Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Frontend:** React 18, TypeScript
- **Estilização:** Tailwind CSS
- **Animações:** Framer Motion
- **Validação:** Zod + React Hook Form
- **Ícones:** Lucide React
- **API:** Server Actions (Next.js)
- **Autenticação:** JWT com cookies httpOnly
- **Design System:** Paleta laranja, ciano e branco

## 📦 Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e configure as variáveis:

```bash
cp .env.example .env.local
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

### 4. Build para Produção

```bash
npm run build
npm start
```

## 🎨 Sistema de Animações

### Framer Motion Integration

O projeto utiliza **Framer Motion** para criar experiências visuais envolventes:

#### Componentes de Animação

- **AnimatedDiv** - Animações baseadas em scroll com `useInView`
- **AnimatedContainer** - Container para múltiplos elementos animados
- **ScrollReveal** - Animações avançadas de scroll com parallax
- **Typewriter** - Efeito de máquina de escrever
- **AnimatedCounter** - Contadores animados

#### Tipos de Animação Disponíveis

- `fadeIn` - Fade suave com movimento vertical
- `slideUp/Down/Left/Right` - Deslizamento direcional
- `scale` - Escala com spring physics
- `bounce` - Efeito elástico
- `wiper` - Efeito de limpeza
- `cardHover` - Hover states interativos

#### Configuração de Cores

```ts
primary: {
  500: '#f97316', // Laranja vibrante
  600: '#ea580c', // Laranja escuro
}
secondary: {
  500: '#06b6d4', // Ciano
  600: '#0891b2', // Ciano escuro
}
```

## 📁 Estrutura do Projeto

```
MoneyMaker/
├── app/                      # App Router (Next.js 14)
│   ├── (public)/            # Rotas públicas
│   │   ├── page.tsx         # Landing page
│   │   ├── servicos/        # Página de serviços
│   │   └── contato/         # Página de contato
│   ├── dashboard/           # Rotas protegidas (admin)
│   │   ├── layout.tsx       # Layout do dashboard
│   │   ├── page.tsx         # Dashboard principal
│   │   └── clientes/        # Gestão de clientes
│   ├── login/               # Página de login
│   ├── layout.tsx           # Layout raiz
│   └── globals.css          # Estilos globais
├── components/              # Componentes reutilizáveis
│   ├── ui/                  # Componentes base (Button, Modal)
│   ├── animations/          # Sistema de animações Framer Motion
│   │   ├── AnimatedDiv.tsx  # Componente base de animação
│   │   ├── AnimationVariants.ts # Variantes de animação
│   │   └── ScrollReveal.tsx # Animações avançadas de scroll
│   ├── layout/              # Header, Footer
│   ├── cards/               # Cards específicos
│   └── dashboard/           # Componentes do dashboard
├── actions/                 # Server Actions
│   ├── auth.ts              # Autenticação
│   ├── clients.ts           # Gestão de clientes
│   └── contact.ts           # Formulário de contato
├── lib/                     # Bibliotecas e utilitários
│   ├── utils.ts             # Funções auxiliares
│   ├── api.ts               # Configuração API
│   └── validations.ts       # Schemas Zod
├── types/                   # Tipos TypeScript
└── hooks/                   # Custom hooks
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Executar build
- `npm run lint` - Linting
- `npm run format` - Formatação com Prettier

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Docker (Futuro)

```bash
# Build da imagem
docker build -t moneymaker .

# Executar container
docker run -p 3000:3000 moneymaker
```

## 🔐 Autenticação

O sistema utiliza **Server Actions** para comunicação segura com o backend:

- Tokens JWT armazenados em cookies httpOnly
- Middleware de autenticação para rotas protegidas
- Verificação automática de sessão

## 📋 Próximas Funcionalidades

- [ ] Gestão de agendamentos
- [ ] Sistema de pagamentos
- [ ] Relatórios avançados
- [ ] Notificações em tempo real
- [ ] API REST completa
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:

- Email: contato@moneymaker.com.br
- Telefone: (11) 99999-9999

---

Desenvolvido com ❤️ para empresas de serviços digitais
