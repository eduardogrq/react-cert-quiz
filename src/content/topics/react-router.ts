import type { Topic } from '../types';

export const reactRouterTopic: Topic = {
  id: 'react-router',
  courseId: 'react-level-1',
  title: 'React Router: Los letreros del metro',
  realWorldAnalogy: {
    title: 'Los letreros del metro',
    scenario:
      'En el metro, cada estación tiene un letrero con su nombre. Tú decides a qué estación ir siguiendo los letreros, pero nunca sales a la calle — te mueves dentro del sistema. El vagón cambia de contenido (pasajeros suben y bajan) pero la estructura del metro sigue igual.',
    mapping: [
      { everyday: 'El sistema de metro completo', technical: 'BrowserRouter — el router que envuelve toda la app' },
      { everyday: 'Los letreros que señalan estaciones', technical: '<Link> — navegación sin recargar la página' },
      { everyday: 'Llegar a una estación específica', technical: 'Route — renderizar un componente según la URL' },
      { everyday: 'El mapa del metro (líneas y paradas)', technical: 'La configuración de rutas (Routes)' },
      { everyday: '"Estación Reforma, ¿cuál es la salida?"', technical: 'useParams — leer parámetros de la URL' },
    ],
    whereItBreaks:
      'En el metro real cambias de ubicación física. En React Router nunca sales de la página — solo cambia qué componente se renderiza. Es navegación "virtual" (client-side).',
  },
  keyTerms: [
    {
      term: 'BrowserRouter',
      definition: 'Componente que envuelve la app y habilita el routing basado en la URL del navegador.',
      analogyHint: 'El sistema de metro completo que conecta todas las estaciones.',
    },
    {
      term: 'Route',
      definition: 'Asocia un path de URL con un componente a renderizar.',
      analogyHint: 'La parada del metro: "en esta estación bajan estos pasajeros".',
    },
    {
      term: 'Link',
      definition: 'Componente que navega a otra ruta sin recargar la página (reemplaza <a>).',
      analogyHint: 'El letrero que señala la siguiente estación sin salir del sistema.',
    },
    {
      term: 'useNavigate',
      definition: 'Hook que devuelve una función para navegar programáticamente.',
      analogyHint: 'El conductor que puede redirigir el vagón a otra estación.',
    },
    {
      term: 'useParams',
      definition: 'Hook que extrae los parámetros dinámicos de la URL actual.',
      analogyHint: '"¿En qué estación estoy y cuál es la salida?" — leer la URL.',
    },
    {
      term: 'useSearchParams',
      definition: 'Hook para leer y modificar los query parameters (?key=value) de la URL.',
      analogyHint: 'Los filtros del mapa: "mostrar solo línea azul, sentido norte".',
    },
  ],
  summary:
    'React Router maneja la navegación client-side: cambia la URL y renderiza componentes sin recargar la página. `<Link>` para navegar, `useNavigate` para navegación programática, `useParams` para leer parámetros dinámicos de la URL, `useSearchParams` para query strings. Todo envuelto en `<BrowserRouter>`.',
  explanation: `## El metro de tu aplicación

React Router convierte tu SPA en un **sistema de metro**: múltiples "estaciones" (páginas) conectadas por letreros (\`<Link>\`), sin nunca salir a la calle (sin recargar el navegador).

## Setup básico

\`\`\`tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>         {/* el sistema de metro */}
      <nav>
        <Link to="/">Inicio</Link>      {/* letrero */}
        <Link to="/about">Acerca</Link> {/* letrero */}
      </nav>

      <Routes>              {/* el mapa de estaciones */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

## Link vs \`<a>\`

\`<Link>\` navega sin recargar la página (client-side routing). \`<a href>\` recarga toda la app:

\`\`\`tsx
// ✅ Navega SIN recargar — se queda "dentro del metro"
<Link to="/dashboard">Dashboard</Link>

// ❌ Recarga toda la página — "sales a la calle y vuelves a entrar"
<a href="/dashboard">Dashboard</a>
\`\`\`

## useParams: ¿en qué estación estoy?

Para rutas dinámicas como \`/user/:id\`:

\`\`\`tsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams(); // extrae :id de la URL
  // Si la URL es /user/42, id = "42"

  return <h1>Perfil del usuario {id}</h1>;
}
\`\`\`

## useNavigate: el conductor

Navegación programática (después de un submit, un login, etc.):

\`\`\`tsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await login(credentials);
    navigate('/dashboard'); // redirigir al dashboard
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
\`\`\`

## useSearchParams: los filtros del mapa

Para query strings (\`?page=2&sort=name\`):

\`\`\`tsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || '1'; // leer
  const sort = searchParams.get('sort') || 'name';

  function nextPage() {
    setSearchParams({ page: String(Number(page) + 1), sort }); // escribir
  }

  return <div>Página {page} <button onClick={nextPage}>Siguiente</button></div>;
}
\`\`\`

## Rutas anidadas

Como líneas del metro que se subdividen:

\`\`\`tsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Overview />} />
  <Route path="settings" element={<Settings />} />
</Route>
// /dashboard → Overview
// /dashboard/settings → Settings
// Ambas dentro de DashboardLayout (que usa <Outlet />)
\`\`\``,
  codeExamples: [
    {
      title: 'Setup completo con rutas dinámicas',
      language: 'tsx',
      code: `import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProductDetail() {
  const { id } = useParams(); // :id de la URL
  return <h1>Producto #{id}</h1>;
}`,
      description: 'Rutas estáticas, dinámicas (:id) y catch-all (*) con useParams.',
    },
  ],
  pitfalls: [
    'Usar <a href> en vez de <Link to> — recarga toda la app y pierde el state.',
    'Olvidar que useParams devuelve strings — si esperas un número, parsearlo.',
    'No envolver la app en BrowserRouter — todos los hooks de Router fallan.',
    'path="*" (catch-all) debe ir AL FINAL — las rutas se evalúan en orden.',
    'useNavigate dentro de un render (no en un handler) puede causar loops infinitos.',
    'searchParams.get() devuelve string | null — manejar el caso null.',
  ],
  cheatSheet: [
    '`<BrowserRouter>` envuelve toda la app — habilita routing',
    '`<Route path="/x" element={<X />} />` — mapea URL a componente',
    '`<Route path="/x/:id">` — parámetro dinámico, leer con useParams',
    '`<Link to="/x">` — navegar sin recargar (reemplaza <a>)',
    '`useNavigate()` → `navigate("/path")` — navegación programática',
    '`useParams()` → `{ id }` — leer :id de la URL (siempre string)',
    '`useSearchParams()` → `[params, setParams]` — leer/escribir ?key=val',
    '`<Route path="*">` — catch-all para 404 (siempre al final)',
    '`<Outlet />` — donde se renderizan rutas hijas en layouts anidados',
  ],
  flashcards: [
    {
      id: 'router-fc-1',
      front: '¿Cuál es la diferencia entre <Link to="/x"> y <a href="/x">?',
      back: '<Link> navega sin recargar la página (te mueves dentro del metro). <a> recarga toda la app (sales a la calle y vuelves a entrar, perdiendo todo el state).',
      usesAnalogy: true,
    },
    {
      id: 'router-fc-2',
      front: '¿Qué devuelve useParams() y de qué tipo son los valores?',
      back: 'Un objeto con los parámetros dinámicos de la URL (ej: { id: "42" }). Los valores SIEMPRE son strings — parsear si necesitas número.',
    },
    {
      id: 'router-fc-3',
      front: '¿Cuándo usarías useNavigate en vez de <Link>?',
      back: 'Cuando necesitas navegar programáticamente: después de un submit exitoso, login, timer, o cualquier lógica donde no hay un click directo del usuario en un enlace.',
    },
    {
      id: 'router-fc-4',
      front: '¿Para qué sirve useSearchParams?',
      back: 'Para leer y modificar query parameters de la URL (?page=2&sort=name). Devuelve [params, setParams] similar a useState pero sincronizado con la URL.',
    },
    {
      id: 'router-fc-5',
      front: '¿Qué pasa si olvidas envolver tu app en <BrowserRouter>?',
      back: 'Todos los hooks de React Router (useNavigate, useParams, useSearchParams) y componentes (Link, Route) lanzan error porque dependen del contexto del Router.',
    },
    {
      id: 'router-fc-6',
      front: '¿Qué es una ruta catch-all y cómo se define?',
      back: '`<Route path="*" element={<NotFound />} />` — captura cualquier URL que no matchee las rutas anteriores. Se usa para páginas 404. Va AL FINAL de las rutas.',
    },
    {
      id: 'router-fc-7',
      front: '¿Qué hace <Outlet /> en React Router?',
      back: 'Marca dónde se renderizan las rutas hijas dentro de un layout padre. Es como el "espacio donde paran los vagones" dentro de una estación con múltiples andenes.',
      usesAnalogy: true,
    },
  ],
  quiz: [
    {
      id: 'router-q-1',
      question: 'Siguiendo la analogía del metro: si <Link> es "un letrero que te mueve a otra estación sin salir del sistema", ¿qué representa usar <a href>?',
      options: [
        { id: 'a', text: 'Lo mismo que Link pero más rápido' },
        { id: 'b', text: 'Salir a la calle, caminar, y volver a entrar al metro (recargar toda la app)' },
        { id: 'c', text: 'Un letrero que solo funciona una vez' },
        { id: 'd', text: 'Un letrero que necesita JavaScript para funcionar' },
      ],
      correctOptionId: 'b',
      explanation: '<a href> causa una navegación completa del navegador: descarga todo de nuevo, pierde state de React, re-monta toda la app. Como salir y re-entrar al metro.',
      whyOthersAreWrong: {
        a: 'Es más lento porque recarga todo. Link solo cambia el componente visible.',
        c: 'Funciona siempre, pero cada uso recarga la página completa.',
        d: 'Link es el que necesita JS (client-side routing). <a> funciona sin JS pero recarga.',
      },
      usesAnalogy: true,
    },
    {
      id: 'router-q-2',
      question: 'Si la URL es `/productos/abc123`, ¿qué devuelve `useParams()` en una ruta definida como `path="/productos/:id"`?',
      options: [
        { id: 'a', text: '{ id: 123 }' },
        { id: 'b', text: '{ id: "abc123" }' },
        { id: 'c', text: '"abc123"' },
        { id: 'd', text: '{ productos: "abc123" }' },
      ],
      correctOptionId: 'b',
      explanation: 'useParams devuelve un objeto donde las keys son los nombres de los parámetros (:id) y los valores son STRINGS extraídos de la URL.',
      whyOthersAreWrong: {
        a: 'Los valores de useParams siempre son strings, nunca números automáticamente.',
        c: 'Devuelve un objeto, no un string suelto.',
        d: 'La key es el nombre del parámetro dinámico (:id), no el segmento estático.',
      },
    },
    {
      id: 'router-q-3',
      question: '¿Cuál es el uso correcto de useNavigate para redirigir después de un login exitoso?',
      options: [
        { id: 'a', text: '`window.location.href = "/dashboard"`' },
        { id: 'b', text: '`const navigate = useNavigate(); navigate("/dashboard");`' },
        { id: 'c', text: '`<Link to="/dashboard" />`' },
        { id: 'd', text: '`useNavigate("/dashboard")`' },
      ],
      correctOptionId: 'b',
      explanation: 'useNavigate() retorna una función. La llamas cuando necesitas navegar programáticamente (después de lógica async).',
      whyOthersAreWrong: {
        a: 'window.location recarga la página completa — pierdes state. No es client-side routing.',
        c: 'Link es para clicks del usuario en el JSX, no para navegación programática en un handler.',
        d: 'useNavigate no acepta path como argumento — retorna una función que luego llamas con el path.',
      },
    },
    {
      id: 'router-q-4',
      question: '¿Cómo lees el query parameter `page` de la URL `/productos?page=3`?',
      options: [
        { id: 'a', text: '`useParams().page`' },
        { id: 'b', text: '`useSearchParams()[0].get("page")`' },
        { id: 'c', text: '`window.location.query.page`' },
        { id: 'd', text: '`useRoute().query.page`' },
      ],
      correctOptionId: 'b',
      explanation: 'useSearchParams devuelve [searchParams, setSearchParams]. searchParams.get("page") lee el valor del query param.',
      whyOthersAreWrong: {
        a: 'useParams lee parámetros de ruta (:id), no query strings (?page=3).',
        c: 'window.location no tiene .query. Además, no es reactivo con React Router.',
        d: 'useRoute no existe en React Router.',
      },
    },
    {
      id: 'router-q-5',
      question: '¿Dónde debe ir la ruta `path="*"` (catch-all / 404)?',
      options: [
        { id: 'a', text: 'Al inicio, antes de las demás rutas' },
        { id: 'b', text: 'No importa el orden' },
        { id: 'c', text: 'Al final, después de todas las rutas específicas' },
        { id: 'd', text: 'Fuera del componente Routes' },
      ],
      correctOptionId: 'c',
      explanation: 'React Router evalúa rutas por especificidad, pero path="*" matchea todo. Ponerla al final asegura que solo aplique si ninguna ruta específica matcheó.',
      whyOthersAreWrong: {
        a: 'Si va primero con un router que evalúa en orden secuencial, podría capturar todo.',
        b: 'El orden importa para claridad y ciertos edge cases. La convención es al final.',
        d: 'Debe ir dentro de <Routes> para funcionar como fallback.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 20,
  prerequisites: ['components', 'hooks'],
  tags: ['react-router', 'Link', 'useNavigate', 'useParams', 'useSearchParams', 'routing'],
  codeChallenge: {
    instruction: 'Completa la ruta dinámica y lee el parámetro en el componente.',
    template: `import { useParams } from 'react-router-dom';

// In your route config:
// <Route path="/user/{{path_syntax}}" element={<Profile />} />

function Profile() {
  const { {{param_name}} } = useParams();
  return <h1>Usuario: {{{param_name}}}</h1>;
}`,
    language: 'tsx',
    blanks: [
      { id: 'path_syntax', answers: [':id', ':userId'], placeholder: '/user/???' },
      { id: 'param_name', answers: ['id', 'userId'], placeholder: 'param' },
    ],
    hint: 'Las rutas dinámicas usan :nombreParam en el path, y useParams() devuelve un objeto con ese nombre.',
  },
};
