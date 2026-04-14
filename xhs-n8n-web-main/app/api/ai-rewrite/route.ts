import { NextRequest } from 'next/server'
import { OpenAI } from 'openai'
import { db, authorsTable, notesTable } from '@/lib/drizzle'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { checkAndIncrementUsage } from '@/lib/usage'

const openai = new OpenAI({
  apiKey: process.env.ZAI_API_KEY!,
  baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
})

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'unauthenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Usage limit check + increment
    const usage = await checkAndIncrementUsage(user.id)
    if (!usage.allowed) {
      return new Response(
        JSON.stringify({ error: 'limit_exceeded', plan: usage.plan, usedToday: usage.usedToday, limit: usage.limit }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { content, addEmojis, authorId } = await request.json()

    if (!content || typeof content !== 'string') {
      return new Response('Invalid content', { status: 400 })
    }

    // Get author's notes for reference if authorId is provided
    let authorNotes = ''
    let authorInfo = ''
    
    if (authorId) {
      try {
        const author = await db
          .select()
          .from(authorsTable)
          .where(eq(authorsTable.id, authorId))
          .limit(1)

        if (author.length > 0) {
          authorInfo = `作者信息：${author[0].userName} (@${author[0].userXhsId})`
          
          // Get author's notes for reference
          const notes = await db
            .select()
            .from(notesTable)
            .where(eq(notesTable.authorId, authorId))
            .limit(10)

          if (notes.length > 0) {
            authorNotes = notes.map(note => 
              `标题：${note.title}\n描述：${note.description || ''}\n获赞：${note.likes || 0}\n收藏：${note.collects || 0}`
            ).join('\n\n---\n\n')
          }
        }
      } catch (error) {
        console.error('Error fetching author data:', error)
      }
    }

    const systemPrompt = `你是一个专业的小红书内容创作助手，擅长创作吸引人的小红书笔记。

请根据用户的要求创作一篇小红书笔记，要求：

1. 标题要吸引眼球，可以使用数字、问号、感叹号等元素
2. 内容要有条理，使用序号或符号分点叙述
3. 语言要亲切自然，符合小红书用户的表达习惯
4. ${addEmojis ? '在内容中适当添加相关的emoji表情符号' : '不要使用emoji表情符号'}
5. 结尾要有引导互动的内容，如"你们觉得呢？"、"快来分享你的经验吧！"等

${authorInfo ? `\n${authorInfo}\n` : ''}

${authorNotes ? `
以下是该作者之前的笔记内容，供参考风格和表达方式：

${authorNotes}

请参考以上内容的风格和表达方式来创作新的笔记。
` : ''}

请直接输出笔记内容，不要添加额外的解释。`

    const userPrompt = `请根据以下要求创作一篇小红书笔记：

${content}`

    const stream = await openai.chat.completions.create({
      model: 'glm-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: true,
      temperature: 0.5,
      max_tokens: 2000,
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              const data = JSON.stringify({ content })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}