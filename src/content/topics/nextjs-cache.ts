import type { Topic } from '../types';

export const nextjsCacheTopic: Topic = {
  id: 'nextjs-cache',
  courseId: 'nextjs-16',
  title: 'Cache & Revalidation en Next.js',
  realWorldAnalogy: {
    title: 'La biblioteca con fotocopias y estantes',
    scenario:
      'Una biblioteca tiene un sistema para no buscar el mismo libro en el almacen cada vez que alguien lo pide. Cuando un libro se solicita, el bibliotecario hace una fotocopia y la guarda en un estante rapido cerca del mostrador. Si alguien pide ese libro otra vez, entrega la fotocopia al instante. Pero si el autor publica una edicion nueva, el bibliotecario descarta la fotocopia vieja y trae la version actualizada del almacen.',
    mapping: [
      { everyday: 'El almacen lejano con los libros originales', technical: 'El origen de datos (base de datos, API externa)' },
      { everyday: 'La fotocopia en el estante rapido', technical: 'Data Cache — respuesta guardada en el servidor' },
      { everyday: 'El estante organizado por seccion', technical: 'Full Route Cache — pagina HTML pre-renderizada' },
      { everyday: 'La nota mental del lector frecuente', technical: 'Router Cache — cache del navegador en memoria' },
      { everyday: 'El autor publica edicion nueva y avisa', technical: 'revalidateTag() / revalidatePath() — invalidacion on-demand' },
      { everyday: '"Renueva la fotocopia cada 24 horas"', technical: 'cacheLife() — revalidacion basada en tiempo' },
    ],
    whereItBreaks:
      'En una biblioteca real, una fotocopia no puede "expirar sola". En Next.js el Data Cache puede auto-invalidarse por tiempo (time-based revalidation) sin intervención humana.',
  },
  keyTerms: [
    {
      term: 'Data Cache',
      definition: 'Cache persistente del servidor que almacena respuestas de fetch y resultados de funciones con "use cache". Sobrevive entre deploys hasta ser revalidado.',
      analogyHint: 'La fotocopia guardada en el estante rapido de la biblioteca.',
    },
    {
      term: 'Full Route Cache',
      definition: 'HTML y RSC Payload pre-renderizado en build time para rutas estaticas. Evita re-renderizar en cada request.',
      analogyHint: 'La seccion completa del estante con todos los libros de un tema.',
    },
    {
      term: 'Router Cache',
      definition: 'Cache en memoria del navegador que almacena RSC Payloads de rutas visitadas durante la sesion del usuario.',
      analogyHint: 'La nota mental del lector que recuerda donde estaba un libro.',
    },
    {
      term: '"use cache"',
      definition: 'Directiva que marca una funcion, componente o ruta completa para ser cacheada en el servidor. Reemplaza el antiguo unstable_cache.',
      analogyHint: 'La instruccion "haz fotocopia de esto para el estante rapido".',
    },
    {
      term: 'cacheLife()',
      definition: 'Funcion que define la duracion del cache dentro de un bloque "use cache". Acepta perfiles predefinidos o configuracion custom con stale/revalidate/expire.',
      analogyHint: '"Renueva esta fotocopia cada 24 horas automaticamente".',
    },
    {
      term: 'cacheTag()',
      definition: 'Asigna etiquetas a una entrada de cache para poder invalidarla selectivamente con revalidateTag().',
      analogyHint: 'La etiqueta pegada a la fotocopia: "Seccion: Fisica, Autor: Newton".',
    },
    {
      term: 'revalidatePath()',
      definition: 'Invalida el cache de una ruta especifica, forzando re-renderizado en la proxima visita.',
      analogyHint: '"Descarta todas las fotocopias de la seccion de Historia".',
    },
    {
      term: 'revalidateTag()',
      definition: 'Invalida todas las entradas de cache marcadas con un tag especifico.',
      analogyHint: '"Descarta todo lo que tenga la etiqueta Autor: Newton".',
    },
    {
      term: 'Time-based Revalidation',
      definition: 'Estrategia que sirve contenido cacheado hasta que pasa un tiempo definido, luego regenera en background (stale-while-revalidate).',
      analogyHint: '"Cada 60 minutos, trae una copia fresca del almacen".',
    },
    {
      term: 'On-demand Revalidation',
      definition: 'Invalidacion manual del cache disparada por un evento (webhook, form action, etc.) usando revalidateTag/revalidatePath.',
      analogyHint: 'El autor llama a la biblioteca: "Saque la version vieja, ya hay nueva".',
    },
  ],
  summary:
    'Next.js 16 tiene un sistema de cache en multiples capas: Data Cache (servidor, persistente), Full Route Cache (HTML pre-renderizado), y Router Cache (navegador, por sesion). La directiva "use cache" marca funciones y componentes para cachear. cacheLife() controla la duracion, cacheTag() permite etiquetar entradas, y revalidateTag()/revalidatePath() invalidan bajo demanda. Dominar estas capas es fundamental para construir apps rapidas que sirvan contenido fresco cuando importa.',
  explanation: `## La biblioteca y su sistema de fotocopias

Imagina que tu aplicacion Next.js es una **biblioteca**. Cada vez que un visitante pide informacion (una pagina), el bibliotecario podria ir al almacen lejano (base de datos/API) a buscar el libro original. Pero eso es lento. En cambio, la biblioteca tiene un sistema inteligente de **fotocopias en estantes rapidos**.

---

## Las tres capas de cache

### 1. Data Cache (la fotocopia en el estante)

Es el cache mas fundamental. Cuando usas \`"use cache"\` o \`fetch\`, Next.js guarda el resultado en un almacenamiento persistente del servidor. Este cache **sobrevive entre requests y deploys** hasta que lo invalidas explicitamente.

\`\`\`tsx
async function getProducts() {
  "use cache"
  cacheLife("hours")
  const products = await db.query("SELECT * FROM products")
  return products
}
\`\`\`

### 2. Full Route Cache (la seccion completa del estante)

Para rutas estaticas, Next.js guarda el **HTML completo y el RSC Payload** en build time. Cuando un usuario visita \`/productos\`, recibe la pagina pre-construida sin ejecutar codigo del servidor. Es como tener la seccion entera de "Productos" lista en el estante.

### 3. Router Cache (la nota mental del lector)

El navegador guarda en memoria las rutas que el usuario ya visito durante la sesion. Si navegas de \`/inicio\` a \`/productos\` y vuelves a \`/inicio\`, el Router Cache sirve la version guardada instantaneamente. Se invalida al refrescar la pagina o cuando el servidor indica que hay datos frescos.

---

## La directiva "use cache"

Es la forma moderna (Next.js 15+) de declarar que algo debe cachearse. Puede usarse a nivel de:

- **Funcion**: cachea el resultado de una funcion async
- **Componente**: cachea el output renderizado de un Server Component
- **Archivo completo**: \`"use cache"\` al inicio del archivo cachea toda la ruta

\`\`\`tsx
// Nivel funcion
async function getUser(id: string) {
  "use cache"
  cacheTag(\`user-\${id}\`)
  cacheLife("days")
  return await db.user.findUnique({ where: { id } })
}

// Nivel componente
async function UserProfile({ id }: { id: string }) {
  "use cache"
  cacheTag(\`user-profile-\${id}\`)
  const user = await getUser(id)
  return <div>{user.name}</div>
}
\`\`\`

---

## Control de duracion con cacheLife()

\`cacheLife()\` define cuanto tiempo vive una entrada en cache. Acepta perfiles predefinidos o configuracion custom:

**Perfiles predefinidos:**
- \`"seconds"\` — stale: 0, revalidate: 1s, expire: 60s
- \`"minutes"\` — stale: 5min, revalidate: 1min, expire: 1h
- \`"hours"\` — stale: 5min, revalidate: 1h, expire: 1 dia
- \`"days"\` — stale: 5min, revalidate: 1 dia, expire: 1 semana
- \`"weeks"\` — stale: 5min, revalidate: 1 semana, expire: 30 dias
- \`"max"\` — cache indefinido

**Configuracion custom:**
\`\`\`tsx
cacheLife({ stale: 300, revalidate: 3600, expire: 86400 })
\`\`\`

Los tres valores significan:
- **stale**: segundos que el cliente puede usar el cache sin verificar frescura
- **revalidate**: frecuencia de regeneracion en background en el servidor
- **expire**: tiempo maximo absoluto antes de que la entrada sea eliminada

Volviendo a la analogia: \`stale\` es cuanto tiempo el lector confia en su nota mental, \`revalidate\` es cada cuanto el bibliotecario trae una fotocopia nueva del almacen, y \`expire\` es cuando la fotocopia se descarta aunque nadie haya pedido una nueva.

---

## Etiquetado con cacheTag()

Para invalidar cache de forma precisa, etiquetas tus entradas:

\`\`\`tsx
async function getPost(slug: string) {
  "use cache"
  cacheTag("posts", \`post-\${slug}\`)
  cacheLife("days")
  return await db.post.findUnique({ where: { slug } })
}
\`\`\`

Asi puedes invalidar un post especifico con \`revalidateTag(\`post-\${slug}\`)\` o TODOS los posts con \`revalidateTag("posts")\`. Es como etiquetar fotocopias con "Seccion: Fisica" y "Autor: Newton" — puedes descartar por seccion o por autor.

---

## Revalidacion on-demand

Cuando un evento externo cambia los datos (un CMS publica, un usuario edita su perfil), usas revalidacion on-demand:

\`\`\`tsx
"use server"
import { revalidateTag, revalidatePath } from "next/cache"

async function publishPost(slug: string) {
  await db.post.update({ where: { slug }, data: { published: true } })
  revalidateTag(\`post-\${slug}\`) // invalida solo este post
  revalidatePath("/blog")         // invalida la pagina del blog
}
\`\`\`

Es como si el autor llamara a la biblioteca: "Saque la fotocopia vieja de mi libro, acabo de publicar una edicion nueva".

---

## Revalidacion basada en tiempo

Con \`cacheLife()\` defines la frecuencia automatica. Next.js usa un modelo **stale-while-revalidate**: sirve la version cacheada al usuario actual y regenera en background para el siguiente.

---

## Cache Opt-out (cuando NO quieres cache)

Hay situaciones donde necesitas datos frescos en cada request:

- \`connection()\` de \`next/server\` — opta la ruta fuera del cache
- \`cookies()\`, \`headers()\` — funciones dinamicas que optan fuera automaticamente
- \`noStore()\` de \`next/cache\` — marca explicitamente que no se cache un fetch
- En fetch: \`fetch(url, { cache: "no-store" })\`

Estas son las situaciones donde le dices al bibliotecario: "No guardes fotocopia de esto, siempre ve al almacen".

---

## Resumen de estrategias

| Necesidad | Herramienta |
|-----------|------------|
| Cachear resultado de funcion | \`"use cache"\` + \`cacheLife()\` |
| Invalidar por evento | \`revalidateTag()\` / \`revalidatePath()\` |
| Renovar periodicamente | \`cacheLife("hours")\` |
| No cachear nunca | \`connection()\` / \`noStore()\` |
| Etiquetar para invalidacion | \`cacheTag()\` |
`,
  codeExamples: [
    {
      title: '"use cache" con cacheLife y cacheTag',
      language: 'tsx',
      code: `async function getProducts(category: string) {
  "use cache"
  cacheTag("products", \`category-\${category}\`)
  cacheLife("hours")

  const products = await db.product.findMany({
    where: { category },
  })
  return products
}`,
      description: 'Funcion cacheada con etiquetas para invalidacion selectiva y duracion de horas.',
    },
    {
      title: 'Revalidacion on-demand en Server Action',
      language: 'tsx',
      code: `"use server"

import { revalidateTag, revalidatePath } from "next/cache"

export async function updateProduct(id: string, data: ProductData) {
  await db.product.update({ where: { id }, data })

  // Invalida el cache de este producto especifico
  revalidateTag(\`product-\${id}\`)
  // Invalida la pagina del catalogo
  revalidatePath("/catalogo")
}`,
      description: 'Server Action que actualiza datos e invalida el cache relevante.',
    },
    {
      title: '"use cache" a nivel de ruta completa',
      language: 'tsx',
      code: `// app/blog/[slug]/page.tsx
"use cache"

import { cacheLife, cacheTag } from "next/cache"

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  cacheTag(\`post-\${slug}\`)
  cacheLife("days")

  const post = await getPost(slug)
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}`,
      description: 'Ruta completa cacheada con "use cache" al inicio del archivo. Toda la pagina se sirve desde cache.',
    },
    {
      title: 'Cache opt-out con connection()',
      language: 'tsx',
      code: `import { connection } from "next/server"

export default async function DashboardPage() {
  // Opta fuera del cache — siempre datos frescos
  await connection()

  const stats = await getRealtimeStats()
  return <Dashboard stats={stats} />
}`,
      description: 'Usar connection() para forzar renderizado dinamico sin cache.',
    },
    {
      title: 'cacheLife con configuracion custom',
      language: 'tsx',
      code: `import { cacheLife, cacheTag } from "next/cache"

async function getExchangeRates() {
  "use cache"
  cacheTag("exchange-rates")
  cacheLife({
    stale: 60,       // cliente confia 1 min
    revalidate: 300, // regenera en background cada 5 min
    expire: 3600,    // elimina del cache despues de 1 hora
  })

  return await fetch("https://api.exchange.com/rates").then(r => r.json())
}`,
      description: 'Configuracion custom de cacheLife con stale, revalidate y expire explicitos.',
    },
    {
      title: 'Revalidacion desde Route Handler (webhook)',
      language: 'tsx',
      code: `// app/api/webhook/cms/route.ts
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { type, slug } = await request.json()

  if (type === "post.updated") {
    revalidateTag(\`post-\${slug}\`)
    revalidateTag("posts-list")
  }

  return NextResponse.json({ revalidated: true })
}`,
      description: 'Route Handler que recibe webhook de un CMS y revalida tags especificos.',
    },
  ],
  pitfalls: [
    '"use cache" solo funciona en Server Components y funciones del servidor — no puedes usarlo en Client Components ni en funciones ejecutadas en el navegador.',
    'cacheTag() y cacheLife() DEBEN llamarse dentro de un bloque "use cache". Si las llamas fuera, Next.js lanzara un error.',
    'Los argumentos pasados a funciones con "use cache" se serializan como parte de la cache key. Objetos complejos o funciones no son serializables y causaran errores.',
    'revalidatePath() invalida TODA la ruta, incluyendo todos los componentes cacheados en esa pagina. Usa revalidateTag() para invalidacion mas granular.',
    'El Router Cache del navegador puede mostrar datos stale despues de un revalidateTag() del servidor. El usuario debe navegar (no solo refrescar) para ver cambios en algunos casos.',
    'No confundir cache: "no-store" de fetch con el opt-out completo de ruta. Una funcion dinamica (cookies(), headers()) opta TODA la ruta fuera del Full Route Cache.',
    'Si multiples funciones "use cache" tienen diferentes cacheLife(), cada una se revalida independientemente. La pagina puede tener secciones con frescura diferente.',
    'cacheLife("max") cachea indefinidamente — solo se invalida con revalidateTag(). Si olvidas etiquetar con cacheTag(), no podras invalidar esa entrada.',
    'revalidateTag() no borra el cache inmediatamente en todos los edge nodes. Hay un breve periodo de propagacion donde algunos usuarios pueden ver datos stale.',
    'connection() es async y DEBE ser awaited. Si no lo awaiteas, la ruta puede cachearse parcialmente de forma impredecible.',
    'Los parametros dinamicos de ruta ([slug]) no invalidan automaticamente el cache. Debes etiquetar explicitamente con cacheTag() si quieres invalidar rutas especificas.',
  ],
  cheatSheet: [
    '"use cache" — directiva para cachear funciones, componentes o rutas enteras en el servidor',
    'cacheLife("hours") — define duracion del cache con perfiles: seconds, minutes, hours, days, weeks, max',
    'cacheLife({ stale, revalidate, expire }) — control granular de duracion del cache',
    'cacheTag("nombre") — etiqueta una entrada de cache para invalidacion selectiva',
    'revalidateTag("nombre") — invalida todas las entradas con ese tag (on-demand)',
    'revalidatePath("/ruta") — invalida el Full Route Cache de una ruta especifica',
    'connection() — opta una ruta fuera del cache (siempre dinamica)',
    'noStore() — marca que un fetch no debe cachearse',
    'cookies()/headers() — funciones dinamicas que optan la ruta fuera del cache automaticamente',
    'Data Cache = servidor, persistente entre deploys | Full Route Cache = HTML pre-renderizado | Router Cache = navegador, por sesion',
    'Stale-while-revalidate: sirve cacheado al usuario actual, regenera en background para el siguiente',
    'Los argumentos de una funcion "use cache" forman parte de la cache key — diferentes args = diferentes entradas',
    'revalidateTag() se usa en Server Actions y Route Handlers, nunca en Client Components',
    '"use cache" al inicio del archivo = toda la ruta se cachea como unidad',
  ],
  flashcards: [
    {
      id: 'next-cache-fc-1',
      front: 'Que hace la directiva "use cache" en Next.js 16?',
      back: 'Marca una funcion, componente o ruta para ser cacheada en el servidor. Next.js almacena el resultado y lo sirve en requests posteriores sin re-ejecutar el codigo, hasta que se invalida con revalidateTag/revalidatePath o expira segun cacheLife().',
    },
    {
      id: 'next-cache-fc-2',
      front: 'En la analogia de la biblioteca, que representa la "fotocopia en el estante rapido"?',
      back: 'Representa el Data Cache: la respuesta almacenada en el servidor que se entrega instantaneamente sin ir al origen de datos (el "almacen lejano"). Persiste hasta que se invalida o expira.',
      usesAnalogy: true,
    },
    {
      id: 'next-cache-fc-3',
      front: 'Cual es la diferencia entre revalidateTag() y revalidatePath()?',
      back: 'revalidateTag() invalida TODAS las entradas marcadas con un tag especifico (puede afectar multiples rutas). revalidatePath() invalida el cache completo de UNA ruta especifica (HTML + todos los datos de esa pagina).',
    },
    {
      id: 'next-cache-fc-4',
      front: 'Que significan los tres valores de cacheLife({ stale, revalidate, expire })?',
      back: 'stale: segundos que el cliente puede usar cache sin verificar frescura. revalidate: frecuencia de regeneracion en background en el servidor. expire: tiempo maximo absoluto antes de eliminar la entrada del cache completamente.',
    },
    {
      id: 'next-cache-fc-5',
      front: 'Cuales son las tres capas de cache en Next.js?',
      back: '1) Data Cache — servidor, persistente, almacena resultados de fetch/"use cache". 2) Full Route Cache — HTML y RSC Payload pre-renderizado en build. 3) Router Cache — navegador, en memoria, almacena rutas visitadas en la sesion.',
    },
    {
      id: 'next-cache-fc-6',
      front: 'En la analogia, que representa "el autor llama a la biblioteca para avisar de una nueva edicion"?',
      back: 'Representa la revalidacion on-demand (revalidateTag/revalidatePath). Un evento externo (webhook, Server Action) avisa a Next.js que los datos cambiaron y debe descartar el cache viejo y regenerar con datos frescos.',
      usesAnalogy: true,
    },
    {
      id: 'next-cache-fc-7',
      front: 'Como optas una ruta fuera del cache en Next.js 16?',
      back: 'Usando await connection() de next/server, o llamando funciones dinamicas como cookies() o headers(). Tambien puedes usar noStore() en fetches individuales. Cualquiera de estas senales convierte la ruta en completamente dinamica.',
    },
    {
      id: 'next-cache-fc-8',
      front: 'Que pasa si usas "use cache" sin cacheTag()?',
      back: 'La entrada se cachea pero NO se puede invalidar selectivamente con revalidateTag(). Solo se puede invalidar con revalidatePath() (la ruta completa) o esperando a que expire segun cacheLife(). Es un error comun que deja datos stale sin forma facil de actualizarlos.',
    },
    {
      id: 'next-cache-fc-9',
      front: 'Donde pueden usarse cacheTag() y cacheLife()?',
      back: 'SOLO dentro de un bloque "use cache" (funcion, componente o archivo con la directiva). Si se llaman fuera de ese contexto, Next.js lanza un error en tiempo de ejecucion.',
    },
    {
      id: 'next-cache-fc-10',
      front: 'Que es el modelo stale-while-revalidate en el contexto de Next.js?',
      back: 'Next.js sirve la version cacheada (stale) al usuario actual para una respuesta instantanea, y en background regenera los datos para que el SIGUIENTE usuario reciba la version fresca. Combina velocidad con frescura.',
    },
  ],
  quiz: [
    {
      id: 'next-cache-q-1',
      question: 'En la analogia de la biblioteca, que capa de cache representa "la nota mental del lector frecuente que recuerda donde estaba un libro"?',
      options: [
        { id: 'a', text: 'Data Cache' },
        { id: 'b', text: 'Full Route Cache' },
        { id: 'c', text: 'Router Cache' },
        { id: 'd', text: 'Build Cache' },
      ],
      correctOptionId: 'c',
      explanation: 'El Router Cache es la cache en memoria del navegador que recuerda rutas ya visitadas durante la sesion, igual que el lector recuerda mentalmente donde encontro un libro sin necesidad de preguntar al bibliotecario.',
      whyOthersAreWrong: {
        a: 'El Data Cache es la fotocopia en el estante (cache persistente del servidor), no la memoria del lector.',
        b: 'El Full Route Cache es la seccion completa del estante (HTML pre-renderizado), almacenado en el servidor.',
        d: 'Build Cache no es una capa oficial de cache en Next.js.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-cache-q-2',
      question: 'Cual es la forma correcta de cachear una funcion con duracion de horas y un tag para invalidacion?',
      options: [
        { id: 'a', text: '"use cache"\\ncacheLife("hours")\\ncacheTag("productos")' },
        { id: 'b', text: 'export const revalidate = 3600' },
        { id: 'c', text: 'fetch(url, { next: { revalidate: 3600, tags: ["productos"] } })' },
        { id: 'd', text: 'cacheLife("hours")\\ncacheTag("productos") // sin "use cache"' },
      ],
      correctOptionId: 'a',
      explanation: 'En Next.js 16, la directiva "use cache" es obligatoria para habilitar el caching. Dentro de ese bloque, cacheLife() define la duracion y cacheTag() permite invalidacion selectiva.',
      whyOthersAreWrong: {
        b: 'export const revalidate es el modelo antiguo (route segment config). "use cache" con cacheLife() es el enfoque moderno de Next.js 16.',
        c: 'Aunque fetch con next.revalidate aun funciona, la pregunta pide cachear una funcion, no un fetch individual. Ademas, "use cache" es el modelo recomendado en Next.js 16.',
        d: 'cacheLife() y cacheTag() DEBEN estar dentro de un bloque "use cache". Sin la directiva, Next.js lanza un error.',
      },
    },
    {
      id: 'next-cache-q-3',
      question: 'Que sucede cuando llamas revalidateTag("posts") en un Server Action?',
      options: [
        { id: 'a', text: 'Solo invalida la primera entrada de cache con ese tag' },
        { id: 'b', text: 'Invalida TODAS las entradas de cache marcadas con el tag "posts" en todo el servidor' },
        { id: 'c', text: 'Refresca automaticamente el navegador del usuario' },
        { id: 'd', text: 'Elimina el Router Cache del navegador de todos los usuarios conectados' },
      ],
      correctOptionId: 'b',
      explanation: 'revalidateTag() invalida TODAS las entradas del Data Cache que fueron marcadas con ese tag usando cacheTag(). Multiples funciones y rutas pueden compartir un tag, y todas se invalidan a la vez.',
      whyOthersAreWrong: {
        a: 'No invalida solo la primera — invalida TODAS las entradas marcadas con ese tag.',
        c: 'No refresca el navegador automaticamente. El usuario vera datos frescos en la siguiente navegacion o cuando el Router Cache expire.',
        d: 'No puede eliminar el Router Cache de otros usuarios. Solo afecta el Data Cache del servidor.',
      },
    },
    {
      id: 'next-cache-q-4',
      question: 'Cual de estas opciones opta una ruta COMPLETAMENTE fuera del cache en Next.js 16?',
      options: [
        { id: 'a', text: 'Usar cacheLife("seconds") con revalidate: 1' },
        { id: 'b', text: 'Llamar await connection() al inicio del componente' },
        { id: 'c', text: 'Usar "use cache" sin cacheLife()' },
        { id: 'd', text: 'Agregar export const dynamic = "force-cache"' },
      ],
      correctOptionId: 'b',
      explanation: 'await connection() de next/server indica explicitamente que la ruta es dinamica y no debe cachearse. Es equivalente al antiguo opt-out pattern pero mas explicito.',
      whyOthersAreWrong: {
        a: 'cacheLife("seconds") SI cachea, solo que por muy poco tiempo (1 segundo). No es opt-out, es cache ultra-corto.',
        c: '"use cache" sin cacheLife() usa duracion por defecto — sigue cacheando.',
        d: '"force-cache" es lo opuesto: fuerza que se use cache. Ademas, el modelo moderno usa "use cache" en vez de route segment config.',
      },
    },
    {
      id: 'next-cache-q-5',
      question: 'En la analogia de la biblioteca, que representa "el bibliotecario renueva la fotocopia cada 24 horas automaticamente"?',
      options: [
        { id: 'a', text: 'revalidateTag() — invalidacion on-demand' },
        { id: 'b', text: 'cacheLife("days") — revalidacion basada en tiempo' },
        { id: 'c', text: 'connection() — opt-out de cache' },
        { id: 'd', text: 'cacheTag() — etiquetar entradas de cache' },
      ],
      correctOptionId: 'b',
      explanation: 'La renovacion automatica periodica es exactamente lo que hace cacheLife() con time-based revalidation: cada cierto tiempo, Next.js regenera el contenido en background sin intervencion manual.',
      whyOthersAreWrong: {
        a: 'revalidateTag() es invalidacion manual disparada por un evento, no automatica por tiempo. En la analogia seria "el autor llama para avisar".',
        c: 'connection() es NO tener fotocopia — siempre ir al almacen. Es opt-out completo.',
        d: 'cacheTag() solo etiqueta, no define cuando renovar.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-cache-q-6',
      question: 'Que forma la cache key de una funcion marcada con "use cache"?',
      options: [
        { id: 'a', text: 'Solo el nombre de la funcion' },
        { id: 'b', text: 'Los argumentos serializados pasados a la funcion' },
        { id: 'c', text: 'El cacheTag() definido dentro de la funcion' },
        { id: 'd', text: 'La URL de la pagina donde se llama' },
      ],
      correctOptionId: 'b',
      explanation: 'Los argumentos pasados a una funcion "use cache" se serializan automaticamente como parte de la cache key. Diferentes argumentos generan diferentes entradas de cache, similar a como diferentes parametros de busqueda generan diferentes fotocopias.',
      whyOthersAreWrong: {
        a: 'El nombre de la funcion es parte de la key, pero no es suficiente. Sin los argumentos, getUser("1") y getUser("2") serian la misma entrada.',
        c: 'cacheTag() es para invalidacion, no forma parte de la cache key usada para lookup.',
        d: 'La URL puede influir si "use cache" esta a nivel de ruta, pero para funciones individuales son los argumentos los que determinan la key.',
      },
    },
    {
      id: 'next-cache-q-7',
      question: 'Cual es la diferencia principal entre Data Cache y Full Route Cache?',
      options: [
        { id: 'a', text: 'Data Cache esta en el navegador, Full Route Cache en el servidor' },
        { id: 'b', text: 'Data Cache almacena resultados de datos, Full Route Cache almacena HTML+RSC Payload completo de la pagina' },
        { id: 'c', text: 'Data Cache es temporal, Full Route Cache es permanente' },
        { id: 'd', text: 'Data Cache usa tags, Full Route Cache usa paths — son mutuamente excluyentes' },
      ],
      correctOptionId: 'b',
      explanation: 'Data Cache guarda resultados de funciones/fetch individuales. Full Route Cache guarda la pagina HTML completa pre-renderizada (incluyendo RSC Payload). Estan en capas diferentes: primero se cachean los datos, luego la ruta completa que usa esos datos.',
      whyOthersAreWrong: {
        a: 'AMBOS estan en el servidor. El cache del navegador es el Router Cache, una tercera capa.',
        c: 'Ambos pueden ser temporales o de larga duracion segun la configuracion.',
        d: 'No son mutuamente excluyentes. Una ruta en Full Route Cache puede contener multiples entradas de Data Cache dentro.',
      },
    },
    {
      id: 'next-cache-q-8',
      question: 'En que contextos se puede llamar revalidateTag()?',
      options: [
        { id: 'a', text: 'En cualquier componente, incluyendo Client Components' },
        { id: 'b', text: 'Solo en Server Actions y Route Handlers' },
        { id: 'c', text: 'Solo dentro de funciones marcadas con "use cache"' },
        { id: 'd', text: 'Solo en middleware.ts' },
      ],
      correctOptionId: 'b',
      explanation: 'revalidateTag() es una funcion del servidor que invalida el Data Cache. Solo puede ejecutarse en Server Actions (funciones "use server") y Route Handlers (app/api/), donde hay acceso al servidor para modificar el cache.',
      whyOthersAreWrong: {
        a: 'Client Components se ejecutan en el navegador — no tienen acceso al Data Cache del servidor.',
        c: 'Dentro de "use cache" es donde se DEFINE el cache con cacheTag(). La invalidacion ocurre en otro contexto (Server Actions/Route Handlers).',
        d: 'Middleware se ejecuta en el Edge Runtime y no tiene acceso a las APIs de revalidacion del cache.',
      },
    },
    {
      id: 'next-cache-q-9',
      question: 'Que pasa si llamas cacheLife() sin estar dentro de un bloque "use cache"?',
      options: [
        { id: 'a', text: 'Next.js ignora la llamada silenciosamente' },
        { id: 'b', text: 'Aplica el cache a nivel de ruta automaticamente' },
        { id: 'c', text: 'Next.js lanza un error en tiempo de ejecucion' },
        { id: 'd', text: 'Cachea con duracion por defecto' },
      ],
      correctOptionId: 'c',
      explanation: 'cacheLife() y cacheTag() requieren estar dentro del scope de "use cache". Llamarlas fuera de ese contexto produce un error porque no hay entrada de cache a la cual aplicar la configuracion.',
      whyOthersAreWrong: {
        a: 'No es silencioso — es un error explicito que detiene la ejecucion.',
        b: 'No hay comportamiento implicito. La directiva "use cache" es obligatoria.',
        d: 'Sin "use cache" no hay cache — no puede aplicar ninguna duracion.',
      },
    },
    {
      id: 'next-cache-q-10',
      question: 'Cual es el comportamiento del modelo stale-while-revalidate cuando una entrada de cache expira su tiempo de revalidate?',
      options: [
        { id: 'a', text: 'Devuelve un error 504 hasta que se regenere' },
        { id: 'b', text: 'Sirve la version cacheada al usuario actual y regenera en background para el siguiente' },
        { id: 'c', text: 'Bloquea la respuesta hasta obtener datos frescos del origen' },
        { id: 'd', text: 'Elimina la entrada del cache y redirige al usuario a una pagina de carga' },
      ],
      correctOptionId: 'b',
      explanation: 'Stale-while-revalidate prioriza la velocidad: entrega la version existente (stale) instantaneamente al usuario actual, y en background genera la version fresca que estara lista para el siguiente request.',
      whyOthersAreWrong: {
        a: 'Nunca devuelve error — siempre sirve la version cacheada mientras regenera.',
        c: 'Bloquear iria contra el proposito del patron. La ventaja es NO esperar la regeneracion.',
        d: 'No elimina ni redirige. La entrada stale se sirve hasta que la nueva version esta lista.',
      },
    },
  ],
  difficulty: 'avanzado',
  estimatedMinutes: 35,
  tags: [
    'cache',
    'revalidation',
    'use-cache',
    'cacheLife',
    'cacheTag',
    'revalidateTag',
    'revalidatePath',
    'Data Cache',
    'Full Route Cache',
    'Router Cache',
    'SSG',
    'ISR',
    'Next.js 16',
    'performance',
    'stale-while-revalidate',
  ],
  codeChallenge: {
    instruction: 'Completa las directivas de caché en este Server Component.',
    template: `import { cacheLife, cacheTag } from 'next/cache';

export async function ProductList() {
  '{{cache_directive}}';
  cacheLife('{{duration}}');
  cacheTag('{{tag_name}}');

  const products = await fetch('/api/products').then(r => r.json());
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// To invalidate:
// revalidateTag('{{tag_name}}');`,
    language: 'tsx',
    blanks: [
      { id: 'cache_directive', answers: ['use cache'], placeholder: 'directive' },
      { id: 'duration', answers: ['hours', 'days', 'minutes', 'weeks'], placeholder: 'perfil' },
      { id: 'tag_name', answers: ['products', 'product'], placeholder: 'tag' },
    ],
    hint: '"use cache" activa el caché. cacheLife define duración (hours, days, etc). cacheTag marca para invalidación selectiva con revalidateTag.',
  },
};
