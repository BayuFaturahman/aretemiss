import React, { FC, useEffect, useReducer, useState } from "react"
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Text, BackNavigation, Button } from "@components"
import { NavigatorParamList } from "@navigators/main-navigator"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Colors, Layout, Spacing } from "@styles"

import { useStores } from "../../bootstrap/context.boostrap"

import { dimensions } from "@config/platform.config"
import { images } from "@assets/images";

import { ProgressBar } from "react-native-paper"
import moment from "moment"
import { CopyWritingModel, QuestionnaireModel } from "@services/api/cultureMeasurement/culture-measurement-api.types"
import { TouchableOpacity } from "react-native-gesture-handler"
// import { EmptyList } from "./components/empty-list"


const QUESTIONNAIRE_OPTION = [
    {
        text: 'Jauh di bawah standar',
        color: 'ABM_YELLOW',
        fontColor: 'BLACK'
    },
    {
        text: 'Di bawah standar',
        color: 'ABM_GREEN',
        fontColor: 'BLACK'
    },
    {
        text: 'Sesuai standar, belum konsisten',
        color: 'ABM_LIGHT_BLUE',
        fontColor: 'BLACK'
    },
    {
        text: 'Sesuai standar, konsisten',
        color: 'ABM_DARK_BLUE',
        fontColor: 'WHITE'
    },
    {
        text: 'Di atas standar, konsisten',
        color: 'BLACK',
        fontColor: 'WHITE'
    }
]


const QUESTIONNAIRE_COPY_WRITING: CopyWritingModel[] = [
    {
        id: "71d49471-1af3-4862-b520-02445578e6a6",
        title: " ",
        description: "<p>Terima kasih atas kesediaan Anda untuk mengisi kuesioner Budaya Juara ini. Kuesioner ini dirancang untuk mengetahui sejauh mana peran para pemimpin dalam mengimplementasikan Budaya Juara. Kami berharap penilaian ini dilakukan seobyektif mungkin sehingga rekomendasi pengembangan para pemimpin akan menjadi lebih akurat.</p><br><p>Silakan mengisi kuesioner Budaya Juara ini satu kali per satu kuarter untuk menghasilkan hasil yang bermakna.</p>",
        type: "appraiser",
        questionnaire: []
    },
    {
        id: "a7447d46-dec4-4edf-95d7-1b54ff52c1b7",
        title: " ",
        description: "<p>Anda adalah {{user_position}} di dalam area/fungsi {{user_team}}. Silakan pilih nama individu yang akan Anda berikan penilaian.</p>",
        type: "rated_person",
        questionnaire: []
    },
    {
        id: "1a9fbcca-4671-4e01-ac80-cc0176aaa79b",
        title: "Petunjuk Pengisian",
        description: "<p>Terdapat {{count_questionnaire}} pernyataan yang perlu Anda cermati terkait tugas dan tanggung jawab pemimpin Juara, beserta dengan 5 pilihan penilaian:</p><br>{{questionnaire_type}}<br><p>Kemudian, Anda diminta untuk memberikan jawaban dengan cara meng-klik langsung simbol (O) pada skor penilaian yang Anda anggap paling tepat diberikan kepada pemimpin Juara sesuai dengan kenyataan yang ditampilkan saat ini.</p>",
        type: "example",
        questionnaire: []
    },
    {
        id: "a7a11f2a-890d-4e07-8032-38f7abcacbe7",
        title: "Live by the culture",
        description: "<p>Pada bagian ini, Anda akan melakukan penilaian mengenai bagaimana individu menampilkan Perilaku Budaya Juara dalam kegiatan sehari-hari di lingkungan kerja.</p>",
        type: "questionnaire",
        questionnaire: [
            {
                item: "Melaksanakan tugas dengan semangat untuk menunjukkan hasil terbaik.",
                description: "<p>Yang ditunjukkan dengan perilaku:<br>- Memotivasi diri dan orang lain untuk mencapai hasil terbaik.<br>- Senantiasa mengembangkan kemampuan diri.<br>- Proaktif memberikan penghargaan atas pencapaian kinerja.</p>",
                type: "likert_1"
            },
            {
                item: "Membangun kerjasama yang harmonis untuk melampaui target.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Menciptakan perubahan  untuk menjadi yang terdepan.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Mencurahkan seluruh kemampuan diri untuk hasil terbaik.",
                description: "",
                type: "likert_1"
            }
        ]
    },
    {
        id: "d4269123-48d6-4e77-a453-2cb47dba163d",
        title: "Communicate the Culture",
        description: "<p>Pada bagian ini, Anda akan melakukan penilaian mengenai bagaimana individu mengkomunikasikan Budaya Juara kepada tim.</p>",
        type: "questionnaire",
        questionnaire: [
            {
                item: "Memahami Prinsip-prinsip perilaku Juara dan penerapannya dalam keseharian kerja.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Mampu menjelaskan prinsip-prinsip perilaku Juara kepada anggota tim.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Mendiskusikan perilaku spesifik yang harus ditunjukkan oleh anggota tim dengan menggunakan prinsip Juara.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Menginisiasi kegiatan untuk membantu anggota tim  mengingat prinsip dan perilaku Juara.",
                description: "",
                type: "likert_1"
            }
        ]
    },
    {
        id: "ce960661-443f-457a-ae80-b985efc10bdd",
        title: "Review Team Culture",
        description: "<p>Pada bagian ini, Anda akan melakukan penilaian mengenai bagaimana individu secara proaktif melakukan review terhadap Perilaku Budaya Juara yang ada pada Tim yang dipimpinnya.</p>",
        type: "questionnaire",
        questionnaire: [
            {
                item: "Melakukan pengamatan atas penerapan perilaku sesuai prinsip Juara pada anggota tim.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Memberikan umpan balik kepada anggota tim atas pelaksanaan perilaku sesuai prinsip Juara yang telah dilaksanakan.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Melakukan koordinasi dengan pihak terkait untuk mendukung penerapan perilaku sesuai prinsip Juara pada anggota tim.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Memonitor tindakan perbaikan perilaku Juara.",
                description: "",
                type: "likert_1"
            }
        ]
    },
    {
        id: "42084bd5-c9f9-4c63-941f-185785df5c79",
        title: "Facilitate Culture Learning, Coaching, and Mentoring",
        description: "<p>Pada bagian ini, Anda akan melakukan penilaian mengenai bagaimana individu memfasilitasi Tim dalam mempelajari Perilaku Budaya Juara, serta melakukan coaching dan mentoring.</p>",
        type: "questionnaire",
        questionnaire: [
            {
                item: "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                description: "",
                type: "likert_1"
            },
            {
                item: "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                description: "",
                type: "likert_1"
            },
            {
                item: "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                description: "",
                type: "likert_1"
            }
        ]
    },
    {
        id: "c08d2845-07e2-4347-8fd0-d60dd68a1c0f",
        title: "Drive Culture to grow the Business",
        description: "<p>Pada bagian ini, Anda akan melakukan penilaian mengenai bagaimana individu memastikan bahwa Perilaku dan Proyek Budaya Juara dapat mendorong kinerja bisnis yang diharapkan.</p>",
        type: "questionnaire",
        questionnaire: [
            {
                item: "Mengajarkan pengetahuan tentang perilaku dan Budaya Juara kepada anggota tim",
                description: "",
                type: "likert_1"
            },
            {
                item: "Memberikan pemahaman tentang keterkaitan antara pekerjaan yang dilakukan anggota tim dengan prinsip dan perilaku Juara",
                description: "",
                type: "likert_1"
            },
            {
                item: "Berbagi pengalaman dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                description: "",
                type: "likert_1"
            },
            {
                item: "Melakukan sesi Coaching dengan anggota Tim untuk mendukung Tim dalam menghidupkan perilaku sesuai prinsip Budaya Juara.",
                description: "",
                type: "likert_1"
            }
        ]
    }
]

const QUESTIONNAIRE_EXAMPLE: QuestionnaireModel = {

    "item": "Melaksanakan tugas dengan semangat untuk menunjukan hasil terbaik.",
    "description": "",
    "type": "likert_1",
    "point": 2

}

const CultureMeasurementRating: FC<StackScreenProps<NavigatorParamList, "cultureMeasurementRating">> =
    observer(({ navigation }) => {

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { cultureMeasurementStore } = useStores()

        const [listDescription, setListDescription] = useState<string[]>([])
        const [listQuestionnaire, setListQuestionnaire] = useState<QuestionnaireModel[]>([QUESTIONNAIRE_EXAMPLE])

        const goBack = () => {
            navigation.goBack()
        }

        const extractDesc = () => {
            let tempData = QUESTIONNAIRE_COPY_WRITING.filter((data) => data.type === 'example')
            let tempCopyWriting: CopyWritingModel
            if (tempData.length > 0) {
                tempCopyWriting = tempData[0]
            }

            console.log(`tempDesc: ${JSON.stringify(tempCopyWriting)}`)



            let tempDesc = tempCopyWriting.description
            tempDesc = tempDesc.replaceAll('<br>', '\n')
            tempDesc = tempDesc.replaceAll('<p>', '')
            tempDesc = tempDesc.replaceAll('</p>', '')
            tempDesc = tempDesc.replace('{{count_questionnaire}}', '19')


            console.log(`tempDesc: ${tempDesc}`)
            let listTempDesc = tempDesc.split('{{questionnaire_type}}')
            console.log(`listTemp: ${listTempDesc}`)
            setListDescription(listTempDesc)
        }

        // const extractQuestionnaire = () => {
        //     let tempData = {
        //         "item": "Konsep pengembangan Budaya Perusahaan telah disusun secara jelas dan mencakup seluruh aspek organisasi perusahaan.",
        //         "description": "",
        //         "type": "likert_1",
        //         "point": 2
        //     }

        //     let tempQuestionnaire: QuestionnaireModel[] = [tempData]
        //     setListQuestionnaire(tempQuestionnaire)
        // }

        useEffect(() => {
            cultureMeasurementStore.getObjectiveById('7aa169c3-7316-4593-8225-2b8cca6f689d') // toDO: Change non-hardcoded
            extractDesc()
            // extractQuestionnaire()

        }, [])


        const renderQuestionExample = () => {
            return (
                <>
                    <HStack >
                        <VStack>
                            <Text type="body-bold">1.</Text>
                            <Spacer />
                        </VStack>
                        <Spacer width={Spacing[6]} />
                        <Text type="body-bold" >Konsep pengembangan Budaya Perusahaan telah disusun secara jelas dan mencakup seluruh aspek organisasi perusahaan.</Text>
                    </HStack>
                    <Spacer height={Spacing[12]} />
                    <HStack >
                        {/* <Spacer /> */}
                        <VStack horizontal={Spacing[12]} vertical={Spacing[12]} >
                            {QUESTIONNAIRE_OPTION.map((data, index) => {
                                if (index < 3) {
                                    return (
                                        <TouchableOpacity disabled={true}>
                                            <HStack bottom={Spacing[6]} style={{ backgroundColor: listQuestionnaire[0].point === index + 1 ? Colors.ABM_BG_BLUE : Colors.WHITE, paddingHorizontal: Spacing[12], paddingVertical: Spacing[6], borderRadius: Spacing[10] }}>
                                                {/* <Spacer /> */}
                                                <View style={{
                                                    height: Spacing[18] + Spacing[3],
                                                    width: Spacing[18] + Spacing[3],
                                                    right: Spacing[6],
                                                    backgroundColor: listQuestionnaire[0].point === index + 1 ? Colors[data.color] : Colors.GRAY74,
                                                    borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                    borderColor: listQuestionnaire[0].point === index + 1 ? Colors[data.color] : Colors.GRAY74,
                                                    alignContent: 'center',
                                                    justifyContent: 'center'
                                                }} >
                                                    <HStack>
                                                        <Spacer /><Text type="body" text={(index + 1).toString()} style={{ fontSize: Spacing[12], color: Colors[data.fontColor] }} /><Spacer />
                                                    </HStack>
                                                </View>
                                                <Text type={"body"} style={{ fontSize: Spacing[12] }}>{data.text}</Text>
                                                {/* <Spacer /> */}
                                            </HStack>
                                        </TouchableOpacity>
                                    )
                                }

                            })}
                        </VStack>
                        <Spacer />
                        <VStack horizontal={Spacing[12]} vertical={Spacing[12]}>
                            {QUESTIONNAIRE_OPTION.map((data, index) => {
                                if (index >= 3) {
                                    return (
                                        <TouchableOpacity disabled={true}>
                                            <HStack bottom={Spacing[6]}>
                                                {/* <Spacer /> */}
                                                <View style={{
                                                    height: Spacing[18] + Spacing[3],
                                                    width: Spacing[18] + Spacing[3],
                                                    right: Spacing[6],
                                                    backgroundColor: listQuestionnaire[0].point === index + 1 ? Colors[data.color] : Colors.GRAY74,
                                                    borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                    borderColor: listQuestionnaire[0].point === index + 1 ? Colors[data.color] : Colors.GRAY74,
                                                    alignContent: 'center',
                                                    justifyContent: 'center'
                                                }} >
                                                    <HStack>
                                                        <Spacer /><Text type="body" text={(index + 1).toString()} style={{ fontSize: Spacing[12], color: Colors[data.fontColor] }} /><Spacer />
                                                    </HStack>
                                                </View>
                                                <Text type={"body"} style={{ fontSize: Spacing[12] }}>{data.text}</Text>
                                                <Spacer />
                                            </HStack>
                                        </TouchableOpacity>
                                    )
                                }

                            })}
                            <Spacer />
                        </VStack>
                        <Spacer />
                    </HStack>
                </>
            )
        }

        const renderHeader = () => {
            return (
                <>
                    <HStack>
                        <Text type={"left-header"} text={`Penilaian Budaya Juara`} style={{ fontSize: Spacing[16], textAlign: 'left' }} />
                        <Spacer />
                        <Button type={"dark-yellow"} text="Simpan Data" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[12] }} />
                        <Spacer />
                        <Button type={"warning"} text="Cancel" style={{ paddingHorizontal: Spacing[12], borderRadius: Spacing[12] }} onPress={() => goBack()} />
                    </HStack>
                    <Spacer height={Spacing[24]} />
                    <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[12] }}>
                        {listDescription.length > 0 ? listDescription[0] : ''}
                    </Text>
                </>
            )
        }

        return (
            <VStack
                testID="cultureMeasurementRating"
                style={styles.bg}
            >
                <SafeAreaView style={Layout.flex}>
                    <ScrollView
                    // refreshControl={
                    // <RefreshControl
                    // refreshing={}
                    // onRefresh={onRefresh}
                    //     tintColor={Colors.MAIN_RED}
                    // />
                    // }
                    >
                        <VStack style={{ backgroundColor: Colors.WHITE }}>
                            {/* <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} /> */}
                            <VStack top={Spacing[12]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                                { renderHeader() }
                                {/* <Spacer height={Spacing[6]} /> */}
                                <HStack horizontal={Spacing[2]}>
                                    <Spacer />
                                    <VStack horizontal={Spacing[24]} vertical={Spacing[12]} style={{ backgroundColor: Colors.ABM_BG_BLUE, width: Spacing[144], borderRadius: Spacing[20] }}>
                                        {QUESTIONNAIRE_OPTION.map((data, index) => {
                                            return (
                                                <HStack bottom={Spacing[6]}>
                                                    <Spacer />
                                                    <View style={{
                                                        height: Spacing[18],
                                                        width: Spacing[18],
                                                        right: Spacing[6],
                                                        backgroundColor: Colors[data.color],
                                                        borderRadius: Spacing[128], borderWidth: Spacing[2],
                                                        borderColor: Colors[data.color],
                                                        alignContent: 'center',
                                                        justifyContent: 'center'
                                                    }} >
                                                        <HStack>
                                                            <Spacer /><Text type="body" text={(index + 1).toString()} style={{ fontSize: Spacing[10], color: Colors[data.fontColor] }} /><Spacer />
                                                        </HStack>
                                                    </View>
                                                    <Text type={"body"} style={{ fontSize: Spacing[12] }}>{data.text}</Text>
                                                    <Spacer />
                                                </HStack>
                                            )
                                        })}
                                    </VStack>
                                    <Spacer />
                                </HStack>
                                <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[12] }}>
                                    {listDescription.length > 1 ? listDescription[1] : ''}
                                </Text>
                                <Spacer height={Spacing[12]} />


                                {/* start example questionaire */}
                                <Text type="body-bold" style={{ fontSize: Spacing[16] }}>Contoh:</Text>
                                {renderQuestionExample()}
                                {/* <Spacer height={Spacing[8]} /> */}
                                <Text type="body" style={{ fontSize: Spacing[12] }} >Jawaban tersebut berarti perilaku “Melaksanakan tugas dengan semangat untuk menunjukan hasil terbaik” yang dijalankan oleh pemimpin Juara yang Anda nilai dinilai masih di bawah standar yang diharapkan.</Text>
                                <Spacer height={Spacing[24]} />
                                <HStack>
                                    <Button type={"primary-dark"} text="Sebelumnya" style={{ paddingHorizontal: Spacing[14], borderRadius: Spacing[12] }} onPress={() => goBack()} />
                                    <Spacer />
                                    <Button type={"primary"} text="Selanjutnya" style={{ paddingHorizontal: Spacing[14], borderRadius: Spacing[12] }} onPress={() => { }} />
                                </HStack>

                                <Spacer height={Spacing[24]} />
                                {/* <Spacer height={Spacing[2]} /> */}
                                <ProgressBar
                                    progress={1 / 6}
                                    color={Colors.ABM_YELLOW}
                                    style={{ height: Spacing[8], backgroundColor: Colors.GRAY74 }}
                                // displayName={`1/3`}
                                />
                                <HStack>
                                    <Spacer />
                                    <Text>1/6</Text>
                                    <Spacer />
                                </HStack>
                                <Spacer height={Spacing[6]} />
                            </VStack>

                        </VStack>
                    </ScrollView >
                </SafeAreaView >
            </VStack >
        )
    })

export default CultureMeasurementRating

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.WHITE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});