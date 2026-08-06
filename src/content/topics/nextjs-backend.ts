import type { Topic } from '../types';

export const nextjsBackendTopic: Topic = {
  id: 'nextjs-backend',
  courseId: 'nextjs-16',
  title: 'Next.js Backend: Route Handlers',
  realWorldAnalogy: {
    title: 'La ventanilla de atención al público',
    scenario:
      'En una oficina gubernamental hay ventanillas numeradas. Cada ventanilla atiende un tipo de trámite específico. El ciudadano llega, presenta su solicitud (con documentos y credencial), y la ventanilla procesa el trámite y devuelve un resultado. Algunas ventanillas solo entregan información, otras reciben documentos nuevos.',
    mapping: [
      { everyday: 'La ventanilla de un trámite específico', technical: 'Route Handler (archivo route.ts en una ruta)' },
      { everyday: 'El tipo de trámite (consulta, entrega, actualización)', technical: 'Método HTTP (GET, POST, PUT, DELETE)' },
      { everyday: 'La credencial del ciudadano', technical: 'Headers y Cookies (identificación del cliente)' },
      { everyday: 'Los documentos que entrega el ciudadano', technical: 'Request body (datos enviados al servidor)' },
      { everyday: 'El comprobante que devuelve la ventanilla', technical: 'Response (respuesta del servidor)' },
      { everyday: 'El intermediario que traduce entre departamentos', technical: 'Patrón BFF (Backend for Frontend)' },
    ],
    whereItBreaks:
      'En una oficina real hay colas y horarios. Un Route Handler responde instantáneamente (idealmente) y puede atender miles de solicitudes simultáneas sin que nadie espere en fila.',
  },
  keyTerms: [
    {
      term: 'Route Handler',
      definition: 'Función exportada desde route.ts que maneja peticiones HTTP en una ruta específica del App Router.',
      analogyHint: 'La ventanilla que atiende un trámite específico.',
    },
    {
      term: 'Request',
      definition: 'Objeto Web Request que contiene toda la información de la petición entrante (URL, headers, body).',
      analogyHint: 'La solicitud que el ciudadano entrega en la ventanilla.',
    },
    {
      term: 'Response',
      definition: 'Objeto Web Response que el Route Handler devuelve al cliente con datos, status y headers.',
      analogyHint: 'El comprobante o resultado que la ventanilla entrega.',
    },
    {
      term: 'NextResponse',
      definition: 'Extensión de Web Response con helpers para cookies, redirects y JSON.',
      analogyHint: 'Un formato de comprobante mejorado con sellos y firmas incluidos.',
    },
    {
      term: 'Cookies',
      definition: 'Pequeños datos que el servidor envía al navegador y este reenvía en cada petición posterior.',
      analogyHint: 'La credencial que te identificas cada vez que vuelves.',
    },
    {
      term: 'CORS',
      definition: 'Mecanismo que controla qué dominios externos pueden acceder a tus Route Handlers.',
      analogyHint: 'La lista de personas autorizadas a usar la ventanilla.',
    },
    {
      term: 'Webhook',
      definition: 'Endpoint que recibe notificaciones automáticas de servicios externos cuando ocurre un evento.',
      analogyHint: 'La ventanilla que recibe mensajeros de otras oficinas.',
    },
    {
      term: 'BFF Pattern',
      definition: 'Capa backend intermedia que adapta APIs externas al formato que necesita tu frontend.',
      analogyHint: 'El traductor entre dos departamentos que hablan distinto.',
    },
  ],
  summary:
    'Los Route Handlers de Next.js permiten crear endpoints API directamente dentro del App Router usando el archivo `route.ts`. Usan las Web APIs estándar (Request/Response), soportan todos los métodos HTTP (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS), y proporcionan acceso a cookies y headers. Son ideales para webhooks, CORS controlado y el patrón BFF.',
  explanation: `## La ventanilla de tu aplicación

Así como una oficina tiene ventanillas especializadas para cada trámite, Next.js te permite crear **Route Handlers**: archivos \`route.ts\` que funcionan como endpoints API dentro de tu proyecto.

### ¿Cómo funciona la ventanilla?

Cada archivo \`route.ts\` es una ventanilla. El **método HTTP** determina qué tipo de trámite atiendes:

- **GET** → "Vengo a consultar información" (la ventanilla solo entrega datos)
- **POST** → "Vengo a registrar algo nuevo" (el ciudadano entrega documentos)
- **PUT/PATCH** → "Vengo a actualizar mis datos" (modificar algo existente)
- **DELETE** → "Vengo a cancelar mi trámite" (eliminar un recurso)

### Web APIs estándar

Next.js usa las **Web Request y Response APIs** nativas del navegador. No necesitas librerías externas — es el estándar web:

\`\`\`ts
// app/api/users/route.ts
export async function GET(request: Request) {
  // request = la solicitud del ciudadano
  // Devuelves un Response = el comprobante
  return Response.json({ users: [] });
}
\`\`\`

### Cookies y Headers: la credencial del ciudadano

Igual que necesitas tu credencial para identificarte en la ventanilla, las **cookies** y **headers** identifican al cliente:

\`\`\`ts
import { cookies, headers } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session');
  const headerList = await headers();
  const userAgent = headerList.get('user-agent');
  // ...
}
\`\`\`

### CORS: la lista de autorizados

CORS define quién puede acceder a tu ventanilla desde otro dominio. Sin autorización, la petición es rechazada.

### Webhooks: mensajeros de otras oficinas

Un webhook es una ventanilla que **recibe** notificaciones de servicios externos (Stripe, GitHub, etc.) cuando ocurre un evento. Tu Route Handler valida el mensaje y actúa.

### Patrón BFF: el traductor

El patrón **Backend for Frontend** usa Route Handlers como intermediarios. Tu frontend habla con tu propio backend (la ventanilla), y este traduce la solicitud al formato que necesita la API externa. Así el frontend nunca expone claves secretas ni lidia con formatos complicados.`,
  codeExamples: [
    {
      title: 'Route Handler básico con GET y POST',
      language: 'ts',
      description: 'Archivo route.ts que maneja consultas y creación de recursos.',
      code: `// app/api/products/route.ts
import { NextResponse } from 'next/server';

// GET → consultar productos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const products = await getProducts(category);
  return NextResponse.json(products);
}

// POST → crear un producto nuevo
export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.price) {
    return NextResponse.json(
      { error: 'Nombre y precio son requeridos' },
      { status: 400 }
    );
  }

  const product = await createProduct(body);
  return NextResponse.json(product, { status: 201 });
}`,
    },
    {
      title: 'Rutas dinámicas con parámetros',
      language: 'ts',
      description: 'Route Handler con segmentos dinámicos para operaciones CRUD.',
      code: `// app/api/products/[id]/route.ts

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return Response.json(
      { error: 'Producto no encontrado' },
      { status: 404 }
    );
  }

  return Response.json(product);
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;
  await deleteProduct(id);
  return new Response(null, { status: 204 });
}`,
    },
    {
      title: 'Manejo de Cookies',
      language: 'ts',
      description: 'Leer, establecer y eliminar cookies en Route Handlers.',
      code: `// app/api/auth/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token } = await request.json();
  const cookieStore = await cookies();

  // Establecer cookie
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return NextResponse.json({ success: true });
}`,
    },
    {
      title: 'Configuración de CORS',
      language: 'ts',
      description: 'Responder a preflight requests y agregar headers CORS.',
      code: `// app/api/public/route.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://mi-otro-dominio.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Preflight request
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  const data = { message: 'Hola desde otra ventanilla' };
  return Response.json(data, { headers: corsHeaders });
}`,
    },
    {
      title: 'Webhook endpoint',
      language: 'ts',
      description: 'Recibir y validar notificaciones de un servicio externo.',
      code: `// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const headerList = await headers();
  const signature = headerList.get('stripe-signature');

  if (!signature) {
    return Response.json(
      { error: 'Sin firma' },
      { status: 401 }
    );
  }

  // Verificar firma del webhook
  const event = verifyWebhookSignature(body, signature);

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data);
      break;
    case 'payment_intent.failed':
      await handlePaymentFailure(event.data);
      break;
  }

  return Response.json({ received: true });
}`,
    },
    {
      title: 'Patrón BFF (Backend for Frontend)',
      language: 'ts',
      description: 'Intermediario que adapta una API externa para el frontend.',
      code: `// app/api/weather/route.ts
// El frontend llama a /api/weather?city=Madrid
// El Route Handler traduce al formato de la API externa

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  // API key secreta — nunca expuesta al frontend
  const res = await fetch(
    \`https://api.weather.io/v1?q=\${city}&key=\${process.env.WEATHER_API_KEY}\`
  );

  if (!res.ok) {
    return Response.json(
      { error: 'No se pudo obtener el clima' },
      { status: 502 }
    );
  }

  const raw = await res.json();

  // Traducir al formato simple que necesita el frontend
  return Response.json({
    city: raw.location.name,
    temp: raw.current.temp_c,
    condition: raw.current.condition.text,
  });
}`,
    },
  ],
  pitfalls: [
    'No puedes tener un archivo `route.ts` y un `page.tsx` en la misma carpeta — son mutuamente excluyentes.',
    'Los Route Handlers GET sin usar el objeto Request se cachean por defecto (static). Si necesitas datos dinámicos, usa `export const dynamic = "force-dynamic"` o lee headers/cookies.',
    'Olvidar manejar el método OPTIONS para CORS causa que los navegadores bloqueen peticiones cross-origin.',
    'No validar el body de un POST/PUT puede causar errores en runtime. Siempre valida con Zod o similar antes de procesar.',
    'Exponer API keys en el frontend en lugar de usar el patrón BFF. Las variables `process.env` sin prefijo `NEXT_PUBLIC_` solo existen en el servidor.',
    'No verificar la firma de webhooks permite que cualquiera envíe eventos falsos a tu endpoint.',
    'Usar `request.json()` en un GET lanza error — GET no tiene body.',
    'Los params en Next.js 15+ son asíncronos (Promise). Olvidar `await params` causa errores de tipo.',
  ],
  cheatSheet: [
    '`route.ts` en cualquier carpeta del App Router crea un endpoint API.',
    'Exporta funciones nombradas: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.',
    '`Request` y `Response` son Web APIs estándar — no son propias de Next.js.',
    '`NextResponse.json(data, { status })` — atajo para respuestas JSON.',
    '`await cookies()` para leer/escribir cookies (import de `next/headers`).',
    '`await headers()` para leer headers de la petición entrante.',
    'Rutas dinámicas: `app/api/[id]/route.ts` → `params.id`.',
    'CORS: responde OPTIONS con status 204 y headers `Access-Control-Allow-*`.',
    'BFF: tu Route Handler es intermediario entre frontend y APIs externas.',
    'Webhooks: valida SIEMPRE la firma antes de procesar el evento.',
    '`export const dynamic = "force-dynamic"` opta out del cache en GET.',
    'Un Route Handler puede devolver streaming con `ReadableStream`.',
  ],
  flashcards: [
    {
      id: 'next-backend-fc-1',
      front: '¿Qué archivo necesitas crear para definir un Route Handler en Next.js?',
      back: 'Un archivo `route.ts` (o `route.js`) dentro de cualquier carpeta del App Router. La ruta del archivo determina la URL del endpoint.',
    },
    {
      id: 'next-backend-fc-2',
      front: '¿Qué Web APIs estándar usan los Route Handlers de Next.js?',
      back: 'Usan `Request` y `Response` — las mismas APIs del navegador. Next.js extiende Response con `NextResponse` que agrega helpers para JSON, cookies y redirects.',
    },
    {
      id: 'next-backend-fc-3',
      front: '¿Cómo accedes a los query parameters en un Route Handler GET?',
      back: '`const { searchParams } = new URL(request.url);` y luego `searchParams.get("param")` para obtener el valor.',
    },
    {
      id: 'next-backend-fc-4',
      front: 'En la analogía de la ventanilla, ¿qué representan las cookies y headers?',
      back: 'Representan la **credencial del ciudadano**: datos que te identifican cada vez que vuelves a la ventanilla. El servidor los usa para saber quién eres sin pedirte que te registres de nuevo.',
      usesAnalogy: true,
    },
    {
      id: 'next-backend-fc-5',
      front: '¿Qué método HTTP debes manejar para que CORS funcione correctamente?',
      back: 'El método **OPTIONS** (preflight request). El navegador envía esta petición antes de la real para verificar si el servidor permite el origen, métodos y headers solicitados.',
    },
    {
      id: 'next-backend-fc-6',
      front: '¿Qué es el patrón BFF y por qué es útil con Route Handlers?',
      back: 'Backend for Frontend: un Route Handler actúa como intermediario entre tu frontend y APIs externas. Oculta API keys, simplifica respuestas y adapta formatos. El frontend nunca habla directamente con servicios externos.',
    },
    {
      id: 'next-backend-fc-7',
      front: 'En la analogía, ¿qué representa un webhook?',
      back: 'Un **mensajero de otra oficina** que llega a tu ventanilla con una notificación. Tu ventanilla (Route Handler POST) recibe el mensaje, verifica que sea legítimo (firma), y actúa según el contenido.',
      usesAnalogy: true,
    },
    {
      id: 'next-backend-fc-8',
      front: '¿Puedes tener `route.ts` y `page.tsx` en la misma carpeta?',
      back: 'No. Son mutuamente excluyentes. Una carpeta es o una página (page.tsx) o un endpoint API (route.ts), nunca ambas.',
    },
  ],
  quiz: [
    {
      id: 'next-backend-q-1',
      question: 'En la analogía de la oficina, ¿qué representa el método HTTP POST?',
      options: [
        { id: 'a', text: 'El ciudadano consulta información sin entregar nada' },
        { id: 'b', text: 'El ciudadano entrega documentos nuevos para registrar un trámite' },
        { id: 'c', text: 'El ciudadano cancela un trámite existente' },
        { id: 'd', text: 'El ciudadano verifica si la ventanilla está abierta' },
      ],
      correctOptionId: 'b',
      explanation: 'POST se usa para crear/enviar datos nuevos al servidor, igual que un ciudadano que entrega documentos para registrar algo nuevo en la ventanilla.',
      whyOthersAreWrong: {
        a: 'Consultar sin entregar nada es GET — solo pides información.',
        c: 'Cancelar un trámite existente corresponde a DELETE.',
        d: 'Verificar si la ventanilla está abierta es HEAD u OPTIONS — peticiones de metadatos.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-backend-q-2',
      question: '¿Cuál es la forma correcta de crear un Route Handler GET en Next.js 16?',
      options: [
        { id: 'a', text: '`export default function handler(req, res) { res.json({}) }`' },
        { id: 'b', text: '`export async function GET(request: Request) { return Response.json({}) }`' },
        { id: 'c', text: '`export const get = (req) => new Response()`' },
        { id: 'd', text: '`module.exports = { GET: (req, res) => res.send({}) }`' },
      ],
      correctOptionId: 'b',
      explanation: 'Los Route Handlers exportan funciones nombradas con el nombre del método HTTP en mayúsculas (GET, POST, etc.) que reciben Request y devuelven Response.',
      whyOthersAreWrong: {
        a: 'Ese es el formato de Pages Router (api/). El App Router no usa `res.json()`.',
        c: 'El nombre debe ser en mayúsculas (GET, no get) y debe ser una función exportada, no una constante arrow.',
        d: 'Los Route Handlers usan ESM exports, no CommonJS `module.exports`.',
      },
    },
    {
      id: 'next-backend-q-3',
      question: '¿Qué sucede si tienes `route.ts` y `page.tsx` en la misma carpeta del App Router?',
      options: [
        { id: 'a', text: 'Ambos funcionan: page.tsx para navegación y route.ts para API' },
        { id: 'b', text: 'Solo se usa page.tsx y route.ts se ignora' },
        { id: 'c', text: 'Genera un error — son mutuamente excluyentes en la misma ruta' },
        { id: 'd', text: 'route.ts tiene prioridad y page.tsx se ignora' },
      ],
      correctOptionId: 'c',
      explanation: 'Next.js no permite route.ts y page.tsx en la misma carpeta. Una ruta es o una página o un endpoint API, nunca ambas.',
      whyOthersAreWrong: {
        a: 'No pueden coexistir — Next.js lanza un error de conflicto.',
        b: 'No se ignora silenciosamente, es un error de build.',
        d: 'No hay prioridad — es un conflicto que debe resolverse moviendo uno a otra ruta.',
      },
    },
    {
      id: 'next-backend-q-4',
      question: '¿Por qué es importante manejar el método OPTIONS en un Route Handler público?',
      options: [
        { id: 'a', text: 'Para listar todos los endpoints disponibles en la API' },
        { id: 'b', text: 'Para responder al preflight request de CORS que envía el navegador' },
        { id: 'c', text: 'Para verificar que el servidor está activo (health check)' },
        { id: 'd', text: 'Para devolver la documentación del endpoint' },
      ],
      correctOptionId: 'b',
      explanation: 'Los navegadores envían una petición OPTIONS (preflight) antes de peticiones cross-origin para verificar que el servidor permite el origen y métodos. Sin manejar OPTIONS, las peticiones CORS fallan.',
      whyOthersAreWrong: {
        a: 'Listar endpoints es función de documentación/OpenAPI, no de OPTIONS en CORS.',
        c: 'Los health checks típicamente usan GET en un endpoint dedicado como /api/health.',
        d: 'La documentación se sirve por otros medios (Swagger, etc.), no por OPTIONS.',
      },
    },
    {
      id: 'next-backend-q-5',
      question: '¿Cuál es la principal ventaja del patrón BFF con Route Handlers?',
      options: [
        { id: 'a', text: 'Hace que la API sea más rápida al cachear todo automáticamente' },
        { id: 'b', text: 'Permite usar cualquier base de datos sin ORM' },
        { id: 'c', text: 'Oculta API keys del frontend y adapta respuestas externas al formato que necesita el cliente' },
        { id: 'd', text: 'Elimina la necesidad de autenticación en servicios externos' },
      ],
      correctOptionId: 'c',
      explanation: 'El patrón BFF usa Route Handlers como intermediarios: las API keys permanecen en el servidor (process.env sin NEXT_PUBLIC_) y el frontend recibe datos simplificados sin exponer secretos.',
      whyOthersAreWrong: {
        a: 'El cache no es automático y no es la razón principal del patrón BFF.',
        b: 'BFF no está relacionado con bases de datos ni ORMs — es sobre APIs externas.',
        d: 'La autenticación sigue siendo necesaria, pero la maneja el servidor en lugar del cliente.',
      },
    },
    {
      id: 'next-backend-q-6',
      question: '¿Cómo se leen cookies dentro de un Route Handler en Next.js 16?',
      options: [
        { id: 'a', text: '`const cookies = request.cookies.getAll()`' },
        { id: 'b', text: '`const cookieStore = await cookies(); cookieStore.get("name")`' },
        { id: 'c', text: '`const cookie = document.cookie`' },
        { id: 'd', text: '`const cookie = getCookie(request, "name")`' },
      ],
      correctOptionId: 'b',
      explanation: 'En Next.js 15+, la función `cookies()` de `next/headers` es asíncrona. Se usa `await cookies()` para obtener el cookie store y luego `.get()` para leer una cookie específica.',
      whyOthersAreWrong: {
        a: 'Aunque Request tiene una propiedad cookies en algunos runtimes, la forma idiomática en Next.js es usar `cookies()` de `next/headers`.',
        c: '`document.cookie` solo existe en el navegador. Los Route Handlers corren en el servidor.',
        d: 'No existe una función `getCookie` en la API de Next.js.',
      },
    },
    {
      id: 'next-backend-q-7',
      question: '¿Qué se debe verificar SIEMPRE al recibir un webhook?',
      options: [
        { id: 'a', text: 'Que el body tenga formato JSON válido' },
        { id: 'b', text: 'Que la firma (signature) del header sea válida para confirmar la autenticidad' },
        { id: 'c', text: 'Que la IP del remitente esté en una lista blanca' },
        { id: 'd', text: 'Que el webhook llegue por HTTPS exclusivamente' },
      ],
      correctOptionId: 'b',
      explanation: 'La firma criptográfica en el header (ej: `stripe-signature`) garantiza que el evento proviene del servicio real y no fue manipulado. Sin verificarla, cualquiera podría enviar eventos falsos.',
      whyOthersAreWrong: {
        a: 'Validar JSON es buena práctica pero no garantiza autenticidad — un atacante puede enviar JSON válido.',
        c: 'Las IPs pueden cambiar y ser spoofed. La firma es el mecanismo estándar de verificación.',
        d: 'HTTPS es importante pero lo maneja la infraestructura, no tu código de webhook.',
      },
    },
  ],
  difficulty: 'intermedio',
  estimatedMinutes: 25,
  tags: [
    'route-handlers',
    'api',
    'http-methods',
    'cookies',
    'headers',
    'cors',
    'webhooks',
    'bff',
    'next.js',
    'backend',
  ],
};
