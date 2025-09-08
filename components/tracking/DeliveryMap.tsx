import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import MapView, { 
  Marker, 
  Polyline, 
  PROVIDER_GOOGLE 
} from 'react-native-maps';
import { MapPin, Navigation, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface DeliveryMapProps {
  restaurantLocation: {
    latitude: number;
    longitude: number;
    name: string;
  };
  deliveryAddress: {
    latitude: number;
    longitude: number;
    address: string;
  };
  driverLocation?: {
    latitude: number;
    longitude: number;
  };
  isDriverAssigned: boolean;
  estimatedTime: string;
}

interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

const { width, height } = Dimensions.get('window');

export default function DeliveryMap({
  restaurantLocation,
  deliveryAddress,
  driverLocation,
  isDriverAssigned,
  estimatedTime
}: DeliveryMapProps) {
  const mapRef = useRef<MapView>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  // TODO: Replace with actual API key from environment variables
  // In production, get this from process.env.GOOGLE_MAPS_API_KEY or expo-constants
  const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

  useEffect(() => {
    if (isDriverAssigned && driverLocation) {
      fetchDirections(driverLocation, deliveryAddress);
    } else {
      // Show route from restaurant to delivery address
      fetchDirections(restaurantLocation, deliveryAddress);
    }
  }, [driverLocation, isDriverAssigned]);

  useEffect(() => {
    // Fit map to show all markers
    if (mapRef.current) {
      const coordinates = [];
      
      if (isDriverAssigned && driverLocation) {
        coordinates.push(driverLocation);
      } else {
        coordinates.push(restaurantLocation);
      }
      
      coordinates.push(deliveryAddress);
      
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [driverLocation, isDriverAssigned]);

  const fetchDirections = async (origin: RouteCoordinate, destination: RouteCoordinate) => {
    setIsLoadingRoute(true);
    
    try {
      // In a real app, you would use the actual API key from environment variables
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        
        // Update distance and duration
        setDistance(leg.distance?.text || '');
        setDuration(leg.duration?.text || '');
        
        // Decode polyline
        const points = decodePolyline(route.overview_polyline.points);
        setRouteCoordinates(points);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      // Fallback: create a simple straight line
      setRouteCoordinates([origin, destination]);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Decode Google's polyline algorithm
  const decodePolyline = (encoded: string): RouteCoordinate[] => {
    const points: RouteCoordinate[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b: number;
      let shift = 0;
      let result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  const getMapRegion = () => {
    const coordinates = [];
    
    if (isDriverAssigned && driverLocation) {
      coordinates.push(driverLocation);
    } else {
      coordinates.push(restaurantLocation);
    }
    
    coordinates.push(deliveryAddress);
    
    // Calculate bounds
    const minLat = Math.min(...coordinates.map(c => c.latitude));
    const maxLat = Math.max(...coordinates.map(c => c.latitude));
    const minLng = Math.min(...coordinates.map(c => c.longitude));
    const maxLng = Math.max(...coordinates.map(c => c.longitude));
    
    const latDelta = (maxLat - minLat) * 1.5; // Add padding
    const lngDelta = (maxLng - minLng) * 1.5;
    
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01), // Minimum zoom level
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  const renderTrackingInfo = () => (
    <View style={styles.trackingInfoContainer}>
      <View style={styles.trackingInfo}>
        <View style={styles.infoRow}>
          <Clock size={16} color={Colors.primary.main} />
          <Text style={styles.infoText}>
            {isDriverAssigned ? `${duration || estimatedTime}` : `Preparing • ${estimatedTime}`}
          </Text>
        </View>
        
        {distance && (
          <View style={styles.infoRow}>
            <Navigation size={16} color={Colors.primary.main} />
            <Text style={styles.infoText}>{distance} away</Text>
          </View>
        )}
      </View>
      
      {isLoadingRoute && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary.main} />
          <Text style={styles.loadingText}>Calculating route...</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={getMapRegion()}
        showsUserLocation={false}
        showsMyLocationButton={false}
        mapType="standard"
      >
        {/* Restaurant/Origin Marker */}
        {!isDriverAssigned && (
          <Marker
            coordinate={restaurantLocation}
            title={restaurantLocation.name}
            description="Restaurant"
          >
            <View style={styles.restaurantMarker}>
              <MapPin size={20} color={Colors.white} />
            </View>
          </Marker>
        )}
        
        {/* Driver Marker */}
        {isDriverAssigned && driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Your Driver"
            description="Driver location"
          >
            <View style={styles.driverMarker}>
              <Navigation size={20} color={Colors.white} />
            </View>
          </Marker>
        )}
        
        {/* Delivery Address Marker */}
        <Marker
          coordinate={deliveryAddress}
          title="Delivery Address"
          description={deliveryAddress.address}
        >
          <View style={styles.deliveryMarker}>
            <MapPin size={20} color={Colors.white} />
          </View>
        </Marker>
        
        {/* Route Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={Colors.primary.main}
            strokeWidth={4}
            lineDashPattern={isDriverAssigned ? [] : [5, 5]} // Dashed line if no driver assigned
          />
        )}
      </MapView>
      
      {renderTrackingInfo()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.tertiary,
  },
  map: {
    flex: 1,
  },
  trackingInfoContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
  },
  trackingInfo: {
    backgroundColor: Colors.background.card + 'F0', // Semi-transparent
    borderRadius: 8,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  restaurantMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  driverMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  deliveryMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
