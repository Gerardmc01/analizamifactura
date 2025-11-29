console.log("App.jsx loaded v3");
const { useState, useEffect, useRef } = React;

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyCaapQb2XuXy3sWEvHir5tQvb_aEgV1wnE",
    authDomain: "frigolens-b7d38.firebaseapp.com",
    projectId: "frigolens-b7d38",
    storageBucket: "frigolens-b7d38.firebasestorage.app",
    messagingSenderId: "406104892986",
    appId: "1:406104892986:web:cd2e4d58078e246a177703",
    measurementId: "G-YXTHMZ82Z4"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// --- COMPONENTS ---

const UserMenu = ({ user, onLogin, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <div className="relative" ref={menuRef}>
            {user ? (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition p-2 rounded-full bg-slate-800/50 border border-slate-700"
                >
                    <img src={user.photoURL || 'https://via.placeholder.com/24'} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
                    <span className="hidden md:inline font-medium">{user.displayName || user.email.split('@')[0]}</span>
                    <i data-lucide="chevron-down" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
                </button>
            ) : (
                <button
                    onClick={onLogin}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-full text-sm font-bold transition shadow-lg shadow-white/10"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G" />
                    Entrar
                </button>
            )}

            {isOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-700/50 mb-2">
                        <div className="text-sm font-bold text-white">{user.displayName}</div>
                        <div className="text-xs text-slate-400 truncate">{user.email}</div>
                    </div>
                    <button
                        onClick={() => { onLogout(); setIsOpen(false); }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                        <i data-lucide="log-out" className="w-4 h-4"></i>
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
};

const Navbar = ({ onNavigate, user, onLogin, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [isMenuOpen, user]);

    return (
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('landing')}>
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition duration-300 shadow-lg shadow-blue-500/20">
                        <i data-lucide="zap" className="w-5 h-5 text-white"></i>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        AnalizaMiFactura
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <button onClick={() => onNavigate('landing')} className="text-sm font-medium text-slate-400 hover:text-white transition">Inicio</button>
                    {user && (
                        <button onClick={() => onNavigate('dashboard')} className="text-sm font-medium text-slate-400 hover:text-white transition">
                            Mi Panel
                        </button>
                    )}
                    <UserMenu user={user} onLogin={onLogin} onLogout={onLogout} />
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <i data-lucide={isMenuOpen ? "x" : "menu"} className="w-6 h-6"></i>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 flex flex-col gap-4 animate-fade-in shadow-2xl">
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                                <img src={user.photoURL} className="w-10 h-10 rounded-full" />
                                <div>
                                    <div className="font-bold">{user.displayName}</div>
                                    <div className="text-xs text-slate-400">{user.email}</div>
                                </div>
                            </div>
                            <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl">
                                <i data-lucide="layout-dashboard" className="w-5 h-5"></i> Mi Panel
                            </button>
                            <button onClick={onLogout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl">
                                <i data-lucide="log-out" className="w-5 h-5"></i> Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <button onClick={() => { onLogin(); setIsMenuOpen(false); }} className="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl justify-center font-bold">
                            <i data-lucide="log-in" className="w-5 h-5"></i> Entrar con Google
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

const BarChart = ({ data }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current && data) {
            if (chartRef.current) chartRef.current.destroy();
            const ctx = canvasRef.current.getContext('2d');
            chartRef.current = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#94a3b8' } },
                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [data]);

    return <canvas ref={canvasRef}></canvas>;
};

const Dashboard = ({ history, onUpload, onViewBill, user }) => {
    const totalGastado = history.reduce((acc, f) => acc + (f.importe_total || 0), 0);
    const totalKwh = history.reduce((acc, f) => acc + (f.consumo_kwh || 0), 0);
    const precioMedio = totalKwh > 0 ? (totalGastado / totalKwh).toFixed(3) : '0.000';

    const chartData = {
        labels: history.slice(0, 6).reverse().map(f => f.billing_period ? f.billing_period.split('-')[0].trim() : new Date(f.created_at).toLocaleDateString('es-ES', { month: 'short' })),
        datasets: [{
            label: 'Gasto (€)',
            data: history.slice(0, 6).reverse().map(f => f.importe_total),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderRadius: 6
        }]
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Hola, {user.displayName.split(' ')[0]} 👋</h1>
                    <p className="text-slate-400">Aquí tienes el control de tu energía.</p>
                </div>
                <button onClick={onUpload} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition transform hover:scale-105">
                    <i data-lucide="plus" className="w-5 h-5"></i> Subir Factura
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-panel p-5 rounded-2xl border-l-4 border-blue-500">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Gasto Total</div>
                    <div className="text-2xl font-bold">{totalGastado.toFixed(2)}€</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border-l-4 border-purple-500">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Energía</div>
                    <div className="text-2xl font-bold">{totalKwh} kWh</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border-l-4 border-yellow-500">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Precio Medio</div>
                    <div className="text-2xl font-bold">{precioMedio} €/kWh</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border-l-4 border-green-500">
                    <div className="text-slate-400 text-xs uppercase font-bold mb-1">Facturas</div>
                    <div className="text-2xl font-bold">{history.length}</div>
                </div>
            </div>

            {history.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <i data-lucide="bar-chart-3" className="w-5 h-5 text-blue-400"></i> Evolución de Gasto
                        </h3>
                        <div className="h-64 w-full"><BarChart data={chartData} /></div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4">Historial Reciente</h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {history.map((f, i) => (
                                <div key={i} onClick={() => onViewBill(f)} className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 cursor-pointer transition flex justify-between items-center group">
                                    <div>
                                        <div className="font-bold text-sm">{f.billing_period || new Date(f.created_at).toLocaleDateString()}</div>
                                        <div className="text-xs text-slate-400">{f.consumo_kwh} kWh</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-blue-400">{f.importe_total}€</div>
                                        <i data-lucide="chevron-right" className="w-4 h-4 text-slate-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-panel p-12 rounded-2xl text-center border-2 border-dashed border-slate-700">
                    <div className="bg-slate-800 inline-block p-4 rounded-full mb-4">
                        <i data-lucide="upload-cloud" className="w-8 h-8 text-slate-400"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Tu panel está vacío</h3>
                    <p className="text-slate-400 mb-6">Sube tu primera factura para empezar a controlar tu gasto.</p>
                    <button onClick={onUpload} className="text-blue-400 hover:text-blue-300 font-bold">Subir ahora →</button>
                </div>
            )}
        </div>
    );
};

const LandingPage = ({ onStart }) => (
    <div className="animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-slide-up">
                ✨ Tecnología de Auditoría Energética con IA
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
                Tu Factura de Luz, <br /> <span className="gradient-text">Optimizada por IA</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto animate-slide-up">
                Sube tu PDF y nuestra Inteligencia Artificial detectará errores, sobrecostes y te ayudará a entender tu consumo.
            </p>
            <button onClick={onStart} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/30 animate-slide-up">
                Analizar mi Factura Gratis
            </button>
        </div>
    </div>
);

const UploadPage = ({ onUpload, error }) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]);
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-24 text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Sube tu Factura</h2>
            <div
                className={`glass-panel border-2 border-dashed rounded-3xl p-12 transition-all ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
                        <i data-lucide="upload" className="w-8 h-8 text-blue-400"></i>
                    </div>
                    <div>
                        <p className="text-lg font-medium mb-2">Arrastra tu PDF aquí</p>
                        <p className="text-sm text-slate-500">o haz clic para seleccionar</p>
                    </div>
                    <button onClick={() => inputRef.current.click()} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition">
                        Seleccionar Archivo
                    </button>
                    <input ref={inputRef} type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])} />
                </div>
            </div>
            {error && (
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-center gap-2 animate-fade-in">
                    <i data-lucide="alert-triangle" className="w-5 h-5"></i> {error}
                </div>
            )}
        </div>
    );
};

const AnalyzingPage = () => (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="relative w-32 h-32 mx-auto mb-12">
            <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">⚡</div>
        </div>
        <h2 className="text-2xl font-bold mb-4 animate-fade-in">Analizando tu consumo...</h2>
        <p className="text-slate-400">Nuestra IA está leyendo cada detalle de tu factura.</p>
    </div>
);

const ResultsPage = ({ data, onBack }) => {
    const scoreColor = data.score > 70 ? 'text-green-400' : (data.score > 40 ? 'text-yellow-400' : 'text-red-400');

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
            <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-8 transition">← Volver</button>
            <div className="glass-panel p-8 rounded-3xl mb-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Análisis Completado</h2>
                        <p className="text-slate-400">Periodo: {data.billing_period || 'Desconocido'}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                        <div className="text-right">
                            <div className="text-sm text-slate-400">Puntuación</div>
                            <div className={`text-3xl font-bold ${scoreColor}`}>{data.score}/100</div>
                        </div>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${data.score > 70 ? 'border-green-500' : 'border-yellow-500'} text-2xl`}>
                            {data.score > 70 ? '😎' : '😐'}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8 relative z-10">
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                        <div className="text-slate-400 text-sm mb-1">Importe</div>
                        <div className="text-2xl font-bold">{data.current_total}€</div>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                        <div className="text-slate-400 text-sm mb-1">Consumo</div>
                        <div className="text-2xl font-bold">{data.estimated_kwh} kWh</div>
                    </div>
                    <div className="bg-green-500/20 p-6 rounded-xl border border-green-500/30">
                        <div className="text-green-300 text-sm mb-1">Ahorro Potencial</div>
                        <div className="text-2xl font-bold text-green-400">-{data.potential_savings}€</div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-slate-700 relative z-10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <i data-lucide="trending-up" className="w-5 h-5 text-blue-400"></i> Análisis de Mercado
                    </h3>
                    <p className="text-slate-300 mb-6">Comparativa con el mercado actual.</p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/20 p-2 rounded-lg"><i data-lucide="zap" className="w-5 h-5 text-blue-400"></i></div>
                                <div><div className="font-bold">Tu Precio</div><div className="text-xs text-slate-400">Calculado</div></div>
                            </div>
                            <div className="text-xl font-bold">{data.estimated_kwh > 0 ? (data.current_total / data.estimated_kwh).toFixed(3) : '0.000'} €/kWh</div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-500/20 p-2 rounded-lg"><i data-lucide="bar-chart-2" className="w-5 h-5 text-purple-400"></i></div>
                                <div><div className="font-bold">Mercado (PVPC)</div><div className="text-xs text-slate-400">Referencia</div></div>
                            </div>
                            <div className="text-xl font-bold text-purple-400">{data.pvpc_today} €/kWh</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CookieBanner = () => {
    const [accepted, setAccepted] = useState(() => localStorage.getItem('cookies_accepted'));
    if (accepted) return null;
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-700 p-4 z-50 backdrop-blur-lg animate-slide-up">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-300">Usamos cookies para mejorar tu experiencia.</p>
                <button onClick={() => { localStorage.setItem('cookies_accepted', 'true'); setAccepted(true); }} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-bold">Aceptar</button>
            </div>
        </div>
    );
};

// --- MAIN APP ---

const App = () => {
    const [view, setView] = useState('landing');
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [currentBill, setCurrentBill] = useState(null);
    const [error, setError] = useState('');
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((u) => {
            setUser(u);
            setLoadingAuth(false);
            if (u) {
                fetchHistory(u.uid);
                if (view === 'landing') setView('dashboard');
            } else {
                setHistory([]);
                setView('landing');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [view, user]);

    const handleLogin = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try { await firebase.auth().signInWithPopup(provider); }
        catch (error) { console.error("Login error:", error); alert("Error al iniciar sesión"); }
    };

    const handleLogout = () => firebase.auth().signOut();

    const fetchHistory = async (uid) => {
        try {
            const res = await fetch(`/api/history/${uid}`);
            const data = await res.json();
            if (data.success) setHistory(data.history);
        } catch (e) { console.error("Error fetching history", e); }
    };

    const handleUpload = async (file) => {
        setError('');
        setView('analyzing');
        const formData = new FormData();
        formData.append('file', file);
        if (user) formData.append('user_id', user.uid);

        try {
            const response = await fetch('/api/analyze', { method: 'POST', body: formData });
            const result = await response.json();
            setTimeout(() => {
                if (result.success) {
                    setCurrentBill(result.data);
                    setView('results');
                    if (user) fetchHistory(user.uid);
                } else {
                    setError(result.error || "Error al procesar");
                    setView('upload');
                }
            }, 3000);
        } catch (error) {
            console.error("Error:", error);
            setError("Error de conexión");
            setView('upload');
        }
    };

    if (loadingAuth) return <div className="min-h-screen flex items-center justify-center text-blue-500"><i data-lucide="loader-2" className="w-8 h-8 animate-spin"></i></div>;

    return (
        <div className="min-h-screen flex flex-col text-slate-200 font-sans selection:bg-blue-500/30">
            <Navbar onNavigate={setView} user={user} onLogin={handleLogin} onLogout={handleLogout} />
            <main className="flex-grow">
                {view === 'landing' && <LandingPage onStart={() => user ? setView('dashboard') : handleLogin()} />}
                {view === 'dashboard' && (user ? <Dashboard history={history} onUpload={() => setView('upload')} onViewBill={(bill) => { setCurrentBill(bill); setView('results'); }} user={user} /> : <LandingPage onStart={handleLogin} />)}
                {view === 'upload' && <UploadPage onUpload={handleUpload} error={error} />}
                {view === 'analyzing' && <AnalyzingPage />}
                {view === 'results' && currentBill && <ResultsPage data={currentBill} onBack={() => setView(user ? 'dashboard' : 'landing')} />}
            </main>
            <CookieBanner />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
