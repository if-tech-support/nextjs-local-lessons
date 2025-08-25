# nextjs-local-lessons

本リポジトリは、Next.js（App Router）＋ Tailwind CSSを用いたハンズオン教材の作成・配布用プロジェクトです。以下に、ハンズオンを新規作成／更新する際の作業手順と、教材生成に用いるプロンプトをまとめます。

本教材は「単一のNext.jsアプリケーション（1つのプロジェクトディレクトリ）」を01章から最終章まで段階的に拡張して完成させる形式です。各章で新しくNext.jsプロジェクトを`create-next-app`などで再生成しないでください。第1章（環境構築）以降は既存プロジェクト内の既存ファイルを編集／新規ファイルを追加する指示のみを行います。

## ハンズオン作成フロー

1. 設計ドキュメントを用意する（design.md）

   - Notionに作成せれた設計ドキュメントを`design.md`に書き出す。

2. contents.md生成用プロンプトでcontents.mdを作成する

   - 最新版はルート直下の`CONTENTS_PROMPT.md`を参照してください: [CONTENTS_PROMPT.md](./CONTENTS_PROMPT.md)。

3. 教材生成プロンプトで章を1つずつ作成する

   - 最新版はルート直下の`GENERATION_PROMPT.md`を参照してください: [GENERATION_PROMPT.md](./GENERATION_PROMPT.md)。

4. 品質チェック用プロンプトでレビューを行う

   - 最新版はルート直下の`QUALITY_REVIEW_PROMPT.md`を参照してください: [QUALITY_REVIEW_PROMPT.md](./QUALITY_REVIEW_PROMPT.md)。
