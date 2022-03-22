import React, { FC, useCallback, useEffect, useState } from "react"
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleProp,
  TouchableOpacity,
  View,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button, TextField, DropDownPicker, DropDownItem } from "@components"
import { NavigatorParamList } from "@navigators/idea-pools-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { useStores } from "../../bootstrap/context.boostrap"

import Spinner from "react-native-loading-spinner-overlay"
import { Formik } from "formik"
import { debounce } from "lodash"
import { GroupIconComponent } from "../brainstorm/components/group-icon-component"
import { MoodComponent } from "@screens/homepage/components/mood-component"
import Modal from "react-native-modalbox"
import { dimensions } from "@config/platform.config"

const updateButtonStyle: StyleProp<any> = {
  height: Spacing[32],
  paddingHorizontal: Spacing[16],
  right: 0,
  position: "absolute",
}
export type newGroupForm = {
  name: string
  memberIds: string[]
  icon: string
}
const newGroupInitialForm: newGroupForm = {
  name: "",
  memberIds: [],
  icon: "",
}

const NewBrainstormsGroup: FC<StackScreenProps<NavigatorParamList, "newBrainstormsGroup">> =
  observer(({ navigation }) => {
    // empty list state
    const { mainStore, brainstormStore } = useStores()
    const [dataTeamMember, setDataTeamMember] = useState<DropDownItem[]>([])
    const [selectedIcon, setSelectedIcon] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalDesc, setModalDesc] = useState<string>("")
    const [modalIcon, setModalIcon] = useState("senang")
    
    const goBack = () => navigation.goBack()
    
    const getListUser = useCallback(async (id: string) => {
      await mainStore.getListUser(id)
      console.log("useEffect mainStore.listUserProfile", mainStore.listUserProfile)
    }, [])

    const loadData = debounce(async () => {
      await getListUser(mainStore.userProfile.team1_id)
      if (mainStore.listUserProfile) {
        console.log("mainStore.listUserProfile", mainStore.listUserProfile)
        const itemsData: DropDownItem[] = mainStore.listUserProfile.map((item) => {
          return {
            item: item.fullname,
            id: item.id,
          }
        })
        setDataTeamMember(itemsData)
      }
      console.log("loading data for new branstorming group")
    }, 500)

    useEffect(() => {
      loadData()
    }, [])

  

    const getIcon = (icon: string) => {
      const type = icon.toLowerCase()
      const renderGroupIcon = () => {
        if (!selectedIcon) {
          return <GroupIconComponent data={type} />
        }
        if (selectedIcon) {
          if (type !== selectedIcon) {
            const iconInactive = type + "Inactive"
            return <GroupIconComponent data={iconInactive} />
          } else {
            return <GroupIconComponent data={type} />
          }
        }
      }
      const selectIcon = useCallback(
        (selectedIcon) => {
          setSelectedIcon(selectedIcon)
          console.log("selected icon ", selectedIcon)
        },
        [selectedIcon, setSelectedIcon],
      )
      return (
        <VStack>
          <TouchableOpacity
            onPress={selectIcon.bind(this, type)}
            style={{ backgroundColor: Colors.WHITE }}
          >
            <VStack>
              <View style={{ alignSelf: "center" }}>{renderGroupIcon()}</View>
              <Spacer height={Spacing[24]} />
            </VStack>
          </TouchableOpacity>
        </VStack>
      )
    }
    const toggleModal = (value: boolean) => {
      setModalVisible(value)
    }
    const onSubmit = useCallback(
      async (data: newGroupForm) => {
        brainstormStore.formReset()
        console.log("Data ", data)
        let isError = false
        if (data.name === "") {
          isError = true
          console.log("name")
        } else if (!data.memberIds[0]) {
          isError = true
          console.log("memeber")
        } else if (selectedIcon === "") {
          isError = true
          console.log("icon")
        }
        if (isError) {
          return null
        }
        data.memberIds = data.memberIds.map((member) => {
          return member["id"]
        })

        data.memberIds.push(mainStore.userProfile.user_id)
        console.log("new branstorrming data: ", data)
        data.icon = selectedIcon

        // console.log("journalEntryForm mau ke feedback", journalEntryForm)

        // toggleEncouragementModal()

        setErrorMessage("")
        setModalVisible(false)

        await brainstormStore.createBrainstormGroup({
          initiator_id: mainStore.userProfile.user_id,
          name: data.name,
          member_ids: data.memberIds,
          icon: data.icon,
        })

        console.log('tormStore.errorCode ', brainstormStore.errorCode)
        if (brainstormStore.errorCode === null) {
          setModalContent(
            "Berhasil!",
            "Brainstorming group-mu berhasil dibuat. Selamat bertukar ide! :)",
            "senang",
          )
          toggleModal(true)
        } else {
          setModalContent("Oh no! :(", "Permintaanmu gagal diproses :(\nCoba lagi ya!", "marah")
          toggleModal(true)
        }
      },
      [selectedIcon, isModalVisible, brainstormStore.errorCode],
    )
    const setModalContent = (title: string, desc: string, icon: string) => {
      setModalTitle(title)
      setModalDesc(desc)
      setModalIcon(icon)
    }
    return (
      <VStack
        testID="newPost"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          <ScrollView
            refreshControl={
              <RefreshControl
              //   refreshing={coachingStore.isLoading}
              // onRefresh={loadData}
              // tintColor={Colors.MAIN_RED}
              />
            }
          >
            <Formik initialValues={newGroupInitialForm} onSubmit={onSubmit}>
              {({ handleChange, handleSubmit, values, setFieldValue }) => (
                <VStack top={Spacing[8]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                  <HStack>
                    <Text type={"left-header"} style={{}} text="Tambah brainstorming group." />
                  </HStack>

                  {/* <Spacer height={Spacing[8]} /> */}

                  <VStack>
                    <TextField
                      value={values.name}
                      onChangeText={handleChange("name")}
                      isRequired={false}
                      editable={true}
                      isError={false}
                      label={"Tulislah nama brainstorming group ini."}
                      secureTextEntry={false}
                      inputStyle={{ textAlign: "left", paddingLeft: Spacing[12] }}
                      placeholder={"Tulis nama brainstorming group di sini."}
                      charCounter={true}
                      maxChar={30}
                    />
                    <DropDownPicker
                      items={dataTeamMember}
                      isRequired={false}
                      // value={values.lea}
                      label={"Siapa saja anggota brainstorming group ini?"}
                      onValueChange={(value: DropDownItem | DropDownItem[]) => {
                        setFieldValue("memberIds", value)
                      }}
                      placeholder={"Pilih anggota group (max. 10 orang)"}
                      containerStyle={{ marginTop: Spacing[4] }}
                      isError={false}
                      multiple={true}
                      maxSelected={10}
                    />
                    <Spacer height={Spacing[20]} />
                    <Text
                      type={"label"}
                      style={{ fontSize: Spacing[14] }}
                      text="Pilih icon untuk group ini!"
                    />
                    <VStack horizontal={Spacing[24]} top={Spacing[24]} style={Layout.widthFull}>
                      <VStack>
                        <HStack bottom={Spacing[12]}>
                          {getIcon("jeruk")}
                          <Spacer />
                          <Spacer />
                          {getIcon("cup")}
                          <Spacer />
                          <Spacer />
                          {getIcon("pizza")}
                        </HStack>
                        <HStack bottom={Spacing[12]}>
                          <Spacer />
                          {getIcon("shoe")}
                          <Spacer />
                          {getIcon("tree")}
                          <Spacer />
                        </HStack>
                      </VStack>
                    </VStack>
                  </VStack>
                  <Text type={"warning"} style={{ textAlign: "center" }}>
                    {errorMessage}
                  </Text>
                  <HStack bottom={Spacing[32]}>
                    <Spacer />
                    <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[96] }}>
                      <Button
                        type={"primary"}
                        text={"Buat"}
                        style={{ height: Spacing[32], paddingHorizontal: Spacing[8] }}
                        textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                        onPress={handleSubmit}
                      />
                    </VStack>
                    <Spacer />
                  </HStack>
                </VStack>
              )}
            </Formik>
          </ScrollView>
        </SafeAreaView>
        <Spinner visible={false} textContent={"Memuat..."} />
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
                        onPress={goBack}
                      />
                    </VStack>
                    <Spacer />
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </View>
        </Modal>
      </VStack>
    )
  })

export default NewBrainstormsGroup
