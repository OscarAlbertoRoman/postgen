# PostGen ✦ — Generador de Contenido con IA

App para generar y gestionar posts para Instagram y LinkedIn usando Claude AI.

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** — tema editorial oscuro dorado
- **Claude API** (Anthropic) — generación de contenido
- **Fabric.js** — editor visual con capas
- **localStorage** — historial y calendario (sin backend)

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar la API key

```bash
cp .env.example .env.local
```

Abrí `.env.local` y pegá tu API key de Anthropic:

```
ANTHROPIC_API_KEY=sk-ant-XXXXXXXX
```

Obtenela en: https://console.anthropic.com/

### 3. Correr en desarrollo

```bash
npm run dev
```

Abrí http://localhost:3000

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Generador de posts con IA |
| `/history` | Historial de todos los posts generados |
| `/calendar` | Calendario de publicaciones (drag & drop) |
| `/editor` | Editor visual con capas de texto e imagen |

## Flujo de uso

1. **Generar** → Ingresás un tema, elegís tono y redes → Claude genera los posts
2. **Editar** → El texto es editable directamente en el resultado
3. **Editor Visual** → Abrís el editor para diseñar el post sobre una imagen
4. **Guardar** → Todo se guarda automáticamente en el historial
5. **Programar** → Arrastrás posts al calendario
6. **Exportar** → Descargás el diseño como PNG 1080×1080

## Próximos pasos sugeridos

- [ ] Autenticación de usuarios
- [ ] Backend + base de datos (PostgreSQL)
- [ ] Conexión directa con Instagram Graph API
- [ ] Publicación programada con cron jobs
- [ ] Templates de diseño para el editor
- [ ] Integración con Canva API
