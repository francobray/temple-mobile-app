import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform 
} from 'react-native';
import Header from '@/components/layout/Header';
import Colors from '@/constants/Colors';

// Mock points history data
const pointsHistory = [
  {
    id: '1',
    type: 'earned',
    points: 50,
    description: 'Order #TMP-2024-001',
    date: 'Today, 12:30 PM',
  },
  {
    id: '2',
    type: 'redeemed',
    points: -1000,
    description: 'Free 6pc Wings',
    date: 'Yesterday, 3:15 PM',
  },
  {
    id: '3',
    type: 'earned',
    points: 35,
    description: 'Order #TMP-2024-002',
    date: 'Yesterday, 7:15 PM',
  },
  {
    id: '4',
    type: 'earned',
    points: 45,
    description: 'Order #TMP-2024-003',
    date: 'Jan 15, 2024',
  },
  {
    id: '5',
    type: 'redeemed',
    points: -800,
    description: 'Free Side',
    date: 'Jan 10, 2024',
  },
  {
    id: '6',
    type: 'earned',
    points: 60,
    description: 'Order #TMP-2024-004',
    date: 'Jan 8, 2024',
  },
];

export default function PointsHistoryScreen() {
  return (
    <View style={styles.container}>
      <Header title="Points History" showBackButton />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pointsHistory.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityLeft}>
              <Text style={styles.activityDescription}>
                {activity.description}
              </Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
            <Text
              style={[
                styles.activityPoints,
                activity.type === 'earned' 
                  ? styles.pointsEarned 
                  : styles.pointsRedeemed
              ]}
            >
              {activity.type === 'earned' ? '+' : ''}{activity.points}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey[100],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityLeft: {
    flex: 1,
  },
  activityDescription: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.grey[900],
    marginBottom: 4,
  },
  activityDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
  },
  activityPoints: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  pointsEarned: {
    color: Colors.success.main,
  },
  pointsRedeemed: {
    color: Colors.error.main,
  },
});