import type { Topic } from '../types';

export const nextjsSecurityTopic: Topic = {
  id: 'nextjs-security',
  courseId: 'nextjs-16',
  title: 'Next.js Security & Auth: El guardia del edificio',
  realWorldAnalogy: {
    title: 'El guardia y el sistema de seguridad del edificio',
    scenario:
      'Un edificio corporativo tiene un guardia en la entrada que verifica credenciales, cámaras en cada piso que detectan comportamiento sospechoso, puertas con diferentes niveles de acceso según el rol del visitante, y un protocolo estricto para manejar llaves maestras que nunca se entregan directamente a los visitantes.',
    mapping: [
      { everyday: 'El guardia verificando credenciales en la entrada', technical: 'proxy.ts — intercepta requests antes de llegar a la app' },
      { everyday: 'Puertas con distintos niveles de acceso por rol', technical: 'Authorization — verificar permisos según el rol del usuario' },
      { everyday: 'Credencial temporal con foto y fecha de expiración', technical: 'Session Management — tokens con expiración' },
      { everyday: 'Cámaras que detectan paquetes sospechosos', technical: 'CSP / XSS / CSRF — protección contra contenido malicioso' },
      { everyday: 'Llaves maestras guardadas en caja fuerte, nunca expuestas', technical: 'Secret Management — variables de entorno privadas del servidor' },
      { everyday: 'Gafetes de visitante que solo muestran el nombre (no info interna)', technical: 'NEXT_PUBLIC_ — solo lo seguro se expone al cliente' },
    ],
    whereItBreaks:
      'Un guardia real puede usar intuición y contexto social. proxy.ts y la authorization en Next.js son puramente programáticos: solo verifican tokens y roles exactos, sin juicio subjetivo.',
  },
  keyTerms: [
    {
      term: 'proxy.ts',
      definition: 'Archivo que reemplaza a middleware.ts en Next.js 16, intercepta cada request entrante antes de que llegue a las rutas.',
      analogyHint: 'El guardia en la puerta principal que revisa a todos.',
    },
    {
      term: 'Matcher',
      definition: 'Configuración que define qué rutas pasan por el proxy, evitando procesar assets estáticos innecesariamente.',
      analogyHint: 'La lista de pisos donde el guardia debe revisar credenciales.',
    },
    {
      term: 'Authentication',
      definition: 'Proceso de verificar la identidad del usuario (quién eres), típicamente con cookies o tokens.',
      analogyHint: 'Mostrar tu credencial con foto al guardia de la entrada.',
    },
    {
      term: 'Session Management',
      definition: 'Creación, renovación y expiración de sesiones de usuario, almacenadas como cookies encriptadas.',
      analogyHint: 'Tu gafete temporal que expira al final del día.',
    },
    {
      term: 'Authorization',
      definition: 'Verificar qué acciones puede realizar un usuario autenticado según su rol o permisos.',
      analogyHint: 'Tu nivel de acceso determina a qué pisos puedes entrar.',
    },
    {
      term: 'CSP (Content Security Policy)',
      definition: 'Cabecera HTTP que define qué fuentes de contenido son confiables, previniendo inyección de scripts maliciosos.',
      analogyHint: 'Lista de proveedores aprobados que pueden dejar paquetes.',
    },
    {
      term: 'CSRF',
      definition: 'Ataque donde un sitio malicioso ejecuta acciones en nombre del usuario autenticado sin su consentimiento.',
      analogyHint: 'Alguien falsifica tu firma para autorizar una entrega.',
    },
    {
      term: 'XSS',
      definition: 'Ataque que inyecta scripts maliciosos en páginas web para robar datos o sesiones de otros usuarios.',
      analogyHint: 'Un paquete bomba disfrazado de entrega legítima.',
    },
    {
      term: 'Secret Management',
      definition: 'Práctica de mantener claves API y credenciales exclusivamente en el servidor, nunca expuestas al cliente.',
      analogyHint: 'Las llaves maestras viven en la caja fuerte, no en recepción.',
    },
    {
      term: 'NEXT_PUBLIC_',
      definition: 'Prefijo que expone una variable de entorno al bundle del cliente. Sin este prefijo, la variable solo existe en el servidor.',
      analogyHint: 'Solo la info del gafete de visitante es pública, no los datos internos.',
    },
    {
      term: 'Tainting (experimental)',
      definition: 'API experimental que marca objetos o valores como no-transferibles al cliente, causando error si se pasan accidentalmente.',
      analogyHint: 'Sello "CONFIDENCIAL" que impide sacar documentos del edificio.',
    },
  ],
  summary:
    'Next.js 16 reemplaza middleware.ts con `proxy.ts` para interceptar requests. La seguridad se construye en capas: authentication verifica identidad, session management maneja tokens con expiración, y authorization controla permisos por rol. CSP previene inyección de scripts, CSRF tokens protegen formularios, y React escapa XSS por defecto. Las variables sin `NEXT_PUBLIC_` nunca llegan al cliente, y `taintObjectReference` (experimental) marca datos como intransferibles.',
  explanation: `## El guardia y las capas de seguridad

Imagina el edificio corporativo de la analogía: no basta con un guardia en la puerta. Necesitas **múltiples capas** — credenciales, cámaras, puertas con llave, y protocolos para material sensible. Next.js 16 implementa exactamente esto.

## proxy.ts: El nuevo guardia (reemplazo de middleware)

En Next.js 16, \`proxy.ts\` reemplaza a \`middleware.ts\`. Como el guardia en la entrada, intercepta **cada request** antes de que llegue a tu aplicación:

\`\`\`ts
// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
\`\`\`

### Matcher: Dónde revisa el guardia

No tiene sentido que el guardia revise cada imagen o archivo CSS. El matcher filtra qué rutas pasan por el proxy:

\`\`\`ts
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
\`\`\`

## Authentication: ¿Quién eres?

Como mostrar la credencial al guardia. Next.js 16 recomienda cookies HTTP-only para almacenar tokens de sesión:

\`\`\`ts
// Verificar sesión en un Server Component
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  const payload = await decrypt(session?.value);

  if (!payload) redirect('/login');
  return <Dashboard user={payload.user} />;
}
\`\`\`

## Session Management: Gafetes temporales

Las sesiones deben tener **expiración**. Como un gafete de visitante válido solo por un día:

- Usar cookies HTTP-only (no accesibles desde JavaScript del cliente)
- Encriptar el contenido con \`jose\` o librerías similares
- Renovar antes de expirar (sliding expiration)
- Invalidar al hacer logout

## Authorization: Niveles de acceso

No todos pueden entrar a todos los pisos. Verificar permisos **en el servidor**:

\`\`\`ts
// lib/auth.ts
export function canAccess(userRole: string, requiredRole: string) {
  const hierarchy = ['viewer', 'editor', 'admin'];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole);
}
\`\`\`

**Importante**: Nunca confiar solo en el cliente para authorization. El guardia (servidor) siempre tiene la última palabra.

## CSP: Lista de proveedores aprobados

Content Security Policy es una cabecera HTTP que dice al navegador qué fuentes de contenido son legítimas:

\`\`\`ts
// next.config.ts
const cspHeader = \`
  default-src 'self';
  script-src 'self' 'nonce-\${nonce}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
\`;
\`\`\`

Usa **nonces** para permitir scripts inline específicos sin abrir la puerta a todos.

## CSRF y XSS: Detectar paquetes sospechosos

- **CSRF**: Valida que las acciones POST/PUT/DELETE vengan de tu propio sitio usando tokens CSRF o verificando el header \`Origin\`.
- **XSS**: React escapa contenido por defecto. **Nunca** uses \`dangerouslySetInnerHTML\` con datos del usuario sin sanitizar.

## Secret Management: La caja fuerte

Las llaves maestras (API keys, DB passwords) **nunca** salen de la caja fuerte (servidor):

- Variables **sin** \`NEXT_PUBLIC_\` solo existen en el servidor
- Variables **con** \`NEXT_PUBLIC_\` se incluyen en el bundle del cliente
- Server Components acceden a secretos directamente
- Client Components **jamás** ven secretos del servidor

## Tainting: Sello "CONFIDENCIAL" (experimental)

\`taintObjectReference\` marca un objeto para que Next.js lance error si intentas pasarlo a un Client Component:

\`\`\`ts
import { experimental_taintObjectReference } from 'react';

const dbCredentials = { host: '...', password: '...' };
experimental_taintObjectReference(
  'No pasar credenciales al cliente',
  dbCredentials
);
\`\`\`

Es como el sello "CONFIDENCIAL" que impide sacar un documento del edificio.`,
  codeExamples: [
    {
      title: 'proxy.ts con matcher',
      language: 'ts',
      code: `// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;

  // Redirigir a login si no hay sesión
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Agregar cabeceras de seguridad
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`,
      description: 'Proxy que protege rutas y agrega cabeceras de seguridad',
    },
    {
      title: 'Session con cookies encriptadas',
      language: 'ts',
      code: `// lib/session.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function decrypt(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}`,
      description: 'Manejo de sesiones con JWT encriptado en cookies HTTP-only',
    },
    {
      title: 'Authorization en Server Component',
      language: 'tsx',
      code: `// app/admin/page.tsx
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get('session')?.value);

  if (!session) redirect('/login');
  if (session.role !== 'admin') redirect('/unauthorized');

  return <AdminDashboard />;
}`,
      description: 'Verificación de rol en el servidor antes de renderizar',
    },
    {
      title: 'CSP con nonce',
      language: 'ts',
      code: `// proxy.ts — agregar nonce para CSP
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = [
    "default-src 'self'",
    \`script-src 'self' 'nonce-\${nonce}' 'strict-dynamic'\`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);
  return response;
}`,
      description: 'Cabecera CSP con nonce dinámico para scripts inline',
    },
    {
      title: 'Tainting experimental',
      language: 'ts',
      code: `// lib/db.ts
import { experimental_taintObjectReference } from 'react';

function getDBCredentials() {
  const credentials = {
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
  };

  // Marcar como intransferible al cliente
  experimental_taintObjectReference(
    'Las credenciales de BD no deben pasarse a Client Components.',
    credentials
  );

  return credentials;
}`,
      description: 'Marcar objetos sensibles para prevenir transferencia accidental al cliente',
    },
  ],
  pitfalls: [
    'Hacer authorization solo en el cliente — un usuario puede modificar el JavaScript. Siempre verificar en el servidor.',
    'Guardar tokens de sesión en localStorage — es vulnerable a XSS. Usar cookies HTTP-only.',
    'Exponer API keys con el prefijo NEXT_PUBLIC_ — cualquier variable con ese prefijo es visible en el bundle del cliente.',
    'Usar dangerouslySetInnerHTML con datos del usuario sin sanitizar — abre la puerta a XSS.',
    'Confiar solo en proxy.ts para authorization — es una primera línea de defensa, no la única. Verificar también en la capa de datos.',
    'Olvidar el atributo sameSite en cookies — sin él, eres vulnerable a CSRF.',
    'No renovar sesiones — tokens que nunca expiran son un riesgo si son robados.',
    'Confundir authentication con authorization — el primero verifica identidad, el segundo verifica permisos.',
  ],
  cheatSheet: [
    '`proxy.ts` reemplaza a middleware.ts en Next.js 16 — intercepta requests antes de llegar a rutas',
    'Matcher: `/((?!_next/static|_next/image|favicon.ico).*)` excluye assets estáticos',
    'Cookies de sesión: `httpOnly: true, secure: true, sameSite: "lax"`',
    'Variables sin `NEXT_PUBLIC_` = solo servidor. Con prefijo = expuestas al cliente',
    'CSP nonce: generar uno nuevo por request, pasar a scripts permitidos',
    'CSRF: verificar header `Origin` o usar tokens en formularios',
    'React escapa strings por defecto — XSS solo si usas `dangerouslySetInnerHTML`',
    '`experimental_taintObjectReference` marca objetos como no-transferibles al cliente',
    'Authorization siempre en el servidor: proxy.ts + Server Component + capa de datos',
    'Sesiones: encriptar con `jose`, expirar con `setExpirationTime`, renovar antes de vencer',
  ],
  flashcards: [
    {
      id: 'next-sec-fc-1',
      front: '¿Qué archivo reemplaza a middleware.ts en Next.js 16 y cuál es su función principal?',
      back: '`proxy.ts` reemplaza a middleware.ts. Intercepta cada request entrante antes de que llegue a las rutas de la aplicación, permitiendo redirecciones, rewrites y verificación de autenticación.',
      usesAnalogy: true,
    },
    {
      id: 'next-sec-fc-2',
      front: '¿Qué hace el matcher en proxy.ts y por qué es importante?',
      back: 'El matcher define qué rutas pasan por el proxy. Es importante porque evita procesar innecesariamente assets estáticos (_next/static, imágenes, favicon), mejorando el rendimiento.',
    },
    {
      id: 'next-sec-fc-3',
      front: '¿Cuál es la diferencia entre authentication y authorization?',
      back: 'Authentication = verificar QUIÉN eres (identidad). Authorization = verificar QUÉ puedes hacer (permisos). Primero te autenticas, luego se verifica tu autorización para cada recurso.',
      usesAnalogy: true,
    },
    {
      id: 'next-sec-fc-4',
      front: '¿Por qué las cookies de sesión deben ser httpOnly y qué pasa si no lo son?',
      back: '`httpOnly: true` impide que JavaScript del cliente lea la cookie, protegiéndola de ataques XSS. Sin este flag, un script malicioso inyectado puede robar el token de sesión.',
    },
    {
      id: 'next-sec-fc-5',
      front: '¿Qué diferencia hay entre una variable de entorno con y sin el prefijo NEXT_PUBLIC_?',
      back: 'Con `NEXT_PUBLIC_`: se incluye en el bundle del cliente (visible para todos). Sin prefijo: solo existe en el servidor, nunca llega al navegador. API keys y secretos NUNCA deben tener el prefijo.',
    },
    {
      id: 'next-sec-fc-6',
      front: '¿Qué es CSP (Content Security Policy) y cómo previene ataques?',
      back: 'CSP es una cabecera HTTP que declara qué fuentes de contenido son legítimas (scripts, estilos, imágenes). El navegador bloquea cualquier recurso que no coincida con la política, previniendo inyección de scripts maliciosos (XSS).',
    },
    {
      id: 'next-sec-fc-7',
      front: '¿Qué hace experimental_taintObjectReference y cuándo usarlo?',
      back: 'Marca un objeto como "contaminado" — si accidentalmente lo pasas a un Client Component, React lanza un error en lugar de exponerlo. Útil para credenciales de BD, tokens internos, o cualquier dato que jamás debe llegar al cliente.',
    },
    {
      id: 'next-sec-fc-8',
      front: '¿Cómo protege React contra XSS por defecto y cuándo se pierde esa protección?',
      back: 'React escapa automáticamente todos los strings renderizados en JSX, convirtiendo `<script>` en texto inofensivo. Se pierde al usar `dangerouslySetInnerHTML`, que renderiza HTML sin escapar.',
    },
    {
      id: 'next-sec-fc-9',
      front: '¿Qué es un ataque CSRF y cómo se previene en Next.js?',
      back: 'CSRF: un sitio malicioso envía requests a tu app aprovechando la cookie de sesión del usuario. Se previene con: tokens CSRF en formularios, verificar el header Origin, y cookies con `sameSite: "lax"` o `"strict"`.',
    },
  ],
  quiz: [
    {
      id: 'next-sec-q-1',
      question: 'En la analogía del edificio corporativo, ¿qué representa el guardia que verifica credenciales en la entrada?',
      options: [
        { id: 'a', text: 'El archivo layout.tsx que envuelve todas las páginas' },
        { id: 'b', text: 'El archivo proxy.ts que intercepta requests antes de llegar a las rutas' },
        { id: 'c', text: 'El archivo page.tsx que renderiza el contenido' },
        { id: 'd', text: 'El archivo next.config.ts que configura el proyecto' },
      ],
      correctOptionId: 'b',
      explanation: 'proxy.ts actúa como el guardia en la entrada: intercepta cada request antes de que llegue a la aplicación, verificando credenciales y decidiendo si permitir el acceso o redirigir.',
      whyOthersAreWrong: {
        a: 'layout.tsx estructura la UI pero no intercepta ni valida requests entrantes.',
        c: 'page.tsx renderiza contenido después de que el request ya fue admitido.',
        d: 'next.config.ts configura el build y el comportamiento del framework, no intercepta requests en runtime.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-sec-q-2',
      question: '¿Cuál es la configuración correcta para una cookie de sesión segura en Next.js?',
      options: [
        { id: 'a', text: 'httpOnly: false, secure: true, sameSite: "none"' },
        { id: 'b', text: 'httpOnly: true, secure: false, sameSite: "lax"' },
        { id: 'c', text: 'httpOnly: true, secure: true, sameSite: "lax"' },
        { id: 'd', text: 'httpOnly: true, secure: true, sameSite: "none"' },
      ],
      correctOptionId: 'c',
      explanation: 'httpOnly previene acceso desde JavaScript (protege contra XSS), secure asegura transmisión solo por HTTPS, y sameSite "lax" protege contra CSRF permitiendo navegación normal.',
      whyOthersAreWrong: {
        a: 'httpOnly: false permite que scripts maliciosos lean la cookie, anulando la protección contra XSS.',
        b: 'secure: false permite transmitir la cookie por HTTP sin encriptar, vulnerable a interceptación.',
        d: 'sameSite: "none" permite envío cross-site, eliminando la protección contra CSRF.',
      },
    },
    {
      id: 'next-sec-q-3',
      question: '¿Qué sucede si una variable de entorno NO tiene el prefijo NEXT_PUBLIC_?',
      options: [
        { id: 'a', text: 'Está disponible tanto en el servidor como en el cliente' },
        { id: 'b', text: 'Solo está disponible en el servidor, nunca se incluye en el bundle del cliente' },
        { id: 'c', text: 'Causa un error de compilación' },
        { id: 'd', text: 'Se incluye en el bundle pero encriptada' },
      ],
      correctOptionId: 'b',
      explanation: 'Sin NEXT_PUBLIC_, la variable solo existe en el entorno del servidor (Server Components, Route Handlers, proxy.ts). Next.js nunca la incluye en el bundle JavaScript del cliente.',
      whyOthersAreWrong: {
        a: 'Solo las variables con NEXT_PUBLIC_ están disponibles en ambos entornos.',
        c: 'No causa error, simplemente no está accesible desde Client Components.',
        d: 'Next.js no encripta variables — las excluye completamente del bundle del cliente.',
      },
    },
    {
      id: 'next-sec-q-4',
      question: '¿Por qué la authorization debe verificarse en el servidor y no solo en el cliente?',
      options: [
        { id: 'a', text: 'Porque el cliente es más lento que el servidor' },
        { id: 'b', text: 'Porque el usuario puede modificar el JavaScript del cliente y saltarse las verificaciones' },
        { id: 'c', text: 'Porque los Client Components no soportan condicionales' },
        { id: 'd', text: 'Porque las cookies solo se pueden leer en el servidor' },
      ],
      correctOptionId: 'b',
      explanation: 'El código del cliente se ejecuta en el navegador del usuario, donde puede ser inspeccionado y modificado. Un atacante puede desactivar verificaciones de UI. El servidor es el único entorno que el usuario no puede manipular.',
      whyOthersAreWrong: {
        a: 'La velocidad no es el motivo; es la seguridad. Un check rápido en el cliente sigue siendo inseguro.',
        c: 'Los Client Components sí soportan condicionales, pero no son confiables para seguridad.',
        d: 'Las cookies se envían automáticamente con cada request, pero sí pueden leerse en el cliente si no son httpOnly.',
      },
    },
    {
      id: 'next-sec-q-5',
      question: '¿Qué hace experimental_taintObjectReference en React/Next.js?',
      options: [
        { id: 'a', text: 'Encripta el objeto antes de enviarlo al cliente' },
        { id: 'b', text: 'Marca el objeto como no-transferible al cliente, lanzando error si se intenta' },
        { id: 'c', text: 'Elimina propiedades sensibles del objeto automáticamente' },
        { id: 'd', text: 'Convierte el objeto en un string seguro para serialización' },
      ],
      correctOptionId: 'b',
      explanation: 'taintObjectReference marca un objeto con un "sello confidencial". Si accidentalmente lo pasas como prop a un Client Component, React lanza un error en desarrollo en vez de exponerlo silenciosamente.',
      whyOthersAreWrong: {
        a: 'No encripta nada — simplemente impide la transferencia con un error explícito.',
        c: 'No modifica el objeto ni elimina propiedades; lo marca como intransferible completamente.',
        d: 'No serializa el objeto; lo contrario — impide que sea serializado hacia el cliente.',
      },
      usesAnalogy: true,
    },
    {
      id: 'next-sec-q-6',
      question: '¿Cuál es el propósito del nonce en una política CSP?',
      options: [
        { id: 'a', text: 'Encriptar los scripts antes de enviarlos al navegador' },
        { id: 'b', text: 'Permitir scripts inline específicos sin usar "unsafe-inline" genérico' },
        { id: 'c', text: 'Generar un hash único para cachear la política CSP' },
        { id: 'd', text: 'Autenticar al usuario que solicita los scripts' },
      ],
      correctOptionId: 'b',
      explanation: 'Un nonce es un valor aleatorio generado por request. Solo los scripts que incluyen ese nonce exacto se ejecutan. Esto permite scripts inline legítimos sin abrir la puerta a scripts inyectados (que no conocen el nonce).',
      whyOthersAreWrong: {
        a: 'El nonce no encripta nada — solo actúa como un "permiso" para scripts específicos.',
        c: 'El nonce cambia en cada request precisamente para que no sea predecible ni cacheable.',
        d: 'El nonce no tiene relación con la autenticación de usuarios — es para autorizar scripts.',
      },
    },
    {
      id: 'next-sec-q-7',
      question: '¿Qué protección ofrece React contra XSS por defecto y cuándo se pierde?',
      options: [
        { id: 'a', text: 'Bloquea todas las peticiones HTTP externas; se pierde al usar fetch()' },
        { id: 'b', text: 'Escapa automáticamente strings en JSX; se pierde al usar dangerouslySetInnerHTML' },
        { id: 'c', text: 'Encripta el DOM; se pierde al usar useRef' },
        { id: 'd', text: 'Valida todos los props con TypeScript; se pierde al usar JavaScript plano' },
      ],
      correctOptionId: 'b',
      explanation: 'React escapa caracteres especiales (<, >, &, etc.) en todo contenido renderizado vía JSX, convirtiendo scripts en texto inofensivo. dangerouslySetInnerHTML desactiva este escape, renderizando HTML crudo.',
      whyOthersAreWrong: {
        a: 'React no bloquea peticiones HTTP — eso es tarea de CSP o CORS, no del framework de UI.',
        c: 'React no encripta el DOM ni useRef tiene relación con XSS.',
        d: 'TypeScript es validación en tiempo de compilación, no una protección de runtime contra XSS.',
      },
    },
    {
      id: 'next-sec-q-8',
      question: 'En el contexto de la analogía del edificio, ¿qué representan las llaves maestras guardadas en la caja fuerte?',
      options: [
        { id: 'a', text: 'Las variables de entorno con prefijo NEXT_PUBLIC_' },
        { id: 'b', text: 'Los componentes de React marcados como "use client"' },
        { id: 'c', text: 'Las variables de entorno del servidor (sin NEXT_PUBLIC_)' },
        { id: 'd', text: 'Los archivos estáticos en la carpeta public/' },
      ],
      correctOptionId: 'c',
      explanation: 'Las llaves maestras (API keys, DB passwords) se guardan en la caja fuerte (servidor) y nunca se entregan a los visitantes (cliente). Las variables sin NEXT_PUBLIC_ solo existen en el servidor.',
      whyOthersAreWrong: {
        a: 'NEXT_PUBLIC_ es lo opuesto — son como los gafetes de visitante, información pública expuesta al cliente.',
        b: 'Los Client Components son código de UI, no secretos. No representan llaves maestras.',
        d: 'Los archivos en public/ son accesibles por cualquier visitante, no son secretos.',
      },
      usesAnalogy: true,
    },
  ],
  difficulty: 'avanzado',
  estimatedMinutes: 30,
  tags: ['security', 'auth', 'proxy', 'middleware', 'CSP', 'CSRF', 'XSS', 'sessions', 'next.js 16'],
};
