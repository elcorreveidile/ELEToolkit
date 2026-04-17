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
- Comprender y ${params.type === 'conversation' ? 'participar' : 'producir'} textos según criterios orientativos MCER ${params.level}
- Usar estructuras y vocabulario apropiados para nivel ${params.level}
- Desarrollar competencias comunicativas reales según MCER

⚙️ ESPECIFICACIONES (E):
- CRITERIOS ORIENTATIVOS MCER ${params.level}: ${getMCERCriteria(params.level)}
- Variedad: Español peninsular estándar
- Registro: Adecuado al nivel y contexto
- Enfoque: Comunicativo, no gramatical
- Cultural: Referencias hispanas apropiadas

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
- Comprender el texto según criterios orientativos MCER ${params.targetLevel}
- Acceder a contenido de interés adaptado a su nivel competencial
- Progresar sin frustración ni aburrimiento (principio i+1)
- Desarrollar estrategias de compensación progresivas

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
- CRITERIOS ORIENTATIVOS MCER:
  • Textos muy breves: 30-80 palabras
  • Frases simples y cortas
  • Tiempo verbal: Presente de indicativo
  • Competencia: Hacerse entender en frases básicas
  • Registro: Informal y simple
  • COMUNICACIÓN: Supervivencia inmediata
`,
    A2: `
- CRITERIOS ORIENTATIVOS MCER:
  • Textos breves: 80-150 palabras
  • Presente + pasado básico (pretérito indefinido)
  • Inicio de cohesión básica
  • Competencia: Narrar situaciones simples
  • Registro: Informal
  • COMUNICACIÓN: Intercambio información básica
`,
    B1: `
- CRITERIOS ORIENTATIVOS MCER:
  • Textos medios: 150-250 palabras
  • Narración + contraste de tiempos (pretérito/imperfecto)
  • Coherencia textual básica
  • Competencia: Relatar experiencias y opiniones
  • Registro: Informal y semi-formal
  • COMUNICACIÓN: Narración personal y expresar opiniones
`,
    B2: `
- CRITERIOS ORIENTATIVOS MCER:
  • Textos desarrollados: 250-350 palabras
  • Variedad de tiempos verbales + inicio subjuntivo
  • Organización discursiva clara
  • Competencia: Argumentar y debatir
  • Registro: Variable según contexto
  • COMUNICACIÓN: Argumentación y debate sobre temas concretos
`,
    C1: `
- CRITERIOS ORIENTATIVOS MCER:
  • Textos extensos: 350-500 palabras
  • Estructuras complejas + matices expresivos
  • Precisión léxica y gramatical
  • Competencia: Abstraer y formular hipótesis
  • Registro: Variable con control
  • COMUNICACIÓN: Abstracción, hipótesis y matización
`,
    C2: `
- CRITERIOS ORIENTATIVOS MCER:
  • Textos muy extensos: 500+ palabras
  • Alta precisión + estilo y control discursivo
  • Dominio de matices y registros
  • Competencia: Precisión, ironía, estilo
  • Registro: Cualquier registro con maestría
  • COMUNICACIÓN: Control discursivo total y naturalidad
`,
  };
  return criteria[level];
}

export type SpanishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// FUNCIONES AUXILIARES PARA SISTEMA FRAME

function getMCERCriteria(level: SpanishLevel): string {
  const criteria = {
    A1: 'Textos muy breves (30-80 palabras), frases simples, presente',
    A2: 'Textos breves (80-150 palabras), presente + pasado básico',
    B1: 'Textos medios (150-250 palabras), narración y contraste de tiempos',
    B2: 'Textos desarrollados (250-350 palabras), variedad de tiempos + inicio de subjuntivo',
    C1: 'Textos extensos (350-500 palabras), estructuras complejas, matices',
    C2: 'Textos muy extensos (500+ palabras), alta precisión, estilo y control discursivo',
  };
  return criteria[level];
}
