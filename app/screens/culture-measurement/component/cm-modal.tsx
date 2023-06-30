import React from "react";
import { Colors, Layout, Spacing } from "@styles"
import { dimensions } from "@config/platform.config"
import Modal from "react-native-modalbox"
import { Text, BackNavigation, Button, TextField } from "@components"
import { HStack, VStack } from "@components/view-stack";
import { StyleProp, TextStyle, TouchableOpacity, View } from "react-native";
import Spacer from "@components/spacer";
import { MoodComponent } from "@screens/homepage/components/mood-component";
import { IconClose, IconManConfuse, Man1 } from "@assets/svgs";

type ModalProps = {
    isModalVisible: boolean
    isIconFromMood: boolean
    modalTitle?: string
    modalIcon?: string
    modalDesc?: string
    modalBtnText?: string
    toggleModal(): void
    onClickModalBtn(): void
}

export const ModalComponent = ({ isModalVisible = true, isIconFromMood = true, modalTitle = '', modalIcon = '', modalDesc = '', modalBtnText = '', toggleModal = () => { }, onClickModalBtn = () => { } }: ModalProps) => {
    return (
        <Modal
            onClosed={() => toggleModal()}
            isOpen={isModalVisible}
            style={{
                height: "50%",
                width: dimensions.screenWidth - Spacing[48],
                backgroundColor: "rgba(52, 52, 52, 0)",
            }}

            onRequestClose={() => toggleModal}
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
                    <VStack horizontal={Spacing[6]} top={Spacing[0]} style={[Layout.widthFull]}>
                        <HStack bottom={Spacing[6]} left={Spacing[24]} style={{ justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => toggleModal()}>
                                <IconClose height={Spacing[32]} width={Spacing[32]} />
                            </TouchableOpacity>
                        </HStack>
                    </VStack>
                    <VStack horizontal={Spacing[12]} vertical={Spacing[6]} style={[Layout.widthFull, { justifyContent: "center" }]}>
                        <VStack>
                            <HStack bottom={Spacing[18]}>
                                <Spacer />
                                {isIconFromMood ?
                                    <MoodComponent data={modalIcon} width={Spacing[64]} height={Spacing[64]} />
                                    : <IconManConfuse width={Spacing[160] + Spacing[84]} />
                                }
                                <Spacer />
                            </HStack>
                            <Text
                                type={"body-bold"}
                                style={{ fontSize: isIconFromMood ? Spacing[24] : Spacing[16], textAlign: "center", color: Colors.ABM_GREEN }}
                                text={modalTitle}
                            />
                            {/* <Spacer height={Spacing[12]} /> */}
                            <Text type={"body"} style={{ textAlign: "center" }} text={modalDesc} />
                            <Spacer height={Spacing[16]} />
                            <HStack bottom={Spacing[12]}>
                                <Spacer />
                                {/* <VStack style={{ maxWidth: Spacing[256], minWidth: Spacing[128] }}> */}

                                {/* </VStack> */}

                                {isIconFromMood ?
                                    <Button
                                        type={"primary"}
                                        text={modalBtnText}
                                        style={{ height: Spacing[54], paddingHorizontal: Spacing[8], justifyContent: 'center', alignContent: 'center' }}
                                        textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                                        onPress={onClickModalBtn}
                                    />
                                    : <>
                                        <Button
                                            type={"primary-dark"}
                                            text={'Lanjutkan'}
                                            style={{ paddingVertical: Spacing[14], paddingHorizontal: Spacing[12], justifyContent: 'center', alignContent: 'center' }}
                                            textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                                            onPress={onClickModalBtn}
                                        />
                                        <Spacer />
                                        <Button
                                            type={"primary"}
                                            text={'Batalkan'}
                                            style={{ paddingVertical: Spacing[14], paddingHorizontal: Spacing[12], justifyContent: 'center', alignContent: 'center' }}
                                            textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
                                            onPress={onClickModalBtn}
                                        />
                                    </>
                                }
                                <Spacer />
                            </HStack>
                        </VStack>
                    </VStack>
                </VStack>
            </View>
        </Modal >
    )

}
