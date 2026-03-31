import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  StyleSheet, Image, Platform, Modal, ScrollView
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../../App';
import { fetchAllEquipment, fetchCategories, fetchBrands } from '../api';
import { Equipment, Category } from '../types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Brand tokens ──────────────────────────────────────────────
const ACCENT    = '#E31B23';
const ACCENT_DIM = 'rgba(227,27,35,0.12)';
const BG        = '#080808';
const CARD      = '#111111';
const BORDER    = 'rgba(255,255,255,0.06)';
const TEXT_P    = '#FAFAFA';
const TEXT_S    = '#666666';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Catalog'>,
  NativeStackScreenProps<RootStackParamList>
>;

type SortOption = 'recommended' | 'price_asc' | 'price_desc' | 'name_asc';

export default function CatalogScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const initialCategoryId = route.params?.categoryId;

  const [equipment, setEquipment]     = useState<Equipment[]>([]);
  const [categories, setCategories]   = useState<Category[]>([]);
  const [brands, setBrands]           = useState<string[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const [activeSort, setActiveSort]             = useState<SortOption>('recommended');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(initialCategoryId || null);
  const [activeBrand, setActiveBrand]           = useState<string | null>(null);
  const [modalVisible, setModalVisible]         = useState(false);

  useEffect(() => {
    if (initialCategoryId) setActiveCategoryId(initialCategoryId);
  }, [initialCategoryId]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [eq, cats, br] = await Promise.all([fetchAllEquipment(), fetchCategories(), fetchBrands()]);
        setEquipment(eq);
        setCategories(cats);
        setBrands(br);
      } catch (e) {
        console.error('Catalog load error', e);
        setError('Could not load catalog. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const processedEquipment = useMemo(() => {
    let arr = equipment.filter(item => {
      const cat  = activeCategoryId ? item.categoryId === activeCategoryId : true;
      const brnd = activeBrand      ? item.brand === activeBrand           : true;
      return cat && brnd;
    });
    switch (activeSort) {
      case 'price_asc':  return [...arr].sort((a, b) => Number(a.dailyRate) - Number(b.dailyRate));
      case 'price_desc': return [...arr].sort((a, b) => Number(b.dailyRate) - Number(a.dailyRate));
      case 'name_asc':   return [...arr].sort((a, b) => a.name.localeCompare(b.name));
      default:           return arr;
    }
  }, [equipment, activeCategoryId, activeBrand, activeSort]);

  const activeBrands = useMemo(() => {
    if (!activeCategoryId) return brands;
    const inCat = equipment.filter(i => i.categoryId === activeCategoryId).map(i => i.brand).filter(Boolean) as string[];
    return Array.from(new Set(inCat)).sort();
  }, [equipment, activeCategoryId, brands]);

  useEffect(() => {
    if (activeBrand && !activeBrands.includes(activeBrand)) setActiveBrand(null);
  }, [activeBrands]);

  const activeFilterCount = [activeCategoryId, activeBrand, activeSort !== 'recommended' ? activeSort : null].filter(Boolean).length;

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
        {item.brand && (
          <View style={styles.cardBrandBadge}>
            <Text style={styles.cardBrandBadgeText}>{item.brand}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardPrice}>₹{item.dailyRate}<Text style={styles.perDay}>/day</Text></Text>
      </View>
    </TouchableOpacity>
  );

  const ChipRow = ({ label, isActive, onPress }: { label: string; isActive: boolean; onPress: () => void }) => (
    <TouchableOpacity style={[styles.chip, isActive && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Content */}
      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color={ACCENT} /></View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={52} color="#2a2a2a" />
          <Text style={{ color: '#555', fontSize: 15, fontWeight: '600', marginTop: 16, textAlign: 'center', paddingHorizontal: 40 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError(null);
              setLoading(true);
              Promise.all([fetchAllEquipment(), fetchCategories(), fetchBrands()])
                .then(([eq, cats, br]) => { setEquipment(eq); setCategories(cats); setBrands(br); })
                .catch(e => { console.error(e); setError('Could not load catalog. Please check your connection.'); })
                .finally(() => setLoading(false));
            }}
            style={{ marginTop: 24, backgroundColor: ACCENT, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 100 }}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={processedEquipment}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={[styles.list, { paddingTop: insets.top + 70, paddingBottom: insets.bottom + 130 }]}
          columnWrapperStyle={styles.row}
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
          : <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,8,0.95)' }]} />
        }
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Catalog</Text>
          <View style={styles.headerCount}>
            <Text style={styles.headerCountText}>{processedEquipment.length} items</Text>
          </View>
        </View>
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 100 }]}
        activeOpacity={0.85}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="options" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.fabText}>Filter & Sort</Text>
        {activeFilterCount > 0 && (
          <View style={styles.fabBadge}>
            <Text style={styles.fabBadgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            {/* Handle bar */}
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={() => {
                setActiveCategoryId(null);
                setActiveBrand(null);
                setActiveSort('recommended');
              }}>
                <Text style={styles.sheetReset}>Reset</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: 24 }}>
              {/* Sort */}
              <Text style={styles.sheetSectionLabel}>Sort By</Text>
              <View style={styles.chipGrid}>
                {[
                  { label: 'Recommended', val: 'recommended' },
                  { label: 'Price: Low → High', val: 'price_asc' },
                  { label: 'Price: High → Low', val: 'price_desc' },
                  { label: 'A–Z', val: 'name_asc' },
                ].map(s => (
                  <ChipRow
                    key={s.val}
                    label={s.label}
                    isActive={activeSort === s.val}
                    onPress={() => setActiveSort(s.val as SortOption)}
                  />
                ))}
              </View>

              {/* Category */}
              {categories.length > 0 && (
                <>
                  <Text style={styles.sheetSectionLabel}>Category</Text>
                  <View style={styles.chipGrid}>
                    <ChipRow label="All Types" isActive={activeCategoryId === null} onPress={() => setActiveCategoryId(null)} />
                    {categories.map(cat => (
                      <ChipRow key={cat.id} label={cat.name} isActive={activeCategoryId === cat.id} onPress={() => setActiveCategoryId(cat.id)} />
                    ))}
                  </View>
                </>
              )}

              {/* Brand */}
              {activeBrands.length > 0 && (
                <>
                  <Text style={styles.sheetSectionLabel}>Brand</Text>
                  <View style={styles.chipGrid}>
                    <ChipRow label="All Brands" isActive={activeBrand === null} onPress={() => setActiveBrand(null)} />
                    {activeBrands.map(b => (
                      <ChipRow key={b} label={b} isActive={activeBrand === b} onPress={() => setActiveBrand(b)} />
                    ))}
                  </View>
                </>
              )}
            </ScrollView>

            {/* CTA */}
            <View style={styles.sheetFooter}>
              <TouchableOpacity style={styles.sheetCta} onPress={() => setModalVisible(false)} activeOpacity={0.85}>
                <Text style={styles.sheetCtaText}>Show {processedEquipment.length} Results</Text>
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

  // Header
  header: { position: 'absolute', top: 0, left: 0, right: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 14, paddingTop: 10 },
  headerTitle: { color: TEXT_P, fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  headerCount: { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  headerCountText: { color: TEXT_S, fontSize: 13, fontWeight: '700' },

  // FAB
  fab: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: ACCENT, paddingVertical: 15, paddingHorizontal: 26, borderRadius: 100, shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 12, zIndex: 100 },
  fabText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: -0.2 },
  fabBadge: { backgroundColor: '#fff', borderRadius: 10, marginLeft: 8, paddingHorizontal: 7, paddingVertical: 2 },
  fabBadgeText: { color: ACCENT, fontSize: 11, fontWeight: '900' },

  // Grid
  list: { paddingHorizontal: 16 },
  row:  { justifyContent: 'space-between', marginBottom: 14 },
  card: { width: '48.5%', backgroundColor: CARD, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: BORDER },
  cardImgWrapper: { width: '100%', height: 170, position: 'relative' },
  cardImg: { width: '100%', height: '100%' },
  cardImgPlaceholder: { width: '100%', height: '100%', backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  cardBrandBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: BORDER },
  cardBrandBadgeText: { color: '#ccc', fontSize: 9, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  cardBody: { padding: 12, paddingVertical: 14 },
  cardTitle: { color: TEXT_P, fontSize: 13, fontWeight: '700', lineHeight: 18, marginBottom: 8 },
  cardPrice: { color: ACCENT, fontWeight: '900', fontSize: 17, letterSpacing: -0.5 },
  perDay: { color: TEXT_S, fontSize: 12, fontWeight: '600' },

  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyText: { color: TEXT_S, fontSize: 15, marginTop: 16, fontWeight: '500' },

  // Filter sheet
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#141414', borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: '85%' },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#333', alignSelf: 'center', marginTop: 14, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  sheetTitle: { color: TEXT_P, fontSize: 22, fontWeight: '900' },
  sheetReset: { color: ACCENT, fontSize: 15, fontWeight: '700' },
  sheetSectionLabel: { color: '#555', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 24, marginBottom: 14 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: BORDER },
  chipActive: { backgroundColor: ACCENT_DIM, borderColor: ACCENT },
  chipText: { color: TEXT_S, fontSize: 14, fontWeight: '700' },
  chipTextActive: { color: ACCENT, fontWeight: '800' },
  sheetFooter: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER },
  sheetCta: { backgroundColor: ACCENT, paddingVertical: 17, borderRadius: 100, alignItems: 'center', shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  sheetCtaText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
});
