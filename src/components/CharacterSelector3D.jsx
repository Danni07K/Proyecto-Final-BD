'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

const CharacterSelector3D = ({ onCharacterSelect }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(0)

  const characters = [
    {
      name: 'Yuji Itadori',
      rarity: 'legendary',
      sketchfab: 'https://sketchfab.com/models/8ae59b5a207041999f30b54813d19106/embed',
      description: 'Estudiante de Jujutsu con increíble fuerza física y resistencia.',
      abilities: ['Divergent Fist', 'Black Flash', 'Sukuna\'s Techniques'],
      color: 'from-red-500 to-orange-600'
    },
    {
      name: 'Satoru Gojo',
      rarity: 'mythic',
      sketchfab: 'https://sketchfab.com/models/1cf90882c2e64074ab62d766ad77d6c4/embed',
      description: 'El hechicero más fuerte, maestro de las técnicas del Infinito.',
      abilities: ['Infinity', 'Blue', 'Red', 'Purple'],
      color: 'from-blue-400 to-purple-600'
    },
    {
      name: 'Megumi Fushiguro',
      rarity: 'epic',
      sketchfab: 'https://sketchfab.com/models/b4073ce4c95c4e46abf3825a0207eaf8/embed',
      description: 'Usuario de las Técnicas de las Sombras y Ten Shadows Technique.',
      abilities: ['Ten Shadows Technique', 'Domain Expansion', 'Shadow Manipulation'],
      color: 'from-gray-600 to-black'
    },
    {
      name: 'Nobara Kugisaki',
      rarity: 'rare',
      sketchfab: 'https://sketchfab.com/models/d9ceed236ec1482cabdf293bb1aae573/embed',
      description: 'Especialista en técnicas de maldición usando martillos y clavos.',
      abilities: ['Straw Doll Technique', 'Resonance', 'Hairpin'],
      color: 'from-pink-400 to-red-500'
    },
    {
      name: 'Yuta Okkotsu',
      rarity: 'legendary',
      sketchfab: 'https://sketchfab.com/models/24f9ddc6d6124095a7989188ac28254f/embed',
      description: 'Usuario de Copy Technique y Rika, el espíritu maldito.',
      abilities: ['Copy Technique', 'Rika', 'Reverse Cursed Technique'],
      color: 'from-green-400 to-blue-500'
    },
    {
      name: 'Suguru Geto',
      rarity: 'mythic',
      sketchfab: 'https://sketchfab.com/models/b8109dde1ac04b87b76eaa984a60cafc/embed',
      description: 'Maestro de las técnicas de maldición y control de espíritus.',
      abilities: ['Cursed Spirit Manipulation', 'Uzumaki', 'Maximum: Uzumaki'],
      color: 'from-purple-600 to-black'
    }
  ]

  const handleCharacterChange = (index) => {
    setSelectedCharacter(index)
  }

  const handleSelectCharacter = () => {
    onCharacterSelect?.(characters[selectedCharacter])
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 h-full flex">
        {/* Left Panel - Character List */}
        <div className="w-80 bg-black/20 backdrop-blur-md border-r border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Seleccionar Personaje
          </h2>
          
          <div className="space-y-3">
            {characters.map((character, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCharacterChange(index)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedCharacter === index
                    ? 'bg-gradient-to-r from-purple-600/50 to-blue-600/50 border-2 border-white/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${character.color}`} />
                  <div>
                    <h3 className="text-white font-semibold">{character.name}</h3>
                    <p className="text-gray-300 text-sm capitalize">{character.rarity}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center Panel - Sketchfab 3D Viewer */}
        <div className="flex-1 relative flex items-center justify-center bg-transparent">
          <iframe
            title={characters[selectedCharacter].name}
            src={characters[selectedCharacter].sketchfab + '?autostart=1&ui_infos=0&ui_controls=0&ui_watermark=0'}
            frameBorder="0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
            allowFullScreen
            style={{ width: '100%', height: '100%', minHeight: 500, border: 'none', borderRadius: '16px', background: 'transparent' }}
          ></iframe>
        </div>

        {/* Right Panel - Character Details */}
        <div className="w-96 bg-black/20 backdrop-blur-md border-l border-white/10 p-6">
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Detalles del Personaje
            </h2>
            
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {characters[selectedCharacter].name}
                </h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${characters[selectedCharacter].color} text-white mb-3`}>
                  {characters[selectedCharacter].rarity.toUpperCase()}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {characters[selectedCharacter].description}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Habilidades</h4>
                <div className="space-y-2">
                  {characters[selectedCharacter].abilities.map((ability, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-gray-300 text-sm">{ability}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Select Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSelectCharacter}
              className={`w-full py-4 rounded-lg font-bold text-white text-lg bg-gradient-to-r ${characters[selectedCharacter].color} hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300`}
            >
              Seleccionar Personaje
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterSelector3D