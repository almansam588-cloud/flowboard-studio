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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          board_id: string | null
          card_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          action: string
          board_id?: string | null
          card_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          action?: string
          board_id?: string | null
          card_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          is_cover: boolean | null
          mime_type: string | null
          name: string
          size_bytes: number | null
          storage_path: string | null
          uploaded_by: string
          url: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          is_cover?: boolean | null
          mime_type?: string | null
          name: string
          size_bytes?: number | null
          storage_path?: string | null
          uploaded_by: string
          url: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          is_cover?: boolean | null
          mime_type?: string | null
          name?: string
          size_bytes?: number | null
          storage_path?: string | null
          uploaded_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_logs: {
        Row: {
          actions_taken: Json | null
          automation_id: string
          card_id: string | null
          error_message: string | null
          id: string
          success: boolean
          triggered_at: string | null
        }
        Insert: {
          actions_taken?: Json | null
          automation_id: string
          card_id?: string | null
          error_message?: string | null
          id?: string
          success: boolean
          triggered_at?: string | null
        }
        Update: {
          actions_taken?: Json | null
          automation_id?: string
          card_id?: string | null
          error_message?: string | null
          id?: string
          success?: boolean
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          actions: Json | null
          board_id: string
          conditions: Json | null
          created_at: string | null
          created_by: string
          id: string
          is_enabled: boolean | null
          last_run_at: string | null
          name: string
          run_count: number | null
          trigger_config: Json | null
          trigger_type: Database["public"]["Enums"]["automation_trigger_type"]
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          board_id: string
          conditions?: Json | null
          created_at?: string | null
          created_by: string
          id?: string
          is_enabled?: boolean | null
          last_run_at?: string | null
          name: string
          run_count?: number | null
          trigger_config?: Json | null
          trigger_type: Database["public"]["Enums"]["automation_trigger_type"]
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          board_id?: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string
          id?: string
          is_enabled?: boolean | null
          last_run_at?: string | null
          name?: string
          run_count?: number | null
          trigger_config?: Json | null
          trigger_type?: Database["public"]["Enums"]["automation_trigger_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automations_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      board_members: {
        Row: {
          board_id: string
          id: string
          role: Database["public"]["Enums"]["board_member_role"] | null
          user_id: string
        }
        Insert: {
          board_id: string
          id?: string
          role?: Database["public"]["Enums"]["board_member_role"] | null
          user_id: string
        }
        Update: {
          board_id?: string
          id?: string
          role?: Database["public"]["Enums"]["board_member_role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_members_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "board_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      board_stars: {
        Row: {
          board_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          board_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          board_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_stars_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "board_stars_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      boards: {
        Row: {
          background_type: Database["public"]["Enums"]["background_type"] | null
          background_value: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_archived: boolean | null
          settings: Json | null
          title: string
          updated_at: string | null
          visibility: Database["public"]["Enums"]["board_visibility"] | null
          workspace_id: string
        }
        Insert: {
          background_type?:
            | Database["public"]["Enums"]["background_type"]
            | null
          background_value?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_archived?: boolean | null
          settings?: Json | null
          title: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["board_visibility"] | null
          workspace_id: string
        }
        Update: {
          background_type?:
            | Database["public"]["Enums"]["background_type"]
            | null
          background_value?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_archived?: boolean | null
          settings?: Json | null
          title?: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["board_visibility"] | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "boards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boards_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      card_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          card_id: string
          id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          card_id: string
          id?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          card_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_assignments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      card_dependencies: {
        Row: {
          blocked_card_id: string
          blocking_card_id: string
          created_at: string | null
          created_by: string | null
          id: string
          type: Database["public"]["Enums"]["dependency_type"] | null
        }
        Insert: {
          blocked_card_id: string
          blocking_card_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          type?: Database["public"]["Enums"]["dependency_type"] | null
        }
        Update: {
          blocked_card_id?: string
          blocking_card_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          type?: Database["public"]["Enums"]["dependency_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "card_dependencies_blocked_card_id_fkey"
            columns: ["blocked_card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_dependencies_blocking_card_id_fkey"
            columns: ["blocking_card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_dependencies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      card_labels: {
        Row: {
          card_id: string
          label_id: string
        }
        Insert: {
          card_id: string
          label_id: string
        }
        Update: {
          card_id?: string
          label_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_labels_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_labels_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
        ]
      }
      card_watchers: {
        Row: {
          card_id: string
          user_id: string
        }
        Insert: {
          card_id: string
          user_id: string
        }
        Update: {
          card_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_watchers_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_watchers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          board_id: string
          cover_type: Database["public"]["Enums"]["cover_type"] | null
          cover_value: string | null
          created_at: string | null
          created_by: string
          description: Json | null
          description_text: string | null
          due_date: string | null
          due_date_reminder: string | null
          estimated_hours: number | null
          id: string
          is_archived: boolean | null
          is_completed: boolean | null
          list_id: string
          parent_card_id: string | null
          position: number
          priority: Database["public"]["Enums"]["card_priority"] | null
          sprint_id: string | null
          start_date: string | null
          story_points: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          board_id: string
          cover_type?: Database["public"]["Enums"]["cover_type"] | null
          cover_value?: string | null
          created_at?: string | null
          created_by: string
          description?: Json | null
          description_text?: string | null
          due_date?: string | null
          due_date_reminder?: string | null
          estimated_hours?: number | null
          id?: string
          is_archived?: boolean | null
          is_completed?: boolean | null
          list_id: string
          parent_card_id?: string | null
          position?: number
          priority?: Database["public"]["Enums"]["card_priority"] | null
          sprint_id?: string | null
          start_date?: string | null
          story_points?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          board_id?: string
          cover_type?: Database["public"]["Enums"]["cover_type"] | null
          cover_value?: string | null
          created_at?: string | null
          created_by?: string
          description?: Json | null
          description_text?: string | null
          due_date?: string | null
          due_date_reminder?: string | null
          estimated_hours?: number | null
          id?: string
          is_archived?: boolean | null
          is_completed?: boolean | null
          list_id?: string
          parent_card_id?: string | null
          position?: number
          priority?: Database["public"]["Enums"]["card_priority"] | null
          sprint_id?: string | null
          start_date?: string | null
          story_points?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cards_parent_card_id_fkey"
            columns: ["parent_card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sprint"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          assignee_id: string | null
          checklist_id: string
          created_at: string | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          position: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          checklist_id: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          position?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          checklist_id?: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          position?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          position: number | null
          title: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          position?: number | null
          title?: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          position?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      client_portals: {
        Row: {
          allow_attachments: boolean | null
          allow_comments: boolean | null
          board_id: string
          created_at: string | null
          custom_branding: Json | null
          id: string
          is_active: boolean | null
          password_hash: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          allow_attachments?: boolean | null
          allow_comments?: boolean | null
          board_id: string
          created_at?: string | null
          custom_branding?: Json | null
          id?: string
          is_active?: boolean | null
          password_hash?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          allow_attachments?: boolean | null
          allow_comments?: boolean | null
          board_id?: string
          created_at?: string | null
          custom_branding?: Json | null
          id?: string
          is_active?: boolean | null
          password_hash?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_portals_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: true
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          card_id: string
          client_visible: boolean | null
          content: Json
          content_text: string | null
          created_at: string | null
          id: string
          is_edited: boolean | null
          parent_id: string | null
          reactions: Json | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          card_id: string
          client_visible?: boolean | null
          content: Json
          content_text?: string | null
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          parent_id?: string | null
          reactions?: Json | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          card_id?: string
          client_visible?: boolean | null
          content?: Json
          content_text?: string | null
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          parent_id?: string | null
          reactions?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_field_values: {
        Row: {
          bool_value: boolean | null
          card_id: string
          custom_field_id: string
          date_value: string | null
          id: string
          number_value: number | null
          text_value: string | null
        }
        Insert: {
          bool_value?: boolean | null
          card_id: string
          custom_field_id: string
          date_value?: string | null
          id?: string
          number_value?: number | null
          text_value?: string | null
        }
        Update: {
          bool_value?: boolean | null
          card_id?: string
          custom_field_id?: string
          date_value?: string | null
          id?: string
          number_value?: number | null
          text_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_field_values_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_field_values_custom_field_id_fkey"
            columns: ["custom_field_id"]
            isOneToOne: false
            referencedRelation: "custom_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_fields: {
        Row: {
          board_id: string
          created_at: string | null
          id: string
          name: string
          options: Json | null
          position: number | null
          type: Database["public"]["Enums"]["custom_field_type"]
        }
        Insert: {
          board_id: string
          created_at?: string | null
          id?: string
          name: string
          options?: Json | null
          position?: number | null
          type: Database["public"]["Enums"]["custom_field_type"]
        }
        Update: {
          board_id?: string
          created_at?: string | null
          id?: string
          name?: string
          options?: Json | null
          position?: number | null
          type?: Database["public"]["Enums"]["custom_field_type"]
        }
        Relationships: [
          {
            foreignKeyName: "custom_fields_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      labels: {
        Row: {
          board_id: string
          color: string
          id: string
          name: string | null
        }
        Insert: {
          board_id: string
          color?: string
          id?: string
          name?: string | null
        }
        Update: {
          board_id?: string
          color?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labels_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          board_id: string
          color: string | null
          created_at: string | null
          id: string
          is_archived: boolean | null
          position: number
          title: string
          updated_at: string | null
          wip_limit: number | null
        }
        Insert: {
          board_id: string
          color?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          position?: number
          title: string
          updated_at?: string | null
          wip_limit?: number | null
        }
        Update: {
          board_id?: string
          color?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          position?: number
          title?: string
          updated_at?: string | null
          wip_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lists_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sprints: {
        Row: {
          board_id: string
          created_at: string | null
          end_date: string | null
          goal: string | null
          id: string
          name: string
          start_date: string | null
          status: Database["public"]["Enums"]["sprint_status"] | null
        }
        Insert: {
          board_id: string
          created_at?: string | null
          end_date?: string | null
          goal?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["sprint_status"] | null
        }
        Update: {
          board_id?: string
          created_at?: string | null
          end_date?: string | null
          goal?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["sprint_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "sprints_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          structure: Json
          usage_count: number | null
          workspace_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          structure: Json
          usage_count?: number | null
          workspace_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          structure?: Json
          usage_count?: number | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          card_id: string
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          is_billable: boolean | null
          started_at: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          is_billable?: boolean | null
          started_at?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          is_billable?: boolean | null
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["workspace_member_role"] | null
          token: string
          workspace_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["workspace_member_role"] | null
          token?: string
          workspace_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["workspace_member_role"] | null
          token?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_invitations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["workspace_member_role"] | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["workspace_member_role"] | null
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["workspace_member_role"] | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          plan: Database["public"]["Enums"]["workspace_plan"] | null
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          plan?: Database["public"]["Enums"]["workspace_plan"] | null
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          plan?: Database["public"]["Enums"]["workspace_plan"] | null
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_board_creator: {
        Args: { _board_id: string; _user_id: string }
        Returns: boolean
      }
      is_board_member: {
        Args: { _board_id: string; _user_id: string }
        Returns: boolean
      }
      is_workspace_member: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      is_workspace_owner: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: boolean
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      automation_trigger_type:
        | "CARD_CREATED"
        | "CARD_MOVED_TO_LIST"
        | "CARD_MOVED_FROM_LIST"
        | "CARD_DUE_DATE_SET"
        | "CARD_DUE_DATE_PASSES"
        | "CARD_DUE_IN_N_DAYS"
        | "CHECKLIST_COMPLETED"
        | "LABEL_ADDED"
        | "LABEL_REMOVED"
        | "MEMBER_ASSIGNED"
        | "MEMBER_REMOVED"
        | "COMMENT_ADDED"
        | "CUSTOM_FIELD_CHANGED"
        | "CARD_ARCHIVED"
        | "SCHEDULE_DAILY"
        | "SCHEDULE_WEEKLY"
        | "DEPENDENCY_RESOLVED"
      background_type: "COLOR" | "IMAGE" | "GRADIENT"
      board_member_role: "ADMIN" | "MEMBER" | "OBSERVER"
      board_visibility: "WORKSPACE" | "PRIVATE" | "PUBLIC"
      card_priority: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      cover_type: "NONE" | "COLOR" | "IMAGE"
      custom_field_type:
        | "TEXT"
        | "NUMBER"
        | "DATE"
        | "DROPDOWN"
        | "CHECKBOX"
        | "URL"
        | "MEMBER"
        | "RATING"
      dependency_type:
        | "FINISH_TO_START"
        | "START_TO_START"
        | "FINISH_TO_FINISH"
        | "START_TO_FINISH"
      notification_type:
        | "CARD_ASSIGNED"
        | "CARD_DUE_SOON"
        | "CARD_OVERDUE"
        | "COMMENT_ADDED"
        | "MENTION"
        | "BOARD_INVITATION"
        | "CHECKLIST_COMPLETED"
        | "DEPENDENCY_UNBLOCKED"
        | "AUTOMATION_TRIGGERED"
        | "WEEKLY_DIGEST"
        | "SPRINT_STARTED"
        | "SPRINT_COMPLETED"
        | "MEMBER_ADDED"
      sprint_status: "PLANNED" | "ACTIVE" | "COMPLETED"
      workspace_member_role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST" | "CLIENT"
      workspace_plan: "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      automation_trigger_type: [
        "CARD_CREATED",
        "CARD_MOVED_TO_LIST",
        "CARD_MOVED_FROM_LIST",
        "CARD_DUE_DATE_SET",
        "CARD_DUE_DATE_PASSES",
        "CARD_DUE_IN_N_DAYS",
        "CHECKLIST_COMPLETED",
        "LABEL_ADDED",
        "LABEL_REMOVED",
        "MEMBER_ASSIGNED",
        "MEMBER_REMOVED",
        "COMMENT_ADDED",
        "CUSTOM_FIELD_CHANGED",
        "CARD_ARCHIVED",
        "SCHEDULE_DAILY",
        "SCHEDULE_WEEKLY",
        "DEPENDENCY_RESOLVED",
      ],
      background_type: ["COLOR", "IMAGE", "GRADIENT"],
      board_member_role: ["ADMIN", "MEMBER", "OBSERVER"],
      board_visibility: ["WORKSPACE", "PRIVATE", "PUBLIC"],
      card_priority: ["NONE", "LOW", "MEDIUM", "HIGH", "CRITICAL"],
      cover_type: ["NONE", "COLOR", "IMAGE"],
      custom_field_type: [
        "TEXT",
        "NUMBER",
        "DATE",
        "DROPDOWN",
        "CHECKBOX",
        "URL",
        "MEMBER",
        "RATING",
      ],
      dependency_type: [
        "FINISH_TO_START",
        "START_TO_START",
        "FINISH_TO_FINISH",
        "START_TO_FINISH",
      ],
      notification_type: [
        "CARD_ASSIGNED",
        "CARD_DUE_SOON",
        "CARD_OVERDUE",
        "COMMENT_ADDED",
        "MENTION",
        "BOARD_INVITATION",
        "CHECKLIST_COMPLETED",
        "DEPENDENCY_UNBLOCKED",
        "AUTOMATION_TRIGGERED",
        "WEEKLY_DIGEST",
        "SPRINT_STARTED",
        "SPRINT_COMPLETED",
        "MEMBER_ADDED",
      ],
      sprint_status: ["PLANNED", "ACTIVE", "COMPLETED"],
      workspace_member_role: ["OWNER", "ADMIN", "MEMBER", "GUEST", "CLIENT"],
      workspace_plan: ["FREE", "PRO", "BUSINESS", "ENTERPRISE"],
    },
  },
} as const
