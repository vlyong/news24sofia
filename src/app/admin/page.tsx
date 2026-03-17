"use client";

import { useState, useEffect } from "react";
import { Save, AlertTriangle, Layout, Megaphone, Search, ShieldCheck, ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white italic tracking-widest uppercase text-xs">Зареждане на Admin Nexus...</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 pb-32">
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
          <section className="lg:col-span-12 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-brand-red" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Извънредни Новини</h2>
              </div>
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

            <div className="space-y-8">
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
              </div>

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
                                className="w-full bg-transparent border-none text-sm focus:outline-none"
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
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-[10px]"
                            />
                        </div>
                        <div className="md:col-span-1 flex items-center justify-end">
                            <button onClick={() => {
                                const newItems = settings.breakingNewsItems.filter((_: any, i: number) => i !== index);
                                setSettings({ ...settings, breakingNewsItems: newItems });
                            }} className="text-white/20 hover:text-brand-red opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    </div>
                ))}
                <button 
                  onClick={() => setSettings({ ...settings, breakingNewsItems: [...settings.breakingNewsItems, { text: "", link: "" }] })}
                  className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-[10px] uppercase text-white/20 hover:text-white"
                >
                  + Добави Новини
                </button>
              </div>
            </div>
          </section>

          {/* Layout Manager Section */}
          <section className="lg:col-span-12 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Layout className="w-5 h-5 text-brand-red" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Подредба на Началната Страница</h2>
              </div>
              <button 
                onClick={() => {
                  const newWidget: any = { id: `widget-${Date.now()}`, type: 'category', title: 'Нова Секция', active: true, limit: 4 };
                  setSettings({ ...settings, homepageLayout: [...settings.homepageLayout, newWidget] });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase transition-all"
              >
                <Plus className="w-3 h-3" /> Добави Уиджет
              </button>
            </div>

            <div className="space-y-4">
              {settings.homepageLayout.map((widget: any, index: number) => (
                <div key={widget.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl group transition-all hover:border-white/20">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex md:flex-col gap-2 shrink-0">
                      <button disabled={index === 0} onClick={() => {
                        const newLayout = [...settings.homepageLayout];
                        [newLayout[index - 1], newLayout[index]] = [newLayout[index], newLayout[index - 1]];
                        setSettings({ ...settings, homepageLayout: newLayout });
                      }} className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20"><ChevronUp /></button>
                      <button disabled={index === settings.homepageLayout.length - 1} onClick={() => {
                        const newLayout = [...settings.homepageLayout];
                        [newLayout[index], newLayout[index + 1]] = [newLayout[index + 1], newLayout[index]];
                        setSettings({ ...settings, homepageLayout: newLayout });
                      }} className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20"><ChevronDown /></button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">Тип</label>
                        <select 
                          value={widget.type}
                          onChange={(e) => {
                            const newLayout = [...settings.homepageLayout];
                            newLayout[index].type = e.target.value;
                            setSettings({ ...settings, homepageLayout: newLayout });
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs"
                        >
                          <option value="hero">Hero (Водещи)</option>
                          <option value="category">Категория</option>
                          <option value="video">NEWS24 TV</option>
                          <option value="ad">Рекламен Банер</option>
                        </select>
                      </div>

                      {widget.type !== 'ad' && (
                        <div>
                          <label className="block text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">Заглавие</label>
                          <input 
                            value={widget.title || ""}
                            onChange={(e) => {
                              const newLayout = [...settings.homepageLayout];
                              newLayout[index].title = e.target.value;
                              setSettings({ ...settings, homepageLayout: newLayout });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs"
                          />
                        </div>
                      )}

                      {(widget.type === 'category' || widget.type === 'video') && (
                        <div>
                          <label className="block text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">Slug на Категория</label>
                          <input 
                            value={widget.categoryName || ""}
                            onChange={(e) => {
                              const newLayout = [...settings.homepageLayout];
                              newLayout[index].categoryName = e.target.value;
                              setSettings({ ...settings, homepageLayout: newLayout });
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest tracking-widest">Активен</label>
                          <input 
                            type="checkbox" 
                            checked={widget.active}
                            onChange={(e) => {
                              const newLayout = [...settings.homepageLayout];
                              newLayout[index].active = e.target.checked;
                              setSettings({ ...settings, homepageLayout: newLayout });
                            }}
                            className="w-5 h-5 accent-brand-red"
                          />
                        </div>
                        <button onClick={() => {
                          const newLayout = settings.homepageLayout.filter((_: any, i: number) => i !== index);
                          setSettings({ ...settings, homepageLayout: newLayout });
                        }} className="text-white/20 hover:text-brand-red"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ad Management Subsection */}
          <section className="lg:col-span-12 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-brand-red" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Глобални Рекламни Настройки</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Горен банер", key: "showTopBanner" },
                { label: "Страничен банер", key: "showArticleSidebar" },
                { label: "Вътре в статиите", key: "showInArticle" }
              ].map((ad) => (
                <div key={ad.key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-sm font-bold">{ad.label}</span>
                  <input 
                    type="checkbox" 
                    checked={settings.ads[ad.key]}
                    onChange={(e) => setSettings({ ...settings, ads: { ...settings.ads, [ad.key]: e.target.checked } })}
                    className="w-5 h-5 accent-brand-red"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* SEO Overrides Section */}
          <section className="lg:col-span-12 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-5 h-5 text-brand-red" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Ръчни SEO Настройки</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <input id="new-slug" placeholder="Slug..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                    <input id="new-title" placeholder="Title..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
                    <textarea id="new-desc" placeholder="Desc..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm h-24" />
                    <button onClick={() => {
                        const s = (document.getElementById('new-slug') as HTMLInputElement).value;
                        const t = (document.getElementById('new-title') as HTMLInputElement).value;
                        const d = (document.getElementById('new-desc') as HTMLInputElement).value;
                        if (s) setSettings({ ...settings, seoOverrides: { ...settings.seoOverrides, [s]: { title: t, description: d } } });
                    }} className="w-full py-3 bg-white/10 rounded-xl uppercase font-bold text-xs tracking-widest">Добави</button>
                </div>
                <div className="max-h-[400px] overflow-y-auto space-y-3">
                    {Object.entries(settings.seoOverrides).map(([slug, data]: [string, any]) => (
                        <div key={slug} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between">
                            <div>
                                <div className="text-brand-red text-xs font-bold">{slug}</div>
                                <div className="text-sm font-bold">{data.title}</div>
                            </div>
                            <button onClick={() => {
                                const o = { ...settings.seoOverrides };
                                delete o[slug];
                                setSettings({ ...settings, seoOverrides: o });
                            }} className="text-white/20 hover:text-brand-red shrink-0"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
