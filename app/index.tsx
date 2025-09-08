import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';

export default function Index() {
  console.log('Index component rendered');
  return <Redirect href="/(tabs)" />;
}
