import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/tokens';

/** Bloco centralizado para carregamento, erro, lista vazia e dados indisponíveis. */
export function StateMessage({
  title,
  message,
  loading = false,
  children,
}: {
  title?: string;
  message?: string;
  loading?: boolean;
  children?: ReactNode;
}) {
  return (
    <View style={styles.wrap}>
      {loading ? <ActivityIndicator size="large" color={colors.textPrimary} /> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, alignItems: 'stretch', justifyContent: 'center', gap: 16 },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  message: { fontSize: 14, color: colors.textStrong, textAlign: 'center' },
});
