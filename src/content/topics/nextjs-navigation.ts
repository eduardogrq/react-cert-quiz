import type { Topic } from '../types';

export const nextjsNavigationTopic: Topic = {
  id: 'nextjs-navigation',
  courseId: 'nextjs-16',
  title: 'Navegación en Next.js',
  realWorldAnalogy: {
    title: 'El sistema de metro de una ciudad',
    scenario:
      'En una red de metro, los pasajeros se mueven entre estaciones sin salir a la calle. El mapa del metro muestra las conexiones, los trenes anticipan demanda preparando vagones extra en horas pico, y los letreros luminosos redirigen a rutas alternas cuando hay una estación cerrada.',
    mapping: [
      { everyday: 'Los túneles entre estaciones', technical: 'Client-side Navigation (sin recargar página)' },
      { everyday: 'El mapa del metro en cada andén', technical: 'El componente <Link>' },
      { everyday: 'Preparar vagones extra antes de hora pico', technical: 'Prefetching de rutas' },
      { everyday: 'El conductor que cambia de vía', technical: 'useRouter (push, replace, back)' },
      { everyday: 'Los letreros que redirigen a otra estación', technical: 'redirect() y notFound()' },
      { everyday: 'Pasajeros subiendo por grupos mientras el tren avanza', technical: 'Streaming (carga progresiva)' },
    ],
    whereItBreaks:
      'En un metro real, todas las estaciones existen físicamente siempre. En Next.js, las páginas pueden generarse bajo demanda (dynamic rendering) y no todas están "construidas" de antemano.',
  },
  keyTerms: [
    {
      term: 'Link',
      definition: 'Componente que reemplaza a <a> para navegación client-side sin recarga completa.',
      analogyHint: 'El mapa del metro que te lleva sin salir a la calle.',
    },
    {
      term: 'Prefetching',
      definition: 'Next.js descarga automáticamente el código de las rutas visibles en el viewport.',
      analogyHint: 'Preparar vagones antes de que lleguen los pasajeros.',
    },
    {
      term: 'useRouter',
      definition: 'Hook que permite navegación programática desde componentes client.',
      analogyHint: 'El conductor que decide cambiar de vía manualmente.',
    },
    {
      term: 'usePathname',
      definition: 'Hook que devuelve la ruta actual del URL como string.',
      analogyHint: 'El letrero que indica en qué estación estás ahora.',
    },
    {
      term: 'useSearchParams',
      definition: 'Hook que da acceso a los query parameters del URL actual.',
      analogyHint: 'El boleto con detalles de tu destino y preferencias.',
    },
    {
      term: 'redirect()',
      definition: 'Función server-side que redirige al usuario a otra ruta antes de renderizar.',
      analogyHint: 'El letrero que te manda a otra estación porque esta cerró.',
    },
    {
      term: 'notFound()',
      definition: 'Función que lanza la página 404 más cercana en la jerarquía de layouts.',
      analogyHint: 'El aviso de "esta estación no existe" en el mapa.',
    },
    {
      term: 'Streaming',
      definition: 'Técnica que envía HTML progresivamente mientras los componentes se resuelven.',
      analogyHint: 'Pasajeros que suben por grupos sin esperar a que todos lleguen.',
    },
  ],
  summary:
    'Next.js ofrece un sistema de navegación client-side que evita recargas completas. El componente `<Link>` maneja enlaces con prefetching automático. Los hooks `useRouter`, `usePathname` y `useSearchParams` permiten navegación programática y lectura del URL. Las funciones `redirect()` y `notFound()` controlan el flujo server-side. Streaming permite cargar la UI progresivamente sin bloquear al usuario.',
  explanation: `## Navegación sin salir del túnel

Piensa en el **sistema de metro**: cuando viajas entre estaciones, nunca sales a la superficie. De la misma forma, Next.js navega entre páginas sin hacer una recarga completa del navegador — todo ocurre "bajo tierra", manteniendo el estado de la aplicación.

## El componente Link: tu mapa de conexiones

\`<Link>\` es el mapa de metro en cada andén. Le dices a dónde quieres ir y él se encarga de llevarte por los túneles (client-side navigation):

\`\`\`tsx
import Link from 'next/link';

<Link href="/dashboard">Ir al panel</Link>
\`\`\`

Además, **prepara vagones antes de hora pico**: cuando un \`<Link>\` aparece en el viewport, Next.js descarga automáticamente el código de esa ruta (prefetching). Cuando el usuario hace clic, la transición es instantánea.

## Navegación programática: el conductor

A veces necesitas cambiar de vía sin que el pasajero toque el mapa. \`useRouter\` es el conductor:

\`\`\`tsx
'use client';
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/nueva-ruta');    // avanza a nueva estación
router.replace('/otra-ruta');  // reemplaza la estación actual en el historial
router.back();                 // regresa a la estación anterior
\`\`\`

## Saber dónde estás: usePathname y useSearchParams

\`usePathname\` es el letrero luminoso que dice "Estás en: Estación Centro". \`useSearchParams\` es tu boleto con los detalles del viaje:

\`\`\`tsx
'use client';
import { usePathname, useSearchParams } from 'next/navigation';

const pathname = usePathname();       // '/productos'
const searchParams = useSearchParams(); // ?categoria=libros
\`\`\`

## Redirecciones server-side: letreros de desvío

Cuando una estación está cerrada (usuario sin permisos, recurso movido), los letreros redirigen antes de que llegues:

\`\`\`tsx
import { redirect, notFound } from 'next/navigation';

// En un Server Component o Server Action:
if (!user) redirect('/login');
if (!post) notFound();
\`\`\`

## Streaming: subir por grupos

En vez de esperar a que todos los pasajeros estén en el andén para arrancar, el tren avanza mientras van subiendo por grupos. Next.js usa \`<Suspense>\` para mostrar partes de la página mientras otras aún se cargan:

\`\`\`tsx
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>
\`\`\``,
  codeExamples: [
    {
      title: 'Link con prefetch controlado',
      language: 'tsx',
      code: `import Link from 'next/link';

export function Navigation() {
  return (
    <nav>
      {/* Prefetch automático (default en producción) */}
      <Link href="/dashboard">Panel</Link>

      {/* Desactivar prefetch para rutas pesadas */}
      <Link href="/reportes" prefetch={false}>Reportes</Link>

      {/* Link dinámico */}
      <Link href={\`/productos/\${id}\`}>Ver producto</Link>
    </nav>
  );
}`,
      description: 'El componente Link con diferentes configuraciones de prefetching.',
    },
    {
      title: 'Navegación programática con useRouter',
      language: 'tsx',
      code: `'use client';

import { useRouter } from 'next/navigation';

export function SearchForm() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q') as string;
    router.push(\`/buscar?q=\${encodeURIComponent(query)}\`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="q" placeholder="Buscar..." />
      <button type="submit">Buscar</button>
    </form>
  );
}`,
      description: 'useRouter para navegar después de un evento del usuario.',
    },
    {
      title: 'Leer ruta y parámetros actuales',
      language: 'tsx',
      code: `'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function Breadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const segments = pathname.split('/').filter(Boolean);
  const category = searchParams.get('categoria');

  return (
    <nav aria-label="Breadcrumb">
      <Link href="/">Inicio</Link>
      {segments.map((segment, i) => (
        <span key={i}> / {segment}</span>
      ))}
      {category && <span> — Filtro: {category}</span>}
    </nav>
  );
}`,
      description: 'usePathname y useSearchParams para construir un breadcrumb dinámico.',
    },
    {
      title: 'redirect() y notFound() en Server Components',
      language: 'tsx',
      code: `import { redirect, notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound(); // Muestra la página not-found.tsx más cercana
  }

  if (product.redirectTo) {
    redirect(product.redirectTo); // Redirige server-side (HTTP 307)
  }

  return <h1>{product.name}</h1>;
}`,
      description: 'Control de flujo server-side con redirect y notFound.',
    },
    {
      title: 'Streaming con Suspense',
      language: 'tsx',
      code: `import { Suspense } from 'react';

function LoadingSkeleton() {
  return <div className="animate-pulse h-48 bg-muted rounded-xl" />;
}

export default function DashboardPage() {
  return (
    <main>
      <h1>Panel de control</h1>

      {/* Se muestra inmediatamente */}
      <WelcomeMessage />

      {/* Se carga progresivamente (streaming) */}
      <Suspense fallback={<LoadingSkeleton />}>
        <RecentActivity />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        <Analytics />
      </Suspense>
    </main>
  );
}`,
      description: 'Streaming permite mostrar partes de la página mientras otras se resuelven.',
    },
  ],
  pitfalls: [
    'Importar `useRouter` de `next/router` en vez de `next/navigation` — el primero es del Pages Router y no funciona en App Router.',
    'Usar `useRouter`, `usePathname` o `useSearchParams` en Server Components — estos hooks solo funcionan en Client Components (`"use client"`).',
    'Olvidar que `redirect()` lanza un error internamente — no pongas código después de `redirect()` porque no se ejecutará.',
    'Asumir que el prefetch descarga toda la página — solo descarga el RSC payload del segmento de ruta, no los datos dinámicos.',
    'Usar `<a>` en vez de `<Link>` — causa una recarga completa del navegador, perdiendo estado del cliente.',
    'No envolver componentes async en `<Suspense>` — sin boundary de Suspense no hay streaming y la página entera espera.',
    'Llamar `router.push()` en el render en vez de en un event handler — causa loops de navegación infinitos.',
    'Usar `redirect()` en event handlers client-side — es solo para Server Components y Route Handlers. En client usa `router.push()`.',
  ],
  cheatSheet: [
    '`<Link href="/ruta">` → navegación declarativa con prefetch automático',
    '`<Link prefetch={false}>` → desactiva prefetch para rutas pesadas',
    '`useRouter().push(url)` → navegar programáticamente (client)',
    '`useRouter().replace(url)` → reemplaza entrada en historial',
    '`useRouter().back()` → equivalente a botón "atrás" del navegador',
    '`useRouter().refresh()` → re-fetch de Server Components sin perder client state',
    '`usePathname()` → string con la ruta actual (sin query params)',
    '`useSearchParams().get("key")` → leer un query parameter',
    '`redirect("/ruta")` → redirigir server-side (lanza error, no retorna)',
    '`notFound()` → mostrar la página 404 más cercana',
    '`<Suspense fallback={...}>` → habilitar streaming para un subtree',
    'Todos los hooks de navegación requieren `"use client"`',
  ],
  flashcards: [
    {
      id: 'next-nav-fc-1',
      front: '¿Cuál es la diferencia principal entre usar `<Link>` y `<a>` en Next.js?',
      back: '`<Link>` realiza client-side navigation sin recargar la página completa (como ir por el túnel del metro), mientras que `<a>` provoca una recarga completa del navegador (como salir a la superficie y volver a entrar).',
      usesAnalogy: true,
    },
    {
      id: 'next-nav-fc-2',
      front: '¿Qué es el prefetching en Next.js y cuándo ocurre?',
      back: 'Es la descarga anticipada del código de una ruta cuando su `<Link>` aparece en el viewport. En producción ocurre automáticamente. Es como preparar vagones extra antes de hora pico para que la transición sea instantánea.',
      usesAnalogy: true,
    },
    {
      id: 'next-nav-fc-3',
      front: '¿De qué módulo debes importar `useRouter` en App Router?',
      back: 'De `next/navigation`. Importarlo de `next/router` es un error — ese es del Pages Router legacy.',
    },
    {
      id: 'next-nav-fc-4',
      front: '¿Qué diferencia hay entre `router.push()` y `router.replace()`?',
      back: '`push()` agrega una nueva entrada al historial (puedes volver con "atrás"), `replace()` sustituye la entrada actual (no puedes volver a la ruta anterior).',
    },
    {
      id: 'next-nav-fc-5',
      front: '¿Puedes usar `redirect()` en un Client Component?',
      back: 'No. `redirect()` solo funciona en Server Components, Server Actions y Route Handlers. En Client Components debes usar `useRouter().push()` o `useRouter().replace()`.',
    },
    {
      id: 'next-nav-fc-6',
      front: '¿Qué devuelve `usePathname()` si la URL es `/productos?categoria=libros`?',
      back: 'Devuelve solo `/productos`. Los query parameters se leen con `useSearchParams()`, no con `usePathname()`.',
    },
    {
      id: 'next-nav-fc-7',
      front: '¿Qué se necesita para habilitar streaming en una página de Next.js?',
      back: 'Envolver los componentes async en `<Suspense>` con un `fallback`. Sin un Suspense boundary, la página entera espera a que todos los datos estén listos.',
    },
    {
      id: 'next-nav-fc-8',
      front: '¿Qué sucede después de llamar `notFound()` en un Server Component?',
      back: 'Next.js deja de renderizar ese componente y muestra el archivo `not-found.tsx` más cercano en la jerarquía de layouts, devolviendo un status HTTP 404.',
    },
  ],
  quiz: [
    {
      id: 'next-nav-q-1',
      question: 'En la analogía del metro, ¿qué representa el prefetching de Next.js?',
      options: [
        { id: 'a', text: 'Los túneles que conectan estaciones' },
        { id: 'b', text: 'Preparar vagones extra antes de hora pico' },
        { id: 'c', text: 'El conductor que cambia de vía' },
        { id: 'd', text: 'Los letreros que indican la estación actual' },
      ],
      correctOptionId: 'b',
      explanation: 'El prefetching descarga el código de rutas de forma anticipada, igual que preparar vagones antes de que lleguen los pasajeros — todo listo para una transición instantánea.',
      whyOthersAreWrong: {
        a: 'Los túneles representan la client-side navigation (moverse sin salir a la superficie/recargar).',
        c: 'El conductor representa useRouter, que permite navegación programática.',
        d: 'Los letreros de estación actual representan usePathname.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-nav-q-2',
      question: '¿De qué módulo se debe importar `useRouter` en el App Router de Next.js?',
      options: [
        { id: 'a', text: '`next/router`' },
        { id: 'b', text: '`next/navigation`' },
        { id: 'c', text: '`react-router-dom`' },
        { id: 'd', text: '`next/link`' },
      ],
      correctOptionId: 'b',
      explanation: 'En App Router, todos los hooks de navegación (`useRouter`, `usePathname`, `useSearchParams`) se importan de `next/navigation`.',
      whyOthersAreWrong: {
        a: '`next/router` es del Pages Router legacy y no funciona con App Router.',
        c: '`react-router-dom` es una librería de terceros, no parte de Next.js.',
        d: '`next/link` exporta el componente Link, no hooks de navegación.',
      },
    },
    {
      id: 'next-nav-q-3',
      question: '¿Qué sucede si usas un tag `<a>` normal en vez de `<Link>` para navegar entre páginas en Next.js?',
      options: [
        { id: 'a', text: 'Funciona igual pero sin prefetching' },
        { id: 'b', text: 'El navegador hace una recarga completa, perdiendo todo el estado client-side' },
        { id: 'c', text: 'Next.js lo convierte automáticamente en un Link' },
        { id: 'd', text: 'Genera un error de TypeScript en compilación' },
      ],
      correctOptionId: 'b',
      explanation: 'Un `<a>` provoca una navegación tradicional: el navegador descarga toda la página desde cero, destruyendo el estado de React, el DOM virtual y cualquier dato en memoria.',
      whyOthersAreWrong: {
        a: 'No funciona igual — además de no prefetchear, pierde todo el estado del cliente y recarga la página completa.',
        c: 'Next.js no transforma `<a>` en `<Link>` automáticamente; son elementos distintos.',
        d: 'No hay error de compilación — `<a>` es HTML válido, simplemente no es óptimo para SPAs.',
      },
    },
    {
      id: 'next-nav-q-4',
      question: '¿Cuál es la forma correcta de redirigir programáticamente en un Server Component?',
      options: [
        { id: 'a', text: '`useRouter().push("/login")`' },
        { id: 'b', text: '`window.location.href = "/login"`' },
        { id: 'c', text: '`redirect("/login")`' },
        { id: 'd', text: '`Router.navigate("/login")`' },
      ],
      correctOptionId: 'c',
      explanation: '`redirect()` de `next/navigation` es la función server-side para redirecciones. Lanza internamente un error especial que Next.js intercepta para enviar la respuesta HTTP correcta.',
      whyOthersAreWrong: {
        a: '`useRouter` es un hook y solo funciona en Client Components — no se puede usar en Server Components.',
        b: '`window` no existe en el servidor — los Server Components se ejecutan en Node.js.',
        d: '`Router.navigate` no existe en Next.js.',
      },
    },
    {
      id: 'next-nav-q-5',
      question: '¿Qué devuelve `usePathname()` cuando la URL completa es `/blog/post-1?ref=twitter#intro`?',
      options: [
        { id: 'a', text: '`/blog/post-1?ref=twitter#intro`' },
        { id: 'b', text: '`/blog/post-1?ref=twitter`' },
        { id: 'c', text: '`/blog/post-1`' },
        { id: 'd', text: '`blog/post-1`' },
      ],
      correctOptionId: 'c',
      explanation: '`usePathname()` devuelve únicamente el pathname sin query parameters ni hash. Para leer `ref=twitter` se usa `useSearchParams()`.',
      whyOthersAreWrong: {
        a: 'Incluye query params y hash — usePathname no devuelve ninguno de los dos.',
        b: 'Incluye query params — usePathname solo devuelve el path.',
        d: 'Le falta la barra inicial — usePathname siempre empieza con `/`.',
      },
    },
    {
      id: 'next-nav-q-6',
      question: '¿Qué se necesita para habilitar streaming en una página de Next.js App Router?',
      options: [
        { id: 'a', text: 'Agregar `export const streaming = true` en el archivo de la página' },
        { id: 'b', text: 'Envolver componentes async en un boundary de `<Suspense>` con fallback' },
        { id: 'c', text: 'Usar el middleware `withStreaming()` en `next.config.js`' },
        { id: 'd', text: 'Importar `{ Stream }` de `next/stream`' },
      ],
      correctOptionId: 'b',
      explanation: 'El streaming en Next.js se activa automáticamente al usar `<Suspense>`. Los componentes dentro del boundary se envían al cliente progresivamente conforme se resuelven.',
      whyOthersAreWrong: {
        a: 'No existe tal exportación de configuración — streaming se controla con Suspense boundaries.',
        c: 'No existe `withStreaming()` — streaming es una característica nativa que se activa con Suspense.',
        d: 'No existe el módulo `next/stream`.',
      },
    },
    {
      id: 'next-nav-q-7',
      question: '¿Qué método de `useRouter()` permite refrescar los datos de Server Components sin perder el estado de Client Components?',
      options: [
        { id: 'a', text: '`router.reload()`' },
        { id: 'b', text: '`router.refresh()`' },
        { id: 'c', text: '`router.push(pathname)`' },
        { id: 'd', text: '`router.replace(pathname)`' },
      ],
      correctOptionId: 'b',
      explanation: '`router.refresh()` hace un re-fetch del RSC payload de Server Components en la ruta actual, actualizando los datos sin perder el estado de los Client Components ni el scroll position.',
      whyOthersAreWrong: {
        a: '`router.reload()` no existe en el App Router de Next.js.',
        c: '`router.push()` a la misma ruta agregaría una entrada al historial pero no garantiza re-fetch de datos server.',
        d: '`router.replace()` está diseñado para cambiar de ruta, no para refrescar datos en la misma.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 20,
  tags: ['next.js', 'navigation', 'Link', 'useRouter', 'prefetching', 'streaming', 'redirect', 'App Router'],
  codeChallenge: {
    instruction: 'Completa la navegación programática con useRouter.',
    template: `'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.{{get_method}}('q') ?? '';

  function handleSubmit(term: string) {
    router.{{navigate_method}}(\`/search?q=\${term}\`);
  }

  return <input defaultValue={query} onBlur={e => handleSubmit(e.target.{{value_prop}})} />;
}`,
    language: 'tsx',
    blanks: [
      { id: 'get_method', answers: ['get'], placeholder: 'method' },
      { id: 'navigate_method', answers: ['push', 'replace'], placeholder: 'method' },
      { id: 'value_prop', answers: ['value'], placeholder: 'prop' },
    ],
    hint: 'searchParams.get() lee un parámetro. router.push() navega a una nueva URL. e.target.value obtiene el valor del input.',
  },
};
