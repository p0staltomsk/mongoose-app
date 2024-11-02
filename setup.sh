#!/bin/bash

# Initialize git
# git init

# Initialize project with Bun
#bun init -y

# Install dependencies
bun add three @types/three mongoose express @types/express \
    react react-dom @types/react @types/react-dom \
    vite @vitejs/plugin-react typescript @types/node \
    tailwindcss postcss autoprefixer \
    @shadcn/ui class-variance-authority clsx tailwind-merge \
    lucide-react

# Create project structure
mkdir -p src/{models,components,api,db,assets,styles,utils}

# Create base files
cat > src/models/element.ts << 'EOL'
import * as mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  atomicNumber: { type: Number, required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  atomicMass: { type: Number, required: true },
  category: { type: String, required: true },
  color: { type: String },
  description: { type: String },
  customProperties: { type: Map, of: mongoose.Schema.Types.Mixed }
});

export const Element = mongoose.model('Element', elementSchema);
EOL

cat > src/db/connection.ts << 'EOL'
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/periodic-table');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
EOL

cat > src/components/PeriodicTable.tsx << 'EOL'
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

const PeriodicTable: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Three.js initialization code will go here
    const init = async () => {
      // Initialize scene, camera, renderer
    };

    init();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen">
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default PeriodicTable;
EOL

cat > src/api/elements.ts << 'EOL'
import express from 'express';
import { Element } from '../models/element';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const elements = await Element.find();
    res.json(elements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
EOL

cat > src/App.tsx << 'EOL'
import React from 'react';
import PeriodicTable from './components/PeriodicTable';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <PeriodicTable />
    </div>
  );
};

export default App;
EOL

cat > src/main.tsx << 'EOL'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOL

# Create Vite config
cat > vite.config.ts << 'EOL'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
EOL

# Create TypeScript config
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOL

# Create TypeScript Node config
cat > tsconfig.node.json << 'EOL'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOL

# Setup Tailwind CSS
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

cat > postcss.config.js << 'EOL'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

# Create global styles
cat > src/styles/globals.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
EOL

# Update package.json scripts
cat > package.json << 'EOL'
{
  "name": "threejs-periodic",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "server": "bun run src/api/server.ts"
  }
}
EOL

# Create simple server file
cat > src/api/server.ts << 'EOL'
import express from 'express';
import connectDB from '../db/connection';
import elementsRouter from './elements';

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use('/api/elements', elementsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
EOL

# Create README
cat > README.md << 'EOL'
# Three.js Periodic Table

An interactive 3D periodic table built with Three.js, React, and MongoDB.

## Setup

1. Install dependencies:
```bash
bun install
```

2. Start MongoDB service

3. Start the development server:
```bash
bun run dev
```

4. Start the API server:
```bash
bun run server
```

## Features

- 3D interactive periodic table
- Multiple view modes (Table, Sphere, Helix)
- Element details on hover/click
- Custom animations and transitions
EOL

# Make the setup script executable
chmod +x setup.sh

# Initialize git repository
git add .
git commit -m "Initial project setup"

echo "Project setup complete! 🚀"
echo "To get started:"
echo "1. cd $PROJECT_NAME"
echo "2. bun install"
echo "3. bun run dev"
echo "4. In a separate terminal: bun run server"