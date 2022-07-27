import React, { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Modal,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

//import components
import SafeScreen from "../SafeScreen";
import PickerItem from "../PickerItem";

//import styles and asses
import styled from "styled-components";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { P } from "../../config/Typography";
import Colors from "../config/colors";
import color from "../../config/color";

const AppPicker = ({
  icon,
  placeholder,
  items,
  onSelectItem,
  selectedItem,
}) => {
  const [openOptions, setOpenoptions] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setOpenoptions(true)}>
        <Container>
          <Text style={{color: "black"}}>
            {selectedItem ? (
              selectedItem.label
            ) : (
              <P colors={Colors.gray}>{placeholder}</P>
            )}
          </Text>
          <EvilIcons color={color.black}  name={icon} size={20} />
        </Container>
      </TouchableWithoutFeedback>
      <Modal visible={openOptions} animationType="slide">
        <SafeScreen>
          <ModalContainer>
            <CloseBtn>
              <TouchableOpacity onPress={() => setOpenoptions(false)}>
                <EvilIcons color={color.black}  name="close" size={30} />
              </TouchableOpacity>
            </CloseBtn>
            {/* <Button title="close" onPress={() => setOpenoptions(false)} /> */}
            <OptionsWrapper>
              <FlatList
                contentContainerStyle={{ flexGrow: 1 }}
                data={items}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <PickerItem
                    label={item.label}
                    icon={item.icon}
                    onPress={() => {
                      setOpenoptions(false);
                      onSelectItem(item);
                    }}
                  />
                )}
              />
            </OptionsWrapper>
          </ModalContainer>
        </SafeScreen>
      </Modal>
    </>
  );
};

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border: 1px solid ${Colors.lightgray};
  border-radius: 8px;
  padding: 15px;
`;

const ModalContainer = styled.View``;

const CloseBtn = styled.View`
  position: absolute;
  margin-top: ${Platform.OS === "ios" ? "40px" : "40px"};
  margin-left: 20px;
  border-radius: 6px;
  padding: 4px;
`;

const OptionsWrapper = styled.View`
  height: 100%;
  padding-top: 100px;
`;

export default AppPicker;
