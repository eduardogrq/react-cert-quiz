import type { Topic } from '../types';

export const nextjsDeploymentTopic: Topic = {
  id: 'nextjs-deployment',
  courseId: 'nextjs-16',
  title: 'Next.js Configuration & Deployment',
  realWorldAnalogy: {
    title: 'La fábrica de muebles y sus sucursales',
    scenario:
      'Una fábrica central construye muebles con planos exactos y los empaca en cajas selladas. Cada sucursal recibe las cajas y las ensambla localmente según el espacio de su tienda. Si la fábrica actualiza un modelo, las sucursales antiguas siguen vendiendo el modelo anterior hasta que reciben el envío nuevo.',
    mapping: [
      { everyday: 'Los planos de la fábrica', technical: 'next.config.ts (configuración del build)' },
      { everyday: 'Las cajas selladas listas para envío', technical: 'Standalone output (.next/standalone)' },
      { everyday: 'Cada sucursal ensamblando localmente', technical: 'Self-hosting en Node.js o Docker' },
      { everyday: 'El catálogo impreso en cada caja', technical: 'Build-time variables (env en compilación)' },
      { everyday: 'La etiqueta de precio que la sucursal pone al abrir', technical: 'Runtime variables (env en ejecución)' },
      { everyday: 'Dos sucursales con modelos distintos a la vez', technical: 'Version skew entre instancias' },
    ],
    whereItBreaks:
      'En una fábrica real puedes mezclar piezas de modelos diferentes. En Next.js, cada deployment es atómico — no puedes combinar assets de builds distintos sin causar errores de version skew.',
  },
  keyTerms: [
    {
      term: 'next.config.ts',
      definition: 'Archivo de configuración central de Next.js que define opciones de compilación, redirects, headers y más.',
      analogyHint: 'Los planos maestros que la fábrica sigue.',
    },
    {
      term: 'Build-time Variables',
      definition: 'Variables de entorno resueltas durante `next build` e incrustadas en el bundle final.',
      analogyHint: 'El catálogo impreso dentro de cada caja sellada.',
    },
    {
      term: 'Runtime Variables',
      definition: 'Variables de entorno leídas al momento de ejecutar el servidor, no durante el build.',
      analogyHint: 'La etiqueta que la sucursal coloca al abrir la caja.',
    },
    {
      term: 'Standalone Output',
      definition: 'Modo de output que genera un servidor Node.js mínimo con todas las dependencias incluidas.',
      analogyHint: 'Las cajas selladas con todo para ensamblar sin pedir nada extra.',
    },
    {
      term: 'Version Skew',
      definition: 'Desincronización entre assets estáticos y servidor cuando coexisten múltiples versiones del deployment.',
      analogyHint: 'Dos sucursales vendiendo modelos distintos al mismo tiempo.',
    },
    {
      term: 'CDN',
      definition: 'Red de distribución de contenido que sirve assets estáticos desde servidores geográficamente cercanos al usuario.',
      analogyHint: 'Almacenes intermedios que acercan las cajas al cliente.',
    },
    {
      term: 'Adapter API',
      definition: 'Interfaz de Next.js que permite adaptar el output a distintas plataformas de hosting.',
      analogyHint: 'Instrucciones de ensamblaje específicas para cada tipo de tienda.',
    },
  ],
  summary:
    'Next.js 16 ofrece un sistema de configuración centralizado en `next.config.ts` con soporte TypeScript nativo. Las variables de entorno se dividen en build-time (incrustadas en el bundle) y runtime (leídas al ejecutar). El modo standalone produce un servidor autónomo ideal para Docker. En deployments multi-instancia, version skew es el principal riesgo: el Deployment ID y la gestión atómica de assets lo mitigan. El Adapter API permite adaptar el output a cualquier plataforma.',
  explanation: `## Configuración central: next.config.ts

Volvamos a la **fábrica de muebles**: así como la fábrica tiene planos maestros que definen cada modelo, Next.js tiene \`next.config.ts\` como fuente de verdad de toda la configuración del proyecto.

\`\`\`ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL,
  },
};

export default nextConfig;
\`\`\`

En Next.js 16, este archivo es **TypeScript nativo** — no necesitas \`@ts-check\` ni JSDoc.

## Build-time vs Runtime Variables

Imagina el **catálogo impreso** dentro de cada caja: una vez impreso, no cambia. Eso son las build-time variables — se resuelven durante \`next build\` y quedan fijas en el código.

- \`NEXT_PUBLIC_*\` → se incrustan en el bundle del cliente (visibles para el usuario)
- Variables sin \`NEXT_PUBLIC_\` → solo disponibles en el servidor

Las **runtime variables** son como la etiqueta de precio que la sucursal coloca al abrir: se leen con \`process.env\` en Server Components o Route Handlers durante la ejecución.

\`\`\`ts
// Solo disponible en runtime (Server Component)
const dbUrl = process.env.DATABASE_URL; // ✅ leída al ejecutar
\`\`\`

## Standalone Output: la caja sellada

Cuando configuras \`output: 'standalone'\`, Next.js genera un directorio \`.next/standalone\` con:
- Un servidor Node.js mínimo (\`server.js\`)
- Solo las dependencias necesarias (node_modules reducido)
- Listo para ejecutar con \`node server.js\`

Es como empacar las cajas con **todo lo necesario** para que la sucursal no tenga que pedir piezas extra.

## Self-hosting: Node.js y Docker

### Node.js directo
\`\`\`bash
next build
node .next/standalone/server.js
\`\`\`

### Docker
\`\`\`dockerfile
FROM node:20-alpine AS runner
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
\`\`\`

La imagen final es liviana porque standalone incluye solo lo mínimo.

## Multi-instancia y Version Skew

Cuando tienes **múltiples sucursales** (instancias), puede pasar que una ya recibió el modelo nuevo y otra sigue con el anterior. En Next.js esto se llama **version skew**: el cliente pide un chunk JS que ya no existe en el nuevo deployment.

Next.js mitiga esto con:
- **Deployment ID** (\`deploymentId\` en next.config.ts): identifica cada build de forma única
- **Atomic deployments**: reemplazar todas las instancias al mismo tiempo
- **Asset prefix + CDN**: mantener assets antiguos accesibles durante la transición

## CDN: almacenes intermedios

Los assets estáticos (JS, CSS, imágenes) se sirven desde una CDN — almacenes cercanos al cliente. Se configura con \`assetPrefix\`:

\`\`\`ts
const nextConfig: NextConfig = {
  assetPrefix: 'https://cdn.ejemplo.com',
};
\`\`\`

## Adapter API

Next.js 16 introduce el **Adapter API**: una interfaz que permite a plataformas de hosting definir cómo se construye y despliega la aplicación. Es como dar **instrucciones de ensamblaje** específicas para cada tipo de tienda (Vercel, AWS, Docker, Cloudflare).

El adapter puede personalizar:
- El output format
- La estructura de directorios
- Los entry points del servidor
`,
  codeExamples: [
    {
      title: 'next.config.ts con standalone y variables',
      code: `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  assetPrefix: process.env.CDN_URL ?? '',
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version ?? '0.0.0',
  },
  deploymentId: process.env.DEPLOYMENT_ID,
};

export default nextConfig;`,
      language: 'ts',
      description: 'Configuración típica para self-hosting con CDN y deployment ID.',
    },
    {
      title: 'Dockerfile multi-stage para standalone',
      code: `# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      language: 'ts',
      description: 'Dockerfile optimizado usando standalone output para imagen mínima.',
    },
    {
      title: 'Runtime env en Server Component',
      code: `// app/settings/page.tsx (Server Component)
export default function SettingsPage() {
  // Runtime variable — leída en cada request
  const region = process.env.DEPLOY_REGION ?? 'unknown';

  return (
    <div>
      <p>Región de deployment: {region}</p>
    </div>
  );
}`,
      language: 'tsx',
      description: 'Variables runtime se leen directamente en Server Components sin exponer al cliente.',
    },
    {
      title: 'Deployment ID para mitigar version skew',
      code: `import type { NextConfig } from 'next';
import crypto from 'node:crypto';

const nextConfig: NextConfig = {
  output: 'standalone',
  // ID único por build — previene version skew
  deploymentId: process.env.DEPLOYMENT_ID
    ?? crypto.randomUUID(),
};

export default nextConfig;`,
      language: 'ts',
      description: 'El deployment ID permite a Next.js detectar y manejar version skew entre instancias.',
    },
  ],
  pitfalls: [
    'Usar `NEXT_PUBLIC_` para secretos — estas variables se incrustan en el bundle del cliente y son visibles para cualquier usuario.',
    'Olvidar copiar `.next/static` y `public` al usar standalone — el servidor arranca pero no sirve assets.',
    'Asumir que `process.env.VARIABLE` en un Client Component lee runtime — en el cliente solo existen las `NEXT_PUBLIC_*` incrustadas en build-time.',
    'No configurar `deploymentId` en multi-instancia — causa 404 en chunks JS cuando una instancia sirve assets de un build diferente.',
    'Usar `output: "export"` esperando tener Server Components dinámicos — export solo genera HTML estático sin servidor.',
    'No definir `assetPrefix` cuando usas CDN — los assets se buscan en el mismo dominio del servidor en vez del CDN.',
  ],
  cheatSheet: [
    '`output: "standalone"` → servidor Node.js autónomo con dependencias incluidas.',
    '`NEXT_PUBLIC_*` → build-time, visible en cliente. Sin prefijo → solo servidor.',
    '`deploymentId` → identifica el build para prevenir version skew.',
    '`assetPrefix` → URL base para servir JS/CSS desde CDN.',
    'Standalone necesita copiar `.next/static` y `public` manualmente.',
    'Runtime env → `process.env.X` en Server Components / Route Handlers.',
    'Docker: imagen multi-stage, runner con Alpine, solo standalone + static + public.',
    'Adapter API → interfaz para que plataformas customicen build y output.',
  ],
  flashcards: [
    {
      id: 'next-deploy-fc-1',
      front: '¿Cuál es la diferencia entre una variable `NEXT_PUBLIC_*` y una sin ese prefijo?',
      back: '`NEXT_PUBLIC_*` se incrusta en el bundle del cliente durante build-time (como el catálogo impreso en la caja). Sin prefijo, solo existe en el servidor en runtime (como información interna de la fábrica que nunca llega a la sucursal).',
      usesAnalogy: true,
    },
    {
      id: 'next-deploy-fc-2',
      front: '¿Qué genera `output: "standalone"` en next.config.ts?',
      back: 'Genera `.next/standalone` con un servidor Node.js mínimo (`server.js`) y solo las dependencias necesarias, listo para ejecutar con `node server.js` sin necesidad de instalar `node_modules` completo.',
    },
    {
      id: 'next-deploy-fc-3',
      front: '¿Qué es version skew y cómo se mitiga en Next.js?',
      back: 'Es la desincronización entre assets estáticos y servidor cuando coexisten múltiples versiones. Se mitiga con `deploymentId` (identifica cada build), atomic deployments y manteniendo assets antiguos accesibles en CDN durante la transición.',
      usesAnalogy: true,
    },
    {
      id: 'next-deploy-fc-4',
      front: '¿Qué archivos debes copiar además de `.next/standalone` al hacer Docker deployment?',
      back: 'Debes copiar `.next/static` (assets compilados como JS y CSS) y `public` (archivos estáticos como imágenes y favicons). Sin ellos, el servidor arranca pero no sirve assets correctamente.',
    },
    {
      id: 'next-deploy-fc-5',
      front: '¿Para qué sirve `assetPrefix` en next.config.ts?',
      back: 'Define la URL base desde donde se sirven los assets estáticos (JS, CSS, imágenes generadas). Se usa para apuntar a un CDN en lugar del dominio del servidor.',
    },
    {
      id: 'next-deploy-fc-6',
      front: '¿Qué es el Adapter API en Next.js 16?',
      back: 'Es una interfaz que permite a plataformas de hosting personalizar cómo se construye y despliega la aplicación — definiendo output format, estructura de directorios y entry points del servidor.',
    },
    {
      id: 'next-deploy-fc-7',
      front: '¿Por qué `process.env.MI_VARIABLE` devuelve `undefined` en un Client Component?',
      back: 'En Client Components solo están disponibles las variables con prefijo `NEXT_PUBLIC_*` (incrustadas en build-time). Las demás solo existen en el entorno del servidor y no se envían al navegador.',
    },
    {
      id: 'next-deploy-fc-8',
      front: 'Usando la analogía de la fábrica: ¿qué representa el Deployment ID?',
      back: 'Es como el número de lote impreso en cada caja de la fábrica. Permite a cada sucursal saber exactamente qué versión del modelo tiene y rechazar piezas de un lote diferente (prevenir version skew).',
      usesAnalogy: true,
    },
  ],
  quiz: [
    {
      id: 'next-deploy-q-1',
      question: 'En la analogía de la fábrica de muebles, ¿qué representan las "cajas selladas listas para envío"?',
      options: [
        { id: 'a', text: 'El archivo next.config.ts' },
        { id: 'b', text: 'El standalone output (.next/standalone)' },
        { id: 'c', text: 'Las variables de entorno runtime' },
        { id: 'd', text: 'El CDN' },
      ],
      correctOptionId: 'b',
      explanation: 'Las cajas selladas representan el standalone output: un paquete completo y autónomo que contiene todo lo necesario para funcionar sin dependencias externas.',
      whyOthersAreWrong: {
        a: 'next.config.ts son los planos de la fábrica (instrucciones de cómo construir), no el producto final empacado.',
        c: 'Las variables runtime son como las etiquetas que la sucursal pone al abrir la caja, no la caja misma.',
        d: 'El CDN son los almacenes intermedios que distribuyen las cajas, no las cajas en sí.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-deploy-q-2',
      question: '¿Qué sucede si declaras un secreto como `NEXT_PUBLIC_DB_PASSWORD` en tu proyecto?',
      options: [
        { id: 'a', text: 'Solo estará disponible en Server Components' },
        { id: 'b', text: 'Se incrustará en el bundle del cliente y será visible para cualquier usuario' },
        { id: 'c', text: 'Next.js lanzará un error de build por convención de nombres' },
        { id: 'd', text: 'Estará encriptada automáticamente en el bundle' },
      ],
      correctOptionId: 'b',
      explanation: 'Cualquier variable con prefijo `NEXT_PUBLIC_` se incrusta en el JavaScript del cliente durante build-time y es visible en el código fuente del navegador.',
      whyOthersAreWrong: {
        a: 'El prefijo NEXT_PUBLIC_ hace exactamente lo contrario: expone la variable al cliente.',
        c: 'Next.js no valida el contenido semántico de los nombres de variables, solo el prefijo determina la visibilidad.',
        d: 'No existe encriptación automática de variables de entorno en Next.js.',
      },
    },
    {
      id: 'next-deploy-q-3',
      question: '¿Cuál es el comando mínimo para ejecutar un deployment standalone de Next.js?',
      options: [
        { id: 'a', text: '`npx next start`' },
        { id: 'b', text: '`node .next/standalone/server.js`' },
        { id: 'c', text: '`npm run start`' },
        { id: 'd', text: '`node .next/server.js`' },
      ],
      correctOptionId: 'b',
      explanation: 'El standalone output genera un `server.js` dentro de `.next/standalone` que es un servidor Node.js autónomo ejecutable directamente.',
      whyOthersAreWrong: {
        a: '`next start` requiere tener Next.js instalado como dependencia, lo cual standalone evita.',
        c: '`npm run start` depende del package.json y node_modules completo, no es standalone.',
        d: 'La ruta correcta es `.next/standalone/server.js`, no `.next/server.js`.',
      },
    },
    {
      id: 'next-deploy-q-4',
      question: '¿Qué problema resuelve `deploymentId` en next.config.ts?',
      options: [
        { id: 'a', text: 'Acelera el build al cachear compilaciones anteriores' },
        { id: 'b', text: 'Previene version skew entre múltiples instancias identificando cada build de forma única' },
        { id: 'c', text: 'Habilita hot module replacement en producción' },
        { id: 'd', text: 'Permite rollback automático si el deployment falla' },
      ],
      correctOptionId: 'b',
      explanation: 'El `deploymentId` identifica cada build de forma única, permitiendo a Next.js detectar cuando un cliente solicita assets de una versión diferente y manejar la transición correctamente.',
      whyOthersAreWrong: {
        a: 'El caché de build se maneja con otros mecanismos internos de Next.js, no con deploymentId.',
        c: 'HMR es exclusivo de desarrollo y no se relaciona con deploymentId.',
        d: 'deploymentId identifica versiones pero no implementa lógica de rollback automático.',
      },
    },
    {
      id: 'next-deploy-q-5',
      question: '¿Qué archivos adicionales debes copiar junto con `.next/standalone` en un Dockerfile?',
      options: [
        { id: 'a', text: 'Solo `node_modules`' },
        { id: 'b', text: '`.next/static` y `public`' },
        { id: 'c', text: '`.next/cache` y `package.json`' },
        { id: 'd', text: '`src/` y `tsconfig.json`' },
      ],
      correctOptionId: 'b',
      explanation: 'Standalone incluye el servidor pero no los assets estáticos compilados (`.next/static`) ni los archivos públicos (`public`). Ambos deben copiarse manualmente.',
      whyOthersAreWrong: {
        a: 'Standalone ya incluye las dependencias necesarias — copiar node_modules completo anula el propósito.',
        c: '.next/cache es para desarrollo/build incremental y package.json no es necesario para ejecutar standalone.',
        d: 'El código fuente y la configuración TypeScript solo se necesitan en build-time, no en la imagen de producción.',
      },
    },
    {
      id: 'next-deploy-q-6',
      question: '¿Cuál es la función principal del Adapter API en Next.js 16?',
      options: [
        { id: 'a', text: 'Convertir Server Components en Client Components automáticamente' },
        { id: 'b', text: 'Permitir que plataformas de hosting personalicen el output y el proceso de build' },
        { id: 'c', text: 'Adaptar la aplicación a diferentes tamaños de pantalla' },
        { id: 'd', text: 'Traducir la configuración de next.config.ts a otros frameworks' },
      ],
      correctOptionId: 'b',
      explanation: 'El Adapter API es una interfaz que permite a plataformas como Vercel, AWS o Cloudflare definir cómo se estructura el output del build para su infraestructura específica.',
      whyOthersAreWrong: {
        a: 'La conversión entre Server y Client Components se maneja con la directiva "use client", no con adapters.',
        c: 'La adaptación responsive es responsabilidad de CSS/diseño, no del sistema de deployment.',
        d: 'El Adapter API adapta el output a plataformas de hosting, no traduce configuración entre frameworks.',
      },
    },
    {
      id: 'next-deploy-q-7',
      question: 'En un Server Component, ¿cómo accedes a una variable de entorno runtime que NO tiene prefijo `NEXT_PUBLIC_`?',
      options: [
        { id: 'a', text: 'Usando `window.env.MI_VARIABLE`' },
        { id: 'b', text: 'Usando `process.env.MI_VARIABLE` directamente' },
        { id: 'c', text: 'Importándola desde `next/env`' },
        { id: 'd', text: 'Declarándola en el array `env` de next.config.ts' },
      ],
      correctOptionId: 'b',
      explanation: 'En Server Components, `process.env.MI_VARIABLE` lee la variable directamente del entorno del servidor en runtime, sin necesidad de configuración adicional.',
      whyOthersAreWrong: {
        a: '`window` no existe en Server Components ya que se ejecutan en el servidor, no en el navegador.',
        c: 'No existe un módulo `next/env` para importar variables de entorno.',
        d: 'El array `env` en next.config.ts es para exponer variables como build-time, no para acceder a runtime env.',
      },
    },
  ],
  difficulty: 'avanzado',
  estimatedMinutes: 25,
  tags: [
    'next.config.ts',
    'deployment',
    'standalone',
    'docker',
    'environment-variables',
    'CDN',
    'version-skew',
    'self-hosting',
    'adapter-api',
  ],
};
