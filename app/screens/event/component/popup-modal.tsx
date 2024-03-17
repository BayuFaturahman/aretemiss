import Spacer from "@components/spacer"
import { HStack, VStack } from "@components/view-stack"
import { rHeight, rWidth } from "@styles/Spacing"
import { Colors, Spacing } from "@styles/index"
import React, { memo } from "react"
import { TouchableOpacity, View } from "react-native"
import Modal from "react-native-modalbox"
import { Text, Icon, Button } from "@components"
import { Man1, Checklist } from "@assets/svgs"

interface ModalViewProps {
    isVisible: boolean
    type: string
    onConfirm(): void
    onClose(): void
  }

const PopUpModal: React.FC<ModalViewProps> = (props) => {
    return <Modal
    isOpen={props.isVisible}
    style={{
        position: "absolute",
        width: rWidth(80),
        backgroundColor: "rgba(52, 52, 52, 0)",
    }}
>
    <View style={{ flex: 1, justifyContent: "center"}}>

        <View
            style={{
                backgroundColor: Colors.WHITE,
                borderRadius: Spacing[48],
                // minHeight: rHeight(40),
                alignItems: "center",
                // flex:1
            }}
        // horizontal={Spacing[24]}
        // vertical={Spacing[24]}
        >
            {props.type != 'close' && <TouchableOpacity
                style={{ position: 'absolute', top: rHeight(3), right: rHeight(3) }}
                onPress={()=>props.onClose()}
            >
                <Icon icon="cross" style={{ width: rHeight(5), height: rHeight(5) }} />
            </TouchableOpacity>}

            <VStack style={{alignItems:'center', justifyContent:'center', paddingVertical: rHeight(4)}}>
                
                
                {props.type == 'close' ? <Checklist height={rHeight(15)} width={rWidth(20)}/>
                :<Man1 height={rHeight(20)} width={rWidth(50)}/>}
                
                {props.type != 'close' && <Text type="body-bold" style={{color: Colors.ABM_GREEN,fontSize: 16,textAlign:'center',paddingHorizontal:rWidth(2)}}>
                    {props.type == 'confirm' ? 'Kamu akan membuat Acara Ceria.' :'Kamu akan membatalkan pembuatan Acara.'}
                </Text>}

                <Text type="body" style={{fontSize: 14,textAlign:'center', paddingHorizontal:rWidth(4)}}>
                    {props.type == 'confirm' ? 'Acara Ceria kamu akan dibuat. Apakah kamu yakin ingin membuat Acara Ceria?'
                    : props.type == 'cancel' ? 'Acara Ceria kamu akan dihapus. Apakah kamu yakin ingin membatalkan pembuatan Acara?'
                    : 'Acara Ceria telah sukses dibatalkan!'
                    }
                </Text>

                <HStack top={rHeight(2)} style={{justifyContent: 'center'}}>
                    <Button type={"primary"} text={props.type == 'close' ? "Kembali ke Acara Ceria" : "Iya"} style={{paddingHorizontal: rWidth(5), marginHorizontal:rWidth(3) }}
                        onPress={() => props.onConfirm()}
                    />
                    {/* <Spacer /> */}

                    {props.type != 'close' && <Button type={"warning"} text={"Tidak"} style={{paddingHorizontal: rWidth(5), marginHorizontal:rWidth(3) }}
                        onPress={() => props.onClose()}
                    />}
                </HStack>
            </VStack>
        </View>
    </View>
</Modal>
}

export default memo(PopUpModal);
 