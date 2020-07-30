import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RimbleUtils from '@rimble/utils';
import { Box, Flex, Icon, Text, MetaMaskButton, Flash } from 'rimble-ui';

const WrongNetwork = ({
  currentNetwork,
  requiredNetwork,
  onWrongNetworkMessage,
}) => {
  return (
    <div>
      {onWrongNetworkMessage === null ? (
        // Show default banner
        <Flash variant={'danger'}>
          <Flex alignItems="center">
            <Box pr={3}>
              <Icon name="Warning" size="44" />
            </Box>
            <Flex flexDirection="column">
              <Text fontWeight="bold" color={'inherit'}>
                Switch to the{' '}
                {RimbleUtils.getEthNetworkNameById(requiredNetwork)} network in{' '}
                <Text
                  color={'inherit'}
                  fontWeight={'inherit'}
                  display={['none', 'none', 'inline-block', 'inline-block']}
                >
                  MetaMask
                </Text>
                <Text
                  color={'inherit'}
                  fontWeight={'inherit'}
                  display={['inline-block', 'inline-block', 'none', 'none']}
                >
                  Settings
                </Text>
              </Text>
              <Text color={'inherit'}>
                To use our blockchain features, you need to be on the{' '}
                {RimbleUtils.getEthNetworkNameById(requiredNetwork)} network.
                You're currently on{' '}
                {RimbleUtils.getEthNetworkNameById(currentNetwork)}.
              </Text>
            </Flex>
          </Flex>
        </Flash>
      ) : (
        // Show custom banner
        onWrongNetworkMessage
      )}
    </div>
  );
};

const NoNetwork = ({ noNetworkAvailableMessage }) => {
  return (
    <div>
      {noNetworkAvailableMessage === null ? (
        <Flash variant={'danger'}>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" pr={'2'}>
              <Box pr={3}>
                <Icon name="Warning" size="44" />
              </Box>
              <Flex flexDirection="column">
                <Text fontWeight="bold" color={'inherit'}>
                  Install the MetaMask browser extension to use our blockchain
                  features in your current browser
                </Text>
              </Flex>
            </Flex>

            <MetaMaskButton
              as="a"
              href="https://metamask.io/"
              target="_blank"
              color={'white'}
            >
              Install MetaMask
            </MetaMaskButton>
          </Flex>
        </Flash>
      ) : (
        noNetworkAvailableMessage
      )}
    </div>
  );
};

const NotWeb3Browser = ({ notWeb3CapableBrowserMessage }) => {
  return (
    <div>
      {notWeb3CapableBrowserMessage === null ? (
        <Flash variant={'danger'}>
          <Flex alignItems="center">
            <Box pr={3}>
              <Icon name="Warning" size="44" />
            </Box>
            <Flex flexDirection="column">
              <Text fontWeight="bold" color={'inherit'}>
                Your browser doesn't support our blockchain features
              </Text>
              {RimbleUtils.isMobileDevice() ? (
                <Text color={'inherit'}>
                  Try a mobile wallet browser like Status, Coinbase wallet or
                  Cipher
                </Text>
              ) : (
                <Text color={'inherit'}>
                  Switch to either Brave, FireFox, Opera, or Chrome to continue
                </Text>
              )}
            </Flex>
          </Flex>
        </Flash>
      ) : (
        notWeb3CapableBrowserMessage
      )}
    </div>
  );
};

const CustomMessage = ({ message }) => {
  return <div>{message}</div>;
};

class ConnectionBanner extends Component {
  static propTypes = {
    currentNetwork: PropTypes.number,
    requiredNetwork: PropTypes.number,
    onWeb3Fallback: PropTypes.bool,
    children: PropTypes.shape({
      notWeb3CapableBrowserMessage: PropTypes.node,
      noNetworkAvailableMessage: PropTypes.node,
      onWrongNetworkMessage: PropTypes.node,
    }),
  };
  static defaultProps = {
    currentNetwork: null,
    requiredNetwork: null,
    onWeb3Fallback: false,
    children: {
      notWeb3CapableBrowserMessage: null,
      noNetworkAvailableMessage: null,
      onWrongNetworkMessage: null,
    },
  };

  state = {
    isCorrectNetwork: null,
  };

  checkCorrectNetwork = () => {
    const isCorrectNetwork =
      this.props.currentNetwork === this.props.requiredNetwork;
    if (isCorrectNetwork !== this.state.isCorrectNetwork) {
      this.setState({ isCorrectNetwork });
    }
  };

  componentDidMount() {
    const browserIsWeb3Capable = RimbleUtils.browserIsWeb3Capable();
    this.setState({ browserIsWeb3Capable });
  }

  componentDidUpdate() {
    if (this.props.currentNetwork && this.props.requiredNetwork) {
      this.checkCorrectNetwork();
    }
  }

  render() {
    const {
      currentNetwork,
      requiredNetwork,
      onWeb3Fallback,
      customMessage,
    } = this.props;

    const {
      notWeb3CapableBrowserMessage,
      noNetworkAvailableMessage,
      onWrongNetworkMessage,
    } = this.props.children;

    return (
      <div>
        {this.state.browserIsWeb3Capable === false ? (
          <NotWeb3Browser
            notWeb3CapableBrowserMessage={notWeb3CapableBrowserMessage}
          />
        ) : onWeb3Fallback === true || currentNetwork === null ? (
          <NoNetwork noNetworkAvailableMessage={noNetworkAvailableMessage} />
        ) : this.state.isCorrectNetwork === false ? (
          <WrongNetwork
            currentNetwork={currentNetwork}
            requiredNetwork={requiredNetwork}
            onWrongNetworkMessage={onWrongNetworkMessage}
          />
        ) : this.state.customMessage != undefined ? (
          <CustomMessage message={customMessage} />
        ) : null}
      </div>
    );
  }
}

export default ConnectionBanner;
