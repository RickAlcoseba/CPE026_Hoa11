import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MessageShape } from '../utils/MessageUtils';

// Helper function to extract a unique key for FlatList
const keyExtractor = item => item.id.toString();

export default class MessageList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage: PropTypes.func,
  };

  static defaultProps = {
    onPressMessage: () => {},
  };

  // Helper method to render the actual content of the message body
  renderMessageBody = ({ type, text, uri, coordinate }) => {
    switch (type) {
      case 'text':
        return (
          <View style={styles.messageBubble}>
            <Text style={styles.text}>{text}</Text>
          </View>
        );
      case 'image':
        return <Image style={styles.image} source={{ uri }} />;
      case 'location':
        // PLACEHOLDER: Use a View and Text component instead of MapView
        return (
          <View style={[styles.map, styles.mapPlaceholder]}>
            <Text style={styles.text}>Map Placeholder</Text>
            <Text style={styles.textSmall}>Lat: {coordinate.latitude.toFixed(4)}</Text>
            <Text style={styles.textSmall}>Lon: {coordinate.longitude.toFixed(4)}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  // Renders each individual message item
  renderMessageItem = ({ item }) => {
    const { onPressMessage } = this.props;

    return (
      <View key={item.id} style={styles.messageRow}>
        <TouchableOpacity onPress={() => onPressMessage(item)}>
          {this.renderMessageBody(item)}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { messages } = this.props;
    
    return (
      <FlatList
        style={styles.container}
        inverted
        data={messages}
        renderItem={this.renderMessageItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'handled'}
      />
    );
  }
}

// Styles for the messages
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 60,
    marginBottom: 4,
  },
  messageBubble: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  textSmall: {
    color: 'white',
    fontSize: 12,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  map: {
    width: 250,
    height: 100, // Reduced height for placeholder
    borderRadius: 10,
  },
  mapPlaceholder: {
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  }
});