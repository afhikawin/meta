import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from './supabase'; // pastikan file supabase.js sudah dikonfigurasi

const Dashboard = () => {
  const [totalData, setTotalData] = useState(0);
  const [offlineData, setOfflineData] = useState(0);
  const [onlineData, setOnlineData] = useState(0);
  const [mempawahData, setMempawahData] = useState(0);
  const [ketapangData, setKetapangData] = useState(0);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).replace(/(\s\w+\s)/, m => m.toUpperCase());

  useEffect(() => {
    const fetchData = async () => {
      const { count: total, error: err1 } = await supabase
        .from('data')
        .select('*', { count: 'exact', head: true });

      const { count: offline, error: err2 } = await supabase
        .from('data')
        .select('*', { count: 'exact', head: true })
        .or('status.eq.off,status.is.null');

      const { count: online, error: err3 } = await supabase
        .from('data')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'on');

      const { data: mempawahData, error: err4 } = await supabase
        .from('member')
        .select('mempawah')
        .single();

      const { data: ketapangData, error: err5 } = await supabase
        .from('member')
        .select('ketapang')
        .single();

      if (!err1) setTotalData(total);
      if (!err2) setOfflineData(offline);
      if (!err3) setOnlineData(online);
      if (!err4) setMempawahData(mempawahData.mempawah || 0);
      if (!err5) setKetapangData(ketapangData.ketapang || 0);
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">My Dashboard</h2>
        <nav className="space-y-4">
          <Link to="/" className="block hover:text-blue-400">🏠 Home</Link>
          <Link to="/login_mempawah" className="block hover:text-blue-400">🔐 Login Mempawah</Link>
          <Link to="/login_ketapang" className="block hover:text-blue-400">🔐 Login Ketapang</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">{today}</p>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Data" value={totalData} color="blue" />
          <Card title="Data Offline" value={offlineData} color="yellow" />
          <Card title="Data Online" value={onlineData} color="green" />
          <Card title="Mempawah" value={mempawahData} color="red" />
          <Card title="Ketapang" value={ketapangData} color="red" />
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
    <p className={`mt-2 text-2xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

export default Dashboard;
