import type { Topic } from '../types';

export const typescriptReactTopic: Topic = {
  id: 'typescript-react',
  courseId: 'react-level-2',
  title: 'TypeScript con React: El contrato del arquitecto',
  realWorldAnalogy: {
    title: 'El contrato del arquitecto',
    scenario:
      'Un arquitecto entrega planos con especificaciones exactas: "esta pared lleva 3 ventanas de 1.2m, marco de aluminio". El constructor no puede poner 4 ventanas de madera. Si el material no coincide con el plano, la obra se detiene antes de construir mal. Cada plano define qué acepta cada sección del edificio.',
    mapping: [
      { everyday: 'El plano con especificaciones exactas', technical: 'interface/type — la definición de Props' },
      { everyday: '"3 ventanas de 1.2m, marco aluminio"', technical: 'Propiedades tipadas con tipos específicos' },
      { everyday: 'La obra se detiene si el material no coincide', technical: 'Error de TypeScript en tiempo de compilación' },
      { everyday: 'Secciones opcionales marcadas con "si el cliente quiere"', technical: 'Propiedades opcionales con ?' },
      { everyday: 'Un plano genérico reutilizable para distintos pisos', technical: 'Generics — tipos parametrizados' },
    ],
    whereItBreaks:
      'Un plano real puede tener ambigüedades que se resuelven en obra. TypeScript es estricto: si no está en el tipo, no existe. No hay "interpretación" del compilador.',
  },
  keyTerms: [
    {
      term: 'interface',
      definition: 'Contrato que define la forma de un objeto. Extensible con extends y declaración abierta (declaration merging).',
      analogyHint: 'El plano oficial que define qué debe llevar cada sección.',
    },
    {
      term: 'type alias',
      definition: 'Nombre asignado a cualquier tipo: objetos, uniones, intersecciones, primitivos.',
      analogyHint: 'Una etiqueta que nombra cualquier especificación, incluso combinaciones.',
    },
    {
      term: 'React.ReactNode',
      definition: 'Tipo que acepta todo lo renderizable: string, number, JSX, arrays, null, undefined, boolean.',
      analogyHint: 'Todo material válido para rellenar un hueco en la pared.',
    },
    {
      term: 'React.ChangeEvent',
      definition: 'Tipo de evento disparado cuando cambia el valor de un input, select o textarea.',
      analogyHint: 'El aviso que llega cuando alguien modifica una especificación en el plano.',
    },
    {
      term: 'generics',
      definition: 'Tipos parametrizados que permiten reutilizar lógica con distintos tipos concretos.',
      analogyHint: 'Un plano genérico donde defines el material al momento de construir.',
    },
    {
      term: 'discriminated union',
      definition: 'Unión de tipos donde una propiedad literal común permite distinguir cada variante.',
      analogyHint: 'Planos con una etiqueta que dice "residencial" o "comercial" para saber qué reglas aplican.',
    },
    {
      term: 'ComponentProps',
      definition: 'Utility type que extrae los props de un componente existente para reutilizarlos.',
      analogyHint: 'Copiar las especificaciones de una sección ya aprobada para otra igual.',
    },
    {
      term: 'as const',
      definition: 'Aserción que convierte valores en tipos literales inmutables (readonly).',
      analogyHint: 'Sellar el plano para que nadie modifique las medidas.',
    },
  ],
  summary:
    'TypeScript con React añade seguridad de tipos a componentes, props, hooks y eventos. Defines interfaces o types para los props (el "contrato" que cada componente exige). Los hooks como useState y useRef aceptan generics para tipar su estado. Los eventos del DOM tienen tipos específicos (ChangeEvent, MouseEvent, FormEvent) que garantizan acceso seguro a propiedades. Las discriminated unions permiten modelar variantes de props mutuamente excluyentes.',
  explanation: `## El contrato del arquitecto en React

Cuando construyes componentes en React con TypeScript, cada componente es como una **sección del edificio** que tiene un **plano** (interface) definiendo exactamente qué materiales acepta.

### Definiendo el plano: Props con interface

\`\`\`tsx
interface ButtonProps {
  label: string;           // texto obligatorio
  onClick: () => void;     // función obligatoria
  variant?: 'primary' | 'secondary'; // opcional
  children?: React.ReactNode;        // cualquier contenido renderizable
}
\`\`\`

Si alguien intenta pasar un \`number\` donde el plano dice \`string\`, **la obra se detiene** — TypeScript marca error antes de ejecutar.

### interface vs type

Ambos definen "planos", pero:
- **interface**: extensible con \`extends\`, permite declaration merging. Ideal para props de componentes.
- **type**: soporta uniones (\`|\`), intersecciones (\`&\`), tipos primitivos. Ideal para tipos complejos.

\`\`\`tsx
// interface — extensible
interface CardProps extends ButtonProps {
  title: string;
}

// type — uniones y utilidades
type Status = 'loading' | 'success' | 'error';
type CardOrButton = CardProps | ButtonProps;
\`\`\`

### Hooks tipados: el plano genérico

Los generics son como un **plano reutilizable** donde defines el material al construir:

\`\`\`tsx
// useState infiere, pero puedes ser explícito
const [user, setUser] = useState<User | null>(null);

// useRef para DOM: el tipo del elemento
const inputRef = useRef<HTMLInputElement>(null);

// useRef para valores mutables
const timerRef = useRef<number>(0);
\`\`\`

### Eventos: avisos tipados

Cada evento del DOM tiene su tipo específico — como un formulario de aviso estandarizado:

\`\`\`tsx
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value); // TypeScript sabe que .value existe
}

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log(e.clientX, e.clientY);
}
\`\`\`

### Discriminated unions: planos con etiqueta

Cuando un componente tiene variantes mutuamente excluyentes, usa una propiedad discriminante:

\`\`\`tsx
type AlertProps =
  | { variant: 'success'; message: string }
  | { variant: 'error'; message: string; retry: () => void };

function Alert(props: AlertProps) {
  if (props.variant === 'error') {
    // TypeScript sabe que retry existe aquí
    return <button onClick={props.retry}>{props.message}</button>;
  }
  return <p>{props.message}</p>;
}
\`\`\`

### La controversia de React.FC

\`React.FC\` (FunctionComponent) añade \`children\` implícitamente y dificulta generics. La comunidad prefiere tipar props directamente:

\`\`\`tsx
// ❌ Evita React.FC
const Button: React.FC<ButtonProps> = ({ label }) => { ... };

// ✅ Prefiere tipado directo
function Button({ label, onClick }: ButtonProps) { ... }
\`\`\``,
  codeExamples: [
    {
      title: 'Props con interface y children',
      code: `interface CardProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}

function Card({ title, children, onClose }: CardProps) {
  return (
    <div className="card">
      <header>
        <h2>{title}</h2>
        {onClose && <button onClick={onClose}>×</button>}
      </header>
      <div>{children}</div>
    </div>
  );
}`,
      language: 'tsx',
      description: 'Componente con props tipados, children como ReactNode y prop opcional.',
    },
    {
      title: 'useState y useRef con generics',
      code: `interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // infiere boolean
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus(); // acceso seguro con optional chaining
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleFocus}>Enfocar</button>
      {user && <p>{user.name}</p>}
    </div>
  );
}`,
      language: 'tsx',
      description: 'Hooks tipados con generic explícito y acceso seguro al DOM.',
    },
    {
      title: 'Eventos tipados en formularios',
      code: `function LoginForm() {
  const [email, setEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login:', email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleChange}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}`,
      language: 'tsx',
      description: 'Eventos de formulario con tipos específicos para input y form.',
    },
    {
      title: 'Discriminated union para variantes de componente',
      code: `type NotificationProps =
  | { type: 'info'; message: string }
  | { type: 'action'; message: string; onAction: () => void; actionLabel: string };

function Notification(props: NotificationProps) {
  return (
    <div className={\`notification \${props.type}\`}>
      <p>{props.message}</p>
      {props.type === 'action' && (
        <button onClick={props.onAction}>
          {props.actionLabel}
        </button>
      )}
    </div>
  );
}

// Uso:
<Notification type="info" message="Guardado" />
<Notification type="action" message="Error" onAction={retry} actionLabel="Reintentar" />`,
      language: 'tsx',
      description: 'Union discriminada que garantiza props correctos según la variante.',
    },
    {
      title: 'Generic custom hook',
      code: `function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(stored) : value;
    setStored(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [stored, setValue] as const;
}

// El tipo se infiere del initialValue:
const [theme, setTheme] = useLocalStorage('theme', 'dark');
// theme: string, setTheme: (value: string | ((prev: string) => string)) => void`,
      language: 'ts',
      description: 'Hook genérico que preserva el tipo del valor inicial a través de toda la API.',
    },
    {
      title: 'ComponentProps y HTMLAttributes',
      code: `import { ComponentProps } from 'react';

// Extraer props de un elemento HTML nativo
type InputProps = ComponentProps<'input'>;

// Extender props nativos para un componente personalizado
interface SearchInputProps extends ComponentProps<'input'> {
  onSearch: (query: string) => void;
}

function SearchInput({ onSearch, ...inputProps }: SearchInputProps) {
  return (
    <input
      {...inputProps}
      onChange={(e) => {
        inputProps.onChange?.(e);
        onSearch(e.target.value);
      }}
    />
  );
}`,
      language: 'tsx',
      description: 'Reutilizar tipos de elementos nativos con ComponentProps utility type.',
    },
  ],
  pitfalls: [
    'Usar `React.FC` — añade children implícitamente y dificulta generics. Prefiere tipado directo de props.',
    'Olvidar tipar useState con null: `useState<User | null>(null)` — sin el generic, TypeScript infiere `null` como único tipo.',
    'Usar `any` en eventos — siempre usa React.ChangeEvent<HTMLInputElement>, React.MouseEvent<HTMLButtonElement>, etc.',
    'No tipar useRef para DOM: `useRef<HTMLInputElement>(null)` — sin el generic, `.current` no tiene los métodos del elemento.',
    'Confundir `ReactNode` con `ReactElement` — ReactNode incluye string, number, null; ReactElement es solo JSX.',
    'Usar type assertion (`as`) para silenciar errores en vez de corregir el tipo real — oculta bugs.',
    'No usar discriminated unions cuando un componente tiene variantes — terminas con props opcionales que deberían ser obligatorios.',
    'Olvidar `as const` en arrays retornados por hooks: sin él, TypeScript infiere `(string | Function)[]` en vez de tupla.',
  ],
  cheatSheet: [
    'Props → `interface ButtonProps { label: string; onClick: () => void }`',
    'Children → `children: React.ReactNode`',
    'useState genérico → `useState<User | null>(null)`',
    'useRef DOM → `useRef<HTMLInputElement>(null)`',
    'Eventos → `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`',
    'Discriminated union → propiedad literal compartida (`type: "a" | "b"`) para distinguir variantes',
    'ComponentProps → `ComponentProps<"button">` extrae props de elementos nativos',
    'Evita React.FC → tipado directo: `function Btn(props: BtnProps)`',
    'as const → convierte retorno en tupla readonly: `return [value, setter] as const`',
    'Genérico en hook → `function useCustom<T>(init: T): [T, (v: T) => void]`',
  ],
  flashcards: [
    {
      id: 'ts-react-fc-1',
      front: '¿Cuál es la diferencia principal entre `interface` y `type` para definir props?',
      back: '`interface` es extensible con `extends` y permite declaration merging (añadir propiedades desde otros archivos). `type` soporta uniones (`|`), intersecciones (`&`) y tipos primitivos. Para props de componentes, `interface` es la convención preferida.',
    },
    {
      id: 'ts-react-fc-2',
      front: '¿Qué tipo usas para la prop `children` en un componente React?',
      back: '`React.ReactNode` — acepta todo lo renderizable: string, number, JSX, arrays, null, undefined, boolean. Es el tipo más inclusivo para contenido hijo.',
    },
    {
      id: 'ts-react-fc-3',
      front: '¿Cómo tipas un `useState` que empieza como null pero luego tendrá un objeto User?',
      back: '`const [user, setUser] = useState<User | null>(null);` — el generic explícito le dice a TypeScript que el estado puede ser User O null.',
    },
    {
      id: 'ts-react-fc-4',
      front: '¿Por qué la comunidad evita `React.FC` para tipar componentes?',
      back: 'Porque antes añadía `children` implícitamente (confuso), dificulta el uso de generics en el componente, y no ofrece ventajas sobre tipar props directamente en los parámetros de la función.',
    },
    {
      id: 'ts-react-fc-5',
      front: 'En la analogía del arquitecto, ¿qué representa un generic como `useState<T>`?',
      back: 'Un plano genérico reutilizable donde defines el material (el tipo T) al momento de construir. El plano no cambia, pero el material se elige según la necesidad.',
      usesAnalogy: true,
    },
    {
      id: 'ts-react-fc-6',
      front: '¿Qué es una discriminated union y cuándo la usas en props?',
      back: 'Es una unión de tipos donde una propiedad literal común (discriminante) permite a TypeScript saber qué variante estás usando. La usas cuando un componente tiene variantes con props mutuamente excluyentes (ej: Alert con "success" no necesita `retry`, pero "error" sí).',
    },
    {
      id: 'ts-react-fc-7',
      front: '¿Cómo tipas un event handler para un `<input>` onChange?',
      back: '`(e: React.ChangeEvent<HTMLInputElement>) => void` — el generic `<HTMLInputElement>` le dice a TypeScript que `e.target` tiene propiedades de un input (`.value`, `.checked`, etc.).',
    },
    {
      id: 'ts-react-fc-8',
      front: '¿Qué hace `as const` en el retorno de un custom hook?',
      back: 'Convierte el array en una tupla readonly con tipos literales. Sin él, `[value, setter]` se infiere como `(string | Function)[]`. Con `as const`, TypeScript sabe que el índice 0 es string y el índice 1 es la función.',
    },
  ],
  quiz: [
    {
      id: 'ts-react-q-1',
      question: 'En la analogía del arquitecto, ¿qué sucede cuando pasas un prop con tipo incorrecto a un componente tipado?',
      options: [
        { id: 'ts-react-q-1-a', text: 'El componente ignora el prop silenciosamente' },
        { id: 'ts-react-q-1-b', text: 'La obra se detiene: TypeScript marca error antes de ejecutar' },
        { id: 'ts-react-q-1-c', text: 'React lanza un warning en la consola en runtime' },
        { id: 'ts-react-q-1-d', text: 'El prop se convierte automáticamente al tipo correcto' },
      ],
      correctOptionId: 'ts-react-q-1-b',
      explanation: 'Igual que un constructor no puede usar materiales que no coinciden con el plano, TypeScript detiene la compilación cuando un prop no coincide con la interface definida. El error ocurre en tiempo de compilación, no en runtime.',
      whyOthersAreWrong: {
        'ts-react-q-1-a': 'TypeScript no ignora errores de tipo — los reporta como errores de compilación.',
        'ts-react-q-1-c': 'Eso describe PropTypes (runtime), no TypeScript (compilación). TypeScript actúa antes de ejecutar.',
        'ts-react-q-1-d': 'TypeScript no hace coerción de tipos. Si no coincide, es un error.',
      },
      usesAnalogy: true,
    },
    {
      id: 'ts-react-q-2',
      question: '¿Cuál es la forma correcta de tipar un estado que inicia como `null` y luego contendrá un objeto `Product`?',
      options: [
        { id: 'ts-react-q-2-a', text: '`const [product, setProduct] = useState(null)`' },
        { id: 'ts-react-q-2-b', text: '`const [product, setProduct] = useState<Product>(null)`' },
        { id: 'ts-react-q-2-c', text: '`const [product, setProduct] = useState<Product | null>(null)`' },
        { id: 'ts-react-q-2-d', text: '`const [product, setProduct] = useState<any>(null)`' },
      ],
      correctOptionId: 'ts-react-q-2-c',
      explanation: 'El generic `<Product | null>` indica que el estado puede ser de tipo Product O null. Esto permite asignar null inicialmente y un objeto Product después, manteniendo type safety.',
      whyOthersAreWrong: {
        'ts-react-q-2-a': 'Sin generic, TypeScript infiere el tipo como `null` únicamente — no podrás asignar un Product después.',
        'ts-react-q-2-b': 'Error de compilación: `null` no es asignable a `Product` sin incluir null en la unión.',
        'ts-react-q-2-d': '`any` elimina toda seguridad de tipos — viola las reglas de TypeScript estricto.',
      },
    },
    {
      id: 'ts-react-q-3',
      question: '¿Qué tipo debes usar para la prop `children` si quieres aceptar cualquier contenido renderizable?',
      options: [
        { id: 'ts-react-q-3-a', text: '`React.ReactElement`' },
        { id: 'ts-react-q-3-b', text: '`React.ReactNode`' },
        { id: 'ts-react-q-3-c', text: '`JSX.Element`' },
        { id: 'ts-react-q-3-d', text: '`string | JSX.Element`' },
      ],
      correctOptionId: 'ts-react-q-3-b',
      explanation: '`React.ReactNode` es el tipo más inclusivo: acepta string, number, boolean, null, undefined, ReactElement y arrays de estos. Es el estándar para children.',
      whyOthersAreWrong: {
        'ts-react-q-3-a': 'ReactElement solo acepta JSX — rechaza strings, numbers y null.',
        'ts-react-q-3-c': 'JSX.Element es aún más restrictivo que ReactElement y no acepta null ni strings.',
        'ts-react-q-3-d': 'Excluye numbers, booleans, null, arrays y elementos anidados — demasiado restrictivo.',
      },
    },
    {
      id: 'ts-react-q-4',
      question: '¿Cuál es el tipo correcto para el event handler de un `<input type="text">` onChange?',
      options: [
        { id: 'ts-react-q-4-a', text: '`(e: React.MouseEvent<HTMLInputElement>) => void`' },
        { id: 'ts-react-q-4-b', text: '`(e: React.ChangeEvent<HTMLInputElement>) => void`' },
        { id: 'ts-react-q-4-c', text: '`(e: React.FormEvent<HTMLInputElement>) => void`' },
        { id: 'ts-react-q-4-d', text: '`(e: Event) => void`' },
      ],
      correctOptionId: 'ts-react-q-4-b',
      explanation: '`React.ChangeEvent<HTMLInputElement>` es el tipo correcto para onChange en inputs. El generic indica el elemento HTML, dando acceso tipado a `e.target.value`.',
      whyOthersAreWrong: {
        'ts-react-q-4-a': 'MouseEvent es para onClick, onMouseDown, etc. — no para cambios de valor.',
        'ts-react-q-4-c': 'FormEvent es para onSubmit del `<form>`, no para onChange de un input individual.',
        'ts-react-q-4-d': 'Event nativo del DOM no tiene las propiedades sintéticas de React y pierde inferencia en target.',
      },
    },
    {
      id: 'ts-react-q-5',
      question: '¿Por qué se recomienda evitar `React.FC` para definir componentes?',
      options: [
        { id: 'ts-react-q-5-a', text: 'Porque React.FC es más lento en runtime que una función normal' },
        { id: 'ts-react-q-5-b', text: 'Porque React.FC no permite retornar JSX' },
        { id: 'ts-react-q-5-c', text: 'Porque dificulta generics y antes añadía children implícitamente' },
        { id: 'ts-react-q-5-d', text: 'Porque React.FC está deprecado desde React 17' },
      ],
      correctOptionId: 'ts-react-q-5-c',
      explanation: 'React.FC históricamente incluía children en los props sin declararlos, causando confusión. Además, hacer un componente genérico con FC es sintácticamente complicado. Tipar props directamente es más simple y explícito.',
      whyOthersAreWrong: {
        'ts-react-q-5-a': 'React.FC es solo un tipo — no existe en runtime, no afecta rendimiento.',
        'ts-react-q-5-b': 'React.FC sí permite retornar JSX — ese es su propósito.',
        'ts-react-q-5-d': 'React.FC no está deprecado oficialmente — simplemente no se recomienda como patrón.',
      },
    },
    {
      id: 'ts-react-q-6',
      question: '¿Qué ventaja ofrece una discriminated union sobre props opcionales para variantes de un componente?',
      options: [
        { id: 'ts-react-q-6-a', text: 'Reduce el tamaño del bundle JavaScript final' },
        { id: 'ts-react-q-6-b', text: 'Garantiza que los props correctos estén presentes según la variante elegida' },
        { id: 'ts-react-q-6-c', text: 'Permite usar el componente sin ningún prop' },
        { id: 'ts-react-q-6-d', text: 'Hace que el componente sea compatible con class components' },
      ],
      correctOptionId: 'ts-react-q-6-b',
      explanation: 'Con discriminated unions, TypeScript exige los props obligatorios de cada variante. Si eliges `type: "error"`, debe existir `retry`. Con props opcionales, podrías olvidar `retry` y TypeScript no se quejaría.',
      whyOthersAreWrong: {
        'ts-react-q-6-a': 'Los tipos se eliminan en compilación — no afectan el bundle.',
        'ts-react-q-6-c': 'Al contrario: las discriminated unions exigen al menos la propiedad discriminante.',
        'ts-react-q-6-d': 'Las discriminated unions no tienen relación con class vs function components.',
      },
    },
    {
      id: 'ts-react-q-7',
      question: '¿Qué hace `as const` al final de `return [count, setCount] as const` en un custom hook?',
      options: [
        { id: 'ts-react-q-7-a', text: 'Hace que los valores sean inmutables en runtime' },
        { id: 'ts-react-q-7-b', text: 'Convierte el array en una tupla readonly con tipos específicos por posición' },
        { id: 'ts-react-q-7-c', text: 'Previene que el hook se re-ejecute innecesariamente' },
        { id: 'ts-react-q-7-d', text: 'Exporta los valores como constantes globales' },
      ],
      correctOptionId: 'ts-react-q-7-b',
      explanation: 'Sin `as const`, TypeScript infiere `(number | Function)[]` — pierdes la información de qué hay en cada posición. Con `as const`, sabe que índice 0 es number y índice 1 es la función setter, como una tupla.',
      whyOthersAreWrong: {
        'ts-react-q-7-a': '`as const` es solo una aserción de tipo — no afecta el runtime de JavaScript.',
        'ts-react-q-7-c': 'La re-ejecución depende de React (hooks rules), no de aserciones de tipo.',
        'ts-react-q-7-d': '`as const` no tiene relación con exports ni scope — solo afecta inferencia de tipos.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 25,
  prerequisites: ['components', 'hooks'],
  tags: ['typescript', 'types', 'generics', 'props', 'events', 'interfaces', 'discriminated-unions'],
  codeChallenge: {
    instruction: 'Define una interface para las props de un componente tipado con TypeScript.',
    template: `{{keyword}} ButtonProps {
  label: {{string_type}};
  onClick: () => {{void_type}};
  disabled{{optional}}: boolean;
}

function Button({{ props_param }}: {{type_name}}) {
  return (
    <button onClick={props.onClick} disabled={props.disabled}>
      {props.label}
    </button>
  );
}`,
    language: 'tsx',
    blanks: [
      { id: 'keyword', answers: ['interface', 'type'], placeholder: 'palabra clave' },
      { id: 'string_type', answers: ['string'], placeholder: 'tipo' },
      { id: 'void_type', answers: ['void'], placeholder: 'tipo retorno' },
      { id: 'optional', answers: ['?'], placeholder: 'modificador' },
      { id: 'props_param', answers: ['props'], placeholder: 'parámetro' },
      { id: 'type_name', answers: ['ButtonProps'], placeholder: 'tipo' },
    ],
    hint: 'interface define la forma de un objeto. Las propiedades opcionales llevan ? antes de los dos puntos. El componente recibe props tipadas con : NombreTipo.',
  },
};
