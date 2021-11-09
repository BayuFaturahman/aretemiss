import React, { FC, useCallback, useEffect, useState } from "react"
import { SafeAreaView, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { BackNavigation, Button, DismissKeyboard, Text, TextField } from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Spacing} from "@styles";
import logoBottom from "@assets/icons/ilead_abm.png";
import FastImage from "react-native-fast-image";

import { Formik } from "formik"
import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from "react-native-loading-spinner-overlay"
import { useFocusEffect } from "@react-navigation/native"
import messaging from "@react-native-firebase/messaging";

const VerifyPhone: FC<StackScreenProps<NavigatorParamList, "verifyPhone">> = observer(
  ({ navigation }) => {
    // const [phoneNumber, setPhoneNumber] = useState<string>("")
    // const [phoneNumberVerify, setPhoneNumberVerify] = useState<string>("")
    // const [password, setPassword] = useState<string>("")
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>("")
    const [isEmailValid, setIsEmailValid] = useState<boolean>(true)
    const [isConfirmEmailValid, setIsConfirmEmailValid] = useState<boolean>(true)

    const [isEmailMatch, setIsEmailMatch] = useState<boolean>(true)
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true)

    const { authStore } = useStores()

    const nextScreen = () => navigation.navigate("verifyOTP")
    const goToLogin = () => navigation.navigate("login")

    const submitVerify = useCallback(async (data) => {
      const { email, password } = data

      const token = await messaging().getToken();

      console.log('### FCM token register ###');
      console.log(token);

      authStore.resetLoginState();
      console.log("Submit verify, masuk ke authstore.signup");
      await authStore.signup(email, password, token)
    }, [])

    useEffect(() => {
      authStore.formReset()
      authStore.resetAuthStore()
    }, [])

    // useFocusEffect(useCallback(() => {
    //   authStore.formReset()
    //   authStore.resetAuthStore()
    // }, [authStore.otp, authStore.token, authStore.isLoading]))

    useEffect(() => {
      console.log("is loading")
      console.log(authStore.isLoading)
    }, [authStore.isLoading])

    useEffect(() => {
      console.log("is error")
      if (authStore.errorMessage !== null) {
        setIsError(true)
      }
      if (errorMessage !== "") {
        setIsError(true)
      }
    }, [authStore.errorMessage, errorMessage])

    useEffect(() => {
      console.log("register succeed")
      if (authStore.otp !== null) {
        setIsError(false)
        nextScreen()
      }
    }, [authStore.otp])

    const styles = StyleSheet.create({})

    const goBack = () => {
      navigation.goBack()
    }

    const validateEmail = (email) => {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
      if (reg.test(email) === false) {
        console.log("Email is Not Correct")
        setErrorMessage(
          "Alamat email yang kamu tulis formatnya salah. Pastikan alamat emailnya sudah kamu tulis dengan benar ya!",
        )
        return false
      } else {
        console.log("Email Correct")
        return true
      }
    }

    const checkInputedData = (data) => {
      authStore.formReset()
      resetState()

      const { email, confirmEmail, password } = data

      if (email === "" || confirmEmail === "" || password === "") {
        if (email === "") {
          setIsEmailValid(false)
        }

        if (confirmEmail === "") {
          setIsConfirmEmailValid(false)
        }

        if (password === "") {
          setIsPasswordValid(false)
        }
        setIsError(true)
        setErrorMessage('Kayaknya ada yang belum diisi nih. \nYuk isi semua kolomnya!')
        return
      }

      if (!validateEmail(email) || !validateEmail(confirmEmail)) {
        if (!validateEmail(email)) {
          setIsEmailValid(false)
        }

        if (!validateEmail(confirmEmail)) {
          setIsConfirmEmailValid(false)
        }
        return
      }


      if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
        setErrorMessage(
          "Hmm. Kelihatannya kedua email yang kamu isi tidak sama. Coba samakan email-nya dulu yah, baru bisa diproses nih.",
        )
        setIsEmailMatch(false)
        console.log(errorMessage)
        return
      }

      if (password.length < 8) {
        setIsPasswordValid(false)
        setErrorMessage(
          "Password minimal 8 karakter, memiliki huruf besar dan kecil, serta memiliki angka dan simbol (!, %, &, dkk.)",
        )
        return
      }

      submitVerify(data)
    }

    const resetState = () => {
      setIsEmailMatch(true)
      setIsEmailValid(true)
      setIsConfirmEmailValid(true)
      setIsPasswordValid(true)
      setErrorMessage('')
    }

    return (
      <DismissKeyboard>
        <VStack
          testID="CoachingJournalMain"
          style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
        >
          {/* <GradientBackground colors={["#422443", "#281b34"]} /> */}
          <SafeAreaView style={{ flex: 1 }}>
            <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
            <Spacer />
            <Formik
              initialValues={{ email: "", confirmEmail: "", password: "" }}
              onSubmit={(values) => checkInputedData(values)}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                // <View>
                <>
                  <VStack top={Spacing[24]} horizontal={Spacing[24]}>
                    <Text type={"header"} text="Selamat datang di iLEAD." />
                    <Spacer height={Spacing[24]} />

                    {authStore.errorCode !== 37 &&
                      <Text type={"warning"} style={{ textAlign: "center" }}>
                        {errorMessage || authStore.errorMessage}
                      </Text>
                    }

                    <Spacer height={Spacing[32]} />
                    <TextField
                      label="Alamat E-mail:"
                      style={{ paddingTop: 0 }}
                      isRequired={true}
                      isError={
                        // isError &&
                        (authStore.errorCode === 1 ||
                          authStore.errorCode === 10 ||
                          authStore.errorCode === 14 ||
                          authStore.errorCode === 4 ||
                          !isEmailValid ||
                          !isEmailMatch)
                      }
                      // onBlur={() => validateEmail(values.email)}
                      onChangeText={handleChange("email")}
                      value={values.email}
                    />
                    <TextField
                      label="Masukan kembali alamat E-mail:"
                      style={{ paddingTop: 0 }}
                      isRequired={true}
                      isError={
                        // isError &&
                        (authStore.errorCode === 1 ||
                          authStore.errorCode === 10 ||
                          authStore.errorCode === 14 ||
                          authStore.errorCode === 4 ||
                          !isConfirmEmailValid ||
                          !isEmailMatch)
                      }
                      // onBlur={() => validateEmail(values.confirmEmail)}
                      onChangeText={handleChange("confirmEmail")}
                      value={values.confirmEmail}
                    />
                    <TextField
                      label="Password baru:"
                      style={{ paddingTop: 0 }}
                      secureTextEntry={true}
                      isRequired={true}
                      isError={
                        // isError &&
                        (authStore.errorCode === 3 ||
                          authStore.errorCode === 15 ||
                          authStore.errorCode === 10 ||
                          authStore.errorCode === 37 ||
                          !isPasswordValid)
                      }
                      onChangeText={handleChange("password")}
                      value={values.password}
                    />
                    {authStore.errorCode === 37 && (
                      <Text type={"warning"} style={{ textAlign: "center" }}>
                        {authStore.errorMessage}
                      </Text>
                    )}
                  </VStack>
                  <VStack top={Spacing[32]} horizontal={Spacing[96]}>
                    <Button
                      type={"primary"}
                      // text={"Kirim SMS verifikasi"}
                      text={"Kirim verifikasi"}
                      onPress={() => handleSubmit()}
                    />
                    <Spacer height={Spacing[8]} />
                    <Button type={"secondary"} text={"Login"} onPress={goToLogin} />
                  </VStack>
                </>
              )}
            </Formik>
            <Spacer />
            <FastImage style={{
              height: Spacing[72],
              bottom: 0
            }} source={logoBottom} resizeMode={"contain"}/>
          </SafeAreaView>
          <Spinner
            visible={authStore.isLoading}
            textContent={"Memuat..."}
            // textStyle={styles.spinnerTextStyle}
          />
        </VStack>
      </DismissKeyboard>
    )
  },
)

export default VerifyPhone
