import type { Topic } from '../types';

export const nextjsRoutingTopic: Topic = {
  id: 'nextjs-routing',
  courseId: 'nextjs-16',
  title: 'Next.js Routing & File Structure',
  realWorldAnalogy: {
    title: 'El edificio de oficinas inteligente',
    scenario:
      'Imagina un edificio de oficinas donde cada piso tiene salas con letreros en la puerta. El elevador te lleva al piso correcto según la dirección que pides. Algunas salas comparten recepción, otras tienen salas de espera, y si una sala no existe, el guardia te redirige a "información". Hay pisos ocultos solo para empleados y pasillos que conectan salas de distintos pisos.',
    mapping: [
      { everyday: 'La dirección que pides al elevador', technical: 'La URL / segmento de ruta' },
      { everyday: 'Una sala con su letrero', technical: 'page.tsx — la página que se renderiza' },
      { everyday: 'La recepción compartida del piso', technical: 'layout.tsx — UI compartida entre páginas hermanas' },
      { everyday: 'La sala de espera antes de entrar', technical: 'loading.tsx — estado de carga' },
      { everyday: 'El guardia que te dice "esa sala no existe"', technical: 'not-found.tsx — página 404' },
      { everyday: 'Pisos ocultos solo para empleados', technical: 'Carpetas privadas _components' },
    ],
    whereItBreaks:
      'En un edificio real puedes entrar a cualquier sala si la puerta está abierta. En Next.js, solo las carpetas con page.tsx son accesibles como rutas — las demás carpetas son invisibles para el navegador.',
  },
  keyTerms: [
    {
      term: 'page.tsx',
      definition: 'Archivo que define la UI única de una ruta y la hace públicamente accesible.',
      analogyHint: 'La sala con letrero visible al público.',
    },
    {
      term: 'layout.tsx',
      definition: 'Componente que envuelve páginas hijas y persiste entre navegaciones sin re-montarse.',
      analogyHint: 'La recepción del piso que no cambia al moverte entre salas.',
    },
    {
      term: 'template.tsx',
      definition: 'Similar a layout pero se re-monta en cada navegación, creando una nueva instancia.',
      analogyHint: 'Una recepción que se reconstruye cada vez que entras.',
    },
    {
      term: 'loading.tsx',
      definition: 'UI de carga automática que envuelve la página en un Suspense boundary.',
      analogyHint: 'La sala de espera mientras preparan tu oficina.',
    },
    {
      term: 'error.tsx',
      definition: 'Boundary que captura errores en runtime y muestra una UI de recuperación.',
      analogyHint: 'El protocolo de emergencia del piso si algo falla.',
    },
    {
      term: 'Dynamic Segment [id]',
      definition: 'Segmento de ruta que acepta valores dinámicos, accesibles como params.',
      analogyHint: 'Salas numeradas: pides el número y te llevan a esa.',
    },
    {
      term: 'Route Group (folder)',
      definition: 'Carpeta con paréntesis que organiza rutas sin afectar la URL.',
      analogyHint: 'Un piso etiquetado internamente pero sin número público.',
    },
    {
      term: 'Parallel Routes @slot',
      definition: 'Rutas que se renderizan simultáneamente en el mismo layout como slots con nombre.',
      analogyHint: 'Dos salas visibles a la vez desde el mismo pasillo.',
    },
    {
      term: 'Intercepting Routes',
      definition: 'Rutas que capturan la navegación para mostrar contenido en el contexto actual.',
      analogyHint: 'Un pasillo atajo que muestra una sala sin salir del piso.',
    },
    {
      term: 'Catch-all [...slug]',
      definition: 'Segmento dinámico que captura uno o más segmentos de ruta como un array.',
      analogyHint: 'Una sala extensible que abarca cualquier cantidad de pisos.',
    },
  ],
  summary:
    'El App Router de Next.js usa el sistema de archivos como estructura de rutas. Cada carpeta es un segmento de URL y archivos especiales (page, layout, loading, error, not-found) definen el comportamiento de la ruta. Los segmentos dinámicos [id], catch-all [...slug], route groups (grupo), parallel routes @slot e intercepting routes permiten patrones avanzados de navegación sin configuración manual de rutas.',
  explanation: `## El edificio de oficinas inteligente

Piensa en el App Router como un **edificio de oficinas**. La estructura de carpetas en \`app/\` es el plano del edificio: cada carpeta es un piso, y los archivos especiales son las salas con funciones específicas.

## Archivos especiales — Las salas del piso

| Archivo | Función |
|---------|---------|
| \`page.tsx\` | La sala principal — sin ella, el piso no es visitable |
| \`layout.tsx\` | La recepción compartida — persiste entre navegaciones |
| \`template.tsx\` | Recepción que se reconstruye cada vez |
| \`loading.tsx\` | Sala de espera automática (Suspense) |
| \`error.tsx\` | Protocolo de emergencia (Error Boundary) |
| \`global-error.tsx\` | Alarma general del edificio entero |
| \`not-found.tsx\` | El guardia que dice "esa sala no existe" |
| \`route.ts\` | Sala de servicio (API endpoint, sin UI) |

## Segmentos dinámicos — Salas numeradas

\`\`\`
app/blog/[slug]/page.tsx    → /blog/mi-articulo
app/shop/[...slug]/page.tsx → /shop/ropa/camisas/xl
app/docs/[[...slug]]/page.tsx → /docs  O  /docs/intro/getting-started
\`\`\`

- \`[id]\` captura UN segmento → \`params.id\`
- \`[...slug]\` captura UNO O MÁS segmentos → \`params.slug\` (array)
- \`[[...slug]]\` captura CERO O MÁS segmentos → la ruta base también funciona

## Route Groups — Pisos internos

Carpetas con paréntesis \`(marketing)\` organizan código sin modificar la URL:

\`\`\`
app/(marketing)/about/page.tsx → /about
app/(shop)/products/page.tsx   → /products
\`\`\`

Útil para aplicar layouts diferentes a secciones distintas.

## Carpetas privadas — Pisos ocultos

Carpetas con \`_\` prefijo nunca se convierten en rutas:

\`\`\`
app/_components/Button.tsx  → NO es una ruta
app/_lib/utils.ts           → NO es una ruta
\`\`\`

## Parallel Routes — Dos salas a la vez

Con \`@slot\` defines rutas que se renderizan simultáneamente:

\`\`\`
app/@modal/login/page.tsx
app/@sidebar/page.tsx
app/layout.tsx  → recibe { children, modal, sidebar }
\`\`\`

Como tener dos salas visibles desde el mismo pasillo del edificio.

## Intercepting Routes — Atajos entre pisos

Permiten mostrar una ruta en el contexto actual (ej: modal sobre la página):

\`\`\`
app/feed/(..)photo/[id]/page.tsx  → intercepta /photo/[id] desde /feed
\`\`\`

Los prefijos \`(.)\`, \`(..)\`, \`(..)(..)\`, \`(...)\` indican cuántos niveles "subir".
`,
  codeExamples: [
    {
      title: 'Estructura básica de App Router',
      language: 'tsx',
      code: `// app/layout.tsx — Layout raíz (la recepción principal del edificio)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}`,
      description: 'El layout raíz envuelve toda la aplicación y no se re-monta nunca.',
    },
    {
      title: 'Página con segmento dinámico',
      language: 'tsx',
      code: `// app/blog/[slug]/page.tsx
interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  return <article><h1>Post: {slug}</h1></article>;
}

// generateStaticParams para SSG
export async function generateStaticParams() {
  return [{ slug: 'intro-nextjs' }, { slug: 'routing-basics' }];
}`,
      description: 'En Next.js 15+, params es una Promise que se debe await.',
    },
    {
      title: 'Catch-all y Optional Catch-all',
      language: 'tsx',
      code: `// app/docs/[...slug]/page.tsx — Requiere al menos 1 segmento
// /docs → 404
// /docs/intro → params.slug = ['intro']
// /docs/intro/setup → params.slug = ['intro', 'setup']

// app/docs/[[...slug]]/page.tsx — Acepta 0 o más segmentos
// /docs → params.slug = undefined
// /docs/intro → params.slug = ['intro']

interface DocsPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const path = slug?.join('/') ?? 'index';
  return <div>Documento: {path}</div>;
}`,
      description: 'La diferencia clave: [[...slug]] también matchea la ruta base sin segmentos.',
    },
    {
      title: 'loading.tsx y error.tsx',
      language: 'tsx',
      code: `// app/dashboard/loading.tsx — Se muestra automáticamente
export default function DashboardLoading() {
  return <div className="animate-pulse">Cargando dashboard...</div>;
}

// app/dashboard/error.tsx — Captura errores en runtime
'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Algo salió mal</h2>
      <button onClick={() => reset()}>Intentar de nuevo</button>
    </div>
  );
}`,
      description: 'error.tsx DEBE ser Client Component. loading.tsx envuelve page.tsx en Suspense.',
    },
    {
      title: 'Parallel Routes con @slot',
      language: 'tsx',
      code: `// app/layout.tsx con parallel routes
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      <main>{children}</main>
      {modal}
    </div>
  );
}

// app/@modal/login/page.tsx — Se renderiza en el slot "modal"
export default function LoginModal() {
  return <dialog open><h2>Iniciar sesión</h2></dialog>;
}

// app/@modal/default.tsx — Fallback cuando el slot no tiene match
export default function ModalDefault() {
  return null;
}`,
      description: 'Cada @slot necesita un default.tsx para cuando no hay match activo.',
    },
    {
      title: 'Intercepting Routes para modales',
      language: 'tsx',
      code: `// Estructura de archivos:
// app/feed/page.tsx
// app/feed/(.)photo/[id]/page.tsx  ← Intercepta /photo/[id]
// app/photo/[id]/page.tsx          ← Versión completa

// app/feed/(.)photo/[id]/page.tsx
export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <dialog open>
      <img src={\`/photos/\${id}.jpg\`} alt="Foto" />
    </dialog>
  );
}
// Al navegar desde /feed → muestra modal
// Al recargar /photo/123 → muestra página completa`,
      description: 'El prefijo (.) intercepta al mismo nivel, (..) un nivel arriba.',
    },
  ],
  pitfalls: [
    'Una carpeta sin page.tsx NO es una ruta accesible — solo organiza archivos.',
    'layout.tsx NO se re-monta entre navegaciones hermanas; si necesitas re-montar, usa template.tsx.',
    'error.tsx NO captura errores del layout del mismo nivel — solo de page.tsx y sus hijos. Para capturar errores del root layout necesitas global-error.tsx.',
    'En Next.js 15+, params y searchParams son Promises — debes usar await antes de acceder a sus propiedades.',
    '[...slug] requiere al menos un segmento; [[...slug]] también matchea la ruta vacía.',
    'route.ts y page.tsx NO pueden coexistir en la misma carpeta — route.ts es para API endpoints sin UI.',
    'Los @slots de Parallel Routes necesitan un default.tsx como fallback, o Next.js lanzará 404.',
    'Intercepting Routes solo funcionan con navegación client-side (Link/router.push); al recargar la página se muestra la ruta original.',
  ],
  cheatSheet: [
    'page.tsx → hace la ruta públicamente accesible',
    'layout.tsx → UI compartida que persiste (no se re-monta)',
    'template.tsx → como layout pero se re-monta en cada navegación',
    'loading.tsx → Suspense automático para la página',
    'error.tsx → Error Boundary (debe ser "use client")',
    'global-error.tsx → Error Boundary para el root layout',
    'not-found.tsx → UI para cuando se llama notFound()',
    'route.ts → API endpoint (GET, POST, etc.) sin UI',
    '[id] → segmento dinámico (un valor)',
    '[...slug] → catch-all (uno o más valores como array)',
    '[[...slug]] → optional catch-all (cero o más valores)',
    '(nombre) → route group (no afecta URL)',
    '_carpeta → carpeta privada (nunca es ruta)',
    '@slot → parallel route (se renderiza en layout como prop)',
    '(.) (..) (...) → intercepting routes (mismo nivel, un nivel arriba, raíz)',
  ],
  flashcards: [
    {
      id: 'next-routing-fc-1',
      front: '¿Qué archivo convierte una carpeta del App Router en una ruta públicamente accesible?',
      back: 'page.tsx — Sin este archivo, la carpeta solo sirve para organizar código pero no genera una URL navegable.',
    },
    {
      id: 'next-routing-fc-2',
      front: '¿Cuál es la diferencia entre layout.tsx y template.tsx?',
      back: 'layout.tsx persiste entre navegaciones (no se re-monta), mientras que template.tsx crea una nueva instancia en cada navegación. Usa template.tsx cuando necesitas resetear state o ejecutar efectos en cada transición.',
    },
    {
      id: 'next-routing-fc-3',
      front: 'En el edificio de oficinas, ¿qué representa la recepción del piso que nunca cambia?',
      back: 'layout.tsx — Igual que la recepción permanece mientras te mueves entre salas del mismo piso, el layout persiste mientras navegas entre páginas hermanas sin re-montarse.',
      usesAnalogy: true,
    },
    {
      id: 'next-routing-fc-4',
      front: '¿Cuál es la diferencia entre [...slug] y [[...slug]]?',
      back: '[...slug] requiere al menos un segmento (ej: /docs/intro funciona, pero /docs da 404). [[...slug]] es optional y también matchea la ruta base sin segmentos (/docs funciona y devuelve slug como undefined).',
    },
    {
      id: 'next-routing-fc-5',
      front: '¿Pueden coexistir route.ts y page.tsx en la misma carpeta?',
      back: 'No. route.ts define un API endpoint (sin UI) y page.tsx define una página. Si ambos existen en la misma carpeta, habrá un conflicto. Sepáralos en carpetas distintas.',
    },
    {
      id: 'next-routing-fc-6',
      front: '¿Qué son los Route Groups y cómo se crean?',
      back: 'Son carpetas con nombre entre paréntesis, ej: (marketing). Organizan archivos y permiten layouts diferentes por sección, pero NO afectan la URL. app/(marketing)/about/page.tsx → /about.',
    },
    {
      id: 'next-routing-fc-7',
      front: '¿Por qué error.tsx debe ser un Client Component ("use client")?',
      back: 'Porque Error Boundaries son un patrón exclusivo de Client Components en React. Además, error.tsx necesita interactividad (botón "reintentar") que requiere hooks y event handlers del lado del cliente.',
    },
    {
      id: 'next-routing-fc-8',
      front: 'En la analogía del edificio, ¿qué representan los pisos ocultos solo para empleados?',
      back: 'Las carpetas privadas con prefijo _ (ej: _components, _lib). Nunca se convierten en rutas accesibles, igual que un piso restringido no aparece en el directorio público del edificio.',
      usesAnalogy: true,
    },
    {
      id: 'next-routing-fc-9',
      front: '¿Qué son las Parallel Routes y cómo se definen?',
      back: 'Son rutas que se renderizan simultáneamente en el mismo layout. Se definen con carpetas @nombre (ej: @modal, @sidebar). El layout las recibe como props nombradas. Cada slot necesita un default.tsx como fallback.',
    },
    {
      id: 'next-routing-fc-10',
      front: '¿Cuándo se usa Intercepting Routes y qué prefijo indica "un nivel arriba"?',
      back: 'Se usan para mostrar una ruta en el contexto actual (ej: abrir foto como modal sin salir del feed). El prefijo (..) indica un nivel arriba. Solo funcionan con navegación client-side; al recargar se muestra la ruta completa.',
    },
  ],
  quiz: [
    {
      id: 'next-routing-q-1',
      question: '¿Qué archivo es OBLIGATORIO para que una carpeta en app/ sea una ruta navegable?',
      options: [
        { id: 'a', text: 'layout.tsx' },
        { id: 'b', text: 'page.tsx' },
        { id: 'c', text: 'route.ts' },
        { id: 'd', text: 'index.tsx' },
      ],
      correctOptionId: 'b',
      explanation: 'page.tsx es el archivo que hace una ruta públicamente accesible. Sin él, la carpeta solo organiza archivos pero no genera una URL.',
      whyOthersAreWrong: {
        a: 'layout.tsx es opcional — define UI compartida pero no crea una ruta por sí solo.',
        c: 'route.ts define un API endpoint y NO puede coexistir con page.tsx. No renderiza UI.',
        d: 'index.tsx era la convención en Pages Router. En App Router se usa page.tsx.',
      },
    },
    {
      id: 'next-routing-q-2',
      question: 'En la analogía del edificio, la recepción del piso que permanece igual mientras te mueves entre salas representa:',
      options: [
        { id: 'a', text: 'template.tsx — se reconstruye cada vez que entras' },
        { id: 'b', text: 'page.tsx — la sala principal de cada piso' },
        { id: 'c', text: 'layout.tsx — persiste sin re-montarse entre navegaciones' },
        { id: 'd', text: 'loading.tsx — la sala de espera temporal' },
      ],
      correctOptionId: 'c',
      explanation: 'layout.tsx es como la recepción permanente del piso: no cambia (no se re-monta) mientras te mueves entre páginas hermanas.',
      whyOthersAreWrong: {
        a: 'template.tsx se RE-MONTA en cada navegación — sería una recepción que se reconstruye.',
        b: 'page.tsx es la sala específica que visitas, no la recepción compartida.',
        d: 'loading.tsx es temporal — desaparece cuando la página termina de cargar.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-routing-q-3',
      question: '¿Cuál de estas rutas matchea la URL /docs SIN dar 404?',
      options: [
        { id: 'a', text: 'app/docs/[...slug]/page.tsx' },
        { id: 'b', text: 'app/docs/[[...slug]]/page.tsx' },
        { id: 'c', text: 'app/docs/[slug]/page.tsx' },
        { id: 'd', text: 'app/docs/(slug)/page.tsx' },
      ],
      correctOptionId: 'b',
      explanation: '[[...slug]] es un optional catch-all que matchea cero o más segmentos. La ruta /docs (sin segmentos adicionales) funciona porque el catch-all es opcional.',
      whyOthersAreWrong: {
        a: '[...slug] requiere al MENOS un segmento. /docs sin nada después da 404.',
        c: '[slug] requiere exactamente un segmento dinámico. /docs sin segmento no matchea.',
        d: '(slug) es un route group — no captura valores dinámicos, solo organiza archivos.',
      },
    },
    {
      id: 'next-routing-q-4',
      question: '¿Por qué error.tsx DEBE incluir "use client" al inicio?',
      options: [
        { id: 'a', text: 'Porque necesita acceder a localStorage para guardar el error' },
        { id: 'b', text: 'Porque Error Boundaries son un patrón de Client Components y necesita interactividad' },
        { id: 'c', text: 'Porque los Server Components no pueden importar React' },
        { id: 'd', text: 'Porque Next.js no permite archivos .tsx en el servidor' },
      ],
      correctOptionId: 'b',
      explanation: 'Error Boundaries (componentDidCatch/getDerivedStateFromError) solo existen como Class Components o Client Components. Además, error.tsx necesita interactividad (botón reset) que requiere el cliente.',
      whyOthersAreWrong: {
        a: 'error.tsx no tiene relación con localStorage. Su propósito es mostrar UI de recuperación.',
        c: 'Falso — los Server Components sí pueden importar y usar React.',
        d: 'Falso — la mayoría de archivos .tsx en App Router son Server Components por defecto.',
      },
    },
    {
      id: 'next-routing-q-5',
      question: '¿Qué pasa si un @slot de Parallel Routes no tiene un archivo default.tsx?',
      options: [
        { id: 'a', text: 'Next.js renderiza un div vacío automáticamente' },
        { id: 'b', text: 'Next.js usa el page.tsx más cercano como fallback' },
        { id: 'c', text: 'Next.js lanza un 404 cuando el slot no tiene match para la URL actual' },
        { id: 'd', text: 'Next.js ignora el slot y no lo renderiza' },
      ],
      correctOptionId: 'c',
      explanation: 'Sin default.tsx, cuando la URL actual no matchea ninguna página dentro del slot, Next.js no sabe qué renderizar y produce un 404.',
      whyOthersAreWrong: {
        a: 'Next.js no genera fallbacks automáticos para slots — necesitas definirlos explícitamente.',
        b: 'No existe esa jerarquía de fallback. Cada slot es independiente.',
        d: 'El slot siempre intenta renderizar algo; si no puede, falla con 404.',
      },
    },
    {
      id: 'next-routing-q-6',
      question: '¿Qué efecto tiene nombrar una carpeta (admin) con paréntesis en App Router?',
      options: [
        { id: 'a', text: 'Crea un segmento dinámico que captura "admin" como parámetro' },
        { id: 'b', text: 'Hace la ruta accesible solo para administradores' },
        { id: 'c', text: 'Agrupa archivos organizacionalmente sin agregar "admin" a la URL' },
        { id: 'd', text: 'Marca la carpeta como privada e inaccesible desde el navegador' },
      ],
      correctOptionId: 'c',
      explanation: 'Los Route Groups con paréntesis son puramente organizacionales. Permiten agrupar rutas y aplicar layouts compartidos sin que el nombre de la carpeta aparezca en la URL.',
      whyOthersAreWrong: {
        a: 'Los segmentos dinámicos usan corchetes [admin], no paréntesis.',
        b: 'Route Groups no tienen nada que ver con autenticación o autorización.',
        d: 'Las carpetas privadas usan prefijo _ (guion bajo), no paréntesis.',
      },
    },
    {
      id: 'next-routing-q-7',
      question: '¿Cuál es el comportamiento de Intercepting Routes al hacer hard refresh (F5) en la página interceptada?',
      options: [
        { id: 'a', text: 'Se muestra la versión interceptada (modal) como en la navegación normal' },
        { id: 'b', text: 'Se muestra la página completa original, no la versión interceptada' },
        { id: 'c', text: 'Next.js redirige al usuario a la página anterior' },
        { id: 'd', text: 'Se produce un error 500 porque la intercepción falla' },
      ],
      correctOptionId: 'b',
      explanation: 'Las Intercepting Routes solo funcionan con navegación client-side (Link, router.push). Al recargar la página o acceder directamente por URL, se renderiza la ruta original completa.',
      whyOthersAreWrong: {
        a: 'La intercepción SOLO ocurre con soft navigation (client-side). El hard refresh es una nueva petición al servidor.',
        c: 'No hay redirección — simplemente se muestra la ruta completa como cualquier página normal.',
        d: 'No hay error. La ruta original (/photo/[id]/page.tsx) se renderiza normalmente.',
      },
    },
    {
      id: 'next-routing-q-8',
      question: '¿Cuál de estas combinaciones es INVÁLIDA en la misma carpeta?',
      options: [
        { id: 'a', text: 'page.tsx + layout.tsx + loading.tsx' },
        { id: 'b', text: 'page.tsx + error.tsx + not-found.tsx' },
        { id: 'c', text: 'page.tsx + route.ts' },
        { id: 'd', text: 'layout.tsx + template.tsx + page.tsx' },
      ],
      correctOptionId: 'c',
      explanation: 'page.tsx y route.ts NO pueden coexistir en la misma carpeta. page.tsx renderiza UI y route.ts define un API endpoint — representan dos propósitos incompatibles para la misma ruta.',
      whyOthersAreWrong: {
        a: 'Perfectamente válido — loading.tsx envuelve page.tsx en Suspense dentro del layout.',
        b: 'Válido — error.tsx captura errores de page.tsx y not-found.tsx maneja llamadas a notFound().',
        d: 'Válido pero inusual — template.tsx se aplica DESPUÉS del layout. Ambos pueden coexistir.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 30,
  tags: [
    'next.js',
    'app-router',
    'routing',
    'file-structure',
    'dynamic-routes',
    'parallel-routes',
    'intercepting-routes',
    'layouts',
  ],
  codeChallenge: {
    instruction: 'Completa la estructura de un layout con children y una ruta dinámica.',
    template: `// app/layout.tsx
export default function RootLayout({
  {{prop}},
}: {
  {{prop}}: React.ReactNode;
}) {
  return (
    <html>
      <body>{{{prop}}}</body>
    </html>
  );
}

// app/blog/[{{param}}]/page.tsx
export default function BlogPost({
  params,
}: {
  params: { {{param}}: string };
}) {
  return <h1>Post: {params.{{param}}}</h1>;
}`,
    language: 'tsx',
    blanks: [
      { id: 'prop', answers: ['children'], placeholder: 'prop' },
      { id: 'param', answers: ['slug', 'id'], placeholder: 'param' },
    ],
    hint: 'Los layouts reciben children como prop. Las rutas dinámicas usan [nombreParam] en la carpeta.',
  },
};
