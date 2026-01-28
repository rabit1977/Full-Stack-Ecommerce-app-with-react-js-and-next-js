'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type QuestionWithAnswers = {
  id: string;
  question: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
  answers: {
    id: string;
    answer: string;
    createdAt: Date;
    isOfficial: boolean;
    user: {
      name: string | null;
      image: string | null;
      role: string;
    };
  }[];
  _count: {
    answers: number;
  };
};

// Helper for Admin Check
async function requireAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    return session;
}

/**
 * Fetch questions for a product
 */
export async function getProductQuestionsAction(productId: string) {
  try {
    const questions = await prisma.productQuestion.findMany({
      where: {
        productId,
        isPublic: true, // Only show public questions
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        answers: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: { answers: true },
        },
      },
      orderBy: [
        { helpful: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return { success: true, questions };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return { success: false, questions: [] };
  }
}

/**
 * Post a new question
 */
export async function askQuestionAction(productId: string, question: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'You must be logged in to ask a question.' };
  }

  if (!question.trim()) {
    return { success: false, message: 'Question cannot be empty.' };
  }

  try {
    await prisma.productQuestion.create({
      data: {
        productId,
        userId: session.user.id,
        question: question.trim(),
        isPublic: true, // Default to true for now
      },
    });

    revalidatePath(`/products/${productId}`);
    return { success: true, message: 'Question submitted successfully!' };
  } catch (error) {
    console.error('Error submitting question:', error);
    return { success: false, message: 'Failed to submit question.' };
  }
}

/**
 * Answer a question
 */
export async function answerQuestionAction(questionId: string, answer: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Unauthorized' };
  }

  if (!answer.trim()) {
    return { success: false, message: 'Answer cannot be empty.' };
  }

  try {
    // Check if user is admin or seller for "Official" status
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });
    
    const isOfficial = user?.role === 'ADMIN' || user?.role === 'SELLER';

    await prisma.productAnswer.create({
      data: {
        questionId,
        userId: session.user.id,
        answer: answer.trim(),
        isOfficial,
      },
    });

    // Determine product ID to revalidate
    const question = await prisma.productQuestion.findUnique({
      where: { id: questionId },
      select: { productId: true },
    });

    if (question) {
      revalidatePath(`/products/${question.productId}`);
    }
    
    // Also revalidate admin page
    revalidatePath('/admin/questions');

    return { success: true, message: 'Answer submitted!' };
  } catch (error) {
    console.error('Error answering question:', error);
    return { success: false, message: 'Failed to submit answer.' };
  }
}

// ==========================================
// ADMIN ACTIONS
// ==========================================

export async function getAllQuestionsAction(
    page = 1, 
    limit = 10, 
    search = ''
) {
    try {
        await requireAdmin();
        const skip = (page - 1) * limit;
        
        const where: any = {};
        if (search) {
            where.OR = [
                { question: { contains: search, mode: 'insensitive' } },
                { product: { title: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const [questions, total] = await Promise.all([
            prisma.productQuestion.findMany({
                where,
                include: {
                    user: { select: { name: true, image: true, email: true } },
                    product: { select: { id: true, title: true, thumbnail: true, slug: true } },
                    answers: { include: { user: { select: { name: true, role: true } } } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.productQuestion.count({ where })
        ]);

        return { success: true, questions, total, pages: Math.ceil(total / limit) };
    } catch (error) {
        console.error('Admin Fetch Questions Error:', error);
        return { success: false, error: 'Failed to fetch questions' };
    }
}

export async function deleteQuestionAction(id: string) {
    try {
        await requireAdmin();
        const q = await prisma.productQuestion.delete({ where: { id }, select: { productId: true } });
        revalidatePath('/admin/questions');
        revalidatePath(`/products/${q.productId}`);
        return { success: true, message: 'Question deleted' };
    } catch (error) {
        return { success: false, error: 'Failed to delete question' };
    }
}

export async function toggleQuestionVisibilityAction(id: string) {
    try {
        await requireAdmin();
        const q = await prisma.productQuestion.findUnique({ where: { id }, select: { isPublic: true, productId: true } });
        if (!q) throw new Error('Not found');

        await prisma.productQuestion.update({
            where: { id },
            data: { isPublic: !q.isPublic }
        });

        revalidatePath('/admin/questions');
        revalidatePath(`/products/${q.productId}`);
        return { success: true, message: 'Visibility updated' };
    } catch (error) {
        return { success: false, error: 'Failed to update visibility' };
    }
}
