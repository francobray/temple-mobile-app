import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, ChevronRight } from 'lucide-react-native';
import Header from '@/components/layout/Header';
import Colors from '@/constants/Colors';

// Mock rewards data
const availableRewards = [
  {
    id: '1',
    name: 'Free 6pc Wings',
    description: 'Get a free 6-piece wings with any purchase',
    pointsCost: 1000,
    imageUrl: 'https://images.pexels.com/photos/7627440/pexels-photo-7627440.jpeg',
  },
  {
    id: '2',
    name: 'Free Side',
    description: 'Choose any side for free with your order',
    pointsCost: 800,
    imageUrl: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
  },
  {
    id: '3',
    name: '$10 Off Order',
    description: 'Get $10 off your next order of $30 or more',
    pointsCost: 1200,
    imageUrl: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg',
  },
];

// Mock points history
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
];

export default function RewardsScreen() {
  const router = useRouter();
  const [currentPoints] = useState(740);

  const handleRewardPress = (reward: typeof availableRewards[0]) => {
    if (currentPoints >= reward.pointsCost) {
      // In a real app, this would open a confirmation modal
      // and then process the reward redemption
      alert('Reward redeemed successfully!');
    } else {
      alert('Not enough points to redeem this reward');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Rewards" showBackButton />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Points Summary */}
        <View style={styles.pointsSummary}>
          <Text style={styles.pointsTitle}>Your Points</Text>
          <Text style={styles.pointsValue}>{currentPoints}</Text>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => router.push('/rewards/history')}
          >
            <Clock size={20} color={Colors.primary.main} />
            <Text style={styles.historyButtonText}>View History</Text>
            <ChevronRight size={20} color={Colors.primary.main} />
          </TouchableOpacity>
        </View>

        {/* Available Rewards */}
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        {availableRewards.map((reward) => (
          <TouchableOpacity
            key={reward.id}
            style={[
              styles.rewardCard,
              currentPoints < reward.pointsCost && styles.rewardCardDisabled
            ]}
            onPress={() => handleRewardPress(reward)}
            disabled={currentPoints < reward.pointsCost}
          >
            <Image 
              source={{ uri: reward.imageUrl }} 
              style={styles.rewardImage}
            />
            <View style={styles.rewardContent}>
              <View style={styles.rewardHeader}>
                <Text style={styles.rewardName}>{reward.name}</Text>
                <Text style={styles.rewardPoints}>
                  {reward.pointsCost} pts
                </Text>
              </View>
              <Text style={styles.rewardDescription}>
                {reward.description}
              </Text>
              {currentPoints < reward.pointsCost && (
                <Text style={styles.pointsNeeded}>
                  {reward.pointsCost - currentPoints} more points needed
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {pointsHistory.slice(0, 3).map((activity) => (
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
        </View>
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
  pointsSummary: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pointsTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: Colors.grey[700],
    marginBottom: 8,
  },
  pointsValue: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 48,
    color: Colors.primary.main,
    marginBottom: 16,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  historyButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.primary.main,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.grey[900],
    marginBottom: 16,
  },
  rewardCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardCardDisabled: {
    opacity: 0.7,
  },
  rewardImage: {
    width: '100%',
    height: 150,
  },
  rewardContent: {
    padding: 16,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardName: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: Colors.grey[900],
  },
  rewardPoints: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.primary.main,
  },
  rewardDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
    marginBottom: 8,
  },
  pointsNeeded: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.error.main,
  },
  recentActivity: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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