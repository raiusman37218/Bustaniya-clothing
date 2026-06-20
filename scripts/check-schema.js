const { createClient } = require('@supabase/supabase-js');

async function checkProducts() {
  const url = 'https://rjkdjbcmyexcbawxgjrd.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2RqYmNteWV4Y2Jhd3hnanJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTM5MDYsImV4cCI6MjA5MzI4OTkwNn0.wzR0PSkDexTtfczkzL-oVp49oiTNwSfmg9PXJOeN47o';
  const supabase = createClient(url, anonKey);

  console.log('Querying public.products table...');
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (prodError) {
    console.error('Products error:', prodError);
  } else {
    console.log('Products sample:', products);
  }

  console.log('Querying public.product table (old singular)...');
  const { data: productOld, error: prodOldError } = await supabase
    .from('product')
    .select('*')
    .limit(1);

  if (prodOldError) {
    console.error('Product (old) error:', prodOldError);
  } else {
    console.log('Product (old) sample:', productOld);
  }
}

checkProducts();
