import { useEffect, useState } from 'react';
import supabase from './supabase';

function ViewDB() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase.from('users').select('');
    if (!error) {
    //   setData(data);
    console.log(data)
    } else {
      console.error('Gagal mengambil data:', error.message);
    }
  };

  return (
    {data}
  );
}

export default ViewDB;
