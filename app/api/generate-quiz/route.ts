import { NextRequest, NextResponse } from 'next/server';
import { listFiles } from '@/lib/storage';
import { extractTextFromFile } from '@/lib/file-extractors';
import { callPortkeyDirectly } from '@/lib/portkey';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, numQuestions = 10, difficulty = 'medium', courseId, model } = body;

    if (!topic || !courseId) {
      return NextResponse.json(
        { error: 'Topic and courseId are required' },
        { status: 400 }
      );
    }

    // Get course files from request (client sends fileIds)
    const { fileIds = [] } = body;
    
    if (fileIds.length === 0) {
      return NextResponse.json(
        { error: 'No materials found for this course' },
        { status: 400 }
      );
    }

    // Load course materials
    const allFiles = await listFiles();
    const files = allFiles.filter(f => fileIds.includes(f.id));

    let courseMaterials = '';
    for (const file of files.slice(0, 5)) { // Limit to 5 files for context
      try {
        const response = await fetch(file.url, { signal: AbortSignal.timeout(30000) });
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          const extracted = await extractTextFromFile(file.name, buffer);
          if (extracted.text && !extracted.error) {
            courseMaterials += `\n\n=== ${file.name} ===\n${extracted.text.substring(0, 5000)}`;
          }
        }
      } catch (error) {
        console.error(`Error loading file ${file.name}:`, error);
      }
    }

    // Generate quiz using AI
    const systemPrompt = `You are an expert quiz generator for academic courses. Generate high-quality multiple-choice questions based on course materials.

Guidelines:
- Create questions that test understanding, not just memorization
- Make questions relevant to the specified topic
- Include 4 options per question (A, B, C, D)
- Mark the correct answer clearly
- Provide brief explanations for correct answers
- Vary question difficulty based on the specified level
- Ensure questions are clear and unambiguous
- Base questions ONLY on the provided course materials`;

    const userPrompt = `Generate a quiz with ${numQuestions} ${difficulty} multiple-choice questions on the topic: "${topic}"

Course Materials:
${courseMaterials || 'No specific materials provided - use general knowledge of the topic'}

Format your response as JSON:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation"
    }
  ]
}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await callPortkeyDirectly(messages, model || '@gpt-4o/gpt-4o', false);
    const data = await response.json();

    let quizData;
    try {
      const content = data.choices[0]?.message?.content || '';
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (error) {
      console.error('Error parsing quiz response:', error);
      return NextResponse.json(
        { error: 'Failed to parse quiz response' },
        { status: 500 }
      );
    }

    const quiz = {
      title: quizData.title || `Quiz: ${topic}`,
      questions: quizData.questions || [],
      courseId,
      courseName: body.courseName || 'Course',
      createdAt: new Date(),
    };

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}

