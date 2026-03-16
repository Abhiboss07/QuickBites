import { WebView } from 'react-native-webview';
import { StyleSheet, SafeAreaView, StatusBar, Platform, View, Text, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';

export default function App() {
  // Use network IP for better connectivity from mobile devices
  const WEB_URL = 'http://192.168.0.169:5173';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: WEB_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
        bounces={false}
        onError={(syntheticEvent) => {
          setError(syntheticEvent.nativeEvent?.description || 'Unknown error');
          setLoading(false);
        }}
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#F47B25" />
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={{ color: 'red', textAlign: 'center', margin: 10 }}>
            Unable to connect to {WEB_URL}{'\n'}Make sure the frontend is running.{'\n\n'}Error: {error}
          </Text>
        </View>
      )}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FEFAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
