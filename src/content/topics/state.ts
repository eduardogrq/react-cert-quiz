import type { Topic } from '../types';

export const stateTopic: Topic = {
  id: 'state',
  title: 'State: La memoria del componente',
  realWorldAnalogy: {
    title: 'La pizarra mágica del restaurante',
    scenario:
      'En la cocina hay una pizarra donde se apuntan los pedidos. Pero tiene una regla rara: no puedes borrar y reescribir tú mismo. Le dices al encargado "cambia la mesa 3 a postre" y él borra la pizarra entera, la reescribe con el cambio incluido, y todos los cocineros leen la versión nueva de golpe.',
    mapping: [
      { everyday: 'La pizarra', technical: 'state' },
      { everyday: 'El encargado que reescribe', technical: 'setState / función actualizadora' },
      { everyday: 'Reescribir toda la pizarra', technical: 're-render del componente' },
      { everyday: 'Los cocineros leyendo la pizarra', technical: 'El JSX consumiendo el state' },
      { everyday: '"No borres tú directo"', technical: 'Inmutabilidad: nunca mutar state directamente' },
    ],
    whereItBreaks:
      'En un restaurante real puedes tachar un renglón y listo. En React, mutar el state directo NO dispara re-render — por eso siempre pasas por el encargado (setState).',
  },
  keyTerms: [
    {
      term: 'state',
      definition: 'Datos internos de un componente que, al cambiar, provocan un re-render.',
      analogyHint: 'Lo que está escrito en la pizarra en este momento.',
    },
    {
      term: 'useState',
      definition: 'Hook que declara una variable de state y devuelve [valor, setter].',
      analogyHint: 'Instalar la pizarra y asignarle un encargado.',
    },
    {
      term: 're-render',
      definition: 'React vuelve a ejecutar el componente para reflejar el nuevo state en pantalla.',
      analogyHint: 'El encargado borra y reescribe toda la pizarra.',
    },
    {
      term: 'immutability',
      definition: 'Principio de no modificar el state actual sino crear una copia nueva con los cambios.',
      analogyHint: 'No taches la pizarra tú — dile al encargado qué cambiar.',
    },
    {
      term: 'snapshot',
      definition: 'Dentro de un render, el state es una "foto" fija — no cambia aunque llames setState.',
      analogyHint: 'Los cocineros leen la pizarra tal como estaba cuando voltearon a verla.',
    },
    {
      term: 'batching',
      definition: 'React agrupa múltiples setStates en un solo re-render para mejor rendimiento.',
      analogyHint: 'El encargado espera a que le digas todos los cambios antes de reescribir.',
    },
  ],
  summary:
    'El state es la memoria privada de un componente. Se declara con `useState`, se actualiza solo con su setter (nunca mutando directo), y cada cambio dispara un re-render. Dentro de un render, el state es un snapshot fijo. React agrupa (batches) múltiples actualizaciones para no re-renderizar de más.',
  explanation: `## ¿Qué es el state?

Volvamos a la **pizarra del restaurante**: cada componente tiene su propia pizarra donde apunta los datos que necesita para mostrarse. Cuando un dato cambia, el componente se "redibuja" con la información nueva.

## ¿Cómo se declara?

\`\`\`tsx
const [contador, setContador] = useState(0);
//     pizarra   encargado        valor inicial
\`\`\`

\`useState\` devuelve un par: el valor actual (la pizarra) y la función para cambiarlo (el encargado).

## Inmutabilidad: la regla de oro

Igual que en el restaurante **no puedes tachar tú mismo** la pizarra, en React nunca haces:

\`\`\`tsx
// ❌ MAL — mutar directo no dispara re-render
state.items.push(nuevoItem);
\`\`\`

Siempre creas una copia nueva:

\`\`\`tsx
// ✅ BIEN — le dices al encargado
setItems([...items, nuevoItem]);
\`\`\`

## State como snapshot

Cuando el encargado reescribe la pizarra, los cocineros leen **la versión que quedó en ese momento**. Si dentro del mismo render llamas \`setState\` tres veces con el valor actual, las tres leen la misma "foto":

\`\`\`tsx
function handleClick() {
  setCount(count + 1); // count es 0 → agenda "poner 1"
  setCount(count + 1); // count SIGUE siendo 0 → agenda "poner 1"
  setCount(count + 1); // count SIGUE siendo 0 → agenda "poner 1"
  // Resultado: count = 1, no 3
}
\`\`\`

Para acumular, usa el **updater function** (le dices al encargado "suma 1 a lo que haya"):

\`\`\`tsx
setCount(prev => prev + 1); // prev = 0 → 1
setCount(prev => prev + 1); // prev = 1 → 2
setCount(prev => prev + 1); // prev = 2 → 3
\`\`\`

## Batching

React es eficiente: si en un mismo evento llamas a varios setters, no reescribe la pizarra por cada uno — espera a que termines y hace **un solo re-render**. Esto es batching.

## Objetos y arrays en state

Cuando el state es un objeto o array, la regla de la pizarra aplica igual: **nunca mutar, siempre copiar**.

\`\`\`tsx
// Objeto: spread + cambio
setPerson({ ...person, name: 'Nuevo nombre' });

// Array: crear uno nuevo
setItems(items.filter(item => item.id !== idABorrar));
setItems([...items, nuevoItem]);
setItems(items.map(item => item.id === id ? { ...item, done: true } : item));
\`\`\``,
  codeExamples: [
    {
      title: 'Contador básico',
      language: 'tsx',
      code: `function Contador() {
  // pizarra = pedidos, encargado = setPedidos
  const [pedidos, setPedidos] = useState(0);

  return (
    <button onClick={() => setPedidos(pedidos + 1)}>
      Pedidos: {pedidos}
    </button>
  );
}`,
      description: 'El ejemplo más simple de useState: un contador que se incrementa al hacer click.',
    },
    {
      title: 'Updater function para acumular',
      language: 'tsx',
      code: `function ContadorTriple() {
  const [count, setCount] = useState(0);

  function sumarTres() {
    // Cada updater recibe el valor MÁS RECIENTE
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  }

  return <button onClick={sumarTres}>Count: {count}</button>;
}`,
      description: 'Usando updater function para que cada setState vea el valor actualizado, no el snapshot.',
    },
    {
      title: 'Actualizar objeto en state',
      language: 'tsx',
      code: `function Formulario() {
  const [persona, setPersona] = useState({
    nombre: '',
    edad: 0,
  });

  // ✅ Spread para crear copia nueva
  function cambiarNombre(nuevoNombre: string) {
    setPersona({ ...persona, nombre: nuevoNombre });
  }

  // ❌ NUNCA hacer esto:
  // persona.nombre = 'otro'; // no dispara re-render
}`,
      description: 'Spread operator para actualizar objetos sin mutar el state original.',
    },
  ],
  pitfalls: [
    'Mutar el state directo (push, splice, asignar propiedades) NO dispara re-render.',
    'Leer el state justo después de setState devuelve el valor VIEJO (es un snapshot).',
    'Llamar setState(value + 1) tres veces seguidas NO suma 3 — usa updater: setState(prev => prev + 1).',
    'Olvidar el spread al actualizar objetos: setState({ campo: nuevo }) BORRA los demás campos.',
    'Poner en state cosas que se pueden calcular de otros valores (state derivado innecesario).',
    'Inicializar state con props y esperar que se actualice si la prop cambia — el state inicial se usa SOLO en el primer render.',
  ],
  cheatSheet: [
    '`const [val, setVal] = useState(inicial)` — declarar state',
    '`setVal(nuevo)` — reemplazar valor completo',
    '`setVal(prev => prev + 1)` — updater cuando dependes del valor anterior',
    '`setObj({ ...obj, key: nuevo })` — actualizar objeto (spread)',
    '`setArr([...arr, nuevo])` — agregar a array',
    '`setArr(arr.filter(x => x.id !== id))` — eliminar de array',
    '`setArr(arr.map(x => x.id === id ? {...x, done: true} : x))` — actualizar item en array',
    'State es snapshot: dentro de un render, el valor no cambia',
    'React hace batching: múltiples setStates = 1 re-render',
    'Nunca mutar. Siempre copiar.',
  ],
  flashcards: [
    {
      id: 'state-fc-1',
      front: '¿Qué devuelve useState?',
      back: 'Un array con dos elementos: [valorActual, funciónSetter]. El valor es la "pizarra" y el setter es el "encargado".',
      usesAnalogy: true,
    },
    {
      id: 'state-fc-2',
      front: '¿Por qué no puedes mutar el state directamente?',
      back: 'Porque React no detecta el cambio y no dispara re-render. Es como tachar la pizarra sin avisarle al encargado — los cocineros nunca se enteran.',
      usesAnalogy: true,
    },
    {
      id: 'state-fc-3',
      front: '¿Qué es el "state as snapshot"?',
      back: 'Dentro de un render, el state es una foto fija. Aunque llames setState, el valor que lees en ese mismo render NO cambia hasta el próximo render.',
    },
    {
      id: 'state-fc-4',
      front: '¿Cuál es la diferencia entre setState(count + 1) y setState(prev => prev + 1)?',
      back: 'La primera usa el snapshot (valor congelado del render actual). La segunda (updater) recibe siempre el valor más reciente, permitiendo acumular cambios.',
    },
    {
      id: 'state-fc-5',
      front: '¿Cómo actualizas un objeto en state sin perder las demás propiedades?',
      back: 'Con spread: setState({ ...obj, propiedad: nuevoValor }). Sin spread, las otras propiedades se pierden.',
    },
    {
      id: 'state-fc-6',
      front: '¿Qué es batching en React?',
      back: 'React agrupa múltiples llamadas a setState dentro del mismo evento en un solo re-render. Como el encargado que espera a oír todos los cambios antes de reescribir la pizarra.',
      usesAnalogy: true,
    },
    {
      id: 'state-fc-7',
      front: '¿Cómo eliminas un elemento de un array en state?',
      back: '`setItems(items.filter(item => item.id !== idABorrar))` — crea un array nuevo sin el elemento, sin mutar el original.',
    },
  ],
  quiz: [
    {
      id: 'state-q-1',
      question: 'Siguiendo la analogía de la pizarra del restaurante: si "el encargado" representa a setState, ¿qué representa "tachar la pizarra tú mismo sin avisar al encargado"?',
      options: [
        { id: 'a', text: 'Llamar setState con un valor nuevo' },
        { id: 'b', text: 'Mutar el state directamente (ej: state.push(...))' },
        { id: 'c', text: 'Usar un updater function' },
        { id: 'd', text: 'Declarar una nueva variable de state' },
      ],
      correctOptionId: 'b',
      explanation: 'Mutar el state directo es "tachar sin avisar": el cambio existe en memoria pero React no se entera y no re-renderiza.',
      whyOthersAreWrong: {
        a: 'Llamar setState ES avisarle al encargado — es el camino correcto.',
        c: 'El updater function es una forma válida de usar setState, no una mutación directa.',
        d: 'Declarar nueva variable de state con useState es instalar una nueva pizarra, no tachar una existente.',
      },
      usesAnalogy: true,
    },
    {
      id: 'state-q-2',
      question: '¿Qué valor tiene `count` después de ejecutar este código?\n\n```js\nconst [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}\n```',
      options: [
        { id: 'a', text: '3' },
        { id: 'b', text: '1' },
        { id: 'c', text: '0' },
        { id: 'd', text: 'undefined' },
      ],
      correctOptionId: 'b',
      explanation: 'Dentro del mismo render, `count` es un snapshot con valor 0. Las tres llamadas dicen "poner 0+1=1". Resultado: 1.',
      whyOthersAreWrong: {
        a: 'Sería 3 solo si usaras updater function (prev => prev + 1). Aquí las tres leen el mismo snapshot.',
        c: 'Sería 0 si setState no hiciera nada, pero sí actualiza — solo que las tres ponen el mismo valor (1).',
        d: 'useState siempre devuelve un número en este caso, nunca undefined.',
      },
    },
    {
      id: 'state-q-3',
      question: '¿Cuál es la forma correcta de agregar un elemento a un array en state?',
      options: [
        { id: 'a', text: '`items.push(nuevo); setItems(items);`' },
        { id: 'b', text: '`setItems([...items, nuevo])`' },
        { id: 'c', text: '`setItems(items.concat(nuevo)); items.pop();`' },
        { id: 'd', text: '`items = [...items, nuevo]`' },
      ],
      correctOptionId: 'b',
      explanation: 'Spread crea un array nuevo con todos los anteriores más el nuevo. Sin mutación, React detecta el cambio.',
      whyOthersAreWrong: {
        a: 'push() muta el array original. Aunque pases la referencia a setItems, React puede no detectar el cambio porque la referencia es la misma.',
        c: 'concat está bien para crear el nuevo array, pero el pop() después muta el array original — inconsistente y peligroso.',
        d: 'Reasignar la variable local no llama a setState, así que React nunca se entera del cambio.',
      },
    },
    {
      id: 'state-q-4',
      question: '¿Qué pasa si inicializas state con una prop y luego esa prop cambia?',
      options: [
        { id: 'a', text: 'El state se actualiza automáticamente con la nueva prop' },
        { id: 'b', text: 'El state mantiene el valor inicial — la prop solo se usa en el primer render' },
        { id: 'c', text: 'React lanza un error' },
        { id: 'd', text: 'El componente se desmonta y remonta' },
      ],
      correctOptionId: 'b',
      explanation: 'El argumento de useState es el valor INICIAL. Solo se usa una vez, en el primer render. Cambios posteriores en la prop no afectan al state.',
      whyOthersAreWrong: {
        a: 'Si quisieras sincronizar prop → state necesitarías useEffect o una key diferente. No es automático.',
        c: 'No es un error, es comportamiento normal. Simplemente el state se "desconecta" de la prop.',
        d: 'El componente no se desmonta solo porque una prop cambia. Solo se desmonta si su padre deja de renderizarlo.',
      },
    },
    {
      id: 'state-q-5',
      question: '¿Qué hace el batching en React?',
      options: [
        { id: 'a', text: 'Ejecuta cada setState en un setTimeout separado' },
        { id: 'b', text: 'Agrupa múltiples setState del mismo evento en un solo re-render' },
        { id: 'c', text: 'Ignora setState duplicados' },
        { id: 'd', text: 'Ejecuta los renders en un Web Worker' },
      ],
      correctOptionId: 'b',
      explanation: 'Como el encargado de la pizarra que espera a oír todos los cambios antes de reescribir: React junta los setState y hace UN solo re-render al final.',
      whyOthersAreWrong: {
        a: 'setTimeout separaría los updates, causando más re-renders, no menos. Batching hace lo opuesto.',
        c: 'React no ignora setState duplicados — los ejecuta todos, simplemente los agrupa en un re-render.',
        d: 'Los renders ocurren en el thread principal, no en Web Workers. Batching es sobre CUÁNDO renderizar, no DÓNDE.',
      },
      usesAnalogy: true,
    },
    {
      id: 'state-q-6',
      question: '¿Cómo actualizas solo el campo `nombre` de un objeto en state sin perder los demás campos?',
      options: [
        { id: 'a', text: '`setPerson({ nombre: "Ana" })`' },
        { id: 'b', text: '`person.nombre = "Ana"; setPerson(person)`' },
        { id: 'c', text: '`setPerson({ ...person, nombre: "Ana" })`' },
        { id: 'd', text: '`setPerson(person.nombre = "Ana")`' },
      ],
      correctOptionId: 'c',
      explanation: 'Spread copia todas las propiedades existentes y solo sobreescribe `nombre`. Es la forma inmutable correcta.',
      whyOthersAreWrong: {
        a: 'Sin spread, el nuevo objeto SOLO tiene nombre — pierdes edad, email, y todo lo demás.',
        b: 'Mutar person.nombre es "tachar la pizarra sin avisar" — la referencia es la misma, React puede no re-renderizar.',
        d: 'La asignación (person.nombre = "Ana") muta el objeto y devuelve "Ana" (un string), no un objeto. setState recibiría un string.',
      },
    },
    {
      id: 'state-q-7',
      question: '¿Cuál es la forma correcta de incrementar un contador 3 veces en un solo evento?',
      options: [
        { id: 'a', text: '`setCount(count + 3)`' },
        { id: 'b', text: 'Llamar `setCount(count + 1)` tres veces' },
        { id: 'c', text: 'Llamar `setCount(prev => prev + 1)` tres veces' },
        { id: 'd', text: 'Las opciones A y C son equivalentes y ambas correctas' },
      ],
      correctOptionId: 'd',
      explanation: 'Ambas llegan a +3. La opción A suma directamente. La C usa updater y acumula (0→1→2→3). La B solo llegaría a 1 por el snapshot.',
      whyOthersAreWrong: {
        a: 'A sí es correcta — por eso D es la respuesta. A sola no es "la única" forma correcta.',
        b: 'Cada llamada lee el snapshot (ej: 0), así que las tres dicen "poner 1". Resultado: 1, no 3.',
        c: 'C sí es correcta — por eso D es la respuesta. C sola no es "la única" forma correcta.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 20,
  prerequisites: ['javascript-es6'],
  tags: ['state', 'useState', 'hooks', 'inmutabilidad', 'rendering'],
};
