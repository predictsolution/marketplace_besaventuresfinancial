import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { createConfig, WagmiConfig, configureChains } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import localFont from 'next/font/local';
import '@styles/globals.css';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { store } from '../store/store';
import { Provider } from 'react-redux';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

// Font
const galanoGrotesque = localFont({
  src: [
    {
      path: '../fonts/Galano_Grotesque_Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Galano_Grotesque_Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/Galano_Grotesque_ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
  ],
  variable: '--font-galanoGrotesque',
});

// Chains


/*
export const { chains, publicClient, webSocketPublicClient } = configureChains(
    [bsc],
    [publicProvider()]
);
*/
export const { chains, publicClient, webSocketPublicClient } = configureChains(
    [bsc],
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: 'https://binance.llamarpc.com',
          webSocket: 'wss://bsc-rpc.publicnode.com',
        }),
      }),
      publicProvider(),
    ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '70f0ed0241a180f97cee93b1570923e6',
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

// App
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <WagmiConfig config={config}>
      <SessionProvider session={session} refetchInterval={0}>
        <Provider store={store}>
          <main className={`${galanoGrotesque.variable} font-galano`}>
            <Component {...pageProps} />
          </main>
        </Provider>
      </SessionProvider>
    </WagmiConfig>
  );
}
