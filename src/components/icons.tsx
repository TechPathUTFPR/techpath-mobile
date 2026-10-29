import Svg, { Circle, G, Line, Path, Polygon, Rect } from 'react-native-svg';

/** Olho (mostrar senha) / olho riscado (ocultar senha). Ícones Feather (MIT). */
export function EyeIcon({ off = false, size = 20, color = '#B5B5B5' }: { off?: boolean; size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {off ? (
        <>
          <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <Line x1={1} y1={1} x2={23} y2={23} />
        </>
      ) : (
        <>
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <Circle cx={12} cy={12} r={3} />
        </>
      )}
    </Svg>
  );
}

/** Seta de voltar (chevron) do cabeçalho. */
export function ChevronLeftIcon({ size = 30, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

/** Lápis colorido (estilo emoji) com contorno branco, como no Figma. */
export function PencilIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G transform="rotate(45 12 12)">
        {/* contorno branco */}
        <Polygon
          points="9,1 15,1 15,16.3 12,22 9,16.3"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <Rect x={9} y={1} width={6} height={3.6} rx={1} fill="#F0457D" />
        <Rect x={9} y={4.6} width={6} height={1.6} fill="#4C8DF6" />
        <Rect x={9} y={6.2} width={6} height={10.1} fill="#F5A623" />
        <Rect x={13} y={6.2} width={2} height={10.1} fill="#E08A00" />
        <Polygon points="9,16.3 15,16.3 12,22" fill="#F3D1A5" />
        <Polygon points="11,20.2 13,20.2 12,22" fill="#4B3F9E" />
      </G>
    </Svg>
  );
}

/** Seta para a direita (cartão da próxima etapa). */
export function ChevronRightIcon({ size = 20, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 18l6-6-6-6" />
    </Svg>
  );
}

/** Círculo de conclusão: dois círculos verdes concêntricos com um "check" fino. */
export function CompletionBadge({
  outer = 138,
  inner = 106,
  outerColor = '#D4FA8E',
  innerColor = '#CCFA77',
  checkColor = '#3A3A3A',
}: {
  outer?: number;
  inner?: number;
  outerColor?: string;
  innerColor?: string;
  checkColor?: string;
}) {
  const c = outer / 2;
  return (
    <Svg width={outer} height={outer} viewBox={`0 0 ${outer} ${outer}`}>
      <Circle cx={c} cy={c} r={outer / 2} fill={outerColor} />
      <Circle cx={c} cy={c} r={inner / 2} fill={innerColor} />
      <Path
        d={`M${c - 14.5} ${c - 1} L${c - 5.5} ${c + 9} L${c + 14.5} ${c - 15}`}
        stroke={checkColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** "Check" branco dos indicadores de etapa concluída. */
export function CheckIcon({ size = 14, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  );
}
