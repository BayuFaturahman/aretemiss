import React, { FC, useCallback, useEffect, useState } from "react"
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { BackNavigation, Button, DropDownItem, DropDownPicker, Text, TextField } from "@components"
import { NavigatorParamList } from "@navigators/auth-navigator"
import { VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { Formik } from "formik"

import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from "react-native-loading-spinner-overlay"
import { IOption } from "react-native-modal-selector"
import { IleadLogo } from "@assets/svgs"
import { dimensions } from "@config/platform.config"

export type ProfileUpdateForm = {
  fullname: string
  nickname: string
  email: string
  team1Id: string
  team2Id: string
  team3Id: string
  isAllowNotification?: number
  isAllowReminderNotification?: number
  winCulture: string
}

const ProfileUpdateInitialForm: ProfileUpdateForm = {
  fullname: "",
  nickname: "",
  // email: '',
  team1Id: "",
  team2Id: "",
  team3Id: "",
  winCulture: ""
}

const CreateProfile: FC<StackScreenProps<NavigatorParamList, "createProfile">> = observer(
  ({ navigation, route }) => {
    const goToOTP = () => navigation.navigate("verifyOTP")

    const [teamList1, setTeamList1] = useState<DropDownItem[]>([])

    const { authStore, mainStore, serviceStore } = useStores()
    const [winCultureData, setWinCultureData] = useState([
      {
        id: 'Counter Part (CP)',
        // key: 'Counter Part (CP)',
        item: 'Counter Part (CP)'
      },
      {
        id: 'Culture Leader (CL)',
        // key: 'Culture Leader (CL)',
        item: 'Culture Leader (CL)',
      },
      {
        id: 'Culture Agent (CA)',
        // key: 'Culture Agent (CA)',
        item: 'Culture Agent (CA)',
      }
    ]);

    const styles = StyleSheet.create({})

    const getTeam = useCallback(async () => {
      await mainStore.getTeamList()
    }, [])

    useEffect(() => {
      if (authStore.token) {
        getTeam()
      }
    }, [])

    useEffect(() => {
      if (serviceStore.accessToken) {
        getTeam()
      }
    }, [serviceStore.rehydrated, serviceStore.accessToken])

    useEffect(() => {
      if (mainStore.updatingProfile.userId !== "") {
        navigation.reset({
          routes: [{ name: "homepage" }],
        })
      }
    }, [mainStore.updatingProfile])

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

    const goBack = () => {
      if (authStore.isVerify === null) {
        navigation.navigate("verifyPhone")
      } else {
        navigation.navigate("login")
      }
    }

    const onSubmit = useCallback(
      async (data: ProfileUpdateForm) => {
        console.log(data)
        console.log(authStore.userId)
        // data.email = authStore.email
        if (route?.params?.isFromVerifyOtp) {
          await mainStore.updateProfile(authStore.userId, data)
        } else {
          console.log("mainStore.userProfile.user_id ", mainStore.userProfile.user_id)
          await mainStore.updateProfile(mainStore.userProfile.user_id, data)
        }
      },
      [route?.params?.isFromVerifyOtp],
    )

    const handleAvailableTeamList = (values: any) => {
      const { team1Id, team2Id, team3Id } = values
      return teamList1.filter(
        (item) => item.id !== team1Id && item.id !== team2Id && item.id !== team3Id,
      )
    }

    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <KeyboardAvoidingView behavior="padding" style={{ height: dimensions.screenHeight * 2 }}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <ScrollView bounces={false} style={[Layout.flex, Layout.heightFull]}>
            <Spacer height={Spacing[32]} />
            <Formik initialValues={ProfileUpdateInitialForm} onSubmit={onSubmit}>
              {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                <>
                  <VStack top={Spacing[24]} horizontal={Spacing[24]}>
                    <Text type={"header"} text="Lengkapi profilmu." />
                    <Spacer height={Spacing[24]} />

                    <Text type={"warning"} style={{ textAlign: "center" }}>
                      {mainStore.errorMessage}
                    </Text>

                    <Spacer height={Spacing[14]} />
                    <TextField
                      label="Nama lengkap:"
                      style={{ paddingTop: 0 }}
                      isError={false}
                      value={values.fullname}
                      onChangeText={handleChange("fullname")}
                    />
                    <TextField
                      label="Nama panggilan:"
                      style={{ paddingTop: 0 }}
                      isError={false}
                      value={values.nickname}
                      onChangeText={handleChange("nickname")}
                    />
                    {/* <TextField
                    label="Alamat e-mail:"
                    style={{ paddingTop: 0}}
                    isError={false}
                    value={values.email}
                    onChangeText={handleChange('email')}
                  /> */}

                    <DropDownPicker
                      items={handleAvailableTeamList(values)}
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
                    />
                    <DropDownPicker
                      items={handleAvailableTeamList(values)}
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
                    />
                    <DropDownPicker
                      items={handleAvailableTeamList(values)}
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
                    />
                     <DropDownPicker
                      items={winCultureData}
                      isRequired={true}
                      label="Pilih posisi di struktur Winning Culture:"
                      onValueChange={(value: IOption) => {
                        setFieldValue("winCulture", value?.id ?? "")
                      }}
                      placeholder={"Pilih salah satu"}
                      containerStyle={{ marginTop: Spacing[4] }}
                      zIndex={1000}
                      zIndexInverse={3000}
                      dropDownDirection={"BOTTOM"}
                    />
                    {/* <VStack top={Spacing[8]}> */}
                      {/* <Text type={"body"} style={{ textAlign: "right" }}>
                        * = Wajib diisi
                      </Text>
                      <Spacer height={Spacing[32]} />
                      <TextField
                        label="Nama lengkap:"
                        style={{ paddingTop: 0 }}
                        isError={false}
                        value={values.fullname}
                        onChangeText={handleChange("fullname")}
                      />
                      <TextField
                        label="Nama panggilan:"
                        style={{ paddingTop: 0 }}
                        isError={false}
                        value={values.nickname}
                        onChangeText={handleChange("nickname")}
                      /> */}
                      {/* <TextField
                      label="Alamat e-mail:"
                      style={{ paddingTop: 0}}
                      isError={false}
                      value={values.email}
                      onChangeText={handleChange('email')}
                    /> */}

                      {/* <DropDownPicker
                        items={handleAvailableTeamList(values)}
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
                        isRemovable={true}
                      />
                      <DropDownPicker
                        items={handleAvailableTeamList(values)}
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
                      />
                      <DropDownPicker
                        items={handleAvailableTeamList(values)}
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
                      />
                      <VStack top={Spacing[8]}>
                        <Text type={"body"} style={{ textAlign: "right" }}>
                          * = Wajib diisi
                        </Text>
                      </VStack> */}
                    </VStack>
                    {/* <VStack top={Spacing[32]} horizontal={Spacing[96]} style={{ zIndex: -10 }}>
                      <Button type={"primary"} text={"Simpan"} onPress={() => handleSubmit()} />
                    </VStack> */}
                  {/* </VStack> */}
                  <VStack top={Spacing[32]} horizontal={Spacing[96]} style={{ zIndex: -10 }}>
                    <Button type={"primary"} text={"Simpan"} onPress={() => handleSubmit()} />
                  </VStack>
                </>
              )}
            </Formik>
            <Spacer height={Spacing[24]} />
            <IleadLogo height={Spacing[72]} width={dimensions.screenWidth} />
            <Spacer height={Spacing[48]} />
          </ScrollView>
        </KeyboardAvoidingView>
        <Spinner visible={authStore.isLoading || mainStore.isLoading} textContent={"Memuat..."} />
      </VStack>
    )
  },
)

export default CreateProfile
