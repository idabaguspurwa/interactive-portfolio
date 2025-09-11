'use client'

import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'

export default function StardewFarmBackground() {
  // Detailed building component with unique designs for each type
  const PixelBuilding = ({ type, x, y, width, height, label }) => {
    
    const renderFarmhouse = () => (
      <>
        {/* Shadow */}
        <div className="absolute right-[-3px] bottom-[-3px] w-full h-full bg-[#5D1A1A] z-0" />
        
        {/* Main Structure */}
        <div className="relative z-10 w-full h-full">
          {/* Chimney */}
          <div className="absolute left-[15%] top-[5%] w-[12%] h-[25%] bg-[#8B4513] border border-[#654321]" />
          
          {/* Main Roof */}
          <div className="absolute top-[20%] w-full h-[25%] bg-[#B22222] border-b-2 border-[#8B0000]" />
          
          {/* Roof Trim */}
          <div className="absolute top-[42%] w-full h-[3%] bg-[#654321]" />
          
          {/* Main Walls */}
          <div className="absolute top-[45%] w-full h-[55%] bg-[#DEB887]">
            {/* Door */}
            <div className="absolute left-[40%] top-[30%] w-[20%] h-[70%] bg-[#8B4513] border border-[#654321]" />
            {/* Door Handle */}
            <div className="absolute left-[56%] top-[55%] w-[2%] h-[3%] bg-[#FFD700]" />
            
            {/* Windows */}
            <div className="absolute left-[15%] top-[25%] w-[15%] h-[20%] bg-[#87CEEB] border border-[#4682B4]" />
            <div className="absolute left-[70%] top-[25%] w-[15%] h-[20%] bg-[#87CEEB] border border-[#4682B4]" />
            
            {/* Window Crosses */}
            <div className="absolute left-[21%] top-[25%] w-[3%] h-[20%] bg-[#654321]" />
            <div className="absolute left-[15%] top-[33%] w-[15%] h-[2%] bg-[#654321]" />
            <div className="absolute left-[76%] top-[25%] w-[3%] h-[20%] bg-[#654321]" />
            <div className="absolute left-[70%] top-[33%] w-[15%] h-[2%] bg-[#654321]" />
          </div>
        </div>
      </>
    )

    const renderBarn = () => (
      <>
        {/* Shadow */}
        <div className="absolute right-[-3px] bottom-[-3px] w-full h-full bg-[#704214] z-0" />
        
        {/* Main Structure */}
        <div className="relative z-10 w-full h-full">
          {/* Roof Peak */}
          <div className="absolute top-[10%] left-[20%] w-[60%] h-[30%] bg-[#8B0000] transform origin-bottom" 
               style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }} />
          
          {/* Main Roof */}
          <div className="absolute top-[35%] w-full h-[20%] bg-[#CD5C5C]" />
          
          {/* Barn Walls */}
          <div className="absolute top-[55%] w-full h-[45%] bg-[#DEB887]">
            {/* Big Barn Door */}
            <div className="absolute left-[25%] top-[20%] w-[50%] h-[80%] bg-[#8B4513] border-2 border-[#654321]">
              {/* Door Planks */}
              <div className="absolute top-[10%] w-full h-[2%] bg-[#654321]" />
              <div className="absolute top-[30%] w-full h-[2%] bg-[#654321]" />
              <div className="absolute top-[50%] w-full h-[2%] bg-[#654321]" />
              <div className="absolute top-[70%] w-full h-[2%] bg-[#654321]" />
            </div>
            
            {/* Side Window */}
            <div className="absolute left-[5%] top-[25%] w-[15%] h-[25%] bg-[#87CEEB] border border-[#4682B4]" />
            
            {/* Weather Vane Base */}
            <div className="absolute left-[48%] top-[-45%] w-[4%] h-[15%] bg-[#696969]" />
          </div>
        </div>
      </>
    )

    const renderCoop = () => (
      <>
        {/* Shadow */}
        <div className="absolute right-[-2px] bottom-[-2px] w-full h-full bg-[#A0672A] z-0" />
        
        {/* Main Structure */}
        <div className="relative z-10 w-full h-full">
          {/* Triangular Roof */}
          <div className="absolute top-[15%] w-full h-[35%] bg-[#CD853F]" 
               style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }} />
          
          {/* Coop Walls */}
          <div className="absolute top-[50%] w-full h-[50%] bg-[#F5DEB3]">
            {/* Small Door */}
            <div className="absolute left-[35%] top-[40%] w-[30%] h-[60%] bg-[#8B4513] border border-[#654321]" />
            
            {/* Nesting Box */}
            <div className="absolute left-[5%] top-[20%] w-[25%] h-[30%] bg-[#DEB887] border border-[#CD853F]" />
            
            {/* Small Window */}
            <div className="absolute left-[75%] top-[25%] w-[20%] h-[20%] bg-[#87CEEB] border border-[#4682B4]" />
            
            {/* Chicken Ramp */}
            <div className="absolute left-[35%] top-[100%] w-[30%] h-[10%] bg-[#DEB887]" />
          </div>
        </div>
      </>
    )

    const renderGreenhouse = () => (
      <>
        {/* Shadow */}
        <div className="absolute right-[-2px] bottom-[-2px] w-full h-full bg-[#1F5F1F] z-0" />
        
        {/* Main Structure */}
        <div className="relative z-10 w-full h-full">
          {/* Glass Roof */}
          <div className="absolute top-[10%] w-full h-[40%] bg-[#98FB98] border-2 border-[#228B22] opacity-80">
            {/* Roof Supports */}
            <div className="absolute left-[25%] top-0 w-[2%] h-full bg-[#228B22]" />
            <div className="absolute left-[50%] top-0 w-[2%] h-full bg-[#228B22]" />
            <div className="absolute left-[75%] top-0 w-[2%] h-full bg-[#228B22]" />
          </div>
          
          {/* Glass Walls */}
          <div className="absolute top-[50%] w-full h-[50%] bg-[#98FB98] border-2 border-[#228B22] opacity-80">
            {/* Door */}
            <div className="absolute left-[40%] top-[30%] w-[20%] h-[70%] bg-[#228B22] border border-[#006400]" />
            
            {/* Glass Panels */}
            <div className="absolute left-[5%] top-[10%] w-[25%] h-[80%] border border-[#228B22]" />
            <div className="absolute left-[70%] top-[10%] w-[25%] h-[80%] border border-[#228B22]" />
            
            {/* Vertical Supports */}
            <div className="absolute left-[30%] top-0 w-[2%] h-full bg-[#228B22]" />
            <div className="absolute left-[70%] top-0 w-[2%] h-full bg-[#228B22]" />
          </div>
        </div>
      </>
    )

    const renderSilo = () => (
      <>
        {/* Shadow */}
        <div className="absolute right-[-2px] bottom-[-2px] w-full h-full bg-[#556B2F] z-0" />
        
        {/* Main Structure */}
        <div className="relative z-10 w-full h-full">
          {/* Conical Top */}
          <div className="absolute top-[5%] left-[10%] w-[80%] h-[25%] bg-[#696969]" 
               style={{ clipPath: 'polygon(15% 100%, 50% 0%, 85% 100%)' }} />
          
          {/* Cylindrical Body */}
          <div className="absolute top-[25%] left-[15%] w-[70%] h-[75%] bg-[#C0C0C0] border-2 border-[#808080]">
            {/* Horizontal Bands */}
            <div className="absolute top-[20%] w-full h-[2%] bg-[#808080]" />
            <div className="absolute top-[40%] w-full h-[2%] bg-[#808080]" />
            <div className="absolute top-[60%] w-full h-[2%] bg-[#808080]" />
            <div className="absolute top-[80%] w-full h-[2%] bg-[#808080]" />
            
            {/* Access Hatch */}
            <div className="absolute left-[30%] top-[30%] w-[40%] h-[15%] bg-[#696969] border border-[#2F4F4F]" />
          </div>
        </div>
      </>
    )

    const renderShed = () => (
      <>
        {/* Shadow */}
        <div className="absolute right-[-2px] bottom-[-2px] w-full h-full bg-[#654321] z-0" />
        
        {/* Main Structure */}
        <div className="relative z-10 w-full h-full">
          {/* Simple Slanted Roof */}
          <div className="absolute top-[15%] w-full h-[25%] bg-[#8B4513]" />
          
          {/* Shed Walls */}
          <div className="absolute top-[40%] w-full h-[60%] bg-[#DEB887]">
            {/* Double Door */}
            <div className="absolute left-[20%] top-[25%] w-[25%] h-[75%] bg-[#8B4513] border border-[#654321]" />
            <div className="absolute left-[45%] top-[25%] w-[25%] h-[75%] bg-[#8B4513] border border-[#654321]" />
            
            {/* Door Handles */}
            <div className="absolute left-[42%] top-[55%] w-[2%] h-[4%] bg-[#FFD700]" />
            <div className="absolute left-[48%] top-[55%] w-[2%] h-[4%] bg-[#FFD700]" />
            
            {/* Small Window */}
            <div className="absolute left-[75%] top-[30%] w-[20%] h-[25%] bg-[#87CEEB] border border-[#4682B4]" />
          </div>
        </div>
      </>
    )

    const renderSlimeHutch = () => (
      <>
        {/* Shadow */}
        <div className="absolute right-[-3px] bottom-[-3px] w-full h-full bg-[#2F4F2F] z-0" />
        
        {/* Main Structure */}
        <div className="relative z-10 w-full h-full">
          {/* Rounded Roof */}
          <div className="absolute top-[10%] w-full h-[35%] bg-[#6B8E23] rounded-t-full" />
          
          {/* Hutch Walls */}
          <div className="absolute top-[45%] w-full h-[55%] bg-[#9ACD32]">
            {/* Slime Door */}
            <div className="absolute left-[35%] top-[30%] w-[30%] h-[70%] bg-[#228B22] border-2 border-[#006400] rounded-lg" />
            
            {/* Slime Window (green tinted) */}
            <div className="absolute left-[5%] top-[25%] w-[25%] h-[30%] bg-[#90EE90] border-2 border-[#228B22]" />
            <div className="absolute left-[70%] top-[25%] w-[25%] h-[30%] bg-[#90EE90] border-2 border-[#228B22]" />
            
            {/* Slime Drips */}
            <div className="absolute left-[10%] top-[100%] w-[3%] h-[5%] bg-[#32CD32] rounded-full" />
            <div className="absolute left-[50%] top-[100%] w-[4%] h-[8%] bg-[#32CD32] rounded-full" />
            <div className="absolute left-[80%] top-[100%] w-[3%] h-[6%] bg-[#32CD32] rounded-full" />
          </div>
        </div>
      </>
    )

    const buildingRenderers = {
      farmhouse: renderFarmhouse,
      barn: renderBarn,
      coop: renderCoop,
      greenhouse: renderGreenhouse,
      silo: renderSilo,
      shed: renderShed,
      slimehutch: renderSlimeHutch,
      mill: renderShed // Use shed design for mill for now
    }

    const renderer = buildingRenderers[type] || buildingRenderers.shed

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: Math.random() * 0.3 }}
            whileHover={{ scale: 1.02, y: -1 }}
            className="absolute cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${width}px`,
              height: `${height}px`,
              imageRendering: 'pixelated'
            }}
          >
            {renderer()}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  // Animated swaying crop component
  const PixelCrop = ({ type, x, y, size = 16 }) => {
    const cropColors = {
      cauliflower: '#F5F5DC',
      parsnip: '#FFFACD', 
      potato: '#DEB887',
      kale: '#228B22',
      tulip: '#FF69B4',
      jazz: '#9370DB',
      starfruit: '#FFD700',
      ancient: '#8A2BE2'
    }

    const randomDelay = Math.random() * 2
    const randomDuration = 2 + Math.random() * 2

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotate: [0, 8, -8, 0], // More visible swaying
          y: [0, -3, 0], // More noticeable movement
          x: [0, 2, -2, 0] // Side to side swaying
        }}
        transition={{ 
          opacity: { duration: 0.2, delay: Math.random() * 0.5 },
          scale: { duration: 0.2, delay: Math.random() * 0.5 },
          rotate: { 
            duration: 2 + Math.random(), 
            delay: randomDelay, 
            repeat: Infinity, 
            ease: "easeInOut" 
          },
          y: { 
            duration: 1.5 + Math.random(), 
            delay: randomDelay, 
            repeat: Infinity, 
            ease: "easeInOut" 
          },
          x: { 
            duration: 3 + Math.random(), 
            delay: randomDelay + 0.2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        }}
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: cropColors[type] || '#32CD32',
          imageRendering: 'pixelated',
          boxShadow: `1px 1px 0px rgba(0,0,0,0.3)`,
          transformOrigin: 'bottom center'
        }}
      />
    )
  }

  // Animated farm animal component
  const FarmAnimal = ({ type, startX, startY, endX, endY, speed = 20 }) => {
    const animalColors = {
      chicken: '#FFFFFF',
      cow: '#8B4513',
      pig: '#FFC0CB',
      sheep: '#F5F5DC'
    }

    const animalSize = type === 'chicken' ? 16 : 24

    return (
      <motion.div
        initial={{ 
          x: `${startX}%`, 
          y: `${startY}%`,
          opacity: 0
        }}
        animate={{ 
          x: [`${startX}%`, `${endX}%`, `${startX}%`],
          y: [`${startY}%`, `${endY}%`, `${startY}%`],
          opacity: [0, 1, 1, 1, 0]
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
        className="absolute z-10"
        style={{
          width: `${animalSize}px`,
          height: `${animalSize}px`,
          backgroundColor: animalColors[type],
          imageRendering: 'pixelated',
          borderRadius: '1px',
          boxShadow: '1px 1px 0px rgba(0,0,0,0.3)'
        }}
      />
    )
  }

  // Floating particle component (pollen, dust, leaves)
  const FloatingParticle = ({ type, x, y }) => {
    const particleColors = {
      pollen: '#FFD700',
      dust: '#DEB887',
      leaf: '#228B22',
      sparkle: '#FFFFFF'
    }

    const randomDelay = Math.random() * 3
    const randomDuration = 3 + Math.random() * 4

    return (
      <motion.div
        initial={{ 
          opacity: 0,
          scale: 0
        }}
        animate={{ 
          opacity: [0, 0.8, 0],
          scale: [0, 1, 0],
          y: [-20, -40, -60],
          x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20]
        }}
        transition={{
          duration: randomDuration,
          delay: randomDelay,
          repeat: Infinity,
          ease: "easeOut"
        }}
        className="absolute pointer-events-none"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: '4px',
          height: '4px',
          backgroundColor: particleColors[type],
          imageRendering: 'pixelated',
          borderRadius: type === 'sparkle' ? '50%' : '1px'
        }}
      />
    )
  }

  // Weather effect component (light rain or wind)
  const WeatherEffect = () => {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={`weather-${i}`}
            initial={{ 
              x: `${Math.random() * 100}%`,
              y: '-10px',
              opacity: 0
            }}
            animate={{ 
              x: `${Math.random() * 100 + 10}%`,
              y: '110%',
              opacity: [0, 0.3, 0.3, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              delay: Math.random() * 6,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-0.5 h-8 bg-blue-200/30"
            style={{
              transform: 'rotate(15deg)'
            }}
          />
        ))}
      </div>
    )
  }

  // Farm layout based on your actual screenshot
  const farmBuildings = [
    { type: 'farmhouse', x: 5, y: 75, width: 80, height: 60, label: 'Farmhouse' },
    { type: 'greenhouse', x: 15, y: 15, width: 64, height: 48, label: 'Greenhouse' },
    { type: 'barn', x: 35, y: 25, width: 72, height: 56, label: 'Barn' },
    { type: 'coop', x: 55, y: 15, width: 56, height: 40, label: 'Coop' },
    { type: 'silo', x: 45, y: 35, width: 24, height: 48, label: 'Silo' },
    { type: 'mill', x: 65, y: 30, width: 40, height: 40, label: 'Mill' }
  ]

  // Farm animals moving around the farm
  const farmAnimals = [
    { type: 'chicken', startX: 55, startY: 25, endX: 65, endY: 35, speed: 8 },
    { type: 'chicken', startX: 60, startY: 20, endX: 50, endY: 30, speed: 10 },
    { type: 'cow', startX: 35, startY: 35, endX: 45, endY: 45, speed: 12 },
    { type: 'pig', startX: 40, startY: 30, endX: 30, endY: 40, speed: 9 },
    { type: 'sheep', startX: 20, startY: 60, endX: 30, endY: 50, speed: 11 }
  ]

  // Floating particles for atmosphere
  const particles = [
    // Pollen from flowers
    { type: 'pollen', x: 25, y: 65 },
    { type: 'pollen', x: 30, y: 70 },
    { type: 'pollen', x: 28, y: 68 },
    // Dust from pathways
    { type: 'dust', x: 45, y: 50 },
    { type: 'dust', x: 55, y: 45 },
    { type: 'dust', x: 35, y: 55 },
    // Sparkles from crops
    { type: 'sparkle', x: 75, y: 60 },
    { type: 'sparkle', x: 80, y: 65 },
    { type: 'sparkle', x: 85, y: 70 },
    // Leaves from trees
    { type: 'leaf', x: 15, y: 55 },
    { type: 'leaf', x: 18, y: 58 }
  ]

  // Crop field based on your farm - right side dense crops
  const cropField = []
  for (let x = 70; x < 95; x += 2) {
    for (let y = 45; y < 85; y += 2) {
      const crops = ['cauliflower', 'parsnip', 'kale', 'starfruit', 'ancient']
      cropField.push({
        type: crops[Math.floor(Math.random() * crops.length)],
        x: x,
        y: y
      })
    }
  }

  // Authentic Stardew Valley UI stats (top right)
  const gameUIStats = [
    { 
      type: 'date',
      value: 'Sat. 6',
      bgColor: '#8B4513', // Brown wood background
      textColor: '#FFFFFF'
    },
    { 
      type: 'season',
      value: 'Fall Year 2',
      bgColor: '#CD853F', // Fall orange background  
      textColor: '#FFFFFF'
    },
    { 
      type: 'gold',
      prefix: 'G',
      value: '99185',
      bgColor: '#FFD700', // Gold background
      textColor: '#000000'
    }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ imageRendering: 'pixelated' }}>
      {/* Layer 1: Base terrain */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#DEB887', // Sandy dirt color
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #CD853F 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #A0522D 1px, transparent 1px),
            linear-gradient(45deg, transparent 48%, rgba(139, 69, 19, 0.1) 49%, rgba(139, 69, 19, 0.1) 51%, transparent 52%)
          `,
          backgroundSize: '32px 32px, 16px 16px, 8px 8px'
        }}
      />

      {/* Layer 2: Animated grass patches */}
      <div className="absolute inset-0 z-1">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={`grass-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              scale: [0.8, 1, 0.8],
              rotate: [0, 2, -1, 0]
            }}
            transition={{ 
              duration: 4 + Math.random() * 2, 
              delay: i * 0.02,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${8 + Math.random() * 16}px`,
              height: `${8 + Math.random() * 16}px`,
              backgroundColor: '#228B22',
              imageRendering: 'pixelated',
              borderRadius: '1px',
              transformOrigin: 'bottom center'
            }}
          />
        ))}
      </div>

      {/* Layer 3: Stone pathways */}
      <div className="absolute inset-0 z-2 pointer-events-none">
        {/* Animated horizontal path */}
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={`path-h-${i}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="absolute"
            style={{
              left: `${20 + i * 2}%`,
              top: '50%',
              width: '16px',
              height: '16px',
              backgroundColor: '#A9A9A9',
              imageRendering: 'pixelated',
              boxShadow: '1px 1px 0px rgba(0,0,0,0.3)'
            }}
          />
        ))}
        
        {/* Animated vertical path */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={`path-v-${i}`}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 + 1 }}
            className="absolute"
            style={{
              left: '50%',
              top: `${30 + i * 2}%`,
              width: '16px',
              height: '16px',
              backgroundColor: '#A9A9A9',
              imageRendering: 'pixelated',
              boxShadow: '1px 1px 0px rgba(0,0,0,0.3)'
            }}
          />
        ))}
      </div>

      {/* Layer 4: Swaying crops */}
      <div className="absolute inset-0 z-3">
        {cropField.map((crop, index) => (
          <PixelCrop
            key={`crop-${index}`}
            type={crop.type}
            x={crop.x}
            y={crop.y}
            size={12}
          />
        ))}
      </div>

      {/* Layer 5: Farm buildings */}
      <TooltipProvider>
        <div className="absolute inset-0 z-4">
          {farmBuildings.map((building, index) => (
            <PixelBuilding
              key={building.label}
              type={building.type}
              x={building.x}
              y={building.y}
              width={building.width}
              height={building.height}
              label={building.label}
            />
          ))}
        </div>
      </TooltipProvider>

      {/* Layer 6: Moving farm animals */}
      <div className="absolute inset-0 z-5">
        {farmAnimals.map((animal, index) => (
          <FarmAnimal
            key={`animal-${index}`}
            type={animal.type}
            startX={animal.startX}
            startY={animal.startY}
            endX={animal.endX}
            endY={animal.endY}
            speed={animal.speed}
          />
        ))}
      </div>

      {/* Layer 7: Floating particles */}
      <div className="absolute inset-0 z-6">
        {particles.map((particle, index) => (
          <FloatingParticle
            key={`particle-${index}`}
            type={particle.type}
            x={particle.x}
            y={particle.y}
          />
        ))}
      </div>

      {/* Layer 8: Weather effects */}
      <div className="absolute inset-0 z-7">
        <WeatherEffect />
      </div>

      {/* Layer 9: Authentic Stardew Valley UI */}
      <div className="absolute top-4 right-4 z-20 space-y-1">
        {gameUIStats.map((stat, index) => (
          <motion.div
            key={stat.type}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: 1
            }}
            transition={{ 
              duration: 0.5, 
              delay: 1.2 + index * 0.2,
              ease: "backOut"
            }}
            className="relative"
          >
            {/* Game UI Panel Background */}
            <div 
              className="relative px-3 py-2 shadow-xl"
              style={{
                backgroundColor: stat.bgColor,
                border: '2px solid #654321', // Brown border like game UI
                borderRadius: '4px',
                minWidth: '120px',
                imageRendering: 'pixelated',
                boxShadow: `
                  2px 2px 0px rgba(0,0,0,0.5),
                  inset 1px 1px 0px rgba(255,255,255,0.3),
                  inset -1px -1px 0px rgba(0,0,0,0.3)
                `
              }}
            >
              {/* Inner shadow for depth */}
              <div 
                className="absolute inset-1"
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '2px',
                  pointerEvents: 'none'
                }}
              />
              
              {/* Content */}
              <div className="relative z-10">
                {stat.type === 'gold' ? (
                  <div className="flex items-center justify-center gap-1">
                    <span 
                      className="text-lg font-bold"
                      style={{ 
                        color: stat.textColor,
                        fontFamily: 'monospace',
                        textShadow: '1px 1px 0px rgba(0,0,0,0.3)'
                      }}
                    >
                      {stat.prefix}
                    </span>
                    <span 
                      className="text-sm font-bold"
                      style={{ 
                        color: stat.textColor,
                        fontFamily: 'monospace',
                        textShadow: '1px 1px 0px rgba(0,0,0,0.3)'
                      }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div 
                      className="text-sm font-bold leading-tight"
                      style={{ 
                        color: stat.textColor,
                        fontFamily: 'monospace',
                        textShadow: stat.textColor === '#FFFFFF' ? '1px 1px 0px rgba(0,0,0,0.8)' : '1px 1px 0px rgba(255,255,255,0.5)'
                      }}
                    >
                      {stat.value}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Layer 10: Content readability overlay */}
      <div className="absolute inset-0 z-30 bg-black/10 dark:bg-black/20 pointer-events-none" />
    </div>
  )
}