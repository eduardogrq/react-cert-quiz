import type { Topic } from '../types';

export const eventHandlingTopic: Topic = {
  id: 'event-handling',
  title: 'Event Handling: El timbre del edificio',
  realWorldAnalogy: {
    title: 'El timbre del edificio',
    scenario:
      'En tu edificio, cada departamento tiene un timbre en la puerta de abajo. Alguien lo presiona, suena en tu departamento, y tú decides qué hacer: abrir la puerta, preguntar quién es por el intercomunicador, o simplemente ignorarlo. Tú no controlas quién toca, pero sí qué haces cuando suena.',
    mapping: [
      { everyday: 'El timbre (botón físico)', technical: 'El elemento con evento (button, input, form)' },
      { everyday: 'Alguien lo presiona', technical: 'El usuario dispara el evento (click, submit, change)' },
      { everyday: 'Suena en tu departamento', technical: 'React llama a tu handler function' },
      { everyday: 'Tú decides: abrir, ignorar, preguntar', technical: 'La lógica dentro del handler' },
      { everyday: '"No abrir la puerta del edificio automáticamente"', technical: 'preventDefault() — evitar comportamiento por defecto' },
    ],
    whereItBreaks:
      'Un timbre real suena sin importar si estás en casa. En React, si el componente se desmonta, el handler desaparece con él — no hay timbres fantasma.',
  },
  keyTerms: [
    {
      term: 'event handler',
      definition: 'Función que se ejecuta cuando ocurre un evento (click, submit, change, etc.).',
      analogyHint: 'Lo que haces cuando suena el timbre: tu reacción programada.',
    },
    {
      term: 'synthetic event',
      definition: 'Wrapper de React sobre eventos nativos del navegador. Misma API cross-browser.',
      analogyHint: 'El intercomunicador estandarizado que funciona igual en todos los edificios.',
    },
    {
      term: 'preventDefault',
      definition: 'Cancela el comportamiento por defecto del navegador (ej: submit recarga la página).',
      analogyHint: '"No abrir la puerta automáticamente" — yo decido si abro o no.',
    },
    {
      term: 'controlled component',
      definition: 'Input cuyo valor está controlado por React state. State es la fuente de verdad.',
      analogyHint: 'Portero que anota cada visita en su libreta — nada pasa sin registro.',
    },
    {
      term: 'uncontrolled component',
      definition: 'Input que maneja su propio valor internamente. Se lee con ref cuando se necesita.',
      analogyHint: 'Buzón de correo: las cartas llegan solas y las lees cuando quieres.',
    },
    {
      term: 'FormData',
      definition: 'API del navegador para leer todos los valores de un formulario de golpe.',
      analogyHint: 'Vaciar todo el buzón de una vez en la mesa y ver qué llegó.',
    },
  ],
  summary:
    'Los event handlers son funciones que React ejecuta al ocurrir un evento del usuario. Se pasan como props (`onClick`, `onChange`, `onSubmit`). Usar `e.preventDefault()` para cancelar defaults del navegador. Inputs pueden ser controlled (valor = state) o uncontrolled (valor interno, leer con ref/FormData).',
  explanation: `## El timbre del edificio

Los eventos siguen la lógica del **timbre**: algo pasa (click, tecleo, envío), React te avisa (llama tu función), y tú decides qué hacer.

\`\`\`tsx
// El "timbre" es onClick, tu "reacción" es handleClick
function Boton() {
  function handleClick() {
    alert('¡Tocaron el timbre!');
  }

  return <button onClick={handleClick}>Presionar</button>;
}
\`\`\`

## Regla fundamental: pasar la función, no llamarla

\`\`\`tsx
// ✅ Pasar referencia — React la llama cuando ocurra el evento
<button onClick={handleClick}>

// ❌ LLAMAR la función — se ejecuta durante el render, no al click
<button onClick={handleClick()}>
\`\`\`

## El evento sintético

React wrappea los eventos nativos para que funcionen igual en todos los navegadores:

\`\`\`tsx
function handleClick(e: React.MouseEvent) {
  e.preventDefault();  // "no abrir la puerta automáticamente"
  e.stopPropagation(); // "que no suene en otros departamentos"
}
\`\`\`

## Controlled vs Uncontrolled

**Controlled** (portero con libreta — state controla todo):

\`\`\`tsx
function LoginForm() {
  const [email, setEmail] = useState('');

  return (
    <input
      value={email}                    // state = fuente de verdad
      onChange={(e) => setEmail(e.target.value)} // cada tecla actualiza state
    />
  );
}
\`\`\`

**Uncontrolled** (buzón — el input se maneja solo):

\`\`\`tsx
function SearchForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query'); // leer al enviar
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" defaultValue="" />
      <button type="submit">Buscar</button>
    </form>
  );
}
\`\`\`

## ¿Cuándo usar cada uno?

- **Controlled**: cuando necesitas validar en tiempo real, deshabilitar un botón según el input, o mantener sincronizados varios campos.
- **Uncontrolled** (+ FormData): formularios simples donde solo importa el valor al enviar.`,
  codeExamples: [
    {
      title: 'Formulario controlled completo',
      language: 'tsx',
      code: `function ContactForm() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // no recargar la página
    // Aquí enviarías los datos
    console.log({ nombre, mensaje });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre"
      />
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <button type="submit" disabled={!nombre || !mensaje}>
        Enviar
      </button>
    </form>
  );
}`,
      description: 'Controlled: state es fuente de verdad. El botón se deshabilita dinámicamente.',
    },
  ],
  pitfalls: [
    '`onClick={handleClick()}` LLAMA la función en render. Correcto: `onClick={handleClick}` (sin paréntesis).',
    'Olvidar preventDefault en onSubmit — el form recarga la página por defecto.',
    'Controlled input sin onChange: el input se "congela" (no puedes escribir).',
    'Mezclar controlled y uncontrolled: poner value sin defaultValue o viceversa genera warnings.',
    'En un <select>, el value controlado va en el <select>, no en <option selected>.',
    'e.target.value siempre es string — si esperas número, parsearlo: `Number(e.target.value)`.',
  ],
  cheatSheet: [
    '`onClick={fn}` — pasar referencia, NO llamar (sin paréntesis)',
    '`e.preventDefault()` — cancelar default del navegador',
    '`e.stopPropagation()` — evitar que el evento burbujee al padre',
    'Controlled: `value={state}` + `onChange={e => setState(e.target.value)}`',
    'Uncontrolled: `defaultValue` + leer con `ref.current.value` o FormData',
    '`new FormData(e.currentTarget)` — leer todos los campos del form',
    '`e.target.value` es siempre string — parsear si necesitas número',
    'En React: `onChange` se dispara en cada tecla (no solo al perder foco como HTML nativo)',
  ],
  flashcards: [
    {
      id: 'ev-fc-1',
      front: '¿Cuál es la diferencia entre onClick={fn} y onClick={fn()}?',
      back: 'onClick={fn} pasa la referencia (React la llama al click). onClick={fn()} EJECUTA fn inmediatamente durante el render — bug clásico. Regla: sin paréntesis = "instalar el timbre", con paréntesis = "tocar el timbre tú mismo".',
      usesAnalogy: true,
    },
    {
      id: 'ev-fc-2',
      front: '¿Qué hace e.preventDefault() y cuándo lo necesitas?',
      back: 'Cancela el comportamiento default del navegador. Lo necesitas en: onSubmit (evita recargar página), onClick en <a> (evita navegación), onDrag (evita el drag nativo).',
    },
    {
      id: 'ev-fc-3',
      front: '¿Qué es un controlled component?',
      back: 'Un input cuyo valor está atado a state de React. value={state} + onChange actualiza state. React es la "fuente de verdad" — como un portero que registra todo.',
      usesAnalogy: true,
    },
    {
      id: 'ev-fc-4',
      front: '¿Cuándo usarías FormData en vez de controlled inputs?',
      back: 'En formularios simples donde solo importa el valor al enviar (no en tiempo real). FormData lee todos los campos de golpe sin necesitar state individual para cada uno.',
    },
    {
      id: 'ev-fc-5',
      front: '¿Qué pasa si pones value={state} en un input pero no pones onChange?',
      back: 'El input se "congela": muestra el valor de state pero no puedes escribir porque React fuerza el valor de state en cada render y sin onChange no hay forma de actualizarlo.',
    },
    {
      id: 'ev-fc-6',
      front: '¿Qué es un synthetic event en React?',
      back: 'Un wrapper de React sobre el evento nativo del navegador. Tiene la misma API (target, preventDefault, etc.) pero funciona consistentemente cross-browser.',
    },
  ],
  quiz: [
    {
      id: 'ev-q-1',
      question: 'Siguiendo la analogía del timbre: si onClick={handleClick} es "instalar el timbre", ¿qué representa onClick={handleClick()}?',
      options: [
        { id: 'a', text: 'Instalar un timbre que suena más fuerte' },
        { id: 'b', text: 'Tocar el timbre inmediatamente (ejecutar la función durante el render, no al click)' },
        { id: 'c', text: 'Instalar un timbre que solo funciona una vez' },
        { id: 'd', text: 'Pasar argumentos al handler correctamente' },
      ],
      correctOptionId: 'b',
      explanation: 'Con paréntesis, la función se ejecuta AHORA (durante el render). No espera a que el usuario haga click.',
      whyOthersAreWrong: {
        a: 'No es un handler "más fuerte" — es un error que ejecuta la función inmediatamente.',
        c: 'No es cuestión de cuántas veces funciona — es que se dispara en el momento equivocado.',
        d: 'Para pasar argumentos usa arrow function: onClick={() => fn(arg)}.',
      },
      usesAnalogy: true,
    },
    {
      id: 'ev-q-2',
      question: '¿Qué falta en este formulario para que funcione correctamente?\n\n```jsx\nfunction Form() {\n  function handleSubmit(e) {\n    const data = new FormData(e.currentTarget);\n    sendData(data);\n  }\n  return <form onSubmit={handleSubmit}><input name="email" /><button>Enviar</button></form>;\n}\n```',
      options: [
        { id: 'a', text: 'Falta e.preventDefault() — la página se recargará al enviar' },
        { id: 'b', text: 'Falta value y onChange en el input' },
        { id: 'c', text: 'Falta type="submit" en el button' },
        { id: 'd', text: 'No falta nada, funciona bien' },
      ],
      correctOptionId: 'a',
      explanation: 'Sin preventDefault, el navegador recarga la página al enviar el form (comportamiento por defecto). sendData nunca completaría.',
      whyOthersAreWrong: {
        b: 'Es un uncontrolled form (usa FormData). No necesita value/onChange — es válido así.',
        c: 'Un button dentro de form es type="submit" por defecto. No necesita especificarse.',
        d: 'Sin preventDefault el form recarga la página — bug funcional.',
      },
    },
    {
      id: 'ev-q-3',
      question: '¿Cuál es la diferencia principal entre un controlled y un uncontrolled input?',
      options: [
        { id: 'a', text: 'Controlled es más rápido que uncontrolled' },
        { id: 'b', text: 'Controlled tiene su valor en React state; uncontrolled lo maneja el DOM internamente' },
        { id: 'c', text: 'Controlled funciona solo con text inputs; uncontrolled con cualquier tipo' },
        { id: 'd', text: 'Uncontrolled no dispara onChange' },
      ],
      correctOptionId: 'b',
      explanation: 'Controlled: React state es fuente de verdad (value + onChange). Uncontrolled: el DOM maneja el valor y lo lees cuando necesitas (ref o FormData).',
      whyOthersAreWrong: {
        a: 'Controlled puede ser marginalmente más lento (re-render por tecla) pero no es la diferencia conceptual.',
        c: 'Ambos funcionan con cualquier tipo de input.',
        d: 'Uncontrolled SÍ dispara onChange si lo escuchas. La diferencia es quién controla el value.',
      },
    },
    {
      id: 'ev-q-4',
      question: '¿Cómo pasas un argumento a un event handler?',
      options: [
        { id: 'a', text: '`onClick={handleDelete(id)}`' },
        { id: 'b', text: '`onClick={() => handleDelete(id)}`' },
        { id: 'c', text: '`onClick={handleDelete, id}`' },
        { id: 'd', text: '`onClick={handleDelete} args={id}`' },
      ],
      correctOptionId: 'b',
      explanation: 'Arrow function wrapper: se pasa una función que, al ser llamada por React (click), ejecuta handleDelete con el argumento.',
      whyOthersAreWrong: {
        a: 'Esto LLAMA handleDelete inmediatamente durante el render (bug).',
        c: 'Sintaxis inválida — el operador coma evalúa ambos pero solo pasa el último.',
        d: 'No existe una prop "args" para event handlers.',
      },
    },
    {
      id: 'ev-q-5',
      question: '¿Qué valor tiene `e.target.value` al escribir "42" en un `<input type="number">`?',
      options: [
        { id: 'a', text: '42 (número)' },
        { id: 'b', text: '"42" (string)' },
        { id: 'c', text: 'NaN' },
        { id: 'd', text: 'undefined' },
      ],
      correctOptionId: 'b',
      explanation: 'e.target.value SIEMPRE es un string, sin importar type="number". Si necesitas número: Number(e.target.value) o parseInt.',
      whyOthersAreWrong: {
        a: 'El DOM trabaja con strings. type="number" limita la UI pero .value sigue siendo string.',
        c: 'NaN solo si intentas Number("") — con "42" obtienes el string "42" directamente.',
        d: 'Un input siempre tiene .value definido (al menos string vacío).',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 20,
  prerequisites: ['components', 'state'],
  tags: ['events', 'forms', 'controlled', 'uncontrolled', 'preventDefault', 'FormData'],
};
