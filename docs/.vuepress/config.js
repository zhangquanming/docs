module.exports = {
  base: '/',
  dest: 'dist',
  title: '张全明的笔记',
  description: '张全明的个人笔记',
  port: 8000,
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
        text: '工具类',
        link: '/utils/'
      },
      {
        text: '学习资料',
        link: '/links/'
      },
      {
        text: '手写代码',
        link: '/code/'
      },
      {
        text: '博客',
        link: 'https://www.mingme.net/'
      },
    ],
    sidebar: {
      '/summary/': [
        {
          title: '知识总结',
          collapsable: false,
          children: [
            '',
          ]
        },
        {
          title: 'CSS',
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
        },
        {
          title: '浏览器与网络',
          collapsable: false,
          children: [
            ['http/浏览器.md', '浏览器'],
            ['http/服务端与网络.md', '服务端与网络'],
          ]
        },
        {
          title: '前端框架',
          collapsable: false,
          children: [
            ['framework/vue.md', 'Vue'],
            ['framework/react.md', 'React'],
            ['framework/Hybrid.md', 'Hybrid'],
          ]
        },
        {
          title: '构建工具',
          collapsable: false,
          children: [
            ['bundler/webpack.md', 'Webpack'],
          ]
        },
        {
          title: '项目优化',
          collapsable: false,
          children: [
            ['performance/performance.md', '项目性能优化'],
          ]
        },
        {
          title: '全栈基础',
          collapsable: false,
          children: [
            ['other/nginx.md', 'Nginx'],
            ['other/docker.md', 'Docker'],
          ]
        }
      ],
      '/utils/': [
        ''
      ],
      '/links/': [
        ''
      ],
      '/code/': [
        {
          title: '手写代码',
          collapsable: false,
          children: [
            '',
            '防抖.md',
            '节流.md'
          ]
        },
      ]
    }
  }
}