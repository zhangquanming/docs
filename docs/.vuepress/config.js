module.exports = {
  base: '/',
  dest: 'dist',
  title: '全明笔记',
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
            ['css/base.md', 'CSS基础知识'],
            ['css/layout.md', '常见布局方式'],
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
            ['http/web.md', '浏览器'],
            ['http/service.md', '服务端与网络'],
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
          title: '工程化',
          collapsable: false,
          children: [
            ['monitor/monitor.md', '前端监控'],
            ['performance/performance.md', '项目性能优化'],
          ]
        },
        {
          title: '全栈基础',
          collapsable: false,
          children: [
            ['other/node.md', 'Node'],
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
            '节流.md',
            '浅比较与深比较.md',
            '浅拷贝与深拷贝.md',
            'Promise.md',
            'new.md',
            'instanceof.md',
            'compose.md',
            '模拟setInterval.md',
            'call、apply、bind.md',
            '发布订阅模式.md',
            '扁平数组与JSON树结构互转.md'
          ]
        },
      ]
    }
  }
}