'use client';

import { useState } from 'react';
import Image from 'next/image';

type ModelType = 'stability' | 'huggingface' | 'replicate';

const MODEL_INFO = {
  stability: {
    name: 'Stability AI SDXL',
    description: 'Высокое качество, большое разрешение (1024x1024)',
    endpoint: '/api/stability/generate-image',
    isPaid: false
  },
  huggingface: {
    name: 'HuggingFace Stable Diffusion',
    description: 'Стабильная работа, быстрая генерация',
    endpoint: '/api/huggingface/generate-image',
    isPaid: false
  },
  replicate: {
    name: 'Replicate',
    description: 'Множество различных моделей',
    endpoint: '/api/replicate/generate-image',
    isPaid: true
  }
} as const;

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelType>('stability');

  const generateImage = async () => {
    if (!prompt) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(MODEL_INFO[selectedModel].endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Произошла ошибка при генерации изображения');
      }

      if (!data.output || !Array.isArray(data.output) || data.output.length === 0) {
        console.error('Unexpected API response structure:', data);
        throw new Error('Неверный формат ответа от сервера');
      }

      // Проверяем, что все URL изображений действительны
      const validImages = data.output.filter((url: string) => url && url.startsWith('data:image'));
      if (validImages.length === 0) {
        throw new Error('Не удалось получить изображение');
      }

      setImages(prev => [...validImages, ...prev]);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center">AI Генератор Изображений</h1>
        <p className="text-center text-gray-600">
          Выберите модель и опишите изображение, которое хотите создать
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(Object.entries(MODEL_INFO) as [ModelType, typeof MODEL_INFO[keyof typeof MODEL_INFO]][]).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSelectedModel(key)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedModel === key 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <h3 className="font-semibold mb-2">{info.name}</h3>
            <p className="text-sm text-gray-600">{info.description}</p>
            {info.isPaid && (
              <p className="text-xs text-yellow-600 mt-2">
                Требуется платная подписка и привязка банковской карты
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Опишите желаемое изображение..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          onClick={generateImage}
          disabled={loading || !prompt}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-colors
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {loading ? 'Генерация...' : 'Создать'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
              <Image
                src={image}
                alt={`Сгенерированное изображение ${index + 1}`}
                fill
                className="object-cover"
                unoptimized // Необходимо для data URL изображений
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 