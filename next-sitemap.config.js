/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://startix-tsukuba.net',
  generateRobotsTxt: false, // robots.txt は手動で作成するため無効化
  exclude: ['/404'], // 404ページをサイトマップから除外
};
