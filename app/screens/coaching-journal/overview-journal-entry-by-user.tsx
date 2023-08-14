import React, { FC, useReducer, useState, useEffect, useCallback } from "react"
import { SafeAreaView, ScrollView, Platform } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, TextField, BackNavigation } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { Formik } from "formik"
import { launchImageLibrary, ImagePickerResponse, } from "react-native-image-picker"
import { useStores } from "../../bootstrap/context.boostrap"

type CoacheeListItem = {
  index: number
  name: string
}

const OverviewJournalEntryByUser: FC<StackScreenProps<NavigatorParamList, "overviewJournalEntryByUser">> =
  observer(({ navigation, route }) => {
    const { title, learnerJournals, coachJournal } = route.params
    const { coachingStore } = useStores()

    console.log("overview journal by user", JSON.stringify(route.params))

    // empty list state

    const [listCoachee, setListCoachee] = useState<CoacheeListItem[]>([])
    const [activeCoacheeIndex, setActiveCoacheeIndex] = useState<number>(0)
    const [content, setContent] = useState<string>("")
    const [recommendation, setRecommendation] = useState<string>("")
    const [coachFullName, setCoachFullName] = useState<string>("")
    const [commitment, setCommitment] = useState<string>("")
    const [lessonLearned, setLessonLearned] = useState<string>("")
    const [improvement, setImprovement] = useState<string>("")
    const [strength, setStrength] = useState<string>("")
    const [learnerFullname, setLearnerFullname] = useState<string>("")

    // Upload attachment states
    const [isErrorFile, setErrorFile] = useState<boolean>(false)
    const [isAttachmentClicked, setIsAttachmentClicked] = useState<boolean>(false)
    const [selectedPicture, setSelectedPicture] = useState([])
    const qualityImage = Platform.OS === "ios" ? 0.4 : 0.5
    const maxWidthImage = 1024
    const maxHeightImage = 1024

    const formInitialValue = coachJournal ? {
      content: '',
      recommendationForCoachee: '',
      improvement: '',
      title: title,
      coachFullName: '',
      strength: ''
    } : {
      content: '',
      commitment: '',
      lessonLearned: '',
      title: title,
      learnerFullname: ''
    }

    const goBack = () => {
      navigation.goBack()
    }

    useEffect(() => {
      loadData()
    }, [])

    const loadData = () => {

      if (coachJournal) {
        formInitialValue.content = coachJournal.content
        formInitialValue.improvement = coachJournal.improvement
        formInitialValue.recommendationForCoachee = coachJournal.recommendation_for_coachee
        formInitialValue.coachFullName = coachJournal.coach_fullname
        formInitialValue.strength = coachJournal.strength

        setContent(coachJournal.content)
        setRecommendation(coachJournal.recommendation_for_coachee)
        setCoachFullName(coachJournal.coach_fullname)
        setImprovement(coachJournal.improvement)
        setStrength(coachJournal.strength)

        // handle attachment
        let tempDocUrl = ''
        if (coachJournal.documents_url.length > 0) {
          tempDocUrl = coachJournal.documents_url[0]
        }

        let splitTempDocUrl
        let tempFileName
        if (tempDocUrl !== '' && tempDocUrl !== undefined && tempDocUrl.includes('http')) {
          splitTempDocUrl = tempDocUrl.split('/')
          tempFileName = splitTempDocUrl[splitTempDocUrl.length - 1]
          setSelectedPicture([tempFileName])
        }


      }

      if (learnerJournals) {
        const coacheeTemp: CoacheeListItem[] = learnerJournals.map((el, index) => {
          return { index: index, name: el.learner_fullname }
        })
        setListCoachee(coacheeTemp)
        setActiveCoachee(0)
      }
    }

    useEffect(() => {
      setActiveCoachee(0)
    }, [learnerJournals])

    useEffect(() => {
      if (learnerJournals) {
        formInitialValue.lessonLearned = learnerJournals[activeCoacheeIndex].jl_lesson_learned ? learnerJournals[activeCoacheeIndex].jl_lesson_learned : ''
        formInitialValue.commitment = learnerJournals[activeCoacheeIndex].jl_commitment ? learnerJournals[activeCoacheeIndex].jl_commitment : ''
        formInitialValue.content = learnerJournals[activeCoacheeIndex].journal_content ? learnerJournals[activeCoacheeIndex].journal_content : ''
        formInitialValue.learnerFullname = learnerJournals[activeCoacheeIndex].learner_fullname ? learnerJournals[activeCoacheeIndex].learner_fullname : ''

        setLessonLearned(learnerJournals[activeCoacheeIndex].jl_lesson_learned ? learnerJournals[activeCoacheeIndex].jl_lesson_learned : '')
        setCommitment(learnerJournals[activeCoacheeIndex].jl_commitment ? learnerJournals[activeCoacheeIndex].jl_commitment : '')
        setContent(learnerJournals[activeCoacheeIndex].journal_content ? learnerJournals[activeCoacheeIndex].journal_content : '')
        setLearnerFullname(learnerJournals[activeCoacheeIndex].learner_fullname ? learnerJournals[activeCoacheeIndex].learner_fullname : '')
      }
    }, [activeCoacheeIndex])

    const setActiveCoachee = (index) => {
      setActiveCoacheeIndex(index)
    }

    const cameraHandler = useCallback(async (response: ImagePickerResponse) => {
      // console.log(response)
      if (!response.didCancel) {
        const formData = new FormData()
        for (const asset of response.assets) {
          const id = response.assets.indexOf(asset);

          const format = "jpeg"

          formData.append("files", {
            ...response.assets[id],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            uri:
              Platform.OS === "android"
                ? response.assets[id].uri
                : response.assets[id].uri.replace("file://", ""),
            name: `feed-image-${response.assets[id].fileName.toLowerCase().split(" ")[0]}-${new Date().getTime()}.${format}`,
            type: response.assets[id].type ?? "image/jpeg",
            size: response.assets[id].fileSize,
          })
          console.log(`imgName = coaching-image-${response.assets[id].fileName.toLowerCase().split(" ")[0]}-${new Date().getTime()}.${format}`)
        }

        coachingStore.formReset()
        console.log('formData ', formData)
        const responseUpload = await coachingStore.uploadImage(formData)
        console.log('responseUpload ', responseUpload)
        const listResponseUpload = responseUpload.data.urls.split(';')
        console.log('listResponseUpload ', listResponseUpload)

        if (coachingStore.errorCode === null && responseUpload !== undefined) {
          console.log('upload photo OK.')
          setSelectedPicture(listResponseUpload)
          // setUploadedPicture(listResponseUpload)
        }

      } else {
        console.log("cancel")
      }
    }, [selectedPicture, setSelectedPicture])

    const removeSelectedPict = (id) => {
      const tempSelected = [...selectedPicture];
      tempSelected.splice(id, 1);
      setSelectedPicture(tempSelected)
    }

    const openGallery = useCallback(() => {
      launchImageLibrary(
        {
          mediaType: "photo",
          quality: qualityImage,
          maxWidth: maxWidthImage,
          maxHeight: maxHeightImage,
          includeBase64: false,
          selectionLimit: 1,
        },
        async (response) => {
          await cameraHandler(response)
        },
      ).then(r => {
      })
    }, [isAttachmentClicked])



    return (
      <VStack
        testID="CoachingJournalMain"
        style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
      >
        <SafeAreaView style={Layout.flex}>
          <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
          {
            learnerJournals &&
            <ScrollView horizontal={true}>
              <HStack>
                <VStack left={Spacing[24]} />
                {listCoachee.map((item) => {
                  return (
                    <VStack key={item.index} right={Spacing[12]}>
                      <Button
                        type={activeCoacheeIndex === item.index ? "primary-dark" : "negative"}
                        text={item.name}
                        onPress={() => {
                          setActiveCoachee(item.index)
                        }}
                        style={{ paddingHorizontal: Spacing[20] }}
                      />
                    </VStack>
                  )
                })}
              </HStack>
            </ScrollView>
          }
          <ScrollView>
            <Formik
              initialValues={formInitialValue}
              onSubmit={(values) => {
                console.log(values)
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                <>
                  <VStack top={Spacing[12]} horizontal={Spacing[24]}>
                    <HStack>
                      <Text type={"left-header"} style={{}} text="Coaching journal overview" />
                      <Spacer />
                    </HStack>
                    <VStack>
                      <TextField
                        value={title}
                        // onChangeText={setTitle}
                        isRequired={false}
                        editable={false}
                        inputStyle={{
                          backgroundColor: Colors.ABM_DARK_BLUE,
                          color: Colors.WHITE,
                          textAlign: "left",
                          paddingHorizontal: 10,
                          fontWeight: "bold",
                          borderColor: Colors.ABM_DARK_BLUE,
                          borderRadius: 10
                        }}
                        secureTextEntry={false}
                      />
                      <TextField
                        value={coachJournal ? ("Yang dicatat oleh " + coachFullName + ":") : ("Yang dicatat oleh " + learnerFullname + ":")}
                        isRequired={false}
                        editable={false}
                        inputStyle={{
                          backgroundColor: Colors.ABM_DARK_BLUE,
                          color: Colors.WHITE,
                          fontSize: Spacing[14],
                          fontWeight: "bold",
                          minHeight: Spacing[12],
                          paddingHorizontal: Spacing[12],
                          paddingVertical: Spacing[12],
                          borderColor: Colors.ABM_DARK_BLUE,
                          borderRadius: 10
                        }}
                        style={{ width: "auto", justifyContent: "center", alignItems: "center" }}
                        secureTextEntry={false}
                      />
                      <VStack top={Spacing[12]}>
                        <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                          {`Apa yang `}
                          <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                            {"dibicarakan"}
                          </Text>
                          {` saat coaching?`}
                        </Text>
                        <TextField
                          style={{ paddingTop: 0 }}
                          inputStyle={{ minHeight: Spacing[64] }}
                          editable={false}
                          isRequired={false}
                          value={content}
                          secureTextEntry={false}
                          isTextArea={true}
                        />
                      </VStack>

                      {/* Attachment */}
                      <VStack top={Spacing[8]} style={{ alignItems: 'flex-end' }}>
                        <HStack bottom={Spacing[6]}>
                          <Spacer />
                          <Spacer />
                          {selectedPicture.map((pic, id) => {

                            if (pic === undefined) {
                              return
                            }

                            let splittedText = pic.split(".")
                            let fileFormat
                            let fileNameOnly
                            let fileNameToDisplay = pic

                            if (splittedText.length > 1) {
                              fileNameOnly = splittedText[0]
                              fileFormat = splittedText[splittedText.length - 1]
                            }

                            // console.log(`fileNameOnly = ${fileNameOnly}`)
                            // console.log(`fileFormat = ${fileFormat}`)


                            if (pic.length > 18) {
                              fileNameToDisplay = `${fileNameOnly.slice(0, 15)}...${fileFormat}`
                            }

                            return (
                              <HStack key={'id'}>
                                <Text type={"body"} text={fileNameToDisplay} style={{ fontSize: Spacing[10], left: Spacing[2] }} numberOfLines={1} />
                              </HStack>
                            )
                          })}

                          <Button type={selectedPicture.length > 0 ? "dark-yellow" : "negative"} text="Unduh Lampiran" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[20], left: Spacing[10] }} textStyle={{ fontSize: Spacing[12] }} onPress={() => { }} disabled={selectedPicture.length === 0} />
                        </HStack>
                      </VStack>


                      {
                        coachJournal &&
                        <>
                          <VStack top={Spacing[12]}>
                            <Text
                              type={"body-bold"}
                              style={[{ textAlign: "center", top: Spacing[4] }]}
                            >
                              {`Dari sesi coaching, apa yang sudah coachee lakukan dengan `}
                              <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                {"efektif?"}
                              </Text>
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              inputStyle={{ minHeight: Spacing[48] }}
                              editable={false}
                              isRequired={false}
                              value={strength}
                              secureTextEntry={false}
                              isTextArea={true}
                            />
                          </VStack>

                          <VStack top={Spacing[12]}>
                            <Text
                              type={"body-bold"}
                              style={[{ textAlign: "center", top: Spacing[4] }]}
                            >
                              {`Dari sesi coaching11, kualitas apa yang dapat coachee `}
                              <Text
                                type={"body-bold"}
                                style={[{ color: Colors.ABM_LIGHT_BLUE }]}
                              >
                                {"tingkatkan "}
                              </Text>
                              {`lagi?`}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              inputStyle={{ minHeight: Spacing[48] }}
                              editable={false}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                              value={improvement}
                            />
                          </VStack>

                          <VStack top={Spacing[12]}>
                            <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                              {`Dari sesi coaching, apa `}
                              <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                {"rekomendasi saya untuk coachee"}
                              </Text>
                              {``}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              inputStyle={{ minHeight: Spacing[48] }}
                              editable={false}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                              value={recommendation}
                            />
                          </VStack>
                        </>
                      }

                      {
                        learnerJournals &&
                        <>
                          <VStack top={Spacing[12]}>
                            <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                              {`Tulislah`}
                              <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                {'"lessons learned"'}
                              </Text>
                              {`-mu di coaching session ini. `}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              inputStyle={{ minHeight: Spacing[48] }}
                              editable={false}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                              value={lessonLearned}
                            />
                          </VStack>

                          <VStack top={Spacing[12]}>
                            <Text type={"body-bold"} style={{ textAlign: "center", top: Spacing[4] }}>
                              <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                {"Komitmen"}
                              </Text>
                              {` apa saja yang sudah disepakati bersama?`}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              inputStyle={{ minHeight: Spacing[128] }}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                              editable={false}
                              value={commitment}
                            />
                          </VStack>
                        </>
                      }
                    </VStack>
                  </VStack>
                </>
              )}
            </Formik>
          </ScrollView>
        </SafeAreaView>
      </VStack>
    )
  })

export default OverviewJournalEntryByUser
