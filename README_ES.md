# 🚗 Bitácora Vehicular - Frontend (Next.js + MUI)

Este es el frontend de la aplicación **Bitácora Vehicular**, desarrollada en **Next.js 14**, **React 18** y **Material UI (MUI)**. Está preparada para gestionar vehículos, servicios, cargas de combustible, y usuarios con autenticación integrada usando **NextAuth**.

---

## 📁 Estructura del Proyecto

```bash
frontend-bitacora/
├── .env.local               # Variables de entorno
├── README.md                # Documentación principal
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración TypeScript
├── next.config.mjs          # Configuración de Next.js
├── middleware.ts            # Middleware de autenticación
│
├── MUI/                     # Configuración global de MUI
│   ├── MuiProvider.tsx
│   ├── cache.ts
│   └── theme.ts
│
├── app/                     # Directorio principal (Next.js 13+)
│   ├── layout.tsx
│   ├── RootWrapper.tsx
│   ├── globals.css
│   ├── actions/             # Funciones server-side para consumo de API
│   ├── api/                 # NextAuth y otras rutas internas
│   ├── logbook/             # Módulo principal de la bitácora vehicular
│   ├── fonts/               # Fuentes personalizadas
│   └── page.tsx             # Página principal
│
├── auth.config.ts           # Configuración de NextAuth
├── auth.ts                  # Setup adicional de autenticación
│
├── components/              # Componentes reutilizables
│   ├── appBar/              # Barra superior y lateral
│   ├── appDataGrid/         # Tablas personalizadas con MUI
│   ├── appForm/             # Formularios base
│   └── deleteDialog/        # Diálogo genérico de eliminación
│
├── context/                 # Contextos React globales
│   ├── AlertContext.tsx
│   └── UserContext.tsx
│
├── hooks/                   # Hooks personalizados
│   ├── useAlert.tsx
│   └── useUser.tsx
│
└── types/
    └── user.ts              # Tipado de entidad usuario
```

---

## ⚙️ Tecnologías Usadas

- **Next.js 14**
- **React 18**
- **TypeScript**
- **Material UI (v6)**
- **NextAuth.js**
- **Context API**
- **CSS Modules / Emotion**

---

## 🚧 Por hacer

- [ ] CRUD completo de usuarios
- [ ] Integración completa con módulo de servicios
- [ ] Exportaciones a Excel y PDF
- [ ] Responsividad total (mobile-first)

---

## 🧠 Recomendaciones

- Utiliza `fetch` con `{ cache: "no-store", next: { revalidate: 0 } }` para evitar caché no deseado.
- Centraliza alertas con `AlertContext` y sesión de usuario con `UserContext`.
- Usa `RootWrapper` como envoltorio global en `app/layout.tsx`.

---

## 📄 Licencia

MIT - Felipe Chandía Castillo, 2025
