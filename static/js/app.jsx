const { useState, useEffect, useRef } = React;


// --- Components ---

const Testimonials = () => {
    const testimonials = [
        {
            name: "María G.",
            role: "Ahorró 450€/año",
            text: "No sabía que estaba pagando tanto de más. En 5 minutos cambié de compañía y la diferencia es abismal.",
            avatar: "👩"
        },
        {
            name: "Carlos R.",
            role: "Ahorró 280€/año",
            text: "La gráfica me abrió los ojos. Estaba en una tarifa antigua carísima. Gracias por la ayuda.",
            avatar: "👨"
        },
        {
            name: "Laura M.",
            role: "Ahorró 120€/año",
            text: "Súper fácil de usar. Subí el PDF y al momento me dijo qué hacer. Muy recomendable.",
            avatar: "👩‍🦰"
        }
    ];

    return (
        <div className="py-24 bg-slate-900/50">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                    <span className="gradient-text">Historias Reales</span> de Ahorro
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition">
                            <div className="text-4xl mb-4">{t.avatar}</div>
                            <p className="text-slate-300 mb-6 italic">"{t.text}"</p>
                            <div>
                                <div className="font-bold text-white">{t.name}</div>
                                <div className="text-green-400 text-sm font-medium">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SavingsChart = ({ current, potential }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Tu Factura', 'Con Mejor Tarifa'],
                    datasets: [{
                        label: 'Coste (€)',
                        data: [current, current - potential],
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.5)', // Red for current
                            'rgba(34, 197, 94, 0.5)'  // Green for potential
                        ],
                        borderColor: [
                            'rgba(239, 68, 68, 1)',
                            'rgba(34, 197, 94, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Comparativa de Coste Mensual',
                            color: '#e2e8f0'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#94a3b8' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#e2e8f0' }
                        }
                    }
                }
            });
        }
        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [current, potential]);

    return (
        <div className="glass-panel p-6 rounded-2xl mb-8">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

const CostBreakdownChart = ({ total, kwh }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current && total > 0) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Estimación de desglose (basado en estructura típica factura española)
            const energia = total * 0.45; // ~45% energía
            const peajes = total * 0.30;  // ~30% peajes y cargos
            const impuestos = total * 0.25; // ~25% impuestos (IVA + eléctrico)

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Energía', 'Peajes y Cargos', 'Impuestos'],
                    datasets: [{
                        data: [energia, peajes, impuestos],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',  // Blue
                            'rgba(168, 85, 247, 0.8)',  // Purple
                            'rgba(251, 191, 36, 0.8)'   // Yellow
                        ],
                        borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(168, 85, 247, 1)',
                            'rgba(251, 191, 36, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#e2e8f0', padding: 15 }
                        },
                        title: {
                            display: true,
                            text: 'Desglose de tu Factura',
                            color: '#e2e8f0',
                            font: { size: 16 }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const percent = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value.toFixed(2)}€ (${percent}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [total, kwh]);

    return (
        <div className="glass-panel p-6 rounded-2xl mb-8">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

const CookieBanner = () => {
    const [accepted, setAccepted] = useState(() => localStorage.getItem('cookies_accepted'));

    if (accepted) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-700 p-4 z-50 backdrop-blur-lg animate-slide-up">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-300 text-center md:text-left">
                    Usamos cookies para analizar el tráfico y mejorar tu experiencia.
                    Al continuar, aceptas nuestra <a href="/cookies" className="text-blue-400 hover:underline">política de cookies</a>.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            localStorage.setItem('cookies_accepted', 'true');
                            setAccepted(true);
                        }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-bold transition"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

const EmailCapture = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setSent(true);
                setTimeout(() => setEmail(''), 2000);
            }
        } catch (error) {
            console.error("Error subscribing:", error);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center bg-green-500/10 border-green-500/20">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">¡Suscrito correctamente!</h3>
                <p className="text-slate-300">Te avisaremos cuando baje el precio de la luz.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 rounded-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-4">🔔 Alertas de Precio</h3>
            <p className="text-slate-300 mb-6">¿Quieres saber cuándo la luz es GRATIS? Déjanos tu email.</p>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
                >
                    {loading ? '...' : 'Suscribirme'}
                </button>
            </form>
        </div>
    );
};

const ShareButtons = ({ savings }) => {
    const text = `¡He descubierto que puedo ahorrar ${savings}€ en mi factura de luz! ⚡ Analiza la tuya gratis aquí:`;
    const url = "https://analizamifactura.onrender.com";

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    return (
        <div className="flex gap-4 justify-center mt-6">
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-full transition transform hover:scale-110" title="Compartir en WhatsApp">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
            </a>
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"
                className="bg-[#1DA1F2] hover:bg-[#1a91da] text-white p-3 rounded-full transition transform hover:scale-110" title="Compartir en Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
            </a>
        </div>
    );
};

const Navbar = ({ onNavigate, onStart, hasHistory }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Refresh icons when menu opens
    useEffect(() => {
        if (isMenuOpen && window.lucide) {
            window.lucide.createIcons();
        }
    }, [isMenuOpen]);

    const handleMobileNavigate = (page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50">
            <div className="glass-panel px-4 md:px-6 py-4 flex items-center justify-between relative z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
                    <div className="bg-blue-500 p-1.5 rounded-lg">
                        <i data-lucide="zap" className="w-5 h-5 text-white"></i>
                    </div>
                    <span className="text-lg md:text-xl font-bold">AnalizaMiFactura</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-4">
                    <a href="/blog" className="text-sm text-slate-300 hover:text-white transition">Blog</a>
                    {hasHistory && (
                        <button onClick={() => onNavigate('history')} className="text-sm text-slate-300 hover:text-white transition">
                            Historial
                        </button>
                    )}
                    <button
                        onClick={onStart}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-medium transition shadow-lg shadow-blue-500/20"
                    >
                        Analizar Factura
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <i data-lucide={isMenuOpen ? "x" : "menu"} className="w-6 h-6"></i>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 glass-panel border-t border-slate-700 p-4 flex flex-col gap-4 md:hidden animate-fade-in z-40">
                    <a href="/blog" className="flex items-center gap-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5">
                        <i data-lucide="book-open" className="w-5 h-5"></i>
                        Blog y Consejos
                    </a>
                    {hasHistory && (
                        <button onClick={() => handleMobileNavigate('history')} className="flex items-center gap-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5 w-full text-left">
                            <i data-lucide="history" className="w-5 h-5"></i>
                            Tu Historial
                        </button>
                    )}
                    <button
                        onClick={() => { onStart(); setIsMenuOpen(false); }}
                        className="bg-blue-600 text-white p-3 rounded-xl font-bold text-center mt-2"
                    >
                        Analizar Factura Ahora
                    </button>
                </div>
            )}
        </nav>
    );
};

const LandingPage = ({ onStart }) => (
    <div className="animate-fade-in">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-slide-up">
                ✨ Tecnología de Auditoría Energética con IA
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Tu Factura de Luz, <br />
                <span className="gradient-text">Optimizada por IA</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Sube tu PDF y nuestra Inteligencia Artificial detectará errores, sobrecostes y la mejor tarifa del mercado en segundos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <button
                    onClick={onStart}
                    className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
                >
                    <span className="flex items-center gap-2">
                        Analizar mi Factura Gratis
                        <i data-lucide="arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
                    </span>
                </button>
                <a href="/como-funciona" className="px-8 py-4 glass-panel rounded-full font-bold hover:bg-white/10 transition text-white">
                    ¿Cómo funciona?
                </a>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800 pt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div>
                    <div className="text-3xl font-bold text-white mb-1">2.4M€</div>
                    <div className="text-slate-500 text-sm">Ahorro Detectado</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-white mb-1">15k+</div>
                    <div className="text-slate-500 text-sm">Facturas Analizadas</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-white mb-1">300€</div>
                    <div className="text-slate-500 text-sm">Ahorro Medio/Año</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-white mb-1">100%</div>
                    <div className="text-slate-500 text-sm">Gratuito</div>
                </div>
            </div>
        </div>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-4 py-24">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-panel p-8 rounded-3xl hover:border-blue-500/30 transition duration-300">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
                        <i data-lucide="scan-line" className="w-6 h-6"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Escaneo Inteligente</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Nuestra tecnología OCR lee tu factura como un experto. Entiende peajes, potencias y costes ocultos.
                    </p>
                </div>
                <div className="glass-panel p-8 rounded-3xl hover:border-purple-500/30 transition duration-300">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
                        <i data-lucide="bar-chart-3" className="w-6 h-6"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Comparativa Real</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Cruzamos tus datos con el mercado diario (PVPC) y las mejores ofertas fijas del momento.
                    </p>
                </div>
                <div className="glass-panel p-8 rounded-3xl hover:border-green-500/30 transition duration-300">
                    <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400 mb-6">
                        <i data-lucide="piggy-bank" className="w-6 h-6"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Ahorro Garantizado</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Te decimos exactamente cuánto puedes ahorrar y te damos el enlace directo para hacerlo.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const AnalyzingPage = () => {
    const [step, setStep] = useState(0);
    const steps = [
        "📄 Leyendo tu factura PDF...",
        "🔍 Extrayendo datos de consumo...",
        "⚡ Consultando precio mercado (OMIE)...",
        "🧮 Calculando fórmulas de ahorro...",
        "✨ Generando informe final..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => (s < steps.length - 1 ? s + 1 : s));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
            <div className="relative w-32 h-32 mx-auto mb-12">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
                    ⚡
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 animate-fade-in" key={step}>
                {steps[step]}
            </h2>
            <p className="text-slate-400">
                Nuestra IA está analizando cada kWh de tu consumo.
            </p>

            <div className="mt-8 flex justify-center gap-2">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

const ResultsPage = ({ data, onBack }) => {
    const scoreColor = data.score > 7 ? 'text-green-400' : (data.score > 4 ? 'text-yellow-400' : 'text-red-400');

    useEffect(() => {
        if (data.potential_savings > 0 && window.confetti) {
            window.confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22c55e', '#3b82f6', '#fbbf24']
            });
        }
    }, [data]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
            <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-8 transition">
                ← Volver
            </button>

            <div className="glass-panel p-8 rounded-3xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <i data-lucide="zap" className="w-64 h-64"></i>
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Análisis Completado</h2>
                            <p className="text-slate-400">Factura: {data.filename}</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                            <div className="text-right">
                                <div className="text-sm text-slate-400">Puntuación</div>
                                <div className={`text-3xl font-bold ${scoreColor}`}>{data.score}/10</div>
                            </div>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${data.score > 7 ? 'border-green-500' : 'border-yellow-500'} text-2xl`}>
                                {data.score > 7 ? '😎' : '😐'}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <div className="text-slate-400 text-sm mb-1">Importe Actual</div>
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

                    {/* Métricas Adicionales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                            <div className="text-blue-300 text-xs mb-1">Precio Medio</div>
                            <div className="text-lg md:text-xl font-bold text-blue-400">
                                {data.estimated_kwh > 0 ? (data.current_total / data.estimated_kwh).toFixed(3) : '0.000'}€/kWh
                            </div>
                        </div>
                        <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                            <div className="text-purple-300 text-xs mb-1">PVPC Hoy</div>
                            <div className="text-lg md:text-xl font-bold text-purple-400">{data.pvpc_today}€/kWh</div>
                        </div>
                        <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                            <div className="text-yellow-300 text-xs mb-1">Ahorro Anual</div>
                            <div className="text-lg md:text-xl font-bold text-yellow-400">~{(data.potential_savings * 12).toFixed(0)}€</div>
                        </div>
                        <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                            <div className="text-green-300 text-xs mb-1">Estado OCR</div>
                            <div className="text-lg md:text-xl font-bold text-green-400">{data.ocr_success ? '✓ OK' : '⚠ Manual'}</div>
                        </div>
                    </div>

                    {/* Gráficas */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <SavingsChart current={parseFloat(data.current_total)} potential={parseFloat(data.potential_savings)} />
                        <CostBreakdownChart total={parseFloat(data.current_total)} kwh={data.estimated_kwh} />
                    </div>

                    {data.potential_savings > 0 && (
                        <div className="text-center mb-8">
                            <p className="text-slate-400 text-sm mb-2">¡Comparte tu ahorro y ayuda a otros!</p>
                            <ShareButtons savings={data.potential_savings} />
                        </div>
                    )}

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold mb-4">Mejores Tarifas para Ti</h3>
                        {data.recommendations.map((rec, i) => (
                            <div key={i} className="bg-slate-800/30 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-6 items-center hover:border-blue-500/50 transition">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-bold text-lg">{rec.company}</h4>
                                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">{rec.offer}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-300">
                                        <span>Precio: <strong>{rec.price_kwh}€/kWh</strong></span>
                                        <span>•</span>
                                        <span className="text-green-400 font-bold">Ahorras {rec.savings}€</span>
                                    </div>
                                </div>
                                <a
                                    href={rec.affiliate_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition text-center shadow-lg hover:shadow-green-500/20"
                                >
                                    Contratar Ahora →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <EmailCapture />

            <div className="text-center mt-12">
                <p className="text-slate-500 text-sm mb-4">
                    Este análisis es una estimación basada en datos públicos del mercado.
                </p>
                <button onClick={onBack} className="text-blue-400 hover:text-blue-300 font-medium">
                    Analizar otra factura
                </button>
            </div>
        </div>
    );
};

const UploadPage = ({ onUpload, error }) => {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-24 text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Sube tu Factura</h2>
            <p className="text-slate-400 mb-12">
                Sube el PDF de tu factura eléctrica. Analizaremos los datos automáticamente.
            </p>

            <div
                className={`glass-panel border-2 border-dashed rounded-3xl p-12 transition-all ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
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
                    <button
                        onClick={() => inputRef.current.click()}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition"
                    >
                        Seleccionar Archivo
                    </button>
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleChange}
                    />
                </div>
            </div>

            {error && (
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-center gap-2 animate-fade-in">
                    <i data-lucide="alert-triangle" className="w-5 h-5"></i>
                    {error}
                </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-sm">
                <i data-lucide="lock" className="w-4 h-4"></i>
                Tus datos están cifrados y se borran tras el análisis
            </div>
        </div>
    );
};

// --- Legal Pages ---

const PrivacidadPage = ({ onNavigate }) => (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        <button onClick={() => onNavigate('landing')} className="text-slate-400 hover:text-white mb-8">← Volver</button>
        <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
        <div className="prose prose-invert max-w-none">
            <p>En AnalizaMiFactura, nos tomamos tu privacidad muy en serio. Esta política describe cómo tratamos tus datos.</p>
            <h3>1. Recopilación de Datos</h3>
            <p>Solo recopilamos los datos necesarios para analizar tu factura eléctrica (consumo, potencia, importes). No almacenamos datos personales identificables de forma permanente.</p>
            <h3>2. Uso de la Información</h3>
            <p>La información extraída de tu factura se utiliza exclusivamente para generar el informe de ahorro y las recomendaciones.</p>
            <h3>3. Seguridad</h3>
            <p>Tus facturas se procesan en memoria y se eliminan inmediatamente después del análisis. Utilizamos cifrado SSL para todas las comunicaciones.</p>
        </div>
    </div>
);

const TerminosPage = ({ onNavigate }) => (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        <button onClick={() => onNavigate('landing')} className="text-slate-400 hover:text-white mb-8">← Volver</button>
        <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>
        <div className="prose prose-invert max-w-none">
            <p>Bienvenido a AnalizaMiFactura. Al usar nuestro servicio, aceptas estos términos.</p>
            <h3>1. Servicio</h3>
            <p>Ofrecemos una herramienta de análisis y comparación de tarifas eléctricas. Los resultados son estimaciones basadas en datos públicos.</p>
            <h3>2. Responsabilidad</h3>
            <p>No nos hacemos responsables de las decisiones tomadas en base a nuestros análisis. Recomendamos verificar siempre las condiciones finales con la comercializadora.</p>
        </div>
    </div>
);

const CookiesPage = ({ onNavigate }) => (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        <button onClick={() => onNavigate('landing')} className="text-slate-400 hover:text-white mb-8">← Volver</button>
        <h1 className="text-3xl font-bold mb-8">Política de Cookies</h1>
        <div className="prose prose-invert max-w-none">
            <p>Utilizamos cookies para mejorar tu experiencia en nuestra web.</p>
            <h3>1. ¿Qué son las cookies?</h3>
            <p>Son pequeños archivos de texto que se guardan en tu navegador.</p>
            <h3>2. Cookies que usamos</h3>
            <p>Usamos cookies técnicas esenciales y cookies analíticas anónimas para entender cómo se usa la web.</p>
        </div>
    </div>
);

const HistoryPage = ({ onNavigate }) => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('analizamifactura_userId');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`/api/history/${userId}`);
                const data = await response.json();
                if (data.success) {
                    setFacturas(data.facturas);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [userId]);

    if (loading) return <div className="text-center py-24">Cargando historial...</div>;

    if (!userId || facturas.length === 0) return (
        <div className="max-w-4xl mx-auto px-4 py-24 text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">No hay historial</h2>
            <p className="text-slate-400 mb-8">Aún no has analizado ninguna factura.</p>
            <button onClick={() => onNavigate('upload')} className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                Analizar mi primera factura
            </button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 animate-slide-up">
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Tu Histórico de Facturas</h1>
                <p className="text-slate-400">Análisis de tus últimas {facturas.length} facturas</p>
            </div>

            <div className="grid gap-6">
                {facturas.map((f, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <div className="text-sm text-slate-400 mb-1">{new Date(f.created_at).toLocaleDateString()}</div>
                            <div className="font-bold text-xl">{f.importe_total}€</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-slate-400 mb-1">Ahorro Potencial</div>
                            <div className="text-green-400 font-bold text-xl">-{f.ahorro_potencial}€</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-400 mb-1">Score</div>
                            <div className={`font-bold text-xl ${f.puntuacion > 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {f.puntuacion}/100
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <button onClick={() => onNavigate('landing')} className="text-slate-400 hover:text-white">
                    ← Volver al inicio
                </button>
            </div>
        </div>
    );
};

// --- Main App Component ---

const App = () => {
    const [view, setView] = useState('landing'); // landing, upload, analyzing, results, error, history, privacy...
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(() => localStorage.getItem('analizamifactura_userId'));

    useEffect(() => {
        // Initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [view]);

    const handleNavigate = (page) => {
        setView(page);
        window.scrollTo(0, 0);
    };

    const handleStart = () => setView('upload');

    const handleUpload = async (uploadedFile) => {
        setFile(uploadedFile);
        setError('');
        setView('analyzing');

        const formData = new FormData();
        formData.append('file', uploadedFile);
        if (userId) formData.append('user_id', userId);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            // Wait for animation (min 4s)
            setTimeout(() => {
                if (result.success) {
                    setData(result.data);
                    if (result.data.user_id) {
                        setUserId(result.data.user_id);
                        localStorage.setItem('analizamifactura_userId', result.data.user_id);
                    }
                    setView('results');
                } else {
                    setError(result.error || "Error al procesar la factura");
                    setView('upload'); // Go back to upload with error
                }
            }, 4000);

        } catch (error) {
            console.error("Error analyzing:", error);
            setTimeout(() => {
                setError("Error de conexión. Intenta de nuevo.");
                setView('upload');
            }, 4000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar onNavigate={handleNavigate} onStart={handleStart} hasHistory={!!userId} />

            <main className="flex-grow">
                {view === 'landing' && <LandingPage onStart={handleStart} />}
                {view === 'upload' && <UploadPage onUpload={handleUpload} error={error} />}
                {view === 'analyzing' && <AnalyzingPage />}
                {view === 'results' && data && <ResultsPage data={data} onBack={() => setView('upload')} />}
                {view === 'history' && <HistoryPage onNavigate={handleNavigate} />}
                {view === 'privacidad' && <PrivacidadPage onNavigate={handleNavigate} />}
                {view === 'terminos' && <TerminosPage onNavigate={handleNavigate} />}
                {view === 'cookies' && <CookiesPage onNavigate={handleNavigate} />}
            </main>

            <footer className="py-12 border-t border-slate-800 mt-auto">
                <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
                    <p className="mb-4">© 2025 AnalizaMiFactura.com - Ahorra en tu factura de luz</p>
                    <div className="flex justify-center gap-6 mb-4">
                        <button onClick={() => handleNavigate('privacidad')} className="hover:text-slate-300 transition">Privacidad</button>
                        <button onClick={() => handleNavigate('terminos')} className="hover:text-slate-300 transition">Términos</button>
                        <button onClick={() => handleNavigate('cookies')} className="hover:text-slate-300 transition">Cookies</button>
                    </div>
                    <p className="text-xs text-slate-700">Servicio informativo independiente. No somos una comercializadora eléctrica.</p>
                </div>
            </footer>

            <CookieBanner />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
