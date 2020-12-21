import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import AltKisim from './components/altkisim'
import Baslik from './components/baslik';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("db.db");

function Yapilacak({ done: bittiBaslik, onPressYapilacak }) {
  const [yapilacak, setYapilacak] = React.useState(null);

  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from yapilacak where done = ?;`,
        [bittiBaslik ? 1 : 0],
        (_, { rows: { _array } }) => setYapilacak(_array)
      );
    });
  }, []);

  const heading = bittiBaslik ? "Tamamlandı" : "Yapılacak";

  if (yapilacak === null || yapilacak.length === 0) {
    return null;
  }

  return (
    <View style={styles.container2}>
      <Text style={styles.altBaslik}>{heading}</Text>
      {yapilacak.map(({ id, done, value }) => (
        <TouchableOpacity
          key={id}
          onPress={() => onPressYapilacak && onPressYapilacak(id)}
          style={{
            backgroundColor: done ? "coral" : "#fff",
            borderColor: "#000",
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 1,
            padding: 10
          }}
        >
          <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function App() {
  const [icerik, setText] = React.useState(null)
  const [hizliGuncelle, hizliGuncelleId] = hizliGuncelleFunc()

  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists yapilacak (id integer primary key not null, done int, value text);"
      );
    });
  }, []);

  const add = (icerik) => {
    if (icerik === null || icerik === "") {
      return false;
    }
    db.transaction(
      tx => {
        tx.executeSql("insert into yapilacak (done, value) values (0, ?)", [icerik]);
        tx.executeSql("select * from yapilacak", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      hizliGuncelle
    );
  }

  return (
    <View style={styles.container}>
      <Baslik />
      <View style={styles.listeSira}>
        <TextInput
          onChangeText={icerik => setText(icerik)}
          onSubmitEditing={() => {
            add(icerik);
            setText(null);
          }}
          placeholder="Neler yapacaksınız?"
          style={styles.giris}
          value={icerik}
        />
      </View>
      <ScrollView style={styles.liste}>
        <Yapilacak
          key={`hizliGuncelle-todo-${hizliGuncelleId}`}
          done={false}
          onPressYapilacak={id =>
            db.transaction(
              tx => {
                tx.executeSql(`update yapilacak set done = 1 where id = ?;`, [
                  id
                ]);
              },
              null,
              hizliGuncelle
            )
          }
        />
        <Yapilacak
          done
          key={`hizliGuncelle-done-${hizliGuncelleId}`}
          onPressYapilacak={id =>
            db.transaction(
              tx => {
                tx.executeSql(`delete from yapilacak where id = ?;`, [id]);
              },
              null,
              hizliGuncelle
            )
          }
        />
      </ScrollView>
      <AltKisim />
    </View>
  );

}

function hizliGuncelleFunc() {
  const [deger, setDeger] = useState(0);
  return [() => setDeger(deger + 1), deger];
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  listeSira: {
    flexDirection: "row"
  },
  giris: {
    borderColor: "coral",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8
  },
  liste: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    paddingTop: 16
  },
  container2: {
    marginBottom: 16,
    marginHorizontal: 16
  },
  altBaslik: {
    fontSize: 18,
    marginBottom: 8
  }
});