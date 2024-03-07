import React, { FC, useCallback, useEffect, useState } from "react"
import {KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { BackNavigation, Button, DismissKeyboard, Text, TextField } from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {Colors, Layout, Spacing} from "@styles";

import { Formik } from "formik"
import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from "react-native-loading-spinner-overlay"
import messaging from "@react-native-firebase/messaging";
import {AuthBottomLogo} from "@components/auth-bottom-logo";
import FastImage from "react-native-fast-image";
import {images} from "@assets/images";

const VerifyPhone: FC<StackScreenProps<NavigatorParamList, "verifyPhone">> = observer(
  ({ navigation }) => {
    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>("")
    const [isEmailValid, setIsEmailValid] = useState<boolean>(true)
    const [isConfirmEmailValid, setIsConfirmEmailValid] = useState<boolean>(true)

    const [isEmailMatch, setIsEmailMatch] = useState<boolean>(true)
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true)

    const [isTermConsSelected, setIsTermConsSelected] = useState<boolean>(false)
    const [isTermConsError, setIsTermConsError] = useState<boolean>(false)

    const toggleTermCons = () => {
      return(
        setIsTermConsSelected(!isTermConsSelected)
      )
    }

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

    const goBack = () => {
      navigation.goBack()
    }

    const goToTermsConds = () => {
      navigation.navigate("termsConds")
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

      if (email === "" || confirmEmail === "" || password === "" || !isTermConsSelected) {
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

        if(!isTermConsSelected){
          setIsTermConsError(true)
        }else{
          setIsTermConsError(false)
        }
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

    const TCCheckBox = ({isSelected = false, onPress, isError = false}) => {
      return(
        <TouchableOpacity onPress={onPress}>
          <VStack>
            <View style={{
              height: Spacing[24],
              width: Spacing[24],
              backgroundColor: isSelected ? Colors.BRIGHT_BLUE : Colors.GRAY200,
              borderRadius: Spacing[128], borderWidth: Spacing[2],
              borderColor: isError ? Colors.MAIN_RED : Colors.ABM_LIGHT_BLUE
            }} />
          </VStack>
        </TouchableOpacity>
      )
    }

    return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          testID="CoachingJournalMain"
          style={{ backgroundColor: Colors.ABM_BG_BLUE, flex: 1, justifyContent: "center" }}
        >
          <ScrollView bounces={false} style={[Layout.flex, Layout.heightFull]}>
            {/*<SafeAreaView>*/}
              <Spacer height={Spacing[42]}/>
              <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
              <FastImage style={{
                height: Spacing[256],
                width: '100%'
              }} source={images.abmWoman} resizeMode={"contain"}/>
              <Formik
                initialValues={{ email: "", confirmEmail: "", password: "" }}
                onSubmit={(values) => checkInputedData(values)}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <>
                    <VStack top={Spacing[24]} horizontal={Spacing[24]}>
                      <Text type={"header"} text="Selamat datang di iLEAD." />

                      {authStore.errorCode !== 37 &&
                        <Text type={"warning"} style={{ textAlign: "center" }}>
                          {errorMessage || authStore.errorMessage}
                        </Text>
                      }

                      <Spacer height={Spacing[16]} />
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

                    <HStack horizontal={Spacing[48]}>
                      <TCCheckBox onPress={toggleTermCons} isSelected={isTermConsSelected} isError={isTermConsError} />
                      <Spacer width={Spacing[12]} />
                      <Text type={"body"}>
                        Saya telah membaca dan menyetujui{` \n`}
                        <Text type={"body-bold"} style={{color: Colors.MAIN_RED}} onPress={goToTermsConds}>
                          {`syarat dan ketentuan `}
                        </Text>
                        penggunaan aplikasi iLEAD.
                      </Text>
                    </HStack>

                    <VStack top={Spacing[32]} horizontal={Spacing[96]}>
                      <Button
                        type={"primary"}
                        text={"Registrasi"}
                        onPress={() => handleSubmit()}
                      />
                      <Spacer height={Spacing[8]} />
                      <Button type={"secondary"} text={"Login"} onPress={goToLogin} />
                    </VStack>
                  </>
                )}
              </Formik>
              <AuthBottomLogo />
              <Spacer height={Spacing[42]}/>
            {/*</SafeAreaView>*/}
          </ScrollView>
          <Spinner
            visible={authStore.isLoading}
            textContent={"Memuat..."}
          />
        </KeyboardAvoidingView>
    )
  },
)

export default VerifyPhone
