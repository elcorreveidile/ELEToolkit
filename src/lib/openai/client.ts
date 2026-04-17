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
    const systemPrompt = `Eres un experto profesor de ELE (Español como Lengua Extranjera).
Genera ejercicios adecuados para el nivel ${params.level} sobre el tema "${params.topic}".`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Genera un ejercicio de ${params.type}${params.focus ? ' enfocado en ' + params.focus : ''}.` },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || '';
  },

  async simulateConversation(params: SimulateConversationParams): Promise<string> {
    const systemPrompt = `Eres un hablante nativo de español conversando con un estudiante de nivel ${params.level}.
Contexto: ${params.context}.
Responde de forma natural pero adaptada al nivel del estudiante. Si comete errores, corrígelos amablemente.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...params.messages.map(m => ({ role: m.role, content: m.content })),
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.8,
    });

    return completion.choices[0].message.content || '';
  },

  async adaptText(params: AdaptTextParams): Promise<{ adaptedText: string; changes: string[] }> {
    const systemPrompt = `Eres un experto en adaptación de textos para estudiantes de español.
Adapta el texto al nivel ${params.targetLevel}.
Simplifica gramática: ${params.simplifyGrammar}
Simplifica vocabulario: ${params.simplifyVocabulary}
Mantén estructura: ${params.keepStructure}

Responde en formato JSON:
{
  "adaptedText": "texto adaptado",
  "changes": ["lista de cambios realizados"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: params.sourceText },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return response;
  },
};
