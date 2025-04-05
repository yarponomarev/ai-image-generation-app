import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    return NextResponse.json(
      { error: "API ключ HuggingFace не настроен" },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await request.json();

    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    // Проверяем тип контента ответа
    const contentType = response.headers.get("content-type");
    
    if (!response.ok) {
      if (contentType?.includes("text/html")) {
        // Если получили HTML, значит что-то не так с аутентификацией или моделью
        const text = await response.text();
        console.error("Received HTML instead of image:", text);
        
        if (text.includes("Model is currently loading")) {
          return NextResponse.json(
            { error: "Модель загружается, пожалуйста, подождите минуту и попробуйте снова" },
            { status: 503 }
          );
        }
        
        if (text.includes("unauthorized")) {
          return NextResponse.json(
            { error: "Ошибка авторизации. Проверьте ваш API ключ" },
            { status: 401 }
          );
        }
        
        return NextResponse.json(
          { error: "Неожиданный ответ от сервера" },
          { status: 500 }
        );
      }
      
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "Ошибка при генерации изображения");
    }

    if (!contentType?.includes("image")) {
      throw new Error("Сервер не вернул изображение");
    }

    // Получаем изображение как blob
    const blob = await response.blob();
    const imageBuffer = await blob.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const imageUrl = `data:${contentType};base64,${base64Image}`;

    return NextResponse.json({ output: [imageUrl] });
  } catch (error) {
    console.error("Error from HuggingFace API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Неизвестная ошибка" },
      { status: 500 }
    );
  }
} 