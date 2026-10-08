---
title: Vol. 01｜理解区块链：从 Bitcoin 到 Solana
---

# Vol. 01｜理解区块链：从 Bitcoin 到 Solana

> **从“钱与账本”出发，理解 Solana 为什么会这样设计。**

## 本期目标

这一期不急着写 Solana Program，也不急着安装 Anchor。我们先建立一套能够支撑后续所有技术学习的底层模型：**区块链到底在维护什么？交易到底改变什么？为什么 Bitcoin 需要 UTXO？为什么 Ethereum 要引入智能合约？为什么 Solana 又重新设计状态访问和执行方式？**

如果这些问题没有想清楚，后面的 `Account`、`Program`、`Instruction`、`PDA`、`CPI` 很容易变成一串孤立的 API 名称。

## 读者画像

你可以把自己想象成这样：

- 会 TypeScript / JavaScript；
- 理解 HTTP、API、数据库、异步和并发；
- 对 Rust 有一定基础，正在从 Web2 走向服务端；
- 没有系统学过区块链。

因此本期会大量使用 Web2 的“数据库、状态机、请求、权限、并发”等概念作为桥梁，但会在关键位置指出：**类比只是入口，不是等价关系。**

## 本期章节

1. [钱到底是什么？](./01-money)
2. [区块链如何共同记账？](./02-blockchain)
3. [Bitcoin 到底解决了什么？](./03-bitcoin)
4. [Ethereum 为什么出现？](./04-ethereum)
5. [Solana 为什么存在？](./05-solana)
6. [本期知识地图](./knowledge-map)
7. [术语索引](./glossary)

## 一条主线

```text
钱
 ↓
账本
 ↓
中心化账本
 ↓
去中心化账本
 ↓
数字签名 / 交易 / 验证 / 共识
 ↓
Bitcoin：去中心化价值转移
 ↓
Ethereum：可编程共享状态
 ↓
Solana：面向高性能执行的系统重构
```

## 一个贯穿全书的抽象

后面的学习会不断回到这个状态机模型：

```text
Old State
   │
   ▼
Transaction
   │
   ▼
Validation / Authorization
   │
   ▼
Execution
   │
   ▼
New State
```

Bitcoin、Ethereum、Solana 的重要差异，很大一部分都可以放回这张图里观察：**状态怎么表达、交易怎么授权、程序在哪里执行、执行资源怎么计量、交易之间如何发现依赖、网络最终如何形成共同历史。**

---

## 本期阅读建议

不要试图一次记住所有英文术语。每一章只需要回答三个问题：

1. **它解决了什么问题？**
2. **它和之前的方案有什么不同？**
3. **这个变化为什么最终把我们带到了 Solana？**
