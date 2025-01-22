import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient('https://btziaizavcacammrehcr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0emlhaXphdmNhY2FtbXJlaGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MzQxNDIsImV4cCI6MjA1MjIxMDE0Mn0.7niwTucQ_c86mLdwkpqbYQl5xfTbTGkzftUmWlOymTQ');
  }

  async uploadImage(file: File): Promise<string> {
    const { data, error } = await this.supabase.storage.from('images').upload(`public/${file.name}`, file);
    if (error) {
      throw error;
    }
    return this.supabase.storage.from('images').getPublicUrl(data.path).data.publicUrl;
  }

  get client() {
    return this.supabase;
  }

  
}