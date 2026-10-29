export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          badge: string
          button_text: string
          created_at: string
          id: string
          image_url: string
          link: string
          sort: number
          subtitle: string
          title: string
          video_url: string
        }
        Insert: {
          badge?: string
          button_text?: string
          created_at?: string
          id?: string
          image_url?: string
          link?: string
          sort?: number
          subtitle?: string
          title?: string
          video_url?: string
        }
        Update: {
          badge?: string
          button_text?: string
          created_at?: string
          id?: string
          image_url?: string
          link?: string
          sort?: number
          subtitle?: string
          title?: string
          video_url?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          icon: string
          id: string
          image_url: string
          name: string
          slug: string
          sort: number
        }
        Insert: {
          icon?: string
          id?: string
          image_url?: string
          name: string
          slug: string
          sort?: number
        }
        Update: {
          icon?: string
          id?: string
          image_url?: string
          name?: string
          slug?: string
          sort?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          category_slug: string
          created_at: string
          description: string
          fast_shipping: boolean
          id: string
          image_url: string
          is_bestseller: boolean
          is_flash: boolean
          is_recommended: boolean
          name: string
          old_price: number | null
          price: number
          rating: number
          reviews: number
          slug: string
          sort: number
          subcategory: string
        }
        Insert: {
          brand?: string
          category_slug?: string
          created_at?: string
          description?: string
          fast_shipping?: boolean
          id?: string
          image_url?: string
          is_bestseller?: boolean
          is_flash?: boolean
          is_recommended?: boolean
          name: string
          old_price?: number | null
          price?: number
          rating?: number
          reviews?: number
          slug: string
          sort?: number
          subcategory?: string
        }
        Update: {
          brand?: string
          category_slug?: string
          created_at?: string
          description?: string
          fast_shipping?: boolean
          id?: string
          image_url?: string
          is_bestseller?: boolean
          is_flash?: boolean
          is_recommended?: boolean
          name?: string
          old_price?: number | null
          price?: number
          rating?: number
          reviews?: number
          slug?: string
          sort?: number
          subcategory?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          bancolombia_account: string
          bancolombia_account_type: string
          city: string
          footer_text: string
          id: number
          logo_height: number
          logo_position: string
          logo_url: string
          nequi_number: string
          payment_holder: string
          promo_label: string
          receipt_whatsapp: string
          store_name: string
          top_bar_text: string
          whatsapp: string
        }
        Insert: {
          bancolombia_account?: string
          bancolombia_account_type?: string
          city?: string
          footer_text?: string
          id?: number
          logo_height?: number
          logo_position?: string
          logo_url?: string
          nequi_number?: string
          payment_holder?: string
          promo_label?: string
          receipt_whatsapp?: string
          store_name?: string
          top_bar_text?: string
          whatsapp?: string
        }
        Update: {
          bancolombia_account?: string
          bancolombia_account_type?: string
          city?: string
          footer_text?: string
          id?: number
          logo_height?: number
          logo_position?: string
          logo_url?: string
          nequi_number?: string
          payment_holder?: string
          promo_label?: string
          receipt_whatsapp?: string
          store_name?: string
          top_bar_text?: string
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
