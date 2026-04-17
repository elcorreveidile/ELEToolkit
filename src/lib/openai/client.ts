import OpenAI from 'openai';

const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

export const openai = new OpenAI({
  apiKey: openaiKey,
  dangerouslyAllowBrowser: true, // Solo para desarrollo - en prod usar un backend
});

export interface GenerateExerciseParams {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  topic: string;
  type: 'grammar' | 'vocabulary' | 'conversation' | 'reading';
  focus?: string;
}

export interface SimulateConversationParams {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  topic: string;
  context: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AdaptTextParams {
  sourceText: string;
  targetLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  simplifyGrammar: boolean;
  simplifyVocabulary: boolean;
  keepStructure: boolean;
}

export const openaiService = {
  async generateExercise(params: GenerateExerciseParams): Promise<string> {
    // SISTEMA FRAME PARA GENERACIÓN DE EJERCICIOS ELE
    const framePrompt = `
SISTEMA FRAME - Generación de Materiales ELE

📝 FORMATO (F):
- Tipo de material: Ejercicio de ${params.type}
- Estructura: Instrucciones en español + texto/ejercicio + clave de respuestas
- Extensión: 150-250 palabras según nivel

🎭 ROL (R):
Eres profesor experto de ELE (Español como Lengua Extranjera) especializado en:
- Metodología comunicativa y enfoque por tareas
- Nivel MCER: ${params.level}
- Currículo Instituto Cervantes y DELE
- Gramática pedagógica explicada de forma clara

👥 AUDIENCIA (A):
- Nivel MCER: ${params.level}
- Edad: Adultos (18+ años)
- Contexto: Aprendizaje de español para fines específicos
- Conocimientos previos: Adecuados al nivel ${params.level}
- Objetivo: Mejorar competencia en ${params.type}

🎯 META (M):
Que el estudiante sea capaz de:
- Practicar y consolidar ${params.topic} a nivel ${params.level}
- Aplicar estructuras gramaticales en contextos comunicativos
- Desarrollar fluidez y precisión en ${params.type}

⚙️ ESPECIFICACIONES (E):
- Nivel: ${params.level} estricto (no usar vocabulario/estructuras de otros niveles)
- Variedad: Español peninsular estándar
- Registro: Adecuado al nivel (informal/formal según contexto)
- Longitud: Texto de 100-150 palabras + ejercicio
- Ejercicio: 5-10 items según tipo
- Respuestas: Incluir clave completa
- Cultural: Incluir referencias culturales hispanas apropiadas

📋 EJEMPLO (E):
Genera un ejercicio sobre ${params.topic} con esta estructura:

TÍTULO: [Título claro y atractivo]
NIVEL: ${params.level}
OBJETIVO: [Qué va a aprender el estudiante]

INSTRUCCIONES: [Instrucciones claras en español]

[TEXTO/MATERIAL]: [Texto según tipo de ejercicio]

EJERCICIO: [El ejercicio con items claramente numerados]

SOLUCIONES: [Clave de respuestas completa]

NOTAS CULTURALES: [Una nota cultural relevante]
`.trim();

    const userPrompt = `
Genera un ejercicio de ${params.type} sobre el tema "${params.topic}" para nivel ${params.level}${params.focus ? ` enfocado específicamente en: ${params.focus}` : ''}.
`.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: framePrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  },

  async simulateConversation(params: SimulateConversationParams): Promise<string> {
    // SISTEMA FRAME PARA SIMULACIÓN DE CONVERSACIÓN ELE
    const framePrompt = `
SISTEMA FRAME - Simulación de Conversación ELE

📝 FORMATO (F):
- Tipo: Conversación informal/semi-formal según contexto
- Extensión: Respuestas breves (1-2 oraciones, máximo 30 palabras)
- Estilo: Natural y conversacional, nunca robótico ni académico

🎭 ROL (R):
Eres ${getRoleForConversation(params.level)} ${getContextDescription(params.context)}

Características:
- Amigable y accesible, usa "tú" nunca "usted"
- Expresiones coloquiales PENINSULARES ESPAÑOLAS apropiadas para nivel ${params.level}
- Correcciones sutilis cuando haya errores
- Natural y espontáneo, nunca sonar como profesor/a
- Usa emojis de vez en cuando (😊 🤔 ¡!) para naturalidad

👥 AUDIENCIA (A):
- Estudiante de español nivel ${params.level}
- Edad: Adulto (18+ años)
- Contexto: ${params.context}
- Objetivo comunicativo: ${getCommunicativeObjective(params.level)}
- Registro: Informal/semi-formal según contexto

🎯 META (M):
Que el estudiante practique español natural en contexto real:
- Desarrollar fluidez en ${params.topic}
- Usar ${params.level} grammar naturalmente
- Ganar confianza comunicativa
- Recibir feedback sutil cuando cometa errores

⚙️ ESPECIFICACIONES (E):
- Nivel ${params.level} estricto en vocabulario y estructuras
- Variedad peninsular española ( España)
- Respuestas muy breves: 1-2 oraciones máximo
- Correcciones: "Lo correcto sería..." no "Estás mal"
- Preguntas de seguimiento: Mantener conversación fluida
- Naturalidad: Evitar repeticiones, ser espontáneo
- Emojis: Uso moderado y natural (😊 🤔 ¡! etc.)

📋 EJEMPLOS (E):
${getConversationExamples(params.level)}

CONTEXTO ACTUAL:
Tema: ${params.topic}
Contexto: ${params.context}
Nivel: ${params.level}
`.trim();

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: framePrompt },
      ...params.messages.map(m => ({ role: m.role, content: m.content })),
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.9, // Más alta para espontaneidad
    });

    return completion.choices[0].message.content || '';
  },

  async adaptText(params: AdaptTextParams): Promise<{ adaptedText: string; changes: string[] }> {
    // SISTEMA FRAME PARA ADAPTACIÓN DE TEXTOS ELE
    const framePrompt = `
SISTEMA FRAME - Adaptación de Textos ELE

📝 FORMATO (F):
- Tipo: Adaptación pedagógica de texto
- Estructura: JSON con texto adaptado + lista de cambios
- Extensión: Mantener longitud original +/- 20%

🎭 ROL (R):
Eres experto en adaptación de materiales ELE y:
- Niveles MCER: ${params.targetLevel}
- Gramática pedagógica: Simplificación progresiva
- Lingüística aplicada: Adecuación de registros
- Didáctica ELE: Mantener coherencia pedagógica

👥 AUDIENCIA (A):
- Estudiante de español nivel ${params.targetLevel}
- Objetivo: Acceder a contenido adaptado a su nivel
- Necesidad: Comprender texto sin frustración excesiva
- Progreso: Desafío apropiado (i+1 principle)

🎯 META (M):
Que el estudiante pueda:
- Comprender el texto con autonomía relativa
- Acceder a contenido de interés adaptado
- Progresar sin frustración ni aburrimiento
- Desarrollar estrategias de compensación

⚙️ ESPECIFICACIONES (E):
- Nivel objetivo: ${params.targetLevel} estricto
- Simplificar gramática: ${params.simplifyGrammar ? 'SÍ' : 'NO'}
- Simplificar vocabulario: ${params.simplifyVocabulary ? 'SÍ' : 'NO'}
- Mantener estructura: ${params.keepStructure ? 'SÍ' : 'NO'}
- Variedad: Español peninsular estándar
- Cambios: Lista detallada y explicada
- Coherencia: Mantener lógica y cohesión

📋 EJEMPLO (E):
Responde en formato JSON:
{
  "adaptedText": "Texto completo adaptado...",
  "changes": [
    "1. Cambio específico realizado",
    "2. Otro cambio con explicación",
    "3. Tercero cambio si aplica"
  ]
}

CRITERIOS DE ADAPTACIÓN ${params.targetLevel}:
${getAdaptationCriteria(params.targetLevel)}
`.trim();

    const userPrompt = `
Adapta este texto al nivel ${params.targetLevel}:

TEXTO ORIGINAL:
${params.sourceText}

Parámetros:
- Simplificar gramática: ${params.simplifyGrammar}
- Simplificar vocabulario: ${params.simplifyVocabulary}
- Mantener estructura: ${params.keepStructure}
`.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: framePrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6, // Moderada para consistencia
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return response;
  },
};

// FUNCIONES AUXILIARES PARA SISTEMA FRAME

function getRoleForConversation(level: SpanishLevel): string {
  const roles = {
    A1: "amigo español paciente y entusiasta que habla con principiantes",
    A2: "conocido español que conversa casualmente",
    B1: "amigo español que mantiene conversaciones naturales",
    B2: "colega español con intereses similares",
    C1: "amigo español que puede debatir temas complejos",
    C2: "interlocutor español sofisticado y culto",
  };
  return roles[level];
}

function getContextDescription(context: string): string {
  const contexts: Record<string, string> = {
    "En una cafetería": "en una cafetería española de Madrid",
    "En el aeropuerto": "en el aeropuerto Barajas de Madrid",
    "En una tienda": "en una tienda comercial en España",
    "En una entrevista de trabajo": "en una entrevista de trabajo en empresa española",
    "En una cena": "en una cena informal con amigos españoles",
    "En el médico": "en una consulta médica en España",
    "En una fiesta": "en una fiesta informal en España",
    "En una reunión de negocios": "en una reunión de trabajo en empresa española",
  };
  return contexts[context] || context;
}

function getCommunicativeObjective(level: SpanishLevel): string {
  const objectives = {
    A1: "Supervivencia básica y frases esenciales",
    A2: "Intercambio de información simple y narración básica",
    B1: "Narración personal y opinión sobre temas familiares",
    B2: "Argumentación y debate sobre temas concretos",
    C1: "Abstracción, hipótesis y matización",
    C2: "Precisión, ironía y registro apropiado",
  };
  return objectives[level];
}

function getConversationExamples(level: SpanishLevel): string {
  const examples = {
    A1: `
ESTUDIANTE: "Hola, me llamo Juan"
IA: "¡Hola Juan! ¡Mucho gusto! 😊 ¿Eres español?"
`,
    A2: `
ESTUDIANTE: "Ayer fui al cine"
IA: "¡Qué bien! ¿Qué película viste? ¿Te gustó?"
`,
    B1: `
ESTUDIANTE: "Creo que la política es importante"
IA: "Totalmente. ¿Y qué temas te interesan más? 😊"
`,
    B2: `
ESTUDIANTE: "La inflación está afectando mucho"
IA: "Sí, es un problema grave. ¿Cómo te impacta a ti personalmente?"
`,
    C1: `
ESTUDIANTE: "La globalización tiene pros y contras"
IA: "Coincido. ¿Qué aspecto te preocupa más exactamente?"
`,
    C2: `
ESTUDIANTE: "El paradigma económico actual es insostenible"
IA: "Interesante perspectiva. ¿Qué modelo alternativo propones?"
`,
  };
  return examples[level] || examples.B1;
}

function getAdaptationCriteria(level: SpanishLevel): string {
  const criteria = {
    A1: `
- VOCABULARIO: Máximo 500-1000 palabras más frecuentes
- GRAMÁTICA: Solo presente indicativo, ser/estar básico
- ESTRUCTURAS: Frases cortas y simples (SVO)
- TIEMPOS VERBALES: Solo presente, infinitivo, gerundio
- CONECTORES: Básicos (y, o, pero, porque)
- REGISTER: Muy informal y simple
- OMITIR: Cualquier tiempo compuesto, subjuntivo, condicionales
`,
    A2: `
- VOCABULARIO: 1000-2000 palabras frecuentes
- GRAMÁTICA: Presente + pretérito indefinido básico
- ESTRUCTURAS: Frases algo más largas, coordinación básica
- TIEMPOS VERBALES: Presente, pretérito indefinido, ir a + inf
- CONECTORES: Básicos + algunos temporales (cuando, luego, antes)
- REGISTER: Informal
- OMITIR: Imperfecto, subjuntivo, condicionales
`,
    B1: `
- VOCABULARIO: 2000-3000 palabras
- GRAMÁTICA: Presente, pretérito, imperfecto, futuros
- ESTRUCTURAS: Subordinación con que/que/donde, contraste tiempos
- TIEMPOS VERBALES: Todos los indicativos, subjuntivo presente básico
- CONECTORES: Amplia variedad de conectores (sin embargo, por eso, ya que)
- REGISTER: Informal y semi-formal
- PUEDE INCLUIR: Subjuntivo de deseo/recomendación
`,
    B2: `
- VOCABULARIO: 3000-4000 palabras
- GRAMÁTICA: Todos los indicativos + subjuntivo completo
- ESTRUCTURAS: Subordinación compleja, relativos
- TIEMPOS VERBALES: Todos, incl. subjuntivo imperfecto
- CONECTORES: Conectores discursivos y argumentativos
- REGISTER: Variable según contexto
- PUEDE INCLUIR: Condicionales, hipotéticos
`,
    C1: `
- VOCABULARIO: 4000-6000 palabras
- GRAMÁTICA: Estructuras complejas, nominalizaciones
- ESTRUCTURAS: Subordinación anidada, estilo compacto
- TIEMPOS VERBALES: Todos, incl. formas compuestas complejas
- CONECTORES: Conectores académicos y especializados
- REGISTER: Variable, desde informal a formal
- PUEDE INCLUIR: Pasiva impersonal, construcciones absolutas
`,
    C2: `
- VOCABULARIO: 6000+ palabras, incl. técnica y especializada
- GRAMÁTICA: Todas las estructuras posibles
- ESTRUCTURAS: Máxima complejidad sintáctica
- TIEMPOS VERBALES: Todos incl. formas literarias
- CONECTORES: Conectores de alta registers, matizadores
- REGISTER: Cualquier registro con precisión estilística
- PUEDE INCLUIR: Ironía, dobles sentidos, registro literario
`,
  };
  return criteria[level];
}

export type SpanishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
