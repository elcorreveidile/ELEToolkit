import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SPANISH_LEVELS, CONVERSATION_CONTEXTS } from '../../constants';
import { openaiService } from '../../lib/openai/client';
import { useMaterials } from '../../hooks/useMaterials';
import { SpanishLevel } from '../../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const SimuladorScreen = () => {
  const [level, setLevel] = useState<SpanishLevel>('A1');
  const [context, setContext] = useState('');
  const [topic, setTopic] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { saveMaterial } = useMaterials();

  const startConversation = () => {
    if (!topic.trim() || !context.trim()) {
      Alert.alert('Error', 'Por favor completa el tema y el contexto');
      return;
    }
    setIsStarted(true);
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setUserMessage('');
    setLoading(true);

    try {
      const response = await openaiService.simulateConversation({
        level,
        topic,
        context,
        messages: updatedMessages,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el mensaje');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (messages.length === 0) return;

    const content = messages
      .map(m => `${m.role === 'user' ? 'Tú' : 'IA'}: ${m.content}`)
      .join('\n\n');

    try {
      await saveMaterial({
        title: `Conversación: ${topic} (${level})`,
        content,
        type: 'simulador',
      });
      Alert.alert('Éxito', 'Conversación guardada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la conversación');
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setIsStarted(false);
    setTopic('');
    setContext('');
  };

  if (!isStarted) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Simulador de Conversación</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Nivel</Text>
          {SPANISH_LEVELS.map((lvl) => (
            <Button
              key={lvl.value}
              title={lvl.label}
              onPress={() => setLevel(lvl.value)}
              variant={level === lvl.value ? 'primary' : 'outline'}
              size="small"
              style={styles.optionButton}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tema de Conversación</Text>
          <Input
            value={topic}
            onChangeText={setTopic}
            placeholder="Ej: Ordenar en un restaurante, Pedir direcciones..."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Contexto</Text>
          {CONVERSATION_CONTEXTS.map((ctx) => (
            <Button
              key={ctx}
              title={ctx}
              onPress={() => setContext(ctx)}
              variant={context === ctx ? 'primary' : 'outline'}
              size="small"
              style={styles.optionButton}
            />
          ))}
          <Input
            value={context}
            onChangeText={setContext}
            placeholder="O define tu propio contexto..."
            style={styles.customContext}
          />
        </View>

        <Button
          title="Iniciar Conversación"
          onPress={startConversation}
          style={styles.startButton}
        />
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{topic}</Text>
        <Text style={styles.headerSubtitle}>{context} • Nivel {level}</Text>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text style={[
              styles.messageText,
              message.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
            ]}>
              {message.content}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.messageBubble, styles.assistantMessage]}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4F46E5" />
              <Text style={styles.loadingText}>💬 Escribiendo...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <Input
          value={userMessage}
          onChangeText={setUserMessage}
          placeholder="Escribe tu mensaje..."
          style={styles.input}
        />
        <Button
          title="Enviar"
          onPress={sendMessage}
          disabled={loading || !userMessage.trim()}
          style={styles.sendButton}
        />
      </View>

      <View style={styles.actionsContainer}>
        <Button
          title="Guardar Conversación"
          onPress={handleSave}
          variant="outline"
          size="small"
          style={styles.actionButton}
        />
        <Button
          title="Nueva Conversación"
          onPress={resetConversation}
          variant="secondary"
          size="small"
          style={styles.actionButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    padding: 16,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  optionButton: {
    marginBottom: 8,
    marginRight: 8,
  },
  customContext: {
    marginTop: 8,
  },
  startButton: {
    margin: 16,
    marginBottom: 32,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: '#4F46E5',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#111827',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    minHeight: 44,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#4F46E5',
  },
});
