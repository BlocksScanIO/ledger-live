import { useEffect, useRef, useState } from "react";
import Transport from "@ledgerhq/hw-transport";
import Eth from "@ledgerhq/hw-app-eth";
import LedgerLiveApi, { WindowMessageTransport } from "@ledgerhq/live-app-sdk";
import hwGetDeviceInfo from "@ledgerhq/live-common/hw/getDeviceInfo";
import { Buffer } from "buffer";
import logo from "./ledger-logo.png";
import "./App.css";

global.Buffer = Buffer;

const prettyJSON = (payload: any) => JSON.stringify(payload, null, 2);

/**
 * Wallet API Transport implementation
 */
class TransportWalletAPI extends Transport {
  walletApi: LedgerLiveApi;

  constructor(walletApi: LedgerLiveApi) {
    super();
    this.walletApi = walletApi;
  }

  /**
   * Check if Wallet API transport is supported.
   */
  static isSupported = (): Promise<boolean> => Promise.resolve(true);

  /**
   * This transport is not discoverable
   */
  static list = () => Promise.resolve([]);
  static listen = (_observer: any) => ({
    unsubscribe: () => {},
  });

  /**
   * Create a Ledger transport with the Wallet API transport
   */
  static async open(walletApi: LedgerLiveApi): Promise<Transport> {
    return new TransportWalletAPI(walletApi);
  }

  /**
   * Exchange with the device using APDU protocol.
   * @param apdu
   * @returns a promise of apdu response
   */
  async exchange(apdu: Buffer): Promise<Buffer> {
    const apduHex = apdu.toString("hex");
    // @ts-expect-error: _request is private but it's only for a test
    const res = await this.walletApi._request("device.exchange", {
      apduHex,
    });

    return Buffer.from(res.responseHex, "hex");
  }

  setScrambleKey() {}

  close(): Promise<void> {
    return Promise.resolve();
  }
}

const App = () => {
  // Define the Ledger Live API variable used to call api methods
  const api = useRef<LedgerLiveApi>();
  const transport = useRef<Transport>();

  const [output, setOutput] = useState<any>(null);

  // Instantiate the Ledger Live API on component mount
  useEffect(() => {
    const llapi = new LedgerLiveApi(new WindowMessageTransport());
    llapi.connect();
    if (llapi) {
      api.current = llapi;
    }

    // Cleanup the Ledger Live API on component unmount
    return () => {
      api.current = undefined;
      void llapi.disconnect();
    };
  }, []);

  const getAccounts = async () => {
    if (!api.current) {
      return;
    }
    const action = await api.current.listAccounts().catch(error => console.error({ error }));
    setOutput(action);
  };

  const requestAccount = async () => {
    if (!api.current) {
      return;
    }
    const action = await api.current.requestAccount().catch(error => console.error({ error }));
    setOutput(action);
  };

  const verifyAddress = async () => {
    if (!api.current) {
      return;
    }
    const action = await api.current.receive("mock:1:bitcoin:true_bitcoin_0:");
    setOutput(action);
  };

  const signTransaction = async () => {
    if (!api.current) {
      return;
    }
    const transaction: any = {
      amount: 1230,
      recipient: "1Cz2ZXb6Y6AacXJTpo4RBjQMLEmscuxD8e",
      family: "bitcoin",
      feePerByte: 1,
    };

    const params: any = { useApp: null };

    const action = await api.current.signTransaction(
      "mock:1:bitcoin:true_bitcoin_0:",
      transaction,
      params,
    );
    setOutput(action);
  };

  const broadcastTransaction = async () => {
    if (!api.current) {
    }
    // const action = await api.current.broadcastSignedTransaction("mock:1:bitcoin:true_bitcoin_0:", signed tx);
    // setOutput(action)
  };

  const listCurrencies = async () => {
    if (!api.current) {
      return;
    }
    const action = await api.current.listCurrencies();
    setOutput(action);
  };

  const swap = async () => {};

  const fund = async () => {};

  const sell = async () => {};

  const getTransport = (appName?: string) => async () => {
    if (!api.current) {
      return;
    }
    // @ts-expect-error: _request is private but it's only for a test
    await api.current._request("device.getTransport", { appName });
    transport.current = await TransportWalletAPI.open(api.current);
  };

  const getDeviceInfo = async () => {
    if (!transport.current) {
      return;
    }
    const res = await hwGetDeviceInfo(transport.current);
    setOutput(res);
  };

  const ethGetAppConfiguration = async () => {
    if (!transport.current) {
      return;
    }
    const eth = new Eth(transport.current);
    const res = await eth.getAppConfiguration();
    setOutput(res);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Ledger Live Dummy Test App</h3>
        <p>App for testing the Ledger Live SDK manually and in Automated tests</p>
        <div className="button-container">
          <button onClick={getAccounts} data-test-id="get-all-accounts-button">
            Get all accounts
          </button>
          <button onClick={requestAccount} data-test-id="request-single-account-button">
            Request account
          </button>
          <button onClick={verifyAddress} data-test-id="verify-address-button">
            Verify Address
          </button>
          <button onClick={signTransaction} data-test-id="sign-transaction-button">
            Sign Transaction
          </button>
          <button onClick={broadcastTransaction} data-test-id="broadcast-transaction-button">
            Broadcast Transaction (Not yet implemented)
          </button>
          <button onClick={listCurrencies} data-test-id="list-currencies-button">
            List Currencies
          </button>
          <button onClick={swap} data-test-id="swap-button">
            Swap (Not yet implemented)
          </button>
          <button onClick={fund} data-test-id="fund-button">
            Fund (Not yet implemented)
          </button>
          <button onClick={sell} data-test-id="sell-button">
            Sell (Not yet implemented)
          </button>
          <button onClick={getTransport()} data-test-id="get-manager-transport-button">
            getManagerTransport
          </button>
          <button onClick={getDeviceInfo} data-test-id="get-device-info-button">
            getDeviceInfo
          </button>
          <button onClick={getTransport("Ethereum")} data-test-id="get-eth-transport-button">
            getEthTransport
          </button>
          <button onClick={ethGetAppConfiguration} data-test-id="eth-get-app-configuration-button">
            ethGetAppConfiguration
          </button>
        </div>
        <pre className="output-container">{output ? prettyJSON(output) : ""}</pre>
      </header>
    </div>
  );
};

export default App;
