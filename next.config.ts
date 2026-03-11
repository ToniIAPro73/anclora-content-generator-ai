import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración necesaria para evitar que Webpack intercepte los módulos node nativos
  // de Transformers.js si se despliega en Edge, forzando WASM puro.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    }
    return config
  },
};

export default nextConfig;
