import React, { useState, useEffect } from 'react';
import { db, ADMIN_EMAIL } from './app.js';
import { ref, set, get, push, remove, onChildAdded } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { generate21DigitKey } from './mod.js';
import channelData from './tvemcukggmail.json';

export function App() {
    const [path, setPath] = useState(window.location.pathname);
    const [user, setUser] = useState(null);
    const [emailInput, setEmailInput] = useState("");
    const [keyInput, setKeyInput] = useState("");
    const [step, setStep] = useState(1); // 1: E-posta gir, 2: 21 haneli anahtarı gir
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const handlePopState = () => setPath(window.location.pathname);
        window.addEventListener('popstate', handlePopState);

        const savedUser = localStorage.getItem('emcuk_user');
        if (savedUser) setUser(JSON.parse(savedUser));

        if (window.location.pathname === '/chat') {
            const msgRef = ref(db, 'chat_messages');
            onChildAdded(msgRef, (snapshot) => {
                setMessages(prev => [...prev, { id: snapshot.key, ...snapshot.val() }]);
            });
        }

        return () => window.removeEventListener('popstate', handlePopState);
    }, [path]);

    const navigate = (url) => {
        window.history.pushState({}, '', url);
        setPath(url);
    };

    // 1. Adım: E-posta ile 21 haneli anahtar talep etme
    const handleRequestKey = async (e) => {
        e.preventDefault();
        if (!emailInput.trim()) return;

        const generatedKey = generate21DigitKey();

        // Veritabanına anahtarı kaydet
        const keyRef = ref(db, `auth_keys/${emailInput.replace(/[.#$\/\[\]]/g, '_')}`);
        await set(keyRef, { key: generatedKey, time: Date.now() });

        alert(`[Doğrulama] ${emailInput} adresine 21 haneli anahtar oluşturuldu!\n\n(Test için anahtarınız): ${generatedKey}`);
        setStep(2);
    };

    // 2. Adım: 21 haneli anahtarı girerek doğrula ve giriş yap
    const handleVerifyKey = async (e) => {
        e.preventDefault();
        const keyRef = ref(db, `auth_keys/${emailInput.replace(/[.#$\/\[\]]/g, '_')}`);
        const snap = await get(keyRef);

        if (snap.exists() && snap.val().key === keyInput.trim()) {
            const userData = { email: emailInput, name: emailInput.split('@')[0] };
            setUser(userData);
            localStorage.setItem('emcuk_user', JSON.stringify(userData));
            alert("Giriş başarılı! Hoş geldin kankam 💘");
        } else {
            alert("Hatalı veya süresi dolmuş 21 haneli anahtar!");
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('emcuk_user');
        setStep(1);
        setEmailInput("");
        setKeyInput("");
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const msgRef = ref(db, 'chat_messages');
        await push(msgRef, {
            name: user.name,
            email: user.email,
            text: newMessage,
            timestamp: Date.now()
        });
        setNewMessage("");
    };

    const deleteMsg = async (id) => {
        if (user?.email !== ADMIN_EMAIL) {
            alert("Bu işlem için yetkiniz yok!");
            return;
        }
        await remove(ref(db, `chat_messages/${id}`));
        setMessages(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="glass-card m-4 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="ytlogo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover border border-indigo-500/30" />
                    <span className="font-bold text-lg tracking-wide text-white">Emcuk YTB</span>
                </div>
                <nav className="flex gap-6 text-sm font-medium items-center">
                    <button onClick={() => navigate('/')} className="hover:text-indigo-400 transition">Ana Sayfa</button>
                    <button onClick={() => navigate('/hakkinda')} className="hover:text-indigo-400 transition">Hakkında & Bilgiler</button>
                    <button onClick={() => navigate('/chat')} className="hover:text-indigo-400 transition">Canlı Chat</button>
                </nav>
            </header>

            <main className="flex-1">
                {(path === '/' || path === '') && (
                    <div className="p-8 max-w-6xl mx-auto">
                        <div className="glass-card p-8 mb-8 text-center relative overflow-hidden">
                            <h1 className="text-3xl font-extrabold text-pink-400 mb-2">VİCTOR REİS DERLER 😇</h1>
                            <p className="text-xl text-indigo-300 mb-4">Ne Bakıyon 🥰 ABONE OLSANA KANKAM 💘💘</p>
                            <div className="flex justify-center gap-6 text-sm text-slate-300">
                                <span>👥 {channelData.subscribers} Abone</span>
                                <span>🎬 {channelData.totalVideos} Video</span>
                                <span className="text-emerald-400">🔴 Her Akşam Canlı Yayın</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6 glass-card p-6">
                            <div className="flex items-center gap-4">
                                <img src="canliyayinyazisi.png" alt="Canlı Durum" className="h-10 animate-pulse" />
                                <div>
                                    <h2 className="text-xl font-bold text-indigo-400">Emcük YTB Canlı Yayın Akışı</h2>
                                    <p className="text-slate-400 text-sm">
                                        <a href="https://www.youtube.com/@Emc%C3%BCkYTB/" target="_blank" rel="noreferrer" className="text-pink-400 underline">
                                            @EmcükYTB
                                        </a> resmi kanalından anlık WOW yayınları!
                                    </p>
                                </div>
                            </div>
                            <a href="https://www.youtube.com/@Emc%C3%BCkYTB/streams" target="_blank" rel="noreferrer" className="btn-primary text-sm">
                                🔴 Canlı Yayına Git
                            </a>
                        </div>
                    </div>
                )}

                {path === '/hakkinda' && (
                    <div className="p-8 max-w-3xl mx-auto glass-card mt-6 space-y-6">
                        <h2 className="text-2xl font-bold text-indigo-400">💖 Kankilerim Sayfamıza Hepiniz Hoşgeldiniz</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Selamlar Kankilerim İsmim Hakan 38 Yaşındayım Her Akşam Canlı Yayında Sizlerle Birlikte WOW Oynuyoruz. Kanalımda Ki Videolarımın %60'ı Eski Akımlar Olup Şahsıma Ait Olmayanları Sabitlediğim Yorumda Belirttim. Video Sahibi Olan Arkadaşlarım Kanıtı Olduğu Takdirde Videoları Bana Ulaşarak Kaldırma Talebinde Bulunabilir 💘
                        </p>
                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-sm">
                            <p>🤝 <b>Katıl Aboneleri:</b> Oyundan Ekliyorum 👍</p>
                            <p>💻 <b>Kullandığım Cihaz:</b> {channelData.device}</p>
                            <p>⚡ <b>FPS:</b> {channelData.fps} 😇</p>
                            <p>📩 <b>Reklam ve İşbirliği İçin:</b> <a href={`mailto:${channelData.adminEmail}`} className="text-pink-400 underline">{channelData.adminEmail}</a></p>
                        </div>
                        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-xs text-red-300 leading-relaxed">
                            Her Akşam Açtığım Canlı Yayınların Ekran Kaydını Almaktayım, Canlı Yayınımda Şahsıma Edilen KÜFÜR /ARGO Kelimelerin Gerekli Kaydını Alarak, Küfür Edenler Hakkında CUMHURİYET SAVCILIĞINA SUÇ DUYURUSUNDA Bulunduğumu Lütfen Unutmayin 👮 <br/><br/>
                            <b>SAYGIDA MECBUR SEVGİDE ÖZGÜRSÜNÜZ 💝</b>
                        </div>
                        <img src="victorkomik.png" alt="Victor" className="rounded-xl w-full object-cover max-h-60" />
                    </div>
                )}

                {path === '/chat' && (
                    <div className="p-6 max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Topluluk Sohbet Odası</h2>
                            {user && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-300">Giriş Yapıldı: {user.email}</span>
                                    <button onClick={handleLogout} className="text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg">Çıkış</button>
                                </div>
                            )}
                        </div>

                        {!user ? (
                            <div className="glass-card p-8 max-w-md mx-auto text-center space-y-4">
                                <h3 className="font-bold text-lg text-indigo-400">E-posta ile 21 Haneli Doğrulama</h3>
                                {step === 1 ? (
                                    <form onSubmit={handleRequestKey} className="space-y-3">
                                        <input 
                                            type="email" 
                                            value={emailInput} 
                                            onChange={(e) => setEmailInput(e.target.value)} 
                                            placeholder="E-posta adresiniz..." 
                                            required
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                                        />
                                        <button type="submit" className="btn-primary w-full">21 Haneli Kod Gönder</button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyKey} className="space-y-3">
                                        <p className="text-xs text-slate-400">E-postanıza gönderilen 21 haneli anahtarı girin:</p>
                                        <input 
                                            type="text" 
                                            value={keyInput} 
                                            onChange={(e) => setKeyInput(e.target.value)} 
                                            placeholder="21 haneli anahtar..." 
                                            required
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono text-center tracking-wider"
                                        />
                                        <button type="submit" className="btn-primary w-full">Doğrula ve Giriş Yap</button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className="glass-card h-[550px] flex flex-col justify-between p-4">
                                <div className="overflow-y-auto flex-1 space-y-3 pr-2 border-b border-slate-800 pb-4">
                                    {messages.map(m => (
                                        <div key={m.id} className="flex justify-between items-start bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                                            <div>
                                                <span className="font-bold text-xs text-indigo-400">{m.name}</span>
                                                <p className="text-sm text-slate-200 mt-1">{m.text}</p>
                                            </div>
                                            {user.email === ADMIN_EMAIL && (
                                                <button onClick={() => deleteMsg(m.id)} className="text-[10px] bg-red-500/20 text-red-300 px-2 py-1 rounded">Sil</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={sendMessage} className="mt-4 flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newMessage} 
                                        onChange={(e) => setNewMessage(e.target.value)} 
                                        placeholder="Mesajınızı yazın kankam..." 
                                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
                                    />
                                    <button type="submit" className="btn-primary text-sm">Gönder</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
