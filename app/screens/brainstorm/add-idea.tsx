import React, { FC, useCallback, useEffect, useState } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native"
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
  authorFullname: string
}

const AddIdea: FC<StackScreenProps<NavigatorParamList, "addIdea">> = observer(
  ({ navigation, route }) => {
    const { mainStore, brainstormStore } = useStores()
    const { isView, byLeaders, isVote, groupId } = route.params
    const [titleBgColour, setTitleBgColour] = useState<string>(Colors.WHITE)
    const [isViewMode, setIsViewMode] = useState<boolean>(isView)
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [isMyIdea, setIsMyidea] = useState<boolean>(false)
    const [isInitiator, setIsInitiator] = useState<boolean>(false)
    const [isSelected, setIsSelected] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [totalVotes, setTotalVotes] = useState<number>(0)
    const [errorField, setErrorField] = useState<string>("")

    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalDesc, setModalDesc] = useState<string>("")
    const [modalIcon, setModalIcon] = useState("senang")

    const ideaInitialForm: ideaForm = {
      title: "",
      description: "",
      authorFullname: "",
    }
    const [ideaDetail, setIdeaDetail] = useState<IdeaPoolsDetail>()

    const goBack = () => navigation.goBack()

    const goToSendEmailScreen = () =>
      navigation.navigate("sendEmail", {
        title: "Miro Untuk Brainstorming",
      })

    useEffect(() => {
      if (isView) {
        setIsViewMode(true)
        console.log("View Mode")
      } else {
        setIsViewMode(false)
        console.log("Start to Create new idea ")
      }
    }, [route.params, isViewMode])

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
        setIsLoading(true)
        await brainstormStore.getIdeaDetail(id)
        setIdeaDetail(brainstormStore.ideaDetail)
        ideaInitialForm.title = brainstormStore.ideaDetail.title
        ideaInitialForm.description = brainstormStore.ideaDetail.description
        ideaInitialForm.authorFullname = brainstormStore.ideaDetail.authorFullname

        setIsLoading(false)
        setTitleBgColour(brainstormStore.ideaDetail.color)
        setTotalVotes(brainstormStore.ideaDetail.votes)
        setIsMyidea(brainstormStore.ideaDetail.isAuthor)
        setIsInitiator(brainstormStore.ideaDetail.isInitiator)
        setIsSelected(brainstormStore.ideaDetail.isSelected === 1)
        console.log("brainstormStore.ideaDetail.isAuthor ", brainstormStore.ideaDetail.isAuthor)
        if (!brainstormStore.ideaDetail.isAuthor) {
          console.log("not author")
        }

        console.log("ideaDetail ", ideaDetail)
        console.log("brainstormStore.ideaDetail ", brainstormStore.ideaDetail)
        console.log("ideaInitialForm ", ideaInitialForm)
        brainstormStore.isLoading = false
      },
      [
        brainstormStore.ideaDetail,
        brainstormStore.getIdeaDetailSuccess,
        ideaInitialForm,
        ideaDetail,
      ],
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

    const onClickEdit = useCallback(
      (editMode: boolean) => {
        console.log("editMode ", editMode)
        setIsLoading(true)
        if (!editMode) {
          ideaInitialForm.title = "lalala"
          ideaInitialForm.description = ideaDetail.description
          console.log("ideaDetail !editmode ", ideaDetail)
        }
        setIsEditMode(editMode)
        setIsLoading(false)
        console.log("ideaInitialForm onedit", ideaInitialForm)
      },
      [ideaInitialForm, isEditMode],
    )

    const onUpdateIdea = useCallback(
      async (data: ideaForm) => {
        console.log("onUpdateIdea ", data)
        setIsLoading(true)
        await brainstormStore.updateIdea({
          ideaPoolsId: brainstormStore.ideaDetail.id,
          title: data.title,
          description: data.description,
        })

        setIsLoading(false)
        if (brainstormStore.errorCode === null) {
          setModalContent("Hore!", "Idemu sudah berhasil diedit.", "senang")
          toggleModal(true)
        } else {
          setModalContent("Oh no :(", "Idemu gagal diedit, nih. Coba lagi yuk.", "marah")
          toggleModal(true)
        }
      },
      [brainstormStore.ideaDetail],
    )

    const onVoteIdea = useCallback(async () => {
      console.log("start on vote idea id ", ideaDetail.id)
      setIsLoading(true)

      await brainstormStore.voteIdea(ideaDetail.id)

      setIsLoading(false)
      if (brainstormStore.errorCode === null) {
        setModalContent("Terima kasih!", "Kamu sudah berhasil nge-vote ide ini.", "senang")
        toggleModal(true)
      } else if (brainstormStore.errorCode === 77) {
        setModalContent(
          "Oops!",
          "Tampaknya kamu sudah pernah nge-vote ide ini. Kamu cuman bisa nge-vote satu kali per ide, yaa.",
          "marah",
        )
        toggleModal(true)
      } else if (brainstormStore.errorCode === 76) {
        setModalContent(
          "Yah :(",
          "Tampaknya kamu sudah menghabiskan kuota voting kamu. Kamu hanya bisa voting 3x yaa.",
          "marah",
        )
        toggleModal(true)
      } else {
        setModalContent(
          "Tidaaaak :(",
          "Ide ini belum berhasil di-vote nih. Coba lagi yah!",
          "marah",
        )
        toggleModal(true)
      }
    }, [
      ideaDetail,
      brainstormStore.errorCode,
      brainstormStore.voteIdeaSuccess,
      brainstormStore.isLoading,
    ])

    const onSelectIdea = useCallback(async () => {
      console.log("start on select idea id ", ideaDetail.id)
      setIsLoading(true)
      await brainstormStore.selectIdea(ideaDetail.id)

      setIsLoading(false)
      if (brainstormStore.errorCode !== null) {
        setModalContent("Yah :(", "Ide ini belum berhasil di-select. Coba lagi yuk.", "marah")
        toggleModal(true)
      } else {
        goToSendEmailScreen()
      }
    }, [ideaDetail, brainstormStore.errorCode, brainstormStore.voteIdeaSuccess])

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
        setIsLoading(true)
        await brainstormStore.createIdea({
          brainstormGroupId: groupId,
          title: data.title,
          description: data.description,
        })

        setIsLoading(false)
        if (brainstormStore.errorCode === null) {
          setModalContent("Berhasil!", "Idemu sudah ditambahkan. Yuk tambah ide lagi!", "senang")
          toggleModal(true)
        } else {
          setModalContent(
            "Yah :(",
            "Idemu belum berhasil ditambahkan. Coba tambahkan idenya lagi yaa...",
            "marah",
          )
          toggleModal(true)
        }
      },
      [groupId, brainstormStore.errorCode, brainstormStore.createIdeaSuccess],
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
                      {isViewMode && isMyIdea && isEditMode && !isSelected && (
                        <Button
                          type={"negative"}
                          text={`Cancel`}
                          onPress={() => {
                            setFieldValue("title", ideaDetail.title)
                            setFieldValue("description", ideaDetail.description)
                            onClickEdit(false)
                            // console.log("lal")
                          }}
                        />
                      )}
                      {isViewMode && isMyIdea && !isEditMode && !isSelected && (
                        <Button
                          type={"negative"}
                          text={`Edit`}
                          onPress={onClickEdit.bind(this, true)}
                        />
                      )}
                    </HStack>
                    {isLoading ? (
                      <VStack
                        vertical={Spacing[12]}
                        style={{ position: "absolute", bottom: 0, width: dimensions.screenWidth }}
                      >
                        <ActivityIndicator animating={isLoading} />
                      </VStack>
                    ) : (
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
                            editable={isEditMode || !isView}
                            isError={errorField === "title"}
                            secureTextEntry={false}
                            placeholder={"Tulis judul disini"}
                            charCounter={true}
                            maxChar={30}
                            inputStyle={{
                              backgroundColor: titleBgColour,
                              borderWidth: isViewMode ? Spacing[0] : Spacing[2],
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
                            editable={isEditMode || !isView}
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
                                value={values.authorFullname}
                                onChangeText={handleChange("authorFullname")}
                                isRequired={false}
                                editable={false}
                                isError={false}
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
                          <VStack horizontal={Spacing[72]} top={Spacing[24]} bottom={Spacing[24]}>
                            {isViewMode && !isEditMode && isMyIdea && !isSelected && (
                              <Button
                                type={"warning"}
                                text={"Hapus"}
                                onPress={handleSubmit}
                                style={{ right: 0, width: Spacing[84], position: "absolute" }}
                              />
                            )}
                            {isViewMode && isEditMode && (
                              <Button
                                type={"primary"}
                                text={"Simpan"}
                                // style={{  width: Spacing[84], position: "absolute" }}
                                onPress={onUpdateIdea.bind(this, values)}
                              />
                            )}
                            {!isViewMode && (
                              <Button type={"primary"} text={"Submit"} onPress={handleSubmit} />
                            )}
                          </VStack>
                          {isViewMode && (
                            <HStack>
                              {!isMyIdea && !isInitiator && !isSelected && (
                                <Button
                                  type={"primary"}
                                  text={"Vote"}
                                  onPress={onVoteIdea}
                                  style={{ width: Spacing[64] }}
                                />
                              )}
                              {isInitiator && !isSelected && (
                                <Button
                                  type={"primary"}
                                  text={"Select"}
                                  onPress={onSelectIdea}
                                  disabled={isEditMode}
                                  style={{
                                    width: Spacing[84],
                                    backgroundColor: isEditMode
                                      ? Colors.CLOUD_GRAY
                                      : Colors.SOFT_PURPLE,
                                  }}
                                  textStyle={{ color: isEditMode ? "#BDBDBD" : Colors.WHITE }}
                                />
                              )}

                              <Spacer />
                              <Text
                                type={"body-bold"}
                                style={[]}
                                text={`Ide sudah di-vote ${totalVotes} kali.`}
                              />
                            </HStack>
                          )}
                        </VStack>
                      </VStack>
                    )}
                    <Spacer height={Spacing[24]} />
                    {/* <Button
                      type={"primary"}
                      text={"Kirim Email ke CP screen"}
                      onPress={sendEmailScreen}
                      style={{ width: Spacing[64] }}
                    />
                    <Spacer height={Spacing[24]} /> */}
                  </VStack>
                </ScrollView>
              </SafeAreaView>
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
