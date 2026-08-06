import type { Topic } from '../types';

export const nextjsOptimizationTopic: Topic = {
  id: 'nextjs-optimization',
  courseId: 'nextjs-16',
  title: 'Optimización en Next.js: El aeropuerto eficiente',
  realWorldAnalogy: {
    title: 'El aeropuerto eficiente',
    scenario:
      'Un aeropuerto moderno no carga todos los aviones con combustible al mismo tiempo ni abre todas las puertas de embarque a la vez. Cada vuelo recibe exactamente lo que necesita, cuando lo necesita. Las maletas se comprimen en contenedores estándar, las pantallas muestran solo la información relevante para cada pasajero, y un mapa del aeropuerto guía a los visitantes sin que nadie se pierda.',
    mapping: [
      { everyday: 'Comprimir maletas en contenedores estándar', technical: 'next/image — optimización y formatos modernos (WebP/AVIF)' },
      { everyday: 'Cargar combustible solo cuando el avión va a despegar', technical: 'Lazy loading — cargar recursos solo cuando se necesitan' },
      { everyday: 'Fuentes tipográficas del aeropuerto preinstaladas en señalética', technical: 'next/font — fuentes autoalojadas sin layout shift' },
      { everyday: 'Pantallas con información relevante para cada pasajero', technical: 'Metadata API — información específica para buscadores y redes' },
      { everyday: 'Mapa público del aeropuerto para orientar visitantes', technical: 'Sitemap y robots.txt — guiar a los motores de búsqueda' },
      { everyday: 'Dividir pasajeros en terminales según destino', technical: 'Code splitting — dividir el bundle por rutas' },
    ],
    whereItBreaks:
      'Un aeropuerto real tiene limitaciones físicas de espacio. En Next.js, el code splitting puede crear tantos chunks como rutas existan sin costo de "espacio" — solo de red.',
  },
  keyTerms: [
    {
      term: 'next/image',
      definition: 'Componente que optimiza imágenes automáticamente: resize, formatos modernos, lazy loading y prevención de layout shift.',
      analogyHint: 'Comprimir maletas al tamaño exacto del contenedor.',
    },
    {
      term: 'next/font',
      definition: 'Sistema de fuentes autoalojadas que elimina peticiones externas a Google Fonts y previene layout shift.',
      analogyHint: 'Señalética preinstalada: no hay que esperar que llegue.',
    },
    {
      term: 'Metadata API',
      definition: 'API declarativa para definir título, descripción, Open Graph y más en cada ruta.',
      analogyHint: 'Las pantallas del aeropuerto mostrando info de cada vuelo.',
    },
    {
      term: 'generateMetadata',
      definition: 'Función asíncrona que genera metadata dinámica basada en parámetros de ruta o datos externos.',
      analogyHint: 'Pantalla que actualiza la puerta de embarque según el vuelo.',
    },
    {
      term: 'Open Graph',
      definition: 'Protocolo de meta tags que controla cómo se muestra un enlace al compartirlo en redes sociales.',
      analogyHint: 'La tarjeta de presentación que ven otros al mencionar tu vuelo.',
    },
    {
      term: 'Code Splitting',
      definition: 'Técnica que divide el JavaScript en chunks más pequeños, cargando solo lo necesario por ruta.',
      analogyHint: 'Dividir pasajeros por terminal para no saturar una sola.',
    },
    {
      term: 'dynamic import',
      definition: 'Import asíncrono que carga un módulo bajo demanda en vez de incluirlo en el bundle inicial.',
      analogyHint: 'Pedir combustible solo cuando el avión confirma despegue.',
    },
    {
      term: 'Turbopack',
      definition: 'Bundler incremental en Rust que reemplaza a Webpack en Next.js, con rebuilds casi instantáneos.',
      analogyHint: 'Sistema de logística ultrarrápido que procesa equipaje en segundos.',
    },
    {
      term: 'sitemap.xml',
      definition: 'Archivo XML que lista todas las URLs públicas del sitio para que los buscadores las indexen.',
      analogyHint: 'El mapa impreso del aeropuerto entregado a cada visitante.',
    },
    {
      term: 'robots.txt',
      definition: 'Archivo que indica a los crawlers qué rutas pueden o no rastrear.',
      analogyHint: 'El cartel de "Solo personal autorizado" en ciertas zonas.',
    },
  ],
  summary:
    'Next.js ofrece un ecosistema completo de optimización: `next/image` para imágenes automáticamente optimizadas con lazy loading, `next/font` para fuentes sin layout shift, la Metadata API para SEO declarativo (estático y dinámico), sitemap y robots.txt generados desde código, code splitting automático por ruta, `next/dynamic` para lazy loading de componentes, y Turbopack como bundler ultrarrápido en desarrollo.',
  explanation: `## El aeropuerto eficiente y la optimización web

Igual que un **aeropuerto moderno** optimiza cada recurso para que los pasajeros fluyan sin esperas innecesarias, Next.js optimiza cada recurso de tu aplicación para que los usuarios reciban exactamente lo que necesitan, cuando lo necesitan.

## Imágenes: next/image

Como las **maletas comprimidas en contenedores estándar**, \`next/image\` transforma tus imágenes al formato y tamaño óptimo:

\`\`\`tsx
import Image from 'next/image';

export function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Portada"
      width={1200}
      height={630}
      priority // carga inmediata para LCP
    />
  );
}
\`\`\`

**Beneficios automáticos:**
- Conversión a WebP/AVIF
- Resize según viewport
- Lazy loading por defecto (usa \`priority\` para above-the-fold)
- Prevención de layout shift con \`width\`/\`height\`

## Fuentes: next/font

Las **fuentes preinstaladas en la señalética** del aeropuerto no necesitan descargarse — ya están ahí. \`next/font\` autoaloja las fuentes:

\`\`\`tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return <body className={inter.className}>{children}</body>;
}
\`\`\`

Zero layout shift, zero peticiones externas a Google Fonts.

## Metadata API: las pantallas informativas

Cada **pantalla del aeropuerto** muestra información relevante para su sección. La Metadata API hace lo mismo para buscadores y redes:

### Metadata estática
\`\`\`tsx
export const metadata = {
  title: 'Mi Aplicación',
  description: 'Descripción para SEO',
  openGraph: {
    title: 'Mi Aplicación',
    images: ['/og-image.png'],
  },
};
\`\`\`

### Metadata dinámica
\`\`\`tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return {
    title: product.name,
    openGraph: { images: [product.image] },
  };
}
\`\`\`

## Sitemap y Robots: el mapa del aeropuerto

El **mapa público** guía a los visitantes. En Next.js, puedes generar sitemap y robots desde TypeScript:

\`\`\`tsx
// app/sitemap.ts
export default function sitemap() {
  return [
    { url: 'https://example.com', lastModified: new Date() },
    { url: 'https://example.com/about', lastModified: new Date() },
  ];
}
\`\`\`

## Code Splitting y Lazy Loading

Igual que el aeropuerto **divide pasajeros por terminal**, Next.js divide el código por ruta automáticamente. Para componentes pesados dentro de una ruta, usa \`next/dynamic\`:

\`\`\`tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Cargando gráfico...</p>,
  ssr: false, // solo client-side
});
\`\`\`

El componente se descarga solo cuando se renderiza — **combustible solo al despegar**.

## Turbopack: logística ultrarrápida

Turbopack es el nuevo bundler en Rust que reemplaza a Webpack en desarrollo:

\`\`\`bash
next dev --turbopack
\`\`\`

- Rebuilds incrementales (solo recompila lo que cambió)
- Hasta 10x más rápido que Webpack en proyectos grandes
- HMR casi instantáneo

## Bundle Analysis

Para identificar qué "maletas" pesan más:

\`\`\`bash
ANALYZE=true next build
\`\`\`

Esto genera un mapa visual del bundle, identificando dependencias pesadas que podrían cargarse con dynamic imports.`,
  codeExamples: [
    {
      title: 'next/image con optimización completa',
      language: 'tsx',
      code: `import Image from 'next/image';

export function ProductCard({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl">
      <Image
        src={src}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        placeholder="blur"
        blurDataURL="/placeholder.png"
      />
    </div>
  );
}`,
      description: 'Image responsiva con fill, sizes para art direction, y placeholder blur.',
    },
    {
      title: 'next/font con variable CSS',
      language: 'tsx',
      code: `import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={\`\${inter.variable} \${jetbrains.variable}\`}>
      <body>{children}</body>
    </html>
  );
}`,
      description: 'Múltiples fuentes como CSS variables para usar en Tailwind.',
    },
    {
      title: 'generateMetadata dinámica',
      language: 'tsx',
      code: `import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}`,
      description: 'Metadata dinámica basada en params de ruta con Open Graph completo.',
    },
    {
      title: 'Sitemap dinámico',
      language: 'ts',
      code: `import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const postEntries = posts.map((post) => ({
    url: \`https://example.com/blog/\${post.slug}\`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: 'https://example.com', lastModified: new Date(), priority: 1 },
    ...postEntries,
  ];
}`,
      description: 'Sitemap generado dinámicamente desde datos de un CMS.',
    },
    {
      title: 'Lazy loading con next/dynamic',
      language: 'tsx',
      code: `import dynamic from 'next/dynamic';

const MarkdownEditor = dynamic(
  () => import('@/components/MarkdownEditor'),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg bg-muted" />
    ),
    ssr: false,
  }
);

export function PostEditor() {
  return (
    <section>
      <h2>Escribe tu post</h2>
      <MarkdownEditor />
    </section>
  );
}`,
      description: 'Componente pesado cargado solo en client-side con skeleton de carga.',
    },
  ],
  pitfalls: [
    'Olvidar width y height en next/image causa layout shift — siempre declara dimensiones o usa fill con un contenedor de tamaño fijo.',
    'Usar priority en todas las imágenes anula el beneficio de lazy loading — solo para imágenes above-the-fold (LCP).',
    'next/font con demasiados subsets o weights aumenta el tamaño del bundle de fuentes innecesariamente.',
    'generateMetadata se ejecuta en el servidor — no puedes usar hooks ni estado del cliente dentro de ella.',
    'dynamic con ssr: false hace que el componente no exista en el HTML inicial — malo para SEO si el contenido es indexable.',
    'No configurar sizes en next/image con fill causa que se descargue la imagen más grande para todos los viewports.',
    'El sitemap debe retornar URLs absolutas (con dominio completo), no rutas relativas.',
    'Turbopack aún no soporta todas las configuraciones de webpack.config — verificar compatibilidad antes de migrar.',
  ],
  cheatSheet: [
    '`<Image src={x} width={w} height={h} />` — optimización automática con lazy loading por defecto.',
    '`priority` en Image — desactiva lazy loading para la imagen LCP (above-the-fold).',
    '`fill` + `sizes` — imagen responsiva que se adapta al contenedor padre.',
    '`next/font/google` + `variable` — fuente como CSS variable, zero layout shift.',
    '`export const metadata = {...}` — metadata estática por ruta.',
    '`export async function generateMetadata()` — metadata dinámica con datos async.',
    '`app/sitemap.ts` exporta función que retorna array de URLs.',
    '`app/robots.ts` exporta reglas para crawlers.',
    '`dynamic(() => import(...), { ssr: false })` — lazy load client-only.',
    '`next dev --turbopack` — bundler Rust ultrarrápido en desarrollo.',
    '`ANALYZE=true next build` — visualizar tamaño del bundle.',
  ],
  flashcards: [
    {
      id: 'next-opt-fc-1',
      front: '¿Qué optimizaciones aplica next/image automáticamente?',
      back: 'Conversión a formatos modernos (WebP/AVIF), resize según viewport, lazy loading por defecto, y prevención de layout shift con dimensiones explícitas.',
      usesAnalogy: true,
    },
    {
      id: 'next-opt-fc-2',
      front: '¿Cuándo debes usar la prop `priority` en next/image?',
      back: 'Solo en imágenes above-the-fold que son el Largest Contentful Paint (LCP). Desactiva lazy loading para cargar la imagen inmediatamente.',
    },
    {
      id: 'next-opt-fc-3',
      front: '¿Qué problema resuelve next/font respecto a Google Fonts tradicional?',
      back: 'Elimina peticiones de red a servidores de Google (autoaloja las fuentes), previene layout shift (FOUT/FOIT), y mejora privacidad al no exponer la IP del usuario.',
      usesAnalogy: true,
    },
    {
      id: 'next-opt-fc-4',
      front: '¿Cuál es la diferencia entre `export const metadata` y `generateMetadata`?',
      back: '`metadata` es un objeto estático definido en build time. `generateMetadata` es una función async que puede recibir params y generar metadata dinámica basada en datos externos.',
    },
    {
      id: 'next-opt-fc-5',
      front: '¿Cómo se crea un sitemap dinámico en Next.js App Router?',
      back: 'Creando `app/sitemap.ts` que exporta una función default retornando un array de objetos con `url`, `lastModified`, `changeFrequency` y `priority`.',
    },
    {
      id: 'next-opt-fc-6',
      front: '¿Qué hace `next/dynamic` con la opción `ssr: false`?',
      back: 'Carga el componente solo en el cliente (lazy loading). No se incluye en el HTML del servidor, reduciendo el bundle inicial. Útil para librerías que dependen de `window` o `document`.',
      usesAnalogy: true,
    },
    {
      id: 'next-opt-fc-7',
      front: '¿Qué ventaja principal ofrece Turbopack sobre Webpack?',
      back: 'Rebuilds incrementales en Rust — solo recompila los módulos que cambiaron, logrando HMR casi instantáneo y hasta 10x más velocidad en proyectos grandes.',
    },
    {
      id: 'next-opt-fc-8',
      front: '¿Qué props necesita next/image cuando usas `fill`?',
      back: 'Un contenedor padre con `position: relative` y dimensiones definidas, más la prop `sizes` para indicar el ancho en cada breakpoint y evitar descargar imágenes innecesariamente grandes.',
    },
    {
      id: 'next-opt-fc-9',
      front: '¿Qué es el code splitting automático en Next.js?',
      back: 'Next.js divide el JavaScript en chunks por ruta automáticamente. Cada página solo descarga el código que necesita, sin configuración manual.',
    },
  ],
  quiz: [
    {
      id: 'next-opt-q-1',
      question: 'En la analogía del aeropuerto eficiente, ¿qué representa "comprimir maletas en contenedores estándar"?',
      options: [
        { id: 'a', text: 'Code splitting por rutas' },
        { id: 'b', text: 'next/image optimizando formatos y tamaños' },
        { id: 'c', text: 'Turbopack compilando más rápido' },
        { id: 'd', text: 'next/font eliminando layout shift' },
      ],
      correctOptionId: 'b',
      explanation: 'Comprimir maletas en contenedores estándar representa la optimización de imágenes: next/image convierte a formatos comprimidos (WebP/AVIF) y ajusta el tamaño al viewport, como empacar eficientemente.',
      whyOthersAreWrong: {
        a: 'Code splitting corresponde a "dividir pasajeros por terminal" en la analogía.',
        c: 'Turbopack es "el sistema de logística ultrarrápido" del aeropuerto.',
        d: 'next/font corresponde a "señalética preinstalada" que no necesita esperar.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-opt-q-2',
      question: '¿Cuál es el comportamiento por defecto de lazy loading en next/image?',
      options: [
        { id: 'a', text: 'Todas las imágenes se cargan inmediatamente (eager)' },
        { id: 'b', text: 'Las imágenes se cargan con lazy loading a menos que tengan priority' },
        { id: 'c', text: 'Solo las imágenes con loading="lazy" se cargan diferido' },
        { id: 'd', text: 'Next.js decide según el tamaño del archivo' },
      ],
      correctOptionId: 'b',
      explanation: 'next/image aplica lazy loading por defecto a todas las imágenes. Solo las que tienen priority={true} se cargan inmediatamente, indicando que son above-the-fold.',
      whyOthersAreWrong: {
        a: 'El comportamiento por defecto es lazy, no eager. Hay que usar priority para carga inmediata.',
        c: 'No necesitas declarar loading="lazy" explícitamente — es el default del componente Image.',
        d: 'La decisión no se basa en el tamaño del archivo sino en la presencia de la prop priority.',
      },
    },
    {
      id: 'next-opt-q-3',
      question: '¿Qué archivo debes crear para generar un sitemap dinámico en App Router?',
      options: [
        { id: 'a', text: 'public/sitemap.xml' },
        { id: 'b', text: 'app/sitemap.ts que exporta una función default' },
        { id: 'c', text: 'next.config.js con la opción sitemap: true' },
        { id: 'd', text: 'pages/api/sitemap.ts' },
      ],
      correctOptionId: 'b',
      explanation: 'En App Router, se crea app/sitemap.ts exportando una función default que retorna un array de objetos MetadataRoute.Sitemap con las URLs del sitio.',
      whyOthersAreWrong: {
        a: 'Un archivo estático en public/ funcionaría, pero no sería dinámico — no puede generar URLs basadas en datos.',
        c: 'No existe una opción sitemap en next.config.js. El sitemap se genera con la convención de archivos del App Router.',
        d: 'pages/api/ es del Pages Router antiguo, no del App Router.',
      },
    },
    {
      id: 'next-opt-q-4',
      question: '¿Cuál es la principal ventaja de next/font sobre cargar fuentes desde Google Fonts con un <link>?',
      options: [
        { id: 'a', text: 'Permite usar más de 10 fuentes simultáneamente' },
        { id: 'b', text: 'Autoaloja la fuente eliminando peticiones externas y previniendo layout shift' },
        { id: 'c', text: 'Reduce el tamaño del archivo de fuente a la mitad' },
        { id: 'd', text: 'Habilita animaciones de texto automáticamente' },
      ],
      correctOptionId: 'b',
      explanation: 'next/font descarga la fuente en build time y la sirve desde tu propio dominio. Esto elimina la petición externa (mejora rendimiento y privacidad) e inyecta CSS que previene layout shift.',
      whyOthersAreWrong: {
        a: 'El límite de fuentes no cambia con next/font. De hecho, usar muchas fuentes siempre degrada el rendimiento.',
        c: 'next/font no comprime la fuente más que Google Fonts — la ventaja es la eliminación de la petición de red externa.',
        d: 'next/font no tiene nada que ver con animaciones de texto.',
      },
    },
    {
      id: 'next-opt-q-5',
      question: '¿Qué sucede cuando usas `dynamic(() => import(...), { ssr: false })`?',
      options: [
        { id: 'a', text: 'El componente se pre-renderiza en el servidor pero no se hidrata' },
        { id: 'b', text: 'El componente no se incluye en el HTML del servidor y se carga solo en el cliente' },
        { id: 'c', text: 'El componente se renderiza en el servidor y se elimina del bundle del cliente' },
        { id: 'd', text: 'El componente se carga en build time y se cachea indefinidamente' },
      ],
      correctOptionId: 'b',
      explanation: 'Con ssr: false, el componente se excluye del render del servidor. Solo se descarga y renderiza en el navegador del cliente, reduciendo el bundle inicial del servidor.',
      whyOthersAreWrong: {
        a: 'Si ssr es false, el componente NO se pre-renderiza en el servidor en absoluto.',
        c: 'Eso describe un Server Component, no un dynamic import con ssr: false.',
        d: 'dynamic import no implica caché permanente — se descarga cuando el componente se monta en el cliente.',
      },
    },
    {
      id: 'next-opt-q-6',
      question: '¿Qué prop de next/image debes usar junto con `fill` para optimizar la descarga de imágenes responsivas?',
      options: [
        { id: 'a', text: 'quality' },
        { id: 'b', text: 'sizes' },
        { id: 'c', text: 'placeholder' },
        { id: 'd', text: 'loading' },
      ],
      correctOptionId: 'b',
      explanation: 'La prop sizes indica al navegador qué ancho tendrá la imagen en cada breakpoint (ej: "(max-width: 768px) 100vw, 50vw"), permitiendo descargar la resolución adecuada en vez de la más grande.',
      whyOthersAreWrong: {
        a: 'quality controla la compresión pero no ayuda a seleccionar el tamaño correcto por viewport.',
        c: 'placeholder muestra un blur/color mientras carga pero no afecta qué resolución se descarga.',
        d: 'loading controla cuándo inicia la descarga (lazy/eager) pero no qué tamaño se descarga.',
      },
    },
    {
      id: 'next-opt-q-7',
      question: '¿Cuál es la principal característica de Turbopack que lo hace más rápido que Webpack?',
      options: [
        { id: 'a', text: 'Usa un lenguaje de configuración más simple' },
        { id: 'b', text: 'Rebuilds incrementales en Rust que solo recompilan lo que cambió' },
        { id: 'c', text: 'Elimina la necesidad de node_modules' },
        { id: 'd', text: 'Compila todo el proyecto en un solo archivo' },
      ],
      correctOptionId: 'b',
      explanation: 'Turbopack está escrito en Rust y usa compilación incremental: cuando un archivo cambia, solo recompila ese módulo y sus dependientes directos, en vez de reprocessar todo el árbol.',
      whyOthersAreWrong: {
        a: 'Turbopack no usa un lenguaje de configuración propio — se configura desde next.config.js.',
        c: 'Turbopack sigue dependiendo de node_modules para las dependencias del proyecto.',
        d: 'Turbopack genera múltiples chunks optimizados, no un solo archivo.',
      },
    },
    {
      id: 'next-opt-q-8',
      question: '¿Qué retorna generateMetadata y cuándo se ejecuta?',
      options: [
        { id: 'a', text: 'Retorna JSX y se ejecuta en cada render del cliente' },
        { id: 'b', text: 'Retorna un objeto Metadata y se ejecuta en el servidor durante el renderizado de la ruta' },
        { id: 'c', text: 'Retorna un string HTML y se ejecuta en build time exclusivamente' },
        { id: 'd', text: 'Retorna un array de meta tags y se ejecuta en un Web Worker' },
      ],
      correctOptionId: 'b',
      explanation: 'generateMetadata es una función async del servidor que recibe params/searchParams y retorna un objeto Metadata tipado. Se ejecuta durante el server render de la ruta.',
      whyOthersAreWrong: {
        a: 'generateMetadata no retorna JSX ni se ejecuta en el cliente — es exclusivamente del servidor.',
        c: 'No retorna HTML crudo. Además, en rutas dinámicas se ejecuta en request time, no solo build time.',
        d: 'No existe ejecución en Web Worker para metadata. Es parte del pipeline de server rendering.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 25,
  tags: [
    'next/image',
    'next/font',
    'metadata',
    'Open Graph',
    'sitemap',
    'robots',
    'code splitting',
    'lazy loading',
    'dynamic imports',
    'Turbopack',
    'bundle analysis',
    'SEO',
    'performance',
  ],
  codeChallenge: {
    instruction: 'Completa las optimizaciones de imagen y carga diferida.',
    template: `import Image from 'next/image';
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./Chart'), {
  {{ssr_key}}: false,
  loading: () => <p>Cargando...</p>,
});

export function Hero() {
  return (
    <div>
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={1200}
        height={600}
        {{priority_prop}}
      />
      <HeavyChart />
    </div>
  );
}`,
    language: 'tsx',
    blanks: [
      { id: 'ssr_key', answers: ['ssr'], placeholder: 'key' },
      { id: 'priority_prop', answers: ['priority'], placeholder: 'prop' },
    ],
    hint: 'dynamic({ ssr: false }) desactiva SSR para componentes pesados. priority en Image carga la imagen con prioridad alta (LCP).',
  },
};
