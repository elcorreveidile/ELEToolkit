export type SpanishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ExerciseType = 'grammar' | 'vocabulary' | 'conversation' | 'reading';

export type MaterialType = 'generador' | 'simulador' | 'adaptador';

export interface Exercise {
  id: string;
  title: string;
  level: SpanishLevel;
  type: ExerciseType;
  topic: string;
  content: string;
  instructions: string;
  createdAt: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConversationSession {
  id: string;
  level: SpanishLevel;
  topic: string;
  context: string;
  messages: ConversationMessage[];
  createdAt: string;
}

export interface TextAdaptation {
  originalText: string;
  adaptedText: string;
  targetLevel: SpanishLevel;
  changes: string[];
  createdAt: string;
}

export interface AppError {
  message: string;
  code?: string;
}
