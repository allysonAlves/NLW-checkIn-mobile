import { View, Image, StatusBar, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Redirect } from "expo-router";

import { Input } from "@/components/input";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { useState } from "react";

import axios from "axios";
import { api } from "@/server/api";

import { useBadgeStore } from "@/store/badge-store";

export default function Home() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const badgeStore = useBadgeStore();  
 
  async function handleAccessCredential() {
    setIsLoading(true);
    try {

      const { data } = await api.get(`attendees/${code}/badge`);           
      badgeStore.save(data.badge)

    } catch(error) {
      console.log(error)
      setIsLoading(false);

      if(axios.isAxiosError(error)){
        if(String(error.response?.data.message).includes('já está cadastrado')){
          return Alert.alert("Inscrição", "Este e-mail já está cadastrado");
        }
      }

      Alert.alert("Inscrição", "Não foi possível fazer a inscrição");
    }
  }

  if(badgeStore.data?.checkInURL){
    return <Redirect href='/ticket' />
  }

  return (
    <View className="flex-1 p-8 bg-green-500 items-center justify-center text-white">
      <StatusBar barStyle="light-content" />

      <Image
        source={require("@/assets/logo.png")}
        className="h-16"
        resizeMode="contain"
      />
      <View className="w-full mt-12 gap-3">
        <Input>
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field onChangeText={(value) => {setCode(value)}} placeholder="Código do ingresso" />
        </Input>

        <Button
          isLoading={isLoading}
          title="acessar credencial"
          onPress={handleAccessCredential}
        />

        <Link
          href="/register"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Ainda não possui ingresso
        </Link>
      </View>
    </View>
  );
}
