-- Create RPC function to insert a stock entry securely bypassing RLS via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.admin_insert_stock_entry_rpc(
  access_key text,
  p_id text,
  p_description text,
  p_expenses jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF NOT admin_verify_orders_key(access_key) THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.stock_entries (
    id,
    description,
    expenses
  ) VALUES (
    p_id,
    p_description,
    p_expenses
  )
  RETURNING row_to_json(public.stock_entries.*)::jsonb INTO v_result;

  RETURN v_result;
END;
$$;

-- Create RPC function to update a stock entry securely bypassing RLS via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.admin_update_stock_entry_rpc(
  access_key text,
  p_id text,
  p_description text,
  p_expenses jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF NOT admin_verify_orders_key(access_key) THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  UPDATE public.stock_entries
  SET
    description = p_description,
    expenses = p_expenses
  WHERE id = p_id
  RETURNING row_to_json(public.stock_entries.*)::jsonb INTO v_result;

  RETURN v_result;
END;
$$;

-- Create RPC function to delete a stock entry securely bypassing RLS via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.admin_delete_stock_entry_rpc(
  access_key text,
  p_id text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT admin_verify_orders_key(access_key) THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.stock_entries
  WHERE id = p_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_insert_stock_entry_rpc(text, text, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_stock_entry_rpc(text, text, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_stock_entry_rpc(text, text) TO anon, authenticated;

-- Force postgrest cache reload
NOTIFY pgrst, 'reload schema';
