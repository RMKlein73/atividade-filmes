
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

type Filme = {
  id: string;
  nome: string;
  ano: number;
  idadeIndicativa: string;
  genero: string;
  diretor: string;
};

export default function Index() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [idade, setIdade] = useState("");
  const [genero, setGenero] = useState("");
  const [diretor, setDiretor] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "filmes"),
      (snapshot) => {
        const lista = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Filme[];

        setFilmes(lista);
      },
      (error) => {
        console.error("Erro ao consultar filmes:", error);
        Alert.alert(
          "Erro de conexão",
          "Não foi possível carregar os filmes. Verifique as regras do Firestore."
        );
      }
    );

    return unsubscribe;
  }, []);

  async function cadastrarFilme() {
    if (
      !nome.trim() ||
      !ano.trim() ||
      !idade.trim() ||
      !genero.trim() ||
      !diretor.trim()
    ) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    const anoNumero = Number(ano);

    if (
      !Number.isInteger(anoNumero) ||
      anoNumero < 1888 ||
      anoNumero > new Date().getFullYear()
    ) {
      Alert.alert("Ano inválido", "Informe um ano de lançamento válido.");
      return;
    }

    try {
      setSalvando(true);

      await addDoc(collection(db, "filmes"), {
        nome: nome.trim(),
        ano: anoNumero,
        idadeIndicativa: idade.trim(),
        genero: genero.trim(),
        diretor: diretor.trim(),
      });

      setNome("");
      setAno("");
      setIdade("");
      setGenero("");
      setDiretor("");

      Alert.alert("Sucesso", "Filme cadastrado no Firebase!");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      Alert.alert(
        "Erro",
        "Não foi possível cadastrar. Confira sua conexão e as regras do Firestore."
      );
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao(filme: Filme) {
    Alert.alert(
      "Excluir filme",
      `Deseja excluir "${filme.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "filmes", filme.id));
            } catch (error) {
              console.error("Erro ao excluir:", error);
              Alert.alert(
                "Erro",
                "Não foi possível excluir. Confira as regras do Firestore."
              );
            }
          },
        },
      ]
    );
  }

  function campo(
    label: string,
    valor: string,
    alterar: (texto: string) => void,
    placeholder: string,
    teclado: "default" | "numeric" = "default"
  ) {
    return (
      <View style={styles.campo} key={label}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={alterar}
          placeholder={placeholder}
          placeholderTextColor="#8b93a7"
          keyboardType={teclado}
          autoCapitalize="sentences"
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={filmes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <Text style={styles.marca}>CINEBASE</Text>
            <Text style={styles.titulo}>Catálogo de filmes</Text>
            <Text style={styles.subtitulo}>
              Organize seus filmes favoritos.
            </Text>

            <View style={styles.formulario}>
              <Text style={styles.tituloSecao}>Cadastrar filme</Text>

              {campo("Nome do filme", nome, setNome, "Ex.: Interestelar")}
              {campo("Ano de lançamento", ano, setAno, "Ex.: 2014", "numeric")}
              {campo(
                "Idade indicativa",
                idade,
                setIdade,
                "Ex.: 10 anos"
              )}
              {campo("Gênero", genero, setGenero, "Ex.: Ficção científica")}
              {campo("Diretor", diretor, setDiretor, "Nome do diretor")}

              <Pressable
                style={[
                  styles.botaoCadastrar,
                  salvando && styles.botaoDesabilitado,
                ]}
                onPress={cadastrarFilme}
                disabled={salvando}
              >
                <Text style={styles.textoBotao}>
                  {salvando ? "Salvando..." : "+ Cadastrar filme"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.cabecalhoLista}>
              <Text style={styles.tituloSecao}>Filmes cadastrados</Text>
              <Text style={styles.contador}>{filmes.length}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.iconeVazio}>🎬</Text>
            <Text style={styles.textoVazio}>Nenhum filme cadastrado.</Text>
            <Text style={styles.dicaVazio}>
              Use o formulário acima para adicionar o primeiro.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardFilme}>
            <View style={styles.linhaFilme}>
              <View style={styles.poster}>
                <Text style={styles.iconePoster}>🎞</Text>
              </View>

              <View style={styles.infoFilme}>
                <Text style={styles.nomeFilme}>{item.nome}</Text>
                <Text style={styles.detalhe}>
                  {item.ano} • {item.idadeIndicativa}
                </Text>
                <Text style={styles.detalhe}>Gênero: {item.genero}</Text>
                <Text style={styles.detalhe}>Diretor: {item.diretor}</Text>
              </View>
            </View>

            <Pressable
              style={styles.botaoExcluir}
              onPress={() => confirmarExclusao(item)}
            >
              <Text style={styles.textoExcluir}>Excluir filme</Text>
            </Pressable>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#0b1020",
  },
  conteudo: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },
  marca: {
    color: "#8b9cff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 4,
    marginBottom: 10,
  },
  titulo: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitulo: {
    color: "#a6aec3",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 24,
  },
  formulario: {
    backgroundColor: "#151c30",
    borderRadius: 18,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#29334d",
  },
  tituloSecao: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  campo: {
    marginBottom: 14,
  },
  label: {
    color: "#d7dced",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#0b1020",
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#35405b",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 15,
  },
  botaoCadastrar: {
    backgroundColor: "#6578ff",
    padding: 15,
    borderRadius: 11,
    alignItems: "center",
    marginTop: 6,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  cabecalhoLista: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  contador: {
    color: "#ffffff",
    backgroundColor: "#35405b",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    overflow: "hidden",
    fontWeight: "700",
  },
  vazio: {
    alignItems: "center",
    padding: 26,
    backgroundColor: "#151c30",
    borderRadius: 16,
  },
  iconeVazio: {
    fontSize: 34,
    marginBottom: 12,
  },
  textoVazio: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  dicaVazio: {
    color: "#a6aec3",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  cardFilme: {
    backgroundColor: "#151c30",
    borderRadius: 16,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#29334d",
  },
  linhaFilme: {
    flexDirection: "row",
    gap: 13,
  },
  poster: {
    width: 62,
    height: 82,
    borderRadius: 10,
    backgroundColor: "#29345a",
    alignItems: "center",
    justifyContent: "center",
  },
  iconePoster: {
    fontSize: 29,
  },
  infoFilme: {
    flex: 1,
    gap: 5,
  },
  nomeFilme: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 2,
  },
  detalhe: {
    color: "#b1bad0",
    fontSize: 12,
  },
  botaoExcluir: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#8b3547",
    padding: 10,
    borderRadius: 9,
    alignItems: "center",
  },
  textoExcluir: {
    color: "#ff8b9a",
    fontWeight: "700",
  },
});
