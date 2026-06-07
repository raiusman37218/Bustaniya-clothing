const { createClient } = require('@supabase/supabase-js');

async function test() {
  const url = 'https://rjkdjbcmyexcbawxgjrd.supabase.co';
  const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2RqYmNteWV4Y2Jhd3hnanJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzcxMzkwNiwiZXhwIjoyMDkzMjg5OTA2fQ.ZPXluQosK0wFBwXr3eXajwejDOieoKjfRCCjWSjkO80S';

  const supabaseService = createClient(url, serviceKey);
  console.log('Testing service role client...');
  const { data, error } = await supabaseService.from('products').select('*').limit(1);
  if (error) {
    console.error('Service Role Error:', error);
  } else {
    console.log('Service Role Success! Found products:', data.length);
  }
}

test();
