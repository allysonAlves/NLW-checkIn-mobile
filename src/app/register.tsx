import { View, Image, StatusBar, Alert } from "react-native";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

import { Input } from "@/components/input";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { useReducer } from "react";
import { api } from "@/server/api";
import axios from "axios";
import { useBadgeStore } from "@/store/badge-store";

type formProps = {
  name?: string;
  email?: string;
  isLoading?: boolean;
};

const EVENT_ID = "4e198939-c40a-4b84-a02a-8f2ee8b75b66";

export default function Register() {
  const [form, dispatch] = useReducer(
    (val: formProps, state: formProps) => ({ ...val, ...state }),
    {} as formProps
  );

  const badgeStore = useBadgeStore();

  const handleRegister = async () => {
    dispatch({ isLoading: true });

    try {
      const { name, email } = form;

      if (!name?.trim() || !email?.trim())
        return Alert.alert("Inscrição", "Preencha todos os campos");

      const {
        data: { code },
      } = await api.post(`events/${EVENT_ID}/attendees`, {
        name,
        email,
      });

      if (code) {
        const { data } = await api.get(`attendees/${code}/badge`);

        badgeStore.save(data.badge)
        
        Alert.alert("Inscrição", "Inscrição realizada com sucesso!", [
          { text: "OK", onPress: () => router.push("/ticket") },
        ]);
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        if (
          String(error.response?.data.message).includes("já está cadastrado")
        ) {
          return Alert.alert("Inscrição", "Este e-mail já está cadastrado");
        }
      }

      Alert.alert("Inscrição", "Não foi possível fazer a inscrição");
    } finally {
      dispatch({ isLoading: false });
    }
  };

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
          <FontAwesome6
            name="user-circle"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            onChangeText={(value) => dispatch({ name: value })}
            placeholder="Nome completo"
          />
        </Input>

        <Input>
          <MaterialIcons
            name="alternate-email"
            color={colors.green[200]}
            size={20}
          />
          <Input.Field
            onChangeText={(value) => dispatch({ email: value })}
            placeholder="E-mail"
            keyboardType="email-address"
          />
        </Input>

        <Button
          isLoading={form.isLoading}
          title="Realizar inscrição"
          onPress={handleRegister}
        />

        <Link
          href="/"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Já possui ingresso
        </Link>
      </View>
    </View>
  );
}
