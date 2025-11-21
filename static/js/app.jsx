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

const Navbar = () => (
    <nav className="flex items-center justify-between px-4 md:px-6 py-4 glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-1.5 rounded-lg">
                <IconZap className="text-white w-5 h-5" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight">AnalizaMiFactura</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition">Cómo funciona</a>
            <a href="#" className="hover:text-white transition">Seguridad</a>
            <a href="#" className="hover:text-white transition">Empresas</a>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition">
            Acceder
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
                IA Avanzada para tu ahorro
            </div>

            <h1 className="text-4xl md:text-7xl font-bold leading-tight">
                Deja de pagar de más en tus <span className="gradient-text">facturas</span>
            </h1>

            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto px-2">
                Sube tu factura de luz, gas o internet. Nuestra IA detecta errores, cargos ocultos y te dice exactamente cuánto puedes ahorrar.
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
                    <div className="text-xl md:text-2xl font-bold text-white mb-1">15k+</div>
                    Facturas
                </div>
                <div>
                    <div className="text-xl md:text-2xl font-bold text-white mb-1">350€</div>
                    Ahorro medio
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
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Sube tu factura</h2>
            <p className="text-slate-400 mb-8 text-center text-sm md:text-base max-w-md">
                Recomendado: <strong>PDF</strong> (Lectura automática).<br />
                Aceptamos imágenes (JPG/PNG) con entrada manual de datos.
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
                    accept=".pdf,.jpg,.jpeg,.png"
                />

                <div className="bg-slate-700 p-3 md:p-4 rounded-full mb-3 md:mb-4">
                    <IconUpload className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                </div>
                <p className="text-base md:text-lg font-medium text-slate-200">Arrastra tu archivo</p>
                <p className="text-xs md:text-sm text-slate-500 mt-1">o haz clic para explorar</p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
                {['Luz', 'Gas', 'Internet', 'Móvil'].map(type => (
                    <button key={type} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-sm hover:bg-slate-700 hover:text-white transition">
                        {type}
                    </button>
                ))}
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

    // State for manual correction
    const [currentTotal, setCurrentTotal] = useState(data.current_total);
    const [isEditing, setIsEditing] = useState(data.current_total === 0); // Auto-edit if 0
    const [recommendations, setRecommendations] = useState(data.recommendations);
    const [potentialSavings, setPotentialSavings] = useState(data.potential_savings);
    const [marketAverage, setMarketAverage] = useState(data.market_average);
    const [score, setScore] = useState(data.score);

    // Recalculate when total changes
    useEffect(() => {
        if (currentTotal > 0) {
            // Simple logic to simulate recalculation based on the new total
            // In a real app, this might call the backend again or use the same logic as backend
            const estimatedKwh = (currentTotal * 0.6) / 0.15;

            // Re-run offers logic locally for instant feedback
            const marketOffers = [
                { company: "Iberdrola", plan: "Plan Online", price_kwh: 0.11 },
                { company: "Endesa", plan: "Conecta", price_kwh: 0.10 },
                { company: "Naturgy", plan: "Tarifa Por Uso", price_kwh: 0.12 },
                { company: "TotalEnergies", plan: "A Tu Aire", price_kwh: 0.09 },
            ];

            let bestPrice = currentTotal;
            const newRecs = [];

            marketOffers.forEach(offer => {
                const estimatedCost = (estimatedKwh * offer.price_kwh) / 0.6;
                if (estimatedCost < currentTotal) {
                    newRecs.push({
                        company: offer.company,
                        offer: offer.plan,
                        price: estimatedCost,
                        savings: currentTotal - estimatedCost
                    });
                    if (estimatedCost < bestPrice) bestPrice = estimatedCost;
                }
            });

            newRecs.sort((a, b) => b.savings - a.savings);

            setRecommendations(newRecs.slice(0, 3));
            setPotentialSavings(currentTotal - bestPrice);
            setMarketAverage(currentTotal * 0.9);
            setScore(Math.min(100, Math.max(0, Math.round((bestPrice / currentTotal) * 100))));
        }
    }, [currentTotal]);

    const handleSaveTotal = () => {
        setIsEditing(false);
    };

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

            {/* Alert if OCR failed */}
            {!data.ocr_success && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                    <IconAlert className="text-yellow-500 w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-yellow-500">Atención: Lectura automática limitada</h4>
                        <p className="text-sm text-slate-300 mt-1">
                            Al subir una imagen, no podemos leer el importe exacto con precisión del 100%.
                            Por favor, <strong>confirma o corrige el importe total</strong> abajo para ver tu ahorro real.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Score Card */}
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <IconZap className="w-24 h-24" />
                    </div>
                    <h3 className="text-slate-400 font-medium mb-2">Puntuación</h3>
                    <div className="flex items-end gap-2">
                        <span className={`text-5xl font-bold ${score < 50 ? 'text-red-500' : score < 80 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {score}/100
                        </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                        {score < 50 ? 'Tu tarifa es muy mejorable.' : 'Tienes una tarifa aceptable.'}
                    </p>
                </div>

                {/* Savings Card */}
                <div className="glass-panel p-6 rounded-2xl border-green-500/30 bg-green-500/5">
                    <h3 className="text-green-400 font-medium mb-2">Ahorro Estimado</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold text-white">{potentialSavings.toFixed(2)}€</span>
                        <span className="text-lg text-green-400 mb-1">/ mes</span>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm text-green-400 bg-green-500/10 px-2 py-1 rounded">
                        <IconTrendingDown className="w-4 h-4" />
                        <span>{currentTotal > 0 ? Math.round((potentialSavings / currentTotal) * 100) : 0}% menos</span>
                    </div>
                </div>

                {/* Market Comparison (Editable) */}
                <div className="glass-panel p-6 rounded-2xl border-blue-500/20 relative">
                    <h3 className="text-slate-400 font-medium mb-4">Tu Factura Actual</h3>

                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-slate-500">Introduce el importe total de tu factura:</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={currentTotal}
                                    onChange={(e) => setCurrentTotal(parseFloat(e.target.value) || 0)}
                                    className="bg-slate-800 border border-blue-500 text-white text-2xl font-bold rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSaveTotal}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg font-medium transition"
                                >
                                    <IconCheck className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-end mb-4 group cursor-pointer" onClick={() => setIsEditing(true)}>
                            <div>
                                <span className="text-4xl font-bold text-white">{currentTotal.toFixed(2)}€</span>
                                <p className="text-xs text-blue-400 mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                    Clic para editar <IconZap className="w-3 h-3" />
                                </p>
                            </div>
                            <button className="text-slate-500 hover:text-white p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            </button>
                        </div>
                    )}

                    <div className="space-y-4 mt-4 pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>Media Mercado</span>
                                <span className="font-bold">{marketAverage.toFixed(2)}€</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(marketAverage / (currentTotal || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-green-400">Mejor oferta</span>
                                <span className="font-bold text-green-400">{(currentTotal - potentialSavings).toFixed(2)}€</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${((currentTotal - potentialSavings) / (currentTotal || 1)) * 100}%` }}></div>
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
                        {recommendations.map((rec, idx) => (
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

// --- Main App ---

const App = () => {
    const [view, setView] = useState('landing'); // landing, upload, analyzing, results
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);

    const handleStart = () => setView('upload');

    const handleUpload = async (uploadedFile) => {
        setFile(uploadedFile);
        setView('analyzing');

        // Simulate API call
        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            // Wait for animation to finish roughly (min 4s)
            setTimeout(() => {
                if (result.success) {
                    setData(result.data);
                    setView('results');
                }
            }, 4000);

        } catch (error) {
            console.error("Error analyzing:", error);
            // Handle error state
            setView('upload');
        }
    };

    const handleReset = () => {
        setFile(null);
        setData(null);
        setView('landing');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow relative">
                {view === 'landing' && <Hero onStart={handleStart} />}
                {view === 'upload' && <UploadStep onUpload={handleUpload} />}
                {view === 'analyzing' && <AnalyzingStep />}
                {view === 'results' && <Dashboard data={data} onReset={handleReset} />}
            </main>

            <footer className="py-8 text-center text-slate-600 text-sm">
                <p>© 2024 AnalizaMiFactura. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
