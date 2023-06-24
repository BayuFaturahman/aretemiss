import React, { FC, useReducer } from "react"
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
// import { EmptyList } from "./components/empty-list"


const QUESTIONNAIRE_TYPE = [
    {
        text: 'Budaya Juara',
        color: 'ABM_LIGHT_BLUE'
    },
    {
        text: 'Infrastuktur Juara',
        color: 'ABM_YELLOW'
    },
    {
        text: 'Pelaksanaan Proyek Budaya',
        color: 'ABM_GREEN'
    }
]

const QUESTIONNAIRE_DATA = [
    {
        text: 'Penilaian Budaya Juara\n2/5 Orang',
        color: 'ABM_LIGHT_BLUE',
        lastModified: '2023-06-10T15:52:18.000Z',
        filled: 2,
        totalAll: 5
    },
    {
        text: 'Penilaian Infrastruktur\nBudaya Juara',
        color: 'ABM_YELLOW',
        lastModified: '2023-06-11T15:52:18.000Z',
        filled: 4,
        totalAll: 5
    },
    {
        text: 'Penilaian Pelaksanaan\nProyek Budaya',
        color: 'ABM_GREEN',
        lastModified: '2023-06-12T15:52:18.000Z',
        filled: 5,
        totalAll: 5
    }
]

const CultureMeasurementMain: FC<StackScreenProps<NavigatorParamList, "cultureMeasurementMain">> =
    observer(({ navigation }) => {

        const [, forceUpdate] = useReducer((x) => x + 1, 0)
        const { mainStore } = useStores()


        const goBack = () => {
            navigation.reset({
                routes: [{ name: "homepage" }],
            })
        }


        return (
            <VStack
                testID="feedback"
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
                        <VStack style={{ backgroundColor: Colors.ABM_BG_BLUE }}>
                            <ImageBackground source={images.feedbackBgPattern} style={{ height: '100%' }} resizeMode={"cover"}>
                                <BackNavigation color={Colors.UNDERTONE_BLUE} goBack={goBack} />
                                <VStack top={Spacing[0]} horizontal={Spacing[24]} bottom={Spacing[12]}>
                                    <Text type={"header"} text="Kuesioner Budaya Juara" underlineWidth={Spacing[160] + Spacing[84]} />
                                    <Spacer height={Spacing[24]} />
                                    <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[12] }}>
                                        Terima kasih atas kesediaan Anda untuk mengisi kuesioner Budaya Juara ini. Kuesioner ini dirancang untuk mengetahui sejauh mana peran para pemimpin dalam mengimplementasikan Budaya Juara. Kuesioner ini dibagi menjadi tiga bagian dimana Anda perlu mengisi ketiga rangkaian penilaian agar kami dapat memperoleh nilai indeks yang sah. Silakan isi kuesioner sesuai dengan urutan berikut:
                                    </Text>

                                    <Spacer height={Spacing[12]} />
                                    <HStack horizontal={Spacing[2]}>
                                        <Spacer />
                                        <VStack horizontal={Spacing[24]} vertical={Spacing[12]} style={{ backgroundColor: Colors.WHITE, width: Spacing[160] + Spacing[24], borderRadius: Spacing[20], borderWidth: Spacing[2], borderColor: Colors.ABM_DARK_BLUE }}>
                                            {QUESTIONNAIRE_TYPE.map((data, index) => {
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
                                                                <Spacer /><Text type="body" text={(index + 1).toString()} style={{ fontSize: Spacing[10] }} /><Spacer />
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
                                    <Spacer height={Spacing[12]} />
                                    <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[12] }}>
                                        Ketiga rangkaian kuesioner ini dapat disimpan di tengah-tengah pengisian, sehingga Anda dapat meninggalkan kuesioner apabila dibutuhkan dan kembali mengisi kuesioner di saat Anda memiliki kesempatan untuk mengisi kuesionernya kembali.
                                    </Text>
                                    <Spacer height={Spacing[12]} />
                                    <Text type={"body"} style={{ textAlign: "center", fontSize: Spacing[12] }}>
                                        Kami berharap penilaian ini dilakukan seobyektif mungkin sehingga rekomendasi pengembangan para pemimpin akan menjadi lebih akurat. Silakan mengisi kuesioner Budaya Juara ini satu kali per satu kuarter untuk menghasilkan hasil yang bermakna.
                                    </Text>

                                    {/* start periode pengisian segment */}
                                    <VStack top={Spacing[24]} horizontal={Spacing[12]} bottom={Spacing[12]}>
                                        <Text type="left-header" text="Periode Pengisian:" style={{ fontSize: Spacing[16] }} />
                                        <Spacer height={Spacing[12]} />
                                        <VStack horizontal={Spacing[8]} vertical={Spacing[8]}
                                            style={{ backgroundColor: Colors.WHITE, width: Spacing[160] + Spacing[84], borderRadius: Spacing[20], borderWidth: Spacing[2], borderColor: Colors.ABM_DARK_BLUE }}>
                                            <Text type="body" style={{ fontSize: Spacing[12] }}> Minggu, 11 Juni 2023 - Minggu, 25 Juni 2023</Text>
                                        </VStack>
                                        <Spacer height={Spacing[12]} />
                                        <VStack horizontal={Spacing[24]} top={Spacing[12]}
                                            style={[Layout.widthFull, { backgroundColor: Colors.WHITE, borderRadius: Spacing[20], borderWidth: Spacing[2], borderColor: Colors.ABM_DARK_BLUE }]}>
                                            {QUESTIONNAIRE_DATA.map((data, index) => {
                                                return (
                                                    <VStack style={{ borderBottomColor: Colors.ABM_DARK_BLUE, borderBottomWidth: index < 2 ? Spacing[1] : Spacing[0], paddingVertical: Spacing[12] }}>
                                                        <HStack style={{ bottom: Spacing[6] }}>
                                                            <View style={{
                                                                height: Spacing[18],
                                                                width: Spacing[18],
                                                                right: Spacing[12],
                                                                backgroundColor: data.filled < data.totalAll ? Colors.GRAY74 : Colors[data.color],
                                                                borderRadius: Spacing[128], borderWidth: Spacing[1],
                                                                borderColor: Colors.ABM_DARK_BLUE,
                                                                alignContent: 'center',
                                                                justifyContent: 'center'
                                                            }} />
                                                            <Text type="body" style={{ fontSize: Spacing[12] }} >{data.text}</Text>
                                                            <Spacer />
                                                            <Button type="primary" text="Isi Kuisioner" style={{ paddingHorizontal: Spacing[8] }} textStyle={{ fontSize: Spacing[12] }} />
                                                        </HStack>
                                                        <Text type="body" style={{ fontSize: Spacing[12], fontWeight: '100' }}>{`Terakhir diisi  pada tanggal ${moment(data.lastModified).format('DD MMM YYYY')}`}</Text>
                                                        <Spacer height={Spacing[2]} />
                                                        <ProgressBar
                                                            progress={data.filled / data.totalAll}
                                                            color={Colors.ABM_YELLOW}
                                                            style={{ height: Spacing[8], backgroundColor: Colors.GRAY74 }}
                                                        />
                                                        <Spacer height={Spacing[6]} />
                                                    </VStack>
                                                )
                                            })}
                                        </VStack>
                                    </VStack>
                                </VStack>
                            </ImageBackground>
                            <Spacer height={Spacing[12]} />
                        </VStack>
                    </ScrollView>
                </SafeAreaView>
            </VStack>
        )
    })

export default CultureMeasurementMain

const styles = StyleSheet.create({
    bg: {
        backgroundColor: Colors.ABM_BG_BLUE, flex: 1, justifyContent: "center"
    },
    bgBottom: { backgroundColor: Colors.WHITE, borderTopEndRadius: Spacing[0], borderTopStartRadius: Spacing[48], minHeight: dimensions.screenHeight * 1.5 }
});