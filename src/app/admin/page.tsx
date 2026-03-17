"use client";

import { useState, useEffect } from "react";
import { Save, AlertTriangle, Layout, Megaphone, Search, ShieldCheck, ChevronUp, ChevronDown, Trash2, Plus, Columns, Settings2 } from "lucide-react";

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

  // Рекурсивно рендиране на контролите за уиджет
  const renderWidgetEditor = (widget: any, onUpdate: (newData: any) => void, onDelete: () => void, onMove?: (dir: 'up' | 'down') => void, isFirst?: boolean, isLast?: boolean) => {
    return (
        <div className={`p-5 bg-white/5 border ${widget.type === 'row' ? 'border-brand-red/30 bg-brand-red/5' : 'border-white/5'} rounded-2xl group transition-all`}>
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                        {onMove && (
                            <div className="flex gap-1">
                                <button disabled={isFirst} onClick={() => onMove('up')} className="p-1 hover:bg-white/10 rounded disabled:opacity-10"><ChevronUp className="w-3 h-3"/></button>
                                <button disabled={isLast} onClick={() => onMove('down')} className="p-1 hover:bg-white/10 rounded disabled:opacity-10"><ChevronDown className="w-3 h-3"/></button>
                            </div>
                        )}
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-red flex items-center gap-2">
                           {widget.type === 'row' ? <Columns className="w-3 h-3"/> : <Settings2 className="w-3 h-3"/>}
                           {widget.type}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            checked={widget.active}
                            onChange={(e) => onUpdate({ ...widget, active: e.target.checked })}
                            className="w-3 h-3 accent-brand-red"
                        />
                        <button onClick={onDelete} className="text-white/20 hover:text-brand-red"><Trash2 className="w-3 h-3" /></button>
                    </div>
                </div>

                {/* Content */}
                {widget.type === 'row' ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {widget.columns?.map((col: any, colIdx: number) => (
                                <div key={col.id} className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <select 
                                            value={col.width}
                                            onChange={(e) => {
                                                const newCols = [...widget.columns];
                                                newCols[colIdx].width = e.target.value;
                                                onUpdate({ ...widget, columns: newCols });
                                            }}
                                            className="bg-black/40 border border-white/5 rounded px-2 py-1 text-[8px] uppercase font-bold"
                                        >
                                            <option value="12">100%</option>
                                            <option value="8">66%</option>
                                            <option value="6">50%</option>
                                            <option value="4">33%</option>
                                        </select>
                                        <button 
                                            onClick={() => {
                                                const newChild = { id: `child-${Date.now()}`, type: 'category', title: 'Нов', active: true, limit: 4 };
                                                const newCols = [...widget.columns];
                                                newCols[colIdx].widgets.push(newChild);
                                                onUpdate({ ...widget, columns: newCols });
                                            }}
                                            className="text-[8px] font-bold uppercase text-brand-red"
                                        >
                                            + Уиджет
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {col.widgets?.map((child: any, childIdx: number) => (
                                            renderWidgetEditor(
                                                child, 
                                                (newData) => {
                                                    const newCols = [...widget.columns];
                                                    newCols[colIdx].widgets[childIdx] = newData;
                                                    onUpdate({ ...widget, columns: newCols });
                                                },
                                                () => {
                                                    const newCols = [...widget.columns];
                                                    newCols[colIdx].widgets = newCols[colIdx].widgets.filter((_: any, i: number) => i !== childIdx);
                                                    onUpdate({ ...widget, columns: newCols });
                                                },
                                                (dir) => {
                                                    const newCols = [...widget.columns];
                                                    const list = [...newCols[colIdx].widgets];
                                                    if (dir === 'up') [list[childIdx-1], list[childIdx]] = [list[childIdx], list[childIdx-1]];
                                                    else [list[childIdx], list[childIdx+1]] = [list[childIdx+1], list[childIdx]];
                                                    newCols[colIdx].widgets = list;
                                                    onUpdate({ ...widget, columns: newCols });
                                                },
                                                childIdx === 0,
                                                childIdx === col.widgets.length - 1
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         <div>
                            <label className="block text-[8px] font-black uppercase text-white/30 mb-1">Тип</label>
                            <select 
                                value={widget.type}
                                onChange={(e) => onUpdate({ ...widget, type: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[10px]"
                            >
                                <option value="hero">Hero</option>
                                <option value="category">Category</option>
                                <option value="video">TV</option>
                                <option value="ad">Ad</option>
                            </select>
                        </div>
                        {widget.type !== 'ad' && (
                            <div>
                                <label className="block text-[8px] font-black uppercase text-white/30 mb-1">Заглавие</label>
                                <input 
                                    value={widget.title || ""}
                                    onChange={(e) => onUpdate({ ...widget, title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[10px]"
                                />
                            </div>
                        )}
                        {(widget.type === 'category' || widget.type === 'video') && (
                            <div>
                                <label className="block text-[8px] font-black uppercase text-white/30 mb-1">Slug</label>
                                <input 
                                    value={widget.categoryName || ""}
                                    onChange={(e) => onUpdate({ ...widget, categoryName: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[10px]"
                                />
                            </div>
                        )}
                        {widget.type === 'ad' && (
                            <div>
                                <label className="block text-[8px] font-black uppercase text-white/30 mb-1">Slot ID</label>
                                <input 
                                    value={widget.adSlot || ""}
                                    onChange={(e) => onUpdate({ ...widget, adSlot: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[10px]"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
  };

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
                              placeholder="Заглавие на новината..."
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
                              placeholder="Линк (незадължително)..."
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
                className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-[10px] uppercase text-white/20 hover:text-white transition-colors"
                >
                + Добави Новини
              </button>
            </div>
          </section>

          {/* Layout Manager Section */}
          <section className="lg:col-span-12 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Layout className="w-5 h-5 text-brand-red" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Подредба на Началната Страница (Elementor-Style)</h2>
              </div>
              <div className="flex gap-3">
                <button 
                    onClick={() => {
                        const newRow = { id: `row-${Date.now()}`, type: 'row', active: true, columns: [
                            { id: `col1-${Date.now()}`, width: '8', widgets: [] },
                            { id: `col2-${Date.now()}`, width: '4', widgets: [] }
                        ] };
                        setSettings({ ...settings, homepageLayout: [...settings.homepageLayout, newRow] });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-red rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-brand-red/20"
                >
                    <Columns className="w-3 h-3" /> Нов Контейнер (Row)
                </button>
                <button 
                    onClick={() => {
                        const newWidget = { id: `widget-${Date.now()}`, type: 'category', title: 'Нова Секция', active: true, limit: 4 };
                        setSettings({ ...settings, homepageLayout: [...settings.homepageLayout, newWidget] });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase transition-all"
                >
                    <Plus className="w-3 h-3" /> Уиджет
                </button>
              </div>
            </div>

            <div className="space-y-6">
                {settings.homepageLayout.map((widget: any, index: number) => (
                    <div key={widget.id}>
                        {renderWidgetEditor(
                            widget,
                            (newData) => {
                                const newLayout = [...settings.homepageLayout];
                                newLayout[index] = newData;
                                setSettings({ ...settings, homepageLayout: newLayout });
                            },
                            () => {
                                const newLayout = settings.homepageLayout.filter((_: any, i: number) => i !== index);
                                setSettings({ ...settings, homepageLayout: newLayout });
                            },
                            (dir) => {
                                const newLayout = [...settings.homepageLayout];
                                if (dir === 'up') [newLayout[index-1], newLayout[index]] = [newLayout[index], newLayout[index-1]];
                                else [newLayout[index], newLayout[index+1]] = [newLayout[index+1], newLayout[index]];
                                setSettings({ ...settings, homepageLayout: newLayout });
                            },
                            index === 0,
                            index === settings.homepageLayout.length - 1
                        )}
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

        </div>
      </div>
    </main>
  );
}
