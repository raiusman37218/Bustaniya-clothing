export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      order_items: {
        Row: {
          color: string | null;
          created_at: string;
          id: number;
          image_url: string | null;
          line_total_pkr: number;
          order_id: string;
          product_id: number | null;
          quantity: number;
          size: string | null;
          title: string;
          unit_price_pkr: number;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          image_url?: string | null;
          line_total_pkr: number;
          order_id: string;
          product_id?: number | null;
          quantity?: number;
          size?: string | null;
          title: string;
          unit_price_pkr: number;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          image_url?: string | null;
          line_total_pkr?: number;
          order_id?: string;
          product_id?: number | null;
          quantity?: number;
          size?: string | null;
          title?: string;
          unit_price_pkr?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          billing_address: Json | null;
          created_at: string;
          customer_email: string | null;
          discount_amount_pkr: number;
          discount_code: string | null;
          guest_email: string;
          guest_name: string | null;
          guest_phone: string | null;
          id: string;
          notes: string | null;
          order_number: string;
          payment_method: string;
          shipping_city: string | null;
          shipping_country: string | null;
          shipping_fee_pkr: number;
          shipping_full_name: string | null;
          shipping_line1: string | null;
          shipping_line2: string | null;
          shipping_phone: string | null;
          shipping_postal_code: string | null;
          shipping_region: string | null;
          status: string;
          subtotal_pkr: number;
          total_pkr: number;
          user_id: string | null;
        };
        Insert: {
          billing_address?: Json | null;
          created_at?: string;
          customer_email?: string | null;
          discount_amount_pkr?: number;
          discount_code?: string | null;
          guest_email: string;
          guest_name?: string | null;
          guest_phone?: string | null;
          id: string;
          notes?: string | null;
          order_number: string;
          payment_method?: string;
          shipping_city?: string | null;
          shipping_country?: string | null;
          shipping_fee_pkr?: number;
          shipping_full_name?: string | null;
          shipping_line1?: string | null;
          shipping_line2?: string | null;
          shipping_phone?: string | null;
          shipping_postal_code?: string | null;
          shipping_region?: string | null;
          status?: string;
          subtotal_pkr: number;
          total_pkr: number;
          user_id?: string | null;
        };
        Update: {
          billing_address?: Json | null;
          created_at?: string;
          customer_email?: string | null;
          discount_amount_pkr?: number;
          discount_code?: string | null;
          guest_email?: string;
          guest_name?: string | null;
          guest_phone?: string | null;
          id?: string;
          notes?: string | null;
          order_number?: string;
          payment_method?: string;
          shipping_city?: string | null;
          shipping_country?: string | null;
          shipping_fee_pkr?: number;
          shipping_full_name?: string | null;
          shipping_line1?: string | null;
          shipping_line2?: string | null;
          shipping_phone?: string | null;
          shipping_postal_code?: string | null;
          shipping_region?: string | null;
          status?: string;
          subtotal_pkr?: number;
          total_pkr?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['id'];
            isOneToOne: false;
            referencedRelation: 'order_items';
            referencedColumns: ['order_id'];
          },
        ];
      };
      product: {
        Row: {
          created_at: string;
          id: number;
          procuct_price: string | null;
          product_bestsellere: boolean;
          product_category: string | null;
          product_color: Json;
          product_description: string | null;
          product_img: Json;
          product_instock: boolean;
          product_name: string;
          product_new: boolean;
          product_size: Json;
        };
        Insert: {
          created_at?: string;
          procuct_price?: string | null;
          product_bestsellere?: boolean;
          product_category?: string | null;
          product_color?: Json;
          product_description?: string | null;
          product_img?: Json;
          product_instock?: boolean;
          product_name: string;
          product_new?: boolean;
          product_size?: Json;
        };
        Update: {
          created_at?: string;
          procuct_price?: string | null;
          product_bestsellere?: boolean;
          product_category?: string | null;
          product_color?: Json;
          product_description?: string | null;
          product_img?: Json;
          product_instock?: boolean;
          product_name?: string;
          product_new?: boolean;
          product_size?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      admin_get_order_rpc: {
        Args: { access_key: string; p_order_id: string };
        Returns: Json;
      };
      admin_list_orders_rpc: {
        Args: { access_key: string };
        Returns: Json;
      };
      admin_update_order_status_rpc: {
        Args: { access_key: string; p_order_id: string; p_status: string };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
