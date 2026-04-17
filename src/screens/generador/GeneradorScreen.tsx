import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SPANISH_LEVELS, EXERCISE_TYPES, COMMON_TOPICS } from '../../constants';
import { openaiService } from '../../lib/openai/client';
import { useMaterials } from '../../hooks/useMaterials';
import { SpanishLevel, ExerciseType } from '../../types';

export const GeneradorScreen = () => {
  const [level, setLevel] = useState<SpanishLevel>('A1');
  const [type, setType] = useState<ExerciseType>('grammar');
  const [topic, setTopic] = useState('');
  const [focus, setFocus] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const { saveMaterial } = useMaterials();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      Alert.alert('Error', 'Por favor ingresa un tema');
      return;
    }

    setLoading(true);
    try {
      const content = await openaiService.generateExercise({
        level,
        type,
        topic,
        focus: focus || undefined,
      });

      setGeneratedContent(content);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el ejercicio');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;

    try {
      await saveMaterial({
        title: `${type} - ${topic} (${level})`,
        content: generatedContent,
        type: 'generador',
      });
      Alert.alert('Éxito', 'Material guardado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el material');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Generador de Ejercicios</Text>

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
        <Text style={styles.label}>Tipo de Ejercicio</Text>
        {EXERCISE_TYPES.map((t) => (
          <Button
            key={t.value}
            title={t.label}
            onPress={() => setType(t.value)}
            variant={type === t.value ? 'primary' : 'outline'}
            size="small"
            style={styles.optionButton}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Tema</Text>
        <Input
          value={topic}
          onChangeText={setTopic}
          placeholder="Ej: Presente de indicativo, Ser vs Estar..."
        />
        <View style={styles.suggestions}>
          {COMMON_TOPICS.map((t) => (
            <Button
              key={t}
              title={t}
              onPress={() => setTopic(t)}
              variant="outline"
              size="small"
              style={styles.suggestionButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Enfoque Específico (opcional)</Text>
        <Input
          value={focus}
          onChangeText={setFocus}
          placeholder="Ej: Verbos irregulares, Pronombres..."
        />
      </View>

      <Button
        title={loading ? 'Generando...' : 'Generar Ejercicio'}
        onPress={handleGenerate}
        disabled={loading}
        loading={loading}
        style={styles.generateButton}
      />

      {generatedContent ? (
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>Ejercicio Generado</Text>
          <Text style={styles.resultContent}>{generatedContent}</Text>
          <Button
            title="Guardar Material"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
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
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  suggestionButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  generateButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  resultSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  resultContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});
