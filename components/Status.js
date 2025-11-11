// components/Status.js
import { Constants } from 'expo';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native'; 
import React from 'react';
import NetInfo from '@react-native-community/netinfo'; 

// statusHeight calculation
const statusHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : 0;

const styles = StyleSheet.create({
  // Base style status
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  // Styles for the message bubble
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 20, 
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
  },
});

export default class Status extends React.Component {
  state = {
    info: null, 
  };
  
  unsubscribe = null;

  handleConnectivityChange = (state) => {
    // Map modern state.type back to the 'info' structure used in the activity ('none' or a connection type)
    const info = state.type === 'none' ? 'none' : state.type; 
    this.setState({ info });
  };
  
  componentDidMount() {
    // 1. Get the initial network connectivity status using the modern NetInfo.fetch()
    NetInfo.fetch().then(this.handleConnectivityChange);
    
    // 2. Add an event listener to update state when the network status changes
    this.unsubscribe = NetInfo.addEventListener(this.handleConnectivityChange);
  }

  componentWillUnmount() {
    // Call the unsubscribe function returned by addEventListener
    if (this.unsubscribe) {
        this.unsubscribe();
    }
  }

  render() {
    const { info } = this.state;

    // Do not render anything until we have the initial info
    if (info === null) {
      return null;
    }

    // Determine connection status and background color
    const isConnected = info !== 'none';
    const backgroundColor = isConnected ? 'white' : 'red'; 

    const statusBar = (
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isConnected ? 'dark-content' : 'light-content'}
        animated={false}
      />
    );

    const messageContainer = (
      <View style={styles.messageContainer} pointerEvents={'none'}>
        {statusBar}
        {/* Only show the bubble if disconnected */}
        {!isConnected && (
          <View style={styles.bubble}>
            <Text style={styles.text}>No network connection</Text>
          </View>
        )}
      </View>
    );

    if (Platform.OS === 'ios') {
      return (
        <View style={[styles.status, { backgroundColor }]}>
          {messageContainer}
        </View>
      );
    }

    return messageContainer;
  }
}