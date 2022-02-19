import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
  TouchableWithoutFeedback,
  View,
  Text
} from 'react-native'
import ToastStyles from './ToastStyles'

const noop = () => 0

class Toast extends Component {
  timeoutId = null;
  onHideTimeout = null;
  static propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    styles: PropTypes.object,
    duration: PropTypes.number,
    height: PropTypes.number,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    onPress: PropTypes.func
  }

  static defaultProps = {
    styles: ToastStyles.info,
    duration: 3000,
    height: 100,
    onShow: noop,
    onHide: noop,
    onPress: noop
  }

  state = { animatedValue: new Animated.Value(0) }

  componentDidMount () {
    this.showToast()
  }

  componentWillUnmount () {
    clearTimeout(this.timeoutId)
    clearTimeout(this.onHideTimeout)
  }

  componentDidUpdate (prevProps) {
    if (this.props.id !== prevProps.id) {
      this.showToast()
    }
  }

  showToast () {
    const animatedValue = new Animated.Value(0)

    this.setState({ animatedValue })

    Animated
      .timing(animatedValue, { toValue: 1, duration: 350, useNativeDriver: false })
      .start()

    const { duration, onShow } = this.props
    this.timeoutId = setTimeout(() => this.hideToast(), duration + 350)

    this.props.onShow && this.props.onShow()
  }

  hideToast () {
    const { animatedValue } = this.state

    clearTimeout(this.timeoutId)
    clearTimeout(this.onHideTimeout)

    Animated
      .timing(animatedValue, { toValue: 0, duration: 350, useNativeDriver: false })
      .start()

    this.onHideTimeout = setTimeout(this.props.onHide, 350)
  }

  onPress = () => {
    this.hideToast()
    this.props.onPress()
  }

  render () {
    const y = this.state.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-this.props.height, 0]
    })

    const { styles } = this.props
    let text = this.props.text

    if (Object.prototype.toString.call(text) === '[object String]') {
      text = (
        <View style={styles.container}>
          <Text style={styles.text}>{text}</Text>
        </View>
      )
    }

    return (
      <Animated.View style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 9999,
        transform: [{ translateY: y }]
      }}>
        <TouchableWithoutFeedback onPress={this.onPress}>
          {text}
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }
}

export default Toast
