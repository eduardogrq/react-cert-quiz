import type { Topic } from '../types';

export const intermediateComponentsTopic: Topic = {
  id: 'intermediate-components',
  courseId: 'react-level-2',
  title: 'Componentes Intermedios: Pureza, StrictMode y el Árbol de UI',
  realWorldAnalogy: {
    title: 'La fábrica de helados artesanales',
    scenario:
      'En una fábrica de helados, cada máquina recibe ingredientes por una ventanilla y entrega un helado terminado por otra. La máquina nunca sale a buscar ingredientes por su cuenta, nunca modifica los ingredientes del vecino, y si le das los mismos ingredientes dos veces, siempre produce el mismo helado exacto. El inspector de calidad pasa cada receta dos veces por la máquina para verificar que el resultado sea idéntico.',
    mapping: [
      { everyday: 'La máquina de helados', technical: 'Pure component' },
      { everyday: 'Ingredientes que entran por la ventanilla', technical: 'Props (entradas del componente)' },
      { everyday: 'Helado idéntico cada vez con los mismos ingredientes', technical: 'Mismo output dado el mismo input' },
      { everyday: 'No tocar los ingredientes del vecino', technical: 'Sin side effects durante el render' },
      { everyday: 'El inspector que pasa la receta dos veces', technical: 'StrictMode (doble invocación)' },
      { everyday: 'El organigrama de la fábrica con máquinas conectadas', technical: 'El árbol de componentes (UI tree)' },
    ],
    whereItBreaks:
      'En una fábrica real, las máquinas se desgastan y producen variaciones con el tiempo. En React, un pure component SIEMPRE debe producir el mismo resultado con los mismos props, sin excepción.',
  },
  keyTerms: [
    {
      term: 'Pure Component',
      definition: 'Componente que dado el mismo input (props) siempre retorna el mismo JSX, sin modificar variables externas durante el render.',
      analogyHint: 'Máquina que siempre da el mismo helado con los mismos ingredientes.',
    },
    {
      term: 'Side Effect',
      definition: 'Cualquier operación que afecta algo fuera del componente durante el render: mutar variables externas, hacer fetch, modificar el DOM.',
      analogyHint: 'La máquina saliendo a robar ingredientes del vecino.',
    },
    {
      term: 'StrictMode',
      definition: 'Componente de React que en desarrollo invoca los componentes dos veces para detectar impurezas y side effects accidentales.',
      analogyHint: 'Inspector que prueba la receta dos veces para verificar consistencia.',
    },
    {
      term: 'Idempotent',
      definition: 'Propiedad de una función que produce el mismo resultado sin importar cuántas veces se ejecute con los mismos argumentos.',
      analogyHint: 'Mismos ingredientes, mismo helado, siempre.',
    },
    {
      term: 'Component Tree',
      definition: 'Estructura jerárquica donde cada componente puede contener otros componentes hijos, formando un árbol que React recorre para construir la UI.',
      analogyHint: 'Organigrama de la fábrica: quién alimenta a quién.',
    },
    {
      term: 'Render',
      definition: 'El proceso donde React llama a tu función componente para obtener el JSX que describe la UI.',
      analogyHint: 'Encender la máquina para que procese los ingredientes.',
    },
  ],
  summary:
    'Un componente puro es como una máquina confiable: mismos ingredientes, mismo resultado, sin tocar nada ajeno. StrictMode actúa como inspector de calidad ejecutando componentes dos veces en desarrollo para detectar impurezas. React es quien decide cuándo y cómo llamar a tus componentes — nunca los invocas directamente. Toda la UI forma un árbol jerárquico que React recorre de arriba hacia abajo para construir lo que el usuario ve en pantalla.',
  explanation: `## Componentes puros: la máquina confiable

Recordemos la **fábrica de helados**: cada máquina recibe ingredientes (props) y entrega siempre el mismo helado. Un componente puro funciona igual:

- **Misma entrada → misma salida**: si le pasas los mismos props, siempre retorna el mismo JSX.
- **Sin side effects durante el render**: no modifica variables externas, no hace fetch, no muta objetos que ya existían.

\`\`\`tsx
// ✅ Componente puro — misma entrada, misma salida
function Precio({ monto }: { monto: number }) {
  return <span>\${monto.toFixed(2)}</span>;
}
\`\`\`

\`\`\`tsx
// ❌ Impuro — modifica una variable externa durante el render
let contador = 0;
function Etiqueta() {
  contador++; // side effect durante render
  return <span>Visitante #{contador}</span>;
}
\`\`\`

## StrictMode: el inspector de calidad

En nuestra fábrica, el inspector pasa cada receta **dos veces** por la máquina. Si el resultado difiere, algo anda mal. \`<StrictMode>\` hace exactamente eso en desarrollo:

- Llama a tus componentes **dos veces** por render.
- Ejecuta Effects dos veces (mount → unmount → mount).
- Si tu componente es puro, ambas ejecuciones producen el mismo resultado y no notas diferencia.
- Si hay side effects ocultos, el doble render los expone.

\`\`\`tsx
import { StrictMode } from 'react';

// En tu entry point
<StrictMode>
  <App />
</StrictMode>
\`\`\`

## Reglas de componentes y hooks

React impone reglas para que la "fábrica" funcione predeciblemente:

1. **Los componentes deben ser idempotentes** — mismos inputs, mismo output.
2. **No llames hooks condicionalmente** — React depende del orden de llamada.
3. **No mutes valores que no creaste durante el render** — puedes mutar variables locales creadas en ESE render.
4. **Los props y el state son inmutables** — nunca los mutes directamente.

## React llama a tus componentes — tú no

Nunca escribas \`MiComponente()\` directamente. React es el encargado de la fábrica: él decide **cuándo** encender cada máquina, en qué orden, y cuántas veces. Tú solo declaras \`<MiComponente />\` y React se encarga del resto.

\`\`\`tsx
// ❌ Nunca hagas esto
const resultado = MiComponente({ nombre: 'Ana' });

// ✅ Declara el componente en JSX y deja que React lo invoque
<MiComponente nombre="Ana" />
\`\`\`

## El árbol de UI

Piensa en el **organigrama de la fábrica**: hay una máquina principal (root) que alimenta a otras, que a su vez alimentan a las siguientes. Eso es el component tree:

- React construye un árbol donde cada nodo es un componente.
- Los padres pasan props a los hijos.
- React recorre el árbol de arriba hacia abajo para determinar qué renderizar.
- Cuando un nodo cambia, React re-renderiza ese subárbol.

Entender el árbol te ayuda a razonar sobre dónde vive el state, cómo fluyen los datos, y por qué un re-render afecta a ciertos componentes.`,
  codeExamples: [
    {
      title: 'Componente puro vs impuro',
      language: 'tsx',
      code: `// ✅ Puro: sin side effects, misma entrada → misma salida
function Saludo({ nombre }: { nombre: string }) {
  return <h1>Hola, {nombre}</h1>;
}

// ❌ Impuro: modifica variable externa en cada render
let llamadas = 0;
function ContadorRoto() {
  llamadas++; // Esto cambia en cada render
  return <p>Llamada #{llamadas}</p>;
}`,
      description: 'Un componente puro no tiene side effects; uno impuro modifica estado externo durante el render.',
    },
    {
      title: 'StrictMode detectando impurezas',
      language: 'tsx',
      code: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// StrictMode ejecuta componentes dos veces en desarrollo
// para detectar side effects accidentales
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
      description: 'StrictMode envuelve la app y ejecuta componentes dos veces en dev para exponer impurezas.',
    },
    {
      title: 'Mutación local permitida vs prohibida',
      language: 'tsx',
      code: `function ListaDeCompras({ items }: { items: string[] }) {
  // ✅ Puedes mutar algo que CREASTE en este render
  const ordenados: string[] = [];
  for (const item of items) {
    ordenados.push(item);
  }
  ordenados.sort();

  // ❌ NUNCA mutes los props directamente
  // items.sort(); // Esto muta el array original

  return (
    <ul>
      {ordenados.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}`,
      description: 'Puedes mutar variables locales creadas dentro del render, pero jamás los props ni variables externas.',
    },
    {
      title: 'Árbol de componentes',
      language: 'tsx',
      code: `// El árbol de UI refleja la jerarquía de componentes
//
//        App
//       /   \\
//   Header   Main
//     |      /   \\
//   Logo  Lista  Detalle
//          |
//        Item[]

function App() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}

function Header() {
  return <nav><Logo /></nav>;
}

function Main() {
  return (
    <div>
      <Lista />
      <Detalle />
    </div>
  );
}`,
      description: 'La estructura JSX define el árbol que React recorre para construir la UI.',
    },
  ],
  pitfalls: [
    'Modificar variables externas o globales dentro del cuerpo del componente (fuera de event handlers o Effects).',
    'Llamar componentes como funciones normales (MiComponente()) en lugar de usar JSX (<MiComponente />).',
    'Confundir "puro durante el render" con "no puede tener side effects nunca" — los event handlers y useEffect SÍ pueden tener side effects.',
    'Creer que StrictMode afecta producción — solo actúa en desarrollo, sin costo en producción.',
    'Mutar props o state directamente pensando que React detectará el cambio.',
    'Ignorar las advertencias de StrictMode cuando el doble render expone bugs.',
  ],
  cheatSheet: [
    'Pure component = mismos props → mismo JSX, sin tocar nada externo durante render.',
    'Side effects van en event handlers o useEffect, NUNCA en el cuerpo del componente.',
    'StrictMode llama componentes 2x en dev para detectar impurezas — no afecta producción.',
    'React llama a tus componentes — NUNCA los invoques como funciones.',
    'Puedes mutar variables que creaste EN ESE render; jamás props ni state.',
    'El component tree define la jerarquía padre→hijo y el flujo de datos.',
    'Hooks siempre en el nivel superior del componente, nunca en condicionales o loops.',
    'Componente idempotente: N ejecuciones con mismos props = mismo resultado.',
  ],
  flashcards: [
    {
      id: 'int-comp-fc-1',
      front: '¿Qué significa que un componente React sea "puro"?',
      back: 'Que dado el mismo input (props), siempre retorna el mismo JSX sin modificar variables externas ni causar side effects durante el render.',
    },
    {
      id: 'int-comp-fc-2',
      front: 'En la analogía de la fábrica de helados, ¿qué representa el inspector que pasa la receta dos veces?',
      back: 'StrictMode, que ejecuta los componentes dos veces en desarrollo para verificar que sean puros (que produzcan el mismo resultado ambas veces).',
      usesAnalogy: true,
    },
    {
      id: 'int-comp-fc-3',
      front: '¿Dónde SÍ puedes tener side effects en un componente React?',
      back: 'En event handlers (onClick, onChange, etc.) y en useEffect. Nunca directamente en el cuerpo de la función componente durante el render.',
    },
    {
      id: 'int-comp-fc-4',
      front: '¿Por qué no debes llamar un componente como función (MiComponente()) en lugar de usar JSX (<MiComponente />)?',
      back: 'Porque React necesita controlar cuándo y cómo invocar tus componentes para manejar correctamente el state, los hooks y el reconciliation. Llamarlo directo rompe estas garantías.',
    },
    {
      id: 'int-comp-fc-5',
      front: '¿Qué es el component tree (árbol de componentes)?',
      back: 'La estructura jerárquica donde cada componente puede contener hijos, formando un árbol que React recorre de arriba hacia abajo para construir la UI. Define el flujo de datos (props) y qué se re-renderiza.',
    },
    {
      id: 'int-comp-fc-6',
      front: 'En la fábrica de helados, ¿por qué la máquina no debe "salir a buscar ingredientes del vecino"?',
      back: 'Porque eso representa un side effect: modificar o leer estado externo durante el render. Un componente puro solo usa lo que recibe por sus props (la ventanilla de ingredientes).',
      usesAnalogy: true,
    },
    {
      id: 'int-comp-fc-7',
      front: '¿StrictMode afecta el rendimiento en producción?',
      back: 'No. StrictMode solo actúa en desarrollo — no agrega ningún código ni comportamiento adicional en producción.',
    },
    {
      id: 'int-comp-fc-8',
      front: '¿Puedes mutar una variable local que creaste dentro del render?',
      back: 'Sí. Puedes mutar variables y objetos que creaste en ESE render (mutación local). Lo prohibido es mutar props, state, o variables que existían antes del render.',
    },
  ],
  quiz: [
    {
      id: 'int-comp-q-1',
      question: '¿Cuál de los siguientes componentes es IMPURO?',
      options: [
        { id: 'int-comp-q-1-a', text: 'function Hola({ nombre }) { return <h1>{nombre}</h1>; }' },
        { id: 'int-comp-q-1-b', text: 'let count = 0; function Ticket() { count++; return <span>{count}</span>; }' },
        { id: 'int-comp-q-1-c', text: 'function Suma({ a, b }) { const total = a + b; return <p>{total}</p>; }' },
        { id: 'int-comp-q-1-d', text: 'function Lista({ items }) { const copia = [...items].sort(); return <ul>{copia.map(i => <li key={i}>{i}</li>)}</ul>; }' },
      ],
      correctOptionId: 'int-comp-q-1-b',
      explanation: 'Ticket modifica la variable externa `count` durante el render, lo que es un side effect que lo hace impuro.',
      whyOthersAreWrong: {
        'int-comp-q-1-a': 'Hola solo usa props y retorna JSX sin side effects — es puro.',
        'int-comp-q-1-c': 'Suma crea una variable local derivada de props sin efectos externos — es puro.',
        'int-comp-q-1-d': 'Lista crea una copia con spread antes de sort, no muta los props originales — es puro.',
      },
    },
    {
      id: 'int-comp-q-2',
      question: 'En la analogía de la fábrica de helados, ¿qué sucede si el inspector (StrictMode) obtiene un resultado diferente la segunda vez que pasa la receta?',
      options: [
        { id: 'int-comp-q-2-a', text: 'Significa que la máquina es confiable y eficiente.' },
        { id: 'int-comp-q-2-b', text: 'Significa que la máquina tiene un side effect oculto — no es pura.' },
        { id: 'int-comp-q-2-c', text: 'Significa que StrictMode tiene un bug.' },
        { id: 'int-comp-q-2-d', text: 'Significa que hay que desactivar StrictMode.' },
      ],
      correctOptionId: 'int-comp-q-2-b',
      explanation: 'Si el doble render produce resultados diferentes, el componente tiene side effects que lo hacen impuro — exactamente lo que StrictMode busca detectar.',
      whyOthersAreWrong: {
        'int-comp-q-2-a': 'Un resultado diferente indica lo opuesto: la máquina NO es confiable.',
        'int-comp-q-2-c': 'StrictMode funciona correctamente al exponer la impureza — no es un bug de StrictMode.',
        'int-comp-q-2-d': 'La solución es arreglar el componente impuro, no ocultar el problema desactivando StrictMode.',
      },
      usesAnalogy: true,
    },
    {
      id: 'int-comp-q-3',
      question: '¿Cuál es la forma correcta de usar un componente en React?',
      options: [
        { id: 'int-comp-q-3-a', text: 'const result = MiComponente({ prop: "valor" });' },
        { id: 'int-comp-q-3-b', text: '<MiComponente prop="valor" />' },
        { id: 'int-comp-q-3-c', text: 'MiComponente.render({ prop: "valor" });' },
        { id: 'int-comp-q-3-d', text: 'new MiComponente({ prop: "valor" }).render();' },
      ],
      correctOptionId: 'int-comp-q-3-b',
      explanation: 'React necesita controlar la invocación de componentes. Al usar JSX (<MiComponente />), le das a React el control para manejar state, hooks y reconciliation.',
      whyOthersAreWrong: {
        'int-comp-q-3-a': 'Llamar directamente como función impide que React gestione hooks, state y el ciclo de vida correctamente.',
        'int-comp-q-3-c': '.render() no es una API de componentes funcionales en React.',
        'int-comp-q-3-d': 'Los componentes funcionales no se instancian con new — eso era para class components y aun así no se hacía manualmente.',
      },
    },
    {
      id: 'int-comp-q-4',
      question: '¿Qué afirmación sobre StrictMode es CORRECTA?',
      options: [
        { id: 'int-comp-q-4-a', text: 'Ejecuta los componentes dos veces tanto en desarrollo como en producción.' },
        { id: 'int-comp-q-4-b', text: 'Solo actúa en desarrollo; no tiene efecto en producción.' },
        { id: 'int-comp-q-4-c', text: 'Mejora el rendimiento de la aplicación en producción.' },
        { id: 'int-comp-q-4-d', text: 'Es obligatorio para que los hooks funcionen.' },
      ],
      correctOptionId: 'int-comp-q-4-b',
      explanation: 'StrictMode es exclusivamente una herramienta de desarrollo. En producción no ejecuta código adicional ni afecta el rendimiento.',
      whyOthersAreWrong: {
        'int-comp-q-4-a': 'El doble render SOLO ocurre en desarrollo — en producción no hay invocación extra.',
        'int-comp-q-4-c': 'StrictMode no mejora rendimiento; es una herramienta de detección de bugs que no existe en producción.',
        'int-comp-q-4-d': 'Los hooks funcionan sin StrictMode — es opcional (aunque muy recomendado).',
      },
    },
    {
      id: 'int-comp-q-5',
      question: '¿Cuál de estas mutaciones es PERMITIDA dentro de un componente durante el render?',
      options: [
        { id: 'int-comp-q-5-a', text: 'Modificar un prop recibido: props.items.push(nuevo)' },
        { id: 'int-comp-q-5-b', text: 'Modificar una variable global: window.titulo = "nuevo"' },
        { id: 'int-comp-q-5-c', text: 'Mutar un array local creado en ese render: const arr = []; arr.push(item);' },
        { id: 'int-comp-q-5-d', text: 'Modificar el state directamente: state.count = 5' },
      ],
      correctOptionId: 'int-comp-q-5-c',
      explanation: 'Puedes mutar variables y objetos que creaste dentro del mismo render (mutación local). Nadie más los ha visto todavía, así que no hay side effect.',
      whyOthersAreWrong: {
        'int-comp-q-5-a': 'Mutar props rompe la pureza — los props pertenecen al componente padre.',
        'int-comp-q-5-b': 'Modificar variables globales es un side effect que afecta código externo.',
        'int-comp-q-5-d': 'Mutar state directamente no dispara re-render y rompe las garantías de React.',
      },
    },
    {
      id: 'int-comp-q-6',
      question: '¿Qué describe mejor el component tree (árbol de componentes)?',
      options: [
        { id: 'int-comp-q-6-a', text: 'Un listado plano de todos los componentes en orden alfabético.' },
        { id: 'int-comp-q-6-b', text: 'La estructura jerárquica padre-hijo que React recorre para construir la UI.' },
        { id: 'int-comp-q-6-c', text: 'El historial de renders de cada componente.' },
        { id: 'int-comp-q-6-d', text: 'El sistema de archivos donde viven los componentes en el proyecto.' },
      ],
      correctOptionId: 'int-comp-q-6-b',
      explanation: 'El component tree es la jerarquía padre-hijo que React construye a partir de tu JSX y recorre de arriba hacia abajo para determinar qué renderizar.',
      whyOthersAreWrong: {
        'int-comp-q-6-a': 'No es un listado plano — es una estructura jerárquica con relaciones padre-hijo.',
        'int-comp-q-6-c': 'El historial de renders no es el tree — el tree representa la estructura actual de la UI.',
        'int-comp-q-6-d': 'La estructura de archivos del proyecto no es el component tree de React — son conceptos distintos.',
      },
    },
    {
      id: 'int-comp-q-7',
      question: 'En la fábrica de helados, ¿qué representa el organigrama que muestra qué máquina alimenta a cuál?',
      options: [
        { id: 'int-comp-q-7-a', text: 'El virtual DOM.' },
        { id: 'int-comp-q-7-b', text: 'El component tree (árbol de UI).' },
        { id: 'int-comp-q-7-c', text: 'El state management global.' },
        { id: 'int-comp-q-7-d', text: 'El event system de React.' },
      ],
      correctOptionId: 'int-comp-q-7-b',
      explanation: 'El organigrama de la fábrica, donde se ve qué máquina alimenta a las demás, representa el component tree: la jerarquía de componentes padre-hijo.',
      whyOthersAreWrong: {
        'int-comp-q-7-a': 'El virtual DOM es una representación interna de React, no la estructura jerárquica de componentes que tú defines.',
        'int-comp-q-7-c': 'El state management global no tiene relación con la estructura jerárquica de la fábrica.',
        'int-comp-q-7-d': 'El event system maneja interacciones del usuario, no la estructura organizacional de componentes.',
      },
      usesAnalogy: true,
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 20,
  prerequisites: ['components'],
  tags: ['pure-components', 'strict-mode', 'component-rules', 'ui-tree', 'idempotent', 'side-effects'],
  codeChallenge: {
    instruction: 'Completa el componente compuesto usando Context para comunicar padre e hijos.',
    template: `const TabsContext = React.{{create_context}}(null);

function Tabs({ children, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.{{provider}} value={{ active, setActive }}>
      {{{children_prop}}}
    </TabsContext.{{provider}}>
  );
}

function Tab({ id, children }: TabProps) {
  const { active, setActive } = React.{{use_context}}(TabsContext);
  return (
    <button onClick={() => setActive(id)} data-active={active === id}>
      {children}
    </button>
  );
}`,
    language: 'tsx',
    blanks: [
      { id: 'create_context', answers: ['createContext'], placeholder: '???' },
      { id: 'provider', answers: ['Provider'], placeholder: '???' },
      { id: 'children_prop', answers: ['children'], placeholder: '???' },
      { id: 'use_context', answers: ['useContext'], placeholder: '???' },
    ],
    hint: 'Los componentes compuestos usan createContext + Provider para compartir estado entre padre e hijos sin prop drilling.',
  },
};
