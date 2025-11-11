// components/Toolbar.js
import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ToolbarButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

ToolbarButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

ToolbarButton.defaultProps = {
  onPress: () => {},
};

export default class Toolbar extends React.Component {
  static propTypes = {
    isFocused: PropTypes.bool.isRequired,
    onChangeFocus: PropTypes.func,
    onSubmit: PropTypes.func,
    onPressCamera: PropTypes.func,
    onPressLocation: PropTypes.func,
  };

  static defaultProps = {
    onChangeFocus: () => {},
    onSubmit: () => {},
    onPressCamera: () => {},
    onPressLocation: () => {},
  };

  state = { text: '' };
  input = null;

  componentDidUpdate(prevProps) {
    // Control focus based on parent prop
    if (prevProps.isFocused !== this.props.isFocused && this.input) {
      if (this.props.isFocused) this.input.focus();
      else this.input.blur();
    }
  }

  setInputRef = (ref) => (this.input = ref);
  handleChangeText = (text) => this.setState({ text });

  handleSubmitEditing = () => {
    const text = this.state.text.trim();
    if (text.length > 0) {
      this.props.onSubmit(text);
      this.setState({ text: '' }); // keep keyboard open thanks to blurOnSubmit={false}
    }
  };

  handleFocus = () => this.props.onChangeFocus(true);
  handleBlur = () => this.props.onChangeFocus(false);

  render() {
    const { onPressCamera, onPressLocation, isFocused } = this.props;
    const { text } = this.state;

    return (
      <View style={styles.toolbar}>
        <ToolbarButton title="📸" onPress={onPressCamera} />
        <ToolbarButton title="📌" onPress={onPressLocation} />
        <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
          <TextInput
            ref={this.setInputRef}
            style={styles.input}
            placeholder="Type a message"
            value={text}
            onChangeText={this.handleChangeText}
            onSubmitEditing={this.handleSubmitEditing}
            blurOnSubmit={false}
            returnKeyType="send"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 18,
  },
  inputContainer: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#f4f6f8',
    borderWidth: 1,
    borderColor: '#e6e8eb',
  },
  inputFocused: {
    borderColor: '#3273dc',
  },
  input: {
    fontSize: 16,
  },
});