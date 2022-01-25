import React, {FC, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View, Text as RnText, TouchableOpacity} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorParamList } from '@navigators/main-navigator';
import { HStack, VStack } from '@components/view-stack';
import FastImage from 'react-native-fast-image';
import {BackNavigation, Text, Button} from '@components';
import { Colors, Layout, Spacing } from '@styles';
import { observer } from 'mobx-react-lite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logoBottom from '@assets/icons/ilead-bottom-logo.png';

const FeedGuideline: FC<StackScreenProps<NavigatorParamList, "feedGuideline">> = observer(
  ({ navigation, route }) => {
    const {savedAgreeTnc} = route.params;
    const [agreeTnc, setAgreeTnc] = useState(false);
    const [errorTnc, setErrorTnc] = useState(null);
    const [alreadyAgreeTnc, setAlreadyAgreeTnc] = useState(false);
    const goBack = () => {
      navigation.goBack()
    }
    const handleAgreeTnc = () => {
      setErrorTnc(null);
      setAgreeTnc(!agreeTnc);
    }
    const handleAgreeGuideline = async () => {
      if (!agreeTnc) {
        setErrorTnc('TNC');
      } else {
        await AsyncStorage.setItem('Agree Feed Guidelines', 'true');
        setAlreadyAgreeTnc(true);
      };
    };
    return (
      <VStack
      testID="feedTimelineMain"
      style={styles.outer}
    >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <VStack top={Spacing[14]} horizontal={Spacing[14]}>
            <Text type={'header'} underlineWidth={225}>Guideline Feed</Text>
            <VStack top={Spacing[32]}>
              <HStack horizontal={Spacing[20]} style={styles.scrollBox}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                  <Text><Text type={'body-bold'}>Perhatian!</Text> Guideline ini dibuat sebagai <RnText style={styles.italicTxt}>ground rules</RnText> atau tata cara posting di Feed.{'\n'}</Text>
                  <Text type={'body-bold'}>Apa saja yang bisa kamu post di Feed?{'\n'}</Text>
                  <View>
                    <Text>1.  Kegiatanmu yang berhubungan dengan winning culture “SIAP” yang diusung oleh perusahaan kita. Apapun kegiatan keseharianmu yang menunjukan value Synergy, Innovation, Accountable & Owner-like, atau Performance Focused bisa langsung di-post di Feed ya!{'\n'}</Text>
                    <Text>2.  Kekagumanmu pada semua hal yang berhubungan dengan kegiatan rekan kerjamu yang berhubungan dengan winning culture “SIAP”. Jika kamu lihat rekan kerjamu mengerjakan sesuatu yang menginspirasi, boleh banget loh di-post di Feed.{'\n'}</Text>
                    <Text>3.  Saling meninggalkan komentar yang positif dan membangun kepada sesama rekan kerja. Karena mendapatkan dukungan dari rekan kerja tuh berarti banget, ya gak?!{'\n\n'}</Text>
                  </View>
                  <Text type={'body-bold'}>Apa saja yang tidak diperkenankan di dalam forum Feed?{'\n'}</Text>
                  <View>
                    <Text>1.  Semua konten yang berhubungan dengan SARA (Suku, Agama, Ras, dan Antargolongan) tidak diperbolehkan di dalam Feed.{'\n'}</Text>
                    <Text>2.  Semua konten yang terlalu bersifat personal (Contoh: Update sedang menonton drama Korea bersama pasangan) tidak disarankan untuk di-post di Feed.{'\n'}</Text>
                    <Text>3.  Semua konten yang sifatnya menyerang user lain. Yuk jaga forumnya supaya tetap positif!{'\n'}</Text>
                  </View>
                  <Text>Jika ada yang membuat post dengan konten yang tidak diperkenankan, Team iLEAD berhak untuk menghapus konten dan melarang kamu untuk tidak membuat post di Feed dalam beberapa waktu. Yuk kita patuhi ground rules-nya!</Text>
                </ScrollView>
              </HStack>
            </VStack>
          </VStack>
          {(!alreadyAgreeTnc && savedAgreeTnc === null) && (
            <>
              <HStack left={Spacing[48]} top={Spacing[16]} right={Spacing[84]}>
                <TouchableOpacity style={[styles.radioBtn, errorTnc && styles.errorRadioBtn]} onPress={handleAgreeTnc}>
                  {agreeTnc && (
                    <View style={styles.radioBtnFilled}/>
                  )}
                </TouchableOpacity>
                <Text>Saya telah menyetujui <Text type={'body-bold'} style={{color: Colors.MAIN_RED}}>Guideline Feed</Text> di atas. </Text>
              </HStack>
              <Button
                type={'primary'}
                text={'Setuju'}
                style={styles.mainBtn}
                onPress={handleAgreeGuideline}
              />
            </>
          )}
        </SafeAreaView>
        {(alreadyAgreeTnc || savedAgreeTnc) && (
          <FastImage style={styles.bottomLogo} source={logoBottom} resizeMode={"contain"}/>
        )}
      </VStack>
    )
  },
)

const styles = StyleSheet.create({
  bottomLogo: {
    bottom: 0,
    height: Spacing[72],
  },
  errorRadioBtn: {
    borderColor: Colors.MAIN_RED,
    borderWidth: 1.5,
  },
  italicTxt: {
    fontStyle: 'italic',
  },
  mainBtn: {
    alignSelf: 'center',
    marginTop: Spacing[14],
    width: 227,
  },
  outer: {
    backgroundColor: Colors.WHITE,
    flex: 1,
    justifyContent: "center",
  },
  radioBtn: {
    borderColor: Colors.UNDERTONE_BLUE,
    borderRadius: 16,
    borderWidth: 1.5,
    height: Spacing[28],
    justifyContent: 'center',
    marginRight: Spacing[28],
    width: Spacing[28],
  },
  radioBtnFilled: {
    alignSelf: 'center',
    backgroundColor: Colors.UNDERTONE_BLUE,
    borderColor: Colors.UNDERTONE_BLUE,
    borderRadius: 16,
    borderWidth: 1.5,
    height: Spacing[18],
    width: Spacing[18],
  },
  scrollBox: {
    borderColor: Colors.UNDERTONE_BLUE,
    borderRadius: Spacing[20],
    borderWidth: 1.5,
    height: 390,
  },
  scrollContent: {
    paddingVertical: Spacing[12],
  },
})

export default FeedGuideline;