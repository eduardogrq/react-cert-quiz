import type { Topic } from '../types';

export const jsxTopic: Topic = {
  id: 'jsx',
  title: 'JSX: Markup con superpoderes',
  realWorldAnalogy: {
    title: 'La receta con ingredientes variables',
    scenario:
      'Tienes una receta impresa para un pastel, pero con huecos en blanco: "Agregar ___ tazas de ___". Cada vez que cocinas, rellenas los huecos con lo que hay hoy en la nevera. La estructura de la receta nunca cambia, pero el resultado varía según los ingredientes del día.',
    mapping: [
      { everyday: 'La receta impresa (estructura fija)', technical: 'El markup JSX (HTML-like)' },
      { everyday: 'Los huecos en blanco { ___ }', technical: 'Las llaves {} donde insertas expresiones JS' },
      { everyday: 'Los ingredientes del día', technical: 'Variables, props, cálculos dinámicos' },
      { everyday: 'Hacer la receta varias veces con distintos ingredientes', technical: 'Re-renders con distintos valores de state/props' },
      { everyday: 'Receta que dice "si hay fresas, ponlas; si no, usa mango"', technical: 'Conditional rendering (ternario, &&)' },
    ],
    whereItBreaks:
      'Una receta real se ejecuta secuencialmente (paso 1, paso 2). JSX no es secuencial — es una descripción declarativa de cómo debe verse el UI en un instante dado.',
  },
  keyTerms: [
    {
      term: 'JSX',
      definition: 'Extensión de sintaxis que permite escribir markup tipo HTML dentro de JavaScript.',
      analogyHint: 'La receta que mezcla instrucciones fijas con huecos para rellenar.',
    },
    {
      term: 'Fragment',
      definition: '`<>...</>` — agrupa elementos sin agregar un nodo DOM extra.',
      analogyHint: 'Un clip que junta hojas de receta sin agregarles una carpeta.',
    },
    {
      term: 'curly braces {}',
      definition: 'En JSX, las llaves abren una "ventana a JavaScript" donde va cualquier expresión.',
      analogyHint: 'Los huecos en blanco de la receta donde escribes el ingrediente.',
    },
    {
      term: 'conditional rendering',
      definition: 'Mostrar u ocultar elementos según una condición (ternario, &&, early return).',
      analogyHint: '"Si hay fresas úsalas, si no, ponle mango" — la receta adaptable.',
    },
    {
      term: 'key',
      definition: 'Prop especial que identifica cada elemento de una lista para que React rastrée cambios.',
      analogyHint: 'El número de cada paso de la receta para no confundir el orden.',
    },
    {
      term: 'rendering lists',
      definition: 'Usar .map() sobre un array para generar múltiples elementos JSX.',
      analogyHint: 'Repetir un paso de la receta por cada ingrediente de la lista.',
    },
  ],
  summary:
    'JSX combina markup (estructura) con JavaScript (datos dinámicos) usando llaves `{}`. Cada `{}` es un hueco donde va cualquier expresión JS. Para listas: `.map()` con `key` única. Para condicionales: ternario `a ? b : c`, `&&` o early return. Fragment `<>...</>` agrupa sin DOM extra. JSX se compila a createElement.',
  explanation: `## La receta con huecos

JSX es como una **receta impresa con huecos**: la estructura está fija (div, h1, button...) y los datos se inyectan con llaves:

\`\`\`tsx
function Saludo({ nombre }) {
  return <h1>Hola, {nombre}</h1>;
  //     estructura    hueco → se rellena con el valor de "nombre"
}
\`\`\`

## Reglas fundamentales de JSX

1. **Un solo elemento raíz** (o Fragment):
\`\`\`tsx
// ❌ Dos raíces
return <h1>A</h1><p>B</p>;

// ✅ Fragment (sin nodo DOM extra)
return <><h1>A</h1><p>B</p></>;
\`\`\`

2. **Todas las etiquetas se cierran**: \`<img />\`, \`<br />\`, \`<input />\`

3. **camelCase** para atributos: \`className\`, \`onClick\`, \`htmlFor\`

## Expresiones en llaves

Dentro de \`{}\` va **cualquier expresión** (algo que produce un valor):

\`\`\`tsx
{nombre}              // variable
{2 + 2}              // cálculo
{getTitle()}         // llamada a función
{isActive && <Badge />} // conditional
{items.map(i => ...)}   // lista
\`\`\`

**No van statements** (if, for, switch) — esos van fuera del return.

## Conditional rendering

Tres patrones principales (la receta adaptable: "si hay fresas..."):

\`\`\`tsx
// 1. Ternario — renderizar una u otra cosa
{isLoggedIn ? <Dashboard /> : <Login />}

// 2. && — renderizar o nada
{hasError && <ErrorMsg />}

// 3. Early return — cortar antes del render
if (loading) return <Spinner />;
return <Content />;
\`\`\`

## Rendering lists

Repetir un paso por cada ingrediente de la lista:

\`\`\`tsx
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
\`\`\`

La **key** le dice a React cuál es cuál para no recrear todo cuando la lista cambia. Debe ser única y estable (nunca el índice si la lista cambia de orden).`,
  codeExamples: [
    {
      title: 'JSX con expresiones dinámicas',
      language: 'tsx',
      code: `function ProductCard({ producto }) {
  const precioFinal = producto.precio * (1 - producto.descuento);

  return (
    <div className="card">
      <h2>{producto.nombre}</h2>
      <p>Precio: ${'{precioFinal.toFixed(2)}'}</p>
      {producto.enStock ? (
        <span className="badge-green">Disponible</span>
      ) : (
        <span className="badge-red">Agotado</span>
      )}
    </div>
  );
}`,
      description: 'Variables, cálculos y condicional ternario — todo dentro de llaves.',
    },
    {
      title: 'Renderizar una lista con key',
      language: 'tsx',
      code: `function TodoList({ tareas }) {
  return (
    <ul>
      {tareas.map(tarea => (
        <li key={tarea.id}>
          {tarea.completada ? '✓' : '○'} {tarea.texto}
        </li>
      ))}
    </ul>
  );
}`,
      description: '.map() para la lista + key única + condicional para el icono.',
    },
  ],
  pitfalls: [
    'Usar index como key cuando la lista puede reordenarse — React confunde los elementos y pierde state.',
    'Poner un statement (if/for) dentro de {} — solo expresiones. Usa ternario o saca la lógica fuera del return.',
    '`&&` con número: `{count && <Tag />}` renderiza "0" si count es 0. Usa `{count > 0 && <Tag />}`.',
    'Olvidar cerrar tags auto-closing: `<img>` debe ser `<img />`.',
    'Usar `class` en vez de `className` — JSX requiere camelCase porque es JavaScript.',
    'Fragment con key necesita la forma larga: `<Fragment key={id}>` (la short syntax `<>` no acepta props).',
  ],
  cheatSheet: [
    '`{expresión}` — inyectar JS en JSX (variables, cálculos, funciones)',
    '`<>...</>` — Fragment: agrupa sin nodo DOM extra',
    '`{cond ? <A /> : <B />}` — ternario: uno u otro',
    '`{cond && <A />}` — render condicional: mostrar o nada',
    '`{arr.map(x => <Li key={x.id} />)}` — listas con key única',
    '`className`, `htmlFor`, `onClick` — camelCase para atributos',
    'Todas las tags se cierran: `<img />`, `<br />`, `<input />`',
    'Un solo elemento raíz por return (o Fragment)',
    'Key debe ser única, estable — nunca usar index si la lista cambia',
  ],
  flashcards: [
    {
      id: 'jsx-fc-1',
      front: '¿Qué representan las llaves {} en JSX?',
      back: 'Son los "huecos de la receta" — una ventana a JavaScript donde puedes insertar cualquier expresión (variable, cálculo, ternario, .map()). No van statements como if/for.',
      usesAnalogy: true,
    },
    {
      id: 'jsx-fc-2',
      front: '¿Para qué sirve Fragment (<>...</>)?',
      back: 'Agrupa múltiples elementos sin agregar un nodo DOM extra. Necesario porque JSX requiere un solo elemento raíz en el return.',
    },
    {
      id: 'jsx-fc-3',
      front: '¿Por qué necesitas una key al renderizar listas?',
      back: 'Para que React identifique cada elemento y sepa cuál agregar/quitar/mover sin recrear toda la lista. Debe ser única y estable (ID del dato, no index).',
    },
    {
      id: 'jsx-fc-4',
      front: '¿Cuáles son las 3 formas de conditional rendering en React?',
      back: '1) Ternario: `cond ? <A/> : <B/>` (uno u otro). 2) AND: `cond && <A/>` (mostrar o nada). 3) Early return: `if(x) return <A/>` antes del return principal.',
    },
    {
      id: 'jsx-fc-5',
      front: '¿Qué pasa si usas `{count && <Tag />}` cuando count es 0?',
      back: 'Renderiza "0" literalmente en pantalla. JavaScript evalúa `0 && X` como `0` (falsy pero es un número, React lo pinta). Solución: `{count > 0 && <Tag />}`.',
    },
    {
      id: 'jsx-fc-6',
      front: '¿Puedes poner un `if` dentro de las llaves {} en JSX?',
      back: 'No. Las llaves solo aceptan expresiones (algo que produce un valor). `if` es un statement. Usa ternario dentro de {}, o mueve el if fuera del return.',
    },
    {
      id: 'jsx-fc-7',
      front: '¿Por qué no debes usar el índice del array como key?',
      back: 'Si la lista se reordena, agrega o elimina elementos, el índice cambia para el mismo dato. React confunde qué elemento es cuál, causando bugs de state y renders incorrectos.',
    },
  ],
  quiz: [
    {
      id: 'jsx-q-1',
      question: 'Siguiendo la analogía de la receta: si las llaves {} son "los huecos para rellenar", ¿cuál de estas NO es válida dentro de un hueco?',
      options: [
        { id: 'a', text: '`{usuario.nombre}`' },
        { id: 'b', text: '`{if (x) return "hola"}`' },
        { id: 'c', text: '`{items.length > 0 && <List />}`' },
        { id: 'd', text: '`{calcularTotal()}`' },
      ],
      correctOptionId: 'b',
      explanation: 'Las llaves solo aceptan expresiones (que producen un valor). `if` es un statement — no produce un valor, no puede ir dentro del hueco.',
      whyOthersAreWrong: {
        a: 'Acceso a propiedad es una expresión válida — produce el valor de nombre.',
        c: '&& es un operador que produce un valor (el componente o false). Es una expresión.',
        d: 'Llamada a función es una expresión — produce lo que retorna la función.',
      },
      usesAnalogy: true,
    },
    {
      id: 'jsx-q-2',
      question: '¿Cuál es la forma correcta de renderizar condicionalmente un mensaje de error?',
      options: [
        { id: 'a', text: '`{if (error) <ErrorMsg />}`' },
        { id: 'b', text: '`{error && <ErrorMsg />}`' },
        { id: 'c', text: '`{error ? <ErrorMsg />}`' },
        { id: 'd', text: '`<ErrorMsg show={error} />`' },
      ],
      correctOptionId: 'b',
      explanation: '`&&` evalúa: si error es truthy, renderiza <ErrorMsg/>; si es falsy, no renderiza nada. Es la forma idiomática.',
      whyOthersAreWrong: {
        a: 'if es un statement, no puede ir dentro de llaves en JSX.',
        c: 'Ternario incompleto — falta la parte del `:` (qué renderizar si no hay error).',
        d: 'Técnicamente funciona si ErrorMsg implementa esa lógica internamente, pero no es conditional rendering nativo de React.',
      },
    },
    {
      id: 'jsx-q-3',
      question: '¿Qué problema tiene este código?\n\n```jsx\n{users.map(user => <Card name={user.name} />)}\n```',
      options: [
        { id: 'a', text: 'Falta el prop key en cada Card' },
        { id: 'b', text: '.map() no funciona en JSX' },
        { id: 'c', text: 'Necesita return explícito' },
        { id: 'd', text: 'Card debería ser <card> en minúscula' },
      ],
      correctOptionId: 'a',
      explanation: 'Al renderizar listas, cada elemento necesita una prop key única para que React identifique cambios eficientemente.',
      whyOthersAreWrong: {
        b: '.map() devuelve un array de elementos JSX — funciona perfecto.',
        c: 'Arrow function con paréntesis () tiene return implícito. Sería necesario solo con llaves {}.',
        d: 'Componentes propios SIEMPRE van en PascalCase. Minúscula es para elementos HTML nativos.',
      },
    },
    {
      id: 'jsx-q-4',
      question: '¿Cuál es la diferencia entre `<Fragment>` y `<div>` como wrapper?',
      options: [
        { id: 'a', text: 'Fragment es más rápido de renderizar' },
        { id: 'b', text: 'Fragment no agrega un nodo al DOM; div sí' },
        { id: 'c', text: 'Fragment puede recibir event handlers; div no' },
        { id: 'd', text: 'No hay diferencia, son equivalentes' },
      ],
      correctOptionId: 'b',
      explanation: 'Fragment es un contenedor invisible — agrupa JSX sin contaminar el DOM con nodos extra. Útil para no romper layouts CSS.',
      whyOthersAreWrong: {
        a: 'La ventaja no es performance sino no agregar markup innecesario al DOM.',
        c: 'Es al revés — Fragment NO puede recibir props (excepto key). div sí recibe handlers.',
        d: 'Son fundamentalmente diferentes: uno agrega un nodo DOM, el otro no.',
      },
    },
    {
      id: 'jsx-q-5',
      question: '¿Qué se renderiza si `count` vale 0?\n\n```jsx\n{count && <Notification />}\n```',
      options: [
        { id: 'a', text: 'Nada (vacío)' },
        { id: 'b', text: 'El componente Notification' },
        { id: 'c', text: 'El número "0" como texto' },
        { id: 'd', text: 'Error de compilación' },
      ],
      correctOptionId: 'c',
      explanation: '`0 && X` evalúa a `0` (falsy pero tipo number). React renderiza números — por eso aparece "0" en pantalla. Trampa clásica.',
      whyOthersAreWrong: {
        a: 'Sería nada si fuera `null`, `undefined`, `false` o `""`. Pero 0 es un número que React renderiza.',
        b: 'Solo renderizaría Notification si count fuera truthy (≥1).',
        d: 'Es código válido, no hay error de compilación. El problema es semántico.',
      },
    },
  ],
  difficulty: 'basico',
  estimatedMinutes: 18,
  prerequisites: ['javascript-es6'],
  tags: ['jsx', 'fragment', 'conditional-rendering', 'lists', 'key', 'expressions'],
};
