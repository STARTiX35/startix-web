# サイトマップおよび関連設定の実装手順

## 背景
新ドメイン `https://startix-tsukuba.net` でクロール手がかりを最大化するため、Next.js プロジェクトにサイトマップ生成と Robots 設定を追加し、Google Search Console（GSC）での送信と旧ドメインからの移転手続きを完了させます。元ドメイン `https://startix-web-iota.vercel.app` は恒久（308）リダイレクトで新ドメインへ誘導予定です。

## 前提条件
- リポジトリルートにて `npm` を利用できること。
- 新ドメインの HTTPS 配信と 308 リダイレクト設定がインフラ側で完了済みまたは完了予定であること。
- GSC で旧ドメインのプロパティ権限を保持していること。

## 実装手順
1. Next.js プロジェクトで sitemap.xml を生成できるようにする。  
2. Robots 設定にサイトマップ URL を追記し、本番ビルドに含める。  
3. デプロイ後に新ドメインで sitemap と robots の配置を確認する。  
4. GSC で新プロパティを作成しサイトマップを送信、必要に応じてアドレス変更を行う。

### 1. sitemap.xml の生成
1. `next-sitemap` を追加する。
   ```bash
   npm install --save-dev next-sitemap
   ```
2. プロジェクト直下に `next-sitemap.config.js` を作成し、絶対 URL を設定する。
   ```js
   /** @type {import('next-sitemap').IConfig} */
   module.exports = {
     siteUrl: 'https://startix-tsukuba.net',
     generateRobotsTxt: false,
     exclude: ['/404'],
   };
   ```
3. `package.json` にサイトマップ生成スクリプトを追加し、ビルド後に実行する。
   ```json
   {
     "scripts": {
       "postbuild": "next-sitemap"
     }
   }
   ```
4. `npm run build` を実行すると `sitemap.xml` と `sitemap-0.xml` が `public/` に生成されることを確認する。生成物は Vercel デプロイ時に自動で公開される。

### 2. robots.txt への追記
1. `public/robots.txt` が無ければ新規作成し、既存行の最後に以下を追加する。
   ```
   Sitemap: https://startix-tsukuba.net/sitemap.xml
   ```
2. ステージング・本番どちらでも同じ内容が出力されるよう、環境ごとに別URLを使わない（恒久リダイレクトがあるため GSC は新ドメインのみ参照させる）。

### 3. デプロイ後の確認
- Vercel のプレビュー／本番環境で `https://startix-tsukuba.net/sitemap.xml` と `https://startix-tsukuba.net/robots.txt` にアクセスし、200 応答と最新コンテンツを確認する。
- 308 リダイレクト元の `https://startix-web-iota.vercel.app/sitemap.xml` を開き、新ドメインへ正しく遷移することを確認する。

### 4. Google Search Console 手続き
1. GSC に新しく `https://startix-tsukuba.net` の URL プレフィックスまたはドメインプロパティを登録し、サイト所有権を確認する。
2. 新プロパティの「サイトマップ」画面で `https://startix-tsukuba.net/sitemap.xml` を送信する。
3. 旧プロパティ（`https://startix-web-iota.vercel.app`）が存在し、かつドメイン移行扱いとする場合は「アドレス変更」機能を使って新ドメインへ移転申請を行う。
4. 送信後はインデックス カバレッジの推移とエラーレポートをモニタリングし、クロールエラーが発生した場合は速やかに修正する。

## 運用メモ
- 新しいページやイベントが追加された際は通常の Next.js ルーティングで自動的にサイトマップへ反映される。静的ページを追加する場合は `next-sitemap.config.js` の `additionalPaths` を活用する。
- リダイレクト設定を更新した際は、Search Console でのサイトマップ登録とアドレス変更のステータスを再確認する。
