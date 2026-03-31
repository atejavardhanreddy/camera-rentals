import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  StyleSheet, Image, ScrollView, RefreshControl, ImageBackground,
  Dimensions, NativeScrollEvent, NativeSyntheticEvent
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../../App';
import { fetchCategories, fetchFeaturedEquipment, fetchPopularEquipment } from '../api';
import { Category, Equipment } from '../types';
import { useCartStore } from '../store/cartStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width: W } = Dimensions.get('window');

// Brand design tokens
const ACCENT = '#E31B23';
const BG = '#080808';
const CARD = '#111111';
const BORDER = 'rgba(255,255,255,0.06)';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Equipment[]>([]);
  const [popular, setPopular] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const cartItemCount = useCartStore((state) => state.items.length);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cats, feats, pops] = await Promise.all([
        fetchCategories(),
        fetchFeaturedEquipment(),
        fetchPopularEquipment()
      ]);
      setCategories(cats);
      setFeatured(feats);
      setPopular(pops);
    } catch (e) {
      console.error('Error loading home data', e);
      setError('Could not load content. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setHeroIndex(idx);
  };

  if (loading) return (
    <View style={[styles.container, styles.centered]}>
      <ActivityIndicator size="large" color={ACCENT} />
    </View>
  );

  if (error) return (
    <View style={[styles.container, styles.centered]}>
      <MaterialCommunityIcons name="wifi-off" size={48} color="#333" />
      <Text style={{ color: '#555', fontSize: 16, fontWeight: '600', marginTop: 16, textAlign: 'center', paddingHorizontal: 40 }}>{error}</Text>
      <TouchableOpacity
        onPress={loadData}
        style={{ marginTop: 24, backgroundColor: ACCENT, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 100 }}
      >
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHorizontalCard = (item: Equipment) => (
    <TouchableOpacity
      key={item.id}
      style={styles.hCard}
      onPress={() => navigation.navigate('ProductDetail', { slug: item.slug, equipment: item })}
      activeOpacity={0.88}
    >
      {item.imageUrls && item.imageUrls.length > 0 ? (
        <Image source={{ uri: item.imageUrls[0] }} style={styles.hCardImage} resizeMode="cover" />
      ) : (
        <View style={styles.hCardPlaceholder}>
          <Ionicons name="camera-outline" size={28} color="#333" />
        </View>
      )}
      <LinearGradient
        colors={['transparent', 'rgba(8,8,8,0.9)']}
        style={styles.hCardGradient}
      />
      <View style={styles.hCardContent}>
        <Text style={styles.hCardBrand}>{item.brand || 'CINEMA'}</Text>
        <Text style={styles.hCardTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.hCardPrice}>₹{item.dailyRate}<Text style={styles.hCardPer}>/day</Text></Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={ACCENT} />}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HERO CAROUSEL ── */}
      {featured.length > 0 && (
        <View style={{ height: 520 }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onHeroScroll}
            decelerationRate="fast"
            snapToInterval={W}
          >
            {featured.map((item, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.95}
                onPress={() => navigation.navigate('ProductDetail', { slug: item.slug, equipment: item })}
              >
                <ImageBackground
                  source={{ uri: item.imageUrls?.[0] }}
                  style={[styles.heroBanner, { width: W }]}
                >
                  <LinearGradient
                    colors={['rgba(8,8,8,0)', 'rgba(8,8,8,0.3)', 'rgba(8,8,8,0.85)', BG]}
                    style={StyleSheet.absoluteFill}
                    locations={[0, 0.35, 0.75, 1]}
                  />
                  {/* Red top bar accent */}
                  <View style={styles.heroTopBar}>
                    <View style={styles.heroBadge}>
                      <Text style={styles.heroBadgeText}>FEATURED</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.cartHeroBtn}
                      onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' } as any)}
                    >
                      <Ionicons name="bag-outline" size={22} color="#fff" />
                      {cartItemCount > 0 && (
                        <View style={styles.cartBadge}>
                          <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>{item.name}</Text>
                    <Text style={styles.heroPrice}>
                      From <Text style={styles.heroPriceNum}>₹{item.dailyRate}</Text>/day
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Dot indicators */}
          <View style={styles.dots}>
            {featured.map((_, i) => (
              <View key={i} style={[styles.dot, i === heroIndex && styles.dotActive]} />
            ))}
          </View>
        </View>
      )}

      {/* ── CATEGORY PILLS ── */}
      <View style={{ marginTop: -8 }}>
        <Text style={styles.sectionLabel}>Browse by Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
          <TouchableOpacity
            style={[styles.pill, styles.pillAllActive]}
            onPress={() => navigation.navigate('Catalog', {})}
          >
            <Text style={[styles.pillText, { color: '#fff' }]}>All Gear</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.pill}
              onPress={() => navigation.navigate('Catalog', { categoryId: cat.id })}
            >
              <Text style={styles.pillText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── FEATURED GEAR ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Gear</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Catalog', {})}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hGrid}
          decelerationRate="fast"
          snapToInterval={W * 0.72 + 16}
        >
          {featured.map(renderHorizontalCard)}
        </ScrollView>
      </View>

      {/* ── TRENDING NOW ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hGrid}
          decelerationRate="fast"
          snapToInterval={W * 0.72 + 16}
        >
          {popular.map(renderHorizontalCard)}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered: { justifyContent: 'center', alignItems: 'center' },

  // Hero
  heroBanner: { height: 520, justifyContent: 'flex-end' },
  heroTopBar: { position: 'absolute', top: 60, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroBadge: { backgroundColor: ACCENT, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  heroBadgeText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  cartHeroBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: BORDER },
  cartBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: ACCENT, borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  heroContent: { paddingHorizontal: 24, paddingBottom: 32 },
  heroTitle: { color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -1, lineHeight: 40, marginBottom: 8 },
  heroPrice: { color: '#aaa', fontSize: 16, fontWeight: '500' },
  heroPriceNum: { color: ACCENT, fontWeight: '800' },

  // Dot indicators
  dots: { position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: 3 },
  dotActive: { width: 20, backgroundColor: ACCENT },

  // Category pills
  sectionLabel: { color: '#555', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 24, marginBottom: 12, marginTop: 28 },
  pillRow: { paddingHorizontal: 24, paddingBottom: 4 },
  pill: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 100, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, marginRight: 10 },
  pillAllActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  pillText: { color: '#aaa', fontSize: 14, fontWeight: '700' },

  // Section
  section: { marginTop: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { color: '#FAFAFA', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  seeAll: { color: ACCENT, fontSize: 14, fontWeight: '700' },

  // Horizontal cards
  hGrid: { paddingHorizontal: 24, paddingBottom: 8 },
  hCard: { width: W * 0.72, marginRight: 16, borderRadius: 20, overflow: 'hidden', backgroundColor: CARD, borderWidth: 1, borderColor: BORDER },
  hCardImage: { width: '100%', height: 200 },
  hCardPlaceholder: { width: '100%', height: 200, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  hCardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 },
  hCardContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  hCardBrand: { color: ACCENT, fontSize: 10, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  hCardTitle: { color: '#fff', fontSize: 17, fontWeight: '800', lineHeight: 22, letterSpacing: -0.3, marginBottom: 6 },
  hCardPrice: { color: '#fff', fontSize: 15, fontWeight: '800' },
  hCardPer: { color: '#888', fontWeight: '500', fontSize: 13 },
});
