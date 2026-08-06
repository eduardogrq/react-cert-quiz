import type { Topic } from './types';
import { javascriptEs6Topic } from './topics/javascript-es6';
import { coreConceptsTopic } from './topics/core-concepts';
import { toolingTopic } from './topics/tooling';
import { jsxTopic } from './topics/jsx';
import { componentsTopic } from './topics/components';
import { intermediateComponentsTopic } from './topics/intermediate-components';
import { eventHandlingTopic } from './topics/event-handling';
import { stateTopic } from './topics/state';
import { intermediateStateTopic } from './topics/intermediate-state';
import { hooksTopic } from './topics/hooks';
import { intermediateHooksTopic } from './topics/intermediate-hooks';
import { reactRouterTopic } from './topics/react-router';
import { typescriptReactTopic } from './topics/typescript-react';

/** Registry central de todos los temas — agregar aquí cada tema nuevo */
export const topics: Topic[] = [
  // Level 1 & 2 shared foundations
  javascriptEs6Topic,
  coreConceptsTopic,
  toolingTopic,
  jsxTopic,
  componentsTopic,
  intermediateComponentsTopic,
  eventHandlingTopic,
  stateTopic,
  intermediateStateTopic,
  hooksTopic,
  intermediateHooksTopic,
  reactRouterTopic,
  typescriptReactTopic,
];

/** Buscar tema por ID */
export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

/** Obtener todos los IDs de temas */
export function getTopicIds(): string[] {
  return topics.map((t) => t.id);
}
