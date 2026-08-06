import type { Topic } from '../types';

export const javascriptEs6Topic: Topic = {
  id: 'javascript-es6',
  title: 'JavaScript ES6+: La base moderna',
  realWorldAnalogy: {
    title: 'La caja de herramientas moderna',
    scenario:
      'Antes tenías un destornillador plano y lo usabas para todo: tornillos, palanca, rascar pintura. Ahora tienes una caja organizada donde cada herramienta tiene su propósito exacto: Phillips, Torx, llave Allen. Haces lo mismo pero más rápido, con menos esfuerzo y sin dañar nada.',
    mapping: [
      { everyday: 'Destornillador plano (para todo)', technical: 'var (el viejo "sirve para todo")' },
      { everyday: 'Phillips / Torx (específicos)', technical: 'let y const (propósito claro)' },
      { everyday: 'Caja con compartimentos', technical: 'Módulos (export/import)' },
      { everyday: 'Llave ajustable que se adapta', technical: 'Destructuring (extraes solo lo que necesitas)' },
      { everyday: 'Multiherramienta plegable', technical: 'Spread/Rest (expande o agrupa según el contexto)' },
    ],
    whereItBreaks:
      'Una herramienta física solo hace una cosa. En JS, const no hace al valor "constante" (un objeto const puede cambiar por dentro) — solo impide reasignar la variable.',
  },
  keyTerms: [
    {
      term: 'const',
      definition: 'Declara una variable que no se puede reasignar. Scope de bloque.',
      analogyHint: 'El compartimento de la caja atornillado: no lo mueves de lugar.',
    },
    {
      term: 'let',
      definition: 'Declara una variable reasignable con scope de bloque (reemplaza a var).',
      analogyHint: 'Un compartimento con velcro: puedes recolocarlo dentro de su sección.',
    },
    {
      term: 'arrow function',
      definition: 'Sintaxis corta para funciones. No tiene su propio `this`.',
      analogyHint: 'El atajo del experto: hace lo mismo, con menos movimientos.',
    },
    {
      term: 'destructuring',
      definition: 'Extraer valores de objetos/arrays en variables individuales en una sola línea.',
      analogyHint: 'Abrir la caja y sacar solo las dos herramientas que necesitas.',
    },
    {
      term: 'spread operator',
      definition: '`...` expande un iterable en elementos individuales (para copiar, combinar).',
      analogyHint: 'Volcar todas las herramientas de una caja sobre la mesa.',
    },
    {
      term: 'rest parameters',
      definition: '`...` en parámetros agrupa argumentos sobrantes en un array.',
      analogyHint: 'Un bolsillo "para todo lo demás" en tu cinturón de herramientas.',
    },
    {
      term: 'Promise',
      definition: 'Objeto que representa un valor futuro: pendiente, cumplida o rechazada.',
      analogyHint: 'El ticket de la ferretería: "vuelve en 20 min por tu pedido".',
    },
    {
      term: 'export/import',
      definition: 'Sistema de módulos para compartir código entre archivos.',
      analogyHint: 'Etiquetar cada herramienta y saber en qué caja está.',
    },
  ],
  summary:
    'ES6+ modernizó JavaScript con `let`/`const` (scope predecible), arrow functions (sintaxis concisa, `this` léxico), destructuring (acceso directo a datos), spread/rest (clonar y agrupar), módulos (export/import), array methods funcionales (map, filter, reduce) y Promises (asincronía sin callback hell). React usa todas estas features intensivamente.',
  explanation: `## ¿Por qué importa para React?

Volviendo a la **caja de herramientas**: React asume que dominas las herramientas modernas. Si escribes React con \`var\` y callbacks anidados, es como construir un mueble con un destornillador plano — funciona, pero cada paso es más lento y propenso a errores.

## let y const

\`\`\`tsx
const API_URL = 'https://api.example.com'; // nunca se reasigna
let intentos = 0; // puede cambiar
// var queda obsoleto: scope de función, hoisting confuso
\`\`\`

**Regla:** usa \`const\` por defecto. Solo \`let\` si necesitas reasignar. Nunca \`var\`.

## Arrow functions

\`\`\`tsx
// Tradicional
function sumar(a, b) { return a + b; }

// Arrow — el "atajo del experto"
const sumar = (a, b) => a + b;

// En React: callbacks inline
<button onClick={() => setCount(count + 1)}>
\`\`\`

Diferencia clave: arrow functions **no crean su propio \`this\`**. Heredan el \`this\` del contexto donde fueron definidas.

## Destructuring

Sacar de la **caja** solo lo que necesitas:

\`\`\`tsx
// Objeto
const { nombre, edad } = persona;

// Array (como useState)
const [count, setCount] = useState(0);

// Props en componentes
function Card({ title, children }) { ... }
\`\`\`

## Spread y Rest

La **multiherramienta** que expande o agrupa:

\`\`\`tsx
// Spread: expandir
const copia = { ...original, nombre: 'nuevo' };
const todos = [...arrayA, ...arrayB];

// Rest: agrupar lo sobrante
function log(primero, ...resto) {
  // resto = array con todo lo demás
}
\`\`\`

## Array methods

Los más usados en React para renderizar listas:

\`\`\`tsx
// map — transformar cada elemento (renderizar listas)
items.map(item => <li key={item.id}>{item.name}</li>)

// filter — quedarte solo con algunos
items.filter(item => item.active)

// find — el primero que cumple
items.find(item => item.id === targetId)
\`\`\`

## Promises

El **ticket de la ferretería**: pides algo, te dan un ticket, sigues con tu vida, vuelves cuando esté listo.

\`\`\`tsx
// async/await — forma moderna de manejar Promises
async function fetchData() {
  const response = await fetch(url); // espera sin bloquear
  const data = await response.json();
  return data;
}
\`\`\`

## Módulos (export/import)

Cada herramienta **etiquetada** en su caja:

\`\`\`tsx
// Named export — múltiples por archivo
export function sumar(a, b) { return a + b; }
export const PI = 3.14159;

// Default export — uno por archivo
export default function App() { ... }

// Import
import App from './App';           // default
import { sumar, PI } from './math'; // named
\`\`\``,
  codeExamples: [
    {
      title: 'Destructuring de props (patrón React)',
      language: 'tsx',
      code: `// En lugar de recibir "props" y usar "props.title"
// extraes directamente lo que necesitas
function UserCard({ nombre, rol, avatar }: UserCardProps) {
  return (
    <div>
      <img src={avatar} alt={nombre} />
      <h2>{nombre}</h2>
      <p>{rol}</p>
    </div>
  );
}`,
      description: 'Destructuring en la firma del componente — el patrón más común en React.',
    },
    {
      title: 'Spread para pasar props',
      language: 'tsx',
      code: `const buttonProps = {
  disabled: true,
  className: 'btn-primary',
  onClick: handleClick,
};

// Spread "vuelca" todas las props de golpe
<Button {...buttonProps}>Enviar</Button>`,
      description: 'Spread operator para pasar múltiples props sin escribirlas una a una.',
    },
  ],
  pitfalls: [
    '`const` no hace inmutable al valor — un `const obj = {}` permite `obj.x = 1`. Solo impide `obj = otroValor`.',
    'Arrow functions no tienen `this` propio. Si necesitas `this` dinámico (raro en React moderno), usa function declaration.',
    'Olvidar `await` en una Promise devuelve el objeto Promise, no el valor resuelto.',
    'Destructuring con renombre usa `:`, no `=`: `const { name: nombre } = obj;` (confuso al inicio).',
    '`export default` y `export` named se importan con sintaxis diferente — mezclarlas causa errores silenciosos.',
    '`.map()` siempre devuelve un array nuevo; `.forEach()` devuelve undefined — en JSX siempre usa `.map()`.',
  ],
  cheatSheet: [
    '`const x = val` — no reasignable · `let x = val` — reasignable · nunca `var`',
    '`(a, b) => a + b` — arrow function implícita · `(a) => { return a; }` — con body',
    '`const { a, b } = obj` — destructuring objeto · `const [x, y] = arr` — destructuring array',
    '`{ ...obj, key: new }` — spread objeto (clonar + modificar)',
    '`[...arr, nuevo]` — spread array (clonar + agregar)',
    '`function f(first, ...rest)` — rest agrupa sobrantes en array',
    '`arr.map(fn)` — transforma · `arr.filter(fn)` — filtra · `arr.find(fn)` — busca primero',
    '`await fetch(url)` — espera Promise · siempre dentro de `async function`',
    '`export function X` — named · `export default X` — default (uno por archivo)',
    '`import X from` — default · `import { X } from` — named',
  ],
  flashcards: [
    {
      id: 'js-fc-1',
      front: '¿Cuál es la diferencia entre const y let?',
      back: 'const no permite reasignar la variable (el "compartimento atornillado"). let sí permite reasignar (el "compartimento con velcro"). Ambos tienen scope de bloque.',
      usesAnalogy: true,
    },
    {
      id: 'js-fc-2',
      front: '¿Qué es destructuring y para qué sirve en React?',
      back: 'Extraer valores de objetos/arrays en variables en una línea. En React se usa para: extraer props ({ title, onClick }), useState ([val, setVal]), y acceder a datos de APIs.',
    },
    {
      id: 'js-fc-3',
      front: '¿Qué diferencia hay entre spread (...) como operador y como rest parameter?',
      back: 'Spread EXPANDE (vuelca la caja en la mesa): [...arr, nuevo]. Rest AGRUPA (mete lo sobrante en un bolsillo): function(a, ...resto). Mismo símbolo, dirección opuesta.',
      usesAnalogy: true,
    },
    {
      id: 'js-fc-4',
      front: '¿Por qué las arrow functions son importantes en React?',
      back: 'No crean su propio `this` (heredan el del contexto), tienen sintaxis corta ideal para callbacks inline, y son la forma estándar de escribir event handlers en JSX.',
    },
    {
      id: 'js-fc-5',
      front: '¿Cuál es la diferencia entre export default y named export?',
      back: 'Default: uno por archivo, se importa sin llaves (import X from). Named: múltiples por archivo, se importa con llaves (import { X } from). En React, componentes principales suelen ser default.',
    },
    {
      id: 'js-fc-6',
      front: '¿Qué método de array usas para renderizar una lista en JSX?',
      back: '`.map()` — transforma cada elemento en JSX. Nunca `.forEach()` (devuelve undefined). Siempre con prop `key` única en cada elemento.',
    },
    {
      id: 'js-fc-7',
      front: '¿Qué es una Promise y cuál es la forma moderna de manejarla?',
      back: 'Un valor futuro (pendiente → cumplida/rechazada). Forma moderna: async/await. `const data = await fetch(url)` — lee como código síncrono pero no bloquea.',
    },
  ],
  quiz: [
    {
      id: 'js-q-1',
      question: 'Siguiendo la analogía de la caja de herramientas: si const es "el compartimento atornillado", ¿qué pasa si haces `const obj = {}; obj.x = 1;`?',
      options: [
        { id: 'a', text: 'Error: no puedes modificar un const' },
        { id: 'b', text: 'Funciona: const impide reasignar la variable, no mutar su contenido' },
        { id: 'c', text: 'Funciona en modo estricto, falla en modo normal' },
        { id: 'd', text: 'Depende del navegador' },
      ],
      correctOptionId: 'b',
      explanation: 'const impide mover el compartimento (reasignar), pero puedes cambiar lo que hay dentro (mutar propiedades del objeto).',
      whyOthersAreWrong: {
        a: 'Sería cierto si intentaras `obj = otroObjeto`. Agregar/modificar propiedades no es reasignar.',
        c: 'El comportamiento de const es igual en strict mode y normal mode.',
        d: 'const es parte del estándar ES6, comportamiento idéntico en todos los engines modernos.',
      },
      usesAnalogy: true,
    },
    {
      id: 'js-q-2',
      question: '¿Cuál es la forma correcta de extraer `name` y `age` de un objeto con destructuring?',
      options: [
        { id: 'a', text: '`const [name, age] = person;`' },
        { id: 'b', text: '`const { name, age } = person;`' },
        { id: 'c', text: '`const name, age = person.name, person.age;`' },
        { id: 'd', text: '`const { person.name, person.age };`' },
      ],
      correctOptionId: 'b',
      explanation: 'Destructuring de objeto usa llaves {} y extrae por nombre de propiedad.',
      whyOthersAreWrong: {
        a: 'Los corchetes [] son para destructuring de arrays (por posición), no de objetos.',
        c: 'Sintaxis inválida en JavaScript.',
        d: 'Sintaxis inválida — no se usa la notación punto dentro del destructuring.',
      },
    },
    {
      id: 'js-q-3',
      question: '¿Qué devuelve `[...arr1, ...arr2]`?',
      options: [
        { id: 'a', text: 'Un array con arr1 y arr2 como sub-arrays anidados' },
        { id: 'b', text: 'Un nuevo array con todos los elementos de arr1 seguidos de los de arr2' },
        { id: 'c', text: 'Modifica arr1 agregándole los elementos de arr2' },
        { id: 'd', text: 'Un iterador sobre ambos arrays' },
      ],
      correctOptionId: 'b',
      explanation: 'Spread "vuelca" cada array, creando uno NUEVO con todos los elementos concatenados. No muta los originales.',
      whyOthersAreWrong: {
        a: 'Eso sería [arr1, arr2] sin spread. El spread expande los elementos individuales.',
        c: 'Spread crea un array nuevo, nunca muta los originales.',
        d: 'El resultado es un array concreto, no un iterador lazy.',
      },
    },
    {
      id: 'js-q-4',
      question: '¿Por qué usamos `.map()` en vez de `.forEach()` para renderizar listas en React?',
      options: [
        { id: 'a', text: '.map() es más rápido que .forEach()' },
        { id: 'b', text: '.map() devuelve un nuevo array (necesario para JSX); .forEach() devuelve undefined' },
        { id: 'c', text: '.forEach() no existe en ES6+' },
        { id: 'd', text: '.map() permite usar key, .forEach() no' },
      ],
      correctOptionId: 'b',
      explanation: 'JSX necesita un array de elementos para renderizar. .map() lo devuelve; .forEach() devuelve undefined así que React no tendría nada que pintar.',
      whyOthersAreWrong: {
        a: 'La performance es similar. La diferencia es el valor de retorno, no la velocidad.',
        c: '.forEach() existe perfectamente. Solo que no devuelve un array.',
        d: 'key es una prop de JSX, no tiene relación con el método de array que uses.',
      },
    },
    {
      id: 'js-q-5',
      question: '¿Cuál es la diferencia principal entre una arrow function y una function declaration respecto a `this`?',
      options: [
        { id: 'a', text: 'Arrow function no puede recibir parámetros' },
        { id: 'b', text: 'Arrow function hereda `this` del scope donde fue creada (léxico)' },
        { id: 'c', text: 'Arrow function siempre tiene `this` como undefined' },
        { id: 'd', text: 'No hay diferencia, solo es sintaxis más corta' },
      ],
      correctOptionId: 'b',
      explanation: 'Arrow functions no crean su propio `this` — usan el del contexto padre. Por eso son ideales para callbacks en React: no pierdes la referencia.',
      whyOthersAreWrong: {
        a: 'Pueden recibir cualquier número de parámetros, igual que function declaration.',
        c: '`this` no es undefined — es el `this` del scope padre (léxico).',
        d: 'El comportamiento de `this` es una diferencia real y significativa, no solo cosmética.',
      },
    },
    {
      id: 'js-q-6',
      question: '`import { useState } from "react"` — ¿qué tipo de export es `useState`?',
      options: [
        { id: 'a', text: 'Default export' },
        { id: 'b', text: 'Named export' },
        { id: 'c', text: 'CommonJS export' },
        { id: 'd', text: 'Re-export' },
      ],
      correctOptionId: 'b',
      explanation: 'Las llaves {} indican named import. Un default import sería sin llaves: `import React from "react"`.',
      whyOthersAreWrong: {
        a: 'Default import se escribe sin llaves: `import X from "mod"`. Las llaves señalan named.',
        c: 'CommonJS usa require(), no import/export. Esto es ESM (ES Modules).',
        d: 'Re-export es cuando un módulo exporta algo que importó de otro. No cambia cómo lo importas.',
      },
    },
    {
      id: 'js-q-7',
      question: '¿Qué pasa si olvidas `await` al llamar una función async?\n\n```js\nconst data = fetchUsers(); // sin await\nconsole.log(data.length);\n```',
      options: [
        { id: 'a', text: 'Funciona normal, async es solo azúcar sintáctica' },
        { id: 'b', text: '`data` es una Promise, no el array — `data.length` es undefined' },
        { id: 'c', text: 'Lanza un TypeError inmediatamente' },
        { id: 'd', text: 'El código se bloquea esperando la respuesta' },
      ],
      correctOptionId: 'b',
      explanation: 'Sin await, obtienes el objeto Promise (el ticket de la ferretería), no el valor resuelto. La Promise no tiene .length — obtienes undefined.',
      whyOthersAreWrong: {
        a: 'async/await no es solo sintaxis — sin await realmente obtienes una Promise en lugar del valor.',
        c: 'No lanza error inmediato. Promise.length es undefined (no el array), pero no crashea.',
        d: 'JavaScript nunca se bloquea esperando — sin await simplemente continúa con la Promise sin resolver.',
      },
      usesAnalogy: true,
    },
  ],
  difficulty: 'basico',
  estimatedMinutes: 25,
  tags: ['javascript', 'es6', 'const', 'let', 'arrow-functions', 'destructuring', 'spread', 'rest', 'promises', 'modules'],
};
