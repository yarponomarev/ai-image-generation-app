import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.STABILITY_API_KEY) {
    return NextResponse.json(
      { error: "API ключ Stability AI не настроен" },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await request.json();

    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Stability AI API error response:", errorData);
      throw new Error(errorData.message || `Ошибка при генерации изображения: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.artifacts?.[0]?.base64) {
      console.error("Unexpected API response:", data);
      throw new Error("Неверный формат ответа от сервера");
    }

    const imageUrl = `data:image/png;base64,${data.artifacts[0].base64}`;
    return NextResponse.json({ output: [imageUrl] });

  } catch (error) {
    console.error("Error from Stability AI API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Неизвестная ошибка" },
      { status: 500 }
    );
  }
} 