// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'


const htmlPlugin = (env) => {
    return {
        name: 'html-transform',
        transformIndexHtml: (html) =>
            html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match),
    }
}

export default defineConfig(({ mode }) => {
    return {
        base: './',
        assetsInclude: [
            '**/*.glb',
            '**/*.gltf',
            '**/*.fbx',
            '**/*.mp4',
            '**/*.webp',
            '**/*.png',
            '**/*.jpg',
        ],
        optimizeDeps: {
            exclude: ['@zappar/zappar-threejs', '@zappar/zappar-cv'],
            include: ['ua-parser-js'],
        },
        plugins: [
            basicSsl(),
            htmlPlugin(loadEnv(mode, '.')),
        ],
    }
})