import type { Topic } from '../types';

export const nextjsMutationsTopic: Topic = {
  id: 'nextjs-mutations',
  courseId: 'nextjs-16',
  title: 'Mutations & Forms: Acciones desde el servidor',
  realWorldAnalogy: {
    title: 'La ventanilla del banco',
    scenario:
      'Vas al banco y llenas una solicitud en papel. La entregas en la ventanilla, el cajero la valida, ejecuta la operación en el sistema, y te devuelve el comprobante actualizado. Si hay error, te dice exactamente qué corregir sin perder lo que ya escribiste.',
    mapping: [
      { everyday: 'El formulario en papel', technical: '<form> con campos de entrada' },
      { everyday: 'La ventanilla del cajero', technical: 'Server Action ("use server")' },
      { everyday: 'El cajero valida tu solicitud', technical: 'Validation (Zod) en el servidor' },
      { everyday: 'El sistema interno del banco', technical: 'Base de datos / API backend' },
      { everyday: 'El comprobante actualizado', technical: 'Revalidation (revalidatePath/Tag)' },
      { everyday: 'El letrero "Procesando..." en la pantalla', technical: 'useFormStatus / pending state' },
    ],
    whereItBreaks:
      'En un banco real, si la conexión se cae no puedes seguir operando. En Next.js con Progressive Enhancement, el formulario funciona incluso sin JavaScript — se envía como HTML estándar.',
  },
  keyTerms: [
    {
      term: 'Server Action',
      definition: 'Función asíncrona que se ejecuta en el servidor, invocada directamente desde un formulario o evento del cliente.',
      analogyHint: 'El cajero que procesa tu solicitud detrás de la ventanilla.',
    },
    {
      term: '"use server"',
      definition: 'Directiva que marca una función o módulo entero como código que solo se ejecuta en el servidor.',
      analogyHint: 'El letrero "Solo personal autorizado" en la ventanilla.',
    },
    {
      term: 'Progressive Enhancement',
      definition: 'El formulario funciona con HTML puro y se mejora con JavaScript cuando está disponible.',
      analogyHint: 'El banco funciona con papel aunque se caiga el sistema digital.',
    },
    {
      term: 'revalidatePath',
      definition: 'Función que invalida la caché de una ruta específica tras una mutación exitosa.',
      analogyHint: 'El cajero actualiza la pantalla de saldos tras tu operación.',
    },
    {
      term: 'useFormStatus',
      definition: 'Hook que expone el estado pendiente del formulario padre más cercano.',
      analogyHint: 'El letrero "Procesando..." mientras el cajero trabaja.',
    },
    {
      term: 'useOptimistic',
      definition: 'Hook que muestra un valor temporal optimista antes de que el servidor confirme.',
      analogyHint: 'Tu app muestra el saldo nuevo antes de recibir el comprobante.',
    },
    {
      term: 'useActionState',
      definition: 'Hook que conecta una Server Action con estado de formulario, errores y estado pendiente.',
      analogyHint: 'El sistema que rastrea tu solicitud: resultado, errores y progreso.',
    },
  ],
  summary:
    'Las Server Actions permiten ejecutar código del servidor directamente desde formularios y eventos del cliente sin crear endpoints manuales. Usan la directiva "use server", funcionan con Progressive Enhancement (sin JavaScript), y se combinan con revalidación para mantener la UI sincronizada. Los hooks useFormStatus, useOptimistic y useActionState manejan estados pendientes y experiencia optimista.',
  explanation: `## ¿Qué son las mutaciones en Next.js?

Volvamos a la **ventanilla del banco**: cuando necesitas modificar datos (crear, actualizar, eliminar), no lo haces tú directo en el sistema — llenas un formulario y lo entregas al cajero. En Next.js, ese "cajero" es una **Server Action**.

## Server Actions y "use server"

Una Server Action es una función \`async\` marcada con \`"use server"\`. Puede definirse inline dentro de un Server Component o en un archivo separado:

\`\`\`ts
"use server";

export async function crearTarea(formData: FormData) {
  const titulo = formData.get("titulo");
  // ... guardar en DB
}
\`\`\`

Al igual que la ventanilla tiene un letrero de "Solo personal autorizado", \`"use server"\` garantiza que ese código **nunca** llega al navegador.

## Progressive Enhancement: el banco funciona sin sistema digital

Si pasas la action al atributo \`action\` de un \`<form>\`, Next.js envía los datos como un POST estándar cuando JavaScript no está disponible. Si JS está activo, intercepta el envío y lo hace sin recargar página.

## Revalidación: el comprobante actualizado

Después de que el cajero procesa tu solicitud, actualiza la pantalla de saldos. En Next.js, llamas \`revalidatePath("/tareas")\` o \`revalidateTag("tareas")\` para que la próxima visita muestre datos frescos.

## Estado pendiente: "Procesando..."

Mientras el cajero trabaja, ves un letrero de espera. Con \`useFormStatus()\` puedes deshabilitar el botón y mostrar un spinner. Con \`useOptimistic()\` puedes mostrar el resultado esperado antes de la confirmación — como ver tu saldo actualizado antes de recibir el papel.

## Validación y Autorización

El cajero revisa que tu solicitud esté completa antes de procesarla. En Server Actions, **siempre** debes validar los datos (con Zod u otro schema) y verificar que el usuario tiene permiso. Nunca confíes en la validación del cliente — es solo UX, no seguridad.`,
  codeExamples: [
    {
      title: 'Server Action en archivo separado',
      language: 'ts',
      code: `"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const TareaSchema = z.object({
  titulo: z.string().min(1).max(100),
});

export async function crearTarea(formData: FormData) {
  const parsed = TareaSchema.safeParse({
    titulo: formData.get("titulo"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db.tareas.create({ data: { titulo: parsed.data.titulo } });
  revalidatePath("/tareas");
}`,
      description: 'Action con validación Zod y revalidación tras mutación exitosa.',
    },
    {
      title: 'Formulario con Progressive Enhancement',
      language: 'tsx',
      code: `import { crearTarea } from "@/actions/tareas";

export default function NuevaTareaForm() {
  return (
    <form action={crearTarea}>
      <input name="titulo" required />
      <SubmitButton />
    </form>
  );
}`,
      description: 'El form funciona sin JS gracias al atributo action nativo.',
    },
    {
      title: 'Botón con useFormStatus',
      language: 'tsx',
      code: `"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Guardando..." : "Crear tarea"}
    </button>
  );
}`,
      description: 'useFormStatus debe usarse en un componente hijo del form.',
    },
    {
      title: 'UI Optimista con useOptimistic',
      language: 'tsx',
      code: `"use client";

import { useOptimistic } from "react";
import { crearTarea } from "@/actions/tareas";

export function ListaTareas({ tareas }: { tareas: Tarea[] }) {
  const [optimisticTareas, addOptimistic] = useOptimistic(
    tareas,
    (state, nueva: string) => [
      ...state,
      { id: crypto.randomUUID(), titulo: nueva, pendiente: true },
    ]
  );

  async function handleSubmit(formData: FormData) {
    const titulo = formData.get("titulo") as string;
    addOptimistic(titulo);
    await crearTarea(formData);
  }

  return (
    <form action={handleSubmit}>
      <input name="titulo" />
      <button type="submit">Agregar</button>
      <ul>
        {optimisticTareas.map((t) => (
          <li key={t.id} style={{ opacity: t.pendiente ? 0.5 : 1 }}>
            {t.titulo}
          </li>
        ))}
      </ul>
    </form>
  );
}`,
      description: 'La tarea aparece inmediatamente con opacidad reducida hasta confirmación.',
    },
    {
      title: 'useActionState para manejo de errores',
      language: 'tsx',
      code: `"use client";

import { useActionState } from "react";
import { crearTarea } from "@/actions/tareas";

export function FormConErrores() {
  const [state, formAction, pending] = useActionState(crearTarea, null);

  return (
    <form action={formAction}>
      <input name="titulo" />
      {state?.error?.titulo && (
        <p className="text-red-500">{state.error.titulo}</p>
      )}
      <button disabled={pending}>
        {pending ? "Guardando..." : "Crear"}
      </button>
    </form>
  );
}`,
      description: 'useActionState conecta la action con estado previo y errores.',
    },
  ],
  pitfalls: [
    'Olvidar "use server" — sin la directiva, el código se incluye en el bundle del cliente y expone lógica sensible.',
    'Usar useFormStatus en el mismo componente que renderiza el <form> — debe estar en un componente hijo para leer el estado del form padre.',
    'Confiar solo en validación del cliente — siempre revalidar en el servidor porque el cliente se puede manipular.',
    'No llamar revalidatePath/revalidateTag después de mutar — la UI se queda con datos obsoletos de la caché.',
    'Pasar datos sensibles (userId) como campos ocultos del form — un atacante puede modificarlos. Usa la sesión en el servidor.',
    'Usar useOptimistic sin manejar el caso de error — si la action falla, el estado optimista debe revertirse.',
    'Crear Server Actions que no retornan errores — el cliente no tiene forma de saber qué falló ni mostrar feedback.',
  ],
  cheatSheet: [
    '"use server" al inicio de la función o del archivo para declarar Server Actions.',
    'Server Actions reciben FormData como primer argumento cuando se usan con <form action={...}>.',
    'useFormStatus().pending → true mientras el form se está enviando. Solo funciona en hijos del form.',
    'useOptimistic(estadoReal, reducerOptimista) → muestra UI inmediata antes de confirmación.',
    'useActionState(action, initialState) → [state, formAction, pending] para formularios con feedback.',
    'revalidatePath("/ruta") o revalidateTag("tag") después de mutar para refrescar datos cacheados.',
    'Progressive Enhancement: <form action={serverAction}> funciona sin JavaScript habilitado.',
    'Siempre validar con Zod (o similar) dentro de la Server Action — la validación del cliente es solo UX.',
    'Verificar autorización en cada Server Action — no asumir que solo usuarios legítimos la invocan.',
  ],
  flashcards: [
    {
      id: 'next-mut-fc-1',
      front: '¿Qué directiva marca una función como Server Action?',
      back: '"use server" — se coloca al inicio de la función async o al inicio del archivo para marcar todas las exportaciones.',
    },
    {
      id: 'next-mut-fc-2',
      front: '¿Qué significa Progressive Enhancement en el contexto de formularios en Next.js?',
      back: 'El formulario funciona como un POST estándar de HTML sin JavaScript. Cuando JS está disponible, Next.js mejora la experiencia interceptando el envío sin recarga de página.',
      usesAnalogy: true,
    },
    {
      id: 'next-mut-fc-3',
      front: '¿Cómo se actualiza la UI después de una mutación exitosa?',
      back: 'Llamando revalidatePath("/ruta") o revalidateTag("tag") dentro de la Server Action. Es como cuando el cajero actualiza la pantalla de saldos tras procesar tu solicitud.',
      usesAnalogy: true,
    },
    {
      id: 'next-mut-fc-4',
      front: '¿Dónde debe usarse useFormStatus para que funcione correctamente?',
      back: 'En un componente hijo del <form>, no en el mismo componente que renderiza el form. El hook lee el estado del formulario padre más cercano.',
    },
    {
      id: 'next-mut-fc-5',
      front: '¿Qué diferencia hay entre useFormStatus y useActionState?',
      back: 'useFormStatus solo expone { pending, data, method, action } del form padre. useActionState conecta una action con su estado retornado (errores, resultado) y pending, permitiendo mostrar feedback detallado.',
    },
    {
      id: 'next-mut-fc-6',
      front: '¿Por qué la validación del servidor es obligatoria aunque valides en el cliente?',
      back: 'La validación del cliente es solo UX (se puede saltear). La del servidor es seguridad real: el cajero siempre revisa tu solicitud aunque tú digas que está bien.',
      usesAnalogy: true,
    },
    {
      id: 'next-mut-fc-7',
      front: '¿Qué hace useOptimistic y cuándo se usa?',
      back: 'Muestra un estado temporal "optimista" antes de que el servidor confirme. Se usa para que la UI se sienta instantánea — como ver tu saldo actualizado antes de recibir el comprobante del banco.',
      usesAnalogy: true,
    },
    {
      id: 'next-mut-fc-8',
      front: '¿Qué recibe como argumento una Server Action cuando se pasa a action={...} de un form?',
      back: 'Recibe un objeto FormData con todos los campos del formulario. Con useActionState, recibe primero el estado previo y luego el FormData.',
    },
  ],
  quiz: [
    {
      id: 'next-mut-q-1',
      question: 'En la analogía de la ventanilla del banco, ¿qué representa la Server Action?',
      options: [
        { id: 'a', text: 'El formulario en papel que llenas' },
        { id: 'b', text: 'El cajero que procesa tu solicitud' },
        { id: 'c', text: 'El comprobante que recibes' },
        { id: 'd', text: 'La fila de espera del banco' },
      ],
      correctOptionId: 'b',
      explanation: 'La Server Action es el "cajero" que recibe tu solicitud (FormData), la valida, ejecuta la operación en el sistema (DB/API), y te devuelve un resultado.',
      whyOthersAreWrong: {
        a: 'El formulario en papel representa el <form> HTML que el usuario llena.',
        c: 'El comprobante representa la revalidación — los datos frescos que ves después de la mutación.',
        d: 'No hay un concepto de "fila de espera" directamente mapeado; lo más cercano sería el pending state.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-mut-q-2',
      question: '¿Qué sucede si una Server Action no tiene la directiva "use server"?',
      options: [
        { id: 'a', text: 'Se ejecuta solo en el cliente como función normal' },
        { id: 'b', text: 'Next.js la detecta automáticamente y la ejecuta en el servidor' },
        { id: 'c', text: 'El código se incluye en el bundle del cliente, exponiendo lógica sensible' },
        { id: 'd', text: 'Lanza un error de compilación inmediato' },
      ],
      correctOptionId: 'c',
      explanation: 'Sin "use server", el bundler no sabe que la función debe quedarse en el servidor y la incluye en el JavaScript del cliente, potencialmente exponiendo secretos y lógica de negocio.',
      whyOthersAreWrong: {
        a: 'No se "ejecuta en el cliente" como action del form — simplemente se incluye en el bundle sin la serialización correcta.',
        b: 'Next.js no hace detección automática; la directiva es explícita y obligatoria.',
        d: 'No siempre lanza error de compilación — puede compilar pero con el código expuesto al cliente.',
      },
    },
    {
      id: 'next-mut-q-3',
      question: '¿Por qué useFormStatus debe usarse en un componente hijo del <form> y no en el mismo componente?',
      options: [
        { id: 'a', text: 'Es una limitación temporal de React que se corregirá en futuras versiones' },
        { id: 'b', text: 'El hook lee el estado del formulario padre más cercano en el árbol de componentes' },
        { id: 'c', text: 'Para evitar re-renders innecesarios del formulario completo' },
        { id: 'd', text: 'Porque useFormStatus solo funciona en Server Components' },
      ],
      correctOptionId: 'b',
      explanation: 'useFormStatus busca el <form> ancestro más cercano y suscribe al componente hijo a su estado. Si se usa en el mismo nivel que el form, no hay form padre que leer.',
      whyOthersAreWrong: {
        a: 'No es una limitación temporal sino un diseño intencional de la API basado en cómo React asocia contextos.',
        c: 'Aunque reduce re-renders, la razón principal es técnica: el hook necesita un form ancestro.',
        d: 'useFormStatus es un hook de cliente ("use client"), no funciona en Server Components.',
      },
    },
    {
      id: 'next-mut-q-4',
      question: '¿Qué significa Progressive Enhancement en formularios de Next.js?',
      options: [
        { id: 'a', text: 'El formulario se renderiza progresivamente campo por campo' },
        { id: 'b', text: 'El formulario funciona sin JavaScript y se mejora cuando JS está disponible' },
        { id: 'c', text: 'El formulario agrega campos dinámicamente según el input del usuario' },
        { id: 'd', text: 'El formulario carga estilos CSS progresivamente para mejor rendimiento' },
      ],
      correctOptionId: 'b',
      explanation: 'Con <form action={serverAction}>, el form se envía como POST HTML estándar sin JS. Cuando JavaScript carga, Next.js intercepta el envío para hacerlo sin recarga, mejorando la experiencia.',
      whyOthersAreWrong: {
        a: 'No tiene nada que ver con renderizado progresivo de campos.',
        c: 'Campos dinámicos son una feature de UI, no Progressive Enhancement.',
        d: 'Progressive Enhancement se refiere a funcionalidad, no a carga de estilos.',
      },
    },
    {
      id: 'next-mut-q-5',
      question: '¿Cuál es la forma correcta de invalidar datos cacheados después de una mutación?',
      options: [
        { id: 'a', text: 'Llamar router.refresh() en el cliente' },
        { id: 'b', text: 'Usar revalidatePath() o revalidateTag() dentro de la Server Action' },
        { id: 'c', text: 'Configurar cache: "no-store" en todas las peticiones fetch' },
        { id: 'd', text: 'Esperar a que expire el tiempo de caché automático' },
      ],
      correctOptionId: 'b',
      explanation: 'revalidatePath("/ruta") invalida la caché de esa ruta y revalidateTag("tag") invalida todas las entradas con ese tag. Se llaman en la Server Action después de la mutación exitosa.',
      whyOthersAreWrong: {
        a: 'router.refresh() recarga datos del servidor pero no invalida la caché — la próxima navegación podría seguir mostrando datos obsoletos.',
        c: 'Deshabilitar caché globalmente elimina los beneficios de rendimiento de ISR/SSG.',
        d: 'Esperar expiración natural puede mostrar datos obsoletos por tiempo indefinido.',
      },
    },
    {
      id: 'next-mut-q-6',
      question: '¿Qué retorna useActionState(action, initialState)?',
      options: [
        { id: 'a', text: 'Un booleano indicando si la action está en progreso' },
        { id: 'b', text: 'Una tupla [state, formAction, pending] con el estado retornado por la action' },
        { id: 'c', text: 'El FormData del último envío del formulario' },
        { id: 'd', text: 'Una función dispatch similar a useReducer' },
      ],
      correctOptionId: 'b',
      explanation: 'useActionState devuelve [state, formAction, pending]: state es lo que retornó la última ejecución de la action (o initialState), formAction es la función para pasar al form, y pending indica si está procesando.',
      whyOthersAreWrong: {
        a: 'Solo un booleano sería useFormStatus().pending — useActionState da mucho más contexto.',
        c: 'No retorna FormData sino el estado que la action decidió retornar (errores, resultados, etc.).',
        d: 'No es un dispatch — es específico para Server Actions con formularios.',
      },
    },
    {
      id: 'next-mut-q-7',
      question: '¿Por qué no debes pasar el userId como campo oculto en un formulario para autorización?',
      options: [
        { id: 'a', text: 'Los campos ocultos no se envían en el FormData' },
        { id: 'b', text: 'Un atacante puede modificar campos del formulario antes de enviarlos' },
        { id: 'c', text: 'Los campos ocultos no funcionan con Server Actions' },
        { id: 'd', text: 'Next.js ignora automáticamente los campos type="hidden"' },
      ],
      correctOptionId: 'b',
      explanation: 'Cualquier dato en el HTML del cliente puede ser manipulado. La autorización debe obtenerse de la sesión del servidor (cookies, tokens) dentro de la Server Action, nunca de datos que el cliente envía.',
      whyOthersAreWrong: {
        a: 'Los campos ocultos sí se incluyen en FormData — ese no es el problema.',
        c: 'Los campos ocultos funcionan perfectamente con Server Actions.',
        d: 'Next.js no ignora campos hidden — los incluye normalmente en el FormData.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 25,
  tags: [
    'server-actions',
    'use-server',
    'forms',
    'progressive-enhancement',
    'revalidation',
    'optimistic-ui',
    'useFormStatus',
    'useOptimistic',
    'useActionState',
    'validation',
    'authorization',
    'mutations',
  ],
};
