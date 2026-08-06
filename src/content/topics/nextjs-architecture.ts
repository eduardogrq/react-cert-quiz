import type { Topic } from '../types';

export const nextjsArchitectureTopic: Topic = {
  id: 'nextjs-architecture',
  courseId: 'nextjs-16',
  title: 'Next.js 16+ Architecture: App Router y Server Components',
  realWorldAnalogy: {
    title: 'El edificio de oficinas con recepción',
    scenario:
      'Imagina un edificio de oficinas donde cada piso es un departamento. En la planta baja hay una recepción que prepara documentos completos para los visitantes. Algunos departamentos trabajan solo internamente (nunca ven al visitante), mientras otros tienen ventanillas interactivas donde el visitante puede escribir formularios y presionar botones.',
    mapping: [
      { everyday: 'El edificio completo', technical: 'App Router (la estructura de rutas)' },
      { everyday: 'Cada piso/departamento', technical: 'Route Segment (carpeta en app/)' },
      { everyday: 'La recepción que prepara documentos', technical: 'Server Component (renderiza en el servidor)' },
      { everyday: 'Las ventanillas interactivas', technical: 'Client Component (interactividad en el navegador)' },
      { everyday: 'Los documentos listos para entregar', technical: 'RSC Payload (resultado serializado del servidor)' },
      { everyday: 'El visitante leyendo y activando los formularios', technical: 'Hydration (React conecta interactividad al HTML)' },
    ],
    whereItBreaks:
      'En un edificio real, la recepción y las ventanillas están en el mismo lugar físico. En Next.js, el servidor y el navegador son máquinas distintas separadas por la red — el RSC Payload viaja entre ellas.',
  },
  keyTerms: [
    {
      term: 'App Router',
      definition: 'Sistema de enrutamiento basado en el sistema de archivos dentro de la carpeta app/, donde carpetas definen rutas y archivos especiales (page, layout, loading) definen la UI.',
      analogyHint: 'El plano del edificio que dice qué hay en cada piso.',
    },
    {
      term: 'Route Segment',
      definition: 'Cada carpeta dentro de app/ que corresponde a un segmento de la URL y puede contener su propio layout, loading state y error boundary.',
      analogyHint: 'Un piso del edificio con su propio departamento.',
    },
    {
      term: 'Server Component',
      definition: 'Componente que se ejecuta exclusivamente en el servidor, puede acceder directamente a bases de datos y APIs, y nunca envía su JavaScript al navegador.',
      analogyHint: 'La recepción que prepara todo sin que el visitante vea.',
    },
    {
      term: 'Client Component',
      definition: 'Componente marcado con "use client" que se ejecuta en el navegador y puede usar hooks de interactividad como useState y useEffect.',
      analogyHint: 'La ventanilla donde el visitante puede tocar y escribir.',
    },
    {
      term: 'Server Function',
      definition: 'Función marcada con "use server" que se ejecuta en el servidor y puede ser invocada desde Client Components como si fuera una llamada local.',
      analogyHint: 'Enviar un formulario a la recepción sin ir en persona.',
    },
    {
      term: 'Hydration',
      definition: 'Proceso donde React en el navegador conecta los event listeners y la interactividad al HTML estático que llegó del servidor.',
      analogyHint: 'El visitante activando los botones del documento impreso.',
    },
    {
      term: 'RSC Payload',
      definition: 'Formato binario serializado que el servidor envía al cliente con el resultado de renderizar Server Components, usado para actualizar el DOM sin perder estado del cliente.',
      analogyHint: 'El documento preparado por recepción que viaja al visitante.',
    },
    {
      term: 'Runtime',
      definition: 'El entorno de ejecución donde corren los Server Components: Node.js (completo, con acceso a filesystem) o Edge (ligero, baja latencia, con API limitada).',
      analogyHint: 'El tipo de oficina: una grande con todo o una sucursal rápida.',
    },
  ],
  summary:
    'Next.js 16+ usa el App Router para definir rutas mediante carpetas en app/. Los componentes son Server Components por defecto: se ejecutan en el servidor, acceden a datos directamente y envían solo HTML y RSC Payload al navegador. Los Client Components (marcados con "use client") agregan interactividad y pasan por Hydration. Las Server Functions ("use server") permiten ejecutar lógica del servidor desde el cliente. Todo corre sobre un Runtime que puede ser Node.js o Edge.',
  explanation: `## La arquitectura de Next.js 16+ como un edificio de oficinas

Volvamos a nuestro **edificio de oficinas con recepción**. La estructura del edificio (el App Router) determina qué hay en cada piso. Cada piso es un **Route Segment** — una carpeta dentro de \`app/\` que mapea directamente a un segmento de la URL.

## App Router: el plano del edificio

\`\`\`
app/
├── layout.tsx       ← layout raíz (la fachada del edificio)
├── page.tsx         ← ruta /
├── dashboard/
│   ├── layout.tsx   ← layout anidado (piso con su propia distribución)
│   ├── page.tsx     ← ruta /dashboard
│   └── settings/
│       └── page.tsx ← ruta /dashboard/settings
\`\`\`

Cada carpeta es un piso; cada \`page.tsx\` es la puerta de entrada a ese piso.

## Server Components: la recepción que trabaja internamente

Por defecto, **todo componente es un Server Component** — trabaja en la recepción sin que el visitante lo vea. Puede leer bases de datos, llamar APIs externas y preparar todo el HTML listo:

\`\`\`tsx
// app/dashboard/page.tsx — Server Component por defecto
async function DashboardPage() {
  const data = await db.query('SELECT * FROM metrics');
  return <MetricsGrid data={data} />;
}
\`\`\`

El visitante nunca ve la cocina interna; solo recibe el documento final.

## Client Components: las ventanillas interactivas

Cuando necesitas que el visitante **toque botones o escriba**, marcas el componente con \`"use client"\`:

\`\`\`tsx
'use client';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

Solo estos componentes envían JavaScript al navegador. El resto queda en el servidor.

## Server Functions: enviar formularios a la recepción

Las Server Functions (marcadas con \`"use server"\`) son como enviar un sobre a la recepción sin ir en persona. El Client Component las llama y el código se ejecuta en el servidor:

\`\`\`tsx
'use server';
export async function createPost(formData: FormData) {
  await db.insert({ title: formData.get('title') });
}
\`\`\`

## Hydration: activar la interactividad

El HTML llega estático al visitante — como un documento impreso. La **Hydration** es el momento donde React conecta los event listeners y convierte las ventanillas en interactivas. Solo aplica a Client Components.

## RSC Payload: el documento que viaja

El **RSC Payload** es el formato serializado que describe el resultado de los Server Components. No es HTML puro ni JSON — es un formato binario optimizado que React usa para reconstruir el árbol sin perder el estado de los Client Components que ya están activos.

## Runtime: tipo de oficina

El servidor puede correr en dos modalidades:
- **Node.js Runtime**: la oficina completa con acceso a filesystem, streams, y todas las APIs de Node.
- **Edge Runtime**: una sucursal ligera y rápida, más cerca del visitante, pero con APIs limitadas.

Se configura por ruta:
\`\`\`tsx
export const runtime = 'edge'; // o 'nodejs' (default)
\`\`\`
`,
  codeExamples: [
    {
      title: 'Estructura básica del App Router',
      language: 'tsx',
      code: `// app/layout.tsx — Layout raíz
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}`,
      description: 'El layout raíz envuelve todas las páginas. Es un Server Component por defecto.',
    },
    {
      title: 'Server Component con data fetching',
      language: 'tsx',
      code: `// app/products/page.tsx — Server Component
import { db } from '@/lib/db';

export default async function ProductsPage() {
  const products = await db.product.findMany();

  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name} - \${p.price}</li>
      ))}
    </ul>
  );
}`,
      description: 'Los Server Components pueden ser async y acceder directamente a la base de datos.',
    },
    {
      title: 'Client Component con interactividad',
      language: 'tsx',
      code: `'use client';
import { useState } from 'react';

export function SearchFilter({ initialItems }: { initialItems: string[] }) {
  const [query, setQuery] = useState('');
  const filtered = initialItems.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>{filtered.map(item => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}`,
      description: 'Se marca con "use client" porque usa useState para manejar input del usuario.',
    },
    {
      title: 'Server Function invocada desde un formulario',
      language: 'tsx',
      code: `// app/actions.ts
'use server';

export async function subscribe(formData: FormData) {
  const email = formData.get('email') as string;
  await db.subscriber.create({ data: { email } });
}

// app/newsletter/page.tsx
import { subscribe } from '../actions';

export default function NewsletterPage() {
  return (
    <form action={subscribe}>
      <input name="email" type="email" required />
      <button type="submit">Suscribirse</button>
    </form>
  );
}`,
      description: 'La Server Function se ejecuta en el servidor cuando el formulario se envía.',
    },
    {
      title: 'Configurar Edge Runtime por ruta',
      language: 'ts',
      code: `// app/api/geo/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country');
  return Response.json({ country });
}`,
      description: 'Edge Runtime ofrece menor latencia pero APIs limitadas comparado con Node.js.',
    },
  ],
  pitfalls: [
    'Intentar usar useState o useEffect en un Server Component — causará un error porque estos hooks solo funcionan en Client Components.',
    'Olvidar "use client" al tope del archivo — sin esta directiva, el componente se tratará como Server Component y fallará si usa hooks de interactividad.',
    'Pasar funciones no serializables (callbacks, clases) como props de un Server Component a un Client Component — el RSC Payload solo puede transportar datos serializables.',
    'Pensar que "use client" convierte TODO el subárbol en cliente — solo marca la frontera; los hijos pueden seguir siendo Server Components si se pasan como children.',
    'Usar "use server" dentro de un Client Component para definir Server Functions — "use server" va en archivos separados o al inicio de funciones async, no como directiva de módulo en un Client Component.',
    'Asumir que Edge Runtime tiene todas las APIs de Node.js — APIs como fs, child_process o crypto.randomBytes no están disponibles en Edge.',
    'No entender que Hydration requiere que el HTML del servidor coincida con el render inicial del cliente — un mismatch causa errores de hidratación.',
  ],
  cheatSheet: [
    'App Router: carpetas en app/ = segmentos de URL. page.tsx = ruta accesible.',
    'Server Component = default. No envía JS al navegador. Puede ser async.',
    'Client Component = "use client" al tope. Necesario para hooks interactivos.',
    'Server Function = "use server". Se llama desde el cliente, corre en el servidor.',
    'RSC Payload = formato binario que transporta el resultado del servidor al cliente.',
    'Hydration = React conecta event listeners al HTML estático. Solo Client Components.',
    'Runtime: Node.js (completo) vs Edge (ligero, rápido, limitado).',
    'Props Server→Client deben ser serializables (no funciones, no clases).',
    'layout.tsx persiste entre navegaciones; page.tsx se re-renderiza.',
    '"use client" marca la frontera, no infecta todo el subárbol.',
  ],
  flashcards: [
    {
      id: 'next-arch-fc-1',
      front: '¿Qué tipo de componente es por defecto en el App Router de Next.js 16+?',
      back: 'Server Component. No necesita ninguna directiva especial — se ejecuta en el servidor y no envía JavaScript al navegador.',
    },
    {
      id: 'next-arch-fc-2',
      front: '¿Qué directiva necesitas para crear un Client Component?',
      back: '"use client" al inicio del archivo. Esto le indica a Next.js que el componente necesita ejecutarse en el navegador con interactividad.',
    },
    {
      id: 'next-arch-fc-3',
      front: '¿Qué es el RSC Payload?',
      back: 'Es un formato binario serializado que el servidor envía al cliente con el resultado de renderizar Server Components. React lo usa para actualizar el DOM sin perder el estado de los Client Components activos.',
    },
    {
      id: 'next-arch-fc-4',
      front: 'En la analogía del edificio de oficinas, ¿qué representa la recepción que prepara documentos?',
      back: 'Los Server Components: trabajan internamente (en el servidor), preparan todo el contenido y entregan el resultado listo al visitante (navegador) sin exponer su lógica interna.',
      usesAnalogy: true,
    },
    {
      id: 'next-arch-fc-5',
      front: '¿Qué es Hydration y cuándo ocurre?',
      back: 'Es el proceso donde React en el navegador conecta los event listeners y la interactividad al HTML estático que llegó del servidor. Solo ocurre para Client Components.',
    },
    {
      id: 'next-arch-fc-6',
      front: '¿Cuál es la diferencia entre el Node.js Runtime y el Edge Runtime?',
      back: 'Node.js Runtime tiene acceso completo a todas las APIs (filesystem, streams, etc.). Edge Runtime es más ligero y rápido (baja latencia) pero tiene APIs limitadas — no soporta fs, child_process, ni algunas APIs de crypto.',
    },
    {
      id: 'next-arch-fc-7',
      front: '¿Qué es una Server Function y cómo se marca?',
      back: 'Es una función async que se ejecuta en el servidor pero puede ser invocada desde Client Components. Se marca con la directiva "use server" al inicio del archivo o de la función.',
    },
    {
      id: 'next-arch-fc-8',
      front: '¿Qué tipo de datos puedes pasar como props de un Server Component a un Client Component?',
      back: 'Solo datos serializables: strings, números, booleanos, arrays, objetos planos, Date, Map, Set, y Server Functions. NO puedes pasar funciones regulares, clases, ni instancias complejas.',
    },
  ],
  quiz: [
    {
      id: 'next-arch-q-1',
      question: 'En la analogía del edificio de oficinas, ¿qué representan las ventanillas interactivas donde el visitante puede escribir y presionar botones?',
      options: [
        { id: 'next-arch-q-1-a', text: 'Server Components' },
        { id: 'next-arch-q-1-b', text: 'Client Components' },
        { id: 'next-arch-q-1-c', text: 'Route Segments' },
        { id: 'next-arch-q-1-d', text: 'Server Functions' },
      ],
      correctOptionId: 'next-arch-q-1-b',
      explanation: 'Las ventanillas interactivas representan los Client Components porque son el punto donde el visitante (usuario en el navegador) puede interactuar directamente: escribir en inputs, presionar botones, etc.',
      whyOthersAreWrong: {
        'next-arch-q-1-a': 'Los Server Components son la recepción interna — preparan documentos sin interacción directa del visitante.',
        'next-arch-q-1-c': 'Los Route Segments son los pisos del edificio — la estructura organizativa, no los puntos de interacción.',
        'next-arch-q-1-d': 'Las Server Functions son como enviar un sobre a la recepción — comunicación indirecta, no una ventanilla presencial.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-arch-q-2',
      question: '¿Cuál es el comportamiento por defecto de un componente en el App Router de Next.js 16+?',
      options: [
        { id: 'next-arch-q-2-a', text: 'Es un Client Component que se ejecuta en el navegador' },
        { id: 'next-arch-q-2-b', text: 'Es un Server Component que se ejecuta en el servidor' },
        { id: 'next-arch-q-2-c', text: 'Es un componente híbrido que corre en ambos entornos' },
        { id: 'next-arch-q-2-d', text: 'Depende de si usa hooks o no — Next.js lo detecta automáticamente' },
      ],
      correctOptionId: 'next-arch-q-2-b',
      explanation: 'En el App Router, todos los componentes son Server Components por defecto. Solo se convierten en Client Components si se marca explícitamente con "use client".',
      whyOthersAreWrong: {
        'next-arch-q-2-a': 'Para que sea Client Component necesitas la directiva explícita "use client" — no es el comportamiento por defecto.',
        'next-arch-q-2-c': 'No existe un modo "híbrido" automático. Un componente es servidor O cliente, determinado por la directiva.',
        'next-arch-q-2-d': 'Next.js NO detecta automáticamente si debe ser cliente o servidor. Sin "use client" explícito, siempre será Server Component y fallará si usa hooks de interactividad.',
      },
    },
    {
      id: 'next-arch-q-3',
      question: '¿Qué ocurre si intentas usar useState dentro de un Server Component?',
      options: [
        { id: 'next-arch-q-3-a', text: 'Funciona normalmente pero el estado no persiste entre requests' },
        { id: 'next-arch-q-3-b', text: 'Next.js lo convierte automáticamente a Client Component' },
        { id: 'next-arch-q-3-c', text: 'Se produce un error en tiempo de compilación/ejecución' },
        { id: 'next-arch-q-3-d', text: 'El hook se ignora silenciosamente y devuelve undefined' },
      ],
      correctOptionId: 'next-arch-q-3-c',
      explanation: 'useState es un hook de interactividad que solo funciona en Client Components. Usarlo en un Server Component produce un error porque el servidor no puede mantener estado interactivo del usuario.',
      whyOthersAreWrong: {
        'next-arch-q-3-a': 'No funciona de ninguna manera — useState requiere el runtime del navegador con Hydration.',
        'next-arch-q-3-b': 'Next.js nunca convierte automáticamente un componente. La directiva "use client" debe ser explícita.',
        'next-arch-q-3-d': 'React no ignora el error — lanza una excepción clara indicando que los hooks no son válidos en Server Components.',
      },
    },
    {
      id: 'next-arch-q-4',
      question: '¿Cuál de las siguientes afirmaciones sobre el RSC Payload es correcta?',
      options: [
        { id: 'next-arch-q-4-a', text: 'Es HTML puro que se inyecta directamente en el DOM' },
        { id: 'next-arch-q-4-b', text: 'Es un formato serializado que React usa para reconstruir el árbol sin perder estado del cliente' },
        { id: 'next-arch-q-4-c', text: 'Es un bundle de JavaScript que contiene el código de los Server Components' },
        { id: 'next-arch-q-4-d', text: 'Es un archivo JSON con los props de todos los componentes de la página' },
      ],
      correctOptionId: 'next-arch-q-4-b',
      explanation: 'El RSC Payload es un formato binario optimizado que transporta el resultado de renderizar Server Components. React lo usa para actualizar el DOM preservando el estado de los Client Components que ya están activos.',
      whyOthersAreWrong: {
        'next-arch-q-4-a': 'No es HTML puro — es un formato especial de React que incluye información del árbol de componentes, no solo markup.',
        'next-arch-q-4-c': 'Los Server Components nunca envían su código JavaScript al navegador — esa es precisamente su ventaja.',
        'next-arch-q-4-d': 'No es JSON simple — es un formato binario streaming optimizado para React, más eficiente que JSON.',
      },
    },
    {
      id: 'next-arch-q-5',
      question: '¿Qué directiva se usa para definir una Server Function?',
      options: [
        { id: 'next-arch-q-5-a', text: '"use client"' },
        { id: 'next-arch-q-5-b', text: '"use server"' },
        { id: 'next-arch-q-5-c', text: '"server-only"' },
        { id: 'next-arch-q-5-d', text: 'export const runtime = "server"' },
      ],
      correctOptionId: 'next-arch-q-5-b',
      explanation: 'La directiva "use server" marca funciones async que se ejecutan en el servidor pero pueden ser invocadas desde Client Components. Se coloca al inicio del archivo o de la función.',
      whyOthersAreWrong: {
        'next-arch-q-5-a': '"use client" marca Client Components — es lo opuesto, indica que el código corre en el navegador.',
        'next-arch-q-5-c': '"server-only" es un paquete que previene importar código de servidor en el cliente, pero no define Server Functions.',
        'next-arch-q-5-d': 'export const runtime configura el runtime de ejecución (Node.js vs Edge), no define Server Functions.',
      },
    },
    {
      id: 'next-arch-q-6',
      question: '¿Cuál es la principal limitación del Edge Runtime comparado con el Node.js Runtime?',
      options: [
        { id: 'next-arch-q-6-a', text: 'No puede servir HTML, solo JSON' },
        { id: 'next-arch-q-6-b', text: 'No soporta Server Components' },
        { id: 'next-arch-q-6-c', text: 'Tiene APIs limitadas — no incluye filesystem, child_process ni todas las APIs de crypto' },
        { id: 'next-arch-q-6-d', text: 'Solo puede manejar una request a la vez' },
      ],
      correctOptionId: 'next-arch-q-6-c',
      explanation: 'El Edge Runtime es un entorno ligero optimizado para baja latencia. Su principal limitación es que no incluye todas las APIs de Node.js — específicamente filesystem (fs), child_process, y algunas APIs criptográficas.',
      whyOthersAreWrong: {
        'next-arch-q-6-a': 'Edge Runtime puede servir cualquier tipo de respuesta: HTML, JSON, streams, etc.',
        'next-arch-q-6-b': 'Edge Runtime sí soporta Server Components — solo las APIs de Node.js que usa el componente determinan si es compatible.',
        'next-arch-q-6-d': 'Edge Runtime maneja múltiples requests concurrentes — de hecho es altamente concurrente por diseño.',
      },
    },
    {
      id: 'next-arch-q-7',
      question: '¿Qué sucede durante el proceso de Hydration?',
      options: [
        { id: 'next-arch-q-7-a', text: 'El servidor envía datos frescos para actualizar componentes obsoletos' },
        { id: 'next-arch-q-7-b', text: 'React en el navegador conecta event listeners al HTML estático del servidor' },
        { id: 'next-arch-q-7-c', text: 'El navegador descarga los Server Components para ejecutarlos localmente' },
        { id: 'next-arch-q-7-d', text: 'Next.js comprime el JavaScript para reducir el tamaño del bundle' },
      ],
      correctOptionId: 'next-arch-q-7-b',
      explanation: 'Hydration es el proceso donde React en el navegador toma el HTML estático generado por el servidor y le "da vida" conectando event listeners, haciendo los botones clickeables y los inputs editables.',
      whyOthersAreWrong: {
        'next-arch-q-7-a': 'Hydration no es sobre datos frescos — es sobre conectar interactividad al HTML que ya existe.',
        'next-arch-q-7-c': 'Los Server Components nunca se descargan ni ejecutan en el navegador — ese es su propósito principal.',
        'next-arch-q-7-d': 'La compresión de bundles es un paso del build, no tiene relación con Hydration.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 25,
  tags: ['next.js', 'app-router', 'server-components', 'client-components', 'architecture', 'hydration', 'rsc'],
  codeChallenge: {
    instruction: 'Completa el Server Component y el Client Component con sus directivas correctas.',
    template: `// app/page.tsx (Server Component — no directive needed)
export default async function Page() {
  const data = await {{fetch_call}}('/api/posts');
  return <PostList posts={data} />;
}

// components/LikeButton.tsx (Client Component)
'{{client_directive}}';

import { {{state_hook}} } from 'react';

export function LikeButton() {
  const [liked, setLiked] = {{state_hook}}(false);
  return <button onClick={() => setLiked(!liked)}>♥</button>;
}`,
    language: 'tsx',
    blanks: [
      { id: 'fetch_call', answers: ['fetch'], placeholder: '???' },
      { id: 'client_directive', answers: ['use client'], placeholder: 'directive' },
      { id: 'state_hook', answers: ['useState'], placeholder: 'hook' },
    ],
    hint: 'Los Server Components pueden usar await directamente. Los Client Components necesitan la directiva "use client" para usar hooks.',
  },
};
