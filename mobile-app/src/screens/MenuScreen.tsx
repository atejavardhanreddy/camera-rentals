import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, Linking
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../../App';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCENT  = '#E31B23';
const BG      = '#080808';
const CARD    = '#111111';
const BORDER  = 'rgba(255,255,255,0.06)';
const TEXT_P  = '#FAFAFA';
const TEXT_S  = '#666666';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Menu'>,
  NativeStackScreenProps<RootStackParamList>
>;

type MenuItemConfig = {
  title: string;
  url: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
};

const menuItems: MenuItemConfig[] = [
  { title: 'About Us',          url: 'https://rentals.penmenstudios.com/about',             icon: 'information-circle-outline', tint: '#3b82f6' },
  { title: 'Contact Us',        url: 'https://rentals.penmenstudios.com/contact',           icon: 'mail-outline',               tint: '#22c55e' },
  { title: 'Privacy Policy',    url: 'https://rentals.penmenstudios.com/privacy-policy',    icon: 'shield-checkmark-outline',   tint: '#a855f7' },
  { title: 'Terms & Conditions',url: 'https://rentals.penmenstudios.com/terms-conditions',  icon: 'document-text-outline',      tint: ACCENT },
];

const quickLinks = [
  { title: 'Browse Catalog',    icon: 'camera-outline' as keyof typeof Ionicons.glyphMap,   screen: 'Catalog' },
  { title: 'View Brands',       icon: 'layers-outline' as keyof typeof Ionicons.glyphMap,   screen: 'Brands' },
];

export default function MenuScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const MenuItem = ({ item, isFirst, isLast }: { item: MenuItemConfig; isFirst: boolean; isLast: boolean }) => (
    <TouchableOpacity
      style={[styles.menuRow, isFirst && styles.firstRow, isLast && styles.lastRow]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('WebView', { url: item.url, title: item.title })}
    >
      <View style={[styles.iconBox, { backgroundColor: item.tint + '15', borderColor: item.tint + '30' }]}>
        <Ionicons name={item.icon} size={20} color={item.tint} />
      </View>
      <Text style={styles.menuTitle}>{item.title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#333" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]}>

        {/* Title */}
        <Text style={styles.pageTitle}>More</Text>

        {/* Identity card */}
        <View style={styles.identityCard}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>D'</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.identityName}>D'RENTALS</Text>
            <Text style={styles.identityTag}>Premium Cinema Equipment Rental</Text>
          </View>
          <View style={styles.identityBadge}>
            <Text style={styles.identityBadgeText}>v1.0</Text>
          </View>
        </View>

        {/* Quick Links */}
        <Text style={styles.sectionLabel}>Quick Access</Text>
        <View style={styles.group}>
          {quickLinks.map((item, i) => (
            <React.Fragment key={item.screen}>
              <TouchableOpacity
                style={[styles.menuRow, i === 0 && styles.firstRow, i === quickLinks.length - 1 && styles.lastRow]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MainTabs', { screen: item.screen } as any)}
              >
                <View style={[styles.iconBox, { backgroundColor: ACCENT + '15', borderColor: ACCENT + '30' }]}>
                  <Ionicons name={item.icon} size={20} color={ACCENT} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={18} color="#333" />
              </TouchableOpacity>
              {i < quickLinks.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Company Info */}
        <Text style={styles.sectionLabel}>Company</Text>
        <View style={styles.group}>
          {menuItems.map((item, i) => (
            <React.Fragment key={i}>
              <MenuItem item={item} isFirst={i === 0} isLast={i === menuItems.length - 1} />
              {i < menuItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* WhatsApp CTA */}
        <TouchableOpacity
          style={styles.whatsappBtn}
          activeOpacity={0.85}
          onPress={() => Linking.openURL('https://wa.me/917794872701')}
        >
          <Ionicons name="logo-whatsapp" size={22} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.whatsappText}>Chat with us on WhatsApp</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>D'RENTALS v1.0.0</Text>
          <Text style={styles.footerCopy}>© 2026 D'RENTALS Cinema Collective</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: 20 },

  pageTitle: { color: TEXT_P, fontSize: 34, fontWeight: '900', letterSpacing: -1, marginBottom: 24 },

  // Identity card
  identityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: BORDER, marginBottom: 32 },
  logoMark: { width: 52, height: 52, borderRadius: 14, backgroundColor: ACCENT, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  logoMarkText: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  identityName: { color: TEXT_P, fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },
  identityTag: { color: TEXT_S, fontSize: 13, fontWeight: '500', marginTop: 2 },
  identityBadge: { backgroundColor: '#1a1a1a', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: BORDER },
  identityBadgeText: { color: TEXT_S, fontSize: 12, fontWeight: '700' },

  sectionLabel: { color: '#444', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, marginLeft: 4 },
  group: { backgroundColor: CARD, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: BORDER, marginBottom: 24 },

  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  firstRow: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  lastRow: { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: BORDER, marginLeft: 68 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1 },
  menuTitle: { flex: 1, color: TEXT_P, fontSize: 16, fontWeight: '600' },

  // WhatsApp button
  whatsappBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', paddingVertical: 16, borderRadius: 100, marginBottom: 32, shadowColor: '#25D366', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  whatsappText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  footer: { alignItems: 'center' },
  footerVersion: { color: '#2a2a2a', fontSize: 13, fontWeight: '700' },
  footerCopy: { color: '#1a1a1a', fontSize: 12, marginTop: 4 },
});
