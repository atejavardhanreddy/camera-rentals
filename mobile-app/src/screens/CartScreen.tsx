import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Linking, Alert, Image, Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useCartStore } from '../store/cartStore';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCENT    = '#E31B23';
const ACCENT_DIM = 'rgba(227,27,35,0.12)';
const BG        = '#080808';
const CARD      = '#111111';
const BORDER    = 'rgba(255,255,255,0.06)';
const TEXT_P    = '#FAFAFA';
const TEXT_S    = '#666666';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Cart'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function CartScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { items, removeItem, clearCart, getTotal } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = "Hi, I'd like to reserve the following items:\n\n";
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.equipment.name}*\n`;
      message += `   Qty: ${item.quantity} | Duration: ${item.durationDays} days\n`;
      message += `   Rate: ₹${item.equipment.dailyRate}/day\n\n`;
    });
    message += `*Total Estimated Rental: ₹${getTotal().toFixed(2)}*\n\n`;
    message += "Please let me know if these are available and the next steps for payment/deposit.";

    const phoneNumber = "+917794872701";
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(whatsappUrl)
      .then(supported => {
        if (!supported) {
          Alert.alert("WhatsApp not installed", "Please install WhatsApp to place your order.");
        } else {
          return Linking.openURL(whatsappUrl);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      {item.equipment.imageUrls && item.equipment.imageUrls.length > 0 ? (
        <Image source={{ uri: item.equipment.imageUrls[0] }} style={styles.cartImage} resizeMode="cover" />
      ) : (
        <View style={styles.imgPlaceholder}>
          <Ionicons name="camera-outline" size={20} color="#333" />
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.equipment.name}</Text>
        {item.equipment.brand && (
          <Text style={styles.itemBrand}>{item.equipment.brand}</Text>
        )}
        <Text style={styles.itemMeta}>{item.quantity} unit · {item.durationDays} day(s)</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemPrice}>
          ₹{(parseFloat(item.equipment.dailyRate) * item.quantity * item.durationDays).toFixed(0)}
        </Text>
        <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.equipment.id)}>
          <Ionicons name="trash-outline" size={16} color={ACCENT} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Empty state
  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <View style={styles.emptyIcon}>
          <Ionicons name="bag-outline" size={48} color="#222" />
        </View>
        <Text style={styles.emptyTitle}>Your bag is empty</Text>
        <Text style={styles.emptySubtitle}>Browse our catalog and add gear to get started</Text>
        <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Catalog', {})}>
          <Text style={styles.emptyBtnText}>Browse Gear</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.headerRight}>
          <View style={styles.itemCountBadge}>
            <Text style={styles.itemCountText}>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity onPress={clearCart} style={{ marginLeft: 12 }}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.equipment.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 160 }]}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Action Bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 8 }]}>
        {Platform.OS === 'ios'
          ? <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          : <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,8,0.96)' }]} />
        }
        <View style={styles.actionContent}>
          <View>
            <Text style={styles.actionLabel}>Total Estimate</Text>
            <Text style={styles.actionTotal}>₹{getTotal().toFixed(0)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.checkoutText}>Request via WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: { paddingHorizontal: 24, paddingBottom: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  headerTitle: { color: TEXT_P, fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  itemCountBadge: { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  itemCountText: { color: TEXT_S, fontSize: 13, fontWeight: '700' },
  clearText: { color: ACCENT, fontSize: 14, fontWeight: '700' },

  list: { padding: 20 },

  cartItem: { flexDirection: 'row', backgroundColor: CARD, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: BORDER, marginBottom: 14 },
  cartImage: { width: 85, height: 85, backgroundColor: '#1a1a1a' },
  imgPlaceholder: { width: 85, height: 85, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1, padding: 14, justifyContent: 'center' },
  itemName: { color: TEXT_P, fontSize: 15, fontWeight: '700', lineHeight: 20, marginBottom: 4 },
  itemBrand: { color: ACCENT, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  itemMeta: { color: TEXT_S, fontSize: 13, fontWeight: '500' },
  itemRight: { alignItems: 'flex-end', justifyContent: 'space-between', padding: 14 },
  itemPrice: { color: TEXT_P, fontSize: 17, fontWeight: '900' },
  removeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: ACCENT_DIM, borderWidth: 1, borderColor: 'rgba(227,27,35,0.2)', justifyContent: 'center', alignItems: 'center' },

  // Empty state
  emptyContainer: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { color: TEXT_P, fontSize: 24, fontWeight: '800', marginBottom: 8, letterSpacing: -0.5 },
  emptySubtitle: { color: TEXT_S, fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  emptyBtn: { backgroundColor: ACCENT, paddingVertical: 16, paddingHorizontal: 36, borderRadius: 100, shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  emptyBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  // Action bar
  actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER },
  actionContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16 },
  actionLabel: { color: TEXT_S, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  actionTotal: { color: TEXT_P, fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginTop: 2 },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: ACCENT, paddingVertical: 16, paddingHorizontal: 24, borderRadius: 100, shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  checkoutText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
