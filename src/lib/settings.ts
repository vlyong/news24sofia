import { supabase } from './supabase';

export interface BreakingNewsItem {
  text: string;
  link?: string;
}

export interface SiteSettings {
  breakingNewsItems: BreakingNewsItem[];
  isBreakingNewsActive: boolean;
  tickerConfig: {
    iconType: 'pulse' | 'flash' | 'spin' | 'wave' | 'none';
    showIcon: boolean;
  };
  seoOverrides: Record<string, {
    title?: string;
    description?: string;
  }>;
  ads: {
    showTopBanner: boolean;
    showArticleSidebar: boolean;
    showInArticle: boolean;
  };
}

const defaultSettings: SiteSettings = {
  breakingNewsItems: [
    { text: "Добре дошли в новия портал на News24Sofia!" }
  ],
  isBreakingNewsActive: true,
  tickerConfig: {
    iconType: 'pulse',
    showIcon: true,
  },
  seoOverrides: {},
  ads: {
    showTopBanner: true,
    showArticleSidebar: true,
    showInArticle: true,
  }
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('data')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.warn('Settings not found in DB, using defaults. Error:', error);
      return defaultSettings;
    }

    const loaded = data.data;
    
    // Migration & Defaults merging
    const settings = { ...defaultSettings, ...loaded };
    
    // Ensure nested objects preserve defaults
    settings.tickerConfig = { ...defaultSettings.tickerConfig, ...(loaded.tickerConfig || {}) };
    settings.ads = { ...defaultSettings.ads, ...(loaded.ads || {}) };

    return settings;
  } catch (error) {
    console.error('Error reading settings from Supabase:', error);
    return defaultSettings;
  }
}

export async function saveSettings(settings: SiteSettings) {
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, data: settings, updated_at: new Date().toISOString() });

    if (error) {
      console.error('Supabase save error details:', JSON.stringify(error, null, 2));
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error saving settings to Supabase:', error);
    return false;
  }
}
