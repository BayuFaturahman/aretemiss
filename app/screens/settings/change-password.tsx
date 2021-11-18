import React, { FC, useCallback, useState, useEffect } from "react"
import {KeyboardAvoidingView, Platform, SafeAreaView, ScrollView} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { Formik } from "formik"
import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from "react-native-loading-spinner-overlay"

const ChangePassword: FC<StackScreenProps<NavigatorParamList, "changePassword">> = observer(
  ({ navigation }) => {
    const { authStore } = useStores()
    const [isNewPasswordDuplicate, setIsNewPasswordDuplicate] = useState<boolean>(false)
    const [isNewPasswordMatch, setIsNewPasswordMatch] = useState<boolean>(false)
    const [isSubmitPasswordChange, setIsSubmitPasswordChange] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const goBack = () => navigation.goBack()

    const goToMyAccount = () => navigation.navigate("myAccount")

    const logout = useCallback(() => {
      authStore.resetAuthStore()
    }, [])

    useEffect(() => {
      authStore.formReset()
    }, [])


    const checkPassword = (passwords) => {
      authStore.formReset()
      setIsSubmitPasswordChange(true)

      const { confirmNewPassword, newPassword, oldPassword } = passwords
      if (oldPassword === newPassword) {
        setErrorMessage("Woops. Password lama dan password barumu tidak boleh sama.")
        setIsNewPasswordDuplicate(true)
        setIsNewPasswordMatch(true)
        return
      }

      if (newPassword.length === 0 || newPassword != confirmNewPassword) {
        setErrorMessage(
          "Hmm. Kelihatannya kedua password yang kamu isi tidak sama. Coba samakan password-nya dulu yah, baru bisa diproses nih.",
        )
        setIsNewPasswordMatch(false)
        setIsNewPasswordDuplicate(false)
        return
      }

      setIsNewPasswordMatch(true)
      setIsNewPasswordDuplicate(false)
      setErrorMessage("")
      // setIsPasswordMatch(true)
      changePassword(oldPassword, newPassword)
    }

    /**
     * Not finish: how to do show error message from API
     */
    const changePassword = useCallback(async (oldPassword, newPassword) => {
      await authStore.changePassword(oldPassword, newPassword)
      // setIsSubmitPasswordChange(false)
      if (authStore.errorCode===null) {
        console.log('change password success')
        goBackSuccess()
      }

    }, [])

    const goBackSuccess = () => {
      navigation.navigate("myAccount", {
        isPasswordChange: true
      })
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={Layout.flex}
      >
        <VStack
          testID="CoachingJournalMain"
          style={{ backgroundColor: Colors.UNDERTONE_BLUE, flex: 1, justifyContent: "center" }}
        >
          <SafeAreaView style={Layout.flex}>
            <BackNavigation goBack={goBack} />
            <ScrollView>
            <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
              <Spacer height={Spacing[24]} />
              <Text
                type={"header"}
                style={{ color: Colors.WHITE, fontSize: Spacing[16] }}
                text="Change Password"
              />
              <Spacer height={Spacing[32]} />
            </VStack>
            <VStack
              top={Spacing[32]}
              horizontal={Spacing[24]}
              style={[
                Layout.heightFull,
                {
                  backgroundColor: Colors.WHITE,
                  borderTopStartRadius: Spacing[48],
                  borderTopEndRadius: Spacing[48],
                },
              ]}
            >
              {isSubmitPasswordChange && (
                <Text type={"warning"} style={{ textAlign: "center" }}>
                  {errorMessage}
                </Text>
              )}
              <VStack top={Spacing[32]} horizontal={Spacing[24]}>
               {authStore.errorCode===15 &&
                  <Text type={'warning'} style={{textAlign: 'center'}}>
                    {authStore.errorMessage}
                  </Text>
                }

                <Formik
                  initialValues={{ oldPassword: "", newPassword: "", confirmNewPassword: "" }}
                  onSubmit={(values) => checkPassword(values)}
                >
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    // <View>
                    <>
                      <VStack top={Spacing[32]} horizontal={Spacing[24]}>
                        <Spacer height={Spacing[16]} />
                        <TextField
                          label="Password saat ini:"
                          style={{ paddingTop: 0 }}
                          isRequired={false}
                          secureTextEntry={true}
                          isError={isSubmitPasswordChange && (isNewPasswordDuplicate || (authStore.errorCode === 15))}
                          value={values.oldPassword}
                          onChangeText={handleChange("oldPassword")}
                        />
                        <Spacer height={Spacing[16]} />
                        <TextField
                          label="Password baru:"
                          style={{ paddingTop: 0 }}
                          isRequired={false}
                          secureTextEntry={true}
                          isError={
                            isSubmitPasswordChange && (!isNewPasswordMatch || isNewPasswordDuplicate || (authStore.errorCode === 37))
                          }
                          value={values.newPassword}
                          onChangeText={handleChange("newPassword")}
                        />
                        <Spacer height={Spacing[16]} />
                        <TextField
                          label="Tulis ulang password barumu:"
                          style={{ paddingTop: 0 }}
                          isRequired={false}
                          secureTextEntry={true}
                          isError={isSubmitPasswordChange && (!isNewPasswordMatch || (authStore.errorCode === 37))}
                          value={values.confirmNewPassword}
                          onChangeText={handleChange("confirmNewPassword")}
                        />
                      </VStack>
                      {authStore.errorCode===37 &&
                        <Text type={'warning'} style={{textAlign: 'center'}}>
                          {authStore.errorMessage}
                        </Text>
                      }
                      <Spacer height={Spacing[12]} />
                      <VStack horizontal={Spacing[84]} vertical={Spacing[20]}>
                        <Button
                          type={"primary"}
                          text={"Ganti Password"}
                          onPress={() => handleSubmit()}
                        />
                      </VStack>
                    </>
                  )}
                </Formik>
              </VStack>
            </VStack>
            <Spacer height={Spacing[48]} />
            </ScrollView>
          </SafeAreaView>
          <Spinner visible={authStore.isLoading} textContent={"Memuat..."} />
        </VStack>
      </KeyboardAvoidingView>
    )
  },
)

export default ChangePassword
