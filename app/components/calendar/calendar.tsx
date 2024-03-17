import React from 'react';
import Spacer from "@components/spacer"
import { HStack, VStack } from "@components/view-stack"
import { dimensions } from "@config/platform.config"
import { Colors, Layout, Spacing } from "@styles"
import { View } from "react-native"
import Modal from "react-native-modalbox"
import CalendarPicker from "react-native-calendar-picker"
import { typography } from "@theme/typography"
import { Text, Button, TextField, DropDownPicker, DropDownItem } from "@components"

export interface CalendarProps {
    isVisible: boolean
    onChange(v: any): any
    onClose(): void
  }
  
  export function Calendar(props: CalendarProps) {
    return (
    <Modal
        isOpen={props.isVisible}
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
                  props.onChange(value)
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
                <Button type={"light-bg"} text={"Cancel"} onPress={props.onClose} />
                <Spacer width={Spacing[4]} />
                <Button
                  type={"primary-form"}
                  text={"Pilih"}
                  onPress={props.onClose}
                  style={{ minWidth: Spacing[72] }}
                />
              </HStack>
            </VStack>
          </VStack>
        </View>
      </Modal>
    )
  }
  