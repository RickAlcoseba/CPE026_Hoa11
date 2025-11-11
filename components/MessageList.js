import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MessageShape } from '../utils/MessageUtils';

const keyExtractor = (item) => item.id.toString();

export default class MessageList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage: PropTypes.func,
  };

  static defaultProps = { onPressMessage: () => {} };

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

      case 'location': {
        if (!coordinate) return null;
        const { latitude, longitude } = coordinate;

        return (
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              pointerEvents="none"
            >
              <Marker coordinate={{ latitude, longitude }} />
            </MapView>
          </View>
        );
      }

      default:
        return null;
    }
  };

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
        keyboardShouldPersistTaps="handled"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'visible' },
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
  text: { color: 'white', fontWeight: 'bold' },
  image: { width: 150, height: 150, borderRadius: 10 },

  mapContainer: {
    width: 250,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e6e6e6',
  },
  map: { width: '100%', height: '100%' },
});
