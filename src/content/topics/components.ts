import type { Topic } from '../types';

export const componentsTopic: Topic = {
  id: 'components',
  title: 'Components: Bloques LEGO',
  realWorldAnalogy: {
    title: 'Los bloques LEGO',
    scenario:
      'Cada pieza LEGO tiene una forma definida y conectores estándar. Puedes usar la misma pieza roja de 2x4 en un castillo, un auto o una nave. Las piezas se combinan encajándolas — una pieza grande puede estar hecha de varias pequeñas ensambladas.',
    mapping: [
      { everyday: 'Una pieza LEGO individual', technical: 'Un componente React (función que retorna JSX)' },
      { everyday: 'Los conectores (pines que encajan)', technical: 'Props — la interfaz para pasar datos' },
      { everyday: 'La caja donde guardas las piezas por tipo', technical: 'Los archivos con export/import' },
      { everyday: 'Una pieza grande hecha de otras', technical: 'Composición: componentes que renderizan otros' },
      { everyday: 'El manual de instrucciones', technical: 'La prop children (contenido que va dentro)' },
    ],
    whereItBreaks:
      'Las piezas LEGO son estáticas una vez ensambladas. Los componentes React se re-renderizan cuando sus props o state cambian — son "piezas vivas".',
  },
  keyTerms: [
    {
      term: 'component',
      definition: 'Función que recibe props y retorna JSX. Pieza reutilizable del UI.',
      analogyHint: 'Una pieza LEGO con forma y conectores definidos.',
    },
    {
      term: 'props',
      definition: 'Datos que un padre pasa a un hijo. Son read-only dentro del hijo.',
      analogyHint: 'Los conectores que llevan información de una pieza a la siguiente.',
    },
    {
      term: 'children',
      definition: 'Prop especial: el contenido que va entre las etiquetas de apertura y cierre del componente.',
      analogyHint: 'El espacio hueco de la pieza LEGO donde encajas piezas más pequeñas.',
    },
    {
      term: 'composition',
      definition: 'Patrón de construir componentes complejos combinando componentes simples.',
      analogyHint: 'Armar un castillo encajando piezas pequeñas entre sí.',
    },
    {
      term: 'default export',
      definition: 'Export principal de un archivo — se importa sin llaves.',
      analogyHint: 'La pieza principal de la caja, la que identifica el set.',
    },
    {
      term: 'named export',
      definition: 'Exports adicionales de un archivo — se importan con llaves {}.',
      analogyHint: 'Las piezas extra que vienen en la misma caja.',
    },
  ],
  summary:
    'Un componente React es una función que recibe props y retorna JSX. Se reutilizan como piezas LEGO: misma pieza, distintos datos. Props fluyen hacia abajo (padre → hijo) y son read-only. `children` permite composición (meter contenido dentro). Se organizan en archivos con export/import.',
  explanation: `## Piezas reutilizables

Como los **bloques LEGO**, un componente es una pieza con forma definida (su JSX) y conectores estándar (sus props). La misma pieza sirve en contextos distintos:

\`\`\`tsx
// Un componente = una pieza LEGO
function Button({ label, onClick, variant = 'primary' }) {
  return (
    <button className={variant} onClick={onClick}>
      {label}
    </button>
  );
}

// Reutilización: misma pieza, diferentes datos
<Button label="Guardar" onClick={handleSave} variant="primary" />
<Button label="Cancelar" onClick={handleCancel} variant="ghost" />
\`\`\`

## Props: los conectores

Las props son datos que el padre pasa al hijo. Son **read-only**: el hijo las usa pero nunca las modifica (igual que no deformas un conector LEGO para que encaje).

\`\`\`tsx
// Props con TypeScript
interface CardProps {
  title: string;
  description: string;
  image?: string; // opcional
}

function Card({ title, description, image }: CardProps) {
  return (
    <article>
      {image && <img src={image} alt={title} />}
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}
\`\`\`

## Children: el espacio hueco

La prop \`children\` es lo que va ENTRE las etiquetas — como el espacio hueco de una pieza LEGO donde metes otras:

\`\`\`tsx
function Layout({ children }) {
  return (
    <div className="container">
      <Header />
      <main>{children}</main>  {/* aquí encajan las piezas hijas */}
      <Footer />
    </div>
  );
}

// Uso: lo que va entre <Layout> y </Layout> es "children"
<Layout>
  <h1>Página principal</h1>
  <p>Contenido aquí</p>
</Layout>
\`\`\`

## Composición sobre herencia

React favorece construir complejidad **encajando componentes** (composición), no heredando de clases base:

\`\`\`tsx
// ✅ Composición: Card genérica + contenido específico
<Card>
  <UserAvatar user={user} />
  <UserStats stats={stats} />
</Card>

// ❌ No hagas esto: UserCard extends Card (herencia)
\`\`\`

## Export/Import: la caja de piezas

\`\`\`tsx
// Button.tsx — un componente por archivo (convención)
export default function Button({ label }) { ... }

// utils.tsx — múltiples exports
export function formatDate(d) { ... }
export function formatPrice(p) { ... }

// Importar
import Button from './Button';            // default
import { formatDate } from './utils';     // named
\`\`\``,
  codeExamples: [
    {
      title: 'Componente con props tipadas y valor default',
      language: 'tsx',
      code: `interface AlertProps {
  message: string;
  type?: 'info' | 'error' | 'success';
  onDismiss?: () => void;
}

function Alert({ message, type = 'info', onDismiss }: AlertProps) {
  return (
    <div className={\`alert alert-\${type}\`} role="alert">
      <p>{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Cerrar">×</button>
      )}
    </div>
  );
}`,
      description: 'Props con TypeScript, default values y conditional rendering interno.',
    },
    {
      title: 'Composición con children',
      language: 'tsx',
      code: `function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      <div className="section-content">
        {children}
      </div>
    </section>
  );
}

// Uso — lo de adentro es "children"
<Section title="Perfil">
  <Avatar />
  <UserName />
</Section>`,
      description: 'children permite inyectar cualquier contenido dentro del componente.',
    },
  ],
  pitfalls: [
    'Mutar props dentro del hijo — las props son read-only. Si necesitas cambiarlas, usa state en el padre.',
    'Componentes deben empezar con mayúscula (PascalCase). Minúscula = elemento HTML nativo.',
    'No retornar nada del componente (olvidar return con llaves) — React renderiza undefined/nothing.',
    'Props drilling excesivo (pasar props por 4+ niveles sin usarlas en el medio) — señal de necesitar contexto.',
    'Definir componentes dentro de otros componentes — se recrean en cada render, perdiendo state.',
    'Confundir default export con named export al importar — genera errores silenciosos.',
  ],
  cheatSheet: [
    'Componente = función que retorna JSX. PascalCase obligatorio.',
    'Props = datos del padre al hijo. Read-only. Flujo unidireccional ↓',
    '`{ children }` = contenido entre etiquetas de apertura/cierre',
    'Default values: `function C({ x = 5 })` — si no se pasa, usa 5',
    'Composición > herencia — siempre en React',
    '1 componente principal por archivo (default export)',
    'Nunca definir un componente dentro de otro componente',
    'Props se leen con destructuring: `function C({ a, b })` no `function C(props)`',
  ],
  flashcards: [
    {
      id: 'comp-fc-1',
      front: '¿Qué es un componente React?',
      back: 'Una función que recibe props y retorna JSX. Es una pieza LEGO reutilizable: misma forma, distintos datos según las props que le pases.',
      usesAnalogy: true,
    },
    {
      id: 'comp-fc-2',
      front: '¿Puedes modificar las props dentro de un componente hijo?',
      back: 'No. Props son read-only. Si necesitas un valor que cambie, usa state. Las props fluyen en una sola dirección: padre → hijo.',
    },
    {
      id: 'comp-fc-3',
      front: '¿Qué es la prop children y cuándo se usa?',
      back: 'Es el contenido que va entre las etiquetas del componente (<X>esto</X>). Se usa para composición: crear contenedores genéricos que aceptan cualquier contenido interno.',
      usesAnalogy: true,
    },
    {
      id: 'comp-fc-4',
      front: '¿Cuál es la diferencia entre default export y named export?',
      back: 'Default: uno por archivo, se importa sin llaves. Named: múltiples por archivo, se importan con llaves {}. Convención: componente principal = default.',
    },
    {
      id: 'comp-fc-5',
      front: '¿Por qué los componentes deben empezar con mayúscula?',
      back: 'React usa la capitalización para distinguir componentes (<Button />) de elementos HTML nativos (<button>). Minúscula = HTML, PascalCase = componente.',
    },
    {
      id: 'comp-fc-6',
      front: '¿Por qué no debes definir un componente dentro de otro componente?',
      back: 'Se recrea en cada render del padre, perdiendo su state y causando re-mounts innecesarios. Siempre define componentes al nivel del módulo.',
    },
  ],
  quiz: [
    {
      id: 'comp-q-1',
      question: 'Siguiendo la analogía LEGO: si los "conectores" son las props, ¿qué pasa si un hijo intenta "deformar el conector" (mutar una prop)?',
      options: [
        { id: 'a', text: 'React lanza un error en tiempo de ejecución' },
        { id: 'b', text: 'La prop se actualiza en el padre automáticamente' },
        { id: 'c', text: 'Puede mutar el objeto, pero es un bug: React no detecta el cambio y no re-renderiza' },
        { id: 'd', text: 'TypeScript lo impide en compilación' },
      ],
      correctOptionId: 'c',
      explanation: 'JS permite mutar objetos, pero React asume inmutabilidad. Si mutas una prop, el padre no se entera y el UI queda inconsistente.',
      whyOthersAreWrong: {
        a: 'React no lanza error al mutar — es un bug silencioso, más peligroso.',
        b: 'Props son one-way (padre→hijo). No hay binding bidireccional.',
        d: 'TS marca props como readonly en el type pero si usas any o forzas, no te salva en runtime.',
      },
      usesAnalogy: true,
    },
    {
      id: 'comp-q-2',
      question: '¿Cuál es la forma correcta de pasar contenido dentro de un componente wrapper?',
      options: [
        { id: 'a', text: '`<Wrapper content={<Child />} />`' },
        { id: 'b', text: '`<Wrapper><Child /></Wrapper>`' },
        { id: 'c', text: '`<Wrapper child="Child" />`' },
        { id: 'd', text: '`Wrapper(Child)`' },
      ],
      correctOptionId: 'b',
      explanation: 'Lo que va entre <Wrapper> y </Wrapper> se recibe automáticamente como prop `children`. Es el patrón estándar de composición.',
      whyOthersAreWrong: {
        a: 'Técnicamente funciona (render prop), pero no es el patrón estándar. children es más idiomático.',
        c: 'Pasar un string con el nombre no renderiza nada — necesitas pasar JSX.',
        d: 'Los componentes se invocan con JSX, no como funciones directas (React pierde el tracking).',
      },
    },
    {
      id: 'comp-q-3',
      question: '¿Qué pasa si escribes un componente con minúscula?\n\n```jsx\nfunction card({ title }) {\n  return <div>{title}</div>;\n}\n<card title="hola" />\n```',
      options: [
        { id: 'a', text: 'Funciona normal' },
        { id: 'b', text: 'React lo interpreta como elemento HTML desconocido, no como componente' },
        { id: 'c', text: 'Error de compilación' },
        { id: 'd', text: 'Se renderiza pero sin props' },
      ],
      correctOptionId: 'b',
      explanation: 'React usa la capitalización: minúscula = elemento HTML nativo. <card> se renderiza como tag HTML desconocido y title se ignora como prop de componente.',
      whyOthersAreWrong: {
        a: 'No funciona como esperas — no invoca tu función como componente React.',
        c: 'No hay error de compilación. JSX acepta cualquier tag. El error es lógico, no sintáctico.',
        d: 'title se pasa como atributo HTML del tag desconocido, pero el componente nunca se ejecuta.',
      },
    },
    {
      id: 'comp-q-4',
      question: '¿Cuál es la ventaja de composición sobre herencia en React?',
      options: [
        { id: 'a', text: 'Composición es más rápida en runtime' },
        { id: 'b', text: 'Composición permite combinar componentes flexiblemente sin acoplamiento rígido' },
        { id: 'c', text: 'React no soporta herencia de ningún tipo' },
        { id: 'd', text: 'Composición permite acceder a métodos protegidos' },
      ],
      correctOptionId: 'b',
      explanation: 'Composición (encajar piezas LEGO) permite combinar componentes de formas que no puedes prever — más flexible que jerarquías de herencia rígidas.',
      whyOthersAreWrong: {
        a: 'La diferencia no es de performance sino de flexibilidad y mantenibilidad.',
        c: 'JS soporta herencia con clases. React la desaconseja pero no la prohibe.',
        d: 'Métodos protegidos son un concepto de herencia OOP, no de composición funcional.',
      },
    },
    {
      id: 'comp-q-5',
      question: '¿Cuál es el problema con este código?\n\n```jsx\nfunction Parent() {\n  function Child() {\n    return <p>Hola</p>;\n  }\n  return <Child />;\n}\n```',
      options: [
        { id: 'a', text: 'No hay problema, es válido' },
        { id: 'b', text: 'Child se recrea en cada render de Parent, perdiendo state y causando re-mounts' },
        { id: 'c', text: 'Error: no puedes definir funciones dentro de funciones' },
        { id: 'd', text: 'Child no puede acceder a las props de Parent' },
      ],
      correctOptionId: 'b',
      explanation: 'Cada render de Parent crea una NUEVA función Child. React la ve como componente distinto y desmonta/remonta — destruyendo todo state interno.',
      whyOthersAreWrong: {
        a: 'Es sintácticamente válido pero lógicamente un bug serio de performance y state.',
        c: 'JS permite funciones anidadas. El problema es cómo React las interpreta.',
        d: 'Sí puede acceder por closure, pero ese no es el problema.',
      },
    },
  ],
  difficulty: 'basico',
  estimatedMinutes: 18,
  prerequisites: ['jsx'],
  tags: ['components', 'props', 'children', 'composition', 'export', 'import'],
};
