import React, { FC, useCallback, useEffect, useState } from "react"
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import { Colors, Layout, Spacing } from "@styles"
import Spinner from "react-native-loading-spinner-overlay"

import {
  BackNavigation,
  Button,
  DropDownItem,
  DropDownPicker,
  K_OPTIONS,
  Text,
  TextField,
} from "@components"
import Spacer from "@components/spacer"

import Modal from "react-native-modalbox"
import { IOption } from "react-native-modal-selector"
import { dimensions } from "@config/platform.config"
import moment from "moment"
import { typography } from "@theme"
import { Formik } from "formik"
import { SOFT_PURPLE } from "@styles/Color"
import { useStores } from "../../bootstrap/context.boostrap"
import { MoodComponent } from "@screens/homepage/components/mood-component"
import { IdeaPoolsDetail } from "./brainstorms.type"

export type ideaForm = {
  title: string
  description: string
}

const AddIdea: FC<StackScreenProps<NavigatorParamList, "addIdea">> = observer(
  ({ navigation, route }) => {
    const { mainStore, brainstormStore } = useStores()
    const { isView, byLeaders, isVote, groupId } = route.params
    const [titleBgColour, setTitleBgColour] = useState<string>(Colors.WHITE)
    const [isViewMode, setIsViewMode] = useState<boolean>(isView)
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [isMyIdea, setIsMyidea] = useState<boolean>(false)
    const [errorField, setErrorField] = useState<string>("")

    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalDesc, setModalDesc] = useState<string>("")
    const [modalIcon, setModalIcon] = useState("senang")

    const ideaInitialForm: ideaForm = {
      title: "",
      description: "",
    }
    const [ideaDetail, setIdeaDetail] = useState<IdeaPoolsDetail>()

    const goBack = () => navigation.goBack()

    const setModalContent = (title: string, desc: string, icon: string) => {
      setModalTitle(title)
      setModalDesc(desc)
      setModalIcon(icon)
    }

    const toggleModal = (value: boolean) => {
      setModalVisible(value)
    }

    const loadIdea = useCallback(
      async (id: string) => {
        console.log("loadIdea ")
        await brainstormStore.getIdeaDetail(id)
        setIdeaDetail(brainstormStore.ideaDetail)
        ideaInitialForm.title = brainstormStore.ideaDetail.title
        ideaInitialForm.description = brainstormStore.ideaDetail.description
        setTitleBgColour(brainstormStore.ideaDetail.color)

        setIsMyidea(brainstormStore.ideaDetail.authorId === mainStore.userProfile.user_id)

        console.log("ideaDetail ", ideaDetail)
        brainstormStore.isLoading = false
      },
      [brainstormStore.ideaDetail, ideaInitialForm],
    )

    useEffect(() => {
      if (isViewMode) {
        // setIsViewMode(true)
        console.log("View Mode")
        loadIdea(route.params.ideaId)
      } else {
        // setIsViewMode(false)
        console.log("Start to Create new idea ")
      }
    }, [route.params, isViewMode])

    // useEffect(() => {
    //   console.log(" ideaInitialForm useeffecr", ideaInitialForm)
    // }, [ideaInitialForm])

    const onClickEdit = useCallback(
      (editMode: boolean) => {
        console.log("editMode ", editMode)
        if (!editMode) {
          ideaInitialForm.title = "lalala"
          ideaInitialForm.description = ideaDetail.description
          console.log("ideaDetail !editmode ", ideaDetail)
        }
        setIsEditMode(editMode)
        console.log("ideaInitialForm onedit", ideaInitialForm)
      },
      [ideaInitialForm, isEditMode],
    )

    const onSubmit = (data: ideaForm) => {
      brainstormStore.formReset()
      let isError = false
      if (data.title === "") {
        setErrorField("title")
        isError = true
      } else if (data.description === "") {
        setErrorField("description")
        isError = true
      }

      if (isError === true) {
        return
      }

      setErrorField("")
      if (isView) {
        console.log("on submit is view")
      } else {
        console.log("on submit NOT IS view")
        handleSubmitNewIdea(data)
      }
    }

    const handleSubmitNewIdea = useCallback(
      async (data: ideaForm) => {
        console.log("handleSubmitNewIdea", data)
        await brainstormStore.createIdea({
          brainstormGroupId: groupId,
          title: data.title,
          description: data.description,
        })

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
      [groupId, brainstormStore.errorCode],
    )

    return (
      <VStack
        testID="Assesment"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <Formik initialValues={ideaInitialForm} onSubmit={onSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
            <>
              <SafeAreaView style={Layout.flex}>
                <ScrollView>
                  <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
                  <VStack horizontal={Spacing[24]}>
                    <HStack>
                      <Text type={"left-header"}>Tentang ide projek!</Text>
                      <Spacer />
                      {isViewMode && isMyIdea && (
                        <Button
                          type={"negative"}
                          text={isEditMode ? `Cancel` : `Edit`}
                          onPress={onClickEdit.bind(this, !isEditMode)}
                        />
                      )}
                    </HStack>

                    <VStack>
                      <VStack top={Spacing[20]}>
                        <Text type={"body-bold"} style={{ color: Colors.BRIGHT_BLUE }}>
                          Judul
                          <Text type={"body-bold"} style={[]}>
                            {" idenya apa nih?"}
                          </Text>
                        </Text>
                        <TextField
                          value={values.title}
                          onChangeText={handleChange("title")}
                          isRequired={false}
                          editable={isEditMode}
                          isError={errorField === "title"}
                          secureTextEntry={false}
                          placeholder={"Tulis judul disini"}
                          charCounter={true}
                          maxChar={30}
                          inputStyle={{
                            backgroundColor: titleBgColour,
                          }}
                        />

                        <Text type={"body-bold"} style={[]}>
                          Tulislah
                          <Text type={"body-bold"} style={{ color: Colors.BRIGHT_BLUE }}>
                            {" deskripsi "}
                          </Text>
                          idemu.
                        </Text>
                        <TextField
                          isRequired={false}
                          editable={isEditMode}
                          isError={errorField === "description"}
                          secureTextEntry={false}
                          placeholder={"Tulis deskripsi disini"}
                          isTextArea={true}
                          inputStyle={{ minHeight: Spacing[64] }}
                          charCounter={true}
                          value={values.description}
                          onChangeText={handleChange("description")}
                        />

                        {isViewMode && !isMyIdea && (
                          <VStack>
                            <VStack
                            // style={{bottom: -Spacing[24]}}
                            >
                              <Text type={"body-bold"} style={{ color: Colors.BRIGHT_BLUE }}>
                                Ide
                                <Text type={"body-bold"} style={[]}>
                                  {" dicetuskan oleh"}
                                </Text>
                              </Text>
                            </VStack>
                            <TextField
                              // value={values.title}
                              // onChangeText={handleChange("title")}
                              isRequired={false}
                              // editable={!coachingStore.isDetail}
                              // isError={isError === "title"}}
                              secureTextEntry={false}
                            />
                          </VStack>
                        )}

                        {/* <HStack>
                          <Button
                            type={"primary"}
                            text={"Update"}
                            style={updateButtonStyle}
                            textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                            onPress={handleSubmit}
                          />
                        </HStack> */}
                        <VStack horizontal={Spacing[72]} top={Spacing[24]}>
                          {isViewMode && !isEditMode && (
                            <Button
                              type={"warning"}
                              text={"Hapus"}
                              onPress={handleSubmit}
                              style={{ right: 0, width: Spacing[84], position: "absolute" }}
                            />
                          )}
                          {isViewMode && isEditMode && (
                            <Button type={"primary"} text={"Simpan"} onPress={handleSubmit} />
                          )}
                          {!isViewMode && (
                            <Button type={"primary"} text={"Submit"} onPress={handleSubmit} />
                          )}
                        </VStack>
                        {isViewMode && !isMyIdea && (
                          <HStack>
                            <Button
                              type={"primary"}
                              text={"Vote"}
                              onPress={handleSubmit}
                              style={{ width: Spacing[64] }}
                            />
                            <Spacer />
                            <Text type={"body-bold"} style={[]}>
                              Ide sudah di-vote 7 kali.
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </VStack>

                    <Spacer height={Spacing[24]} />
                    <Spacer height={Spacing[24]} />
                  </VStack>
                </ScrollView>
              </SafeAreaView>
              <Spinner
                visible={brainstormStore.isLoading}
                textContent={"Memuat..."}
                // textStyle={styles.spinnerTextStyle}
              />
            </>
          )}
        </Formik>

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
  },
)

export default AddIdea
