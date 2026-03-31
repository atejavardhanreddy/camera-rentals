import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Image, Platform, Modal, ScrollView
} from 'react-native';
import { fetchEquipmentByBrand } from '../api';
import { Equipment } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCENT    = '#E31B23';
const ACCENT_DIM = 'rgba(227,27,35,0.12)';
const BG        = '#080808';
const CARD      = '#111111';
const BORDER    = 'rgba(255,255,255,0.06)';
const TEXT_P    = '#FAFAFA';
const TEXT_S    = '#666666';

type Props = NativeStackScreenProps<RootStackParamList, 'BrandDetail'>;
type SortOption = 'recommended' | 'price_asc' | 'price_desc' | 'name_asc';

export default function BrandDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { brandName } = route.params;

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeSort, setActiveSort] = useState<SortOption>('recommended');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEquipmentByBrand(brandName);
        setEquipment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [brandName]);

  const sortedEquipment = useMemo(() => {
    const arr = [...equipment];
    switch (activeSort) {
      case 'price_asc':  return arr.sort((a, b) => Number(a.dailyRate) - Number(b.dailyRate));
      case 'price_desc': return arr.sort((a, b) => Number(b.dailyRate) - Number(a.dailyRate));
      case 'name_asc':   return arr.sort((a, b) => a.name.localeCompare(b.name));
      default: return arr;
    }
  }, [equipment, activeSort]);

  const renderItem = ({ item }: { item: Equipment }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { slug: item.slug, equipment: item })}
      activeOpacity={0.88}
    >
      <View style={styles.cardImgWrapper}>
        {item.imageUrls && item.imageUrls.length > 0 ? (
          <Image source={{ uri: item.imageUrls[0] }} style={styles.cardImg} resizeMode="cover" />
        ) : (
          <View style={styles.cardImgPlaceholder}>
            <Ionicons name="camera-outline" size={28} color="#2a2a2a" />
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardPrice}>₹{item.dailyRate}<Text style={styles.perDay}>/day</Text></Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color={ACCENT} /></View>
      ) : (
        <FlatList
          data={sortedEquipment}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={[styles.list, { paddingTop: insets.top + 80, paddingBottom: insets.bottom + 130 }]}
          columnWrapperStyle={styles.row}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Ionicons name="search-outline" size={48} color="#2a2a2a" />
              <Text style={styles.emptyText}>No equipment found</Text>
            </View>
          }
        />
      )}

      {/* Floating header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {Platform.OS === 'ios'
          ? <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          : <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,8,0.96)' }]} />
        }
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={TEXT_P} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>{brandName}</Text>
            <Text style={styles.headerSub}>{sortedEquipment.length} items</Text>
          </View>
        </View>
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 50 }]}
        activeOpacity={0.85}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="swap-vertical" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.fabText}>Sort</Text>
        {activeSort !== 'recommended' && (
          <View style={styles.fabBadge}>
            <Text style={styles.fabBadgeText}>1</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Sort Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16, height: '50%' }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Sort Gear</Text>
              <TouchableOpacity onPress={() => setActiveSort('recommended')}>
                <Text style={styles.sheetReset}>Reset</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.chipGrid, { paddingHorizontal: 24, marginTop: 8 }]}>
              {[
                { label: 'Recommended', val: 'recommended' },
                { label: 'Price: Low → High', val: 'price_asc' },
                { label: 'Price: High → Low', val: 'price_desc' },
                { label: 'A–Z', val: 'name_asc' },
              ].map(s => (
                <TouchableOpacity
                  key={s.val}
                  style={[styles.chip, activeSort === s.val && styles.chipActive]}
                  onPress={() => setActiveSort(s.val as SortOption)}
                >
                  <Text style={[styles.chipText, activeSort === s.val && styles.chipTextActive]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.sheetFooter}>
              <TouchableOpacity style={styles.sheetCta} onPress={() => setModalVisible(false)} activeOpacity={0.85}>
                <Text style={styles.sheetCtaText}>Show {sortedEquipment.length} Results</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { position: 'absolute', top: 0, left: 0, right: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, paddingTop: 10 },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: BORDER },
  headerTitle: { color: TEXT_P, fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { color: TEXT_S, fontSize: 13, fontWeight: '600', marginTop: 2 },

  fab: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: ACCENT, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 100, shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 12, zIndex: 100 },
  fabText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  fabBadge: { backgroundColor: '#fff', borderRadius: 10, marginLeft: 8, paddingHorizontal: 7, paddingVertical: 2 },
  fabBadgeText: { color: ACCENT, fontSize: 11, fontWeight: '900' },

  list: { paddingHorizontal: 16 },
  row:  { justifyContent: 'space-between', marginBottom: 14 },
  card: { width: '48.5%', backgroundColor: CARD, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: BORDER },
  cardImgWrapper: { width: '100%', height: 170 },
  cardImg: { width: '100%', height: '100%' },
  cardImgPlaceholder: { width: '100%', height: '100%', backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  cardBody: { padding: 12, paddingVertical: 14 },
  cardTitle: { color: TEXT_P, fontSize: 13, fontWeight: '700', lineHeight: 18, marginBottom: 8 },
  cardPrice: { color: ACCENT, fontWeight: '900', fontSize: 17, letterSpacing: -0.5 },
  perDay: { color: TEXT_S, fontSize: 12, fontWeight: '600' },

  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyText: { color: TEXT_S, fontSize: 15, marginTop: 16, fontWeight: '500' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#141414', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#333', alignSelf: 'center', marginTop: 14, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  sheetTitle: { color: TEXT_P, fontSize: 22, fontWeight: '900' },
  sheetReset: { color: ACCENT, fontSize: 15, fontWeight: '700' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: BORDER },
  chipActive: { backgroundColor: ACCENT_DIM, borderColor: ACCENT },
  chipText: { color: TEXT_S, fontSize: 14, fontWeight: '700' },
  chipTextActive: { color: ACCENT, fontWeight: '800' },
  sheetFooter: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER },
  sheetCta: { backgroundColor: ACCENT, paddingVertical: 17, borderRadius: 100, alignItems: 'center', shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  sheetCtaText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
