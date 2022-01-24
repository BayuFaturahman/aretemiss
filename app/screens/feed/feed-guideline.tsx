import React, {FC} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '@navigators/main-navigator';
import { HStack, VStack } from '@components/view-stack';
import FastImage from 'react-native-fast-image';
import {BackNavigation, Text} from '@components';
import { Colors, Layout, Spacing } from '@styles';
import { observer } from 'mobx-react-lite';
import logoBottom from '@assets/icons/ilead-bottom-logo.png';

const FeedGuideline: FC<StackScreenProps<NavigatorParamList, "feedGuideline">> = observer(
  ({ navigation, route }) => {
    const goBack = () => {
      navigation.goBack()
    }
    return (
      <VStack
      testID="feedTimelineMain"
      style={styles.outer}
    >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <VStack top={Spacing[42]} horizontal={Spacing[14]}>
            <Text type={'header'} underlineWidth={225}>Guideline Feed</Text>
            <VStack top={Spacing[32]}>
              <HStack horizontal={Spacing[20]} style={styles.scrollBox}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                  <Text>Perhatian! Guideline ini dibuat sebagai ground rules atau tata cara posting di Feed. Apa saja yang bisa kamu post di Feed?{'\n\n'}</Text>
                  <View style={styles.paragraphView}>
                    <Text>1.  Kegiatanmu yang berhubungan dengan winning culture “SIAP” yang diusung oleh perusahaan kita. Apapun kegiatan keseharianmu yang menunjukan value Synergy, Innovation, Accountable & Owner-like, atau Performance Focused bisa langsung di-post di Feed ya!{'\n'}</Text>
                    <Text>2.  Kekagumanmu pada semua hal yang berhubungan dengan kegiatan rekan kerjamu yang berhubungan dengan winning culture “SIAP”. Jika kamu lihat rekan kerjamu mengerjakan sesuatu yang menginspirasi, boleh banget loh di-post di Feed.{'\n'}</Text>
                    <Text>3.  Saling meninggalkan komentar yang positif dan membangun kepada sesama rekan kerja. Karena mendapatkan dukungan dari rekan kerja tuh berarti banget, ya gak?!{'\n\n'}</Text>
                  </View>
                  <Text>Apa saja yang tidak diperkenankan di dalam forum Feed?{'\n\n'}</Text>
                  <View style={styles.paragraphView}>
                    <Text>1.  Semua konten yang berhubungan dengan SARA (Suku, Agama, Ras, dan Antargolongan) tidak diperbolehkan di dalam Feed.{'\n'}</Text>
                    <Text>2.  Semua konten yang terlalu bersifat personal (Contoh: Update sedang menonton drama Korea bersama pasangan) tidak disarankan untuk di-post di Feed.{'\n'}</Text>
                    <Text>3.  Semua konten yang sifatnya menyerang user lain. Yuk jaga forumnya supaya tetap positif!{'\n\n'}</Text>
                  </View>
                  <Text>Jika ada yang membuat post dengan konten yang tidak diperkenankan, Team iLEAD berhak untuk menghapus konten dan melarang kamu untuk tidak membuat post di Feed dalam beberapa waktu. Yuk kita patuhi ground rules-nya!</Text>
                </ScrollView>
              </HStack>
            </VStack>
          </VStack>
        </SafeAreaView>
        <FastImage style={styles.bottomLogo} source={logoBottom} resizeMode={"contain"}/>
      </VStack>
    )
  },
)

const styles = StyleSheet.create({
  bottomLogo: {
    bottom: 0,
    height: Spacing[72],
  },
  outer: {
    backgroundColor: Colors.WHITE,
    flex: 1,
    justifyContent: "center",
  },
  paragraphView: {
    marginLeft: Spacing[12],
  },
  scrollBox: {
    borderColor: Colors.UNDERTONE_BLUE,
    borderRadius: Spacing[20],
    borderWidth: 1.5,
    height: 410,
  },
  scrollContent: {
    paddingVertical: Spacing[12],
  },
})

export default FeedGuideline;