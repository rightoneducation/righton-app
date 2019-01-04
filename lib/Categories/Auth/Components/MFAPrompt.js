import React from 'react';
import PropTypes from 'prop-types';
import Prompt from '../../../../src/components/Prompt';
import { Keyboard } from 'react-native';

export default class MFAPrompt extends React.Component {
  static propTypes = {
    onValidate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onValidate: () => null,
    onCancel: () => null,
    onSuccess: () => null,
  };

  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleValidateMFACode = this.handleValidateMFACode.bind(this);
    this.mounted = false;
  }

  state = {
    promptTitle: 'Enter code',
    code: '',
  }

  componentDidMount() {
    this.mounted = true;
  }

  handleCancel() {
    Keyboard.dismiss();
    this.props.onCancel();
  }

  async handleValidateMFACode(code) {
    try {
      const validate = await this.props.onValidate(code);
      const validCode = validate === true;
      const promptTitle = validCode ?
        'Enter code' :
        'Sorry, that doesn\'t seem to match. Please try again.';

      // no-op to setState on an unmounted component.
      if (this.mounted) {
        this.setState({
          promptTitle
        }, () => {
          if (validCode) {
            this.props.onSuccess();
          }
        });
      }
    } catch (err) {
      this.setState({ promptTitle: `${err.message} Enter code again` });
    }
  }

  render() {
    return (
      <Prompt
        title={this.state.promptTitle}
        placeholder="Code"
        textInputProps={{
          keyboardType: 'numeric',
        }}
        visible
        onCancel={this.handleCancel}
        onSubmit={this.handleValidateMFACode}
      />
    );
  }
}
