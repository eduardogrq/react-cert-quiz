import type { Topic } from '../types';

export const coreConceptsTopic: Topic = {
  id: 'core-concepts',
  courseId: 'react-level-1',
  title: 'Core Concepts: Montar el escenario',
  realWorldAnalogy: {
    title: 'Montar el escenario para la obra',
    scenario:
      'Antes de que empiece una obra de teatro, alguien elige un escenario vacío en el edificio, instala la tramoya y dice "aquí actuarán los personajes". Sin ese paso, los actores no tienen dónde pararse ni el público sabe a dónde mirar.',
    mapping: [
      { everyday: 'El escenario vacío (el div en el HTML)', technical: 'El elemento DOM root (getElementById)' },
      { everyday: 'El director que dice "aquí es"', technical: 'createRoot — monta React en ese nodo' },
      { everyday: 'Los actores y su guión', technical: 'Los componentes React (elementos)' },
      { everyday: 'La primera función (se abre el telón)', technical: '.render(<App />) — primer render' },
    ],
    whereItBreaks:
      'En el teatro montas el escenario una vez y ya. En React, createRoot se llama una vez pero .render() puede re-ejecutarse y React actualiza solo lo que cambió (reconciliación), no reconstruye todo.',
  },
  keyTerms: [
    {
      term: 'createRoot',
      definition: 'Crea un root de React sobre un nodo DOM, habilitando el rendering de React 18+.',
      analogyHint: 'Designar un escenario vacío como "aquí actúa React".',
    },
    {
      term: 'render',
      definition: 'Método del root que pinta un árbol de componentes en el DOM por primera vez.',
      analogyHint: 'Abrir el telón y que empiece la primera función.',
    },
    {
      term: 'React element',
      definition: 'Objeto JS liviano que describe qué debe pintarse — NO es un nodo DOM real.',
      analogyHint: 'El guión del actor: dice qué debe pasar, no es la actuación en sí.',
    },
    {
      term: 'createElement',
      definition: 'Función que crea un React element. JSX se compila a esto internamente.',
      analogyHint: 'Escribir una línea del guión a mano, sin usar el atajo del formato.',
    },
    {
      term: 'Virtual DOM',
      definition: 'Representación en memoria del UI. React la compara con la anterior para calcular los cambios mínimos.',
      analogyHint: 'El director ensayando mentalmente antes de mover actores en escena.',
    },
  ],
  summary:
    'React necesita un punto de entrada: un nodo DOM donde "montar el escenario". `createRoot(document.getElementById("root"))` crea ese punto, y `.render(<App />)` arranca la obra. Internamente, JSX se traduce a `createElement()` que produce objetos livianos (React elements), no DOM real. React usa esa descripción para actualizar solo lo necesario.',
  explanation: `## Montando el escenario

Igual que en el teatro, React no puede actuar sin un **escenario designado**. En un proyecto Next.js esto ya viene configurado, pero es fundamental entender qué pasa bajo el capó:

\`\`\`tsx
// En un proyecto manual (sin Next.js):
import { createRoot } from 'react-dom/client';

const escenario = document.getElementById('root'); // el div vacío en index.html
const root = createRoot(escenario);                // "aquí actúa React"
root.render(<App />);                              // se abre el telón
\`\`\`

## createElement: el guión detrás de JSX

Cuando escribes JSX, el compilador lo transforma:

\`\`\`tsx
// Lo que escribes (JSX):
<h1 className="titulo">Hola</h1>

// Lo que ejecuta el navegador (createElement):
React.createElement('h1', { className: 'titulo' }, 'Hola')

// Lo que devuelve (un objeto plano — el "guión"):
{ type: 'h1', props: { className: 'titulo', children: 'Hola' } }
\`\`\`

**No es DOM real.** Es una descripción liviana. React lee ese "guión" y decide qué nodos DOM crear o actualizar.

## ¿Por qué importa entenderlo?

- Explica por qué JSX requiere un solo elemento raíz (un guión necesita una escena contenedora).
- Explica por qué React puede ser eficiente: compara guiones (objetos JS baratos) en vez de manipular DOM directamente.
- Explica por qué \`createRoot\` se llama UNA vez y \`render\` arranca todo.

## En Next.js

Next.js abstrae el montaje — no escribes createRoot manualmente. Pero sigue pasando:
- Next.js designa el escenario por ti.
- Tu \`app/layout.tsx\` es el primer telón que se abre.
- Cada página es una nueva escena dentro del mismo escenario.`,
  codeExamples: [
    {
      title: 'createRoot básico (para entender, no para escribir en Next.js)',
      language: 'tsx',
      code: `import { createRoot } from 'react-dom/client';
import App from './App';

// 1. Elegir el escenario
const container = document.getElementById('root');

// 2. Montar React ahí
const root = createRoot(container);

// 3. Abrir el telón
root.render(<App />);`,
      description: 'El patrón completo de inicialización. En Next.js esto es automático.',
    },
    {
      title: 'createElement vs JSX',
      language: 'tsx',
      code: `// JSX (lo que escribes):
const element = <p className="saludo">Hola mundo</p>;

// Es equivalente a:
const element = React.createElement(
  'p',
  { className: 'saludo' },
  'Hola mundo'
);

// Ambos producen el mismo objeto React element`,
      description: 'JSX es azúcar sintáctica para createElement. El resultado es un objeto descriptivo, no DOM.',
    },
  ],
  pitfalls: [
    'createRoot reemplaza a ReactDOM.render (React 17). Si ves `ReactDOM.render()` en un ejemplo, es código legacy.',
    'Un React element NO es un nodo DOM — es un objeto JS plano que DESCRIBE qué debería pintarse.',
    'createRoot se llama una sola vez. Llamarlo múltiples veces en el mismo nodo es un error.',
    'En Next.js nunca escribes createRoot manualmente — pero el examen puede preguntar qué hace.',
    'className (no class) en JSX: porque JSX es JavaScript y `class` es palabra reservada.',
  ],
  cheatSheet: [
    '`createRoot(domNode)` — designa el nodo DOM como root de React',
    '`.render(<App />)` — primera pintura del árbol de componentes',
    '`createElement(type, props, children)` — lo que JSX compila internamente',
    'React element = objeto JS liviano, NO nodo DOM',
    'Virtual DOM = representación en memoria para calcular diffs mínimos',
    'createRoot se llama 1 vez; re-renders los maneja React automáticamente',
    'Next.js abstrae createRoot — tu entry point es app/layout.tsx',
  ],
  flashcards: [
    {
      id: 'core-fc-1',
      front: '¿Qué hace createRoot?',
      back: 'Toma un nodo DOM y lo designa como "escenario" donde React va a actuar. Es el punto de montaje de toda la aplicación. Solo se llama una vez.',
      usesAnalogy: true,
    },
    {
      id: 'core-fc-2',
      front: '¿Qué es un React element?',
      back: 'Un objeto JavaScript liviano que DESCRIBE lo que debe pintarse (como un guión). No es un nodo DOM real. JSX y createElement producen React elements.',
      usesAnalogy: true,
    },
    {
      id: 'core-fc-3',
      front: '¿A qué se compila este JSX: `<h1 className="t">Hola</h1>`?',
      back: '`React.createElement("h1", { className: "t" }, "Hola")` que retorna `{ type: "h1", props: { className: "t", children: "Hola" } }`.',
    },
    {
      id: 'core-fc-4',
      front: '¿Cuál es la diferencia entre createRoot (React 18+) y ReactDOM.render (React 17)?',
      back: 'createRoot habilita features de React 18 (concurrent rendering, automatic batching). ReactDOM.render es legacy y ya no se recomienda.',
    },
    {
      id: 'core-fc-5',
      front: '¿Por qué React usa className en vez de class?',
      back: 'Porque JSX es JavaScript, y `class` es palabra reservada en JS (para clases). Se eligió `className` para evitar el conflicto.',
    },
    {
      id: 'core-fc-6',
      front: '¿Necesitas escribir createRoot en un proyecto Next.js?',
      back: 'No. Next.js se encarga del montaje automáticamente. Pero debes entender qué hace porque el examen puede preguntarlo.',
    },
    {
      id: 'core-fc-7',
      front: '¿Qué es el Virtual DOM?',
      back: 'Una representación en memoria del UI (los "guiones"). React compara la versión nueva con la anterior y solo actualiza en el DOM real las diferencias (reconciliación).',
    },
  ],
  quiz: [
    {
      id: 'core-q-1',
      question: 'Siguiendo la analogía del teatro: si createRoot "designa el escenario", ¿qué representa .render(<App />)?',
      options: [
        { id: 'a', text: 'Construir el edificio del teatro' },
        { id: 'b', text: 'Abrir el telón e iniciar la primera función' },
        { id: 'c', text: 'Escribir el guión de la obra' },
        { id: 'd', text: 'Vender boletos al público' },
      ],
      correctOptionId: 'b',
      explanation: '.render() es el momento donde React pinta por primera vez — "se abre el telón" y los componentes aparecen en pantalla.',
      whyOthersAreWrong: {
        a: 'Construir el edificio sería crear el archivo HTML con el div#root — infraestructura previa a React.',
        c: 'Escribir el guión es crear los componentes (createElement/JSX). render() es ejecutarlos.',
        d: 'Eso sería entregar la app a los usuarios (deploy). render() es la ejecución técnica.',
      },
      usesAnalogy: true,
    },
    {
      id: 'core-q-2',
      question: '¿Qué devuelve `React.createElement("div", { id: "app" }, "Hola")`?',
      options: [
        { id: 'a', text: 'Un nodo DOM <div> real' },
        { id: 'b', text: 'Un objeto JS con type, props y children que describe un div' },
        { id: 'c', text: 'Un string HTML: "<div id=app>Hola</div>"' },
        { id: 'd', text: 'undefined — createElement no devuelve nada' },
      ],
      correctOptionId: 'b',
      explanation: 'createElement produce un React element: un objeto plano que DESCRIBE qué pintar. React lo usa después para crear/actualizar DOM real.',
      whyOthersAreWrong: {
        a: 'createElement NO toca el DOM. Solo crea una descripción (el "guión").',
        c: 'No genera strings HTML. El resultado es un objeto JavaScript.',
        d: 'Siempre devuelve un React element (objeto).',
      },
    },
    {
      id: 'core-q-3',
      question: '¿Cuántas veces se debe llamar a createRoot para una aplicación React típica?',
      options: [
        { id: 'a', text: 'Una vez por componente' },
        { id: 'b', text: 'Una vez para toda la aplicación' },
        { id: 'c', text: 'Cada vez que el state cambia' },
        { id: 'd', text: 'Una vez por página/ruta' },
      ],
      correctOptionId: 'b',
      explanation: 'createRoot se llama UNA sola vez. Monta React en un nodo y a partir de ahí React maneja todos los re-renders internamente.',
      whyOthersAreWrong: {
        a: 'Los componentes se montan dentro del root existente, no necesitan su propio createRoot.',
        c: 'Los cambios de state causan re-render, no un nuevo createRoot. React ya sabe dónde pintar.',
        d: 'En una SPA el root es uno solo. El router cambia contenido dentro del mismo root.',
      },
    },
    {
      id: 'core-q-4',
      question: '¿Cuál de estos es el reemplazo correcto de ReactDOM.render() en React 18+?',
      options: [
        { id: 'a', text: '`ReactDOM.render(<App />, document.getElementById("root"))`' },
        { id: 'b', text: '`createRoot(document.getElementById("root")).render(<App />)`' },
        { id: 'c', text: '`React.mount(<App />, "root")`' },
        { id: 'd', text: '`document.getElementById("root").render(<App />)`' },
      ],
      correctOptionId: 'b',
      explanation: 'React 18 introdujo createRoot como API de montaje. Primero creas el root, luego llamas .render() en él.',
      whyOthersAreWrong: {
        a: 'Este es el patrón de React 17 (legacy). Funciona pero no habilita features de React 18.',
        c: 'React.mount no existe.',
        d: 'Los nodos DOM no tienen método .render(). Eso es API de React, no del DOM.',
      },
    },
    {
      id: 'core-q-5',
      question: '¿Por qué React usa una representación virtual (Virtual DOM) en vez de manipular el DOM directamente?',
      options: [
        { id: 'a', text: 'El DOM real no soporta JavaScript' },
        { id: 'b', text: 'Comparar objetos JS es barato; manipular DOM es caro. React calcula el diff mínimo.' },
        { id: 'c', text: 'El Virtual DOM es más rápido que el DOM en todos los casos' },
        { id: 'd', text: 'Es un requisito de JSX — sin Virtual DOM no puede compilar' },
      ],
      correctOptionId: 'b',
      explanation: 'Crear/comparar objetos JS es muy rápido. React lo hace para encontrar los cambios mínimos y luego toca el DOM real lo menos posible.',
      whyOthersAreWrong: {
        a: 'El DOM real se manipula con JS perfectamente. Solo que es más lento que comparar objetos.',
        c: 'El Virtual DOM no siempre es más rápido. Su ventaja es minimizar operaciones DOM costosas, pero agrega overhead propio.',
        d: 'JSX se compila a createElement. El Virtual DOM es una estrategia de rendering, no un requisito del lenguaje.',
      },
    },
  ],
  difficulty: 'basico',
  estimatedMinutes: 15,
  tags: ['createRoot', 'createElement', 'react-element', 'virtual-dom', 'render'],
  codeChallenge: {
    instruction: 'Completa el código para montar una aplicación React en el DOM.',
    template: `import { createRoot } from '{{import_source}}';
import App from './App';

const container = document.getElementById('{{root_id}}');
const root = createRoot(container);
root.{{render_method}}(<{{component}} />);`,
    language: 'tsx',
    blanks: [
      { id: 'import_source', answers: ['react-dom/client'], placeholder: 'package' },
      { id: 'root_id', answers: ['root', 'app'], placeholder: 'id' },
      { id: 'render_method', answers: ['render'], placeholder: 'method' },
      { id: 'component', answers: ['App'], placeholder: 'Component' },
    ],
    hint: 'createRoot se importa de react-dom/client y su método .render() recibe JSX.',
  },
};
