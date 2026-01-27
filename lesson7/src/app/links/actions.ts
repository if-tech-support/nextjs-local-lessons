'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

const LINKS_PATH = '/links';

// 入力値を文字列として取り出し、空文字を排除するユーティリティ
const ensureString = (value: FormDataEntryValue | null, fieldName: string): string => {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName}は必須です。`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${fieldName}を入力してください。`);
  }
  return trimmed;
};

// hidden inputのIDなど数値系の検証を一本化
const parseNumericId = (value: FormDataEntryValue | null): number => {
  const asNumber = Number(value);
  if (!Number.isInteger(asNumber) || asNumber <= 0) {
    throw new Error('有効なリンクIDが必要です。');
  }
  return asNumber;
};

// URL形式を検証し、常に絶対URLとして保存
const parseUrl = (value: FormDataEntryValue | null): string => {
  const urlString = ensureString(value, 'url');
  try {
    const normalized = new URL(urlString);
    return normalized.toString();
  } catch {
    throw new Error('URLは https://example.com のようにプロトコル付きの絶対URLで入力してください。');
  }
};

// 一覧で使用する作成アクション。完了後に一覧へリダイレクト
export async function createLink(formData: FormData) {
  const title = ensureString(formData.get('title'), 'title');
  const url = parseUrl(formData.get('url'));

  await prisma.link.create({
    data: {
      title,
      url,
    },
  });

  revalidatePath(LINKS_PATH);
  redirect(LINKS_PATH);
}

// 詳細ページから呼ばれる更新アクション
export async function updateLink(formData: FormData) {
  const id = parseNumericId(formData.get('id'));
  const title = ensureString(formData.get('title'), 'title');
  const url = parseUrl(formData.get('url'));

  await prisma.link.update({
    where: { id },
    data: {
      title,
      url,
    },
  });

  revalidatePath(LINKS_PATH);
  revalidatePath(`${LINKS_PATH}/${id}`);
  redirect(`${LINKS_PATH}/${id}`);
}

// リストアイテムの削除アクション。パスを再検証して一覧へ戻る
export async function deleteLink(formData: FormData) {
  const id = parseNumericId(formData.get('id'));

  await prisma.link.delete({ where: { id } });

  revalidatePath(LINKS_PATH);
  redirect(LINKS_PATH);
}
