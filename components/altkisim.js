import React , { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function AltKisim() {
    const [soz, setSoz] = useState([])
    useEffect(() => {
        fetch('https://api.quotable.io/random')
            .then(response => response.json() )
            .then(data => setSoz(data))
            .catch(error => setSoz({
                author: "Bir hata oluştu.",
                content: ""
            }));
    },[]);
    console.log(soz);
    return(<View style={styles.pencere} >
        <Text style={styles.icerik}>{soz.content}</Text>
        <Text style={styles.icerik}>{soz.author}</Text>
    </View>)
}

const styles = StyleSheet.create({
    pencere: {
        height: 55,
        justifyContent: 'center',
        alignContent: 'center',
        borderColor: 'coral',
        borderWidth: 1
    },
    icerik: {
        alignContent: 'center',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold'
    }
});