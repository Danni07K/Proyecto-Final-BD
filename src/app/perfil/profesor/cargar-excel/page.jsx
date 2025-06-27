'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function CargarExcelPage() {
  const [clases, setClases] = useState([])
  const [claseSeleccionada, setClaseSeleccionada] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [datosExcel, setDatosExcel] = useState([])
  const [cargando, setCargando] = useState(false)
  const [resultados, setResultados] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    cargarClases()
  }, [])

  const cargarClases = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/clases', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setClases(data)
    }
  }

  const reproducirSonido = () => {
    if (!audioEnabled) return
    
    try {
      const audio = new Audio('/sounds/energia-maldita.mp3')
      audio.volume = 0.6
      audio.play().catch(err => {
        console.log('Audio no pudo reproducirse:', err)
      })
    } catch (error) {
      console.log('Error al reproducir audio:', error)
    }
  }

  const habilitarAudio = () => {
    setAudioEnabled(true)
    // Reproducir un sonido silencioso para activar el audio
    const audio = new Audio()
    audio.play().then(() => {
      toast.success('🔊 Audio habilitado')
    }).catch(() => {
      toast.error('❌ No se pudo habilitar el audio')
    })
  }

  const procesarArchivo = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error('Solo se permiten archivos CSV o Excel')
      return
    }

    setArchivo(file)
    
    // Simular lectura del archivo (en producción usarías una librería como xlsx)
    const reader = new FileReader()
    reader.onload = (e) => {
      const contenido = e.target.result
      const lineas = contenido.split('\n')
      const datos = lineas.slice(1).filter(linea => linea.trim()).map(linea => {
        const [nombre, email] = linea.split(',').map(campo => campo.trim())
        return { nombre, email }
      }).filter(estudiante => estudiante.nombre && estudiante.email)
      
      setDatosExcel(datos)
      toast.success(`Se encontraron ${datos.length} estudiantes en el archivo`)
    }
    reader.readAsText(file)
  }

  const cargarEstudiantes = async () => {
    if (!claseSeleccionada) {
      toast.error('Selecciona una clase')
      return
    }

    if (datosExcel.length === 0) {
      toast.error('No hay datos para cargar')
      return
    }

    setCargando(true)
    reproducirSonido()

    const token = localStorage.getItem('token')

    try {
      const res = await fetch('/api/usuarios/cargar-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          estudiantes: datosExcel,
          claseId: claseSeleccionada
        })
      })

      const data = await res.json()

      if (res.ok) {
        setResultados(data.resultados)
        toast.success(data.mensaje)
        
        // Limpiar formulario
        setArchivo(null)
        setDatosExcel([])
        setClaseSeleccionada('')
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Error al cargar estudiantes')
    } finally {
      setCargando(false)
    }
  }

  const descargarPlantilla = () => {
    const plantilla = 'nombre,email\nJuan Pérez,juan@ejemplo.com\nMaría García,maria@ejemplo.com'
    const blob = new Blob([plantilla], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plantilla-estudiantes.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-6">
      {/* Header con efectos de energía maldita */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-4 drop-shadow-2xl">
          📊 CARGA MASIVA DE ESTUDIANTES 📊
        </h1>
        <p className="text-xl text-purple-300">
          Invoca estudiantes con el poder de la energía maldita
        </p>
        
        {/* Botón para habilitar audio */}
        {!audioEnabled && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={habilitarAudio}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            🔊 Habilitar Efectos de Sonido
          </motion.button>
        )}
      </motion.div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Panel de Carga */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-purple-400 mb-6">⚡ Panel de Carga</h2>
          
          {/* Selector de Clase */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Clase Destino</label>
            <select
              value={claseSeleccionada}
              onChange={(e) => setClaseSeleccionada(e.target.value)}
              className="w-full bg-black border border-purple-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            >
              <option value="">Selecciona una clase</option>
              {clases.map(clase => (
                <option key={clase._id} value={clase._id}>
                  {clase.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Área de Archivo */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Archivo Excel/CSV</label>
            <div className="border-2 border-dashed border-purple-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={procesarArchivo}
                className="hidden"
                id="archivo-input"
              />
              <label htmlFor="archivo-input" className="cursor-pointer">
                <div className="text-4xl mb-4">📁</div>
                <p className="text-purple-300 font-semibold">
                  {archivo ? archivo.name : 'Haz clic para seleccionar archivo'}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Soporta archivos CSV y Excel
                </p>
              </label>
            </div>
          </div>

          {/* Botón de Descarga de Plantilla */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={descargarPlantilla}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all mb-4"
          >
            📥 Descargar Plantilla CSV
          </motion.button>

          {/* Botón de Carga */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={cargarEstudiantes}
            disabled={cargando || !claseSeleccionada || datosExcel.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {cargando ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                Cargando estudiantes...
              </span>
            ) : (
              '⚡ ¡CARGAR ESTUDIANTES!'
            )}
          </motion.button>

          {/* Vista Previa */}
          {datosExcel.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-purple-400 mb-3">👥 Vista Previa ({datosExcel.length} estudiantes)</h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {datosExcel.slice(0, 5).map((estudiante, index) => (
                  <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="font-bold">{estudiante.nombre}</p>
                    <p className="text-sm text-gray-400">{estudiante.email}</p>
                  </div>
                ))}
                {datosExcel.length > 5 && (
                  <p className="text-center text-gray-500 text-sm">
                    ... y {datosExcel.length - 5} más
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Panel de Resultados */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-purple-400 mb-6">📈 Resultados de Carga</h2>

          <AnimatePresence>
            {resultados ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-6"
              >
                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-900/30 p-4 rounded-lg border border-green-500 text-center">
                    <p className="text-3xl font-bold text-green-400">{resultados.exitosos.length}</p>
                    <p className="text-sm text-gray-400">Exitosos</p>
                  </div>
                  <div className="bg-red-900/30 p-4 rounded-lg border border-red-500 text-center">
                    <p className="text-3xl font-bold text-red-400">{resultados.errores.length}</p>
                    <p className="text-sm text-gray-400">Errores</p>
                  </div>
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500 text-center">
                    <p className="text-3xl font-bold text-purple-400">{resultados.total}</p>
                    <p className="text-sm text-gray-400">Total</p>
                  </div>
                </div>

                {/* Estudiantes Exitosos */}
                {resultados.exitosos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-green-400 mb-3">✅ Estudiantes Cargados</h3>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {resultados.exitosos.map((estudiante, index) => (
                        <div key={index} className="p-2 bg-green-900/20 rounded border border-green-500">
                          <p className="font-bold text-sm">{estudiante.nombre}</p>
                          <p className="text-xs text-gray-400">{estudiante.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Errores */}
                {resultados.errores.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-3">❌ Errores</h3>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {resultados.errores.map((error, index) => (
                        <div key={index} className="p-2 bg-red-900/20 rounded border border-red-500">
                          <p className="font-bold text-sm">{error.estudiante.nombre}</p>
                          <p className="text-xs text-red-300">{error.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón para limpiar */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setResultados(null)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  🗑️ Limpiar Resultados
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-8xl mb-6">📊</div>
                <p className="text-gray-400 text-lg">Los resultados aparecerán aquí</p>
                <p className="text-gray-500 text-sm mt-2">Después de cargar el archivo</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
} 