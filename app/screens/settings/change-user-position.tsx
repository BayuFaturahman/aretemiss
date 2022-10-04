import React, { FC, useCallback, useState } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, DropDownPicker } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import Modal from "react-native-modalbox"

import { Formik } from "formik"
import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from "react-native-loading-spinner-overlay"
import { IOption } from "react-native-modal-selector"
import { dimensions } from "@config/platform.config"

import { MoodComponent } from "@screens/homepage/components/mood-component"


export const USER_POSITION = [
  {
    id:"cp",
    item: "Counter Part (CP)",
  },
  {
    id: "cl",
    item: "Culture Leader (CL)",
  },
  {
    id: "ca",
    item: "Culture Agent (CA)",
  }
]

const ChangeUserPosition: FC<StackScreenProps<NavigatorParamList, "changeUserPosition">> =
  observer(({ navigation }) => {
    const { authStore, mainStore } = useStores()
    const [isSubmitWinCultureChange, setIsSubmitWinCultureChange] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalDesc, setModalDesc] = useState<string>("")
    const [modalIcon, setModalIcon] = useState("senang")

    const [winCultureOptionData, setWinCultureOptionData] = useState(USER_POSITION)

    const [userPositionData, setUserPositionData] = useState(mainStore.userProfile.user_position? USER_POSITION.filter((position) => position.id === mainStore.userProfile.user_position)[0] : {})

    const goBack = () => navigation.goBack()

    const goToMyAccount = () => navigation.navigate("myAccount")

    const toggleModal = (value: boolean) => {
      setModalVisible(value)
    }

    const setModalContent = (title: string, desc: string, icon: string) => {
      setModalTitle(title)
      setModalDesc(desc)
      setModalIcon(icon)
    }

    /**
     * Not finish: how to do show error message from API
     */
    const changeUserPosition = useCallback(async (data) => {
      authStore.formReset()
      setIsSubmitWinCultureChange(true)
      setErrorMessage("")
      setModalVisible(false)

      console.log('submitted data to change position', data)

      await mainStore.requestChangePosition(data);

      if (mainStore.errorCode === null) {
        setModalContent(
          "Berhasil!",
          "Permintaanmu berhasil dikirim. Silakan tunggu sampai posisi winning culture-mu berhasil diganti ya!",
          "senang",
        )
        await mainStore.getProfile()
        toggleModal(true)
      } else {
        setModalContent("Oh no! :(", "Perubahannya gagal diproses.\nCoba lagi ya!", "marah")
        toggleModal(true)
      }
    }, [])

    return (
      <>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={Layout.flex}
        >
          <VStack
            testID="ChangeUserPosition"
            style={{ backgroundColor: Colors.ABM_BG_BLUE, flex: 1, justifyContent: "center" }}
          >
            <SafeAreaView style={Layout.flex}>
              <BackNavigation goBack={goBack} color={Colors.ABM_DARK_BLUE} />
              <ScrollView>
                <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                  <Spacer height={Spacing[24]} />
                  <Text
                    type={"header"}
                    style={{ fontSize: Spacing[16] }}
                    text="Posisi Winning Culture"
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
                  <VStack top={Spacing[8]} horizontal={Spacing[24]}>
                    <Text type={"body-bold"} style={{ fontSize: Spacing[14], textAlign: "center" }}>
                      Mengubah posisi winning culture akan membutuhkan 1-3 hari untuk diproses
                      karena perlu melalui tinjauan terlebih dahulu. Silakan ubah posisi winning
                      culture-mu di sini.
                    </Text>
                  </VStack>

                  {/* {isSubmitPasswordChange && (
                    <Text type={"warning"} style={{ textAlign: "center" }}>
                      {errorMessage}
                    </Text>
                  )} */}
                  <VStack top={Spacing[0]} horizontal={Spacing[24]}>
                    {authStore.errorCode === 15 && (
                      <Text type={"warning"} style={{ textAlign: "center" }}>
                        {authStore.errorMessage}
                      </Text>
                    )}

                    <Formik
                      initialValues={{
                        position: "",
                      }}
                      onSubmit={changeUserPosition}
                    >
                      {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                      }) => (
                        // <View>
                        <>
                          {/* <VStack top={Spacing[32]} horizontal={Spacing[24]} style={{backgroundColor: Colors.SOFT_GREEN, padding: Spacing[0]}}> */}
                          <Spacer height={Spacing[12]} />
                          {errorMessage !== null && (
                            <Text type={"warning"} style={{ textAlign: "center" }}>
                              {errorMessage || mainStore.errorMessage}
                            </Text>
                          )}
                          <DropDownPicker
                            items={winCultureOptionData}
                            isRequired={false}
                            label="Posisi Winning Culture:"
                            onValueChange={(value: IOption) => {
                              setFieldValue("position", value?.id ?? "")
                            }}
                            placeholder={"Pilih salah satu"}
                            containerStyle={{ marginTop: Spacing[4] }}
                            zIndex={1000}
                            zIndexInverse={3000}
                            dropDownDirection={"BOTTOM"}
                            isRemovable={false}
                            initialValue={userPositionData}
                          />
                          {/* </VStack> */}
                          {authStore.errorCode === 37 && (
                            <Text type={"warning"} style={{ textAlign: "center" }}>
                              {authStore.errorMessage}
                            </Text>
                          )}
                          <Spacer height={Spacing[28]} />
                          <VStack horizontal={Spacing[84]} vertical={Spacing[20]}>
                            <Button
                              type={"primary"}
                              text={"Submit"}
                              onPress={() => handleSubmit()}
                            />
                          </VStack>
                        </>
                      )}
                    </Formik>
                  </VStack>
                </VStack>
                <Spacer height={Spacing[256]} />
              </ScrollView>
            </SafeAreaView>
            <Spinner visible={mainStore.isLoading} textContent={"Memuat..."} />
          </VStack>
        </KeyboardAvoidingView>
        <Modal
          isOpen={isModalVisible}
          style={{
            height: "50%",
            width: dimensions.screenWidth - Spacing[24],
            backgroundColor: "rgba(52, 52, 52, 0)",
          }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <VStack
              style={{
                backgroundColor: Colors.WHITE,
                borderRadius: Spacing[48],
                minHeight: Spacing[256],
                alignItems: "center",
                justifyContent: "center",
              }}
              horizontal={Spacing[24]}
              vertical={Spacing[24]}
            >
              <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
                <VStack>
                  <Text
                    type={"body-bold"}
                    style={{ fontSize: Spacing[18], textAlign: "center" }}
                    text={modalTitle}
                  />
                  <Spacer height={Spacing[24]} />
                  <Text type={"body"} style={{ textAlign: "center" }} text={modalDesc} />
                  <Spacer height={Spacing[20]} />
                  <HStack bottom={Spacing[32]}>
                    <Spacer />
                    <MoodComponent data={modalIcon} width={Spacing[64]} height={Spacing[64]} />
                    {/* <FastImage
                      style={{
                        height: Spacing[64],
                        width: Spacing[64],
                      }}
                      source={modalIcon}
                      resizeMode={"contain"}
                    /> */}
                    <Spacer />
                  </HStack>
                  <HStack bottom={Spacing[24]}>
                    <Spacer />
                    <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}>
                      <Button
                        type={"primary"}
                        text={"Kembali"}
                        style={{ height: Spacing[32], paddingHorizontal: Spacing[8] }}
                        textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                        onPress={goToMyAccount}
                      />
                    </VStack>
                    <Spacer />
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </View>
        </Modal>
      </>
    )
  })

export default ChangeUserPosition
