export type Memo = {
  id: string;
  title: string;
  content: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
};

export type MemoCreateInput = {
  title: string;
  content: string;
};

export type MemoUpdateInput = Partial<MemoCreateInput>;
