
import { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function Exclusao() {
  const [filmes, setFilmes] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, "filmes"), (snapshot) => {
      setFilmes(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    });
  }, []);

  function excluir(id: string) {
    Alert.alert("Excluir filme", "Deseja excluir este filme?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "filmes", id));
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o filme.");
          }
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Excluir filmes
      </Text>

      <FlatList
        data={filmes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Nenhum filme cadastrado.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              gap: 8,
            }}
          >
            <Text>Nome: {item.nome}</Text>
            <Text>Ano: {item.ano}</Text>
            <Button
              title="Excluir"
              color="red"
              onPress={() => excluir(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}
