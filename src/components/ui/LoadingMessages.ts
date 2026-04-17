import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LoadingMessagesProps {
  type: 'generador' | 'simulador' | 'adaptador';
}

const MESSAGES: Record<string, string[]> = {
  generador: [
    "🤖 Pensando ejercicios brillantes...",
    "📚 Consultando con profesores de ELE...",
    "✍️ Creando tu ejercicio personalizado...",
    "🎯 Ajustando dificultad a tu nivel...",
    "📝 Revisando gramática española...",
    "💡 ¡Casi listo! Preparando el ejercicio...",
  ],
  simulador: [
    "💭 Entrando en personaje...",
    "🗣️ Preparando respuesta natural...",
    "🤔 Pensando qué decir...",
    "😊 Poniéndome casual...",
    "💬 Listo para conversar...",
  ],
  adaptador: [
    "🔍 Analizando el texto original...",
    "📖 Identificando vocabulario complejo...",
    "🎚️ Ajustando nivel de dificultad...",
    "✨ Simplificando gramática...",
    "📝 Manteniendo la estructura original...",
    "🎯 ¡Adaptación casi lista!",
  ],
};

const CHISTES = [
  "¿Sabes qué le dijo un verbo a un adjetivo? ¡No me complementes!",
  "¿Por qué la RAE está triste? Porque perdió sus 'eres'...",
  "🤖 IA no = Inteligencia Artificial, sino 'Intentando Aprender'",
  "⏳ Esto tarda más que aprender los verbos irregulares...",
  "📚 Mientras espero, estoy practicando el subjuntivo...",
];

export function LoadingMessages({ type }: LoadingMessagesProps) {
  const randomMessage = MESSAGES[type][Math.floor(Math.random() * MESSAGES[type].length)];
  const randomChiste = CHISTES[Math.floor(Math.random() * CHISTES.length)];

  return (
    <View style={styles.container}>
      <Text style={styles.mainMessage}>{randomMessage}</Text>
      <Text style={styles.chiste}>{randomChiste}</Text>
      <Text style={styles.loadingIndicator}>⏳</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainMessage: {
    fontSize: 16,
    color: '#4F46E5',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
  chiste: {
    fontSize: 12,
    color: '#10B981',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  loadingIndicator: {
    fontSize: 24,
    textAlign: 'center',
  },
});
