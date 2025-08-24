# contents.md 生成用プロンプト（テンプレート）

あなたは教材コンテンツ編集者です。以下のパラメーターを基に、レッスンの「contents.md」を日本語で作成してください。出力はMarkdownのみで、指定の見出し構成とスタイルに厳密にしたがってください。

［パラメーター］
- lesson_title: {{lesson_title}}
- overview: {{1〜2文でのレッスン概要}}
- stack: {{使用技術（例: Next.js/React/Tailwind CSS/Node.js/DBなど）}}
- target_audience: {{対象者（箇条書き）}}
- goals: {{目的（3〜6項目の箇条書き）}}
- skills: {{学習対象スキル（箇条書き）}}
- prerequisites: {{前提（推奨）（箇条書き）}}
- pages_or_routes: {{ページやルートの例（必要なら）}}
- special_rules: {{実装上のルール（例: サーバーアクションを使わない/クラスは最大N個など）任意}}
- db_section_enabled: {{true|false}}
- db_vendor: {{DBベンダー名（例: Supabase）}}（db_section_enabled=trueのときのみ使用）
- db_project_naming_guidelines: {{DBプロジェクト命名の方針（箇条書き・例示つき）任意}}
- env_vars: {{環境変数キーと例（箇条書き）任意}}
- chapters: {{章立て（配列）。各要素にno, filename, synopsisを持つ}}
   - 例（下記はフォーマット例。必要に応じて置き換えてください）:

```yaml
- no: "01"
   filename: "01-環境構築.md"
   synopsis: "依存導入と開発起動確認"
- no: "02"
   filename: "02-◯◯.md"
   synopsis: "◯◯の実装"
# …
- no: "06"
   filename: "06-まとめ.md"
   synopsis: "学んだポイントのふりかえりと自己チェック"
```

［出力要件］
- ドキュメントはMarkdown。先頭から次の見出し順で構成すること。
  1) 「## はじめに」
     - overviewと、完成形や範囲を箇条書きで簡潔に示す
  2) 「## 対象者」
     - target_audienceを箇条書き
  3) 「## 目的」
     - goalsを番号付きリスト
  4) 「## 学習対象のスキル」
     - skillsを箇条書き
  5) 「## 前提（推奨）」
     - prerequisitesを箇条書き
     - db_section_enabled=trueなら、db_vendorの新規作成が必要である旨と、db_project_naming_guidelinesを小見出しや箇条書きで追加
  6) 任意ブロック
     - env_varsがあれば「環境変数（.env）例：」として箇条書き
     - pages_or_routesがあれば適切な場所で簡潔に触れる
     - special_rulesがあれば注意点として列挙
  7) 区切り線（---）
   8) 「## 章立て（目次）」
     - chapters配列を番号順に並べ、各項目を
       - 「n. `filename`」の行
       - 次行で「- synopsis」を1行
     - 章の後に「各章のMarkdownは、次の見出しルールで統一されています。」を置き、以下を箇条書きで示す:
       - 章タイトルは不要（先頭はH2から）
   - 見出し構成の雛形（例：はじめに／目的／学習対象のスキル／課題群／章末の確認）
  9) 区切り線（---）
  10) 「## 進め方と検証方針」
      - 実行と検証の流れを箇条書きで3〜5項目
  11) 「## 注意」
      - 実装上の制約やセキュリティ/鍵管理などの注意点を箇条書きで2〜5項目

［文体・スタイル］
- 簡潔で一貫した日本語。教材として自然で読みやすい文。
- 原則として全角文字と半角文字の間にスペースを入れない。
- 読みやすさを優先し、ひらがなが適切な語（例：わかるなど）はひらがなを用いる。
- 専門用語やファイル名やコードはインラインコード（`code`）を使う。

［禁止事項］
- 出力前後の私的コメントや断り書きは不要。指定の構成のみを出力。
- 架空のコマンド実行例は記載しない（必要時は名称のみに留める）。

［サンプル埋め方の例（このブロックは出力しない）］
- lesson_title: Next.jsで学ぶルートハンドラー入門
- overview: 2ページ構成のメモアプリを題材に、CRUD APIと最小DB永続化を学ぶ。
- stack: Next.js/React/Tailwind CSS/Supabase
- target_audience: React/Next.jsの基礎を知っている初中級者
- goals: CRUD実装/クエリ取得/DB連携/クライアントfetchなど
- skills: Route Handler/NextRequest/NextResponse/DBクライアント/UI実装
- prerequisites: Node.js LTS/パッケージマネージャー/Next.js 15系など
- db_section_enabled: true
- db_vendor: Supabase
- db_project_naming_guidelines:
  - 命名は環境と用途がわかる形（例: `{{lesson_family}}-<yourname>-dev`）
  - レッスン間で継続利用する前提で名付ける
  - リージョンは利用地域に合わせる
- env_vars: NEXT_PUBLIC_BASE_URL/DB_URL/DB_ANON_KEYなど
- chapters: 01〜06（06はまとめ）

この条件で、{{lesson_title}}のcontents.mdを生成してください。
