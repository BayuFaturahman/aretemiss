import React, { FC } from "react"
import {SafeAreaView, ScrollView} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { BackNavigation, Text } from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {VStack} from "@components/view-stack";
import {Colors, Layout, Spacing} from "@styles";
import Spacer from "@components/spacer";
import FastImage from "react-native-fast-image";
import logoBottom from "@assets/icons/ilead_abm.png";

const TermsConds: FC<StackScreenProps<NavigatorParamList, "termsConds">> = observer(
  ({ navigation }) => {

    const goBack = () => {
      navigation.goBack()
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <Text type={"header"} text="Selamat datang di iLEAD." />

          <ScrollView bounces={false}
                      style={[Layout.flex, Layout.heightFull, {margin: Spacing[12], borderWidth: Spacing[2], borderColor: Colors.UNDERTONE_BLUE, borderRadius: Spacing[16]}]}>
            <VStack top={Spacing[24]} horizontal={Spacing[24]}>
              <Text type={"body"} text={TERMS_N_CONDITIONS} />
            </VStack>
          </ScrollView>
          <FastImage style={{
            height: Spacing[72],
            bottom: 0
          }} source={logoBottom} resizeMode={"contain"}
          />
        </SafeAreaView>
      </VStack>
    )
  },
)

export default TermsConds

const TERMS_N_CONDITIONS = "Perhatian! Sebagai pengguna aplikasi iLEAD, Anda wajib untuk membaca dan mengetahui syarat dan ketentuan penggunaan aplikasi ini secara seksama. Dengan menekan tombol “Setuju”, Anda mengakui dan menyetujui syarat dan ketentuan penggunaan yang berlaku. Syarat dan ketentuan penggunaan ini merupakan bentuk perjanjian yang sah antara pengembang aplikasi iLEAD (selanjutnya akan ditulis sebagai “Kami”) dan Anda sebagai pengguna mengenai tata cara dan ketentuan penggunaan aplikasi ini.\n" +
  "\n" +
  "Syarat dan ketentuan penggunaan aplikasi iLEAD dapat berubah sewaktu-waktu. Jika ada perubahan atas syarat dan ketentuan penggunaan, Anda sebagai pengguna akan diberitahukan mengenai perubahan tersebut pada saat Anda mengakses aplikasi ini. \n" +
  "\n" +
  "Apabila Anda tidak menyetujui syarat dan ketentuan penggunaan ini, Anda diperbolehkan untuk menghapus aplikasi mengajukan permintaan untuk hapus akun (apabila sudah mendaftarkan diri di dalam aplikasi)."
