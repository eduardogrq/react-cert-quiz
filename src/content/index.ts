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

/** All topics across all courses */
export const topics: Topic[] = [
  // React Level 1
  javascriptEs6Topic,
  coreConceptsTopic,
  jsxTopic,
  componentsTopic,
  eventHandlingTopic,
  stateTopic,
  hooksTopic,
  reactRouterTopic,
  // React Level 2
  toolingTopic,
  intermediateComponentsTopic,
  intermediateStateTopic,
  intermediateHooksTopic,
  typescriptReactTopic,
];

/** Get topics filtered by courseId */
export function getTopicsByCourse(courseId: string): Topic[] {
  return topics.filter((t) => t.courseId === courseId);
}

/** Find a single topic by ID */
export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

/** Get all topic IDs */
export function getTopicIds(): string[] {
  return topics.map((t) => t.id);
}

/** Get topic IDs for a specific course */
export function getTopicIdsByCourse(courseId: string): string[] {
  return topics.filter((t) => t.courseId === courseId).map((t) => t.id);
}
