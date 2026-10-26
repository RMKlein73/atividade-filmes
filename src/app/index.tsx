import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function Inicio() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 30, gap: 15 }}>
      <Text style={{ fontSize: 26, textAlign: "center" }}>
        Catálogo de Filmes
      </Text>

      <Button title="Consultar filmes" onPress={() => router.push("/consulta")} />
      <Button title="Cadastrar filme" onPress={() => router.push("/cadastro")} />
      <Button title="Excluir filmes" onPress={() => router.push("/exclusao")} />
    </View>
  );
}