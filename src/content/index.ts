import type { Topic } from './types';
import { javascriptEs6Topic } from './topics/javascript-es6';
import { coreConceptsTopic } from './topics/core-concepts';
import { jsxTopic } from './topics/jsx';
import { componentsTopic } from './topics/components';
import { eventHandlingTopic } from './topics/event-handling';
import { stateTopic } from './topics/state';
import { hooksTopic } from './topics/hooks';
import { reactRouterTopic } from './topics/react-router';

/** Registry central de todos los temas — agregar aquí cada tema nuevo */
export const topics: Topic[] = [
  javascriptEs6Topic,
  coreConceptsTopic,
  jsxTopic,
  componentsTopic,
  eventHandlingTopic,
  stateTopic,
  hooksTopic,
  reactRouterTopic,
];

/** Buscar tema por ID */
export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

/** Obtener todos los IDs de temas */
export function getTopicIds(): string[] {
  return topics.map((t) => t.id);
}
