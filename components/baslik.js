import React , { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Baslik(){
    return(
        <View style={styles.baslik}>
            <Text style={styles.title}>
                Hatırla!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    baslik: {
        height: 70,
        paddingTop: 35,
        backgroundColor: 'coral'
    },
    title: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    }
  });