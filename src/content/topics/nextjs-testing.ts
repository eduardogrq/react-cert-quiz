import type { Topic } from '../types';

export const nextjsTestingTopic: Topic = {
  id: 'nextjs-testing',
  courseId: 'nextjs-16',
  title: 'Testing & Observability en Next.js',
  realWorldAnalogy: {
    title: 'El hospital y su sistema de monitoreo',
    scenario:
      'Un hospital tiene múltiples niveles de revisión para garantizar la salud de sus pacientes. Primero, cada médico revisa signos vitales individuales (presión, temperatura). Luego, un equipo coordina pruebas combinadas (análisis de sangre completo). Finalmente, se hacen simulaciones completas donde un paciente ficticio recorre todo el proceso desde admisión hasta alta. Además, los monitores en cada cama muestran alertas en tiempo real y un registro centralizado permite rastrear cualquier incidente pasado.',
    mapping: [
      { everyday: 'Revisión de signos vitales individuales por cada médico', technical: 'Unit Testing — pruebas de funciones o componentes aislados' },
      { everyday: 'Pruebas combinadas coordinadas por un equipo', technical: 'Integration Testing — verificar que varias piezas funcionan juntas' },
      { everyday: 'Simulación completa de admisión a alta con paciente ficticio', technical: 'E2E Testing — recorrer el flujo completo como un usuario real' },
      { everyday: 'Monitores de cama que muestran alertas en tiempo real', technical: 'Instrumentation y OpenTelemetry — observabilidad en producción' },
      { everyday: 'Registro centralizado de incidentes para rastreo', technical: 'Source Maps — mapear errores minificados al código fuente original' },
      { everyday: 'Protocolo de emergencia que aísla al paciente sin cerrar el hospital', technical: 'Error Boundary — capturar errores sin tumbar toda la app' },
    ],
    whereItBreaks:
      'En un hospital, los niveles de revisión son simultáneos e independientes. En testing, los niveles se ejecutan en orden de velocidad: primero unit (milisegundos), luego integration (segundos), finalmente E2E (minutos). Además, la observabilidad en producción no "cura" los errores, solo los detecta.',
  },
  keyTerms: [
    {
      term: 'Unit Testing',
      definition: 'Pruebas que verifican funciones o componentes aislados en milisegundos, sin dependencias externas.',
      analogyHint: 'Revisar la presión arterial de un solo paciente.',
    },
    {
      term: 'Integration Testing',
      definition: 'Pruebas que verifican la interacción entre múltiples módulos o componentes trabajando juntos.',
      analogyHint: 'Análisis combinado donde varios especialistas coordinan resultados.',
    },
    {
      term: 'End-to-End Testing',
      definition: 'Pruebas que simulan el flujo completo del usuario en un navegador real o headless.',
      analogyHint: 'Simulación completa de admisión a alta con paciente ficticio.',
    },
    {
      term: 'Instrumentation',
      definition: 'Archivo instrumentation.ts que Next.js ejecuta al iniciar el servidor para configurar monitoreo y observabilidad.',
      analogyHint: 'Encender todos los monitores del hospital antes de abrir.',
    },
    {
      term: 'OpenTelemetry',
      definition: 'Estándar abierto para recolectar trazas, métricas y logs de aplicaciones distribuidas.',
      analogyHint: 'El sistema centralizado que registra cada paso del paciente.',
    },
    {
      term: 'Source Maps',
      definition: 'Archivos que mapean código minificado/compilado de vuelta al código fuente original para facilitar debugging.',
      analogyHint: 'El registro que traduce códigos de error a historiales legibles.',
    },
    {
      term: 'Error Boundary',
      definition: 'Componente React que captura errores en su árbol hijo y muestra un fallback en lugar de tumbar toda la UI.',
      analogyHint: 'Protocolo que aísla un paciente crítico sin cerrar el hospital.',
    },
    {
      term: 'Expected Errors',
      definition: 'Errores anticipados que se manejan intencionalmente con try/catch o useActionState sin activar Error Boundary.',
      analogyHint: 'Síntomas conocidos que el médico ya sabe cómo tratar.',
    },
    {
      term: 'Uncaught Exceptions',
      definition: 'Errores inesperados no manejados que activan el Error Boundary más cercano o el global-error.',
      analogyHint: 'Emergencia imprevista que activa la alarma general del piso.',
    },
  ],
  summary:
    'Next.js 16 ofrece un sistema completo de testing y observabilidad. Las pruebas unitarias (Vitest) verifican funciones aisladas, las de integración comprueban que componentes interactúen correctamente, y las E2E (Playwright/Cypress) simulan usuarios reales. Para producción, instrumentation.ts configura OpenTelemetry para trazas distribuidas y Source Maps permiten depurar errores minificados. El manejo de errores se divide en Expected Errors (manejados con try/catch) y Uncaught Exceptions (capturados por Error Boundaries o global-error.tsx).',
  explanation: `## El hospital y su sistema de monitoreo

Imagina un hospital moderno. No basta con que cada médico revise signos vitales individualmente — se necesita un sistema completo que coordine pruebas combinadas, simulaciones y monitoreo continuo. Testing y observabilidad en Next.js funcionan exactamente así.

### Unit Testing: Revisión de signos vitales

Al igual que un médico revisa la presión arterial de forma rápida y aislada, los **unit tests** verifican funciones y componentes individuales sin levantar un servidor ni un navegador.

Next.js recomienda **Vitest** por su velocidad y compatibilidad con el ecosistema. Configuras \`next/jest\` o \`vitest.config.ts\` y puedes probar utilidades puras, hooks con \`renderHook\`, y componentes con \`@testing-library/react\`.

### Integration Testing: Pruebas coordinadas

Cuando varios especialistas combinan resultados (análisis de sangre + rayos X + historial), obtienen una imagen más completa. Las **pruebas de integración** verifican que Server Components, Client Components y Server Actions funcionen juntos correctamente.

Se usa \`render\` de Testing Library para montar componentes que internamente llaman a otros componentes o hooks compartidos.

### E2E Testing: Simulación completa

La simulación de admisión a alta con un paciente ficticio es el equivalente a **Playwright o Cypress** recorriendo tu app completa en un navegador real. Next.js se integra nativamente con ambos.

### Instrumentation: Encender los monitores

Antes de abrir el hospital, se encienden todos los monitores. En Next.js, el archivo \`instrumentation.ts\` en la raíz del proyecto se ejecuta una sola vez al iniciar el servidor. Ahí registras proveedores de OpenTelemetry, SDK de errores o cualquier setup de observabilidad.

### OpenTelemetry: Registro centralizado

**OpenTelemetry** es el estándar que permite rastrear una petición desde el navegador, pasando por middleware, Server Components, hasta la base de datos. Next.js tiene soporte experimental con \`@vercel/otel\` o configuración manual.

### Source Maps: Rastrear incidentes

Cuando un error ocurre en producción, el código está minificado. Los **Source Maps** actúan como el registro que traduce \`a.js:1:234\` a \`UserProfile.tsx:45\`. Next.js los genera automáticamente y se pueden subir a servicios como Sentry.

### Error Boundary: Protocolo de emergencia

Un Error Boundary es como el protocolo que aísla a un paciente crítico sin cerrar el hospital entero. En Next.js, usas \`error.tsx\` (por segmento de ruta) o \`global-error.tsx\` (toda la app).

### Expected Errors vs Uncaught Exceptions

Los **Expected Errors** son síntomas conocidos: un formulario con datos inválidos, un recurso no encontrado. Se manejan con \`try/catch\` en Server Actions o \`useActionState\` sin activar el boundary.

Las **Uncaught Exceptions** son emergencias imprevistas: un servicio caído, un bug no anticipado. Estas activan automáticamente el \`error.tsx\` más cercano.`,
  codeExamples: [
    {
      title: 'Unit Test con Vitest y Testing Library',
      language: 'ts',
      description: 'Prueba unitaria de un componente aislado',
      code: `import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { UserGreeting } from './UserGreeting';

test('muestra el nombre del usuario', () => {
  render(<UserGreeting name="Ana" />);
  expect(screen.getByText('Hola, Ana')).toBeInTheDocument();
});

test('muestra mensaje por defecto sin nombre', () => {
  render(<UserGreeting />);
  expect(screen.getByText('Hola, visitante')).toBeInTheDocument();
});`,
    },
    {
      title: 'Configuración de instrumentation.ts',
      language: 'ts',
      description: 'Archivo que Next.js ejecuta al iniciar el servidor',
      code: `// instrumentation.ts (raíz del proyecto)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = await import(
      '@opentelemetry/auto-instrumentations-node'
    );

    const sdk = new NodeSDK({
      instrumentations: [getNodeAutoInstrumentations()],
    });
    sdk.start();
  }
}`,
    },
    {
      title: 'Error Boundary con error.tsx',
      language: 'tsx',
      description: 'Manejo de errores por segmento de ruta en Next.js',
      code: `'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert">
      <h2>Algo salió mal</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Intentar de nuevo</button>
    </div>
  );
}`,
    },
    {
      title: 'E2E Test con Playwright',
      language: 'ts',
      description: 'Prueba end-to-end que simula navegación real',
      code: `import { test, expect } from '@playwright/test';

test('flujo de login completo', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@test.com');
  await page.fill('[name="password"]', 'secret123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading')).toContainText('Bienvenido');
});`,
    },
    {
      title: 'Expected Error en Server Action',
      language: 'ts',
      description: 'Manejo intencional de errores esperados sin activar Error Boundary',
      code: `'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export async function createUser(formData: FormData) {
  const result = schema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
  });

  if (!result.success) {
    // Expected error: NO lanzar, retornar estado
    return { error: 'Datos inválidos', issues: result.error.flatten() };
  }

  // ... crear usuario
  return { success: true };
}`,
    },
  ],
  pitfalls: [
    'No confundir Error Boundary (error.tsx) con global-error.tsx — el primero es por segmento, el segundo captura errores del layout raíz.',
    'Los Source Maps NUNCA deben exponerse al público en producción; súbelos solo a tu servicio de monitoreo (Sentry, Datadog).',
    'instrumentation.ts se ejecuta tanto en Node.js como en Edge runtime — siempre verifica NEXT_RUNTIME antes de importar módulos de Node.',
    'Los unit tests que dependen de fetch o base de datos no son unit tests — son integration tests disfrazados. Usa mocks para mantenerlos rápidos.',
    'No usar try/catch dentro de Server Components para errores inesperados; deja que el Error Boundary los capture automáticamente.',
    'Playwright y Cypress requieren que la app esté corriendo — configura webServer en playwright.config.ts para que se levante automáticamente.',
    'OpenTelemetry agrega overhead mínimo pero medible. En Edge Functions con límites estrictos de tiempo, evalúa si el tracing justifica los milisegundos extra.',
  ],
  cheatSheet: [
    'Unit → Vitest + Testing Library. Rápido, sin servidor, para lógica aislada.',
    'Integration → render() de componentes que usan otros componentes/hooks juntos.',
    'E2E → Playwright/Cypress. Navegador real, flujos completos.',
    'instrumentation.ts → se ejecuta UNA vez al iniciar servidor. Ideal para OpenTelemetry.',
    'OpenTelemetry → trazas distribuidas: navegador → middleware → server → DB.',
    'Source Maps → mapean código minificado al fuente. NUNCA públicos en prod.',
    'error.tsx → Error Boundary por segmento de ruta. Recibe error + reset.',
    'global-error.tsx → captura errores del Root Layout. Debe incluir <html> y <body>.',
    'Expected Errors → try/catch + return estado. NO lanzan excepciones.',
    'Uncaught Exceptions → activan error.tsx automáticamente. Incluyen digest para logging.',
  ],
  flashcards: [
    {
      id: 'next-test-fc-1',
      front: '¿Qué archivo ejecuta Next.js una sola vez al iniciar el servidor para configurar observabilidad?',
      back: 'instrumentation.ts — se ejecuta al iniciar y es el lugar ideal para registrar OpenTelemetry, SDKs de monitoreo y otros proveedores de observabilidad.',
      usesAnalogy: true,
    },
    {
      id: 'next-test-fc-2',
      front: '¿Cuál es la diferencia entre error.tsx y global-error.tsx?',
      back: 'error.tsx captura errores dentro de un segmento de ruta específico (como aislar un paciente en su habitación). global-error.tsx captura errores del Root Layout y DEBE incluir sus propios tags <html> y <body>.',
      usesAnalogy: true,
    },
    {
      id: 'next-test-fc-3',
      front: '¿Qué herramienta recomienda Next.js para unit testing?',
      back: 'Vitest (junto con @testing-library/react). Es rápido, compatible con ESM y no requiere levantar un servidor — como revisar signos vitales individuales sin necesitar todo el hospital.',
    },
    {
      id: 'next-test-fc-4',
      front: '¿Qué son los Expected Errors en Next.js y cómo se manejan?',
      back: 'Son errores anticipados (validación, recurso no encontrado) que se manejan con try/catch o useActionState. Retornan estado al cliente sin activar el Error Boundary.',
    },
    {
      id: 'next-test-fc-5',
      front: '¿Por qué los Source Maps no deben ser públicos en producción?',
      back: 'Porque exponen el código fuente original a cualquier usuario. Se deben subir únicamente a servicios de monitoreo (Sentry, Datadog) y nunca servirse al navegador en producción.',
    },
    {
      id: 'next-test-fc-6',
      front: '¿Qué propiedad recibe el componente error.tsx para reintentar el renderizado?',
      back: 'La función reset() — al invocarla, React intenta re-renderizar el segmento que falló. Si el error persiste, se muestra el fallback de nuevo.',
    },
    {
      id: 'next-test-fc-7',
      front: '¿Qué verificar antes de importar módulos de Node.js en instrumentation.ts?',
      back: 'Verificar que process.env.NEXT_RUNTIME === "nodejs", porque instrumentation.ts también se ejecuta en Edge runtime donde los módulos de Node.js no están disponibles.',
    },
    {
      id: 'next-test-fc-8',
      front: '¿Qué es OpenTelemetry y qué permite rastrear?',
      back: 'Es un estándar abierto para observabilidad que permite rastrear trazas distribuidas: desde el navegador, pasando por middleware y Server Components, hasta la base de datos.',
    },
  ],
  quiz: [
    {
      id: 'next-test-q-1',
      question: 'En la analogía del hospital, ¿qué nivel de revisión médica corresponde a los End-to-End tests?',
      options: [
        { id: 'a', text: 'Revisión de signos vitales individuales' },
        { id: 'b', text: 'Análisis combinado de varios especialistas' },
        { id: 'c', text: 'Simulación completa de admisión a alta con paciente ficticio' },
        { id: 'd', text: 'Lectura del historial médico previo' },
      ],
      correctOptionId: 'c',
      explanation: 'Los E2E tests simulan el recorrido completo del usuario, igual que una simulación médica que lleva a un paciente ficticio por todo el proceso hospitalario.',
      whyOthersAreWrong: {
        a: 'La revisión individual corresponde a los unit tests (probar una función aislada).',
        b: 'El análisis combinado corresponde a los integration tests (varios módulos interactuando).',
        d: 'Leer el historial no tiene equivalente directo en la analogía de niveles de testing.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-test-q-2',
      question: '¿Cuál es el propósito del archivo instrumentation.ts en Next.js?',
      options: [
        { id: 'a', text: 'Definir rutas API del proyecto' },
        { id: 'b', text: 'Ejecutar código de setup una vez al iniciar el servidor (OpenTelemetry, SDKs)' },
        { id: 'c', text: 'Configurar los tests unitarios del proyecto' },
        { id: 'd', text: 'Exportar los Source Maps para producción' },
      ],
      correctOptionId: 'b',
      explanation: 'instrumentation.ts se ejecuta una sola vez al arrancar el servidor de Next.js. Es el lugar para registrar proveedores de OpenTelemetry, SDKs de error tracking y otros setups de observabilidad.',
      whyOthersAreWrong: {
        a: 'Las rutas API se definen en app/api/ con route.ts, no en instrumentation.',
        c: 'Los tests se configuran en vitest.config.ts o jest.config.ts, no en instrumentation.',
        d: 'Los Source Maps se generan automáticamente en el build, no requieren un archivo dedicado.',
      },
    },
    {
      id: 'next-test-q-3',
      question: '¿Qué ocurre cuando una Uncaught Exception se lanza dentro de un Server Component?',
      options: [
        { id: 'a', text: 'Next.js retorna un JSON con el error al cliente' },
        { id: 'b', text: 'Se activa el error.tsx más cercano en la jerarquía de rutas' },
        { id: 'c', text: 'La aplicación completa se detiene y requiere reinicio' },
        { id: 'd', text: 'El error se ignora silenciosamente y se renderiza null' },
      ],
      correctOptionId: 'b',
      explanation: 'Las Uncaught Exceptions activan automáticamente el Error Boundary más cercano (error.tsx del segmento). Si no existe, sube hasta global-error.tsx.',
      whyOthersAreWrong: {
        a: 'Next.js no expone detalles del error como JSON al cliente por seguridad; usa un digest opaco.',
        c: 'La app no se detiene; el Error Boundary aísla el error al segmento afectado.',
        d: 'Los errores no se ignoran; siempre activan algún boundary o el error global.',
      },
    },
    {
      id: 'next-test-q-4',
      question: '¿Por qué se debe verificar NEXT_RUNTIME antes de importar módulos de Node.js en instrumentation.ts?',
      options: [
        { id: 'a', text: 'Porque instrumentation.ts no se ejecuta en producción' },
        { id: 'b', text: 'Porque el archivo se ejecuta tanto en Node.js como en Edge runtime donde los módulos de Node no están disponibles' },
        { id: 'c', text: 'Porque Next.js no soporta imports dinámicos' },
        { id: 'd', text: 'Porque los módulos de Node.js causan errores de TypeScript' },
      ],
      correctOptionId: 'b',
      explanation: 'instrumentation.ts se ejecuta en ambos runtimes. El Edge runtime no tiene acceso a módulos de Node.js (fs, net, etc.), así que debemos condicionar el import.',
      whyOthersAreWrong: {
        a: 'Sí se ejecuta en producción; de hecho es donde más importa para observabilidad.',
        c: 'Next.js sí soporta imports dinámicos (await import()), y es justo lo que se usa aquí.',
        d: 'No es un problema de TypeScript sino de disponibilidad del runtime en Edge.',
      },
    },
    {
      id: 'next-test-q-5',
      question: '¿Cuál es la diferencia principal entre Expected Errors y Uncaught Exceptions?',
      options: [
        { id: 'a', text: 'Expected Errors ocurren en el cliente; Uncaught Exceptions en el servidor' },
        { id: 'b', text: 'Expected Errors se manejan con try/catch retornando estado; Uncaught Exceptions activan el Error Boundary' },
        { id: 'c', text: 'Expected Errors no se loguean; Uncaught Exceptions siempre se muestran al usuario' },
        { id: 'd', text: 'No hay diferencia técnica, solo semántica' },
      ],
      correctOptionId: 'b',
      explanation: 'Los Expected Errors se anticipan y manejan intencionalmente con try/catch, retornando estado al componente. Las Uncaught Exceptions son errores no anticipados que propagan hasta el Error Boundary.',
      whyOthersAreWrong: {
        a: 'Ambos tipos pueden ocurrir tanto en cliente como en servidor.',
        c: 'Ambos deben loguearse para observabilidad; la diferencia es en cómo se manejan, no si se registran.',
        d: 'Hay una diferencia técnica real: uno usa control de flujo normal y el otro activa boundaries.',
      },
    },
    {
      id: 'next-test-q-6',
      question: '¿Qué debe incluir global-error.tsx que error.tsx NO necesita incluir?',
      options: [
        { id: 'a', text: 'La directiva "use client"' },
        { id: 'b', text: 'Los tags <html> y <body>' },
        { id: 'c', text: 'Un botón de reset' },
        { id: 'd', text: 'La prop digest del error' },
      ],
      correctOptionId: 'b',
      explanation: 'global-error.tsx reemplaza el Root Layout completo cuando ocurre un error, por lo que DEBE definir sus propios tags <html> y <body>. error.tsx se renderiza dentro del layout existente.',
      whyOthersAreWrong: {
        a: 'Tanto error.tsx como global-error.tsx requieren "use client" ya que son Client Components.',
        c: 'Ambos reciben la función reset() y pueden incluir un botón para reintentar.',
        d: 'La prop digest está disponible en ambos componentes de error.',
      },
    },
    {
      id: 'next-test-q-7',
      question: 'En el contexto de la analogía del hospital, ¿qué representa OpenTelemetry?',
      options: [
        { id: 'a', text: 'El médico que revisa signos vitales' },
        { id: 'b', text: 'El protocolo de emergencia que aísla pacientes' },
        { id: 'c', text: 'El sistema centralizado que registra cada paso del paciente por el hospital' },
        { id: 'd', text: 'La simulación de admisión a alta' },
      ],
      correctOptionId: 'c',
      explanation: 'OpenTelemetry es como el sistema centralizado de registro que rastrea cada paso del paciente (request) a través de todas las áreas del hospital (servicios), permitiendo reconstruir el recorrido completo.',
      whyOthersAreWrong: {
        a: 'El médico revisando signos vitales corresponde a unit testing.',
        b: 'El protocolo de emergencia corresponde al Error Boundary.',
        d: 'La simulación completa corresponde a los E2E tests.',
      },
      usesAnalogy: true,
    },
  ],
  difficulty: 'avanzado',
  estimatedMinutes: 25,
  tags: [
    'testing',
    'vitest',
    'playwright',
    'e2e',
    'unit-testing',
    'integration-testing',
    'opentelemetry',
    'instrumentation',
    'source-maps',
    'error-boundary',
    'observability',
    'next.js',
  ],
};
