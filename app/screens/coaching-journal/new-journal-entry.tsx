import React, { FC, useCallback, useReducer, useState, useEffect } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, Button, TextField, DropDownPicker, DropDownItem } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { dimensions } from "@config/platform.config"

import CalendarPicker from "react-native-calendar-picker"
import { typography } from "@theme"
import { useStores } from "../../bootstrap/context.boostrap"

import Modal from "react-native-modalbox"

import { MoodComponent } from "@screens/homepage/components/mood-component"

import moment from "moment"

import Spinner from "react-native-loading-spinner-overlay"

import { Formik } from "formik"

import { IconClose } from "@assets/svgs"
import { HorizontalAlignment } from "@components/view-stack/Types.ViewStack"
import { ABM_GREEN } from "@styles/Color"

export type JournalEntryType = {
  coachId: string
  date: string
  title: string
  content: string
  strength: string
  improvement: string
  recommendationForCoachee: string
  type: string
  label: string
  learnerIds: string[]
  documentsUrl: string
}

const JournalEntryInitialValue: JournalEntryType = {
  coachId: "",
  date: moment(new Date()).format(),
  title: "",
  content: "",
  strength: "",
  improvement: "",
  recommendationForCoachee: "",
  type: "",
  label: "",
  learnerIds: [],
  documentsUrl: ""
}

const NewJournalEntry: FC<StackScreenProps<NavigatorParamList, "newJournalEntry">> = observer(
  ({ navigation, route }) => {
    const { mainStore, coachingStore } = useStores()

    const styles = StyleSheet.create({
      textError: {
        color: Colors.MAIN_RED,
      },
    })

    const fieldError = false

    const [isModalVisible, setModalVisible] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [dataTeamMember, setDataTeamMember] = useState<DropDownItem[]>([]);
    const [dataJournalTags, setDataJournalTags] = useState([
      {
        id: '0',
        key: 'KPI coaching',
        item: 'KPI coaching'
      },
      {
        id: '1',
        key: 'Project Culture Coaching',
        item: 'Project Culture coaching',
      },
      {
        id: '2',
        key: 'other',
        item: 'Others',
      }
    ]);
    const [isError, setError] = useState<boolean>(false)
    const [isErrorFile, setErrorFile] = useState<boolean>(false)

    // Success / fail response modal
    const [isResponseModalVisible, setIsResponseModalVisible] = useState(false)
    const [modalTitle, setModalTitle] = useState<string>("")
    const [modalDesc, setModalDesc] = useState<string>("")
    const [modalIcon, setModalIcon] = useState("senang")

    // Upload attachment states
    // const [selectedPicture, setSelectedPicture] = useState([])
    // const [uploadedPicture, setUploadedPicture] = useState([])
    // const actionSheetRef = createRef();
    
    const [journalEntryForm, setJournalEntryForm] =
      useState<JournalEntryType>(JournalEntryInitialValue)

    const toggleModal = () => {
      setTimeout(() => {
        setModalVisible(!isModalVisible)
      }, 100)
    }

    const toggleResponseModal = () => {
      setTimeout(() => {
        setIsResponseModalVisible(!isResponseModalVisible)
      }, 100)
    }

    const onDateChange = (selectedDate, setFieldValue) => {
      const dateTime = moment(selectedDate).format()
      setSelectedDate(dateTime)
      setFieldValue("date", selectedDate)
      console.log(dateTime)
    }

    const getListUser = useCallback(async (id: string) => {
      await mainStore.getListUser(id)
      console.log("useEffect mainStore.listUserProfile", mainStore.listUserProfile)
    }, [])

    useEffect(() => {
      if (mainStore.listUserProfile) {
        console.log("mainStore.listUserProfile", mainStore.listUserProfile)
        const itemsData: DropDownItem[] = mainStore.listUserProfile.map((item, index) => {
          return {
            item: item.fullname,
            id: item.id,
          }
        })
        setDataTeamMember(itemsData)
      }
    }, [mainStore.listUserProfile])

    useEffect(() => {
      setSelectedDate(moment().format("LLLL"))
      coachingStore.resetLoading()
      mainStore.resetLoading()
    }, [])

    useEffect(() => {
      getListUser(mainStore.userProfile.team1_id)
    }, [])

    const goBack = () => {
      coachingStore.resetCoachingStore()
      navigation.goBack()
    }

    // Handle redirect to home or close modal
    const handleModalResponse = () => {
      if(coachingStore.messageCreateJournal === "Success") {
        coachingStore.resetCoachingStore()
        coachingStore.setRefreshData(true)
        coachingStore.clearJournal().then(()=>{
          navigation.reset({
            routes: [{ name: 'coachingJournalMain' }]
          })
        })
      } else {
        toggleResponseModal()
      }
    }
    // Set modal content based on API success / fail
    useEffect(() => {
      if (coachingStore.messageCreateJournal) {
        if(coachingStore.messageCreateJournal === "Success"){
          setModalContent("Sukses!", "Catatan telah sukses disimpan!", "senang")
        } else {
          setModalContent("Ada Kesalahan!", "Ups! Sepertinya ada kesalahan!\nSilahkan coba lagi!", "terkejut")
        }
        toggleResponseModal()
      }
    },[coachingStore.messageCreateJournal])

    const onSubmit = useCallback(
      async (data: JournalEntryType) => {
        if (data.title === "" || !data.learnerIds[0] || data.content === "" || data.strength === "" || data.improvement === ""
        || data.recommendationForCoachee === "" || !data.type || data.type === "" || data.type === "Others" && data.label === ""
        || data.date === "") {
          setError(true)
        } else {
          setError(false)
          setErrorFile(false)
          setJournalEntryForm(data)
          console.log("journal entry to be passed ", data)
          console.log("journalEntryForm submitted", journalEntryForm)
          let temp = processLearnerIds(data)
          if (!isError && !isErrorFile) {
            await coachingStore.createJournal(temp)
          }
        }
      },
      [setJournalEntryForm, journalEntryForm],
    )

    const processLearnerIds = (journalEntry) : JournalEntryType => {
      console.log("journalEntryForm ", journalEntryForm)
      const tempLearnerIds = [];
      for (let i = 0; i < journalEntry.learnerIds.length; i++) {
        tempLearnerIds.push(journalEntry.learnerIds[i].id);
      }
      journalEntry.learnerIds = tempLearnerIds;

      return journalEntry;
    }

    const setModalContent = (title: string, desc: string, icon: string) => {
      setModalTitle(title)
      setModalDesc(desc)
      setModalIcon(icon)
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={Layout.flex}
      >
        <VStack
          testID="CoachingJournalMain"
          style={{ backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center" }}
        >
          <Formik
            initialValues={journalEntryForm}
            // validationSchema={JournalEntryTypeSchema}
            onSubmit={onSubmit}
            // validate={validate}
          >
            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
              <>
                <SafeAreaView style={Layout.flex}>
                  <ScrollView style={[Layout.flex, { flex: 1 }]} nestedScrollEnabled={true}>
                    <VStack top={Spacing[32]} horizontal={Spacing[24]}>
                      <HStack>
                        <Text type={"left-header"} style={{}} text="Tambah Coaching Journal." />
                        <Spacer />
                        <HStack>
                          <Button type={"red-bg"} text={"Cancel"} onPress={goBack} />
                        </HStack>
                      </HStack>

                      <VStack>
                      { isError && <Text
                          type={"label"}
                          style={{
                            textAlign: 'center',
                            marginTop: Spacing[4],
                            color: Colors.MAIN_RED
                          }}
                        >Ups! Sepertinya ada kolom yang belum diisi! Silahkan dicek kembali dan isi semua kolom yang tersedia!</Text>
                      }
                      { isErrorFile && <Text
                          type={"label"}
                          style={{
                            textAlign: 'center',
                            marginTop: Spacing[4],
                            color: Colors.MAIN_RED
                          }}
                        >Ups! Sepertinya file dokumen tidak sesuai dengan syarat yang telah disediakan! Silahkan dicek kembali!</Text>
                      }
                        <TextField
                          value={values.title}
                          onChangeText={handleChange("title")}
                          isRequired={false}
                          editable={true}
                          isError={isError && !values.title}
                          secureTextEntry={false}
                          placeholder={"Tulis nama judul sesi coaching di sini."}
                          inputStyle={{borderRadius: Spacing[12]}}
                          
                        />
                        <HStack style={{ zIndex: 100 }}>
                          <VStack style={{ width: Spacing[64] }}>
                            <Text
                              type={"body-bold"}
                              style={[
                                { textAlign: "center", top: Spacing[4] },
                                isError && values.learnerIds.length < 0 ? styles.textError : null,
                              ]}
                              text="dengan"
                            />
                          </VStack>
                          <VStack
                            style={{ maxWidth: dimensions.screenWidth - Spacing[128], flex: 1 }}
                          >
                            <DropDownPicker
                              items={dataTeamMember}
                              isRequired={false}
                              // value={values.lea}
                              onValueChange={(value: DropDownItem | DropDownItem[]) => {
                                setFieldValue("learnerIds", value)
                              }}
                              placeholder={"Pilih coachee (max. 5 orang)"}
                              containerStyle={{ marginTop: Spacing[4] }}
                              isError={isError && values.learnerIds.length == 0}
                              multiple={true}
                            />
                          </VStack>
                        </HStack>
                        <HStack>
                          <TouchableOpacity
                            style={{ height: "100%", width: "20%" }}
                            onPress={toggleModal}
                            disabled={false}
                          >
                            <VStack
                              horizontal={Spacing[8]}
                              vertical={Spacing[2]}
                              style={{
                                flex: 1,
                                width: "100%",
                                borderRadius: Spacing[12],
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                backgroundColor: Colors.ABM_DARK_BLUE,
                              }}
                            >
                              <Text
                                type={"button"}
                                style={{ color: Colors.WHITE, bottom: -Spacing[8] }}
                                text={`${moment(selectedDate).format("DD MMM")}`.split(" ")[0]}
                              />
                              <Text type={"button"} style={{ color: Colors.WHITE }}>
                                {`${moment(values.date).format("DD MMM")}`.split(" ")[1]}
                              </Text>
                            </VStack>
                          </TouchableOpacity>
                          <Spacer />
                          <VStack top={Spacing[8]} style={{ width: "75%" }}>
                            <Text
                              type={"body-bold"}
                              style={[
                                { textAlign: "center", top: Spacing[4] },
                                isError && !values.content ? styles.textError : null,
                              ]}
                            >
                              {`Apa yang `}
                              <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                {"dibicarakan"}
                              </Text>
                              {` saat coaching?`}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              value={values.content}
                              isError={isError && !values.content }
                              onChangeText={handleChange("content")}
                              inputStyle={{ minHeight: Spacing[72] }}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                              charCounter={true}
                            />
                          </VStack>
                        </HStack>
                        {/* TODO: Add file upload */}
                        {/* <HStack>
                        <VStack top={Spacing[8]}>
                          <Button
                              type={"yellow-bg"}
                              text={"Lampirkan Dokumen"}
                              onPress={() => {console.log('')}}
                            />
                          </VStack>
                        </HStack> */}
                        {coachingStore.isFormCoach && (
                          <VStack top={Spacing[12]}>
                            <Text
                              type={"body-bold"}
                              style={[
                                { textAlign: "center", top: Spacing[4] },
                                isError && !values.strength ? styles.textError : null,
                              ]}
                            >
                              {`Dari sesi chacing, apa yang sudah coachee lakukan dengan `}
                              <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                                {"efektif?"}
                              </Text>
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              inputStyle={{ minHeight: Spacing[48] }}
                              isRequired={false}
                              value={values.strength}
                              editable={true}
                              isError={isError && !values.strength}
                              onChangeText={handleChange("strength")}
                              secureTextEntry={false}
                              isTextArea={true}
                              charCounter={true}
                            />
                          </VStack>
                        )}
                        {coachingStore.isFormCoach && (
                          <VStack top={Spacing[12]}>
                            <Text
                              type={"body-bold"}
                              style={[
                                { textAlign: "center", top: Spacing[4] },
                                isError && !values.improvement ? styles.textError : null,
                              ]}
                            >
                              {`Dari sesi coaching, kualitas apa yang dapat coachee `}
                              <Text
                                type={"body-bold"}
                                style={[
                                  { color: Colors.ABM_LIGHT_BLUE },
                                  fieldError ? styles.textError : null,
                                ]}
                              >
                                {"tingkatkan "}
                              </Text>
                              {`lagi?`}
                            </Text>
                            <TextField
                              style={{ paddingTop: 0 }}
                              inputStyle={{ minHeight: Spacing[48] }}
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={true}
                              editable={true}
                              isError={isError && !values.improvement}
                              value={values.improvement}
                              onChangeText={handleChange("improvement")}
                              charCounter={true}
                            />
                          </VStack>
                        )}
                        <VStack top={Spacing[12]}>
                          <Text
                            type={"body-bold"}
                            style={[
                              { textAlign: "center", top: Spacing[4] },
                              isError && !values.recommendationForCoachee ? styles.textError : null,
                            ]}
                          >
                            {`Dari sesi coaching, apa`}
                            <Text type={"body-bold"} style={{ color: Colors.ABM_LIGHT_BLUE }}>
                              {" rekomendasi saya untuk coachee?"}
                            </Text>
                          </Text>
                          <TextField
                            style={{ paddingTop: 0 }}
                            inputStyle={{ minHeight: Spacing[128] }}
                            isRequired={false}
                            secureTextEntry={false}
                            isTextArea={true}
                            editable={true}
                            value={values.recommendationForCoachee}
                            isError={isError && !values.recommendationForCoachee }
                            onChangeText={handleChange("recommendationForCoachee")}
                            charCounter={true}
                          />
                        </VStack>

                        <VStack>
                          <Text
                            type={"body-bold"}
                            style={[
                              { textAlign: "left" },
                              isError && !values.type ? styles.textError : null,
                            ]}
                          >Pilih kategori coaching:</Text>
                          <DropDownPicker
                            items={dataJournalTags}
                            isRequired={false}
                            hideInputFilter={true}
                            // value={values.lea}
                            onValueChange={(value: DropDownItem | DropDownItem[]) => {
                              setFieldValue("type", value.key)
                            }}
                            placeholder={"Pilih kategori"}
                            containerStyle={{ marginTop: -Spacing[24] }}
                            isError={isError && !values.type}
                            multiple={false}
                          />
                          {values.type === "other" && (
                            <TextField
                              style={{ paddingTop: 0 }}
                              inputStyle={{ minHeight: Spacing[48], marginTop: Spacing[8]}}
                              placeholder="Tulis kategori coaching di sini."
                              isRequired={false}
                              secureTextEntry={false}
                              isTextArea={false}
                              editable={true}
                              // value={leassons}
                              isError={isError && !values.label}
                              onChangeText={handleChange("label")}
                            />
                          )}
                        </VStack>
                        <VStack horizontal={Spacing[72]} top={Spacing[24]}>
                          <Button
                            type={"primary-form"}
                            text={"Simpan Catatan"}
                            onPress={handleSubmit}
                          />
                        </VStack>
                      </VStack>
                    </VStack>
                  </ScrollView>
                  <Modal
                    isOpen={isModalVisible}
                    style={{
                      position: "absolute",
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
                        <VStack vertical={Spacing[12]}>
                          <Spacer height={Spacing[24]} />
                          <CalendarPicker
                            onDateChange={(value) => {
                              onDateChange(value, setFieldValue)
                            }}
                            textStyle={{
                              fontFamily: typography.primaryBold,
                              colors: Colors.ABM_DARK_BLUE,
                            }}
                            selectedDayColor={Colors.ABM_YELLOW}
                            selectedDayTextColor={Colors.ABM_DARK_BLUE}
                            style={{ padding: Spacing[20] }}
                            width={dimensions.screenWidth - Spacing[64]}
                            maxDate={new Date()}
                          />
                          <HStack style={[Layout.widthFull, { justifyContent: "center" }]}>
                            <Button type={"light-bg"} text={"Cancel"} onPress={toggleModal} />
                            <Spacer width={Spacing[4]} />
                            <Button
                              type={"primary-form"}
                              text={"Pilih"}
                              onPress={toggleModal}
                              style={{ minWidth: Spacing[72] }}
                            />
                          </HStack>
                        </VStack>
                      </VStack>
                    </View>
                  </Modal>
                </SafeAreaView>
              </>
            )}
          </Formik>

          <Spinner
            visible={coachingStore.isLoading || mainStore.isLoading}
            textContent={"Memuat..."}
            // textStyle={styles.spinnerTextStyle}
          />

          {/* <ActionSheet ref={actionSheetRef}>
                  {
                    <>
                      <VStack
                        style={{ justifyContent: "center" }}
                        vertical={Spacing[24]}
                        horizontal={Spacing[24]}
                      >
                        <VStack style={[Layout.widthFull, Layout.flexCenter]} bottom={Spacing[12]}>
                          <Text type={"body-bold"} style={{}} text={`Mengupload ${isPhoto === true ? "Foto 🖼" : "Video 🎥"}`} />
                        </VStack>
                        <Button
                          onPress={() => {
                            openGallery(isPhoto)
                          }}
                          type={"primary-form"}
                          text={"Galeri Foto 🖼️"}
                        />
                        <Spacer height={Spacing[12]} />
                        <Button
                          onPress={() => {
                            openCamera(isPhoto)
                          }}
                          type={"primary-form"}
                          text={"Kamera 📸"}
                        />
                        <VStack style={[Layout.widthFull, Layout.flexCenter]} top={Spacing[12]}>
                          <Button
                            onPress={() => {
                              setIsPhoto(null)
                            }}
                            type={"secondary"}
                            text={"Kembali"}
                          />
                        </VStack>
                      </VStack>
                    </>
                  }
                </ActionSheet> */}

          <Modal
            isOpen={isResponseModalVisible}
            style={{
              position: "absolute",
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
                    <VStack style={{
                      alignItems: "flex-end"
                    }}>
                      <TouchableOpacity onPress={toggleResponseModal}>
                        <IconClose height={Spacing[32]} width={Spacing[32]} />
                      </TouchableOpacity>
                    </VStack>
                    <HStack bottom={Spacing[32]}>
                      <Spacer />
                      <MoodComponent data={modalIcon} width={Spacing[96]} height={Spacing[96]} />
                      <Spacer />
                    </HStack>
                    <Text
                      type={"body-bold"}
                      style={{ fontSize: Spacing[32], textAlign: "center", color: ABM_GREEN}}
                      text={modalTitle}
                    />
                    <Spacer height={Spacing[24]} />
                    <Text type={"body"} style={{ textAlign: "center" }} text={modalDesc} />
                    <Spacer height={Spacing[20]} />
                    <HStack bottom={Spacing[24]}>
                      <Spacer />
                      <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}>
                        <Button
                          type={"primary-form"}
                          text={coachingStore.messageCreateJournal === "Success" ? "Kembali ke Menu Utama Coaching Journal" : "Kembali ke Menu Sebelumnya"}
                          style={{ height: Spacing[64], paddingHorizontal: Spacing[18] }}
                          textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                          onPress={handleModalResponse}
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
      </KeyboardAvoidingView>
    )
  },
)

export default NewJournalEntry
