import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const NETWORK_CONFIG: Record<string, { maxChars: number; style: string }> = {
  instagram: {
    maxChars: 2200,
    style: 'visual, emocional, con emojis estratégicos, 3-5 párrafos cortos, termina con una pregunta para generar engagement',
  },
  linkedin: {
    maxChars: 3000,
    style: 'profesional pero humano, sin emojis excesivos, estructura clara con gancho en la primera línea, reflexión o aprendizaje, llamado a la acción al final',
  },
  twitter: {
    maxChars: 280,
    style: 'directo, conciso, impactante, un solo mensaje poderoso',
  },
}

export async function POST(req: NextRequest) {
  try {
    const { topic, tone, networks, context, includeHashtags, includeCTA } = await req.json()

    if (!topic || !networks?.length) {
      return NextResponse.json({ error: 'Falta el tema o las redes sociales' }, { status: 400 })
    }

    const results: Record<string, { text: string; hashtags: string[]; charCount: number }> = {}

    for (const network of networks) {
      const config = NETWORK_CONFIG[network]
      if (!config) continue

      const prompt = `Sos un experto en marketing de contenidos y copywriting para redes sociales.

Generá UN post para ${network.toUpperCase()} sobre el siguiente tema:

TEMA: ${topic}
${context ? `CONTEXTO ADICIONAL: ${context}` : ''}
TONO: ${tone}
ESTILO PARA ESTA RED: ${config.style}
LÍMITE DE CARACTERES: ${config.maxChars}

${includeHashtags ? 'Incluí entre 4-6 hashtags relevantes al final.' : 'No incluyas hashtags.'}
${includeCTA ? 'Incluí un llamado a la acción claro al final.' : ''}

Respondé ÚNICAMENTE con un JSON válido con este formato exacto, sin markdown ni texto extra:
{
  "text": "el texto del post aquí",
  "hashtags": ["hashtag1", "hashtag2"]
}

El campo "hashtags" debe ser un array de strings sin el símbolo # (lo agrego yo). Si no hay hashtags, dejá el array vacío.`

      const response = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      })

      const raw = response.content[0].type === 'text' ? response.content[0].text : ''
      
      try {
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
        results[network] = {
          text: parsed.text,
          hashtags: parsed.hashtags || [],
          charCount: parsed.text.length,
        }
      } catch {
        // fallback: treat entire response as text
        results[network] = {
          text: raw,
          hashtags: [],
          charCount: raw.length,
        }
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Error generando el contenido' }, { status: 500 })
  }
}
