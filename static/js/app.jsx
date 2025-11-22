const { useState, useEffect, useRef } = React;

// --- Icons (SVG Components for portability) ---
const IconUpload = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
);
const IconZap = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const IconCheck = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12" /></svg>
);
const IconAlert = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);
const IconTrendingDown = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
);

// --- Components ---

const Navbar = ({ onNavigate, onStart, hasHistory }) => (
    <nav className="flex items-center justify-between px-4 md:px-6 py-4 glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="bg-blue-500 p-1.5 rounded-lg">
                <IconZap className="text-white w-5 h-5" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight">AnalizaMiFactura</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
            <button onClick={() => onNavigate('como-funciona')} className="hover:text-white transition">Cómo funciona</button>
            <button onClick={() => onNavigate('seguridad')} className="hover:text-white transition">Seguridad</button>
            <button onClick={() => onNavigate('empresas')} className="hover:text-white transition">Empresas</button>
            {hasHistory && (
                <button onClick={() => onNavigate('history')} className="hover:text-white transition text-green-400">📊 Histórico</button>
            )}
        </div>
        <button onClick={onStart} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition">
            Analizar Factura
        </button>
    </nav>
);

const Hero = ({ onStart }) => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative overflow-hidden py-12 md:py-0">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-blue-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-48 h-48 md:w-72 md:h-72 bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs md:text-sm font-medium">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Análisis inteligente con datos reales de ESIOS
            </div>

            <h1 className="text-4xl md:text-7xl font-bold leading-tight">
                Ahorra en tu factura de la <span className="gradient-text">luz</span>
            </h1>

            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto px-2">
                Sube tu factura eléctrica y descubre cuánto pagas de más. Comparamos con el PVPC y las mejores tarifas del mercado español.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 px-4">
                <button
                    onClick={onStart}
                    className="group relative w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                    Analizar mi factura gratis
                    <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
                </button>
            </div>

            <div className="pt-8 md:pt-12 grid grid-cols-3 gap-2 md:gap-8 text-center text-slate-500 text-xs md:text-sm">
                <div>
                    <div className="text-xl md:text-2xl font-bold text-white mb-1">PVPC Real</div>
                    Precio hoy
                </div>
                <div>
                    <div className="text-xl md:text-2xl font-bold text-white mb-1">8 eléctricas</div>
                    Comparadas
                </div>
                <div>
                    <div className="text-xl md:text-2xl font-bold text-white mb-1">100%</div>
                    Seguro
                </div>
            </div>
        </div>
    </div>
);

const UploadStep = ({ onUpload, isLoading }) => {
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
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-slide-up py-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Sube tu factura de la luz (PDF)</h2>
            <p className="text-slate-400 mb-8 text-center text-sm md:text-base max-w-md">
                Solo aceptamos facturas en formato <strong>PDF</strong>.<br />
                Descárgala desde la web de tu compañía eléctrica.
            </p>

            <div
                className={`relative w-full max-w-xl h-56 md:h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
                    ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept=".pdf"
                />

                <div className="bg-slate-700 p-3 md:p-4 rounded-full mb-3 md:mb-4">
                    <IconUpload className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                </div>
                <p className="text-base md:text-lg font-medium text-slate-200">Arrastra tu factura aquí</p>
                <p className="text-xs md:text-sm text-slate-500 mt-1">o haz clic para explorar</p>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">Trabajamos con facturas de:</p>
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                    {['Iberdrola', 'Endesa', 'Naturgy', 'Repsol'].map(company => (
                        <span key={company} className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">
                            {company}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AnalyzingStep = () => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Iniciando escaneo...");

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                return prev + 1;
            });
        }, 40);

        const timeouts = [
            setTimeout(() => setStatus("Extrayendo datos..."), 500),
            setTimeout(() => setStatus("Analizando consumo..."), 1500),
            setTimeout(() => setStatus("Buscando cargos ocultos..."), 2500),
            setTimeout(() => setStatus("Comparando tarifas..."), 3500),
        ];

        return () => {
            clearInterval(interval);
            timeouts.forEach(clearTimeout);
        };
    }, []);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-slide-up">
            <div className="w-24 h-24 relative mb-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * progress / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-200 ease-linear transform -rotate-90 origin-center"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                    {progress}%
                </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 animate-pulse text-center">{status}</h2>
        </div>
    );
};

const Dashboard = ({ data, onReset }) => {
    if (!data) return null;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-slide-up pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Análisis Completado</h2>
                    <p className="text-slate-400 text-sm">Factura de {new Date().toLocaleDateString()}</p>
                </div>
                <button onClick={onReset} className="text-sm text-slate-400 hover:text-white underline">
                    Analizar otra factura
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Score Card */}
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <IconZap className="w-24 h-24" />
                    </div>
                    <h3 className="text-slate-400 font-medium mb-2">Puntuación</h3>
                    <div className="flex items-end gap-2">
                        <span className={`text-5xl font-bold ${data.score < 50 ? 'text-red-500' : data.score < 80 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {data.score}/100
                        </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                        {data.score < 50 ? 'Tu tarifa es muy mejorable.' : 'Tienes una tarifa aceptable.'}
                    </p>
                    {data.estimated_kwh > 0 && (
                        <p className="text-xs text-blue-400 mt-3">
                            📊 Consumo: <strong>{data.estimated_kwh} kWh</strong>
                        </p>
                    )}
                </div>

                {/* Savings Card */}
                <div className="glass-panel p-6 rounded-2xl border-green-500/30 bg-green-500/5">
                    <h3 className="text-green-400 font-medium mb-2">Ahorro Estimado</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold text-white">{data.potential_savings.toFixed(2)}€</span>
                        <span className="text-lg text-green-400 mb-1">/ mes</span>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm text-green-400 bg-green-500/10 px-2 py-1 rounded">
                        <IconTrendingDown className="w-4 h-4" />
                        <span>{data.current_total > 0 ? Math.round((data.potential_savings / data.current_total) * 100) : 0}% menos</span>
                    </div>
                    {data.pvpc_today && (
                        <p className="text-xs text-slate-400 mt-3">
                            ⚡ PVPC hoy: <strong>{data.pvpc_today.toFixed(4)}€/kWh</strong>
                        </p>
                    )}
                </div>

                {/* Market Comparison */}
                <div className="glass-panel p-6 rounded-2xl border-blue-500/20 relative">
                    <h3 className="text-slate-400 font-medium mb-4">Tu Factura Actual</h3>

                    <div className="mb-4">
                        <span className="text-4xl font-bold text-white">{data.current_total.toFixed(2)}€</span>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>Media Mercado</span>
                                <span className="font-bold">{data.market_average.toFixed(2)}€</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(data.market_average / data.current_total) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-green-400">Mejor oferta</span>
                                <span className="font-bold text-green-400">{(data.current_total - data.potential_savings).toFixed(2)}€</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${((data.current_total - data.potential_savings) / data.current_total) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Anomalies */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <IconAlert className="text-yellow-500 w-6 h-6" />
                        Anomalías
                    </h3>
                    <div className="space-y-4">
                        {data.anomalies.map((anomaly, idx) => (
                            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="mt-1 min-w-[10px]">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-200 text-sm md:text-base">{anomaly}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <IconCheck className="text-green-500 w-6 h-6" />
                        Recomendaciones
                    </h3>
                    <div className="space-y-4">
                        {data.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/50 transition cursor-pointer group">
                                <div>
                                    <p className="font-bold text-white group-hover:text-blue-400 transition">{rec.company}</p>
                                    <p className="text-sm text-slate-400">{rec.offer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-white">{rec.price.toFixed(2)}€</p>
                                    <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full mt-1 transition">
                                        Cambiar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Information Pages ---

const ComoFuncionaPage = ({ onNavigate, onStart }) => (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">¿Cómo funciona?</h1>

        <div className="space-y-8">
            <div className="glass-panel p-8 rounded-2xl">
                <div className="flex items-start gap-6">
                    <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-2xl font-bold">1</div>
                    <div>
                        <h3 className="text-2xl font-bold mb-3">Sube tu factura PDF</h3>
                        <p className="text-slate-300 leading-relaxed">Descarga tu factura de luz en formato PDF desde la web de tu compañía eléctrica (Iberdrola, Endesa, Naturgy, etc.) y súbela a nuestra plataforma.</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                <div className="flex items-start gap-6">
                    <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-2xl font-bold">2</div>
                    <div>
                        <h3 className="text-2xl font-bold mb-3">Análisis automático</h3>
                        <p className="text-slate-300 leading-relaxed">Nuestro sistema lee automáticamente el importe total y el consumo en kWh de tu factura. Además, consultamos el precio PVPC real del día desde la API de ESIOS (Red Eléctrica de España).</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                <div className="flex items-start gap-6">
                    <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-2xl font-bold">3</div>
                    <div>
                        <h3 className="text-2xl font-bold mb-3">Comparativa personalizada</h3>
                        <p className="text-slate-300 leading-relaxed">Comparamos tu factura con las 8 mejores tarifas del mercado español (Iberdrola, Endesa, Naturgy, TotalEnergies, Repsol, Octopus Energy...) y te mostramos exactamente cuánto ahorrarías con cada una.</p>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                <div className="flex items-start gap-6">
                    <div className="bg-yellow-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-2xl font-bold">4</div>
                    <div>
                        <h3 className="text-2xl font-bold mb-3">Recibe recomendaciones</h3>
                        <p className="text-slate-300 leading-relaxed">Te mostramos las mejores ofertas ordenadas por ahorro, detectamos posibles cargos innecesarios y te damos una puntuación de tu tarifa actual. Todo en segundos y 100% gratis.</p>
                    </div>
                </div>
            </div>
        </div>

        <button onClick={onStart} className="mt-12 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition">
            Analizar mi factura ahora
        </button>
    </div>
);

const SeguridadPage = ({ onNavigate }) => (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Tu privacidad es nuestra prioridad</h1>

        <div className="space-y-6">
            <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="text-green-500">🔒</span> Procesamiento seguro
                </h3>
                <p className="text-slate-300 leading-relaxed">Tu factura se procesa de forma temporal y se elimina inmediatamente después del análisis. No guardamos ni compartimos tus datos personales con terceros.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="text-blue-500">🛡️</span> Conexión cifrada SSL
                </h3>
                <p className="text-slate-300 leading-relaxed">Toda la comunicación entre tu navegador y nuestros servidores está cifrada con protocolo HTTPS/TLS de última generación.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="text-purple-500">👁️</span> Sin registro necesario
                </h3>
                <p className="text-slate-300 leading-relaxed">No necesitas crear cuenta ni proporcionar datos personales. Simplemente sube tu factura, obtén el análisis y listo.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="text-yellow-500">📊</span> Datos reales y verificables
                </h3>
                <p className="text-slate-300 leading-relaxed">Usamos datos oficiales de ESIOS (Red Eléctrica de España) y tarifas públicas de las compañías eléctricas. Todo es transparente y verificable.</p>
            </div>
        </div>
    </div>
);

const EmpresasPage = ({ onNavigate }) => (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Soluciones para empresas</h1>

        <div className="glass-panel p-8 rounded-2xl mb-8">
            <h2 className="text-3xl font-bold mb-6">Optimiza los costes energéticos de tu empresa</h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-6">
                ¿Tienes múltiples suministros eléctricos? ¿Facturas superiores a 500€/mes? Te ayudamos a reducir tus costes energéticos de forma profesional.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-blue-400">✓ Análisis masivo de facturas</h3>
                <p className="text-slate-300">Analiza todas tus facturas de una vez y obtén un informe completo de ahorro potencial.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-green-400">✓ Asesoramiento personalizado</h3>
                <p className="text-slate-300">Te ayudamos a negociar con las eléctricas y encontrar la mejor tarifa para tu perfil de consumo.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-purple-400">✓ Monitorización continua</h3>
                <p className="text-slate-300">Alertas automáticas cuando detectamos una tarifa mejor para tu empresa.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-yellow-400">✓ Ahorro garantizado</h3>
                <p className="text-slate-300">Cobramos solo si conseguimos reducir tus costes. Sin riesgos para ti.</p>
            </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl bg-blue-500/10 border-blue-500/20">
            <h3 className="text-2xl font-bold mb-4">¿Interesado?</h3>
            <p className="text-slate-300 mb-6">Contacta con nosotros para una auditoría energética gratuita de tu empresa.</p>
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition">
                Solicitar auditoría gratuita
            </button>
        </div>
    </div>
);

// --- Legal Pages ---

const PrivacidadPage = ({ onNavigate }) => (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Política de Privacidad</h1>

        <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-sm text-slate-400">Última actualización: 22 de noviembre de 2025</p>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">1. Responsable del tratamiento</h2>
                <p><strong>Identidad:</strong> AnalizaMiFactura.com</p>
                <p><strong>Contacto:</strong> info@analizamifactura.com</p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">2. Datos que recopilamos</h2>
                <p className="mb-3">En AnalizaMiFactura.com procesamos los siguientes datos:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Datos de tu factura eléctrica:</strong> Importe total, consumo en kWh, fecha del período facturado.</li>
                    <li><strong>Datos técnicos:</strong> Dirección IP (anonimizada), tipo de navegador, sistema operativo.</li>
                    <li><strong>NO recopilamos:</strong> Nombre, DNI, dirección postal, cuenta bancaria, email (a menos que nos contactes voluntariamente).</li>
                </ul>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">3. Finalidad del tratamiento</h2>
                <p className="mb-3">Usamos tus datos exclusivamente para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Analizar tu factura eléctrica y calcular posibles ahorros</li>
                    <li>Comparar tu tarifa con ofertas del mercado regulado</li>
                    <li>Obtener el precio PVPC real desde la API de ESIOS (Red Eléctrica de España)</li>
                    <li>Mejorar nuestro servicio mediante análisis anónimos y agregados</li>
                </ul>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">4. Base legal</h2>
                <p>El tratamiento de tus datos se basa en:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                    <li><strong>Consentimiento:</strong> Al usar nuestro servicio aceptas esta política</li>
                    <li><strong>Interés legítimo:</strong> Mejorar nuestro servicio y detectar fraudes</li>
                </ul>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">5. Conservación de datos</h2>
                <p><strong>IMPORTANTE:</strong> Tu factura se procesa <span className="text-green-400 font-bold">temporalmente</span> y se <span className="text-red-400 font-bold">elimina inmediatamente</span> tras el análisis.</p>
                <p className="mt-3">NO almacenamos tus facturas en nuestros servidores de forma permanente.</p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">6. Compartir datos con terceros</h2>
                <p className="mb-3">NO vendemos ni compartimos tus datos personales con terceros. Únicamente compartimos datos técnicos anónimos con:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>ESIOS API:</strong> Para obtener precios PVPC reales (solo consultamos, no enviamos tus datos)</li>
                    <li><strong>Hosting (Render.com):</strong> Necesario para el funcionamiento técnico del servicio</li>
                </ul>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">7. Tus derechos (RGPD)</h2>
                <p className="mb-3">Conforme al Reglamento General de Protección de Datos (RGPD), tienes derecho a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Acceso:</strong> Saber qué datos tenemos sobre ti</li>
                    <li><strong>Rectificación:</strong> Corregir datos inexactos</li>
                    <li><strong>Supresión:</strong> Eliminar tus datos ("derecho al olvido")</li>
                    <li><strong>Limitación:</strong> Restringir el procesamiento</li>
                    <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                    <li><strong>Oposición:</strong> Oponerte al tratamiento</li>
                </ul>
                <p className="mt-4">Para ejercer estos derechos, contacta: <strong>info@analizamifactura.com</strong></p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">8. Cookies</h2>
                <p>Consulta nuestra <button onClick={() => onNavigate('cookies')} className="text-blue-400 underline">Política de Cookies</button> para más información.</p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">9. Cambios en esta política</h2>
                <p>Nos reservamos el derecho de modificar esta política. Te notificaremos de cambios significativos.</p>
            </section>
        </div>
    </div>
);

const TerminosPage = ({ onNavigate }) => (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Términos y Condiciones</h1>

        <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-sm text-slate-400">Última actualización: 22 de noviembre de 2025</p>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de los términos</h2>
                <p>Al acceder y usar AnalizaMiFactura.com, aceptas estar sujeto a estos Términos y Condiciones.</p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">2. Descripción del servicio</h2>
                <p className="mb-3">AnalizaMiFactura.com ofrece:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Análisis automático de facturas eléctricas en PDF</li>
                    <li>Comparación con tarifas del mercado español</li>
                    <li>Recomendaciones de ahorro basadas en datos reales del PVPC</li>
                </ul>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">3. Uso del servicio</h2>
                <p className="mb-3">Te comprometes a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Subir ÚNICAMENTE facturas eléctricas legítimas</li>
                    <li>NO usar el servicio para fines ilegales o fraudulentos</li>
                    <li>NO intentar vulnerar la seguridad del sistema</li>
                    <li>NO hacer un uso abusivo que sobrecargue nuestros servidores</li>
                </ul>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">4. Limitación de responsabilidad</h2>
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg mb-3">
                    <p className="font-bold text-yellow-400">IMPORTANTE:</p>
                </div>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Los análisis son <strong>orientativos</strong> y basados en datos públicos</li>
                    <li>NO garantizamos la exactitud del 100% en la lectura OCR de facturas</li>
                    <li>Las recomendaciones de ahorro son <strong>estimaciones</strong></li>
                    <li>NO somos una compañía eléctrica ni comercializadora</li>
                    <li>NO nos hacemos responsables de decisiones de contratación basadas en nuestro análisis</li>
                    <li>El precio PVPC mostrado es informativo (obtenido de ESIOS)</li>
                </ul>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">5. Propiedad intelectual</h2>
                <p>Todo el contenido de AnalizaMiFactura.com (código, diseño, textos, logos) está protegido por derechos de autor.</p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">6. Enlaces a terceros</h2>
                <p>Podemos mostrar enlaces a comercializadoras eléctricas. NO somos responsables del contenido o servicios de estos sitios externos.</p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">7. Modificación del servicio</h2>
                <p>Nos reservamos el derecho de modificar, suspender o discontinuar el servicio en cualquier momento sin previo aviso.</p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">8. Ley aplicable</h2>
                <p>Estos términos se rigen por la legislación española. Cualquier disputa se resolverá en los tribunales de España.</p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">9. Contacto</h2>
                <p>Para cualquier duda sobre estos términos: <strong>info@analizamifactura.com</strong></p>
            </section>
        </div>
    </div>
);

const CookiesPage = ({ onNavigate }) => (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Política de Cookies</h1>

        <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-sm text-slate-400">Última actualización: 22 de noviembre de 2025</p>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">¿Qué son las cookies?</h2>
                <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas una web. Nos ayudan a mejorar tu experiencia y analizar el uso del sitio.</p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Cookies que utilizamos</h2>

                <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <h3 className="font-bold text-white mb-2">🔵 Cookies técnicas (necesarias)</h3>
                        <p className="text-sm mb-2">Esenciales para el funcionamiento de la web.</p>
                        <ul className="list-disc list-inside text-sm ml-4">
                            <li><strong>Sesión:</strong> Mantiene tu estado mientras navegas</li>
                            <li><strong>Duración:</strong> Se eliminan al cerrar el navegador</li>
                            <li><strong>Consentimiento:</strong> NO necesario (son obligatorias)</li>
                        </ul>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                        <h3 className="font-bold text-white mb-2">🟢 Cookies analíticas (opcional)</h3>
                        <p className="text-sm mb-2">Nos ayudan a entender cómo usas la web.</p>
                        <ul className="list-disc list-inside text-sm ml-4">
                            <li><strong>Proveedor:</strong> Google Analytics (si activado)</li>
                            <li><strong>Datos:</strong> Páginas visitadas, tiempo en el sitio, navegador usado</li>
                            <li><strong>Duración:</strong> Hasta 24 meses</li>
                            <li><strong>Consentimiento:</strong> SÍ necesario</li>
                        </ul>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                        <h3 className="font-bold text-white mb-2">🟣 Cookies de marketing (opcional)</h3>
                        <p className="text-sm mb-2">Para mostrarte contenido relevante.</p>
                        <ul className="list-disc list-inside text-sm ml-4">
                            <li><strong>Proveedor:</strong> Actualmente NO usamos cookies de marketing</li>
                            <li><strong>Futuro:</strong> Si las activamos, te pediremos consentimiento</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Gestionar cookies</h2>
                <p className="mb-3">Puedes controlar y eliminar cookies en cualquier momento:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>En tu navegador:</strong> Configuración → Privacidad → Cookies</li>
                    <li><strong>Chrome:</strong> Settings → Privacy → Cookies</li>
                    <li><strong>Firefox:</strong> Options → Privacy → Cookies</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                </ul>
                <p className="mt-4 text-yellow-400 text-sm">⚠️ Bloquear cookies técnicas puede afectar al funcionamiento del sitio.</p>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Cookies de terceros</h2>
                <p className="mb-3">Podemos usar servicios de terceros que establecen sus propias cookies:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-blue-400 underline">Política de privacidad</a></li>
                    <li><strong>Render.com (hosting):</strong> Cookies técnicas de servidor</li>
                </ul>
            </section>

            <section className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Más información</h2>
                <p>Para más detalles sobre cómo tratamos tus datos, consulta nuestra <button onClick={() => onNavigate('privacidad')} className="text-blue-400 underline">Política de Privacidad</button>.</p>
                <p className="mt-3">Contacto: <strong>info@analizamifactura.com</strong></p>
            </section>
        </div>
    </div>
);

// --- History & Simulator Page ---

const HistoryPage = ({ userId, onNavigate }) => {
    const [loading, setLoading] = React.useState(true);
    const [facturas, setFacturas] = React.useState([]);
    const [projection, setProjection] = React.useState(null);

    React.useEffect(() => {
        if (userId) {
            fetchHistory();
        }
    }, [userId]);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`/api/history/${userId}`);
            const result = await response.json();

            if (result.success) {
                setFacturas(result.facturas);
                setProjection(result.projection);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching history:", error);
            setLoading(false);
        }
    };

    if (!userId) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Histórico de Facturas</h1>
                <p className="text-slate-400 mb-6">Analiza una factura primero para ver tu histórico.</p>
                <button onClick={() => onNavigate('upload')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition">
                    Analizar Factura
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-400">Cargando histórico...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 animate-slide-up">
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Tu Histórico de Facturas</h1>
                <p className="text-slate-400">Análisis de tus últimas {facturas.length} facturas</p>
            </div>

            {/* Projection Summary */}
            {projection && projection.num_facturas > 0 && (
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="text-slate-400 text-sm mb-2">Ahorro Mensual Promedio</div>
                        <div className="text-3xl font-bold text-green-400">{projection.ahorro_mensual_promedio}€</div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="text-slate-400 text-sm mb-2">Ahorro Anual Estimado</div>
                        <div className="text-3xl font-bold text-blue-400">{projection.ahorro_anual_estimado}€</div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="text-slate-400 text-sm mb-2">Total Gastado</div>
                        <div className="text-3xl font-bold text-white">{projection.total_gastado}€</div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="text-slate-400 text-sm mb-2">Facturas Analizadas</div>
                        <div className="text-3xl font-bold text-purple-400">{projection.num_facturas}</div>
                    </div>
                </div>
            )}

            {/* Savings Simulator */}
            {projection && projection.ahorro_anual_estimado > 0 && (
                <div className="glass-panel p-8 rounded-2xl mb-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <span className="text-3xl">💰</span>
                        Simulador de Ahorro
                    </h2>
                    <p className="text-slate-300 mb-6">
                        Si cambias a la mejor tarifa disponible, así ahorrarías:
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                            <div className="text-sm text-slate-400 mb-1">En 6 meses</div>
                            <div className="text-2xl font-bold text-green-400">{(projection.ahorro_anual_estimado / 2).toFixed(2)}€</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                            <div className="text-sm text-slate-400 mb-1">En 1 año</div>
                            <div className="text-3xl font-bold text-green-400">{projection.ahorro_anual_estimado}€</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl">
                            <div className="text-sm text-slate-400 mb-1">En 3 años</div>
                            <div className="text-2xl font-bold text-green-400">{(projection.ahorro_anual_estimado * 3).toFixed(2)}€</div>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">💡 Eso equivale a {Math.round(projection.ahorro_anual_estimado / 50)} cenas en un restaurante</p>
                    </div>
                </div>
            )}

            {/* Facturas List */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Facturas Analizadas</h2>
                {facturas.length === 0 ? (
                    <div className="glass-panel p-8 rounded-2xl text-center">
                        <p className="text-slate-400">No hay facturas en tu histórico todavía.</p>
                        <button onClick={() => onNavigate('upload')} className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition">
                            Analizar Primera Factura
                        </button>
                    </div>
                ) : (
                    facturas.map((factura, index) => (
                        <div key={factura.id} className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl font-bold text-white">{factura.importe_total}€</span>
                                        <span className="text-sm text-slate-400">
                                            {new Date(factura.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <span className="text-slate-400">⚡ {factura.consumo_kwh} kWh</span>
                                        <span className="text-slate-400">📊 PVPC: {factura.pvpc_precio}€/kWh</span>
                                        <span className="text-slate-400">🎯 Score: {factura.puntuacion}/100</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {factura.ahorro_potencial > 0 && (
                                        <div className="text-right">
                                            <div className="text-xs text-slate-400 mb-1">Ahorro potencial</div>
                                            <div className="text-xl font-bold text-green-400">-{factura.ahorro_potencial}€</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-8 text-center">
                <button onClick={() => onNavigate('upload')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition">
                    Analizar Nueva Factura
                </button>
            </div>
        </div>
    );
};

// --- Main App ---

const App = () => {
    const [view, setView] = useState('landing'); // landing, upload, analyzing, results, error, como-funciona, seguridad, empresas, privacidad, terminos, cookies, history
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(() => {
        // Get userId from localStorage or null
        return localStorage.getItem('analizamifactura_userId') || null;
    });

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

        // Include userId if exists
        if (userId) {
            formData.append('user_id', userId);
        }

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

                    // Save userId to state and localStorage
                    if (result.data.user_id) {
                        setUserId(result.data.user_id);
                        localStorage.setItem('analizamifactura_userId', result.data.user_id);
                    }

                    setView('results');
                } else {
                    // Mostrar error
                    setError(result.error || "Error al procesar la factura");
                    setView('error');
                }
            }, 4000);

        } catch (error) {
            console.error("Error analyzing:", error);
            setTimeout(() => {
                setError("Error de conexión. Intenta de nuevo.");
                setView('error');
            }, 4000);
        }
    };

    const handleReset = () => {
        setFile(null);
        setData(null);
        setError('');
        setView('landing');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar onNavigate={handleNavigate} onStart={handleStart} hasHistory={!!userId} />
            <main className="flex-grow relative">
                {view === 'landing' && <Hero onStart={handleStart} />}
                {view === 'upload' && <UploadStep onUpload={handleUpload} />}
                {view === 'analyzing' && <AnalyzingStep />}
                {view === 'results' && <Dashboard data={data} onReset={handleReset} />}
                {view === 'como-funciona' && <ComoFuncionaPage onNavigate={handleNavigate} onStart={handleStart} />}
                {view === 'seguridad' && <SeguridadPage onNavigate={handleNavigate} />}
                {view === 'empresas' && <EmpresasPage onNavigate={handleNavigate} />}
                {view === 'privacidad' && <PrivacidadPage onNavigate={handleNavigate} />}
                {view === 'terminos' && <TerminosPage onNavigate={handleNavigate} />}
                {view === 'cookies' && <CookiesPage onNavigate={handleNavigate} />}
                {view === 'history' && <HistoryPage userId={userId} onNavigate={handleNavigate} />}
                {view === 'error' && (
                    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                        <div className="max-w-md text-center">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 mb-6">
                                <IconAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-white mb-3">Error al procesar</h2>
                                <p className="text-slate-300">{error}</p>
                            </div>
                            <button
                                onClick={handleReset}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition"
                            >
                                Intentar de nuevo
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <footer className="py-8 px-4 text-center text-slate-600 text-sm border-t border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-4">
                        <button onClick={() => handleNavigate('privacidad')} className="hover:text-white transition">Política de Privacidad</button>
                        <button onClick={() => handleNavigate('terminos')} className="hover:text-white transition">Términos y Condiciones</button>
                        <button onClick={() => handleNavigate('cookies')} className="hover:text-white transition">Cookies</button>
                        <a href="mailto:info@analizamifactura.com" className="hover:text-white transition">Contacto</a>
                    </div>
                    <p>© 2025 AnalizaMiFactura.com - Todos los derechos reservados.</p>
                    <p className="mt-2 text-xs text-slate-700">Servicio informativo independiente. No somos una comercializadora eléctrica.</p>
                </div>
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

