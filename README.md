# 🎮 ClassCraft - Jujutsu Kaisen RPG 3D

Una aplicación educativa gamificada inspirada en Jujutsu Kaisen con personajes 3D interactivos y una tienda de accesorios avanzada.

## ✨ Características Principales

### 🎯 Selección de Personajes 3D
- **Personajes de Jujutsu Kaisen**: Gojo, Yuji, Megumi, Nobara
- **Controles avanzados de cámara**:
  - Modo Órbita: Rotación suave con mouse
  - Modo Libre: Movimiento WASD + rotación QE
  - Modo Cinemático: Cámara automática
- **Efectos visuales profesionales**:
  - Auras de energía personalizadas
  - Partículas flotantes
  - Efectos de selección con shake de cámara
  - Estadísticas detalladas de cada personaje

### 🛍️ Tienda 3D Ultra Profesional
- **Accesorios rotables 3D** con controles de mouse
- **Sistema de rarezas**:
  - 🌟 Legendario (Dorado)
  - 💫 Épico (Púrpura)
  - ⭐ Raro (Azul)
  - ⚪ Común (Gris)
- **Efectos especiales**:
  - Portales dimensionales para items legendarios
  - Partículas de energía para épicos y legendarios
  - Auras dinámicas según rareza
- **Vista dual**: 3D Showcase + Grid tradicional

### 🎨 Efectos Visuales Avanzados
- **Partículas de energía** flotantes
- **Ondas de energía** con shaders personalizados
- **Niebla atmosférica** para ambiente
- **Post-procesamiento** profesional
- **Auras dinámicas** alrededor de objetos
- **Rayos de energía** animados
- **Explosiones de energía** con efectos de escala
- **Portales dimensionales** con shaders complejos

### 🎮 Controles de Cámara Profesionales
- **Movimiento WASD**: Navegación libre en 3D
- **Rotación QE**: Control preciso de ángulo
- **Reset R**: Volver a posición inicial
- **Zoom con rueda**: Aproximación suave
- **Damping**: Movimiento fluido y natural

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animaciones**: Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **Autenticación**: JWT
- **Efectos**: Shaders personalizados, Post-procesamiento

## 🎯 Características Técnicas

### Sistema 3D Avanzado
```javascript
// Controles de cámara personalizados
<AdvancedCameraControls 
  target={[0, 0, 0]}
  distance={8}
  minDistance={3}
  maxDistance={15}
  enableDamping={true}
  dampingFactor={0.05}
  autoRotate={cameraMode === 'cinematic'}
/>
```

### Efectos Visuales con Shaders
```javascript
// Shader personalizado para ondas de energía
vertexShader={`
  uniform float time;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    float elevation = sin(pos.x * 2.0 + time) * sin(pos.z * 2.0 + time) * 0.1;
    pos.y += elevation;
    vElevation = elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`}
```

### Sistema de Partículas
```javascript
// Partículas de energía dinámicas
<EnergyParticles 
  count={50} 
  color="#8b5cf6" 
/>
```

## 🎮 Cómo Usar

### Selección de Personajes
1. **Navega** con el mouse o teclado (WASD)
2. **Selecciona** un personaje haciendo click
3. **Cambia modo cámara** según prefieras:
   - Orbit: Para exploración suave
   - Free: Para control total
   - Cinematic: Para presentación automática
4. **Confirma** tu selección

### Tienda 3D
1. **Explora** los accesorios rotando la vista
2. **Selecciona** un item para ver detalles
3. **Comprar** con un click
4. **Cambia vista** entre 3D y Grid

## 🎨 Personalización

### Colores de Aura por Personaje
- **Gojo**: Azul (#3b82f6)
- **Yuji**: Rojo (#ef4444)
- **Megumi**: Gris oscuro (#1f2937)
- **Nobara**: Rosa (#ec4899)

### Efectos por Rareza
- **Legendario**: Portal dimensional + partículas
- **Épico**: Partículas de energía
- **Raro**: Aura básica
- **Común**: Sin efectos especiales

## 🔧 Instalación

```bash
# Clonar repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## 📱 Responsive Design

La aplicación es completamente responsive y funciona en:
- 🖥️ Desktop (experiencia completa 3D)
- 📱 Tablet (controles adaptados)
- 📱 Mobile (vista simplificada)

## 🎯 Próximas Características

- [ ] Modelos 3D reales de personajes
- [ ] Animaciones de personajes
- [ ] Sistema de combate 3D
- [ ] Efectos de sonido 3D
- [ ] Multiplayer en tiempo real
- [ ] VR/AR support

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**¡Domina las técnicas de Jujutsu Kaisen en esta experiencia 3D inmersiva!** 🎮✨

**supabase --> jujutsu-kaisen-chat**
**organización: DanielKea**
**password: Samsung_A51SWAQ**

# Classcraft App - Plataforma Educativa Gamificada (Jujutsu Kaisen)

¡Bienvenido a la plataforma educativa gamificada inspirada en Jujutsu Kaisen! Este sistema permite a profesores y estudiantes interactuar en un entorno épico, con selección de personajes 3D, chat en tiempo real, tienda de accesorios, sistema de clases, calificaciones y mucho más.

---

## 🚀 **Flujo de Usuario**

### **Estudiante**
1. Se une a la clase con un código único.
2. Selecciona su personaje 3D (con animaciones y efectos visuales).
3. Ingresa al **lobby de la clase**:
   - Ve a los estudiantes conectados (con badge animado y efectos visuales).
   - Puede chatear en tiempo real (texto y emojis, con efectos de sonido).
   - Ve el historial de todos los estudiantes de la clase (aunque no estén conectados).
   - Recibe feedback visual y sonoro al entrar/salir usuarios y al enviar mensajes.
   - Si se pierde la conexión, ve un mensaje claro y el sistema intenta reconectar automáticamente.

### **Profesor**
- Puede ver en tiempo real quién está conectado y el historial de la clase.
- Puede interactuar en el chat y usar la presencia para dinámicas de clase.

---

## 🛠️ **Tecnologías Usadas**
- **Next.js** (SSR, API routes, frontend React)
- **MongoDB** (persistencia de usuarios, clases y chat)
- **socket.io** (chat y presencia en tiempo real)
- **Framer Motion, Tailwind, react-hot-toast, use-sound** (animaciones, estilos y feedback visual/sonoro)
- **Custom server** para unificar todo en un solo proceso y puerto

---

## ⚡ **Comandos de Desarrollo y Producción**

### **Desarrollo**
```bash
npm run custom-dev
```

### **Producción**
```bash
npm run build
npm run custom-start
```

- El servidor escucha en el puerto `3005` por defecto (puedes cambiarlo con la variable de entorno `PORT`).
- Asegúrate de tener tu `MONGODB_URI` en `.env.local` o `.env.production`.

---

## 📁 **Archivos y Recursos**
- Los sonidos y avatares deben estar en la carpeta `public/`.
- El custom server está en `server.js`.
- El lobby y chat en tiempo real están en `src/app/clases/lobby.jsx`.
- El endpoint de API para el lobby está en `src/app/api/clases/lobby/route.js`.

---

## 🌐 **Recomendaciones para Despliegue**
- Para producción, usa un VPS, EC2, Heroku, Railway, Render, etc., que soporte custom servers Node.js.
- Si usas Vercel, asegúrate de que tu plan y configuración permitan custom servers (o usa un backend separado para socket.io).

---

## 🎨 **Experiencia de Usuario**
- Estilo visual y animaciones inspiradas en Jujutsu Kaisen.
- Feedback visual y sonoro en cada acción importante.
- Experiencia ultra profesional, fluida y lógica, similar a plataformas como Kahoot pero con un toque único.

---

## 📝 **Notas Finales**
- El sistema es 100% reversible: cualquier cambio puede ser revertido si se detecta un error.
- El código está optimizado para robustez, escalabilidad y presentación profesional.

---

¡Disfruta la experiencia y demuestra tu poder como hechicero en el aula! 🧙‍♂️✨
