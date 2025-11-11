// App.js
import React from 'react';
import {
  Alert,
  BackHandler,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import Status from './components/Status';
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';
import * as MessageUtils from './utils/MessageUtils';

export default class App extends React.Component {
  state = {
    messages: [
      MessageUtils.createImageMessage('https://unsplash.it/300/300'),
      MessageUtils.createTextMessage('World'),
      MessageUtils.createTextMessage('Hello'),
      MessageUtils.createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
    ],
    fullscreenImageId: null,
    isInputFocused: false,
  };

  componentDidMount() {
    this.subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    );
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.remove();
  }

  handleBackPress = () => {
    const { fullscreenImageId } = this.state;
    if (fullscreenImageId) {
      this.dismissFullscreenImage();
      return true;
    }
    return false;
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  deleteMessage = (id) => {
    this.setState((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    }));
  };

  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => this.deleteMessage(id),
            },
          ]
        );
        break;
      case 'image':
        // Supplementary activity: also dismiss keyboard when opening fullscreen
        this.setState({ fullscreenImageId: id, isInputFocused: false });
        break;
      default:
        break;
    }
  };

  // ==== Toolbar handlers ====
  handleChangeFocus = (isInputFocused) => {
    this.setState({ isInputFocused });
  };

  handleSubmit = (text) => {
    this.setState((state) => ({
      messages: [MessageUtils.createTextMessage(text), ...state.messages],
    }));
  };

  handlePressToolbarCamera = () => {
    // (Optional) add camera logic later
    this.setState({ isInputFocused: false });
  };

  handlePressToolbarLocation = () => {
    // (Optional) add geolocation logic later
    this.setState({ isInputFocused: false });
  };
  // ==========================

  renderMessageList() {
    const { messages } = this.state;
    return (
      <View style={styles.content}>
        <MessageList
          messages={messages}
          onPressMessage={this.handlePressMessage}
        />
      </View>
    );
  }

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;

    if (!fullscreenImageId) return null;

    const image = messages.find((m) => m.id === fullscreenImageId);
    if (!image || image.type !== 'image') return null;

    const { uri } = image;

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
      >
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };

  renderToolbar = () => (
    <View style={styles.toolbarWrapper}>
      <Toolbar
        isFocused={this.state.isInputFocused}
        onChangeFocus={this.handleChangeFocus}
        onSubmit={this.handleSubmit}
        onPressCamera={this.handlePressToolbarCamera}
        onPressLocation={this.handlePressToolbarLocation}
      />
    </View>
  );

  renderInputMethodEditor = () => <View style={styles.inputMethodEditor} />;

  render() {
    return (
      <View style={styles.container}>
        <Status />
        {this.renderMessageList()}
        {this.renderToolbar()}
        {this.renderInputMethodEditor()}
        {this.renderFullscreenImage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 2.5,
    marginBottom: 40, // space before IME
  },
  toolbarWrapper: {
    flex: 0.4,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e8e8e8',
  },
  inputMethodEditor: {
    flex: 0.9,
    backgroundColor: 'white',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});
