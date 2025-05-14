import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Wallet } from '@walletconnect/web3wallet';
import { buildApprovedNamespaces } from '@walletconnect/utils';
import { Core } from '@walletconnect/core';
import supabase from './supabase';

const seacrhDbStatusOff = async () => {
  try {
    const { data, error } = await supabase.from('data').select('pharse').eq('status', 'off');
    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error('Tidak ada data dengan status "off"');
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].pharse;
  } catch (error) {
    // console.error('Gagal mengambil pharse:', error.message);
    return null;
  }
};


const getWalletFromPharse = (pharse) => ethers.HDNodeWallet.fromPhrase(pharse);
const getWalletAddress = (pharse) => getWalletFromPharse(pharse).address;
const getSigner = (pharse) => ethers.HDNodeWallet.fromPhrase(pharse);

const executeFunction = async ({ id, method, params, pharse }) => {
  const signer = getSigner(pharse);
  let response;

  switch (method) {
    case 'personal_sign':
      const message = ethers.toUtf8String(params[0]);
      response = await signer.signMessage(message);
      break;

    default:
      throw new Error(`Method ${method} not supported`);
  }

  return { id, result: response, jsonrpc: '2.0' };
};

function LoginGiveaway() {
  const [uri, setUri] = useState('');
  const [pharse, setPharse] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);
  const [cookie, setCookie] = useState('');
  const [cookieStatus, setCookieStatus] = useState('');

  const projectId = 'f911abe9ec3f8d92755049023968eafc';
  const supportedChains = ['eip155:1', 'eip155:137'];
  const supportedMethods = ['personal_sign', 'eth_sendTransaction', 'eth_signTypedData'];
  const supportedEvents = ['accountsChanged', 'chainChanged'];

  const fetchOfflineCount = async () => {
    const { count, error } = await supabase
      .from('data')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'off');

    if (!error) {
      setOfflineCount(count);
    } else {
      console.error('Error fetching offline count:', error.message);
    }
  };

  const updateCookieToDB = async () => {
  try {
    const cookies = "GVAuthorization="+cookie;
    const { error } = await supabase
      .from('data')
      .update({ cookie: cookies, status: 'on' }) // update dua kolom sekaligus
      .eq('pharse', pharse); // gunakan seed phrase sebagai kunci

    if (error) throw error;

    setCookieStatus('Cookie dan status berhasil diperbarui!');
  } catch (error) {
    console.error('Gagal update cookie dan status:', error.message);
    setCookieStatus('Gagal memperbarui cookie dan status!');
  }
};



  // 🔄 Ambil seed phrase dari DB saat komponen dimuat
  useEffect(() => {
    const loadPharseFromDB = async () => {
      const fetchedPharse = await seacrhDbStatusOff();
      if (fetchedPharse) {
        setPharse(fetchedPharse);
        setWalletAddress(getWalletAddress(fetchedPharse));
      } else {
        setTxStatus('Data Offline Not Found!!!');
      }
    };

    loadPharseFromDB();
    fetchOfflineCount();
  }, []);

  const initWalletConnect = async (uri) => {
    const core = new Core({ projectId });
    const wallet = await Web3Wallet.init({
      core,
      metadata: {
        name: 'WalletConnect Web Example',
        description: 'Web Wallet for WalletConnect',
        url: 'https://walletconnect.com/',
        icons: ['https://avatars.githubusercontent.com/u/37784886'],
      },
    });

    try {
      await wallet.core.pairing.pair({ uri });
      setIsConnected(true);

      wallet.on('session_proposal', async ({ id, params }) => {
        const proposer = params.proposer.metadata;
        console.log(`dApp: ${proposer.name}`);

        try {
          const approvedNamespaces = buildApprovedNamespaces({
            proposal: params,
            supportedNamespaces: {
              eip155: {
                chains: supportedChains,
                methods: supportedMethods,
                events: supportedEvents,
                accounts: supportedChains.map(chain => `${chain}:${walletAddress}`),
              },
            },
          });

          const session = await wallet.approveSession({ id, namespaces: approvedNamespaces });
          console.log('Session approved:', session);
          setTxStatus('Berhasil Login');
        } catch (error) {
          console.error('Gagal menyetujui sesi:', error);
          await wallet.rejectSession({ id, reason: 'USER_REJECTED' });
        }
      });

      wallet.on('session_request', async ({ topic, params, id }) => {
        const { request } = params;
        const response = await executeFunction({
          id,
          method: request.method,
          params: request.params,
          pharse,
        });

        await wallet.respondSessionRequest({ topic, response });
      });

    } catch (error) {
      console.error('Pairing gagal:', error);
      setTxStatus('Gagal menghubungkan WalletConnect');
    }
  };

  const handleSubmitUri = () => {
    if (uri && pharse) {
      initWalletConnect(uri);
    } else {
      alert('URI tidak valid atau pharse belum tersedia.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">WalletConnect Login Account - MEMPAWAH</h1>
      <p className="text-sm text-gray-400 text-center mb-6">
        Total Data Offline: {offlineCount}
      </p>
      <div className="w-full max-w-xl space-y-6">

        {/* Wallet Address */}
        {walletAddress && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Wallet Address:</h2>
            <p className="break-words">{walletAddress}</p>
          </div>
        )}

        {/* WalletConnect URI Input */}
        <div>
          <input
            type="text"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
            placeholder="Masukkan WalletConnect URI"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!walletAddress}
          />
          <button
            onClick={handleSubmitUri}
            disabled={!walletAddress}
            className={`mt-2 px-4 py-2 rounded-lg w-full ${walletAddress ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
              }`}
          >
            Connect with WalletConnect
          </button>
        </div>

        {isConnected && (
          <div className="bg-gray-800 p-4 rounded-lg space-y-2">
            <h2 className="text-lg font-semibold">Update Cookie:</h2>
            <input
              type="text"
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="Masukkan nilai cookie"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={updateCookieToDB}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg w-full"
            >
              Submit Cookie
            </button>
            {cookieStatus && <p className="text-sm text-green-400">{cookieStatus}</p>}
          </div>
        )}


        {/* Status */}
        {txStatus && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Status :</h2>
            <p>{txStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginGiveaway;