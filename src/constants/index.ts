export const SPANISH_LEVELS = [
  { value: 'A1', label: 'A1 - Principiante' },
  { value: 'A2', label: 'A2 - Elemental' },
  { value: 'B1', label: 'B1 - Intermedio' },
  { value: 'B2', label: 'B2 - Intermedio Alto' },
  { value: 'C1', label: 'C1 - Avanzado' },
  { value: 'C2', label: 'C2 - Maestría' },
] as const;

export const EXERCISE_TYPES = [
  { value: 'grammar', label: 'Gramática' },
  { value: 'vocabulary', label: 'Vocabulario' },
  { value: 'conversation', label: 'Conversación' },
  { value: 'reading', label: 'Comprensión Lectora' },
] as const;

export const MATERIAL_TYPES = [
  { value: 'generador', label: 'Generador' },
  { value: 'simulador', label: 'Simulador' },
  { value: 'adaptador', label: 'Adaptador' },
] as const;

export const COMMON_TOPICS = [
  'Viajes',
  'Comida',
  'Familia',
  'Trabajo',
  'Cultura',
  'Deportes',
  'Tecnología',
  'Naturaleza',
  'Salud',
  'Educación',
] as const;

export const CONVERSATION_CONTEXTS = [
  'En una cafetería',
  'En el aeropuerto',
  'En una tienda',
  'En una entrevista de trabajo',
  'En una cena',
  'En el médico',
  'En una fiesta',
  'En una reunión de negocios',
] as const;
