# 3D Periodic Table Visualization 🌌

<div align="center">
  <img src="https://user-images.githubusercontent.com/709451/182802334-d9c42afe-f35d-4a7b-86ea-9985f73f20c3.png" width="100" alt="Bun" />
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAACiCAMAAAD84hF6AAAAjVBMVEUAAAD..." width="100" alt="Three.js" />
</div>

An interactive 3D visualization of the periodic table using modern web technologies.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Three.js** for 3D visualization
- **Vite** for blazing-fast development
- **TailwindCSS** for styling

### Backend
- **Bun** - next-gen JavaScript runtime
- **Express** - web framework
- **MongoDB** with Mongoose
- **TypeScript** for type safety

## ✨ Features

- 🎮 Interactive 3D visualization
- 🔄 Multiple view modes:
  - Classic Table
  - Sphere Formation
  - Helix Structure
  - Grid Layout
  - ❤️‍🔥 Special Heart Animation
- 🎯 Real-time transitions and animations
- 🌈 Particle effects and visual enhancements
- 📱 Responsive design
- 🔍 Element details on hover

## 🛠 Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start MongoDB:
```bash
sudo systemctl start mongodb
```

3. Initialize database:
```bash
pnpm run initdb
```

4. Start development servers:
```bash
# Terminal 1 - API Server
pnpm run server

# Terminal 2 - Frontend Dev Server
pnpm run dev
```

## 🏗 Project Structure

```
project/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # UI components
│   │   └── 3d/            # Three.js components
│   ├── data/              # Static data
│   ├── models/            # Mongoose models
│   ├── api/               # Express routes
│   ├── db/                # Database config
│   ├── styles/            # CSS styles
│   └── types/             # TypeScript types
├── public/                # Static assets
└── config/               # Config files
```

## 🔧 Development

- `pnpm dev` - Start frontend development server
- `pnpm server` - Start API server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm format` - Format code

## 🌟 Special Features

### Heart Animation Mode ❤️‍🔥
- Dynamic particle effects
- Pulsating animation
- Random element distribution
- Color transitions

### Performance Optimizations
- Efficient particle system
- Optimized Three.js rendering
- Smooth transitions
- Memory management

## 📚 API Documentation

### Endpoints
- `GET /api/elements` - Get all elements
- `POST /api/elements` - Add custom element
- `PUT /api/elements/:id` - Update element
- `DELETE /api/elements/:id` - Delete element

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT