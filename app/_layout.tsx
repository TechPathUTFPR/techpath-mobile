import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AssessmentProvider } from '../src/features/assessment/AssessmentContext';
import { TrailProvider } from '../src/features/trail/TrailContext';
import { brandColors } from '../src/theme/screens';
import { colors } from '../src/theme/tokens';

export default function RootLayout() {
  return (
    <AssessmentProvider>
      <TrailProvider>
        {/* Ícones escuros da barra de status (fundo branco ou lilás claro, como no Figma). */}
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="landing" options={{ contentStyle: { backgroundColor: brandColors.lilac } }} />
          <Stack.Screen name="how-it-works" options={{ contentStyle: { backgroundColor: brandColors.lilac } }} />
        </Stack>
      </TrailProvider>
    </AssessmentProvider>
  );
}
