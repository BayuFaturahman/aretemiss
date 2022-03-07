import React, { useEffect, useReducer, useState } from "react"
import { Colors, Spacing } from "@styles"

import { Text } from "@components/text/text"
import { HStack, VStack } from "@components/view-stack"
import Spacer from "@components/spacer"
import { Platform, StyleProp, TextStyle } from "react-native"
import { color, typography } from "@theme"

import { Button } from "@components/button/button"

import SelectBox from "react-native-multi-selectbox"

import { xorBy } from "lodash"

export type DropDownItem = {
  item: string
  key?: string
  id: string
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface DropDownProps {
  onValueChange(items): void
  items?: DropDownItem[]
  label?: string
  isRequired: boolean
  isError?: boolean
  placeholder: string
  hideInputFilter: boolean
  containerStyle?: StyleProp<StyleProp<any>>
  open?
  initialValue?
  setOpen?
  setValue?
  setItems?
  isRemovable: boolean
  multiple?: boolean
  maxSelected?: number
}

/**
 * A component which has a label and an input together.
 */
export function DropDownPicker(props: DropDownProps) {
  const {
    onValueChange,
    hideInputFilter,
    items,
    label,
    isRequired,
    isError,
    placeholder,
    containerStyle,
    isRemovable,
    multiple = false,
    initialValue = {},
    maxSelected,
    ...rest
  } = props

  const [open, setOpen] = useState(false)
  const [items_, setItems] = useState(items)

  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  const [value, setValue] = useState({})
  const [values, setValues] = useState([])

  useEffect(() => {
    onValueChange(value)
  }, [value])

  useEffect(() => {
    onValueChange(values)
    console.log(values)
  }, [values])

  useEffect(() => {
    setItems(items)
    forceUpdate()
  }, [items])

  useEffect(() => {
    setValue(initialValue)
  }, [])

  const renderRequired = () => {
    return isRequired === true ? (
      <Text type={"label"} style={[{ fontSize: Spacing[14] }, LABEL_STYLE]} text={`*`} />
    ) : null
  }

  const clearSelection = () => {
    setValue({})
    forceUpdate()
  }

  const LABEL_STYLE = {
    color: isError ? Colors.MAIN_RED : Colors.UNDERTONE_BLUE,
  }

  const TEXT_STYLE: TextStyle = {
    fontFamily: typography.primary,
    color: Colors.UNDERTONE_BLUE,
    fontSize: Spacing[16],
    backgroundColor: color.palette.white,
    textAlign: "center",
  }

  const TEXT_STYLE_SELECTED: TextStyle = {
    fontFamily: typography.primary,
    color: Colors.UNDERTONE_BLUE,
    fontSize: Spacing[16],
    backgroundColor: color.palette.white,
  }

  const STYLES_CONTAINER = {
    minHeight: Spacing[256],
    // marginBottom: -300,
  }

  return (
    <VStack
      top={Spacing[8]}
      style={[
        containerStyle,
        { zIndex: rest.zIndex },
        Platform.OS === "android" && open && STYLES_CONTAINER,
      ]}
    >
      <HStack>
        {renderRequired()}
        <Text type={"label"} style={[{ fontSize: Spacing[14] }, LABEL_STYLE]} text={label} />
      </HStack>
      <Spacer height={Spacing[4]} />
      {isRemovable ? (
        <Button
          type={"primary"}
          text={"X"}
          style={{
            height: Spacing[28],
            width: Spacing[28],
            paddingHorizontal: Spacing[8],
            position: "absolute",
            right: 0,
            top: Spacing[12],
            zIndex: 10,
          }}
          textStyle={{ fontSize: Spacing[14], lineHeight: Spacing[18] }}
          onPress={clearSelection}
        />
      ) : (
        <></>
      )}

      <VStack
        style={{
          flex: 1,
          borderColor: isError ? Colors.MAIN_RED : Colors.MAIN_BLUE,
          borderWidth: Spacing[2],
          borderRadius: Spacing[20],
        }}
      >
        <SelectBox
          label=""
          options={items}
          value={value}
          onChange={multiple === false ? onChange() : null}
          onMultiSelect={multiple === true ? onMultiChange() : null}
          hideInputFilter={hideInputFilter}
          containerStyle={{
            top: -Spacing[8],
            paddingHorizontal: Spacing[12],
            borderBottomWidth: 0,
          }}
          optionContainerStyle={{
            paddingHorizontal: Spacing[12],
            borderBottomWidth: 0,
          }}
          inputFilterStyle={{
            paddingHorizontal: Spacing[12],
          }}
          inputPlaceholder={placeholder}
          optionsLabelStyle={TEXT_STYLE}
          selectedItemStyle={TEXT_STYLE_SELECTED}
          listOptionProps={{ nestedScrollEnabled: true }}
          isMulti={multiple}
          selectedValues={values}
          onTapClose={onMultiChange()}
          arrowIconColor={Colors.MAIN_BLUE}
          searchIconColor={Colors.MAIN_BLUE}
          toggleIconColor={Colors.MAIN_BLUE}
          multiOptionContainerStyle={{
            backgroundColor: Colors.MAIN_BLUE,
          }}
        />
      </VStack>
    </VStack>
  )

  function onChange() {
    return (val) => setValue(val)
  }

  function onMultiChange() {
    if (maxSelected) {
      if (values.length < maxSelected) {
        return (item) => setValues(xorBy(values, [item], "id"))  
      }
    } else {
      return (item) => setValues(xorBy(values, [item], "id"))
    }
    
  }
}

export const K_OPTIONS = [
  {
    item: "Juventus",
    id: "JUVE",
  },
  {
    item: "Real Madrid",
    id: "RM",
  },
  {
    item: "Barcelona",
    id: "BR",
  },
  {
    item: "PSG",
    id: "PSG",
  },
  {
    item: "FC Bayern Munich",
    id: "FBM",
  },
  {
    item: "Manchester United FC",
    id: "MUN",
  },
  {
    item: "Manchester City FC",
    id: "MCI",
  },
  {
    item: "Everton FC",
    id: "EVE",
  },
  {
    item: "Tottenham Hotspur FC",
    id: "TOT",
  },
  {
    item: "Chelsea FC",
    id: "CHE",
  },
  {
    item: "Liverpool FC",
    id: "LIV",
  },
  {
    item: "Arsenal FC",
    id: "ARS",
  },

  {
    item: "Leicester City FC",
    id: "LEI",
  },
]
