import type { Topic } from '../types';

export const nextjsDataFetchingTopic: Topic = {
  id: 'nextjs-data-fetching',
  courseId: 'nextjs-16',
  title: 'Next.js Data Fetching: El chef que prepara los pedidos',
  realWorldAnalogy: {
    title: 'La cocina del restaurante',
    scenario:
      'En un restaurante, el chef prepara los platos en la cocina antes de servirlos. Si dos meseros piden el mismo plato al mismo tiempo, el chef lo prepara una sola vez. Algunos platos se pueden preparar en paralelo (ensalada y sopa), pero otros necesitan hacerse en orden (primero hervir la pasta, luego agregar la salsa).',
    mapping: [
      { everyday: 'El chef preparando platos en la cocina', technical: 'Server Components haciendo fetch en el servidor' },
      { everyday: 'No repetir un plato que ya se está preparando', technical: 'Request Memoization — fetch deduplicado automáticamente' },
      { everyday: 'Preparar ensalada y sopa al mismo tiempo', technical: 'Parallel Fetching con Promise.all' },
      { everyday: 'Hervir pasta primero, luego agregar salsa', technical: 'Sequential Fetching — un fetch depende del resultado anterior' },
      { everyday: 'Dejar ingredientes pre-cortados antes del servicio', technical: 'Preloading Pattern — iniciar fetch antes de necesitar los datos' },
      { everyday: 'El mesero leyendo las preferencias del cliente (alérgico, vegano)', technical: 'cookies() y headers() — leer información de la solicitud' },
    ],
    whereItBreaks:
      'En un restaurante real, preparar platos en paralelo tiene límites físicos (espacio, quemadores). En el servidor, puedes lanzar decenas de fetch en paralelo sin ese límite. Además, la memoización en Next.js solo aplica dentro de una misma solicitud, no entre diferentes usuarios.',
  },
  keyTerms: [
    {
      term: 'Server Components',
      definition: 'Componentes que se ejecutan exclusivamente en el servidor y pueden usar await directamente para obtener datos.',
      analogyHint: 'El chef que trabaja en la cocina, no frente al cliente.',
    },
    {
      term: 'Request Memoization',
      definition: 'Next.js deduplica automáticamente requests fetch idénticos dentro del mismo render, evitando llamadas repetidas.',
      analogyHint: 'No preparar dos veces el mismo plato si ya está en camino.',
    },
    {
      term: 'Parallel Fetching',
      definition: 'Ejecutar múltiples fetch simultáneamente con Promise.all para reducir el tiempo total de carga.',
      analogyHint: 'Preparar la sopa y la ensalada al mismo tiempo.',
    },
    {
      term: 'Sequential Fetching',
      definition: 'Ejecutar fetch uno tras otro cuando el segundo depende del resultado del primero (waterfall intencional).',
      analogyHint: 'Hervir la pasta antes de poder agregarle la salsa.',
    },
    {
      term: 'Preloading Pattern',
      definition: 'Iniciar un fetch anticipadamente con una función preload() para que los datos estén listos cuando el componente los necesite.',
      analogyHint: 'Pre-cortar ingredientes antes de que lleguen los pedidos.',
    },
    {
      term: 'cookies()',
      definition: 'API async de Next.js que permite leer las cookies de la solicitud entrante en Server Components.',
      analogyHint: 'Leer la ficha del cliente con sus preferencias y alergias.',
    },
    {
      term: 'headers()',
      definition: 'API async de Next.js que permite leer los headers HTTP de la solicitud entrante.',
      analogyHint: 'Ver de qué mesa viene el pedido y qué idioma habla el cliente.',
    },
    {
      term: 'params',
      definition: 'Prop async que recibe un Server Component con los segmentos dinámicos de la ruta (ej: [slug]).',
      analogyHint: 'El número de mesa que indica para quién es el plato.',
    },
    {
      term: 'searchParams',
      definition: 'Prop async que recibe una página con los query parameters de la URL (?sort=asc).',
      analogyHint: 'Las instrucciones extras escritas en la comanda: "sin cebolla".',
    },
  ],
  summary:
    'En Next.js 16, los Server Components obtienen datos directamente en el servidor usando async/await con fetch. Next.js deduplica requests idénticos automáticamente (memoization). Para optimizar rendimiento, usa Promise.all para fetch paralelos y el patrón preload para iniciar cargas anticipadamente. Las APIs de solicitud — cookies(), headers(), params y searchParams — son todas asíncronas y requieren await.',
  explanation: `## La cocina del restaurante: obtener datos en el servidor

Igual que un **chef prepara los platos en la cocina** antes de que el cliente los vea, los Server Components en Next.js obtienen datos **en el servidor** antes de enviar el HTML al navegador.

### Fetch directo en Server Components

\`\`\`tsx
// app/productos/page.tsx — El chef preparando el plato
async function ProductosPage() {
  const res = await fetch('https://api.tienda.com/productos');
  const productos = await res.json();
  return <ListaProductos items={productos} />;
}
\`\`\`

No necesitas useEffect, no necesitas useState. El componente es \`async\` y hace \`await\` directamente — como un chef que simplemente prepara el plato sin intermediarios.

### Request Memoization: no repetir platos

Si dos componentes en el mismo árbol piden los mismos datos, Next.js **deduplica** automáticamente:

\`\`\`tsx
// Ambos componentes hacen fetch a la misma URL
// Next.js solo ejecuta UN request real
async function Header() {
  const user = await getUser(); // fetch #1 (real)
  return <h1>{user.name}</h1>;
}

async function Sidebar() {
  const user = await getUser(); // fetch #2 (memoizado, gratis)
  return <nav>{user.role}</nav>;
}
\`\`\`

Como en la cocina: si dos meseros piden "sopa del día", el chef no la prepara dos veces.

### Parallel vs Sequential: sopa y ensalada vs pasta con salsa

**Paralelo** — cuando los datos son independientes:

\`\`\`tsx
async function Dashboard() {
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts(),
  ]);
  // Ambos se obtuvieron al mismo tiempo
}
\`\`\`

**Secuencial** — cuando uno depende del otro:

\`\`\`tsx
async function UserPosts({ userId }: { userId: string }) {
  const user = await getUser(userId);       // primero: ¿quién es?
  const posts = await getPosts(user.teamId); // luego: sus posts
  return <Feed posts={posts} />;
}
\`\`\`

### Preloading Pattern: pre-cortar ingredientes

\`\`\`tsx
// lib/data.ts
export function preload(id: string) {
  void getItem(id); // inicia el fetch sin esperar resultado
}

// app/item/[id]/page.tsx
import { preload } from '@/lib/data';

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  preload(id); // inicia la carga inmediatamente
  return <Suspense fallback={<Loading />}><ItemDetail id={id} /></Suspense>;
}
\`\`\`

### APIs de solicitud: leer las preferencias del cliente

En Next.js 16, \`cookies()\`, \`headers()\`, \`params\` y \`searchParams\` son **asíncronos**:

\`\`\`tsx
import { cookies, headers } from 'next/headers';

async function Component() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  const headerList = await headers();
  const lang = headerList.get('accept-language');
}
\`\`\`

Como leer la ficha del cliente antes de preparar su pedido: necesitas saber sus alergias (cookies) y de qué mesa viene (headers) para servirle correctamente.`,
  codeExamples: [
    {
      title: 'Fetch básico en Server Component',
      language: 'tsx',
      code: `// app/blog/page.tsx
interface Post {
  id: number;
  title: string;
  body: string;
}

export default async function BlogPage() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }, // revalidar cada hora
  });
  const posts: Post[] = await res.json();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}`,
      description: 'Server Component que obtiene datos directamente con fetch y opciones de cache.',
    },
    {
      title: 'Parallel Fetching con Promise.all',
      language: 'tsx',
      code: `// app/dashboard/page.tsx
async function getUser() {
  const res = await fetch('https://api.example.com/user');
  return res.json();
}

async function getNotifications() {
  const res = await fetch('https://api.example.com/notifications');
  return res.json();
}

export default async function DashboardPage() {
  // Ambos fetch se ejecutan en paralelo
  const [user, notifications] = await Promise.all([
    getUser(),
    getNotifications(),
  ]);

  return (
    <div>
      <h1>Hola, {user.name}</h1>
      <p>Tienes {notifications.length} notificaciones</p>
    </div>
  );
}`,
      description: 'Dos fetch independientes ejecutados simultáneamente para reducir el tiempo de carga.',
    },
    {
      title: 'Async params y searchParams',
      language: 'tsx',
      code: `// app/productos/[category]/page.tsx
interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { sort = 'newest', page = '1' } = await searchParams;

  const res = await fetch(
    \`https://api.example.com/productos?cat=\${category}&sort=\${sort}&page=\${page}\`
  );
  const productos = await res.json();

  return <ProductGrid items={productos} />;
}`,
      description: 'Uso de params y searchParams como Promises asíncronas en Next.js 16.',
    },
    {
      title: 'cookies() y headers() asíncronos',
      language: 'tsx',
      code: `// app/perfil/page.tsx
import { cookies, headers } from 'next/headers';

export default async function PerfilPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session-token')?.value;

  if (!session) {
    return <p>No autenticado</p>;
  }

  const headerList = await headers();
  const userAgent = headerList.get('user-agent') ?? 'desconocido';

  return (
    <div>
      <p>Sesión activa</p>
      <p>Navegador: {userAgent}</p>
    </div>
  );
}`,
      description: 'Lectura de cookies y headers con las APIs asíncronas de Next.js 16.',
    },
    {
      title: 'Preloading Pattern',
      language: 'tsx',
      code: `// lib/data.ts
import { cache } from 'react';

export const getArticle = cache(async (id: string) => {
  const res = await fetch(\`https://api.example.com/articles/\${id}\`);
  return res.json();
});

export function preloadArticle(id: string) {
  void getArticle(id);
}

// app/articles/[id]/page.tsx
import { getArticle, preloadArticle } from '@/lib/data';
import { Suspense } from 'react';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  preloadArticle(id); // inicia fetch inmediatamente

  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <ArticleContent id={id} />
    </Suspense>
  );
}

async function ArticleContent({ id }: { id: string }) {
  const article = await getArticle(id); // usa el resultado ya en vuelo
  return <article><h1>{article.title}</h1><p>{article.body}</p></article>;
}`,
      description: 'Patrón preload con React cache para iniciar fetch anticipadamente.',
    },
  ],
  pitfalls: [
    'Olvidar await en params o searchParams — en Next.js 16 son Promises, no objetos síncronos.',
    'Crear waterfalls accidentales al usar await secuencial cuando los datos son independientes — usa Promise.all.',
    'Asumir que Request Memoization funciona entre diferentes requests de usuario — solo aplica dentro del mismo render.',
    'Usar cookies() o headers() sin await — son APIs asíncronas en Next.js 16 y devuelven una Promise.',
    'Llamar cookies() o headers() en Client Components — solo funcionan en Server Components y Route Handlers.',
    'No usar React cache() con el patrón preload — sin cache, el fetch no se deduplica y se ejecuta dos veces.',
    'Poner fetch con { cache: "no-store" } en todas partes por miedo al cache — esto desactiva la memoización y genera carga innecesaria.',
  ],
  cheatSheet: [
    'Server Components son async por defecto — usa await fetch() directamente, sin useEffect.',
    'Request Memoization: misma URL + mismas opciones en el mismo render = un solo fetch real.',
    'Promise.all([fetchA(), fetchB()]) para datos independientes — evita waterfalls.',
    'Sequential fetching solo cuando B depende del resultado de A.',
    'preload() + React cache() = iniciar fetch anticipadamente sin duplicar.',
    'params y searchParams son Promise en Next.js 16 — siempre usar await.',
    'cookies() y headers() son async — requieren await y solo funcionan en el servidor.',
    'fetch con next: { revalidate: N } para ISR (regeneración incremental).',
    'fetch con cache: "no-store" para datos que siempre deben ser frescos.',
  ],
  flashcards: [
    {
      id: 'next-data-fc-1',
      front: '¿Por qué los Server Components pueden obtener datos sin useEffect ni useState?',
      back: 'Porque se ejecutan en el servidor y son funciones async — pueden usar await directamente. Como un chef que prepara todo en la cocina sin necesitar que el cliente intervenga.',
      usesAnalogy: true,
    },
    {
      id: 'next-data-fc-2',
      front: '¿Qué es Request Memoization en Next.js y cuándo aplica?',
      back: 'Next.js deduplica automáticamente fetch con la misma URL y opciones dentro del mismo render de servidor. Si 3 componentes piden el mismo recurso, solo se ejecuta 1 request real. Solo aplica dentro de una misma solicitud, no entre usuarios.',
    },
    {
      id: 'next-data-fc-3',
      front: '¿Cuándo usar Promise.all vs sequential fetching?',
      back: 'Promise.all cuando los datos son independientes (reducir tiempo total). Sequential cuando un fetch depende del resultado anterior. Como en la cocina: sopa y ensalada van en paralelo, pero la salsa necesita que la pasta esté lista primero.',
      usesAnalogy: true,
    },
    {
      id: 'next-data-fc-4',
      front: '¿Cómo funcionan params y searchParams en Next.js 16?',
      back: 'Son Promises asíncronas. Debes usar await para obtener sus valores: const { id } = await params. Esto permite a Next.js optimizar el rendering de forma más granular.',
    },
    {
      id: 'next-data-fc-5',
      front: '¿Qué retornan cookies() y headers() en Next.js 16 y dónde pueden usarse?',
      back: 'Retornan Promises — requieren await. Solo pueden usarse en Server Components, Route Handlers y Server Actions. Nunca en Client Components.',
    },
    {
      id: 'next-data-fc-6',
      front: '¿Qué es el Preloading Pattern y cómo se implementa?',
      back: 'Consiste en iniciar un fetch anticipadamente con una función preload() que llama void getData(id). Se combina con React cache() para que cuando el componente hijo pida los mismos datos, ya estén en vuelo o resueltos.',
    },
    {
      id: 'next-data-fc-7',
      front: '¿Cuál es la diferencia entre fetch con next: { revalidate: 3600 } y cache: "no-store"?',
      back: 'revalidate: 3600 cachea el resultado y lo regenera cada hora (ISR). cache: "no-store" nunca cachea — siempre obtiene datos frescos en cada request. El primero es mejor para datos que cambian poco.',
    },
    {
      id: 'next-data-fc-8',
      front: '¿Por qué es importante usar React cache() junto con el patrón preload?',
      back: 'Sin cache(), llamar preload(id) y luego getData(id) ejecutaría dos fetch separados. cache() asegura que ambas llamadas con los mismos argumentos comparten el mismo resultado — la segunda usa la Promise que ya está en vuelo.',
    },
  ],
  quiz: [
    {
      id: 'next-data-q-1',
      question: 'En la analogía de la cocina, ¿qué representa que el chef prepare un plato una sola vez aunque dos meseros lo pidan simultáneamente?',
      options: [
        { id: 'a', text: 'Parallel Fetching con Promise.all' },
        { id: 'b', text: 'Request Memoization — deduplicar fetch idénticos' },
        { id: 'c', text: 'Sequential Fetching — un fetch tras otro' },
        { id: 'd', text: 'Preloading Pattern — pre-cargar datos' },
      ],
      correctOptionId: 'b',
      explanation: 'Request Memoization deduplica automáticamente requests fetch con la misma URL y opciones dentro del mismo render. Como el chef que prepara un solo plato aunque dos meseros lo pidan al mismo tiempo.',
      whyOthersAreWrong: {
        a: 'Parallel Fetching ejecuta múltiples fetch diferentes al mismo tiempo — no deduplica fetch iguales.',
        c: 'Sequential Fetching ejecuta fetch uno después de otro por dependencia, no tiene que ver con deduplicación.',
        d: 'Preloading inicia un fetch anticipadamente, pero no trata de deduplicar requests repetidos.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-data-q-2',
      question: '¿Cuál es la forma correcta de obtener params en un Server Component en Next.js 16?',
      options: [
        { id: 'a', text: 'const { id } = params; // acceso directo síncrono' },
        { id: 'b', text: 'const { id } = await params; // await porque es Promise' },
        { id: 'c', text: 'const { id } = useParams(); // hook de React' },
        { id: 'd', text: 'const { id } = getParams(); // función de Next.js' },
      ],
      correctOptionId: 'b',
      explanation: 'En Next.js 16, params es una Promise que debe resolverse con await. Esto permite optimizaciones internas en el framework.',
      whyOthersAreWrong: {
        a: 'En Next.js 16 params ya no es un objeto síncrono — es una Promise y requiere await.',
        c: 'useParams() es un hook de Client Components (de next/navigation), no se usa en Server Components async.',
        d: 'No existe una función getParams() en Next.js.',
      },
    },
    {
      id: 'next-data-q-3',
      question: '¿Qué ocurre si dos Server Components diferentes en el mismo render hacen fetch a la misma URL con las mismas opciones?',
      options: [
        { id: 'a', text: 'Se ejecutan dos requests HTTP independientes al servidor externo' },
        { id: 'b', text: 'Next.js lanza un error por fetch duplicado' },
        { id: 'c', text: 'Next.js ejecuta un solo request y comparte el resultado entre ambos componentes' },
        { id: 'd', text: 'El segundo componente recibe undefined porque el primero ya consumió la respuesta' },
      ],
      correctOptionId: 'c',
      explanation: 'Request Memoization de Next.js deduplica automáticamente fetch idénticos (misma URL + mismas opciones) dentro del mismo render de servidor.',
      whyOthersAreWrong: {
        a: 'Next.js optimiza esto automáticamente — no envía requests duplicados al servidor externo.',
        b: 'No hay error — la deduplicación es transparente y automática.',
        d: 'Ambos componentes reciben los mismos datos completos — no hay consumo exclusivo.',
      },
    },
    {
      id: 'next-data-q-4',
      question: '¿Cuál es el problema del siguiente código?\n\n```tsx\nasync function Page() {\n  const user = await getUser();\n  const posts = await getPosts();\n  const comments = await getComments();\n}\n```',
      options: [
        { id: 'a', text: 'No se puede usar await más de una vez en un Server Component' },
        { id: 'b', text: 'Crea un waterfall innecesario si los datos son independientes entre sí' },
        { id: 'c', text: 'Falta el try/catch obligatorio para fetch en Server Components' },
        { id: 'd', text: 'getUser, getPosts y getComments deben ser Client Components' },
      ],
      correctOptionId: 'b',
      explanation: 'Si los tres fetch son independientes, ejecutarlos secuencialmente crea un waterfall: cada uno espera al anterior. Deberían ir en Promise.all para ejecutarse en paralelo.',
      whyOthersAreWrong: {
        a: 'Se puede usar await múltiples veces — el problema es usarlo secuencialmente con datos independientes.',
        c: 'No existe tal obligación — los errores se pueden manejar con error boundaries u opcionalmente con try/catch.',
        d: 'Las funciones de fetch son funciones del servidor, no componentes.',
      },
    },
    {
      id: 'next-data-q-5',
      question: '¿Dónde pueden usarse cookies() y headers() de next/headers?',
      options: [
        { id: 'a', text: 'En cualquier componente, tanto Server como Client Components' },
        { id: 'b', text: 'Solo en Client Components porque necesitan acceso al navegador' },
        { id: 'c', text: 'Solo en Server Components, Route Handlers y Server Actions' },
        { id: 'd', text: 'Solo dentro de middleware.ts' },
      ],
      correctOptionId: 'c',
      explanation: 'cookies() y headers() leen la solicitud HTTP entrante, que solo está disponible en el servidor. Funcionan en Server Components, Route Handlers y Server Actions.',
      whyOthersAreWrong: {
        a: 'Client Components no tienen acceso a la solicitud HTTP del servidor — se ejecutan en el navegador.',
        b: 'Es al revés: cookies() y headers() leen la solicitud del servidor, no del navegador directamente.',
        d: 'También funcionan fuera de middleware — en cualquier código que se ejecute en el servidor.',
      },
    },
    {
      id: 'next-data-q-6',
      question: '¿Cuál es el propósito de React cache() en el Preloading Pattern?',
      options: [
        { id: 'a', text: 'Guardar datos en localStorage para offline' },
        { id: 'b', text: 'Asegurar que preload() y la llamada posterior compartan el mismo resultado sin duplicar el fetch' },
        { id: 'c', text: 'Crear un cache HTTP persistente entre diferentes usuarios' },
        { id: 'd', text: 'Reemplazar la necesidad de usar fetch — obtiene datos del cache del navegador' },
      ],
      correctOptionId: 'b',
      explanation: 'React cache() memoiza la función: si preload() llama getArticle(id) y luego el componente llama getArticle(id) con el mismo argumento, ambos comparten la misma Promise.',
      whyOthersAreWrong: {
        a: 'React cache() es server-side y per-request — no tiene nada que ver con localStorage.',
        c: 'cache() de React es por request individual, no persiste entre usuarios ni entre solicitudes.',
        d: 'cache() no reemplaza fetch — envuelve funciones para memoizar sus resultados dentro del mismo render.',
      },
    },
    {
      id: 'next-data-q-7',
      question: 'En la analogía del restaurante, ¿qué representan las cookies() en Next.js?',
      options: [
        { id: 'a', text: 'Los ingredientes que el chef tiene disponibles en la despensa' },
        { id: 'b', text: 'La ficha del cliente con sus preferencias y alergias que el mesero entrega al chef' },
        { id: 'c', text: 'Las recetas que sigue el chef para preparar cada plato' },
        { id: 'd', text: 'Los platos terminados que se envían a la mesa' },
      ],
      correctOptionId: 'b',
      explanation: 'cookies() lee información asociada al cliente (sesión, preferencias) que viene con cada solicitud — como la ficha que el mesero lleva a la cocina indicando alergias o preferencias del cliente.',
      whyOthersAreWrong: {
        a: 'Los ingredientes serían más como las APIs externas o la base de datos — fuentes de datos, no info del cliente.',
        c: 'Las recetas serían la lógica del componente, no la información específica del usuario.',
        d: 'Los platos terminados representan el HTML renderizado que se envía al navegador.',
      },
      usesAnalogy: true,
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 25,
  tags: [
    'next.js',
    'data-fetching',
    'server-components',
    'async',
    'memoization',
    'cookies',
    'headers',
    'params',
    'searchParams',
    'parallel-fetching',
    'preloading',
  ],
  codeChallenge: {
    instruction: 'Completa un Server Component que hace fetch de datos en paralelo usando Promise.all para evitar waterfalls.',
    template: `// app/dashboard/page.tsx
async function getUser() {
  const res = await fetch('https://api.example.com/user');
  return res.json();
}

async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function Dashboard() {
  const [user, posts] = await {{promise_method}}([
    {{get_user}}(),
    {{get_posts}}(),
  ]);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{posts.{{length}}} posts</p>
    </div>
  );
}`,
    language: 'tsx',
    blanks: [
      {
        id: 'promise_method',
        answers: ['Promise.all'],
        placeholder: 'método para ejecutar en paralelo',
      },
      {
        id: 'get_user',
        answers: ['getUser'],
        placeholder: 'función que obtiene el usuario',
      },
      {
        id: 'get_posts',
        answers: ['getPosts'],
        placeholder: 'función que obtiene los posts',
      },
      {
        id: 'length',
        answers: ['length'],
        placeholder: 'propiedad para contar elementos',
      },
    ],
    hint: 'Promise.all ejecuta múltiples promesas en paralelo. En Server Components puedes usar async/await directamente en el componente.',
  },
};
