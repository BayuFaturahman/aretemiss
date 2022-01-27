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
                  <Text type={'body-bold'}>Apa saja konten yang dapat dipublikasikan pada forum feed?{'\n'}</Text>
                  <View>
                    <Text>1.  Kegiatan yang menunjukan dirimu sebagai seorang JUARA. Apapun kegiatan kamu yang selaras dengan 4 prinsip Budaya Juara dapat di post.{'\n'}</Text>
                    <Text>2.  Aktivitas rekan kerjamu yang selaras dengan 4 prinsip Budaya Juara. Saling meninggalkan komentar yang positif dan membangun kepada sesama rekan kerja. Karena mendapatkan dukungan dari rekan kerja tuh berarti banget, ya gak?!{'\n'}</Text>
                  </View>
                  <Text type={'body-bold'}>Apa saja yang tidak diperkenankan di dalam forum Feed?{'\n'}</Text>
                  <View>
                    <Text>1.  Semua konten yang berhubungan dengan SARA (Suku, Agama, Ras, dan Antargolongan) tidak diperbolehkan di dalam feed.{'\n'}</Text>
                    <Text>2.  Konten yang tidak mengandung 4 prinsip Budaya Juara dan menginspirasi orang lain untuk lebih baik.{'\n'}</Text>
                  </View>
                  <Text>Konten atau komentar yang merendahkan, mengadu domba, dan fitnah tidak diperbolehkan. Berilah kritik atau komentar yang membangun sehingga diskusi menjadi lebih seru, menguntungkan, dan menginspirasi.{'\n'}</Text>
                  <Text>Team iLEAD berhak untuk menghapus konten dan memblokir  user dalam jangka waktu tertentu. Yuk kita patuhi <RnText style={styles.italicTxt}>ground rules</RnText>-nya!</Text>
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