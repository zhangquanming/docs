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
    sidebarDepth: 2,
    repo: 'zhangquanming/docs',
    lastUpdated: 'Last Updated',
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
            ['css/CSS基础知识', 'CSS基础知识'],
            ['css/常见布局方式', '常见布局方式'],
          ]
        },
        {
          title: 'JavaScript 相关',
          collapsable: false,
          children: [
            ['javascript/', 'JavaScript基础知识'],
          ]
        }
      ]
    }
  }
}