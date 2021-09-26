module.exports = {
  base: '/',
  dest: 'dist',
  title: '张全明的笔记',
  description: '张全明的个人笔记',
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: false,
  themeConfig: {
    repo: 'zhangquanming/docs',
    docsDir: 'docs',
    lastUpdated: '上次更新',
    nav: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '知识总结',
        link: '/summary/'
      },
      {
        text: '博客',
        link: 'https://www.mingme.net/'
      },
    ],
    sidebar: {
      '/summary/': [
        {
          title: '前言',
          collapsable: false,
          children: [
            ''
          ]
        },
        {
          title: 'CSS 相关',
          collapsable: false,
          children: [
            'CSS/'
          ]
        },
        {
          title: 'JavaScript 相关',
          collapsable: false,
          children: [
            'JavaScript/'
          ]
        }
      ]
    }
  }
}