import React, { } from "react";
import { VStack } from "@components/view-stack";
import { Spacing } from "@styles"
import { Button, Text } from "@components";
import Spacer from "@components/spacer";


import { TouchableOpacity } from "react-native";


type ProfileProps = {
  goToCultureMeasurement(): void
}

export const CultureMeasurementComponent = ({ goToCultureMeasurement = () => null }: ProfileProps) => {

  return (
    <>
      {/* <TouchableOpacity onPress={goToCultureMeasurement}> */}
      <VStack horizontal={Spacing[2]}>
        <Text type={'left-header'} style={{ maxWidth: Spacing[256] }} underlineWidth={Spacing[160] + Spacing[16]} text={'Kuesioner Budaya Juara.'} />
        <Spacer height={Spacing[12]} />
        <Button type={"primary"} text={"Isi Kuesioner Budaya Juara"} onPress={() => goToCultureMeasurement()} />

        <Spacer />
      </VStack>
      {/* </TouchableOpacity> */}
    </>
  )

}
