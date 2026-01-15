/**
 * Types for the lesson system in Exploring Leo
 */

export type LessonType = 'explanation' | 'exercise';

export type ValidationType = 'output-match' | 'compiles' | 'contains' | 'none';

export interface Lesson {
  /** Unique identifier (slug) used in URLs */
  id: string;
  /** Human-readable title */
  title: string;
  /** Module this lesson belongs to */
  module: string;
  /** Position within the module (1-based) */
  order: number;
  /** Type of lesson */
  type: LessonType;
  /** Markdown content for the explanation */
  content: string;
  /** Initial Leo code shown in the editor */
  starterCode: string;
  /** Expected solution (for exercises) */
  solutionCode?: string;
  /** Progressive hints */
  hints?: string[];
  /** How to validate the solution */
  validationType: ValidationType;
  /** Expected output for output-match validation */
  expectedOutput?: string;
}

export interface Module {
  /** Unique identifier for the module */
  id: string;
  /** Display name */
  title: string;
  /** Brief description */
  description: string;
  /** Position in the curriculum */
  order: number;
  /** Lessons in this module */
  lessons: Lesson[];
}

export interface LessonManifest {
  modules: Module[];
}
