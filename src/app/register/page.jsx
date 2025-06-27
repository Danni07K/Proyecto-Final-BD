'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'estudiante'
  })
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [particles, setParticles] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  // Generate cursed energy particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.6 + 0.2
      }))
      setParticles(newParticles)
    }

    if (typeof window !== 'undefined') {
      generateParticles()
      
      // Handle window resize
      const handleResize = () => generateParticles()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    
    if (error) setError(null)
    
    // Email validation
    if (name === 'email') {
      setEmailValid(validateEmail(value))
    }
    
    // Password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
    
    // Password confirmation
    if (name === 'confirmPassword' || name === 'password') {
      const confirmValue = name === 'confirmPassword' ? value : form.confirmPassword
      const passwordValue = name === 'password' ? value : form.password
      setPasswordsMatch(confirmValue === passwordValue)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    
    if (!isFormValid()) {
      toast.error('Por favor, completa todos los campos correctamente')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rol: form.rol
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('¡Registro exitoso! Ahora puedes iniciar sesión')
        router.push('/login?registered=true')
      } else {
        const errorMessage = data.error || data.message || 'Error en el registro'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (err) {
      const errorMessage = 'Error de conexión. Verifica tu conexión a internet.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength += 1
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const isFormValid = () => {
    return form.nombre && 
           form.email && 
           form.password && 
           form.confirmPassword && 
           validateEmail(form.email) &&
           form.password.length >= 6 &&
           form.password === form.confirmPassword
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength <= 2) return 'bg-orange-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    if (passwordStrength <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Muy débil'
    if (passwordStrength <= 2) return 'Débil'
    if (passwordStrength <= 3) return 'Media'
    if (passwordStrength <= 4) return 'Fuerte'
    return 'Muy fuerte'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black text-white flex items-center justify-center px-4 relative overflow-hidden particles-bg">
      {/* Enhanced Cursed Energy Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="energy-particle"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity
            }}
            animate={{
              y: [0, -40, -80, -40, 0],
              x: [0, 20, -8, -25, 0],
              opacity: [particle.opacity, 1, 0.8, 0.95, particle.opacity],
              scale: [1, 1.2, 0.9, 1.1, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.form 
          onSubmit={handleSubmit} 
          className="glass-dark p-10 rounded-2xl shadow-jjk-lg space-y-6 border border-purple-500/30 relative"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* Enhanced cursed energy effect around form */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-yellow-500/20 to-purple-600/20 rounded-2xl blur-xl animate-pulse pointer-events-none"></div>
          
          <div className="relative z-10 text-center mb-8">
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="relative">
                <Image 
                  src="/logo-jujutsu-kaisen.jpg" 
                  width={72} 
                  height={72} 
                  alt="Logo" 
                  className="rounded-full border-2 border-yellow-500 shadow-lg hover-lift" 
                />
                <div className="absolute -inset-1 bg-yellow-500/20 rounded-full blur-lg animate-pulse"></div>
              </div>
            </motion.div>
            <motion.h1 
              className="text-4xl font-extrabold text-gradient mb-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Unirse a la Academia
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Comienza tu viaje como hechicero
            </motion.p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm relative z-10 flex items-center gap-2"
              >
                <span className="text-red-400">⚠️</span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative z-10"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-black/50 border-2 border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300 relative z-10"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="relative z-10"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg bg-black/50 border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 transition-all duration-300 relative z-10 ${
                  form.email && !emailValid ? 'border-red-500 focus:border-red-500' : 
                  form.email && emailValid ? 'border-green-500 focus:border-green-500' : 
                  'border-purple-700/50 focus:border-purple-500'
                }`}
              />
              {form.email && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-lg ${
                    emailValid ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {emailValid ? '✓' : '✗'}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="relative z-10"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-lg bg-black/50 border-2 border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300 relative z-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {form.password && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{getPasswordStrengthText()}</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="relative z-10"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 pr-12 rounded-lg bg-black/50 border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 transition-all duration-300 relative z-10 ${
                  form.confirmPassword && !passwordsMatch ? 'border-red-500 focus:border-red-500' : 
                  form.confirmPassword && passwordsMatch ? 'border-green-500 focus:border-green-500' : 
                  'border-purple-700/50 focus:border-purple-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
              {form.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute right-12 top-1/2 transform -translate-y-1/2 text-lg ${
                    passwordsMatch ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {passwordsMatch ? '✓' : '✗'}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="relative z-10"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rol
            </label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black/50 border-2 border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white transition-all duration-300 relative z-10"
            >
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
            </select>
          </motion.div>

          <motion.button
            type="submit"
            disabled={!isFormValid() || isLoading}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 relative z-10 ${
              isFormValid() && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-jjk'
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando cuenta...
              </div>
            ) : (
              'Crear Cuenta'
            )}
          </motion.button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            className="text-center relative z-10"
          >
            <p className="text-gray-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
                Inicia sesión aquí
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="text-center relative z-10"
          >
            <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm transition-colors duration-200">
              ← Volver al inicio
            </Link>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  )
}
