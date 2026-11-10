import { Platform } from 'react-native';
export const colors = {
  bg: '#071B13',
  secondary: '#0B241A',
  card: '#102D20',
  accent: '#A9D69B',
  accent2: '#78A987',
  text: '#F4F7EF',
  sub: '#A5B5A5',
  muted: '#718575',
  warning: '#E8BC72',
  danger: '#E58D83',
  success: '#91D5A0',
  border: 'rgba(190,222,181,0.14)',
};
export const fonts = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
};
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const lightLabels = {
  low: 'Low light',
  indirect: 'Indirect light',
  'bright-indirect': 'Bright indirect',
  direct: 'Direct sunlight',
};
export const filterOptions = {
  sunlight: [
    { id: 'low', label: 'Low Light' },
    { id: 'indirect', label: 'Indirect Light' },
    { id: 'bright-indirect', label: 'Bright Indirect Light' },
    { id: 'direct', label: 'Direct Sunlight' },
  ],
  pets: [
    { id: 'safe', label: 'Pet Friendly' },
    { id: 'toxic', label: 'Toxic to Pets' },
  ],
  difficulty: [
    { id: 'easy', label: 'Easy' },
    { id: 'moderate', label: 'Moderate' },
    { id: 'difficult', label: 'Difficult' },
  ],
  watering: [
    { id: 'low', label: 'Low' },
    { id: 'moderate', label: 'Moderate' },
    { id: 'high', label: 'High' },
  ],
  categories: [
    { id: 'air', label: 'Air Purifying' },
    { id: 'beginner', label: 'Beginner Friendly' },
    { id: 'small', label: 'Small Spaces' },
  ],
};
