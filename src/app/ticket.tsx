import {
  View,
  Text,
  Modal,
  Alert,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Share,
} from "react-native";
import React, { useState } from "react";
import Header from "@/components/header";
import Credential from "@/components/credential";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import * as ImagePicker from "expo-image-picker";
import QRCode from "@/components/qrcode";
import { useBadgeStore } from "@/store/badge-store";
import { Redirect } from "expo-router";

import { MotiView } from "moti";

export default function Ticket() { 
  const [expandQRCode, setExpandQRCode] = useState(false);

  const badgeStore = useBadgeStore();

  async function handleShare(){
    try{
      if(badgeStore.data?.checkInURL){
        await Share.share({
          message: badgeStore.data.checkInURL
        })
      }
    }catch (error) {
      console.log(error);
      Alert.alert("Compartilhar", "não foi possível compartilhar");
    }
  }

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
      });
      if (result.assets) {
        badgeStore.updateAvatar(result.assets[0].uri);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Foto", "não foi possível selecionar a imagem");
    }
  }

  if(!badgeStore.data?.checkInURL){
    return <Redirect href="/"/>
  }

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Header title="Minha credencial" />

      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential
          data={badgeStore.data}
          onChangeAvatar={handleSelectImage}
          onExpandeQRCode={() => setExpandQRCode(true)}          
        />
        <MotiView
          from={{
            translateY: 0
          }}
          animate={{
            translateY: 10
          }}
          transition={{
            loop: true,
            type:'timing',
            duration: 700
          }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-6"
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4">
          Compartilhar credential
        </Text>

        <Text className="text-white font-regular text-base mt-1 mb-6">
          Mostre ao mundo que você vai participar do event {badgeStore.data.eventTitle}!
        </Text>

        <Button onPress={handleShare} title="Compartilhar" />

        <TouchableOpacity
          onPress={() => badgeStore.remove()}
          activeOpacity={0.7}
          className="mt-10"
        >
          <Text className="text-base text-white font-bold text-center">
            Remover Ingresso
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={expandQRCode} statusBarTranslucent>
        <View className="flex-1 bg-green-500 items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setExpandQRCode(false)}
          >
            <QRCode value="teste" size={300} />
            <Text className="font-bold text-orange-500 text-center text-sm mt-10">
              Fechar QRCode
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
