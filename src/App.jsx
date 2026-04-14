import React, { useState, useEffect } from 'react';
import './App.css';

// Generador del Cielo Profundo
const StarField = () => {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    // Colores estelares: Blancas, Azules, Rojos, Verdes esmeraldas, Amarillos
    const starColors = ['#ffffff', '#ffffff', '#ffffff', '#6eb5ff', '#ff7eb3', '#8affb1', '#ffebb0'];
    const generated = Array.from({ length: 250 }).map(() => ({
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      size: Math.random() * 2 + 1 + 'px',
      opacity: Math.random() * 0.7 + 0.3,
      animationDelay: Math.random() * 5 + 's',
      color: starColors[Math.floor(Math.random() * starColors.length)]
    }));
    setStars(generated);
  }, []);

  return (
    <div className="star-layer">
      {stars.map((s, i) => (
        <div key={i} className="tiny-star" 
             style={{ 
               left: s.left, top: s.top, 
               width: s.size, height: s.size, 
               opacity: s.opacity, 
               animationDelay: s.animationDelay,
               backgroundColor: s.color,
               boxShadow: `0 0 8px ${s.color}`
             }}>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [typedChars, setTypedChars] = useState('');
  const [cloudMessage, setCloudMessage] = useState(null);
  const [isExploding, setIsExploding] = useState(false);
  
  // Estado para el Gatito Explorador
  const [catState, setCatState] = useState({ active: false, position: 'bottom' });

  // Lógica de la palabra secreta "NOVA"
  useEffect(() => {
    if (!isUnlocked || isExploding) return;
    const handleKeyDown = (e) => {
      const newChars = (typedChars + e.key).toUpperCase();
      setTypedChars(newChars.slice(-4));
      
      if (newChars.includes('NOVA')) {
        setIsExploding(true);
        setTypedChars('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedChars, isUnlocked, isExploding]);

  // Lógica del Gatito Escurridizo (Solo 1 segundo, solo abajo/lados inferiores)
  useEffect(() => {
    if (!isUnlocked) return;
    const catInterval = setInterval(() => {
      const positions = ['bottom', 'bottom-left', 'bottom-right'];
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      setCatState({ active: true, position: randomPos });
      
      // El gatito se esconde rápido (1 segundo)
      setTimeout(() => {
        setCatState({ active: false, position: randomPos });
      }, 2000);
    }, 12000);

    return () => clearInterval(catInterval);
  }, [isUnlocked]);

  // Función de la Alerta
  const enviarAlerta = async () => {
    try {
      await fetch('https://ntfy.sh/refugio_kevin_2026', {
        method: 'POST',
        body: 'Alerta: Necesito compañía en el refugio.',
        headers: { 'Title': 'Señal de Alerta' }
      });
      setCloudMessage("Señal enviada. Estoy contigo.");
    } catch (e) { 
      setCloudMessage("Hubo un error de conexión, pero escríbeme directamente al WhatsApp.");
    }
  };

  const activarInterruptor = () => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 3000);
  };

  // --- PANTALLA DE BLOQUEO ---
  if (!isUnlocked) {
    return (
      <div className="login-screen">
        <StarField />
        <div className="login-content">
          <h2 className="login-title">¿Qué dice la llave?</h2>
          <input 
            type="text" 
            className="key-input"
            placeholder=". . ."
            onChange={(e) => {
              if (e.target.value.toLowerCase() === 'stay alive') {
                setIsUnlocked(true);
              }
            }} 
          />
        </div>
      </div>
    );
  }

  // --- EL REFUGIO ---
  return (
    <div className={`refuge-container ${isGlowing ? 'glow-active' : ''} ${isExploding ? 'shake-active' : ''}`}>
      <StarField />

      {/* EFECTO SUPERNOVA */}
      {isExploding && (
        <div className="supernova-explosion">
          <div className="explosion-core"></div>
          <div className="explosion-text">
            <h2>SUPERNOVA</h2>
            <p>Vaya, has descifrado el corazón del refugio.</p>
            <p className="prize-text">Te acabas de ganar un almuerzo o un poshito cuando quieras </p>
            <button className="cloud-btn" onClick={() => setIsExploding(false)}>Reclamar premio</button>
          </div>
        </div>
      )}

      {/* NUBE DE MENSAJES MODAL */}
      {cloudMessage && (
        <div className="cloud-overlay">
          <div className="cloud-box">
            <p>{cloudMessage}</p>
            <button className="cloud-btn" onClick={() => setCloudMessage(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* INTERRUPTOR FÍSICO */}
      <div className="mechanical-switch" onClick={activarInterruptor} title="Interruptor">
        <div className={`switch-toggle ${isGlowing ? 'toggle-on' : ''}`}></div>
      </div>

      {/* MENSAJES DEL INTERRUPTOR */}
      <div className={`secret-messages ${isGlowing ? 'visible' : ''}`}>
        <p className="msg msg-1">Kevin estuvo aquí</p>
        <p className="msg msg-2">Hackeada master</p>
        <p className="msg msg-3">¿Qué haces husmeando por aquí?.</p>
      </div>

      {/* EASTER EGGS ASTRONÓMICOS */}
      <div className="easter-egg voyager" onClick={() => setCloudMessage("La sonda Voyager 1 lleva casi 50 años viajando sola en la oscuridad del espacio, y aún así, sigue encontrando la forma de enviar una señal a casa.")}>🛰️</div>
      <div className="easter-egg binary-stars" onClick={() => setCloudMessage("Más de la mitad de las estrellas no están solas; son sistemas binarios que orbitan juntas para darse luz y estabilidad a través del vacío.")}>
        <div className="star-a"></div><div className="star-b"></div>
      </div>

      {/* EL GATITO EXPLORADOR */}
      <div 
        className={`cat-explorer cat-${catState.position} ${catState.active ? 'cat-active' : ''}`}
        onClick={() => setCloudMessage("Miau. Me encontraste. Toma captura y mándamela, te debo unas papitas con mayonesa.")}
      >
        🐱
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-content">
        <h1 className="refuge-title">Para Janne</h1>
        
        <div className="poem">
          <p>Sé que a veces la cor<span className={isGlowing ? 'highlight' : ''}>n</span>isa llama con voz de viento,</p>
          <p>y el vacío parece un lugar donde por fin descansar.</p>
          <p>Las sombras toman forma cuando el cuarto está en silencio,</p>
          <p>y tu mente es un teatro que no puedes apagar.</p>
          <br/>
          <p>No eres la noche que a veces te c<span className={isGlowing ? 'highlight' : ''}>o</span>nsume,</p>
          <p>ni eres el eco de esa falsa oscuridad.</p>
          <p>Eres la chispa que sobre<span className={isGlowing ? 'highlight' : ''}>v</span>ive a la bruma,</p>
          <p>un universo entero luch<span className={isGlowing ? 'highlight' : ''}>a</span>ndo por su propia claridad.</p>
          <br/>
          <p>Que este refugio te espere en la calma o en la tormenta,</p>
          <p>como un ancla de papel si el suelo empieza a ceder.</p>
          <p>Porque el peso del invierno a tu fuego no lo ahuyenta,</p>
          <p>y por las grietas del miedo siempre vuelves a florecer.</p>
          <br/>
          <p className="poem-footer">Y nunca lo olvides: estoy contigo en la oscuridad.</p>
        </div>

        <div className="emergency-section">
          <button className="big-red-btn" onClick={enviarAlerta}>
            PRESIÓNAME<br/>EMERGENCIA
          </button>
          <p className="explainer-text">
            Cuando lo presiones me llegará una notificación diciéndome que me necesitas y ahí estaré.
          </p>
        </div>

        <div className="riddle-section">
          <p className="hint-text">
            El universo empezó con una explosión...<br/>pero este refugio se enciende si la escribes en el aire.
          </p>
          <p className="sub-hint">escribe la palabra secreta</p>
        </div>
      </div>
    </div>
  );
}

export default App;