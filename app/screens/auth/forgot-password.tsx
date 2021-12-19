import React, {FC, useCallback, useEffect, useState} from "react"
import { SafeAreaView, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import {
  Button, DismissKeyboard,
  Text,
  TextField,
} from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Spacing} from "@styles";
import logoBottom from "@assets/icons/ilead_abm.png";
import FastImage from "react-native-fast-image";
import {useStores} from "../../bootstrap/context.boostrap";

import Spinner from 'react-native-loading-spinner-overlay';

const forgotPassword: FC<StackScreenProps<NavigatorParamList, "verifyPhone">> = observer(
  ({ navigation }) => {

    const [isError, setIsError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')

    const goToOTP = () => navigation.navigate("verifyOTP")
    const goToLogin = () => navigation.navigate("login")

    const { authStore } = useStores()

    useEffect(() => {
      authStore.isForgotPasswordSuccess = null
      authStore.formReset()
      authStore.resetAuthStore()
    }, [])

    useEffect(() => {

    }, [authStore.isForgotPasswordSuccess])

    const submitEmail = useCallback(async ()=>{
      await authStore.forgotPassword(email)
    },[email])

    const styles = StyleSheet.create({

    })

    const renderEmailForm = () => {
      return(
        <>
          <VStack top={Spacing[24]} horizontal={Spacing[24]}>
            <Text type={'header'} text="Selamat datang di iLEAD." />
            <Spacer height={Spacing[24]} />

             <Text type={'body'} style={{textAlign: 'center'}}>
               {authStore.errorMessage === null ?
               <>
                 Lupa password-mu? Tenang.
                 Masukan alamat e-mail yang kamu registrasikan di iLEAD. Kami akan segera mengirimkan link untuk mengubah password lamamu menjadi password yang baru.
               </> : null }

             </Text>

            <Text type={'warning'} style={{textAlign: 'center'}}>
              {authStore.errorMessage}
            </Text>

            <Spacer height={Spacing[32]} />
            <TextField
              value={email}
              onChangeText={setEmail}
              label="Masukan alamat e-mail yang sudah diregistrasi:"
              style={{ paddingTop: 0}}
              isError={authStore.errorMessage !== null}
            />
          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[96]}>
            <Button
              type={"primary"}
              text={"Kirim"}
              onPress={submitEmail}
            />
            <Spacer height={Spacing[8]} />
            <Button
              type={"secondary"}
              text={"Kembali ke halaman awal"}
              onPress={goToLogin}
            />
          </VStack>
        </>
      )
    }

    const renderEmailSent = () => {
      return(
        <>
          <VStack top={Spacing[24]} horizontal={Spacing[24]}>
            <Text type={'header'} text="Selamat datang di iLEAD." />
            <Spacer height={Spacing[24]} />

            <Text type={'body'} style={{textAlign: 'center'}}>
              Berhasil! E-mail dengan link untuk mengubah password-mu sudah dikirim. Coba cek kotak masuk e-mailmu. Cek juga kotak spam-nya ya!
            </Text>

          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[96]}>
            <Button
              type={"primary"}
              text={"Kirim ulang e-mail"}
              onPress={submitEmail}
            />
            <Spacer height={Spacing[8]} />
            <Button
              type={"secondary"}
              text={"Kembali ke halaman awal"}
              onPress={goToLogin}
            />
          </VStack>
        </>
      )
    }

    const renderPasswordConfirmationForm = () => {
      return(
        <>
          <VStack top={Spacing[24]} horizontal={Spacing[24]}>
            <Text type={'header'} text="Selamat datang di iLEAD." />
            <Spacer height={Spacing[24]} />

            <Text type={'body'} style={{textAlign: 'center'}}>
              Wah, apakah kamu mengalami kesulitan untuk login? Tenang saja. Kamu bisa mengganti password lamamu menjadi password baru.
            </Text>

            <Spacer height={Spacing[32]} />
            <TextField
              label="Password baru:"
              style={{ paddingTop: 0}}
              isError={false}
              secureTextEntry={true}
            />

            <TextField
              label="Tulis ulang password barumu:"
              style={{ paddingTop: 0}}
              isError={false}
              secureTextEntry={true}
            />

          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[96]}>
            <Button
              type={"primary"}
              text={"Kirim ulang e-mail"}
              onPress={goToOTP}
            />
            <Spacer height={Spacing[8]} />
            <Button
              type={"secondary"}
              text={"Kembali ke halaman awal"}
              onPress={goToLogin}
            />
          </VStack>
        </>
      )
    }

    const renderPhonePasswordConfirmationForm = () => {
      return(
        <>
          <VStack top={Spacing[24]} horizontal={Spacing[24]}>
            <Text type={'header'} text="Selamat datang di iLEAD." />
            <Spacer height={Spacing[24]} />

            <Text type={'body'} style={{textAlign: 'center'}}>
              Selamat! Kamu berhasil mengubah password-mu. Sekarang, coba login lagi yuk!
            </Text>

            <Spacer height={Spacing[32]} />
            <TextField
              label="Masukan no. HP yang sudah diregistrasi:"
              style={{ paddingTop: 0}}
              isError={false}
              secureTextEntry={true}
            />

            <TextField
              label="Password:"
              style={{ paddingTop: 0}}
              isError={false}
              secureTextEntry={true}
            />

          </VStack>
          <VStack top={Spacing[32]} horizontal={Spacing[96]}>
            <Button
              type={"primary"}
              text={"Kirim ulang e-mail"}
              onPress={goToOTP}
            />
            <Spacer height={Spacing[8]} />
            <Button
              type={"secondary"}
              text={"Lupa password"}
              onPress={goToLogin}
            />
          </VStack>
        </>
      )
    }

    return (
      <DismissKeyboard>
        <VStack testID="CoachingJournalMain" style={{backgroundColor: Colors.WHITE, flex: 1, justifyContent: 'center'}}>
          {/* <GradientBackground colors={["#422443", "#281b34"]} /> */}
          <SafeAreaView style={{flex: 1}}>
            <Spacer />
            {authStore.isForgotPasswordSuccess ? renderEmailSent() : renderEmailForm() }
            {/* {renderEmailSent()} */}
            {/* {renderPasswordConfirmationForm()} */}
            {/* {renderPhonePasswordConfirmationForm()} */}
            <Spacer />
            <FastImage style={{
              height: Spacing[72],
              bottom: 0
            }} source={logoBottom} resizeMode={"contain"}/>
          </SafeAreaView>
          <Spinner
            visible={authStore.isLoading}
            textContent={'Memuat...'}
            // textStyle={styles.spinnerTextStyle}
          />
        </VStack>
      </DismissKeyboard>
    )
  },
)

export default forgotPassword;
