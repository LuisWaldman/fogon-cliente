<template>
  <div class="divBienvenida">
    <div class="welcome-header">
      <h1>🎵 Bienvenido al Fogón 🎵</h1>
      <p class="subtitle">
        Tu plataforma digital para estudiar, crear, compartir y disfrutar la
        música
      </p>
    </div>

    <div class="intro-section">
      <h2>La musica como un sistema distribuido</h2>
      <p>
        Tanenbaum y Van Steen definen: "Un sistema distribuido es una colección
        de computadoras independientes que aparece ante sus usuarios como un
        sistema único y coherente" (1)
      </p>
      <p>
        Cuando varios musicos tocan juntos se organizan para combinar armonias,
        melodias y ritmos de modo que los escuchen como un sistema unico y
        coherente.
      </p>
      <p>
        Para hacer estos los musicos se nutren de protocolos y mecanismos de
        coordinacion que les permiten sincronizarse y compartir informacion.
      </p>
      <p>
        El Fogon es un sistema distribuido para ayudar a los musicos en esos
        quehaceres.
      </p>
      <p></p>
      <p class="getting-started">
        <strong>¡Comencemos!</strong> Te recomendamos completar tu perfil,
        ajustar la vista y afinar tu instrumento antes de empezar.
      </p>
      <div class="reference">
        <p>
          (1) Andrew S. Tanenbaum y Maarten Van Steen (2007, Distributed
          Systems: Principles and Paradigms)
        </p>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🎼</div>
        <h3>Tocar y Cantar</h3>
        <p>Reproduce canciones con acompañamiento musical:</p>
        <ul class="feature-list">
          <li>
            <a href="/tocar?cancion=andres-calamaro_flaca"
              >"Flaca" - Andrés Calamaro</a
            >
          </li>
          <li>
            <a href="/tocar?cancion=sui-generis_botas-locas"
              >"Botas Locas" - Sui Generis</a
            >
          </li>
          <li>
            <a href="/tocar?cancion=ruben-rada_quien-va-a-cantar"
              >"Quién va a cantar" - Rubén Rada</a
            >
          </li>
        </ul>
      </div>

      <div class="feature-card">
        <div class="feature-icon">📝</div>
        <h3>Partituras Interactivas</h3>
        <p>Visualiza y estudia partituras con múltiples instrumentos:</p>
        <ul class="feature-list">
          <li>"Danubio Azul" - Johann Strauss</li>
          <li>"Por Una Cabeza" - Carlos Gardel</li>
          <li>"Adiós Nonino" - Astor Piazzolla</li>
          <li>"Vals de las Flores" - Tchaikovsky</li>
        </ul>
        <p><strong>Plus:</strong> Edita partituras existentes o crea nuevas</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🔍</div>
        <h3>Búsqueda Avanzada</h3>
        <p>Encuentra canciones por criterios musicales específicos:</p>
        <ul class="feature-list">
          <li>"Canciones de Calamaro en Re mayor a 120 bpm"</li>
          <li>"Tangos en Do menor"</li>
          <li>"Rock en Mi menor a 100 bpm"</li>
          <li>"Baladas lentas en Sol mayor"</li>
        </ul>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎛️</div>
        <h3>Herramientas Musicales</h3>
        <ul class="feature-list">
          <li>
            <strong>Afinador:</strong> Mantén tu instrumento perfectamente
            afinado
          </li>
          <li>
            <strong>Control de tempo:</strong> Ajusta la velocidad de
            reproducción
          </li>
          <li>
            <strong>Transposición:</strong> Cambia la tonalidad según tu
            necesidad
          </li>
          <li>
            <strong>Metrónomo integrado:</strong> Practica con el tempo correcto
          </li>
        </ul>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🌐</div>
        <h3>Funciones Colaborativas</h3>
        <p>Conectándote a un servidor, podrás:</p>
        <ul class="feature-list">
          <li>🎵 Tocar canciones de otros usuarios</li>
          <li>📋 Compartir y ver listas de reproducción</li>
          <li>👥 Participar en sesiones colaborativas</li>
          <li>💾 Sincronizar tu biblioteca musical</li>
          <li>📊 Ver estadísticas de tu progreso</li>
        </ul>
      </div>

      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3>Aplicación Progresiva</h3>
        <ul class="feature-list">
          <li>
            <strong>Funciona offline:</strong> Accede a tu música sin conexión
          </li>
          <li><strong>Instalable:</strong> Úsala como app nativa</li>
          <li>
            <strong>Responsive:</strong> Perfecta en cualquier dispositivo
          </li>
          <li>
            <strong>Rendimiento optimizado:</strong> Carga rápida y fluida
          </li>
        </ul>
      </div>
    </div>

    <div class="call-to-action">
      <h3>🎯 ¿Por dónde empezar?</h3>
      <div class="steps">
        <div class="step">
          <span class="step-number">1</span>
          Complete su <a href="/configurar?viendo=perfil">perfil</a>
        </div>
        <div class="step">
          <span class="step-number">2</span>
          Afine su instrumento en la sección
          <a href="/configurar?viendo=afinar">Afinar</a>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          Explore el <a href="/buscar">catálogo de canciones</a>
        </div>
        <div class="step">
          <span class="step-number">4</span>
          ¡Comience a <a href="/">tocar y disfrutar</a>!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic required for this static component
</script>

<style scoped>
.divBienvenida {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #1a1a1a;
  color: #e0e0e0;
}

.welcome-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  color: #e0e0e0;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid #4a5568;
}

.welcome-header h1 {
  margin: 0;
  font-size: 2.5em;
  font-weight: bold;
  color: #a0aec0;
}

.subtitle {
  font-size: 1.2em;
  margin: 10px 0 0 0;
  opacity: 0.8;
  color: #cbd5e0;
}

.intro-section {
  background: #2d3748;
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 30px;
  border-left: 4px solid #6366f1;
  border: 1px solid #4a5568;
}

.intro-section p {
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 15px;
  color: #e0e0e0;
}

.getting-started {
  background: #1e293b;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #6366f1;
  border: 1px solid #475569;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.feature-card {
  background: #2d3748;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  border: 1px solid #4a5568;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  border-color: #6366f1;
}

.feature-icon {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 15px;
}

.feature-card h3 {
  color: #a0aec0;
  margin-bottom: 15px;
  font-size: 1.3em;
  text-align: center;
}

.feature-card p {
  color: #cbd5e0;
  line-height: 1.5;
  margin-bottom: 15px;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 8px 0;
  border-bottom: 1px solid #4a5568;
  display: flex;
  align-items: center;
  color: #e0e0e0;
}

.feature-list li:last-child {
  border-bottom: none;
}

.feature-list li:before {
  content: '♪';
  color: #6366f1;
  font-weight: bold;
  margin-right: 10px;
}

.feature-list a {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.feature-list a:hover {
  color: #a78bfa;
  text-decoration: underline;
}

.call-to-action {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  color: #e0e0e0;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  border: 1px solid #6366f1;
}

.call-to-action h3 {
  margin-bottom: 25px;
  font-size: 1.5em;
  color: #a0aec0;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.step {
  background: rgba(99, 102, 241, 0.1);
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  border: 1px solid #4a5568;
}

.step-number {
  background: #6366f1;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.step a {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: bold;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.step a:hover {
  border-bottom-color: #8b5cf6;
  color: #a78bfa;
}

@media (max-width: 768px) {
  .welcome-header h1 {
    font-size: 2em;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .steps {
    grid-template-columns: 1fr;
  }

  .divBienvenida {
    padding: 15px;
  }
}
</style>
