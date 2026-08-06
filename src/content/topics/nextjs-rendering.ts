import type { Topic } from '../types';

export const nextjsRenderingTopic: Topic = {
  id: 'nextjs-rendering',
  courseId: 'nextjs-16',
  title: 'Rendering en Next.js: Static, Dynamic y Partial Prerendering',
  realWorldAnalogy: {
    title: 'La imprenta y el periódico',
    scenario:
      'Un periódico tiene tres formas de producir contenido: las páginas fijas (horóscopos, crucigramas) se imprimen la noche anterior y se reparten iguales a todos. Las noticias de última hora se escriben y entregan en el momento que el lector las pide. Y la edición especial combina ambas: la estructura está pre-impresa, pero deja huecos en blanco que se rellenan al instante con datos frescos.',
    mapping: [
      { everyday: 'Páginas impresas la noche anterior', technical: 'Static Rendering (SSG)' },
      { everyday: 'Noticias escritas al momento de pedirlas', technical: 'Dynamic Rendering (SSR)' },
      { everyday: 'Reimprimir el periódico cada hora con datos nuevos', technical: 'Incremental Static Regeneration (ISR)' },
      { everyday: 'Edición con huecos que se rellenan al instante', technical: 'Partial Prerendering (PPR)' },
      { everyday: 'La rotativa de la imprenta', technical: 'El servidor de Next.js en build time' },
      { everyday: 'El repartidor que lleva el periódico a tu puerta', technical: 'La CDN que sirve el HTML al navegador' },
    ],
    whereItBreaks:
      'Un periódico real no puede personalizar el contenido por lector individual. En Next.js, el Dynamic Rendering sí puede generar HTML distinto para cada usuario según cookies, headers o búsquedas.',
  },
  keyTerms: [
    {
      term: 'Static Rendering',
      definition: 'Las páginas se generan en build time y se sirven como HTML estático desde la CDN.',
      analogyHint: 'Páginas impresas la noche anterior, iguales para todos.',
    },
    {
      term: 'Dynamic Rendering',
      definition: 'Las páginas se generan en el servidor en cada request del usuario.',
      analogyHint: 'Noticias escritas al momento que el lector las pide.',
    },
    {
      term: 'ISR',
      definition: 'Regeneración estática incremental: revalida páginas estáticas después de un intervalo sin re-build completo.',
      analogyHint: 'Reimprimir el periódico cada hora con datos actualizados.',
    },
    {
      term: 'Partial Prerendering (PPR)',
      definition: 'Combina un shell estático con huecos dinámicos que se resuelven vía streaming en el mismo request.',
      analogyHint: 'Edición pre-impresa con huecos que se rellenan al instante.',
    },
    {
      term: 'generateStaticParams',
      definition: 'Función que define qué rutas dinámicas se pre-renderizan en build time.',
      analogyHint: 'La lista de ediciones que la imprenta prepara por adelantado.',
    },
    {
      term: 'Dynamic APIs',
      definition: 'Funciones como cookies(), headers() o searchParams que fuerzan rendering dinámico.',
      analogyHint: 'Pedirle al redactor información que solo existe en el momento.',
    },
    {
      term: 'Static Export',
      definition: 'Modo de Next.js que genera solo archivos estáticos, sin servidor.',
      analogyHint: 'Imprimir todo el periódico de una vez, sin redacción disponible después.',
    },
    {
      term: 'Prerendering',
      definition: 'Proceso de generar HTML antes de que llegue el request del usuario (en build o revalidación).',
      analogyHint: 'Cualquier página que sale de la imprenta antes de la entrega.',
    },
  ],
  summary:
    'Next.js decide automáticamente si una ruta es estática o dinámica según las APIs que uses. Static Rendering genera el HTML en build time (rápido, cacheable). Dynamic Rendering lo genera por request (personalizable). ISR permite revalidar páginas estáticas sin rebuild. Partial Prerendering (PPR) combina ambos mundos: un shell estático se sirve instantáneamente mientras los huecos dinámicos se resuelven vía streaming. Las Dynamic APIs (cookies, headers, searchParams) son la señal que le indica a Next.js que una ruta no puede ser estática.',
  explanation: `## ¿Cómo decide Next.js qué tipo de rendering usar?

Volvamos a nuestra **imprenta de periódico**: si una página no necesita información del momento (no consulta cookies, ni headers, ni parámetros de búsqueda), se puede imprimir la noche anterior y repartir igual a todos. Eso es **Static Rendering**.

Pero si una página necesita saber quién es el lector (su sesión, su ubicación, su búsqueda), no queda más remedio que escribirla en el momento. Eso es **Dynamic Rendering**.

## Static Rendering (SSG)

Es el comportamiento por defecto. Next.js genera el HTML en build time:

\`\`\`tsx
// Esta página es estática automáticamente
export default function About() {
  return <h1>Acerca de nosotros</h1>;
}
\`\`\`

Para rutas dinámicas, usas \`generateStaticParams\` — la lista de ediciones que la imprenta prepara por adelantado:

\`\`\`tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}
\`\`\`

## Dynamic Rendering (SSR)

Se activa automáticamente cuando usas una **Dynamic API**:

\`\`\`tsx
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const session = (await cookies()).get('session');
  return <h1>Bienvenido, {session?.value}</h1>;
}
\`\`\`

Aquí Next.js detecta \`cookies()\` y sabe que no puede pre-imprimir esta página — necesita datos del momento.

## ISR: Revalidación incremental

Como reimprimir el periódico cada cierto tiempo sin detener toda la rotativa:

\`\`\`tsx
// Revalida cada 60 segundos
export const revalidate = 60;
\`\`\`

La primera visita sirve la versión estática. Después del intervalo, Next.js regenera la página en segundo plano y la siguiente visita obtiene la versión fresca.

## Partial Prerendering (PPR)

La innovación más reciente: la **edición con huecos**. El shell estático se sirve de inmediato desde la CDN, y los componentes dinámicos se resuelven vía streaming dentro del mismo request:

\`\`\`tsx
import { Suspense } from 'react';

export default function StorePage() {
  return (
    <main>
      <h1>Nuestra tienda</h1> {/* Estático — pre-impreso */}
      <Suspense fallback={<p>Cargando precios...</p>}>
        <DynamicPrices /> {/* Dinámico — hueco que se rellena */}
      </Suspense>
    </main>
  );
}
\`\`\`

El boundary de \`Suspense\` marca exactamente dónde termina la parte estática y empieza la dinámica.

## Static Export

Cuando no necesitas servidor alguno — como imprimir todo el periódico de una vez y cerrar la redacción:

\`\`\`ts
// next.config.ts
const config = { output: 'export' };
\`\`\`

Genera solo HTML/CSS/JS. No hay ISR, no hay Dynamic Rendering, no hay API Routes.

## Dynamic APIs: la señal clave

Estas funciones indican que la ruta necesita información del request:

- \`cookies()\` — lee cookies del navegador
- \`headers()\` — lee headers HTTP
- \`searchParams\` — lee parámetros de la URL
- \`unstable_noStore()\` — opta explícitamente por no cachear

Si cualquiera de estas aparece en tu componente, Next.js marca la ruta como dinámica automáticamente.`,
  codeExamples: [
    {
      title: 'Página estática con generateStaticParams',
      language: 'tsx',
      code: `// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json());
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article><h1>{post.title}</h1></article>;
}`,
      description: 'Las rutas se pre-generan en build time para cada slug devuelto por generateStaticParams.',
    },
    {
      title: 'Rendering dinámico con cookies',
      language: 'tsx',
      code: `// app/dashboard/page.tsx
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value ?? 'dark';

  return (
    <main data-theme={theme}>
      <h1>Panel de usuario</h1>
    </main>
  );
}`,
      description: 'El uso de cookies() fuerza Dynamic Rendering — esta página se genera por request.',
    },
    {
      title: 'ISR con revalidación temporal',
      language: 'tsx',
      code: `// app/news/page.tsx
export const revalidate = 3600; // Revalida cada hora

export default async function News() {
  const articles = await fetch('https://api.example.com/news')
    .then(res => res.json());

  return (
    <ul>
      {articles.map((a: { id: string; title: string }) => (
        <li key={a.id}>{a.title}</li>
      ))}
    </ul>
  );
}`,
      description: 'La página es estática pero se regenera en segundo plano cada 3600 segundos.',
    },
    {
      title: 'Partial Prerendering con Suspense',
      language: 'tsx',
      code: `// app/store/page.tsx
import { Suspense } from 'react';
import { StaticHeader } from './static-header';
import { DynamicCart } from './dynamic-cart';

export default function StorePage() {
  return (
    <>
      <StaticHeader /> {/* Shell estático servido desde CDN */}
      <Suspense fallback={<CartSkeleton />}>
        <DynamicCart /> {/* Componente dinámico streamed */}
      </Suspense>
    </>
  );
}`,
      description: 'PPR sirve el shell estático inmediatamente y resuelve los huecos dinámicos vía streaming.',
    },
    {
      title: 'Static Export en next.config.ts',
      language: 'ts',
      code: `// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  // Opcional: cambiar el directorio de salida
  distDir: 'dist',
};

export default config;`,
      description: 'Genera un sitio completamente estático sin necesidad de servidor Node.js.',
    },
  ],
  pitfalls: [
    'Usar cookies() o headers() en un componente hace que toda la ruta sea dinámica — incluso si solo un hijo lo necesita. Usa Suspense + PPR para aislar la parte dinámica.',
    'Con Static Export (output: "export") no puedes usar ISR, middleware, ni rutas API con lógica de servidor. Todas las rutas dinámicas necesitan generateStaticParams.',
    'Olvidar await en params de Next.js 16 — los params ahora son una Promise y requieren await antes de acceder a sus propiedades.',
    'Configurar revalidate = 0 no es lo mismo que Dynamic Rendering: sigue siendo ISR pero revalida en cada request. Usa Dynamic APIs si realmente necesitas SSR.',
    'En PPR, el fallback de Suspense es lo que el usuario ve inicialmente — un skeleton mal diseñado causa peor UX que un loading completo.',
    'generateStaticParams solo se ejecuta en build time. Si agregas contenido nuevo después del build, necesitas ISR o un nuevo deploy.',
    'searchParams en un Page component fuerza rendering dinámico incluso si no usas explícitamente cookies() ni headers().',
  ],
  cheatSheet: [
    'Sin Dynamic APIs → Static Rendering automático (build time)',
    'cookies() / headers() / searchParams → Dynamic Rendering automático (per-request)',
    'export const revalidate = N → ISR (estático que se regenera cada N segundos)',
    'Suspense boundary + componente dinámico → PPR (shell estático + huecos dinámicos)',
    'output: "export" en next.config → Static Export (solo HTML/CSS/JS, sin servidor)',
    'generateStaticParams → pre-genera rutas dinámicas como [slug] en build time',
    'revalidatePath() / revalidateTag() → revalidación on-demand desde Server Actions',
    'dynamicParams = false → retorna 404 para rutas no listadas en generateStaticParams',
    'PPR requiere Suspense explícito para marcar los límites estático/dinámico',
    'El rendering por defecto en Next.js App Router es estático — lo dinámico es opt-in',
  ],
  flashcards: [
    {
      id: 'next-render-fc-1',
      front: '¿Cuál es el comportamiento de rendering por defecto en Next.js App Router?',
      back: 'Static Rendering. Next.js genera el HTML en build time a menos que detecte Dynamic APIs.',
    },
    {
      id: 'next-render-fc-2',
      front: '¿Qué Dynamic APIs fuerzan rendering dinámico en Next.js?',
      back: 'cookies(), headers(), searchParams, y unstable_noStore(). Su presencia indica que la ruta necesita datos del request.',
    },
    {
      id: 'next-render-fc-3',
      front: 'En la analogía del periódico, ¿qué representa Partial Prerendering (PPR)?',
      back: 'La edición con huecos pre-impresos: la estructura sale de la imprenta lista, pero algunos espacios se rellenan al instante con información fresca cuando llega al lector.',
      usesAnalogy: true,
    },
    {
      id: 'next-render-fc-4',
      front: '¿Qué diferencia hay entre revalidate = 60 y Dynamic Rendering?',
      back: 'Con revalidate = 60 (ISR), la página es estática y se regenera en segundo plano cada 60s. Dynamic Rendering genera HTML nuevo en cada request individual.',
    },
    {
      id: 'next-render-fc-5',
      front: '¿Cómo marca Next.js los límites entre contenido estático y dinámico en PPR?',
      back: 'Usando boundaries de Suspense. Todo fuera del Suspense es el shell estático; lo que está dentro se resuelve dinámicamente vía streaming.',
    },
    {
      id: 'next-render-fc-6',
      front: '¿Qué hace generateStaticParams y cuándo se ejecuta?',
      back: 'Define qué rutas dinámicas ([slug], [id]) se pre-renderizan. Se ejecuta solo en build time, generando HTML estático para cada conjunto de params retornado.',
    },
    {
      id: 'next-render-fc-7',
      front: '¿Qué limitaciones tiene Static Export (output: "export")?',
      back: 'No soporta ISR, middleware, API Routes con lógica de servidor, ni rendering dinámico. Solo genera archivos HTML/CSS/JS estáticos.',
    },
    {
      id: 'next-render-fc-8',
      front: 'En la analogía de la imprenta, ¿qué representa ISR?',
      back: 'Reimprimir el periódico cada cierto tiempo: la edición sigue siendo pre-impresa (estática), pero cada hora se genera una versión actualizada sin detener toda la rotativa.',
      usesAnalogy: true,
    },
    {
      id: 'next-render-fc-9',
      front: '¿Qué sucede si usas cookies() dentro de un componente hijo en una ruta que debería ser estática?',
      back: 'Toda la ruta se vuelve dinámica. Para evitarlo, envuelve ese componente en un Suspense boundary y habilita PPR, manteniendo el resto de la página estático.',
    },
  ],
  quiz: [
    {
      id: 'next-render-q-1',
      question: 'En la analogía del periódico, ¿qué tipo de rendering corresponde a "páginas impresas la noche anterior e iguales para todos los lectores"?',
      options: [
        { id: 'a', text: 'Dynamic Rendering (SSR)' },
        { id: 'b', text: 'Static Rendering (SSG)' },
        { id: 'c', text: 'Partial Prerendering (PPR)' },
        { id: 'd', text: 'Client-side Rendering (CSR)' },
      ],
      correctOptionId: 'b',
      explanation: 'Static Rendering genera el HTML en build time (la noche anterior) y lo sirve idéntico a todos los usuarios desde la CDN, como un periódico pre-impreso.',
      whyOthersAreWrong: {
        a: 'Dynamic Rendering genera HTML por request, como escribir la noticia cuando el lector la pide — no es pre-impreso.',
        c: 'PPR combina partes estáticas con huecos dinámicos — la edición con espacios en blanco, no puramente pre-impresa.',
        d: 'CSR genera el HTML en el navegador del usuario, sin imprenta ni servidor involucrado inicialmente.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-render-q-2',
      question: '¿Cuál de las siguientes funciones NO fuerza Dynamic Rendering en Next.js?',
      options: [
        { id: 'a', text: 'cookies()' },
        { id: 'b', text: 'headers()' },
        { id: 'c', text: 'generateStaticParams()' },
        { id: 'd', text: 'searchParams' },
      ],
      correctOptionId: 'c',
      explanation: 'generateStaticParams() se ejecuta en build time para definir rutas estáticas. No es una Dynamic API — al contrario, habilita Static Rendering para rutas dinámicas.',
      whyOthersAreWrong: {
        a: 'cookies() necesita datos del request HTTP, lo que fuerza rendering dinámico.',
        b: 'headers() lee información del request que solo existe en runtime, forzando rendering dinámico.',
        d: 'searchParams contiene los parámetros de la URL del request actual, requiriendo rendering dinámico.',
      },
    },
    {
      id: 'next-render-q-3',
      question: '¿Qué configuración en next.config.ts genera un sitio completamente estático sin servidor?',
      options: [
        { id: 'a', text: 'mode: "static"' },
        { id: 'b', text: 'output: "export"' },
        { id: 'c', text: 'rendering: "ssg"' },
        { id: 'd', text: 'serverless: true' },
      ],
      correctOptionId: 'b',
      explanation: 'output: "export" indica a Next.js que genere solo archivos HTML/CSS/JS estáticos, sin necesidad de un servidor Node.js para servir la aplicación.',
      whyOthersAreWrong: {
        a: 'No existe la opción mode: "static" en la configuración de Next.js.',
        c: 'No existe la opción rendering: "ssg" en la configuración de Next.js.',
        d: 'serverless: true no es una opción válida de Next.js y no desactiva el servidor.',
      },
    },
    {
      id: 'next-render-q-4',
      question: '¿Cómo funciona Partial Prerendering (PPR) en Next.js?',
      options: [
        { id: 'a', text: 'Divide la página en mitad estática arriba y mitad dinámica abajo.' },
        { id: 'b', text: 'Sirve un shell estático desde CDN y resuelve los huecos dinámicos vía streaming usando Suspense boundaries.' },
        { id: 'c', text: 'Renderiza toda la página dinámicamente pero cachea partes individuales.' },
        { id: 'd', text: 'Genera versiones estáticas y dinámicas completas y elige cuál servir por request.' },
      ],
      correctOptionId: 'b',
      explanation: 'PPR envía inmediatamente el HTML estático (el shell) y usa streaming para resolver los componentes dentro de Suspense boundaries, combinando la velocidad de lo estático con la frescura de lo dinámico.',
      whyOthersAreWrong: {
        a: 'PPR no divide la página por posición (arriba/abajo) sino por Suspense boundaries que pueden estar en cualquier parte.',
        c: 'PPR no renderiza todo dinámicamente — el shell es genuinamente estático y se sirve desde CDN sin procesamiento.',
        d: 'PPR no genera dos versiones completas — genera una versión estática con huecos que se resuelven en el mismo request.',
      },
    },
    {
      id: 'next-render-q-5',
      question: '¿Qué sucede cuando configuras export const revalidate = 3600 en una página?',
      options: [
        { id: 'a', text: 'La página se renderiza dinámicamente y se cachea por 3600 segundos.' },
        { id: 'b', text: 'La página es estática pero se regenera en segundo plano después de 3600 segundos cuando recibe una visita.' },
        { id: 'c', text: 'La página se borra del caché cada 3600 segundos automáticamente.' },
        { id: 'd', text: 'La página fuerza un rebuild completo cada 3600 segundos.' },
      ],
      correctOptionId: 'b',
      explanation: 'ISR con revalidate sirve la versión estática existente. Después del intervalo, la próxima visita dispara una regeneración en segundo plano. La versión nueva reemplaza la anterior para futuros visitantes.',
      whyOthersAreWrong: {
        a: 'ISR no es rendering dinámico — la página es estática. La regeneración ocurre en segundo plano, no por request.',
        c: 'El caché no se borra automáticamente — se revalida (regenera) solo cuando hay una visita después del intervalo.',
        d: 'ISR regenera páginas individualmente, no hace un rebuild del sitio completo.',
      },
    },
    {
      id: 'next-render-q-6',
      question: '¿Qué papel cumple generateStaticParams en una ruta dinámica como app/blog/[slug]/page.tsx?',
      options: [
        { id: 'a', text: 'Valida que los parámetros de la URL sean correctos en runtime.' },
        { id: 'b', text: 'Define qué valores de [slug] se pre-renderizan como HTML estático en build time.' },
        { id: 'c', text: 'Genera los parámetros dinámicamente en cada request del usuario.' },
        { id: 'd', text: 'Cachea los parámetros más frecuentes para acelerar el Dynamic Rendering.' },
      ],
      correctOptionId: 'b',
      explanation: 'generateStaticParams retorna un array con los valores posibles del segmento dinámico. Next.js genera una página HTML estática para cada uno durante el build.',
      whyOthersAreWrong: {
        a: 'No es validación en runtime — se ejecuta exclusivamente en build time para generar páginas estáticas.',
        c: 'Se ejecuta en build time, no por request. Su propósito es pre-generar, no generar dinámicamente.',
        d: 'No tiene relación con cacheo de rendering dinámico — es para Static Rendering exclusivamente.',
      },
    },
    {
      id: 'next-render-q-7',
      question: 'En la analogía del periódico, ¿qué representa reimprimir la edición cada hora sin detener toda la rotativa?',
      options: [
        { id: 'a', text: 'Static Export' },
        { id: 'b', text: 'Dynamic Rendering' },
        { id: 'c', text: 'Incremental Static Regeneration (ISR)' },
        { id: 'd', text: 'Partial Prerendering (PPR)' },
      ],
      correctOptionId: 'c',
      explanation: 'ISR revalida páginas estáticas individualmente después de un intervalo, como reimprimir secciones del periódico periódicamente sin parar toda la producción.',
      whyOthersAreWrong: {
        a: 'Static Export es imprimir todo una vez y cerrar la redacción — no hay reimpresiones posteriores.',
        b: 'Dynamic Rendering escribe la noticia en el momento que el lector la pide — no es una reimpresión periódica.',
        d: 'PPR es la edición con huecos en blanco que se rellenan al instante — no reimpresión periódica.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-render-q-8',
      question: '¿Qué limitación tiene Static Export que no tiene el modo por defecto de Next.js?',
      options: [
        { id: 'a', text: 'No puede usar componentes de React Server Components.' },
        { id: 'b', text: 'No soporta ISR, middleware, ni API Routes con lógica de servidor.' },
        { id: 'c', text: 'No permite usar TypeScript ni Tailwind CSS.' },
        { id: 'd', text: 'No puede generar más de 100 páginas estáticas.' },
      ],
      correctOptionId: 'b',
      explanation: 'Static Export genera solo archivos estáticos. Sin servidor Node.js disponible, no hay ISR (requiere regeneración), ni middleware (requiere edge runtime), ni API Routes dinámicas.',
      whyOthersAreWrong: {
        a: 'Static Export sí usa Server Components — se ejecutan en build time para generar HTML estático.',
        c: 'TypeScript y Tailwind CSS son herramientas de build que funcionan perfectamente con Static Export.',
        d: 'No existe un límite de 100 páginas — Static Export puede generar tantas páginas como defina generateStaticParams.',
      },
    },
  ],
  difficulty: 'avanzado',
  estimatedMinutes: 30,
  tags: [
    'next.js',
    'rendering',
    'SSG',
    'SSR',
    'ISR',
    'PPR',
    'static-export',
    'dynamic-apis',
    'prerendering',
    'app-router',
  ],
};
