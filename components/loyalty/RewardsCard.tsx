import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Gift } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface RewardsCardProps {
  points: number;
  nextRewardPoints: number;
  onRewardsPress: () => void;
  location?: string;
  estimatedTime?: string;
}

export default function RewardsCard({
  points,
  nextRewardPoints,
  onRewardsPress,
  location,
  estimatedTime,
}: RewardsCardProps) {
  const progress = (points % 1000) / 1000;
  const pointsUntilNext = 1000 - (points % 1000);

  return (
    <View style={styles.container}>
      {location && estimatedTime && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>{location}</Text>
          <Text style={styles.timeText}>Pickup in {estimatedTime}</Text>
        </View>
      )}

      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>{points}</Text>
        <Text style={styles.pointsLabel}>points until your next reward</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressMarkers}>
          <Text style={styles.markerText}>200</Text>
          <Text style={styles.markerText}>400</Text>
          <Text style={styles.markerText}>600</Text>
          <Text style={styles.markerText}>800</Text>
          <Text style={styles.markerText}>1000</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progress * 100}%` }
            ]} 
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.rewardsButton}
        onPress={onRewardsPress}
      >
        <Gift size={20} color={Colors.white} />
        <Text style={styles.rewardsButtonText}>Rewards</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  locationText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.grey[900],
  },
  timeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pointsText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 48,
    color: Colors.primary.main,
    marginBottom: 4,
  },
  pointsLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.grey[600],
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  markerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.grey[500],
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.grey[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.main,
    borderRadius: 4,
  },
  rewardsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.main,
    paddingVertical: 12,
    borderRadius: 8,
  },
  rewardsButtonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
});