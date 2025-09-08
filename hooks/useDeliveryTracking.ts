import { useState, useEffect, useRef } from 'react';

export interface TrackingLocation {
  latitude: number;
  longitude: number;
}

export interface DeliveryTrackingData {
  restaurantLocation: TrackingLocation & { name: string };
  deliveryAddress: TrackingLocation & { address: string };
  driverLocation?: TrackingLocation;
  isDriverAssigned: boolean;
  estimatedTime: string;
  orderStatus: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';
}

interface UseDeliveryTrackingProps {
  orderStatus: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  estimatedTime: string;
}

// Temple restaurant location (example - Miami)
const TEMPLE_RESTAURANT_LOCATION = {
  latitude: 25.7617,
  longitude: -80.1918,
  name: 'Temple Restaurant'
};

export function useDeliveryTracking({ 
  orderStatus, 
  deliveryAddress, 
  estimatedTime 
}: UseDeliveryTrackingProps): DeliveryTrackingData {
  const [driverLocation, setDriverLocation] = useState<TrackingLocation | undefined>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Convert address to coordinates (in a real app, use geocoding API)
  const getDeliveryCoordinates = (): TrackingLocation & { address: string } => {
    // Mock coordinates based on Miami area
    // TODO: In production, use Google Geocoding API to convert address to coordinates
    // Example: https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${API_KEY}
    const mockCoordinates = {
      latitude: 25.7617 + (Math.random() - 0.5) * 0.1, // Random location within ~5 miles
      longitude: -80.1918 + (Math.random() - 0.5) * 0.1,
      address: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zip}`
    };
    
    return mockCoordinates;
  };

  const deliveryCoords = getDeliveryCoordinates();

  // Simulate driver movement when out for delivery
  useEffect(() => {
    if (orderStatus === 'out_for_delivery') {
      // Initial driver position (near restaurant)
      let currentDriverLocation = {
        latitude: TEMPLE_RESTAURANT_LOCATION.latitude + (Math.random() - 0.5) * 0.01,
        longitude: TEMPLE_RESTAURANT_LOCATION.longitude + (Math.random() - 0.5) * 0.01,
      };
      
      setDriverLocation(currentDriverLocation);

      // Simulate driver movement towards delivery address
      intervalRef.current = setInterval(() => {
        setDriverLocation(prevLocation => {
          if (!prevLocation) return currentDriverLocation;

          // Calculate direction towards delivery address
          const latDiff = deliveryCoords.latitude - prevLocation.latitude;
          const lngDiff = deliveryCoords.longitude - prevLocation.longitude;
          
          // Move slightly towards destination
          const moveSpeed = 0.0001; // Adjust for realistic movement speed
          const newLocation = {
            latitude: prevLocation.latitude + (latDiff * moveSpeed),
            longitude: prevLocation.longitude + (lngDiff * moveSpeed),
          };

          // Stop when very close to destination
          const distance = Math.sqrt(
            Math.pow(deliveryCoords.latitude - newLocation.latitude, 2) +
            Math.pow(deliveryCoords.longitude - newLocation.longitude, 2)
          );

          if (distance < 0.001) {
            // Driver has arrived - in real app, this would trigger status change
            return newLocation;
          }

          currentDriverLocation = newLocation;
          return newLocation;
        });
      }, 5000); // Update every 5 seconds
    } else {
      // Clear driver location and interval for other statuses
      setDriverLocation(undefined);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [orderStatus]);

  return {
    restaurantLocation: TEMPLE_RESTAURANT_LOCATION,
    deliveryAddress: deliveryCoords,
    driverLocation,
    isDriverAssigned: orderStatus === 'out_for_delivery' || orderStatus === 'delivered',
    estimatedTime,
    orderStatus,
  };
}

// Utility function to calculate distance between two coordinates
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 3959; // Radius of Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
}
