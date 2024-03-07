import React, { FC, useCallback, useEffect, useState } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { NavigatorParamList } from "@navigators/idea-pools-navigator"
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
import { SenyumActive } from "@assets/svgs"
import { CpUser } from "./brainstorms.type"

export type ideaForm = {
  title: string
  description: string
  authorFullname: string
  selectedCp: CpUser
}

const SendEmail: FC<StackScreenProps<NavigatorParamList, "sendEmail">> = observer(
  ({ navigation, route }) => {
    const { mainStore, brainstormStore } = useStores()
    const { title } = route.params
    const [titleBgColour, setTitleBgColour] = useState<string>(Colors.SOFT_PURPLE)
    const [isViewMode, setIsViewMode] = useState<boolean>(true)
    const [errorField, setErrorField] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [listCp, setListCp] = useState<CpUser[]>([])

    const [isModalVisible, setModalVisible] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalDesc, setModalDesc] = useState<string>("")
    const [modalIcon, setModalIcon] = useState("senang")

    // const [title, setTitle] = useState<string>("")

    const ideaInitialForm: ideaForm = {
      title: brainstormStore.ideaDetail.title,
      description: brainstormStore.ideaDetail.description,
      authorFullname: brainstormStore.ideaDetail.authorFullname,
      selectedCp: null,
    }

    const goBack = () => navigation.goBack()

    const goToBrainstormsGroup = () => navigation.navigate("brainstormGroupList")

    const loadData = useCallback(async () => {
      console.log("loadIdea ")
      setIsLoading(true)
      await brainstormStore.getListCP()

      setIsLoading(false)
      setListCp(brainstormStore.listCpUser)
    }, [isLoading, brainstormStore.getListCPSuccess, brainstormStore.listCpUser])

    useEffect(() => {
      setTitleBgColour(brainstormStore.ideaDetail.color)
      loadData()
    }, [])

    const setModalContent = (title: string, desc: string, icon: string) => {
      setModalTitle(title)
      setModalDesc(desc)
      setModalIcon(icon)
    }

    const toggleModal = (value: boolean) => {
      setModalVisible(value)
    }

    const onSubmit = useCallback(async (data: ideaForm) => {
      console.log('data ', data)
      if (!data.selectedCp.id) {
        console.log()
        setErrorField("selectedCp")
        return
      }

      
      setErrorField("")
      await brainstormStore.sendIdeaToCp({
        ideaPoolsId: brainstormStore.ideaDetail.id,
        counterPartId: data.selectedCp.id
      })
      if (brainstormStore.errorCode === null) {
        setModalContent(
          "Berhasil!",
          "Informasi mengenai ide ini sudah terkirim melalui e-mail kepada CP-mu.",
          "senang",
        )
        toggleModal(true)
      } else {
        setModalContent("Oh no! :(", "Permintaanmu gagal diproses :(\nCoba lagi ya!", "marah")
        toggleModal(true)
      }
    }, [brainstormStore.errorCode, brainstormStore.sendIdeaToCpSuccess])

    const handleSubmitNewIdea = useCallback(
      async (data: ideaForm) => {
        console.log("handleSubmitNewIdea", data)
        await brainstormStore.createIdea({
          // brainstormGroupId: groupId,
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
      [brainstormStore.errorCode],
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
                    <VStack style={Layout.flexCenterMid} horizontal={Spacing[24]}>
                      <SenyumActive height={Spacing[64]} width={Spacing[64]} />
                      <Spacer height={Spacing[24]} />
                      <Text
                        type={"body-bold"}
                        style={{ color: Colors.BRIGHT_BLUE, textAlign: "center" }}
                      >
                        Hore!
                        <Text type={"body-bold"} style={[]}>
                          {
                            " Ide telah berhasil dipilih. Kirimkan informasi mengenai pilihan ide group brainstorming-mu kepada CP-mu."
                          }
                        </Text>
                      </Text>
                    </VStack>
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
                          <TextField
                            value={values.title}
                            onChangeText={handleChange("title")}
                            isRequired={false}
                            editable={false}
                            isError={errorField === "title"}
                            secureTextEntry={false}
                            placeholder={"Tulis judul disini"}
                            charCounter={true}
                            maxChar={30}
                            inputStyle={{
                              backgroundColor: titleBgColour,
                              borderWidth: Spacing[0],
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
                            editable={false}
                            isError={errorField === "description"}
                            secureTextEntry={false}
                            placeholder={"Tulis deskripsi disini"}
                            isTextArea={true}
                            inputStyle={{ minHeight: Spacing[64] }}
                            charCounter={true}
                            value={values.description}
                            onChangeText={handleChange("description")}
                          />

                          {isViewMode && (
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
                                // isError={isError === "title"}
                                secureTextEntry={false}
                              />
                            </VStack>
                          )}

                          <DropDownPicker
                            items={listCp}
                            isRequired={true}
                            value={values.selectedCp}
                            label={"Kirim e-mail ke CP-mu!"}
                            onValueChange={(value: DropDownItem | DropDownItem[]) => {
                              setFieldValue("selectedCp", value)
                            }}
                            placeholder={"Pilih CP-mu."}
                            containerStyle={{ marginTop: Spacing[4] }}
                            isError={errorField === "selectedCp"}
                            multiple={false}
                            maxSelected={10}
                          />

                          <VStack horizontal={Spacing[72]} top={Spacing[24]}>
                            <Button type={"primary"} text={"Kirim"} onPress={handleSubmit} />
                          </VStack>
                        </VStack>
                      </VStack>
                    )}
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
                        onPress={goToBrainstormsGroup}
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

export default SendEmail
