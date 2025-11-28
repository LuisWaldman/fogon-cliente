<template>
  <div class="about-container">
    <div class="header-section">
      <h1>🎭 Acerca del Fogón</h1>
      <p class="project-subtitle">
        Una plataforma digital para la educación y práctica musical
      </p>
    </div>

    <div class="content-grid">
      <div class="info-card">
        <div class="card-icon">👨🏻‍💻</div>
        <h2>Sobre el Desarrollador</h2>
        <div class="developer-info">
          <p>
            <strong>Luis Waldman</strong> - Desarrollador Full Stack y músico
            aficionado.
          </p>
          <p>
            Esta aplicación nace de la pasión por la música y la tecnología,
            desarrollada como <strong>Trabajo Profesional para la FIUBA</strong>
            (Facultad de Ingeniería - Universidad de Buenos Aires).
          </p>
          <p>
            La motivación principal fue crear una herramienta para compartir el
            conocimiento musical, usando tecnologías web modernas.
          </p>
        </div>
      </div>

      <div class="info-card">
        <div class="card-icon">🎯</div>
        <h2>Objetivos del Proyecto</h2>
        <ul class="objectives-list">
          <li>
            <strong>Educativo:</strong> Facilitar el aprendizaje musical para
            principiantes y estudiantes avanzados
          </li>
          <li>
            <strong>Inclusivo:</strong> Herramientas accesibles para orquestas,
            karaokes y músicos independientes
          </li>
          <li>
            <strong>Colaborativo:</strong> Plataforma para compartir y crear
            música en comunidad
          </li>
          <li>
            <strong>Tecnológico:</strong> Demostrar la aplicación de tecnologías
            web modernas en el ámbito musical
          </li>
        </ul>
      </div>

      <div class="info-card challenges-card">
        <div class="card-icon">⚡</div>
        <h2>Desafíos Técnicos Afrontados</h2>
        <div class="challenges-grid">
          <div class="challenge-item">
            <h4>🎼 Renderizado de Partituras</h4>
            <p>
              Integración de <strong>VexFlow</strong> para renderizar partituras
              musicales interactivas en tiempo real, con soporte para múltiples
              instrumentos y formatos.
            </p>
          </div>
          <div class="challenge-item">
            <h4>🎵 Procesamiento de Audio</h4>
            <p>
              Implementación de <strong>Tone.js</strong> para síntesis de audio,
              reproducción sincronizada y análisis de frecuencias para el
              afinador.
            </p>
          </div>
          <div class="challenge-item">
            <h4>📱 PWA (Progressive Web App)</h4>
            <p>
              Desarrollo de una aplicación web progresiva con
              <strong>Service Workers</strong>, caché offline y capacidades de
              instalación nativa.
            </p>
          </div>
          <div class="challenge-item">
            <h4>🔄 Sincronización Real-time</h4>
            <p>
              Uso de <strong>Socket.io</strong> para sesiones colaborativas en
              tiempo real y sincronización entre múltiples usuarios.
            </p>
          </div>
          <div class="challenge-item">
            <h4>🎹 Parseo de Formatos Musicales</h4>
            <p>
              Procesamiento de archivos <strong>MIDI</strong> y
              <strong>MusicXML</strong> para importar y exportar partituras en
              formatos estándar.
            </p>
          </div>
          <div class="challenge-item">
            <h4>🎨 Interfaz Adaptativa</h4>
            <p>
              Diseño <strong>responsive</strong> con Vue 3 y TypeScript,
              optimizado para dispositivos móviles y tablets.
            </p>
          </div>
        </div>
      </div>

      <div class="info-card tech-stack-card">
        <div class="card-icon">🛠️</div>
        <h2>Stack Tecnológico</h2>
        <div class="tech-categories">
          <div class="tech-category">
            <h4>Frontend</h4>
            <ul>
              <li>Vue 3 + TypeScript</li>
              <li>Vite + PWA Plugin</li>
              <li>Pinia (State Management)</li>
              <li>Vue Router</li>
            </ul>
          </div>
          <div class="tech-category">
            <h4>Audio & Music</h4>
            <ul>
              <li>Tone.js</li>
              <li>VexFlow</li>
              <li>@tonejs/midi</li>
              <li>fast-xml-parser</li>
            </ul>
          </div>
          <div class="tech-category">
            <h4>Conectividad</h4>
            <ul>
              <li>Socket.io</li>
              <li>WebRTC</li>
              <li>REST APIs</li>
              <li>WebSockets</li>
            </ul>
          </div>
          <div class="tech-category">
            <h4>Herramientas</h4>
            <ul>
              <li>ESLint + Prettier</li>
              <li>Vitest</li>
              <li>GitHub Pages</li>
              <li>Bootstrap Icons</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="info-card acknowledgments-card">
        <div class="card-icon">🙏</div>
        <h2>Agradecimientos</h2>
        <div class="acknowledgments-content">
          <div class="ack-section">
            <h4>📚 Académicos</h4>
            <ul>
              <li>
                <strong>Facultad de Ingeniería - UBA:</strong> Por la formación
                técnica y el marco académico
              </li>
              <li>
                <strong>Docentes y tutores:</strong> Por la guía y el apoyo
                durante el desarrollo
              </li>
              <li>
                <strong>Compañeros de carrera:</strong> Por las discusiones
                técnicas y el feedback
              </li>
            </ul>
          </div>
          <div class="ack-section">
            <h4>🎵 Musicales</h4>
            <ul>
              <li>
                <strong>Músicos y educadores:</strong> Que inspiraron las
                funcionalidades pedagógicas
              </li>
              <li>
                <strong>Comunidad open-source musical:</strong> Por las
                librerías y herramientas disponibles
              </li>
              <li>
                <strong>Repositorios de partituras:</strong> Por compartir el
                patrimonio musical
              </li>
            </ul>
          </div>
          <div class="ack-section">
            <h4>💻 Técnicos</h4>
            <ul>
              <li>
                <strong>Comunidad Vue.js:</strong> Por el framework y el
                ecosistema
              </li>
              <li>
                <strong>Desarrolladores de Tone.js y VexFlow:</strong> Por las
                herramientas fundamentales
              </li>
              <li><strong>GitHub:</strong> Por el hosting y la colaboración</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-section">
      <div class="university-info">
        <a href="https://fi.uba.ar/" target="_blank" rel="noopener">
          <img
            src="https://fi.uba.ar/images/logo-fiuba.png"
            alt="FIUBA Logo"
            class="university-logo"
          />
        </a>
        <p>
          <strong>Trabajo Profesional - FIUBA 2024</strong><br />
          Facultad de Ingeniería - Universidad de Buenos Aires
        </p>
      </div>

      <div class="repositories-section">
        <h3>📚 Repositorios del Proyecto</h3>
        <div class="repo-links">
          <a
            href="https://github.com/LuisWaldman/fogon-cliente"
            target="_blank"
            rel="noopener"
            class="repo-link"
          >
            <div class="repo-icon">🌐</div>
            <div class="repo-info">
              <strong>Cliente (Frontend)</strong>
              <span>Vue 3 + TypeScript + PWA</span>
            </div>
          </a>
          <a
            href="https://github.com/LuisWaldman/fogon-servidor"
            target="_blank"
            rel="noopener"
            class="repo-link"
          >
            <div class="repo-icon">⚙️</div>
            <div class="repo-info">
              <strong>Servidor (Backend)</strong>
              <span>Node.js + Socket.io + APIs</span>
            </div>
          </a>
        </div>
      </div>

      <div class="contact-info">
        <p class="version-info">
          <strong>Versión:</strong> {{ version }} |
          <strong>Última actualización:</strong>
          Noviembre 2024
        </p>
        <p class="dedication">
          <em
            >"Dedicado a todos los músicos que encuentran en la tecnología una
            herramienta para crear y aprender"</em
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Obtener versión desde el package.json a través de vite.config.ts
declare const __APP_VERSION__: string
const version = __APP_VERSION__
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #1a1a1a;
  color: #e0e0e0;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  color: #e0e0e0;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid #4a5568;
}

.header-section h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
  font-weight: bold;
  color: #a0aec0;
}

.project-subtitle {
  font-size: 1.2em;
  margin: 0;
  opacity: 0.8;
  color: #cbd5e0;
}

.content-grid {
  display: grid;
  gap: 30px;
  margin-bottom: 40px;
}

.info-card {
  background: #2d3748;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid #4a5568;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  border-color: #6366f1;
}

.card-icon {
  font-size: 3em;
  text-align: center;
  margin-bottom: 20px;
}

.info-card h2 {
  color: #a0aec0;
  margin-bottom: 20px;
  font-size: 1.5em;
  text-align: center;
  border-bottom: 2px solid #6366f1;
  padding-bottom: 10px;
}

.developer-info p {
  font-size: 1.1em;
  line-height: 1.6;
  color: #cbd5e0;
  margin-bottom: 15px;
}

.objectives-list {
  list-style: none;
  padding: 0;
}

.objectives-list li {
  padding: 12px 0;
  border-bottom: 1px solid #4a5568;
  font-size: 1.05em;
  line-height: 1.5;
  color: #e0e0e0;
}

.objectives-list li:last-child {
  border-bottom: none;
}

.objectives-list li:before {
  content: '✓';
  color: #10b981;
  font-weight: bold;
  margin-right: 10px;
}

.challenges-card {
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
}

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.challenge-item {
  background: #1e293b;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-left: 4px solid #6366f1;
  border: 1px solid #475569;
}

.challenge-item h4 {
  color: #a0aec0;
  margin-bottom: 10px;
  font-size: 1.1em;
}

.challenge-item p {
  color: #cbd5e0;
  line-height: 1.5;
  font-size: 0.95em;
}

.tech-stack-card {
  background: linear-gradient(135deg, #065f46 0%, #064e3b 100%);
}

.tech-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.tech-category {
  background: #1e293b;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid #475569;
}

.tech-category h4 {
  color: #10b981;
  margin-bottom: 15px;
  font-size: 1.1em;
  text-align: center;
  border-bottom: 2px solid #10b981;
  padding-bottom: 5px;
}

.tech-category ul {
  list-style: none;
  padding: 0;
}

.tech-category li {
  padding: 5px 0;
  color: #cbd5e0;
  font-size: 0.95em;
}

.tech-category li:before {
  content: '▸';
  color: #10b981;
  margin-right: 8px;
}

.acknowledgments-card {
  background: linear-gradient(135deg, #92400e 0%, #78350f 100%);
}

.acknowledgments-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.ack-section {
  background: #1e293b;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid #475569;
}

.ack-section h4 {
  color: #f59e0b;
  margin-bottom: 15px;
  font-size: 1.1em;
  border-bottom: 2px solid #f59e0b;
  padding-bottom: 5px;
}

.ack-section ul {
  list-style: none;
  padding: 0;
}

.ack-section li {
  padding: 8px 0;
  color: #cbd5e0;
  line-height: 1.4;
  font-size: 0.95em;
}

.ack-section li:before {
  content: '💙';
  margin-right: 8px;
}

.footer-section {
  background: #2d3748;
  padding: 40px;
  border-radius: 15px;
  border: 1px solid #4a5568;
}

.university-info {
  text-align: center;
  margin-bottom: 30px;
}

.university-logo {
  max-height: 80px;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
}

.university-logo:hover {
  transform: scale(1.05);
}

.repositories-section {
  margin-bottom: 30px;
}

.repositories-section h3 {
  text-align: center;
  color: #a0aec0;
  margin-bottom: 20px;
}

.repo-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.repo-link {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #1e293b;
  border-radius: 10px;
  text-decoration: none;
  color: #e0e0e0;
  border: 1px solid #475569;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.repo-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  color: #8b5cf6;
  text-decoration: none;
  border-color: #6366f1;
}

.repo-icon {
  font-size: 2em;
  margin-right: 15px;
}

.repo-info {
  display: flex;
  flex-direction: column;
}

.repo-info strong {
  font-size: 1.1em;
  margin-bottom: 5px;
}

.repo-info span {
  color: #cbd5e0;
  font-size: 0.9em;
}

.contact-info {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #4a5568;
}

.version-info {
  color: #cbd5e0;
  font-size: 0.9em;
  margin-bottom: 15px;
}

.dedication {
  color: #a0aec0;
  font-size: 1.1em;
  font-style: italic;
  margin: 0;
}

@media (max-width: 768px) {
  .about-container {
    padding: 15px;
  }

  .header-section {
    padding: 20px;
  }

  .header-section h1 {
    font-size: 2em;
  }

  .info-card {
    padding: 20px;
  }

  .challenges-grid,
  .tech-categories,
  .acknowledgments-content,
  .repo-links {
    grid-template-columns: 1fr;
  }

  .footer-section {
    padding: 20px;
  }
}
</style>
