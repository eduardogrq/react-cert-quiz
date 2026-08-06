import type { Topic } from '../types';

export const toolingTopic: Topic = {
  id: 'tooling',
  title: 'Tooling: El taller del artesano',
  realWorldAnalogy: {
    title: 'El taller del artesano',
    scenario:
      'Un artesano tiene un taller con herramientas especializadas: un horno rápido que calienta piezas en segundos (no en horas), un banco de trabajo que refleja al instante cada ajuste sin desarmar toda la pieza, un traductor que convierte bocetos en instrucciones de máquina, y una lupa de inspección que revela defectos internos invisibles a simple vista.',
    mapping: [
      { everyday: 'El horno rápido que calienta en segundos', technical: 'Vite — servidor de desarrollo ultrarrápido con ESM nativo' },
      { everyday: 'El banco que refleja cada ajuste sin desarmar la pieza', technical: 'HMR — Hot Module Replacement sin recargar la página' },
      { everyday: 'El traductor de bocetos a instrucciones de máquina', technical: 'Babel/SWC — transforma JSX a JavaScript estándar' },
      { everyday: 'La lupa de inspección que revela defectos internos', technical: 'React DevTools — inspecciona componentes, estado y rendimiento' },
    ],
    whereItBreaks:
      'En un taller real puedes usar cualquier herramienta en cualquier orden. En el tooling de React, existe un pipeline definido: primero la transformación (Babel/SWC), luego el bundling (Vite), y DevTools solo funciona en el navegador con la extensión instalada.',
  },
  keyTerms: [
    {
      term: 'Vite',
      definition: 'Herramienta de build que usa ES Modules nativos en desarrollo para servir archivos sin bundlear, logrando arranques casi instantáneos.',
      analogyHint: 'El horno rápido que calienta piezas en segundos, no en horas.',
    },
    {
      term: 'HMR (Hot Module Replacement)',
      definition: 'Mecanismo que inyecta cambios de código en el navegador sin recargar la página completa, preservando el estado.',
      analogyHint: 'Ajustar una pieza en el banco sin desarmar toda la obra.',
    },
    {
      term: 'ESM (ES Modules)',
      definition: 'Sistema nativo de módulos de JavaScript con import/export, usado por Vite para evitar el bundling en desarrollo.',
      analogyHint: 'Piezas individuales que el horno calienta por separado, bajo demanda.',
    },
    {
      term: 'Babel',
      definition: 'Transpilador que convierte código moderno (JSX, TypeScript) a JavaScript compatible con navegadores.',
      analogyHint: 'El traductor que convierte bocetos en instrucciones de máquina.',
    },
    {
      term: 'JSX Transform',
      definition: 'Proceso que convierte la sintaxis JSX (<Component />) en llamadas a funciones de React (jsx()).',
      analogyHint: 'Traducir un dibujo artístico a coordenadas precisas de fabricación.',
    },
    {
      term: 'React DevTools',
      definition: 'Extensión del navegador que permite inspeccionar el árbol de componentes, props, state y rendimiento.',
      analogyHint: 'La lupa que revela la estructura interna invisible a simple vista.',
    },
    {
      term: 'Profiler',
      definition: 'Herramienta dentro de React DevTools que mide el tiempo de renderizado de cada componente.',
      analogyHint: 'Un cronómetro que mide cuánto tarda cada pieza en el horno.',
    },
  ],
  summary:
    'El tooling moderno de React combina varias herramientas: Vite ofrece un servidor de desarrollo ultrarrápido basado en ES Modules nativos, con HMR que inyecta cambios sin perder estado. Babel (o SWC) transforma JSX y TypeScript a JavaScript que el navegador entiende. React DevTools permite inspeccionar componentes, estado y medir rendimiento con el Profiler. Dominar estas herramientas acelera drásticamente el ciclo de desarrollo.',
  explanation: `## El taller del artesano moderno

Imagina que eres un artesano y tu taller tiene cuatro herramientas esenciales. Cada una cumple un rol específico en tu flujo de trabajo.

### El horno rápido: Vite

En el pasado, los artesanos usaban hornos enormes que tardaban minutos en calentar toda la producción (como Webpack bundeando todo el proyecto). **Vite** es el horno moderno: calienta solo la pieza que necesitas, al instante.

\`\`\`bash
# Crear un proyecto nuevo con Vite
npm create vite@latest mi-app -- --template react-ts
\`\`\`

Vite funciona con **ES Modules nativos**: en lugar de empaquetar todo en un archivo gigante durante el desarrollo, sirve cada módulo por separado. El navegador pide solo lo que necesita.

\`\`\`ts
// Vite sirve este import directamente como ESM en desarrollo
// No necesita bundlear todo el proyecto para que funcione
import { useState } from 'react';
import { Button } from './components/Button';
\`\`\`

### El banco de trabajo inteligente: HMR

El **banco de trabajo** refleja cada cambio al instante. Cuando modificas un archivo, **HMR** inyecta solo ese módulo actualizado en el navegador — sin recargar la página ni perder el estado actual.

\`\`\`tsx
// Si cambias el texto del botón mientras count = 5,
// HMR actualiza el componente pero count sigue siendo 5
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Clicks: {count}</button>;
}
\`\`\`

Vite detecta qué módulo cambió, invalida solo ese módulo y sus dependientes directos, y pide al navegador que acepte la actualización. Si el módulo no puede actualizarse en caliente (por ejemplo, un cambio en la raíz), hace un full reload.

### El traductor: Babel y la transformación JSX

JSX no es JavaScript válido. El **traductor** (Babel o SWC) convierte esos "bocetos" en código que el navegador entiende:

\`\`\`tsx
// Lo que tú escribes (JSX)
const element = <h1 className="title">Hola</h1>;

// Lo que el traductor produce (JavaScript)
import { jsx as _jsx } from 'react/jsx-runtime';
const element = _jsx('h1', { className: 'title', children: 'Hola' });
\`\`\`

Con el **nuevo JSX Transform** (React 17+), ya no necesitas importar React en cada archivo. El compilador inyecta automáticamente las funciones \`jsx()\` del runtime.

En Vite, el plugin \`@vitejs/plugin-react\` configura esta transformación:

\`\`\`ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Configura Babel/SWC + Fast Refresh (HMR para React)
});
\`\`\`

### La lupa de inspección: React DevTools

React DevTools es la **lupa** que revela lo que el ojo no ve:

- **Components tab**: inspecciona el árbol de componentes, props, state y hooks de cada uno.
- **Profiler tab**: graba una sesión de interacción y muestra qué componentes se re-renderizaron, cuánto tardaron y por qué.

Tips clave:
- Usa "Highlight updates" para ver qué componentes se re-renderizan en tiempo real.
- Filtra componentes por nombre para encontrar rápidamente el que buscas.
- El Profiler muestra flame charts donde el ancho indica duración del render.
`,
  codeExamples: [
    {
      title: 'Configuración básica de Vite con React',
      code: `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true, // Abre el navegador automáticamente
  },
  build: {
    sourcemap: true, // Útil para debugging en producción
  },
});`,
      language: 'ts',
      description: 'Archivo de configuración mínimo de Vite para un proyecto React con TypeScript.',
    },
    {
      title: 'JSX Transform: antes vs después',
      code: `// ANTES (Classic JSX Transform — React 16)
import React from 'react'; // Obligatorio
const App = () => <div>Hola</div>;
// Se compila a: React.createElement('div', null, 'Hola')

// DESPUÉS (New JSX Transform — React 17+)
// No necesitas importar React
const App = () => <div>Hola</div>;
// Se compila a: _jsx('div', { children: 'Hola' })`,
      language: 'tsx',
      description: 'El nuevo JSX Transform elimina la necesidad de importar React explícitamente.',
    },
    {
      title: 'Vite environment variables',
      code: `// Solo variables con prefijo VITE_ están expuestas al cliente
// .env
// VITE_API_URL=https://api.example.com
// SECRET_KEY=no-expuesta (NO tiene prefijo VITE_)

// Uso en código
const apiUrl = import.meta.env.VITE_API_URL;

// TypeScript: tipar las variables de entorno
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}`,
      language: 'ts',
      description: 'Vite expone solo variables con prefijo VITE_ al bundle del cliente por seguridad.',
    },
    {
      title: 'Estructura de proyecto Vite + React',
      code: `// Estructura generada por create vite
// mi-app/
// ├── index.html          ← Punto de entrada (NO en public/)
// ├── vite.config.ts      ← Configuración
// ├── src/
// │   ├── main.tsx        ← Entry point de React
// │   ├── App.tsx         ← Componente raíz
// │   └── vite-env.d.ts   ← Tipos de Vite
// ├── public/             ← Archivos estáticos (no procesados)
// └── package.json

// index.html usa ESM directamente:
// <script type="module" src="/src/main.tsx"></script>`,
      language: 'ts',
      description: 'En Vite, index.html es el punto de entrada real y usa ESM nativo.',
    },
  ],
  pitfalls: [
    'Olvidar el prefijo VITE_ en variables de entorno y asumir que están disponibles en el cliente.',
    'Confundir HMR con live reload: HMR preserva el estado, live reload recarga toda la página y lo pierde.',
    'Pensar que Vite no bundlea nada: en producción SÍ genera un bundle optimizado con Rollup.',
    'No instalar la extensión React DevTools y buscar los tabs Components/Profiler sin ella.',
    'Seguir importando React en cada archivo cuando se usa el nuevo JSX Transform (innecesario desde React 17).',
    'Asumir que el rendimiento en modo desarrollo (Vite dev) refleja el rendimiento en producción — el build de producción es significativamente más rápido.',
  ],
  cheatSheet: [
    'Vite usa ESM nativo en dev → arranque instantáneo sin bundling.',
    'En producción, Vite usa Rollup para generar bundles optimizados.',
    'HMR = actualización en caliente sin perder estado. Fast Refresh = HMR específico para React.',
    'JSX Transform nuevo (React 17+): no necesitas `import React` — el compilador inyecta jsx().',
    '@vitejs/plugin-react: configura Babel + Fast Refresh en un solo plugin.',
    'Variables de entorno: solo VITE_* se exponen al cliente (seguridad).',
    'import.meta.env.MODE → "development" o "production".',
    'React DevTools Components: inspecciona props, state, hooks en tiempo real.',
    'React DevTools Profiler: flame chart muestra duración y causa de re-renders.',
    'index.html en Vite es el entry point real (no un template generado).',
  ],
  flashcards: [
    {
      id: 'tooling-fc-1',
      front: '¿Por qué Vite es más rápido que Webpack en desarrollo?',
      back: 'Vite sirve módulos como ES Modules nativos sin bundlear. El navegador pide cada módulo por separado, así Vite solo procesa el archivo solicitado en lugar de reconstruir todo el bundle.',
    },
    {
      id: 'tooling-fc-2',
      front: '¿Qué es HMR y qué ventaja tiene sobre un simple live reload?',
      back: 'HMR (Hot Module Replacement) inyecta solo el módulo modificado en el navegador sin recargar la página. A diferencia del live reload, preserva el estado actual de la aplicación (ej: formularios, contadores).',
    },
    {
      id: 'tooling-fc-3',
      front: '¿Qué hace el nuevo JSX Transform de React 17+?',
      back: 'Convierte JSX a llamadas jsx() del react/jsx-runtime automáticamente, sin necesidad de importar React en cada archivo. El compilador inyecta el import necesario.',
    },
    {
      id: 'tooling-fc-4',
      front: 'En el taller del artesano, ¿qué herramienta representa React DevTools y por qué?',
      back: 'La lupa de inspección. Así como la lupa revela defectos internos invisibles a simple vista, React DevTools muestra la estructura interna de componentes, su estado y problemas de rendimiento que no se ven en la UI.',
      usesAnalogy: true,
    },
    {
      id: 'tooling-fc-5',
      front: '¿Qué prefijo deben tener las variables de entorno en Vite para ser accesibles en el cliente?',
      back: 'Deben tener el prefijo VITE_ (ej: VITE_API_URL). Variables sin este prefijo NO se exponen al bundle del cliente por seguridad.',
    },
    {
      id: 'tooling-fc-6',
      front: '¿Qué diferencia hay entre el modo desarrollo y producción de Vite?',
      back: 'En desarrollo, Vite sirve ESM nativos sin bundlear (arranque instantáneo). En producción, usa Rollup para generar bundles optimizados, con tree-shaking, minificación y code-splitting.',
    },
    {
      id: 'tooling-fc-7',
      front: 'En la analogía del taller, ¿qué representa el horno rápido que calienta solo la pieza que necesitas?',
      back: 'Representa a Vite: en lugar de "calentar" (bundlear) todo el proyecto como los hornos antiguos (Webpack), Vite sirve solo el módulo solicitado al instante gracias a ESM nativo.',
      usesAnalogy: true,
    },
    {
      id: 'tooling-fc-8',
      front: '¿Qué dos tabs principales tiene React DevTools y para qué sirve cada uno?',
      back: 'Components: inspecciona el árbol de componentes con sus props, state y hooks. Profiler: graba sesiones y muestra qué componentes se re-renderizaron, cuánto tardaron y por qué.',
    },
  ],
  quiz: [
    {
      id: 'tooling-q-1',
      question: 'En la analogía del taller del artesano, el horno rápido que calienta solo la pieza necesaria representa a:',
      options: [
        { id: 'tooling-q-1-a', text: 'React DevTools' },
        { id: 'tooling-q-1-b', text: 'Vite en modo desarrollo' },
        { id: 'tooling-q-1-c', text: 'Babel' },
        { id: 'tooling-q-1-d', text: 'El Profiler' },
      ],
      correctOptionId: 'tooling-q-1-b',
      explanation: 'Vite sirve módulos individuales bajo demanda (como calentar solo la pieza necesaria), en lugar de bundlear todo el proyecto como hacían las herramientas anteriores.',
      whyOthersAreWrong: {
        'tooling-q-1-a': 'React DevTools es la lupa de inspección en la analogía, no el horno.',
        'tooling-q-1-c': 'Babel es el traductor de bocetos a instrucciones, no el horno.',
        'tooling-q-1-d': 'El Profiler es parte de la lupa (DevTools), mide tiempos de render.',
      },
      usesAnalogy: true,
    },
    {
      id: 'tooling-q-2',
      question: '¿Cuál es la principal ventaja de HMR (Hot Module Replacement) sobre un live reload completo?',
      options: [
        { id: 'tooling-q-2-a', text: 'HMR descarga menos archivos del servidor' },
        { id: 'tooling-q-2-b', text: 'HMR preserva el estado de la aplicación mientras actualiza el código modificado' },
        { id: 'tooling-q-2-c', text: 'HMR funciona sin conexión a internet' },
        { id: 'tooling-q-2-d', text: 'HMR no requiere un servidor de desarrollo' },
      ],
      correctOptionId: 'tooling-q-2-b',
      explanation: 'HMR inyecta solo el módulo cambiado sin recargar la página, preservando el estado (formularios, contadores, posición de scroll, etc.).',
      whyOthersAreWrong: {
        'tooling-q-2-a': 'Aunque HMR transfiere menos datos, su ventaja principal es preservar el estado, no reducir la carga de red.',
        'tooling-q-2-c': 'HMR requiere conexión WebSocket con el servidor de desarrollo.',
        'tooling-q-2-d': 'HMR funciona precisamente porque existe un servidor de desarrollo que detecta cambios y notifica al navegador.',
      },
    },
    {
      id: 'tooling-q-3',
      question: '¿Qué ocurre con el siguiente código en un proyecto que usa el nuevo JSX Transform (React 17+)?\n\n```tsx\nconst App = () => <h1>Hola</h1>;\nexport default App;\n```',
      options: [
        { id: 'tooling-q-3-a', text: 'Error: React must be in scope when using JSX' },
        { id: 'tooling-q-3-b', text: 'Funciona correctamente — el compilador inyecta el import de jsx() automáticamente' },
        { id: 'tooling-q-3-c', text: 'Funciona pero genera warnings en consola' },
        { id: 'tooling-q-3-d', text: 'Solo funciona si se usa Webpack, no con Vite' },
      ],
      correctOptionId: 'tooling-q-3-b',
      explanation: 'El nuevo JSX Transform de React 17+ permite que el compilador (Babel/SWC) inyecte automáticamente las funciones jsx() del react/jsx-runtime sin necesidad de importar React explícitamente.',
      whyOthersAreWrong: {
        'tooling-q-3-a': 'Ese error ocurría con el JSX Transform clásico (pre-React 17). El nuevo transform no requiere React en scope.',
        'tooling-q-3-c': 'No genera warnings; es el comportamiento esperado y recomendado.',
        'tooling-q-3-d': 'El nuevo JSX Transform funciona con cualquier bundler (Vite, Webpack, etc.) que use Babel o SWC correctamente configurado.',
      },
    },
    {
      id: 'tooling-q-4',
      question: '¿Cuál de estas variables de entorno estará disponible en el código del cliente en un proyecto Vite?',
      options: [
        { id: 'tooling-q-4-a', text: 'DATABASE_URL=postgres://...' },
        { id: 'tooling-q-4-b', text: 'REACT_APP_API=https://api.com' },
        { id: 'tooling-q-4-c', text: 'VITE_API_URL=https://api.com' },
        { id: 'tooling-q-4-d', text: 'SECRET_KEY=abc123' },
      ],
      correctOptionId: 'tooling-q-4-c',
      explanation: 'Vite solo expone al cliente las variables de entorno que comienzan con el prefijo VITE_. Esto previene la exposición accidental de secretos del servidor.',
      whyOthersAreWrong: {
        'tooling-q-4-a': 'Sin prefijo VITE_, esta variable no se incluye en el bundle del cliente.',
        'tooling-q-4-b': 'REACT_APP_ es el prefijo de Create React App, no de Vite.',
        'tooling-q-4-d': 'Sin prefijo VITE_, no se expone al cliente — exactamente el comportamiento deseado para secretos.',
      },
    },
    {
      id: 'tooling-q-5',
      question: '¿Qué herramienta de React DevTools usarías para identificar qué componentes se re-renderizan innecesariamente?',
      options: [
        { id: 'tooling-q-5-a', text: 'La pestaña Components con "Highlight updates"' },
        { id: 'tooling-q-5-b', text: 'La consola del navegador' },
        { id: 'tooling-q-5-c', text: 'El panel Network' },
        { id: 'tooling-q-5-d', text: 'El inspector de elementos (DOM)' },
      ],
      correctOptionId: 'tooling-q-5-a',
      explanation: 'React DevTools ofrece "Highlight updates when components render" en la pestaña Components, que muestra visualmente (con bordes de color) qué componentes se re-renderizan en tiempo real.',
      whyOthersAreWrong: {
        'tooling-q-5-b': 'La consola puede mostrar logs pero no identifica visualmente re-renders de componentes React.',
        'tooling-q-5-c': 'El panel Network muestra peticiones HTTP, no renders de componentes.',
        'tooling-q-5-d': 'El inspector DOM muestra la estructura HTML final, no la jerarquía de componentes React ni sus renders.',
      },
    },
    {
      id: 'tooling-q-6',
      question: '¿Por qué Vite puede arrancar el servidor de desarrollo casi instantáneamente sin importar el tamaño del proyecto?',
      options: [
        { id: 'tooling-q-6-a', text: 'Porque usa un lenguaje compilado (Go) internamente' },
        { id: 'tooling-q-6-b', text: 'Porque cachea todo el proyecto en memoria RAM' },
        { id: 'tooling-q-6-c', text: 'Porque no bundlea en desarrollo — sirve ES Modules nativos y solo transforma archivos bajo demanda' },
        { id: 'tooling-q-6-d', text: 'Porque comprime todos los archivos en un único chunk pequeño' },
      ],
      correctOptionId: 'tooling-q-6-c',
      explanation: 'Vite aprovecha los ES Modules nativos del navegador. En lugar de bundlear todo al arrancar, solo transforma archivos individuales cuando el navegador los solicita, haciendo el startup independiente del tamaño del proyecto.',
      whyOthersAreWrong: {
        'tooling-q-6-a': 'Vite está escrito en JavaScript/TypeScript (con esbuild en Go para pre-bundling de dependencias, pero esa no es la razón principal del arranque rápido).',
        'tooling-q-6-b': 'Vite no carga todo en RAM. Su velocidad viene de no procesar archivos hasta que se solicitan.',
        'tooling-q-6-d': 'Eso es lo opuesto: Vite NO genera un chunk en desarrollo. En producción sí usa Rollup para bundlear.',
      },
    },
    {
      id: 'tooling-q-7',
      question: '¿Cuál es el rol del plugin @vitejs/plugin-react en un proyecto Vite?',
      options: [
        { id: 'tooling-q-7-a', text: 'Instalar React como dependencia automáticamente' },
        { id: 'tooling-q-7-b', text: 'Configurar la transformación JSX (Babel/SWC) y Fast Refresh (HMR para React)' },
        { id: 'tooling-q-7-c', text: 'Generar el archivo index.html con el script de React' },
        { id: 'tooling-q-7-d', text: 'Compilar TypeScript a JavaScript' },
      ],
      correctOptionId: 'tooling-q-7-b',
      explanation: '@vitejs/plugin-react configura dos cosas esenciales: la transformación JSX (usando Babel o SWC) y React Fast Refresh, que es la implementación de HMR específica para componentes React.',
      whyOthersAreWrong: {
        'tooling-q-7-a': 'Las dependencias se instalan con npm/pnpm. El plugin no gestiona node_modules.',
        'tooling-q-7-c': 'En Vite, index.html es un archivo estático que tú creas. El plugin no lo genera.',
        'tooling-q-7-d': 'Vite usa esbuild para TypeScript, no el plugin de React. El plugin se enfoca en JSX y Fast Refresh.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 20,
  prerequisites: ['javascript-es6'],
  tags: ['vite', 'hmr', 'babel', 'jsx-transform', 'react-devtools', 'tooling', 'build-tools'],
};
