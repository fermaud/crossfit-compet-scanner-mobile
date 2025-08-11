import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { EventFilters, eventDurations, sourceValues } from '../types/Event';
import { departements } from '../data/departements';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: EventFilters;
  onApplyFilters: (filters: EventFilters) => void;
}

export default function FilterModal({ visible, onClose, filters, onApplyFilters }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<EventFilters>(filters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [departementSearch, setDepartementSearch] = useState('');

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  const handleApply = () => {
    // Reset to page 1 when applying new filters
    onApplyFilters({ ...localFilters, page: 1 });
    onClose();
  };

  const handleReset = () => {
    const resetFilters: EventFilters = {
      page: 1,
      size: 10,
    };
    setLocalFilters(resetFilters);
    setDepartementSearch('');
  };

  const toggleDepartement = (departementNumber: number) => {
    const departementString = departementNumber.toString();
    const currentSelected = localFilters.selectedDepartements || [];
    const isSelected = currentSelected.includes(departementString);
    
    let newSelected: string[];
    if (isSelected) {
      newSelected = currentSelected.filter(d => d !== departementString);
    } else {
      newSelected = [...currentSelected, departementString];
    }
    
    setLocalFilters(prev => ({
      ...prev,
      selectedDepartements: newSelected.length > 0 ? newSelected : undefined
    }));
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setLocalFilters(prev => ({ ...prev, startDate: selectedDate }));
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setLocalFilters(prev => ({ ...prev, endDate: selectedDate }));
    }
  };

  const clearStartDate = () => {
    setLocalFilters(prev => ({ ...prev, startDate: undefined }));
  };

  const clearEndDate = () => {
    setLocalFilters(prev => ({ ...prev, endDate: undefined }));
  };

  const filteredDepartements = departements.filter(dept =>
    dept.name.toLowerCase().includes(departementSearch.toLowerCase()) ||
    dept.number.toString().includes(departementSearch)
  );

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.duration && localFilters.duration !== 'ALL') count++;
    if (localFilters.source && localFilters.source !== 'ALL') count++;
    if (localFilters.startDate) count++;
    if (localFilters.endDate) count++;
    if (localFilters.selectedDepartements && localFilters.selectedDepartements.length > 0) count++;
    return count;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filtres</Text>
          <TouchableOpacity onPress={handleReset} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Duration Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Durée</Text>
            <View style={styles.optionsContainer}>
              {eventDurations.map((duration: any) => (
                <TouchableOpacity
                  key={duration.value}
                  style={[
                    styles.optionButton,
                    localFilters.duration === duration.value && styles.optionButtonSelected
                  ]}
                  onPress={() => setLocalFilters(prev => ({ 
                    ...prev, 
                    duration: duration.value === 'ALL' ? undefined : duration.value 
                  }))}
                >
                  <Text style={[
                    styles.optionButtonText,
                    localFilters.duration === duration.value && styles.optionButtonTextSelected
                  ]}>
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Source Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Source</Text>
            <View style={styles.optionsContainer}>
              {sourceValues.map((source: any) => (
                <TouchableOpacity
                  key={source.value}
                  style={[
                    styles.optionButton,
                    localFilters.source === source.value && styles.optionButtonSelected
                  ]}
                  onPress={() => setLocalFilters(prev => ({ 
                    ...prev, 
                    source: source.value === 'ALL' ? undefined : source.value 
                  }))}
                >
                  <Text style={[
                    styles.optionButtonText,
                    localFilters.source === source.value && styles.optionButtonTextSelected
                  ]}>
                    {source.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Filters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dates</Text>
            
            {/* Start Date */}
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Date minimum</Text>
              <View style={styles.dateRow}>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {localFilters.startDate 
                      ? localFilters.startDate.toLocaleDateString('fr-FR')
                      : 'Sélectionner une date'
                    }
                  </Text>
                </TouchableOpacity>
                {localFilters.startDate && (
                  <TouchableOpacity onPress={clearStartDate} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* End Date */}
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Date maximum</Text>
              <View style={styles.dateRow}>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {localFilters.endDate 
                      ? localFilters.endDate.toLocaleDateString('fr-FR')
                      : 'Sélectionner une date'
                    }
                  </Text>
                </TouchableOpacity>
                {localFilters.endDate && (
                  <TouchableOpacity onPress={clearEndDate} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Departements Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Départements {localFilters.selectedDepartements && localFilters.selectedDepartements.length > 0 && 
                `(${localFilters.selectedDepartements.length} sélectionnés)`
              }
            </Text>
            
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un département..."
              placeholderTextColor="#9CA3AF"
              value={departementSearch}
              onChangeText={setDepartementSearch}
            />

            <ScrollView style={styles.departementsContainer} nestedScrollEnabled>
              {filteredDepartements.map((dept) => {
                const isSelected = localFilters.selectedDepartements?.includes(dept.number.toString()) || false;
                return (
                  <TouchableOpacity
                    key={dept.number}
                    style={[
                      styles.departementItem,
                      isSelected && styles.departementItemSelected
                    ]}
                    onPress={() => toggleDepartement(dept.number)}
                  >
                    <Text style={[
                      styles.departementText,
                      isSelected && styles.departementTextSelected
                    ]}>
                      {dept.number.toString().padStart(2, '0')} - {dept.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>
              Appliquer les filtres {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={localFilters.startDate || new Date()}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={localFilters.endDate || new Date()}
            mode="date"
            display="default"
            onChange={onEndDateChange}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: '#374151',
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#374151',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  optionButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionButtonText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  dateButtonText: {
    color: '#D1D5DB',
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
    backgroundColor: '#EF4444',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#F9FAFB',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  departementsContainer: {
    maxHeight: 200,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  departementItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  departementItemSelected: {
    backgroundColor: '#3B82F6',
  },
  departementText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  departementTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#374151',
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
