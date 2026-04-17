import React, { useState } from 'react';
import { Fragment } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, ActivityIndicator } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { SPANISH_LEVELS } from '../../constants';
import { openaiService } from '../../lib/openai/client';
import { useMaterials } from '../../hooks/useMaterials';
import { SpanishLevel } from '../../types';

export const AdaptadorScreen = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetLevel, setTargetLevel] = useState<SpanishLevel>('A1');
  const [simplifyGrammar, setSimplifyGrammar] = useState(true);
  const [simplifyVocabulary, setSimplifyVocabulary] = useState(true);
  const [keepStructure, setKeepStructure] = useState(true);
  const [adaptedResult, setAdaptedResult] = useState<{
    adaptedText: string;
    changes: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const { saveMaterial } = useMaterials();

  const handleAdapt = async () => {
    if (!sourceText.trim()) {
      Alert.alert('Error', 'Por favor ingresa el texto a adaptar');
      return;
    }

    setLoading(true);
    try {
      const result = await openaiService.adaptText({
        sourceText,
        targetLevel,
        simplifyGrammar,
        simplifyVocabulary,
        keepStructure,
      });

      setAdaptedResult(result);
    } catch (error) {
      Alert.alert('Error', 'No se pudo adaptar el texto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!adaptedResult) return;

    const content = `
TEXTO ORIGINAL:
${sourceText}

TEXTO ADAPTADO (Nivel ${targetLevel}):
${adaptedResult.adaptedText}

CAMBIOS REALIZADOS:
${adaptedResult.changes.map(c => `• ${c}`).join('\n')}
    `.trim();

    try {
      await saveMaterial({
        title: `Texto adaptado a nivel ${targetLevel}`,
        content,
        type: 'adaptador',
      });
      Alert.alert('Éxito', 'Material guardado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el material');
    }
  };

  const resetForm = () => {
    setSourceText('');
    setAdaptedResult(null);
    setSimplifyGrammar(true);
    setSimplifyVocabulary(true);
    setKeepStructure(true);
  };

  return (
    <Fragment>
      <ScrollView style={styles.container}>
      <Text style={styles.title}>Adaptador de Textos</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Nivel Destino</Text>
        {SPANISH_LEVELS.map((lvl) => (
          <Button
            key={lvl.value}
            title={lvl.label}
            onPress={() => setTargetLevel(lvl.value)}
            variant={targetLevel === lvl.value ? 'primary' : 'outline'}
            size="small"
            style={styles.optionButton}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Texto Original</Text>
        <Input
          value={sourceText}
          onChangeText={setSourceText}
          placeholder="Pega aquí el texto que quieres adaptar..."
          multiline
          numberOfLines={10}
          style={styles.textInput}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Opciones de Adaptación</Text>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Simplificar Gramática</Text>
          <Switch
            value={simplifyGrammar}
            onValueChange={setSimplifyGrammar}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Simplificar Vocabulario</Text>
          <Switch
            value={simplifyVocabulary}
            onValueChange={setSimplifyVocabulary}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Mantener Estructura</Text>
          <Switch
            value={keepStructure}
            onValueChange={setKeepStructure}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <Button
        title={loading ? 'Adaptando...' : 'Adaptar Texto'}
        onPress={handleAdapt}
        disabled={loading}
        loading={loading}
        style={styles.adaptButton}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>🔄 Adaptando texto...</Text>
          <Text style={styles.loadingSubtext}>✨ Ajustando al nivel {targetLevel}</Text>
        </View>
      )}

      {adaptedResult && !loading && (
        <>
          <Card style={styles.resultCard}>
            <Text style={styles.resultTitle}>Texto Adaptado</Text>
            <Text style={styles.adaptedText}>{adaptedResult.adaptedText}</Text>
          </Card>

          <Card style={styles.changesCard}>
            <Text style={styles.resultTitle}>Cambios Realizados</Text>
            {adaptedResult.changes.map((change, index) => (
              <View key={index} style={styles.changeItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.changeText}>{change}</Text>
              </View>
            ))}
          </Card>

          <View style={styles.actionsContainer}>
            <Button
              title="Guardar Material"
              onPress={handleSave}
              style={styles.actionButton}
            />
            <Button
              title="Nueva Adaptación"
              onPress={resetForm}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        </>
      )}
      </ScrollView>
    </Fragment>
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
  textInput: {
    minHeight: 200,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  switchLabel: {
    fontSize: 14,
    color: '#374151',
  },
  adaptButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  resultCard: {
    marginBottom: 16,
  },
  changesCard: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  adaptedText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  changeItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#4F46E5',
    marginRight: 8,
    fontWeight: 'bold',
  },
  changeText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
