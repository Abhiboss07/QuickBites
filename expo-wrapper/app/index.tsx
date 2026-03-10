import { WebView } from 'react-native-webview';
import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';

export default function App() {
    // Use http://10.0.2.2:5173 for Android Emulator, or your computer's local deep IP for physical devices.
    // We'll use a placeholder for the Expo tester which can be updated.
    const VITE_SERVER_URL = 'http://192.168.1.117:5173';

    return (
        <SafeAreaView style={styles.container}>
            <WebView
                source={{ uri: VITE_SERVER_URL }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                bounces={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    webview: {
        flex: 1,
    },
});
