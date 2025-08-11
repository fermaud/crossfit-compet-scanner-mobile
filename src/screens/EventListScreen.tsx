import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
} from 'react-native';
import dayjs from 'dayjs';
import { EventFilters, EventItem, FetchEventResponse } from '../types/Event';
import { fetchEvents } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const INITIAL_FILTERS: EventFilters = {
  page: 1,
  size: 20,
};

const TYPES = {
  online: 'En ligne',
  onSite: 'Sur place',
};

const SOURCES = {
  scoringFit: 'Scoring Fit',
  competitionCorner: 'Competition Corner',
};

export default function EventListScreen() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<EventFilters>(INITIAL_FILTERS);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [filters.name]);

  const loadEvents = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response: FetchEventResponse = await fetchEvents(filters);
      setEvents(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Erreur', 'Impossible de charger les événements. Vérifiez que votre backend est démarré.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = (text: string) => {
    setFilters(prev => ({ ...prev, name: text, page: 1 }));
  };

  const openEventLink = (url: string) => {
    Linking.openURL(url);
  };

  const openMapsLocation = (location: string) => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
      Linking.openURL(url);
    }
  };

  const renderEventItem = ({ item }: { item: EventItem }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.name}
        </Text>
      </View>

      <Text style={styles.eventDate}>
        Date: <Text style={styles.bold}>{dayjs(item.startDate).format('DD/MM/YYYY')}</Text>
      </Text>

      <View style={styles.tagsContainer}>
        {item.duration && (
          <View style={[styles.tag, styles.durationTag]}>
            <Text style={styles.tagText}>Durée: {item.duration}J</Text>
          </View>
        )}
        
        {item.zipCode && (
          <View style={[styles.tag, styles.departmentTag]}>
            <Text style={styles.tagText}>Dép: {item.zipCode}</Text>
          </View>
        )}
        
        <View style={[styles.tag, styles.sourceTag]}>
          <Text style={styles.tagText}>{SOURCES[item.source]}</Text>
        </View>
        
        <View style={[styles.tag, styles.typeTag]}>
          <Text style={styles.tagText}>{TYPES[item.type]}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.locationContainer} 
        onPress={() => openMapsLocation(item.location)}
      >
        <Text style={styles.locationIcon}>📍</Text>
        {item.location ? (
          <Text style={[styles.location, styles.locationLink]} numberOfLines={2}>
            {item.location}
          </Text>
        ) : item.type !== 'online' ? (
          <Text style={styles.location}>Lieu à préciser</Text>
        ) : (
          <Text style={styles.location}>En ligne</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => openEventLink(item.eventLink)}
      >
        <Text style={styles.linkIcon}>🔗</Text>
        <Text style={styles.linkButtonText}>Voir l'événement</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔍</Text>
      <Text style={styles.emptyStateText}>
        Aucun résultat pour cette recherche
      </Text>
      <Text style={styles.emptyStateSubtext}>
        Essayez d'élargir vos critères de recherche
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CrossFit Events</Text>
        <Text style={styles.subtitle}>
          {user ? 'Mode connecté' : 'Mode invité'}
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un événement"
          placeholderTextColor="#9CA3AF"
          value={filters.name || ''}
          onChangeText={handleSearch}
        />
      </View>

      {/* Results count */}
      {totalCount > 0 && (
        <Text style={styles.resultsCount}>
          <Text style={styles.bold}>{totalCount}</Text> événement(s) trouvé(s)
        </Text>
      )}

      {/* Events List */}
      {loading && events.length === 0 ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Chargement des événements...</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadEvents(true)}
              tintColor="#3B82F6"
              colors={['#3B82F6']}
            />
          }
          ListEmptyComponent={!loading ? renderEmptyState : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    backgroundColor: '#374151',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    color: '#D1D5DB',
    fontSize: 16,
    fontStyle: 'italic',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  eventCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    flex: 1,
  },
  eventDate: {
    color: '#D1D5DB',
    fontSize: 14,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationTag: {
    backgroundColor: '#3B82F6',
  },
  departmentTag: {
    backgroundColor: '#F59E0B',
  },
  sourceTag: {
    backgroundColor: '#10B981',
  },
  typeTag: {
    backgroundColor: '#6B7280',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  location: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    flex: 1,
  },
  locationLink: {
    textDecorationLine: 'underline',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  linkIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  linkButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    color: '#D1D5DB',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
});