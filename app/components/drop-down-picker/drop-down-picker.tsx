import React, {useEffect, useState} from "react"
import {Colors, Spacing} from "@styles";

import DropDown, {DropDownPickerProps, ItemType} from 'react-native-dropdown-picker';
import {Text} from "@components/text/text";
import {HStack, VStack} from "@components/view-stack";
import Spacer from "@components/spacer";
import {StyleProp, TextStyle} from "react-native";
import {color, typography} from "@theme/";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface DropDownProps extends DropDownPickerProps {
  onValueChange(items): void
  items?: ItemType[]
  label: string
  isRequired: boolean
  isError?: boolean
  placeholder: string
  containerStyle: StyleProp<StyleProp<any>>
  open?
  value?
  setOpen?
  setValue?
  setItems?
}

/**
 * A component which has a label and an input together.
 */
export function DropDownPicker(props: DropDownProps) {
  const {
    onValueChange,
    items,
    label,
    isRequired,
    isError,
    placeholder,
    containerStyle,
    ...rest
  } = props

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items_, setItems] = useState(items ?? [
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'}
  ]);

  useEffect(()=>{
    onValueChange(value)
    console.log(value)
  },[value])

  const renderRequired = () => {
    return isRequired === true ? <Text type={'label'} style={[{fontSize: Spacing[14]}, LABEL_STYLE]} text={`*`} /> : null
  }

  const LABEL_STYLE = {
    color: isError ? Colors.MAIN_RED : Colors.UNDERTONE_BLUE,
  }

  const TEXT_STYLE: TextStyle = {
    fontFamily: typography.primary,
    color: Colors.UNDERTONE_BLUE,
    fontSize: Spacing[16],
    backgroundColor: color.palette.white,
    textAlign: 'center',
  }

  return (
    <VStack style={[containerStyle, {zIndex: rest.zIndex}]}>
      <HStack>
        {renderRequired()}
        <Text type={'label'} style={[{fontSize: Spacing[14]}, LABEL_STYLE]} text={label} />
      </HStack>
      <Spacer height={Spacing[4]} />
      <DropDown
        open={open}
        value={value}
        items={items_}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={{
          borderColor: isError ? Colors.MAIN_RED : Colors.MAIN_BLUE,
          borderWidth: Spacing[2],
          borderRadius: Spacing[20],
          maxHeight: 44,
        }}
        textStyle={TEXT_STYLE}
        dropDownContainerStyle={{
          borderRadius: Spacing[20],
          borderColor: isError ? Colors.MAIN_RED : Colors.MAIN_BLUE,
          borderWidth: Spacing[2],
        }}
        placeholder={placeholder}
        {...rest}
      />
    </VStack>
  )
}
