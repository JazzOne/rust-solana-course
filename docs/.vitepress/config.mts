import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Rust × Solana',
  description: '从加密新人到能做产品的实战课程',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '第一期', link: '/vol-01/' },
      { text: '路线图', link: '/roadmap' },
    ],

    sidebar: {
      '/vol-01/': [
        {
          text: 'Vol. 01｜理解区块链：从 Bitcoin 到 Solana',
          items: [
            { text: '本期导读', link: '/vol-01/' },
            { text: '01 · 钱到底是什么？', link: '/vol-01/01-money' },
            { text: '02 · 区块链如何共同记账？', link: '/vol-01/02-blockchain' },
            { text: '03 · Bitcoin 到底解决了什么？', link: '/vol-01/03-bitcoin' },
            { text: '04 · Ethereum 为什么出现？', link: '/vol-01/04-ethereum' },
            { text: '05 · Solana 为什么存在？', link: '/vol-01/05-solana' },
            { text: '06 · 本期知识地图', link: '/vol-01/knowledge-map' },
            { text: '术语索引', link: '/vol-01/glossary' },
            { text: '下一期预告', link: '/vol-01/next' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/JazzOne/rust-solana-course' }
    ],

    footer: {
      message: 'Rust × Solana 实战课程',
      copyright: '从钱与账本出发，逐步走进 Solana'
    },

    search: {
      provider: 'local'
    }
  }
})
