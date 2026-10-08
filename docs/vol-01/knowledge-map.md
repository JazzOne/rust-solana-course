# 06 · 本期知识地图与收尾

> 本章目标：把前五章的概念收成一张可回顾的地图，并明确两条贯穿后续学习的分界线。读完后，你应该能用自己的话串起从“钱”到 Solana 的完整逻辑，并知道下一期将进入哪些可操作对象。

---

## 6.1 一张图串起来

```text
Money（钱）
  ↓
Ledger（账本）
  ↓
Centralized Ledger（中心化账本）
  │
  │ “如果不依赖中央机构呢？”
  ↓
Decentralized Ledger（去中心化账本）
  ↓
Digital Signature（数字签名）—— 解决授权
  ↓
Transaction（交易）—— 表达状态转换请求
  ↓
Validation（验证）—— 检查规则与冲突
  ↓
Double-Spending Problem（双重花费）—— 需要统一顺序
  ↓
Block + Hash（区块与哈希）—— 组织可验证历史
  ↓
Consensus（共识）—— 网络最终接受什么历史与状态
  │
  ├──────────────── Bitcoin
  │                   ├─ UTXO（未花费交易输出）
  │                   ├─ Mining（挖矿）
  │                   └─ Proof of Work（工作量证明）
  │
  ├──────────────── Ethereum
  │                   ├─ Account Model（账户模型）
  │                   ├─ Smart Contract（智能合约）
  │                   └─ Gas（资源计量）
  │
  └──────────────── Solana
                      ├─ Account（状态基本单元）
                      ├─ Program（代码）
                      ├─ Instruction（指令）
                      ├─ Explicit Account Access（显式状态访问）
                      ├─ Sealevel（并行执行运行时）
                      └─ Proof of History（可验证时间顺序）
```

---

## 6.2 三代设计问题对照

| 系统 | 核心问题 | 关键模型 |
|------|----------|----------|
| **Bitcoin** | 没有中央机构，如何可靠转移数字价值？ | UTXO + Proof of Work |
| **Ethereum** | 区块链能不能运行通用业务逻辑？ | Account + Smart Contract + Gas |
| **Solana** | 可编程共享状态如何在安全前提下更高效地执行？ | Account + Program + 显式状态访问 + 并行运行时（Sealevel） |

每一代都在前一代解决的问题之上，打开了新的能力，也暴露了新的工程压力。Solana 的设计，正是对“如何高效执行可编程共享状态”这一问题的系统回答。

---

## 6.3 最重要的两条分界线

后续几乎所有 Solana 学习都会反复回到这两条线。请现在就记住它们。

### 分界线一：Consensus vs Execution

```text
Consensus（共识）
  → 大家最终同意什么历史、什么状态？

Execution / Runtime（执行 / 运行时）
  → 已经确定需要处理的交易，应该如何执行？
```

- **Sealevel** 属于 Execution，不是 Consensus。
- **PoH** 帮助建立可验证的时间顺序，但它本身也不等于完整的共识机制。

把“并行执行”和“共识”混为一谈，是学习 Solana 时最常见的概念混乱之一。

### 分界线二：Code vs State

```text
Program  → 代码 / 逻辑
Account  → 数据 / 状态
```

- Program 负责执行逻辑。
- Account 承载被操作的状态。
- 交易通过 Instruction 调用 Program，并明确声明要访问的 Accounts。
- Accounts 的访问关系会参与依赖分析，从而影响能否并行。

这条分界线直接决定了你在写交易、设计 Program、理解 PDA 与 CPI 时的思考方式。

---

## 6.4 贯穿全书的状态机抽象

无论 Bitcoin、Ethereum 还是 Solana，都可以放回这张图观察：

```text
Old State
   │
   ▼
Transaction              ← 状态变更请求
   │
   ▼
Validation / Authorization  ← 验证合法性与授权
   │
   ▼
Execution                ← 执行状态转换
   │
   ▼
New State
```

三代系统的差异，很大程度上就体现在：

- 状态怎么表达（UTXO / Account / Solana Account）
- 交易怎么授权与验证
- 程序在哪里执行、如何计量资源
- 交易之间如何发现依赖
- 网络最终如何形成共同历史

---

## 6.5 第一期你应该能回答的问题

读完本期后，请确认自己能用自己的话回答：

1. 为什么“钱”首先是一个账本问题？
2. 去中心化系统需要数字签名、共识和交易排序的原因是什么？
3. Bitcoin 为什么采用 UTXO，而不是传统账户余额？
4. 为什么 Bitcoin 需要挖矿和 Proof of Work？
5. Ethereum 为什么把区块链变成了可编程的状态机？
6. 什么是 Account、Smart Contract、Gas？
7. Solana 为什么强调 Account、Program、显式状态访问和并行执行？
8. Sealevel 与 Consensus 分别解决什么问题？
9. PoH 的角色是什么？为什么它不等于共识？

如果以上问题都能清晰回答，第一期的世界观地图就已经建立完成。

---

## 6.6 下一期预告：从理解走向操作

第一期解决的是“**为什么会有 Solana**”。

第二期（Vol. 02｜SOL、Wallet 与 Account）将开始真正进入 Solana 的可操作对象：

- SOL 与 Lamports
- Wallet 与私钥
- Address 与 Account
- Account 的具体字段（lamports、owner、data、executable）
- 第一次通过 RPC 读取真实链上数据

从下一期开始，概念将逐步变成可以观察、可以操作的真实对象。

```text
概念
  ↓
真实链上对象
  ↓
RPC
  ↓
代码
  ↓
真实数据
```

---

## 本章小结

1. 从钱 → 账本 → 去中心化 → Bitcoin → Ethereum → Solana，形成一条完整的问题演进链条。
2. 三代系统分别回答了价值转移、可编程状态、高效执行三个层面的核心问题。
3. 两条必须牢记的分界线：Consensus vs Execution；Program（代码）vs Account（状态）。
4. 状态机抽象是观察所有区块链差异的统一视角。
5. 第一期的目标是建立地图；第二期开始把地图落到真实对象与代码上。
