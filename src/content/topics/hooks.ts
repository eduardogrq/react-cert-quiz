import type { Topic } from '../types';

export const hooksTopic: Topic = {
  id: 'hooks',
  courseId: 'react-level-1',
  title: 'Hooks: El conserje del edificio',
  realWorldAnalogy: {
    title: 'El conserje del edificio',
    scenario:
      'El conserje del edificio hace tareas que no son tu responsabilidad directa: enciende las luces del pasillo al atardecer, apaga la calefacción cuando todos salen, recibe paquetes y los guarda en un casillero sin molestar a nadie. Tú le das instrucciones una vez ("enciende cuando oscurezca") y él se encarga sin que te enteres.',
    mapping: [
      { everyday: 'El conserje ejecutando tareas secundarias', technical: 'useEffect — efectos secundarios (side effects)' },
      { everyday: '"Enciende luces al atardecer, apaga al amanecer"', technical: 'Setup + cleanup en useEffect' },
      { everyday: 'Casillero donde guarda paquetes sin molestar', technical: 'useRef — valor mutable que no causa re-render' },
      { everyday: 'La etiqueta del casillero (siempre el mismo)', technical: 'ref.current — persiste entre renders' },
      { everyday: '"Solo hazlo cuando cambie el clima"', technical: 'Array de dependencias del useEffect' },
    ],
    whereItBreaks:
      'Un conserje real actúa cuando quiere. useEffect se ejecuta DESPUÉS del render y está sujeto al array de dependencias — React decide cuándo correrlo.',
  },
  keyTerms: [
    {
      term: 'useEffect',
      definition: 'Hook para sincronizar tu componente con sistemas externos (APIs, DOM manual, timers).',
      analogyHint: 'Darle al conserje una tarea que ejecute fuera de tu departamento.',
    },
    {
      term: 'dependencies array',
      definition: 'Array que indica a React cuándo re-ejecutar el effect. Vacío = solo al montar.',
      analogyHint: '"Solo hazlo cuando cambie esto" — la condición para que el conserje actúe.',
    },
    {
      term: 'cleanup function',
      definition: 'Función retornada por useEffect que se ejecuta al desmontar o antes de re-ejecutar.',
      analogyHint: '"Apaga las luces antes de volver a encenderlas con el nuevo horario".',
    },
    {
      term: 'useRef',
      definition: 'Hook que retorna un objeto mutable { current } que persiste entre renders sin causar re-render.',
      analogyHint: 'El casillero del conserje: guarda cosas sin molestar a los vecinos.',
    },
    {
      term: 'ref (DOM)',
      definition: 'useRef asignado a un elemento JSX para acceder al nodo DOM directamente.',
      analogyHint: 'Una etiqueta pegada a una puerta específica del edificio.',
    },
    {
      term: 'side effect',
      definition: 'Cualquier operación que afecta algo fuera del componente: fetch, timers, DOM manual.',
      analogyHint: 'Tareas que impactan el edificio, no solo tu departamento.',
    },
  ],
  summary:
    '`useEffect` sincroniza el componente con el mundo exterior (fetch, subscriptions, DOM manual). Se ejecuta después del render. El array de dependencias controla cuándo re-ejecuta. El cleanup limpia antes de re-ejecutar o al desmontar. `useRef` guarda valores mutables sin causar re-render — útil para acceder al DOM o guardar valores entre renders.',
  explanation: `## El conserje y sus tareas

El **conserje** hace cosas que no son pintar tu UI — son "efectos secundarios": llamar APIs, poner timers, manipular el DOM directamente. Tú le das instrucciones y él actúa después de que todo esté pintado.

\`\`\`tsx
useEffect(() => {
  // instrucción al conserje: "haz esto después del render"
  document.title = \`Tienes \${count} mensajes\`;
}, [count]); // "solo cuando cambie count"
\`\`\`

## Anatomía de useEffect

\`\`\`tsx
useEffect(() => {
  // 1. SETUP: lo que quieres hacer
  const subscription = api.subscribe(data);

  // 2. CLEANUP: limpiar antes de re-ejecutar o al desmontar
  return () => {
    subscription.unsubscribe();
  };
}, [dependencia1, dependencia2]); // 3. CUÁNDO re-ejecutar
\`\`\`

**Tres variantes del array de dependencias:**
- \`[dep1, dep2]\` — re-ejecuta cuando dep1 O dep2 cambian
- \`[]\` — ejecuta solo al montar (y cleanup al desmontar)
- Sin array — ejecuta después de CADA render (raramente lo quieres)

## Fetch de datos (caso de uso más común)

\`\`\`tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // El conserje va a buscar datos
    let cancelled = false;

    async function fetchUser() {
      const res = await fetch(\`/api/users/\${userId}\`);
      const data = await res.json();
      if (!cancelled) setUser(data); // solo si sigo montado
    }
    fetchUser();

    return () => { cancelled = true; }; // cleanup: cancelar si ya no importa
  }, [userId]); // re-fetch cuando cambie el ID

  if (!user) return <p>Cargando...</p>;
  return <h1>{user.name}</h1>;
}
\`\`\`

## useRef: el casillero silencioso

\`\`\`tsx
function Timer() {
  const intervalRef = useRef<number | null>(null);
  const [seconds, setSeconds] = useState(0);

  function start() {
    // Guardar ID del interval en el "casillero"
    intervalRef.current = window.setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }

  function stop() {
    // Leer del casillero para limpiar
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  return <div>{seconds}s <button onClick={start}>▶</button> <button onClick={stop}>⏹</button></div>;
}
\`\`\`

## useRef para acceder al DOM

\`\`\`tsx
function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // El conserje enfoca el input después del render
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Se enfoca solo" />;
}
\`\`\`

Cambiar \`ref.current\` **nunca causa re-render** — es el casillero silencioso. Ideal para guardar IDs de timers, valores previos, o nodos DOM.`,
  codeExamples: [
    {
      title: 'useEffect con cleanup (event listener)',
      language: 'tsx',
      code: `function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Setup: suscribir
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);

    // Cleanup: desuscribir al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []); // [] = solo al montar/desmontar

  return <p>Ancho: {width}px</p>;
}`,
      description: 'Patrón subscribe/unsubscribe. El cleanup evita memory leaks.',
    },
    {
      title: 'useRef para guardar valor previo',
      language: 'tsx',
      code: `function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = useRef(0);

  useEffect(() => {
    // Guardar en el casillero después de cada render
    prevCount.current = count;
  });

  return (
    <p>
      Ahora: {count}, antes: {prevCount.current}
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </p>
  );
}`,
      description: 'useRef persiste entre renders sin causar re-render al cambiar.',
    },
  ],
  pitfalls: [
    'Olvidar dependencias en el array: el effect usa valores stale (desactualizados).',
    'No hacer cleanup: memory leaks con subscriptions, intervals, o event listeners.',
    'Poner objetos/arrays/funciones como dependencia sin memoizar: el effect se re-ejecuta cada render.',
    'Hacer fetch sin manejar race conditions: si el userId cambia rápido, respuestas viejas pueden llegar después.',
    'Usar useRef para algo que debería causar re-render — si el UI depende del valor, usa state.',
    'useEffect con [] vacío para "ejecutar una vez" en desarrollo se ejecuta dos veces (StrictMode) — es intencional.',
  ],
  cheatSheet: [
    '`useEffect(() => { ... }, [deps])` — ejecuta setup cuando deps cambian',
    '`useEffect(() => { return () => cleanup }, [])` — setup al montar, cleanup al desmontar',
    '`[]` = solo al montar · `[x]` = cuando x cambie · sin array = cada render',
    '`useRef(initial)` → `{ current: initial }` — mutable, persiste, no re-renderiza',
    '`<input ref={myRef} />` — acceso directo al nodo DOM',
    '`ref.current.focus()` — manipular DOM imperativamente',
    'Cleanup se ejecuta: (1) antes de re-ejecutar el effect, (2) al desmontar',
    'Si el valor debe reflejarse en UI → useState. Si no → useRef.',
  ],
  flashcards: [
    {
      id: 'hooks-fc-1',
      front: '¿Cuándo se ejecuta el código dentro de useEffect?',
      back: 'DESPUÉS del render (el componente ya se pintó). Como el conserje que actúa cuando los vecinos ya están en sus departamentos, no mientras se mudan.',
      usesAnalogy: true,
    },
    {
      id: 'hooks-fc-2',
      front: '¿Qué hace un array de dependencias vacío [] en useEffect?',
      back: 'El effect se ejecuta solo una vez al montar y el cleanup solo al desmontar. Equivale a "conserje, hazlo solo cuando se mude alguien nuevo (mount) y limpia cuando se vaya (unmount)".',
      usesAnalogy: true,
    },
    {
      id: 'hooks-fc-3',
      front: '¿Para qué sirve el cleanup (return) en useEffect?',
      back: 'Para limpiar el efecto anterior antes de re-ejecutar o al desmontar: quitar event listeners, cancelar timers, cerrar subscriptions. Previene memory leaks.',
    },
    {
      id: 'hooks-fc-4',
      front: '¿Cuál es la diferencia entre useRef y useState?',
      back: 'useRef: valor mutable que persiste entre renders pero NO causa re-render al cambiar. useState: valor que SÍ causa re-render. useRef = casillero silencioso; useState = la pizarra visible.',
      usesAnalogy: true,
    },
    {
      id: 'hooks-fc-5',
      front: '¿Cómo accedes a un nodo DOM directamente en React?',
      back: 'Con useRef: creates `const ref = useRef(null)`, lo asignas `<div ref={ref}>`, y accedes con `ref.current` (el nodo DOM real).',
    },
    {
      id: 'hooks-fc-6',
      front: '¿Por qué useEffect se ejecuta dos veces en desarrollo (StrictMode)?',
      back: 'React monta, desmonta y remonta para verificar que tu cleanup funciona correctamente. Si tu effect se "rompe" con doble ejecución, tu cleanup está incompleto.',
    },
    {
      id: 'hooks-fc-7',
      front: '¿Qué pasa si no pones array de dependencias en useEffect?',
      back: 'El effect se ejecuta después de CADA render. Casi nunca es lo que quieres — suele causar loops infinitos si el effect actualiza state.',
    },
  ],
  quiz: [
    {
      id: 'hooks-q-1',
      question: 'Siguiendo la analogía del conserje: si el array de dependencias es "la condición para que actúe", ¿qué pasa con `useEffect(() => {...})` SIN array?',
      options: [
        { id: 'a', text: 'Nunca se ejecuta' },
        { id: 'b', text: 'Se ejecuta solo al montar' },
        { id: 'c', text: 'Se ejecuta después de cada render (como un conserje sin condiciones)' },
        { id: 'd', text: 'Error de sintaxis' },
      ],
      correctOptionId: 'c',
      explanation: 'Sin array de dependencias, el effect corre después de CADA render. Es un "conserje" sin restricciones — actúa siempre.',
      whyOthersAreWrong: {
        a: 'Eso no pasaría con ninguna variante de useEffect. Siempre corre al menos una vez.',
        b: 'Eso sería con [] vacío. Sin array = cada render.',
        d: 'Es sintaxis válida, solo que raramente es lo que quieres.',
      },
      usesAnalogy: true,
    },
    {
      id: 'hooks-q-2',
      question: '¿Qué problema tiene este código?\n\n```jsx\nuseEffect(() => {\n  const id = setInterval(() => setCount(c => c+1), 1000);\n}, []);\n```',
      options: [
        { id: 'a', text: 'setInterval no funciona dentro de useEffect' },
        { id: 'b', text: 'Falta cleanup — el interval nunca se limpia al desmontar' },
        { id: 'c', text: 'No puede usar setState dentro de useEffect' },
        { id: 'd', text: 'El array vacío es incorrecto aquí' },
      ],
      correctOptionId: 'b',
      explanation: 'Sin `return () => clearInterval(id)`, el interval sigue corriendo después de desmontar el componente — memory leak.',
      whyOthersAreWrong: {
        a: 'setInterval funciona perfectamente dentro de useEffect.',
        c: 'Sí puedes usar setState dentro de useEffect (es el patrón normal para fetch, timers, etc.).',
        d: 'El array vacío es correcto: queremos un solo interval al montar.',
      },
    },
    {
      id: 'hooks-q-3',
      question: '¿Cuándo usarías useRef en vez de useState?',
      options: [
        { id: 'a', text: 'Cuando el valor necesita mostrarse en pantalla' },
        { id: 'b', text: 'Cuando necesitas un valor mutable entre renders que NO debe causar re-render' },
        { id: 'c', text: 'Cuando necesitas validar formularios' },
        { id: 'd', text: 'Cuando el valor es un string' },
      ],
      correctOptionId: 'b',
      explanation: 'useRef es el "casillero silencioso": persiste entre renders pero cambiar .current no dispara re-render. Ideal para IDs de timers, valores previos, nodos DOM.',
      whyOthersAreWrong: {
        a: 'Si se muestra en pantalla, necesitas useState para que React actualice el UI.',
        c: 'Para formularios puedes usar ref, pero la decisión no depende de validación sino de si necesitas re-render.',
        d: 'El tipo de dato no determina si usar ref o state.',
      },
    },
    {
      id: 'hooks-q-4',
      question: '¿Cuál es el patrón correcto para hacer fetch dentro de useEffect?',
      options: [
        { id: 'a', text: '`useEffect(async () => { const data = await fetch(...) }, [])`' },
        { id: 'b', text: 'Definir una función async dentro del effect y llamarla' },
        { id: 'c', text: 'Usar fetch fuera del componente' },
        { id: 'd', text: 'No se puede hacer fetch en useEffect' },
      ],
      correctOptionId: 'b',
      explanation: 'useEffect no puede ser async directamente (debe retornar cleanup o nada, no una Promise). Se define una función async interna y se invoca.',
      whyOthersAreWrong: {
        a: 'Un callback async retorna una Promise. useEffect esperaría una función de cleanup, no una Promise — bug sutil.',
        c: 'Fuera del componente no tienes acceso a setState para guardar la respuesta.',
        d: 'Sí se puede y es el patrón principal para data fetching en componentes.',
      },
    },
    {
      id: 'hooks-q-5',
      question: '¿Qué pasa si pones un objeto como dependencia de useEffect sin memoizarlo?\n\n```jsx\nconst options = { page: 1 };\nuseEffect(() => { fetch(url, options) }, [options]);\n```',
      options: [
        { id: 'a', text: 'Funciona correctamente' },
        { id: 'b', text: 'El effect se re-ejecuta en CADA render porque options es un objeto nuevo cada vez' },
        { id: 'c', text: 'Error: no puedes poner objetos como dependencia' },
        { id: 'd', text: 'El effect nunca se ejecuta' },
      ],
      correctOptionId: 'b',
      explanation: 'Cada render crea un nuevo objeto `{ page: 1 }`. React compara por referencia (===), ve que es diferente, y re-ejecuta el effect infinitamente.',
      whyOthersAreWrong: {
        a: 'Funciona pero se re-ejecuta cada render — loop infinito si el effect causa re-render.',
        c: 'Puedes ponerlos, solo que debes memoizar o mover la declaración dentro del effect.',
        d: 'Sí se ejecuta — el problema es que se ejecuta en cada render.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 25,
  prerequisites: ['state'],
  tags: ['useEffect', 'useRef', 'side-effects', 'cleanup', 'dependencies', 'refs'],
};
