import React, { FC, useCallback, useState, useEffect } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField, DropDownPicker, DropDownItem } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"
import Modal from "react-native-modalbox"
import senang from "@assets/icons/mood/senyum.png"
import marah from "@assets/icons/mood/marah.png"


import { Formik } from "formik"
import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from "react-native-loading-spinner-overlay"
import { IOption } from "react-native-modal-selector"
import { dimensions } from "@config/platform.config"
import FastImage from "react-native-fast-image"

export type TeamUpdateForm = {
  team1Id: string
  team2Id: string
  team3Id: string
}

const TeamUpdateInitialForm: TeamUpdateForm = {
  team1Id: "",
  team2Id: "",
  team3Id: "",
}

const ChangeDivision: FC<StackScreenProps<NavigatorParamList, "changeDivision">> = observer(
  ({ navigation }) => {
    const { authStore, mainStore } = useStores()
    const [isSubmitDivisionChange, setIsSubmitDivisionChange] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const [teamList1, setTeamList1] = useState<DropDownItem[]>([])
    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalDesc, setModalDesc] = useState<string>("")
    const [modalIcon, setModalIcon] = useState(senang)

    const [team1Data, setTeam1Data] = useState(mainStore.userProfile.team1_id? {"id": mainStore.userProfile.team1_id, "item": mainStore.userProfile.team1_name}:{})
    const [team2Data, setTeam2Data] = useState(mainStore.userProfile.team2_id? {"id": mainStore.userProfile.team2_id, "item": mainStore.userProfile.team2_name}:{})
    const [team3Data, setTeam3Data] = useState(mainStore.userProfile.team3_id? {"id": mainStore.userProfile.team3_id, "item": mainStore.userProfile.team3_name}:{})

    const goBack = () => navigation.goBack()

    const goToMyAccount = () => navigation.navigate("myAccount")

    const getTeam = useCallback(async () => {
      await mainStore.getTeamList()
    }, [])

    const toggleModal = (value: boolean) =>{
      // setTimeout(() => {
        setModalVisible(value)
        // setIsClickEditProfile(false)
      // }, 100)
    }

    useEffect(() => {
      if (mainStore.teamResponse !== null) {
        const itemsData: DropDownItem[] = mainStore.teamResponse.data.map((item, index) => {
          return {
            item: item.name,
            id: item.id,
          }
        })
        setTeamList1(itemsData)
      }
    }, [mainStore.teamResponse])

    useEffect(() => {
      authStore.formReset()
      getTeam()
    }, [])


    const setModalContent = (title: string, desc: string, icon) => {
      setModalTitle(title)
      setModalDesc(desc)
      setModalIcon(icon)
    }
    

    /**
     * Not finish: how to do show error message from API
     */
    const changeDivision = useCallback(async (teams) => {
      authStore.formReset()
      setIsSubmitDivisionChange(true)
      setErrorMessage('')
      setModalVisible(false)

      const { team1Id, team2Id, team3Id } = teams

      console.log('new teams', teams)

      // console.log('team1Id, team2Id, team3Id ', team1Id, team2Id, team3Id)
      // console.log('user profile ', mainStore.userProfile)
      await mainStore.requestChangeDivision(
        mainStore.userProfile.team1_id? mainStore.userProfile.team1_id : '', team1Id,
        mainStore.userProfile.team2_id? mainStore.userProfile.team2_id :'', team2Id,
        mainStore.userProfile.team3_id? mainStore.userProfile.team3_id : '', team3Id
        )

      // setIsSubmitPasswordChange(false)
      if (mainStore.errorCode === null) {
        setModalContent('Berhasil!', 'Permintaanmu berhasil dikirim. Silakan tunggu sampai team-mu berhasil diganti atau ditambahkan ya!', senang)
        await mainStore.getProfile();
        toggleModal(true)
      } else {
        setModalContent('Oh no! :(', 'Perubahannya gagal diproses.\nCoba lagi ya!', marah)
        toggleModal(true)
      }
    }, [])

    const goBackSuccess = () => {
      navigation.navigate("myAccount", {
        isPasswordChange: true,
      })
    }

    return (
      <>
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
                    text="My Account"
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
                      Kamu bisa menggantikan dan menambahkan team kamu di sini. Setelah mengubah
                      atau menambahkan team, silakan tekan tombol
                      <Text type="warning"> Submit</Text> di bawah.
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
                        team1Id: mainStore.userProfile.team1_id? mainStore.userProfile.team1_id:'',
                        team2Id: mainStore.userProfile.team2_id? mainStore.userProfile.team2_id:'',
                        team3Id: mainStore.userProfile.team3_id? mainStore.userProfile.team3_id:'',
                      }}
                      onSubmit={(values) => changeDivision(values)} 
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
                          { errorMessage!==null &&
                            <Text type={"warning"} style={{ textAlign: "center" }}>
                              {errorMessage || mainStore.errorMessage}
                            </Text>
                          }
                          <DropDownPicker
                            items={teamList1}
                            isRequired={true}
                            label="Pilih team:"
                            // onValueChange={(value:IOption)=> setFieldValue('team1Id', value.id)}
                            onValueChange={(value: IOption) => {
                              setFieldValue("team1Id", value?.id ?? "")
                            }}
                            placeholder={"Pilih salah satu"}
                            containerStyle={{ marginTop: Spacing[4] }}
                            zIndex={3000}
                            zIndexInverse={1000}
                            dropDownDirection={"BOTTOM"}
                            isRemovable={false}
                            initialValue={team1Data}
                          />
                          <DropDownPicker
                            items={teamList1}
                            isRequired={false}
                            label="Pilih team kedua (jika ada):"
                            onValueChange={(value: IOption) => {
                              setFieldValue("team2Id", value?.id ?? "")
                            }}
                            placeholder={"Pilih salah satu"}
                            containerStyle={{ marginTop: Spacing[4] }}
                            zIndex={2000}
                            zIndexInverse={2000}
                            dropDownDirection={"BOTTOM"}
                            isRemovable={true}
                            initialValue={team2Data}
                          />
                          <DropDownPicker
                            items={teamList1}
                            isRequired={false}
                            label="Pilih team ketiga (jika ada):"
                            onValueChange={(value: IOption) => {
                              setFieldValue("team3Id", value?.id ?? "")
                            }}
                            placeholder={"Pilih salah satu"}
                            containerStyle={{ marginTop: Spacing[4] }}
                            zIndex={1000}
                            zIndexInverse={3000}
                            dropDownDirection={"BOTTOM"}
                            isRemovable={true}
                            initialValue={team3Data}
                          />
                          {/* </VStack> */}
                          {authStore.errorCode === 37 && (
                            <Text type={"warning"} style={{ textAlign: "center" }}>
                              {authStore.errorMessage}
                            </Text>
                          )}
                          <Spacer height={Spacing[12]} />
                          <VStack horizontal={Spacing[84]} vertical={Spacing[20]}>
                            <Button
                              type={"warning"}
                              text={"Edit"}
                              onPress={() => handleSubmit()}
                            />
                          </VStack>

                          <Text type={"warning"} style={{ textAlign: "center" }}>
                            Setiap perubahan team yang kamu submit akan melalui tinjauan terlebih
                            dahulu. Proses perubahan team akan membutuhkan waktu selama 1-3 hari.
                          </Text>
                        </>
                      )}
                    </Formik>
                  </VStack>
                </VStack>
                <Spacer height={Spacing[48]} />
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
                    <FastImage
                      style={{
                        height: Spacing[64],
                        width: Spacing[64],
                      }}
                      source={modalIcon}
                      resizeMode={"contain"}
                    />
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
  },
)

export default ChangeDivision
