
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [idadeIndicativa, setIdadeIndicativa] = useState("");
  const [genero, setGenero] = useState("");
  const [diretor, setDiretor] = useState("");

  async function cadastrar() {
    if (!nome || !ano || !idadeIndicativa || !genero || !diretor) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      await addDoc(collection(db, "filmes"), {
        nome,
        ano,
        idadeIndicativa,
        genero,
        diretor,
      });

      Alert.alert("Sucesso", "Filme cadastrado!");
      setNome("");
      setAno("");
      setIdadeIndicativa("");
      setGenero("");
      setDiretor("");
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar o filme.");
    }
  }

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>
        Cadastrar filme
      </Text>

      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={estilo} />
      <TextInput placeholder="Ano" value={ano} onChangeText={setAno} keyboardType="numeric" style={estilo} />
      <TextInput placeholder="Classificação indicativa" value={idadeIndicativa} onChangeText={setIdadeIndicativa} style={estilo} />
      <TextInput placeholder="Gênero" value={genero} onChangeText={setGenero} style={estilo} />
      <TextInput placeholder="Diretor" value={diretor} onChangeText={setDiretor} style={estilo} />

      <Button title="Cadastrar" onPress={cadastrar} />
    </View>
  );
}

const estilo = {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 10,
  borderRadius: 5,
};
