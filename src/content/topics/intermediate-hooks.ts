import type { Topic } from '../types';

export const intermediateHooksTopic: Topic = {
  id: 'intermediate-hooks',
  courseId: 'react-level-2',
  title: 'Hooks Intermedios: El sistema de riego automático',
  realWorldAnalogy: {
    title: 'El sistema de riego automático del jardín',
    scenario:
      'Un jardín tiene un sistema de riego automático con sensores. Cada sensor detecta la humedad de una zona y activa el riego solo cuando es necesario. Si cambias una planta de lugar, debes reconfigurar el sensor de esa zona. Si un sensor está mal calibrado, riega sin parar o nunca riega. Puedes crear kits de sensores reutilizables para distintas zonas sin repetir la instalación.',
    mapping: [
      { everyday: 'Sensor que detecta la humedad', technical: 'Dependency array — React observa cambios en las dependencias' },
      { everyday: 'Riego que se activa solo cuando hace falta', technical: 'useEffect ejecutándose solo cuando cambian las dependencias relevantes' },
      { everyday: 'Sensor mal calibrado que riega sin parar', technical: 'Dependencias faltantes o excesivas que causan loops infinitos' },
      { everyday: 'Cerrar la llave al quitar una planta', technical: 'Cleanup function — limpiar al desmontar o antes de re-ejecutar' },
      { everyday: 'Kit reutilizable de sensores para varias zonas', technical: 'Custom hook — lógica encapsulada reutilizable' },
      { everyday: 'Manual que dice "instala sensores solo en las tomas de agua"', technical: 'Rules of Hooks — solo al nivel superior y en funciones React' },
    ],
    whereItBreaks:
      'Un sensor real actúa en tiempo continuo. useEffect se ejecuta de forma síncrona después del render y React decide el momento exacto — no es un monitoreo en tiempo real.',
  },
  keyTerms: [
    {
      term: 'Effect lifecycle',
      definition: 'Ciclo de vida de un efecto: se monta (setup), se re-ejecuta al cambiar dependencias, y se desmonta (cleanup).',
      analogyHint: 'Sensor que se instala, recalibra con cambios, y retira al final.',
    },
    {
      term: 'Stale closure',
      definition: 'Cuando un effect captura un valor desactualizado porque la función cierra sobre un render anterior.',
      analogyHint: 'Un sensor que sigue midiendo la humedad de una planta que ya no está.',
    },
    {
      term: 'Custom hook',
      definition: 'Función con prefijo use* que encapsula lógica con hooks para reutilizar entre componentes.',
      analogyHint: 'Kit de sensores prefabricado que instalas en cualquier zona nueva.',
    },
    {
      term: 'Rules of Hooks',
      definition: 'Reglas: llamar hooks solo al nivel superior (no en condicionales/loops) y solo dentro de funciones React.',
      analogyHint: 'Los sensores solo se instalan en las tomas de agua oficiales, nunca en tuberías improvisadas.',
    },
    {
      term: 'Unnecessary effect',
      definition: 'useEffect usado para algo que podría resolverse con useMemo, un event handler, o cálculo directo en render.',
      analogyHint: 'Instalar un sensor automático para algo que puedes hacer con un balde a mano.',
    },
    {
      term: 'Effect event',
      definition: 'Lógica reactiva (effect) separada de lógica no reactiva (event) para evitar dependencias innecesarias.',
      analogyHint: 'El sensor mide humedad (reactivo) pero el jardinero decide el tipo de agua (decisión puntual).',
    },
  ],
  summary:
    'Los hooks intermedios se enfocan en usar useEffect correctamente: entender su ciclo de vida (mount → update → unmount), evitar effects innecesarios (usar useMemo o event handlers), manejar stale closures, minimizar dependencias, separar lógica reactiva de no reactiva, crear custom hooks reutilizables, y respetar las Rules of Hooks. Dominar estos conceptos evita bugs sutiles y código difícil de mantener.',
  explanation: `## El sistema de riego y los efectos reactivos

Imagina tu componente como una **zona del jardín**. El sistema de riego automático (useEffect) se activa cuando los sensores (dependency array) detectan un cambio. Pero si pones sensores innecesarios, el riego se activa sin razón. Si olvidas sensores, la planta se seca.

## Cuándo NO usar useEffect

Muchos developers instalan "sensores automáticos" (useEffect) donde no hacen falta:

\`\`\`tsx
// ❌ MAL: effect innecesario para estado derivado
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);

// ✅ BIEN: cálculo directo en render
const fullName = firstName + ' ' + lastName;

// ✅ MEJOR: useMemo si el cálculo es costoso
const sortedItems = useMemo(
  () => items.toSorted((a, b) => a.name.localeCompare(b.name)),
  [items]
);
\`\`\`

**Regla de oro:** si puedes calcular algo durante el render, no necesitas un sensor automático — hazlo directamente con un balde.

## Ciclo de vida de un efecto reactivo

Cada effect tiene su propio ciclo, independiente del componente:

1. **Setup** (instalar el sensor): se ejecuta al montar y al cambiar dependencias
2. **Cleanup** (cerrar la llave): se ejecuta antes de re-ejecutar y al desmontar

\`\`\`tsx
useEffect(() => {
  // Setup: instalar sensor
  const connection = createConnection(roomId);
  connection.connect();

  // Cleanup: desinstalar sensor anterior
  return () => {
    connection.disconnect();
  };
}, [roomId]); // Solo cuando cambie la zona (roomId)
\`\`\`

Piensa en cada effect como un ciclo "start/stop" independiente, no como "componentDidMount".

## Stale closures: el sensor desactualizado

Cuando un effect captura valores del render anterior, como un sensor que sigue midiendo la humedad de una planta que ya moviste:

\`\`\`tsx
// ❌ Stale closure: count siempre vale 0 dentro del interval
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // count está "congelado" en 0
  }, 1000);
  return () => clearInterval(id);
}, []); // count no está en dependencias

// ✅ Solución: updater function
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1); // no depende del closure
  }, 1000);
  return () => clearInterval(id);
}, []);
\`\`\`

## Separar eventos de efectos

A veces un effect necesita leer un valor sin reaccionar a él. Es como si el sensor necesita saber qué tipo de agua usar (decisión del jardinero) sin activarse cada vez que el jardinero cambia de opinión:

\`\`\`tsx
// ❌ El effect se re-ejecuta cada vez que theme cambia
useEffect(() => {
  const connection = createConnection(roomId);
  connection.on('message', (msg) => {
    showNotification(msg, theme); // theme es un "evento", no una dependencia
  });
  connection.connect();
  return () => connection.disconnect();
}, [roomId, theme]); // theme no debería reconectar

// ✅ Extraer la lógica no reactiva (conceptualmente)
// React experimental: useEffectEvent para separar
\`\`\`

## Remover dependencias innecesarias

Para evitar que el sensor se active de más, reconfigura qué observa:

- **Mover objetos/funciones dentro del effect** (no son dependencias externas)
- **Usar updater functions** en setState (elimina la dependencia del state)
- **Extraer cálculos fuera del effect** si no necesitan ser reactivos

## Custom Hooks: kits reutilizables

Igual que un kit de sensores prefabricado para instalar en cualquier zona nueva, un custom hook encapsula lógica reutilizable:

\`\`\`tsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
\`\`\`

**Convención obligatoria**: siempre prefijo \`use\`. Sin él, React no puede verificar las Rules of Hooks.

## Rules of Hooks: el manual de instalación

1. **Solo al nivel superior** — no dentro de if, for, while, o funciones anidadas. Los sensores solo van en las tomas oficiales.
2. **Solo en funciones React** — componentes o custom hooks. Nunca en funciones JavaScript normales.

\`\`\`tsx
// ❌ Viola las reglas: hook dentro de condicional
if (isLoggedIn) {
  useEffect(() => { /* ... */ }, []);
}

// ✅ Correcto: condicional DENTRO del hook
useEffect(() => {
  if (isLoggedIn) { /* ... */ }
}, [isLoggedIn]);
\`\`\`
`,
  codeExamples: [
    {
      title: 'Effect innecesario vs. cálculo directo',
      language: 'tsx',
      code: `// ❌ Anti-pattern: useEffect para estado derivado
function FilteredList({ items, query }: Props) {
  const [filtered, setFiltered] = useState(items);

  useEffect(() => {
    setFiltered(items.filter(i => i.name.includes(query)));
  }, [items, query]);

  return <ul>{filtered.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}

// ✅ Correcto: useMemo para derivación costosa
function FilteredList({ items, query }: Props) {
  const filtered = useMemo(
    () => items.filter(i => i.name.includes(query)),
    [items, query]
  );

  return <ul>{filtered.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}`,
      description: 'Nunca uses useEffect + setState para calcular datos derivados. Usa useMemo o cálculo directo.',
    },
    {
      title: 'Ciclo de vida completo de un effect',
      language: 'tsx',
      code: `function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    // 1. SETUP: conectar al montar o al cambiar roomId
    const connection = createConnection(roomId);
    connection.connect();
    console.log('Conectado a:', roomId);

    // 2. CLEANUP: desconectar antes de re-ejecutar o al desmontar
    return () => {
      connection.disconnect();
      console.log('Desconectado de:', roomId);
    };
  }, [roomId]); // 3. Solo re-ejecuta cuando roomId cambia

  return <p>Sala: {roomId}</p>;
}`,
      description: 'Cada effect tiene un ciclo start/stop independiente. El cleanup siempre se ejecuta antes del siguiente setup.',
    },
    {
      title: 'Custom hook con cleanup',
      language: 'tsx',
      code: `function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize(); // valor inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Uso en cualquier componente:
function ResponsiveLayout() {
  const { width } = useWindowSize();
  return width < 768 ? <MobileNav /> : <DesktopNav />;
}`,
      description: 'Custom hook que encapsula la suscripción a window resize, reutilizable en múltiples componentes.',
    },
    {
      title: 'Eliminar dependencias con updater functions',
      language: 'tsx',
      code: `// ❌ count en dependencias → cleanup y re-setup cada vez
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]);

// ✅ Sin dependencia de count → un solo interval estable
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);`,
      description: 'Usar updater function elimina la dependencia del state actual, evitando re-ejecuciones innecesarias.',
    },
  ],
  pitfalls: [
    'Usar useEffect + setState para calcular estado derivado — esto causa un render extra innecesario. Usa useMemo o cálculo directo.',
    'Olvidar el cleanup en subscriptions/timers — causa memory leaks y comportamiento errático al desmontar.',
    'Poner objetos o funciones creadas en render como dependencias — se recrean cada render y el effect se ejecuta infinitamente.',
    'Omitir dependencias para "evitar re-ejecuciones" — causa stale closures y bugs difíciles de rastrear.',
    'Llamar hooks dentro de condicionales o loops — viola las Rules of Hooks y causa errores en el orden de ejecución.',
    'Crear un custom hook sin el prefijo use — React no puede verificar las reglas y el linter no detecta errores.',
    'Usar un effect para resetear state cuando cambia una prop — mejor usar una key en el componente para forzar remount.',
    'Poner lógica de event handler dentro de useEffect — si algo ocurre "al hacer click", va en onClick, no en un effect.',
  ],
  cheatSheet: [
    'Si puedes calcularlo durante render → no uses useEffect (usa useMemo o cálculo directo)',
    'Effect lifecycle: setup → cleanup → re-setup (independiente del componente)',
    'Stale closure: cuando el effect lee un valor "congelado" de un render anterior',
    'Updater function (prev => prev + 1) elimina dependencias de state',
    'Custom hook = función use* que encapsula hooks → reutilizable entre componentes',
    'Rules of Hooks: solo top-level + solo en funciones React (componentes o custom hooks)',
    'Cleanup se ejecuta ANTES del siguiente setup y al desmontar',
    'Objetos/funciones en dependencias → mover dentro del effect o memoizar con useMemo/useCallback',
    'Si el effect responde a un evento del usuario → probablemente debería ser un event handler',
    'Key prop en un componente fuerza remount completo — alternativa a useEffect para reset',
  ],
  flashcards: [
    {
      id: 'int-hooks-fc-1',
      front: '¿Cuándo NO deberías usar useEffect?',
      back: 'Cuando puedes calcular el valor durante el render (estado derivado). Usa useMemo para cálculos costosos o cálculo directo para los simples. useEffect es solo para sincronizar con sistemas externos.',
    },
    {
      id: 'int-hooks-fc-2',
      front: '¿Qué es un "stale closure" en el contexto de useEffect?',
      back: 'Ocurre cuando la función del effect captura un valor de un render anterior que ya no es actual. Es como un sensor que sigue midiendo la humedad de una planta que ya moviste de lugar.',
      usesAnalogy: true,
    },
    {
      id: 'int-hooks-fc-3',
      front: '¿Cuál es el ciclo de vida de un effect reactivo?',
      back: 'Setup (al montar o cambiar dependencias) → Cleanup (antes de re-ejecutar o al desmontar) → Re-setup. Cada effect tiene su propio ciclo independiente, como un sensor que se instala, se recalibra al cambiar la planta, y se retira al eliminar la zona.',
      usesAnalogy: true,
    },
    {
      id: 'int-hooks-fc-4',
      front: '¿Cómo eliminas una dependencia de state en useEffect sin omitirla?',
      back: 'Usando una updater function: setCount(prev => prev + 1) en lugar de setCount(count + 1). Así el effect no necesita leer count y puede tener dependencias vacías [].',
    },
    {
      id: 'int-hooks-fc-5',
      front: '¿Cuáles son las dos Rules of Hooks?',
      back: '1) Solo llamar hooks al nivel superior (no en if, for, while, funciones anidadas). 2) Solo llamar hooks dentro de funciones React (componentes o custom hooks). Esto garantiza que el orden de hooks sea consistente entre renders.',
    },
    {
      id: 'int-hooks-fc-6',
      front: '¿Qué convención de nombres deben seguir los custom hooks y por qué?',
      back: 'Deben empezar con "use" (useOnlineStatus, useWindowSize). Sin este prefijo, React no puede verificar automáticamente que se cumplan las Rules of Hooks y el linter no detectará errores.',
    },
    {
      id: 'int-hooks-fc-7',
      front: '¿Por qué un objeto literal en el dependency array causa ejecuciones infinitas?',
      back: 'Porque un objeto literal se crea nuevo en cada render (nueva referencia en memoria). React compara por referencia (Object.is), así que siempre lo ve como "cambió". Solución: mover el objeto dentro del effect, o memoizarlo con useMemo.',
    },
    {
      id: 'int-hooks-fc-8',
      front: 'En la analogía del sistema de riego, ¿qué representa un custom hook?',
      back: 'Un kit de sensores prefabricado que puedes instalar en cualquier zona nueva del jardín sin repetir toda la instalación desde cero. Encapsula la lógica (sensor + llave + configuración) en un paquete reutilizable.',
      usesAnalogy: true,
    },
  ],
  quiz: [
    {
      id: 'int-hooks-q-1',
      question: '¿Cuál es la forma correcta de calcular una lista filtrada a partir de props?',
      options: [
        { id: 'int-hooks-q-1-a', text: 'useState + useEffect que actualiza el estado filtrado cuando cambian las props' },
        { id: 'int-hooks-q-1-b', text: 'useMemo con las props como dependencias' },
        { id: 'int-hooks-q-1-c', text: 'useRef para guardar la lista filtrada entre renders' },
        { id: 'int-hooks-q-1-d', text: 'useReducer con una acción FILTER disparada en useEffect' },
      ],
      correctOptionId: 'int-hooks-q-1-b',
      explanation: 'useMemo calcula el valor derivado directamente durante el render sin causar renders extra. Es la forma idiomática de derivar datos de props o state.',
      whyOthersAreWrong: {
        'int-hooks-q-1-a': 'useState + useEffect causa un render extra innecesario: primero renderiza con el valor viejo, luego re-renderiza con el nuevo.',
        'int-hooks-q-1-c': 'useRef no causa re-render cuando cambia, así que la UI no se actualizaría cuando la lista filtrada cambie.',
        'int-hooks-q-1-d': 'Agrega complejidad innecesaria. Un reducer + effect sigue teniendo el problema del render extra.',
      },
    },
    {
      id: 'int-hooks-q-2',
      question: 'En la analogía del sistema de riego, ¿qué representa un sensor mal calibrado que riega sin parar?',
      options: [
        { id: 'int-hooks-q-2-a', text: 'Un useEffect con cleanup que se ejecuta al desmontar' },
        { id: 'int-hooks-q-2-b', text: 'Un custom hook que retorna siempre el mismo valor' },
        { id: 'int-hooks-q-2-c', text: 'Un useEffect con dependencias incorrectas que causa un loop infinito' },
        { id: 'int-hooks-q-2-d', text: 'Un useState que nunca se actualiza' },
      ],
      correctOptionId: 'int-hooks-q-2-c',
      explanation: 'Un sensor mal calibrado que riega sin parar representa dependencias incorrectas (como un objeto recreado cada render) que hacen que el effect se re-ejecute infinitamente.',
      whyOthersAreWrong: {
        'int-hooks-q-2-a': 'Un cleanup al desmontar es el comportamiento correcto — es "cerrar la llave al quitar la planta", no un mal funcionamiento.',
        'int-hooks-q-2-b': 'Un hook que retorna el mismo valor no tiene relación con la ejecución repetitiva de un sensor.',
        'int-hooks-q-2-d': 'Un estado que no se actualiza sería más bien un sensor apagado, no uno que riega sin parar.',
      },
      usesAnalogy: true,
    },
    {
      id: 'int-hooks-q-3',
      question: '¿Qué código causa un stale closure?',
      options: [
        { id: 'int-hooks-q-3-a', text: 'useEffect(() => { setCount(prev => prev + 1) }, [])' },
        { id: 'int-hooks-q-3-b', text: 'useEffect(() => { const id = setInterval(() => setCount(count + 1), 1000); return () => clearInterval(id) }, [])' },
        { id: 'int-hooks-q-3-c', text: 'useEffect(() => { document.title = count.toString() }, [count])' },
        { id: 'int-hooks-q-3-d', text: 'useMemo(() => items.filter(i => i.active), [items])' },
      ],
      correctOptionId: 'int-hooks-q-3-b',
      explanation: 'El effect con [] captura count del primer render. Dentro del setInterval, count siempre vale 0 porque el closure se creó con ese valor y nunca se actualiza.',
      whyOthersAreWrong: {
        'int-hooks-q-3-a': 'Usa updater function (prev =>) que no depende del closure — siempre recibe el valor actual.',
        'int-hooks-q-3-c': 'Tiene count en las dependencias, así que se re-ejecuta cuando count cambia — siempre lee el valor actual.',
        'int-hooks-q-3-d': 'useMemo se recalcula cuando items cambia. No hay closure stale porque se re-ejecuta con el nuevo valor.',
      },
    },
    {
      id: 'int-hooks-q-4',
      question: '¿Cuál de estas opciones viola las Rules of Hooks?',
      options: [
        { id: 'int-hooks-q-4-a', text: 'Llamar useState dentro de un custom hook useForm()' },
        { id: 'int-hooks-q-4-b', text: 'Llamar useEffect dentro de un if (condition) { ... }' },
        { id: 'int-hooks-q-4-c', text: 'Llamar useMemo al inicio de un componente funcional' },
        { id: 'int-hooks-q-4-d', text: 'Llamar useCallback en un componente que también usa useState' },
      ],
      correctOptionId: 'int-hooks-q-4-b',
      explanation: 'Los hooks deben llamarse siempre al nivel superior, nunca dentro de condicionales, loops o funciones anidadas. React depende del orden de llamada para asociar cada hook con su estado.',
      whyOthersAreWrong: {
        'int-hooks-q-4-a': 'Llamar hooks dentro de custom hooks es perfectamente válido — es una de las dos ubicaciones permitidas.',
        'int-hooks-q-4-c': 'Llamar hooks al inicio de un componente es exactamente lo correcto — nivel superior.',
        'int-hooks-q-4-d': 'Usar múltiples hooks en un componente es normal. Lo importante es que estén al nivel superior.',
      },
    },
    {
      id: 'int-hooks-q-5',
      question: '¿Cuándo se ejecuta la cleanup function de un useEffect?',
      options: [
        { id: 'int-hooks-q-5-a', text: 'Solo cuando el componente se desmonta' },
        { id: 'int-hooks-q-5-b', text: 'Antes de cada re-ejecución del effect y al desmontar el componente' },
        { id: 'int-hooks-q-5-c', text: 'Inmediatamente después del setup, en el mismo ciclo de render' },
        { id: 'int-hooks-q-5-d', text: 'Solo cuando las dependencias cambian a undefined' },
      ],
      correctOptionId: 'int-hooks-q-5-b',
      explanation: 'El cleanup se ejecuta en dos momentos: antes de re-ejecutar el effect (cuando las dependencias cambian) y cuando el componente se desmonta. Es como cerrar la llave antes de reconfigurar el sensor.',
      whyOthersAreWrong: {
        'int-hooks-q-5-a': 'Solo al desmontar sería el caso de dependencias vacías []. Con dependencias, también se ejecuta antes de cada re-setup.',
        'int-hooks-q-5-c': 'El cleanup nunca se ejecuta en el mismo ciclo que el setup. Se ejecuta antes del SIGUIENTE setup o al desmontar.',
        'int-hooks-q-5-d': 'No existe tal comportamiento. El cleanup se ejecuta por cambio de dependencias o desmontaje, sin importar el valor.',
      },
    },
    {
      id: 'int-hooks-q-6',
      question: '¿Cuál es el beneficio principal de extraer lógica en un custom hook?',
      options: [
        { id: 'int-hooks-q-6-a', text: 'Mejora el rendimiento porque React optimiza los custom hooks internamente' },
        { id: 'int-hooks-q-6-b', text: 'Permite compartir lógica stateful entre componentes sin repetir código' },
        { id: 'int-hooks-q-6-c', text: 'Hace que el estado sea global y accesible desde cualquier componente' },
        { id: 'int-hooks-q-6-d', text: 'Evita que el componente se re-renderice cuando cambia el estado interno del hook' },
      ],
      correctOptionId: 'int-hooks-q-6-b',
      explanation: 'Un custom hook encapsula lógica con estado (como un kit de sensores prefabricado) para reutilizarla en distintos componentes. Cada componente que usa el hook obtiene su propia instancia del estado.',
      whyOthersAreWrong: {
        'int-hooks-q-6-a': 'React no optimiza custom hooks de forma especial. Son funciones JavaScript normales que llaman otros hooks.',
        'int-hooks-q-6-c': 'Cada componente que usa un custom hook tiene su PROPIA copia del estado — no es global.',
        'int-hooks-q-6-d': 'Si el hook llama useState, el componente SÍ se re-renderiza cuando ese estado cambia.',
      },
      usesAnalogy: true,
    },
    {
      id: 'int-hooks-q-7',
      question: '¿Cómo evitas que un useEffect con setInterval se re-ejecute innecesariamente al cambiar count?',
      options: [
        { id: 'int-hooks-q-7-a', text: 'Agregar count al dependency array' },
        { id: 'int-hooks-q-7-b', text: 'Usar setCount(prev => prev + 1) y dejar el dependency array vacío' },
        { id: 'int-hooks-q-7-c', text: 'Usar useRef para guardar count y leerlo dentro del interval' },
        { id: 'int-hooks-q-7-d', text: 'Envolver el setInterval en useCallback' },
      ],
      correctOptionId: 'int-hooks-q-7-b',
      explanation: 'La updater function (prev => prev + 1) no necesita leer count del closure — recibe el valor actual como argumento. Esto permite un dependency array vacío y un único interval estable.',
      whyOthersAreWrong: {
        'int-hooks-q-7-a': 'Agregar count al array causa que el effect se re-ejecute cada vez que count cambia, creando y destruyendo intervals constantemente.',
        'int-hooks-q-7-c': 'Aunque técnicamente funciona, es un workaround innecesario. La updater function es la solución idiomática.',
        'int-hooks-q-7-d': 'useCallback memoiza funciones pero no resuelve el problema de las dependencias del effect.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 25,
  prerequisites: ['hooks'],
  tags: ['useEffect', 'custom hooks', 'rules of hooks', 'lifecycle', 'stale closure', 'dependencies', 'cleanup'],
};
