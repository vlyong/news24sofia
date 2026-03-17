"use client";

import { useState, useEffect } from "react";
import { Save, AlertTriangle, Layout, Megaphone, Search, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setMessage("Настройките са запазени успешно!");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Зареждане на админ панел...</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-red rounded-2xl shadow-lg shadow-brand-red/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Admin <span className="text-brand-red">Nexus</span></h1>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Контролен панел на News24Sofia</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-brand-red/80 transition-all shadow-xl shadow-brand-red/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Запазване..." : "Запази промените"}
          </button>
        </div>

        {message && (
          <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 font-bold text-center animate-pulse">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Breaking News Section */}
          <section className="lg:col-span-8 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-brand-red" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Извънредни Новини</h2>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                    <input 
                      type="checkbox" 
                      checked={settings.isBreakingNewsActive}
                      onChange={(e) => setSettings({ ...settings, isBreakingNewsActive: e.target.checked })}
                      className="w-4 h-4 accent-brand-red"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Активна лента</span>
                 </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Icon Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Анимирана Икона</label>
                    <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={settings.tickerConfig.showIcon}
                          onChange={(e) => setSettings({ 
                            ...settings, 
                            tickerConfig: { ...settings.tickerConfig, showIcon: e.target.checked }
                          })}
                          className="w-5 h-5 accent-brand-red"
                        />
                        <select 
                            value={settings.tickerConfig.iconType}
                            onChange={(e) => setSettings({ 
                                ...settings, 
                                tickerConfig: { ...settings.tickerConfig, iconType: e.target.value }
                            })}
                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        >
                            <option value="pulse">Пулсираща точка</option>
                            <option value="flash">Светкавица</option>
                            <option value="spin">Въртяща се икона</option>
                            <option value="wave">Вълна (Wave)</option>
                        </select>
                    </div>
                 </div>
                 <div className="flex items-center justify-center border-l border-white/5">
                    <div className="bg-brand-red/10 px-4 py-2 rounded-full border border-brand-red/20 flex items-center gap-2">
                        {settings.tickerConfig.showIcon && (
                            <div className={`
                                bg-brand-red
                                ${settings.tickerConfig.iconType === 'pulse' ? 'w-2 h-2 rounded-full animate-pulse' : ''}
                                ${settings.tickerConfig.iconType === 'flash' ? 'w-2 h-2 rounded-full animate-ping' : ''}
                                ${settings.tickerConfig.iconType === 'spin' ? 'w-3 h-3 rounded-sm animate-spin' : ''}
                                ${settings.tickerConfig.iconType === 'wave' ? 'w-2 h-2 rounded-full animate-custom-wave' : ''}
                            `} />
                        )}
                        <span className="text-xs font-bold text-brand-red uppercase">Предварителен преглед</span>
                    </div>
                 </div>
              </div>

              {/* News Items List */}
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Списък с новини (въртящи се)</label>
                
                <div className="space-y-3">
                    {settings.breakingNewsItems.map((item: any, index: number) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl group">
                            <div className="md:col-span-7">
                                <input 
                                    value={item.text}
                                    onChange={(e) => {
                                        const newItems = [...settings.breakingNewsItems];
                                        newItems[index].text = e.target.value;
                                        setSettings({ ...settings, breakingNewsItems: newItems });
                                    }}
                                    placeholder="Текст на новината..."
                                    className="w-full bg-transparent border-none text-sm focus:outline-none placeholder:text-white/20"
                                />
                            </div>
                            <div className="md:col-span-4">
                                <input 
                                    value={item.link || ""}
                                    onChange={(e) => {
                                        const newItems = [...settings.breakingNewsItems];
                                        newItems[index].link = e.target.value;
                                        setSettings({ ...settings, breakingNewsItems: newItems });
                                    }}
                                    placeholder="Линк (незадължително)..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] focus:outline-none"
                                />
                            </div>
                            <div className="md:col-span-1 flex items-center justify-end">
                                <button 
                                    onClick={() => {
                                        const newItems = settings.breakingNewsItems.filter((_: any, i: number) => i !== index);
                                        setSettings({ ...settings, breakingNewsItems: newItems });
                                    }}
                                    className="text-white/20 hover:text-brand-red opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => setSettings({ 
                        ...settings, 
                        breakingNewsItems: [...settings.breakingNewsItems, { text: "", link: "" }]
                    })}
                    className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:bg-white/5 hover:text-white/40 transition-all"
                >
                    + Добави нова новина в лентата
                </button>
              </div>
            </div>
          </section>

          {/* Ad Management Subsection */}
          <section className="lg:col-span-4 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <Layout className="w-5 h-5 text-brand-red" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Рекламни Зони</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Горен банер", key: "showTopBanner" },
                { label: "Страничен банер", key: "showArticleSidebar" },
                { label: "Вътре в статиите", key: "showInArticle" }
              ].map((ad) => (
                <div key={ad.key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">{ad.label}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={(settings.ads as any)[ad.key]}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        ads: { ...settings.ads, [ad.key]: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SEO Overrides Section */}
          <section className="lg:col-span-12 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-5 h-5 text-brand-red" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Ръчни SEO Настройки (Overrides)</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form to add override */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-4">Добави нов оувъррайд</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-1 ml-1">URL Слъг (Slug)</label>
                            <input 
                                type="text" 
                                id="new-slug"
                                placeholder="напр. golyama-novina-v-sofia"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-red/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-1 ml-1">SEO Заглавие</label>
                            <input 
                                type="text" 
                                id="new-title"
                                placeholder="Ръчно заглавие..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-red/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-1 ml-1">SEO Описание</label>
                            <textarea 
                                id="new-desc"
                                placeholder="Ръчно описание..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-red/50 h-24"
                            />
                        </div>
                        <button 
                            onClick={() => {
                                const slug = (document.getElementById('new-slug') as HTMLInputElement).value;
                                const title = (document.getElementById('new-title') as HTMLInputElement).value;
                                const desc = (document.getElementById('new-desc') as HTMLInputElement).value;
                                if (slug) {
                                    setSettings({
                                        ...settings,
                                        seoOverrides: {
                                            ...settings.seoOverrides,
                                            [slug]: { title, description: desc }
                                        }
                                    });
                                    (document.getElementById('new-slug') as HTMLInputElement).value = "";
                                    (document.getElementById('new-title') as HTMLInputElement).value = "";
                                    (document.getElementById('new-desc') as HTMLInputElement).value = "";
                                }
                            }}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10 uppercase text-xs tracking-widest"
                        >
                            Добави в списъка
                        </button>
                    </div>
                </div>

                {/* List of existing overrides */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-4">Текущи оувъррайди ({Object.keys(settings.seoOverrides).length})</h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {Object.entries(settings.seoOverrides).length === 0 ? (
                            <div className="text-center py-12 text-white/20 italic text-sm">Няма активни оувъррайди</div>
                        ) : (
                            Object.entries(settings.seoOverrides).map(([slug, data]: [string, any]) => (
                                <div key={slug} className="p-4 bg-white/5 border border-white/5 rounded-2xl group relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-brand-red font-mono text-xs font-bold">{slug}</span>
                                        <button 
                                            onClick={() => {
                                                const newOverrides = { ...settings.seoOverrides };
                                                delete newOverrides[slug];
                                                setSettings({ ...settings, seoOverrides: newOverrides });
                                            }}
                                            className="text-white/20 hover:text-brand-red transition-colors"
                                        >
                                            Изтрий
                                        </button>
                                    </div>
                                    <h4 className="text-sm font-bold truncate">{data.title || "Няма заглавие"}</h4>
                                    <p className="text-xs text-white/40 line-clamp-2 mt-1">{data.description || "Няма описание"}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
          </section>

          {/* Google Indexing API Section */}
          <section className="lg:col-span-12 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#4285F4]/20 rounded-lg">
                <div className="w-4 h-4 bg-[#4285F4] rounded-sm" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight">Google Indexing API</h2>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-6 max-w-2xl">
                    Използвайте този инструмент, за да уведомите Google мигновено за нова или обновена статия. 
                    Това гарантира по-бързото й появяване в Google News.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                    <input 
                        type="url" 
                        id="index-url"
                        placeholder="https://news24sofia.eu/vashata-novina"
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4285F4]/50"
                    />
                    <button 
                        onClick={async () => {
                            const urlInput = document.getElementById('index-url') as HTMLInputElement;
                            const url = urlInput.value;
                            if (!url) return;
                            
                            setMessage("Изпращане на заявка към Google...");
                            try {
                                const res = await fetch("/api/admin/index-url", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ url })
                                });
                                const result = await res.json();
                                if (result.success) {
                                    setMessage("Успех: Google е уведомен за този адрес!");
                                    urlInput.value = "";
                                } else {
                                    setMessage("Грешка при индексиране. Проверете конзолата.");
                                }
                            } catch (e) {
                                setMessage("Критична грешка при връзка с API.");
                            }
                            setTimeout(() => setMessage(""), 5000);
                        }}
                        className="px-8 py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#4285F4]/20 uppercase text-xs tracking-widest"
                    >
                        Индексирай сегa
                    </button>
                </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
