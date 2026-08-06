import type { Topic } from '../types';

export const intermediateStateTopic: Topic = {
  id: 'intermediate-state',
  courseId: 'react-level-2',
  title: 'Estado Intermedio: Estructura, Compartir y Context',
  realWorldAnalogy: {
    title: 'El tablero de anuncios del edificio',
    scenario:
      'En un edificio de departamentos hay un tablero de anuncios en el lobby. Cada piso tiene su propia pizarra, pero cuando un aviso aplica a todos, se pega en el tablero central del lobby. Los vecinos no necesitan subir piso por piso preguntando — bajan al lobby y leen el tablero compartido.',
    mapping: [
      { everyday: 'La pizarra de cada piso', technical: 'State local de cada componente' },
      { everyday: 'El tablero central del lobby', technical: 'Context (estado compartido)' },
      { everyday: 'Bajar al lobby a leer', technical: 'useContext — consumir el valor del Provider' },
      { everyday: 'El administrador que actualiza el tablero', technical: 'El Provider que envuelve el árbol' },
      { everyday: 'Subir piso por piso preguntando', technical: 'Prop drilling (pasar props nivel a nivel)' },
    ],
    whereItBreaks:
      'En un edificio real, el tablero del lobby es visible para cualquiera que entre. En React, Context solo está disponible para componentes dentro del Provider — si no estás envuelto, no ves el valor.',
  },
  keyTerms: [
    {
      term: 'lifting state up',
      definition: 'Mover el state al ancestro común más cercano de los componentes que lo necesitan.',
      analogyHint: 'Subir el aviso al piso donde todos puedan verlo.',
    },
    {
      term: 'Context',
      definition: 'Mecanismo de React para compartir datos con todo un subárbol sin pasar props manualmente.',
      analogyHint: 'El tablero central del lobby que todos los vecinos pueden leer.',
    },
    {
      term: 'Provider',
      definition: 'Componente que envuelve un subárbol y le provee un valor de Context.',
      analogyHint: 'El administrador que pega el aviso en el tablero del lobby.',
    },
    {
      term: 'useContext',
      definition: 'Hook que permite a un componente leer el valor actual de un Context.',
      analogyHint: 'Bajar al lobby y leer lo que dice el tablero.',
    },
    {
      term: 'prop drilling',
      definition: 'Pasar props a través de múltiples niveles de componentes intermedios que no los usan.',
      analogyHint: 'Subir piso por piso preguntando si alguien tiene el aviso.',
    },
    {
      term: 'key prop (reset)',
      definition: 'Cambiar la key de un componente fuerza a React a destruirlo y recrearlo con state fresco.',
      analogyHint: 'Arrancar la pizarra vieja y poner una nueva en blanco.',
    },
    {
      term: 'single source of truth',
      definition: 'Principio de que cada pieza de state debe vivir en exactamente un lugar.',
      analogyHint: 'Un solo tablero oficial, no copias en cada piso.',
    },
  ],
  summary:
    'A medida que la app crece, necesitas decidir dónde vive el state y cómo compartirlo. Los principios clave son: evitar redundancia (una sola fuente de verdad), preferir estructuras planas, elevar el state al ancestro común (lifting state up), usar la key prop para resetear componentes, y emplear Context + useContext para evitar prop drilling cuando muchos componentes necesitan los mismos datos.',
  explanation: `## Diseño de la estructura del state

Antes de escribir código, pregúntate: ¿qué datos realmente necesito guardar? Los principios fundamentales son:

1. **Agrupa state relacionado** — si dos variables siempre cambian juntas, ponlas en un mismo objeto.
2. **Evita redundancia** — si puedes calcular un valor a partir de otro state o props, NO lo guardes en state (usa \`useMemo\`).
3. **Evita duplicación** — no guardes el mismo dato en dos lugares. Usa IDs como referencia.
4. **Prefiere estructuras planas** — los objetos profundamente anidados son difíciles de actualizar sin mutar.

## Compartir state: lifting state up

Cuando dos componentes necesitan el mismo dato, **elévalo al ancestro común más cercano**. El padre guarda el state y lo pasa como props a los hijos.

\`\`\`tsx
function Padre() {
  const [filtro, setFiltro] = useState('');
  return (
    <>
      <Buscador filtro={filtro} onChange={setFiltro} />
      <Lista filtro={filtro} />
    </>
  );
}
\`\`\`

## Preservar y resetear state con key

React preserva el state mientras el componente esté en la misma posición del árbol. Si necesitas **resetear** el state de un componente, dale una \`key\` diferente:

\`\`\`tsx
<Chat key={contactoId} contacto={contacto} />
// Cambiar contactoId = arrancar la pizarra vieja y poner una nueva
\`\`\`

Volviendo a la analogía del **tablero del edificio**: cambiar la key es como arrancar la pizarra vieja de un piso y poner una completamente en blanco.

## Context: el tablero del lobby

Cuando pasar props por muchos niveles (prop drilling — subir piso por piso preguntando) se vuelve tedioso, usamos **Context**. Es como instalar un **tablero central en el lobby** que cualquier vecino puede leer sin que nadie suba a avisarle.

### Crear el Context

\`\`\`tsx
import { createContext, useContext } from 'react';

const TemaContext = createContext('claro');
\`\`\`

### Proveer el valor (el administrador pega el aviso)

\`\`\`tsx
function App() {
  const [tema, setTema] = useState('oscuro');
  return (
    <TemaContext.Provider value={tema}>
      <Panel />
    </TemaContext.Provider>
  );
}
\`\`\`

### Consumir con useContext (bajar al lobby a leer)

\`\`\`tsx
function Boton() {
  const tema = useContext(TemaContext);
  return <button className={tema}>Click</button>;
}
\`\`\`

El componente \`Boton\` no necesita que le pasen \`tema\` como prop a través de Panel → Sidebar → Boton. Simplemente "baja al lobby" y lee el tablero.

## Cuándo usar Context vs. lifting state

- **Lifting state**: 1-2 niveles de profundidad, pocos consumidores.
- **Context**: datos que muchos componentes en diferentes niveles necesitan (tema, idioma, usuario autenticado).

Context NO reemplaza todo el state management — úsalo para datos que cambian poco o que verdaderamente son "globales" dentro de una sección.`,
  codeExamples: [
    {
      title: 'Lifting state up: filtro compartido',
      language: 'tsx',
      code: `interface Props {
  filtro: string;
  onChange: (valor: string) => void;
}

function Buscador({ filtro, onChange }: Props) {
  return (
    <input
      value={filtro}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar..."
    />
  );
}

function Lista({ filtro }: { filtro: string }) {
  const items = ['React', 'Vue', 'Angular'];
  const filtrados = items.filter(i =>
    i.toLowerCase().includes(filtro.toLowerCase())
  );
  return <ul>{filtrados.map(i => <li key={i}>{i}</li>)}</ul>;
}

function App() {
  const [filtro, setFiltro] = useState('');
  return (
    <>
      <Buscador filtro={filtro} onChange={setFiltro} />
      <Lista filtro={filtro} />
    </>
  );
}`,
      description: 'El state vive en el padre (App) y se comparte con ambos hijos que lo necesitan.',
    },
    {
      title: 'Resetear state con key prop',
      language: 'tsx',
      code: `interface ChatProps {
  contacto: { id: string; nombre: string };
}

function Chat({ contacto }: ChatProps) {
  const [mensaje, setMensaje] = useState('');

  return (
    <div>
      <h2>Chat con {contacto.nombre}</h2>
      <input
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
    </div>
  );
}

function App() {
  const [contactoId, setContactoId] = useState('1');
  const contacto = contactos.find(c => c.id === contactoId)!;

  // key={contactoId} → al cambiar de contacto, Chat se destruye
  // y se crea uno nuevo con state limpio
  return <Chat key={contactoId} contacto={contacto} />;
}`,
      description: 'Cambiar la key destruye la instancia anterior y crea una nueva con state fresco.',
    },
    {
      title: 'Context completo: tema de la app',
      language: 'tsx',
      code: `import { createContext, useContext, useState } from 'react';

type Tema = 'claro' | 'oscuro';

interface TemaContextValue {
  tema: Tema;
  toggleTema: () => void;
}

const TemaContext = createContext<TemaContextValue | null>(null);

function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error('useTema debe usarse dentro de TemaProvider');
  return ctx;
}

function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>('oscuro');
  const toggleTema = () => setTema(t => t === 'oscuro' ? 'claro' : 'oscuro');

  return (
    <TemaContext.Provider value={{ tema, toggleTema }}>
      {children}
    </TemaContext.Provider>
  );
}

function BotonTema() {
  const { tema, toggleTema } = useTema();
  return (
    <button onClick={toggleTema}>
      Tema actual: {tema}
    </button>
  );
}`,
      description: 'Patrón completo: createContext + Provider + custom hook para consumo seguro.',
    },
    {
      title: 'Evitar redundancia en state',
      language: 'tsx',
      code: `// ❌ MAL: state redundante
const [items, setItems] = useState<Item[]>([]);
const [total, setTotal] = useState(0); // Se puede calcular!

// ✅ BIEN: derivar con useMemo
const [items, setItems] = useState<Item[]>([]);
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.precio, 0),
  [items]
);`,
      description: 'Si un valor se puede calcular a partir de otro state, no lo guardes — derívalo.',
    },
  ],
  pitfalls: [
    'Guardar en state valores que se pueden calcular de otro state o props (state redundante).',
    'Duplicar datos en múltiples estados — genera bugs de sincronización. Usa un ID como referencia.',
    'Hacer prop drilling de 5+ niveles cuando Context resolvería el problema de forma más limpia.',
    'Usar Context para TODO — solo sirve para datos que muchos componentes comparten. State local sigue siendo mejor para datos que un solo componente usa.',
    'Olvidar que cambiar la key destruye TODO el state del componente (incluidos inputs, scroll, etc.).',
    'No envolver los consumidores en un Provider — useContext devuelve el valor por defecto (probablemente undefined/null).',
    'Crear objetos de state profundamente anidados que son difíciles de actualizar sin mutar.',
    'Poner el state demasiado arriba — si solo dos hermanos lo necesitan, ponlo en su padre directo, no en la raíz.',
  ],
  cheatSheet: [
    'State redundante → derivar con `useMemo`',
    'Dos hermanos comparten dato → lifting state up al padre',
    '`<Comp key={id} />` → resetear state al cambiar id',
    '`createContext(default)` → crear Context',
    '`<Ctx.Provider value={...}>` → proveer valor al subárbol',
    '`useContext(Ctx)` → consumir el valor más cercano',
    'Custom hook (`useXxx`) → validar que existe el Provider',
    'Flat > nested para estructuras de state',
    'Un dato, un lugar (single source of truth)',
    'Context para datos "globales" (tema, idioma, auth); state local para lo demás',
  ],
  flashcards: [
    {
      id: 'int-state-fc-1',
      front: '¿Qué es "lifting state up" y cuándo se usa?',
      back: 'Es mover el state al ancestro común más cercano de los componentes que lo necesitan. Se usa cuando dos o más hermanos necesitan leer o modificar el mismo dato.',
    },
    {
      id: 'int-state-fc-2',
      front: 'En la analogía del edificio, ¿qué representa "subir piso por piso preguntando"?',
      back: 'Representa prop drilling: pasar props a través de múltiples componentes intermedios que no usan esos datos, solo los reenvían.',
      usesAnalogy: true,
    },
    {
      id: 'int-state-fc-3',
      front: '¿Cómo reseteas completamente el state de un componente sin llamar a múltiples setters?',
      back: 'Cambiando su prop `key`. React destruye la instancia anterior y crea una nueva con state fresco. Es como arrancar la pizarra vieja y poner una en blanco.',
      usesAnalogy: true,
    },
    {
      id: 'int-state-fc-4',
      front: '¿Cuáles son los 3 pasos para usar Context?',
      back: '1) createContext(valorPorDefecto), 2) envolver el árbol con <Context.Provider value={...}>, 3) consumir con useContext(Context) en cualquier descendiente.',
    },
    {
      id: 'int-state-fc-5',
      front: '¿Por qué NO debes guardar en state un valor que puedes calcular de otro state?',
      back: 'Porque crea redundancia: tendrías que mantener ambos sincronizados manualmente. Mejor derivarlo con useMemo para que se recalcule automáticamente cuando cambie la fuente.',
    },
    {
      id: 'int-state-fc-6',
      front: '¿Qué pasa si usas useContext sin un Provider arriba en el árbol?',
      back: 'useContext devuelve el valor por defecto que se pasó a createContext. Si ese valor es null o undefined, tu componente probablemente falle.',
    },
    {
      id: 'int-state-fc-7',
      front: 'En la analogía del tablero del edificio, ¿qué representa el tablero central del lobby?',
      back: 'Representa Context: un lugar centralizado donde se publica información que cualquier componente (vecino) puede leer sin que se la pasen de mano en mano.',
      usesAnalogy: true,
    },
    {
      id: 'int-state-fc-8',
      front: '¿Por qué se recomienda crear un custom hook (ej: useTema) en lugar de usar useContext directamente?',
      back: 'Para encapsular la validación de que el Provider existe. Si alguien consume el Context fuera del Provider, el hook lanza un error descriptivo en lugar de fallar silenciosamente con undefined.',
    },
  ],
  quiz: [
    {
      id: 'int-state-q-1',
      question: 'En la analogía del tablero del edificio, ¿qué equivale a "bajar al lobby y leer el tablero central"?',
      options: [
        { id: 'int-state-q-1-a', text: 'Pasar una prop de padre a hijo' },
        { id: 'int-state-q-1-b', text: 'Llamar a useContext para leer el valor del Context' },
        { id: 'int-state-q-1-c', text: 'Usar useState para crear state local' },
        { id: 'int-state-q-1-d', text: 'Hacer lifting state up al componente raíz' },
      ],
      correctOptionId: 'int-state-q-1-b',
      explanation: 'useContext permite a un componente "bajar al lobby" y leer directamente el valor que el Provider publicó, sin necesidad de recibirlo por props a través de intermediarios.',
      whyOthersAreWrong: {
        'int-state-q-1-a': 'Pasar una prop es como subir piso por piso entregando el aviso — justamente lo que Context evita.',
        'int-state-q-1-c': 'useState crea una pizarra privada en tu piso, no lee del tablero compartido.',
        'int-state-q-1-d': 'Lifting state up es mover el aviso a un piso más alto, pero no equivale a leer un tablero central.',
      },
      usesAnalogy: true,
    },
    {
      id: 'int-state-q-2',
      question: '¿Cuál es la forma correcta de resetear todo el state de un componente Chat al cambiar de conversación?',
      options: [
        { id: 'int-state-q-2-a', text: 'Llamar a todos los setters con valores iniciales dentro de useEffect' },
        { id: 'int-state-q-2-b', text: 'Usar `<Chat key={conversacionId} />` para forzar una instancia nueva' },
        { id: 'int-state-q-2-c', text: 'Mutar el state directamente a valores vacíos' },
        { id: 'int-state-q-2-d', text: 'Usar Context para resetear desde afuera' },
      ],
      correctOptionId: 'int-state-q-2-b',
      explanation: 'Cambiar la key hace que React desmonte el componente viejo y monte uno nuevo con state fresco. Es la forma más limpia y declarativa de resetear.',
      whyOthersAreWrong: {
        'int-state-q-2-a': 'Funciona, pero es frágil — si agregas nuevo state, debes recordar resetearlo también. Key es más mantenible.',
        'int-state-q-2-c': 'Mutar state directo nunca es válido en React — no dispara re-render.',
        'int-state-q-2-d': 'Context no tiene mecanismo para resetear state de otros componentes. Cada componente gestiona su propio state.',
      },
    },
    {
      id: 'int-state-q-3',
      question: '¿Cuál de estos es un ejemplo de state redundante que deberías evitar?',
      options: [
        { id: 'int-state-q-3-a', text: 'Guardar `items` en state y calcular `total` con useMemo' },
        { id: 'int-state-q-3-b', text: 'Guardar `items` y `totalItems` como dos useState separados' },
        { id: 'int-state-q-3-c', text: 'Guardar solo el `selectedId` en vez de copiar el objeto seleccionado' },
        { id: 'int-state-q-3-d', text: 'Usar un solo useState con un objeto que agrupa campos relacionados' },
      ],
      correctOptionId: 'int-state-q-3-b',
      explanation: 'Si totalItems se puede calcular de items.length, guardarlo aparte es redundancia — debes mantenerlos sincronizados manualmente, lo cual genera bugs.',
      whyOthersAreWrong: {
        'int-state-q-3-a': 'Esto es correcto: derivar con useMemo evita redundancia.',
        'int-state-q-3-c': 'Guardar solo el ID es la práctica recomendada — evita duplicación del objeto.',
        'int-state-q-3-d': 'Agrupar campos relacionados en un objeto es un buen principio de diseño de state.',
      },
    },
    {
      id: 'int-state-q-4',
      question: '¿Qué sucede si un componente llama a `useContext(MiContext)` pero no tiene un `<MiContext.Provider>` en sus ancestros?',
      options: [
        { id: 'int-state-q-4-a', text: 'React lanza un error en tiempo de ejecución' },
        { id: 'int-state-q-4-b', text: 'Devuelve undefined automáticamente' },
        { id: 'int-state-q-4-c', text: 'Devuelve el valor por defecto pasado a createContext' },
        { id: 'int-state-q-4-d', text: 'El componente no se renderiza' },
      ],
      correctOptionId: 'int-state-q-4-c',
      explanation: 'Sin Provider, useContext devuelve el valor por defecto del createContext. Por eso es buena práctica crear un custom hook que valide la existencia del Provider.',
      whyOthersAreWrong: {
        'int-state-q-4-a': 'React no lanza error — simplemente usa el valor por defecto. El error lo debes lanzar tú en un custom hook si quieres detectarlo.',
        'int-state-q-4-b': 'Solo sería undefined si pasaste undefined como valor por defecto a createContext.',
        'int-state-q-4-d': 'El componente sí se renderiza, simplemente usa el valor por defecto del Context.',
      },
    },
    {
      id: 'int-state-q-5',
      question: 'Tienes un componente Abuelo → Padre → Hijo → Nieto. Solo Abuelo y Nieto necesitan un dato. ¿Cuál es la mejor estrategia?',
      options: [
        { id: 'int-state-q-5-a', text: 'Pasar la prop de Abuelo → Padre → Hijo → Nieto' },
        { id: 'int-state-q-5-b', text: 'Duplicar el state en Abuelo y en Nieto' },
        { id: 'int-state-q-5-c', text: 'Usar Context: Abuelo provee, Nieto consume con useContext' },
        { id: 'int-state-q-5-d', text: 'Mover todo el state a Nieto y que Abuelo lo lea por ref' },
      ],
      correctOptionId: 'int-state-q-5-c',
      explanation: 'Con 3 niveles intermedios que no usan el dato, Context evita prop drilling. Abuelo publica en el "tablero del lobby" y Nieto baja a leerlo directamente.',
      whyOthersAreWrong: {
        'int-state-q-5-a': 'Funciona, pero Padre e Hijo no usan el dato — es prop drilling innecesario que dificulta el mantenimiento.',
        'int-state-q-5-b': 'Duplicar state viola "single source of truth" y genera bugs de sincronización.',
        'int-state-q-5-d': 'El flujo de datos en React es de arriba hacia abajo. Un hijo no puede exponer state al abuelo así.',
      },
      usesAnalogy: true,
    },
    {
      id: 'int-state-q-6',
      question: '¿Cuándo es mejor usar lifting state up en lugar de Context?',
      options: [
        { id: 'int-state-q-6-a', text: 'Cuando el dato lo necesitan 10+ componentes en niveles distintos' },
        { id: 'int-state-q-6-b', text: 'Cuando dos componentes hermanos comparten un dato (1 nivel de elevación)' },
        { id: 'int-state-q-6-c', text: 'Cuando el dato cambia cada milisegundo' },
        { id: 'int-state-q-6-d', text: 'Nunca — Context siempre es superior a lifting state' },
      ],
      correctOptionId: 'int-state-q-6-b',
      explanation: 'Para 1-2 niveles con pocos consumidores, lifting state es más simple y directo. Context agrega complejidad que no se justifica para casos simples.',
      whyOthersAreWrong: {
        'int-state-q-6-a': 'Con 10+ consumidores en niveles distintos, Context es la mejor opción para evitar prop drilling masivo.',
        'int-state-q-6-c': 'La frecuencia de cambio no determina la elección — ambos causan re-renders. Para datos ultra-frecuentes se usan otras soluciones (refs, stores externos).',
        'int-state-q-6-d': 'Context tiene overhead conceptual y puede causar re-renders innecesarios. No es siempre superior.',
      },
    },
    {
      id: 'int-state-q-7',
      question: '¿Cuál es la ventaja de guardar `selectedId` en vez de `selectedItem` cuando tienes una lista de objetos en state?',
      options: [
        { id: 'int-state-q-7-a', text: 'Es más rápido porque los números ocupan menos memoria' },
        { id: 'int-state-q-7-b', text: 'Evita duplicación: el item ya existe en la lista, el ID es solo una referencia' },
        { id: 'int-state-q-7-c', text: 'Permite usar useContext para acceder al item' },
        { id: 'int-state-q-7-d', text: 'React requiere que las keys sean IDs simples' },
      ],
      correctOptionId: 'int-state-q-7-b',
      explanation: 'Si guardas el objeto completo, tienes el mismo dato en dos lugares. Si actualizas la lista pero olvidas actualizar selectedItem, se desincronizan. Con el ID, siempre derivas el item actual de la lista.',
      whyOthersAreWrong: {
        'int-state-q-7-a': 'La diferencia de memoria es insignificante. La ventaja real es evitar bugs de sincronización.',
        'int-state-q-7-c': 'Guardar un ID vs un objeto no tiene relación con useContext.',
        'int-state-q-7-d': 'React no tiene tal restricción. Las keys pueden ser strings de cualquier tipo.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 25,
  prerequisites: ['state'],
  tags: ['state-structure', 'lifting-state', 'context', 'useContext', 'provider', 'prop-drilling', 'key-reset'],
};
