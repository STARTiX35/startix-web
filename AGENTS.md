# Repository Guidelines

## プロジェクト構造とモジュール整理
このプロジェクトは Next.js App Router を利用しており、`app/layout.tsx` がグローバルシェルを定義し、`app/page.tsx` がランディング画面を描画します。`app/event/page.tsx` や `app/contact/page.tsx` などのルートごとにサーバーまたはクライアントコンポーネントを持たせ、共有 UI は `app/components/` にまとめます。MicroCMS ラッパーのようなサービス連携コードは `app/lib/` に配置し、ファビコンを含む公開アセットは `public/` から提供します。

## ビルド・テスト・開発コマンド
`npm install` を一度実行して `package.json` の依存関係を同期します。`npm run dev` でポート 3000 のホットリロード開発サーバーを起動し、`npm run build` でプレビューや本番環境に用いる最適化済み出力を作成します。`npm run start` はビルド済みアプリのスモークテスト用に起動し、`npm run lint` は Next.js の ESLint パイプラインを実行します。`npm run test:e2e` は Playwright で E2E テストを走らせ、`node tests/check-relative-paths.test.mjs` でナビゲーションリンクが相対パスかを検証します。レビュー前に少なくとも lint と相対パステストを通過させてください。

## コーディングスタイルと命名規約
TypeScript と React 関数コンポーネントが標準であり、共有しない UI は対応するルートと同じフォルダに配置します。`app/components/` に合わせて 2 スペースインデントを維持し、JSX ではダブルクオートを使用し、変数はキャメルケース、コンポーネントとファイル名は `HeroSlideshow.tsx` のようにパスカルケースを用います。スタイリングは Tailwind CSS を中心に行い、関連ユーティリティをまとめ、レスポンシブ修飾子はベースから順に並べます。挙動が直感的でない箇所には、意図を説明する全文コメントを日本語で記述してください。

## テストガイドライン
自動チェックは ESLint、`tests/check-relative-paths.test.mjs`、Playwright E2E (`tests/e2e/`) の 3 つです。コミット前に最低限 `npm run lint` と相対パスチェックを実行し、E2E は変更内容に応じて `npm run test:e2e` を流してください。E2E はローカルでは `npm run dev` を再利用し、CI では `npm run build && npm run start` で本番ビルドに対して走ります (`playwright.config.ts` 参照)。テストを追加する場合、ユーザーフロー全体は `tests/e2e/` の Playwright spec、コンポーネント単体は対象の隣 (例: `app/components/Footer.test.tsx`) に置きます。ナビゲーション、CMS データ描画、フォーム送信を優先的にカバーし、失敗するテストを先に書く → 実装する → すべてのチェックが通ることを確認する、というテスト駆動のループを徹底してください。

## ナビゲーションリンクのルール
サイト内リンクは必ず `app/components/RelativeLink.tsx` を通じて相対パスに変換します。直接 `next/link` を使用した絶対パス指定（例: `href="/event"`）は禁止です。新しいコンポーネントを追加する場合は `RelativeLink` を利用し、変換ロジックの回帰テストとして `tests/check-relative-paths.test.mjs` を実行してください。

## コミットとプルリクエストの指針
このリポジトリのコミットメッセージは短い日本語の説明文です（例: `イベントページのキャッシュ更新間隔を1時間に短縮`）。必ず `git checkout -b feature/<topic>` でブランチを切り、`git push origin feature/<topic>` でプッシュし、`main` への直接コミットは避けます。プルリクエストには要約、関連 Issue、UI 変更時のスクリーンショットや GIF、環境変数やマイグレーションの注意点を添え、単一の論点に絞ってレビュアが影響範囲を判断しやすくしてください。

## セキュリティと設定上の注意
MicroCMS への接続には `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` が必要です。`NEXT_PUBLIC_` プレフィックスは付けないでください。`NEXT_PUBLIC_*` 変数は Next.js の仕様でブラウザ JS バンドルに埋め込まれてしまい、API キーが誰からでも参照可能になります。値は `.env.local` に定義し、リポジトリには含めないでください。

`app/lib/microcms.ts` は `import 'server-only'` でガードしており、誤ってクライアントコンポーネントから import するとビルドエラーになります。MicroCMS にアクセスする処理はサーバーコンポーネント / Route Handler 内に閉じてください。

漏洩の疑いがある場合は MicroCMS ダッシュボードでキーを再発行し、古いキーを速やかに無効化します。過去に `NEXT_PUBLIC_MICROCMS_API_KEY` として使っていたキーは、ビルド済みアセット（Vercel デプロイ履歴）にバンドルとして残っている可能性があるため、初回リリース時に必ずローテートしてください。新しい連携を導入する際は、設定手順を本書に追記し、ステージングと本番のシークレットが同期するようデプロイパイプラインを更新してください。

### 必要な環境変数

```
# .env.local (リポジトリには含めない)
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

Vercel など本番環境でも `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` で設定してください。旧 `NEXT_PUBLIC_*` 変数のフォールバックは廃止しています。`NEXT_PUBLIC_MICROCMS_API_KEY` が環境に残ったままビルドすると、その値が Next.js によってクライアントバンドルへ埋め込まれてしまうため、`app/lib/microcms.ts` は当該変数を検出した時点で明示的に throw します。ローテート完了後は Vercel ダッシュボードからも旧変数を確実に削除してください。

### CSP の運用フラグ

`next.config.js` は以下の任意環境変数で CSP の挙動を切り替えます。

| 変数 | 効果 |
|---|---|
| `CSP_REPORT_ONLY=1` | CSP 違反をブロックせず report のみ送信。ロールアウト初期や CSP の強化時に使う。 |
| `CSP_REPORT_URI=<url>` | CSP 違反レポートの送信先。Sentry などの security endpoint。未設定なら report-uri を出さない。 |
| `HSTS_PRELOAD=1` | HSTS の preload ディレクティブを付与。`hstspreload.org` への登録手続き完了後にだけ有効化する。 |

CSP の `script-src` には `'unsafe-inline'` が含まれます。全ページが SSG のため nonce 化ができないトレードオフで、XSS の第一線防御は React の自動エスケープに委ねています。新しい inline スクリプトを追加する場合は別ルートを検討してください。

### 依存パッケージの override

`package.json` の `overrides` で `postcss` と `brace-expansion` を pin しています。これらは Next.js 内部や ESLint 配下の transitive dependency に脆弱な古いバージョンが残っているための応急処置で、Next.js のパッチで内部バージョンが変わったときに `npm install` が衝突する可能性があります。依存更新時はこの override がまだ必要かを確認し、不要になったら削除してください。
