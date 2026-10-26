
import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function Consulta() {
  const [filmes, setFilmes] = useState<any[]>([]);

  useEffect(() => {
    const cancelar = onSnapshot(
      collection(db, "filmes"),
      (snapshot) => {
        setFilmes(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );

    return cancelar;
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Filmes cadastrados
      </Text>

      <FlatList
        data={filmes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Nenhum filme cadastrado.</Text>}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1 }}>
            <Text>Nome: {item.nome}</Text>
            <Text>Ano: {item.ano}</Text>
            <Text>Classificação: {item.idadeIndicativa}</Text>
            <Text>Gênero: {item.genero}</Text>
            <Text>Diretor: {item.diretor}</Text>
          </View>
        )}
      />
    </View>
  );
}
