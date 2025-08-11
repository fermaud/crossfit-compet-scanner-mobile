import React, { useState, useEffect, useRef } from 'react';
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
import FilterModal from '../components/FilterModal';

const INITIAL_FILTERS: EventFilters = {
  page: 1,
  size: 10,
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
  const [filters, setFilters] = useState<EventFilters>(INITIAL_FILTERS);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, name: searchText, page: 1 }));
      // Reset events when search changes
      setEvents([]);
    }, 500); // 1000ms delay

    // Cleanup timeout on component unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchText]);

  // Load events when filters change (except searchText which is handled above)
  useEffect(() => {
    loadEvents(false, filters.page > 1);
  }, [
    filters.name, 
    filters.page, 
    filters.duration, 
    filters.source, 
    filters.startDate, 
    filters.endDate, 
    filters.selectedDepartements
  ]);

  const loadEvents = async (isRefresh = false, isLoadMore = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response: FetchEventResponse = await fetchEvents(filters);
      
      if (isRefresh || filters.page === 1) {
        // Replace events for refresh or first page
        setEvents(response.results);
      } else {
        // Append events for pagination, but filter out duplicates
        setEvents(prevEvents => {
          const existingIds = new Set(prevEvents.map(event => event._id));
          const newEvents = response.results.filter(event => !existingIds.has(event._id));
          
          // If no new events were returned, we've reached the end
          if (newEvents.length === 0 && response.results.length === 0) {
            // Update total count to current count to stop infinite loading
            setTotalCount(prevEvents.length);
            return prevEvents;
          }
          
          return [...prevEvents, ...newEvents];
        });
      }
      
      setTotalCount(response.count);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Erreur', 'Impossible de charger les événements. Vérifiez que votre backend est démarré.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleApplyFilters = (newFilters: EventFilters) => {
    setFilters(newFilters);
    setEvents([]); // Clear events when applying new filters
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.duration && filters.duration !== 'ALL') count++;
    if (filters.source && filters.source !== 'ALL') count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.selectedDepartements && filters.selectedDepartements.length > 0) count++;
    return count;
  };

  const loadMoreEvents = () => {
    // Check if we have more events to load
    const hasMoreEvents = events.length < totalCount;
    
    // Prevent loading if already loading or if we have all events
    if (!hasMoreEvents || loadingMore || loading) {
      return;
    }
    
    // Calculate maximum possible pages
    const maxPossiblePages = Math.ceil(totalCount / filters.size);
    if (filters.page >= maxPossiblePages) {
      // Force end by setting totalCount to current events length
      setTotalCount(events.length);
      return;
    }
    
    // Additional check: if we're very close to the total, be more careful
    const remainingEvents = totalCount - events.length;
    if (remainingEvents <= 0) {
      setTotalCount(events.length);
      return;
    }
    
    // Only load if we haven't exceeded reasonable limits
    const nextPage = filters.page + 1;
    if (nextPage > 20) { // Safety limit - max 20 pages (200 events with size 10)
      setTotalCount(events.length);
      return;
    }
    
    setFilters(prev => ({ ...prev, page: nextPage }));
  };

  const renderFooter = () => {
    // Show loading indicator when loading more
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={styles.footerText}>Chargement...</Text>
        </View>
      );
    }

    // Show end of list indicator when all events are loaded
    if (events.length > 0 && events.length >= totalCount && totalCount > 0) {
      return (
        <View style={styles.endOfListContainer}>
          <View style={styles.endOfListLine} />
          <Text style={styles.endOfListText}>
            🏁 Fin de la liste • {totalCount} événement{totalCount > 1 ? 's' : ''} au total
          </Text>
          <View style={styles.endOfListLine} />
        </View>
      );
    }



    return null;
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
        <Text style={styles.headerTitle}>CrossFit Event Scanner</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un événement"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
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
          keyExtractor={(item, index) => `${item._id}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setFilters(prev => ({ ...prev, page: 1 }));
                loadEvents(true);
              }}
              tintColor="#3B82F6"
              colors={['#3B82F6']}
            />
          }
          onEndReached={loadMoreEvents}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!loading ? renderEmptyState : null}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  filterButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    position: 'relative',
  },
  filterIcon: {
    fontSize: 18,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
  footerLoader: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
  },
  endOfListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  endOfListLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#374151',
  },
  endOfListText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});