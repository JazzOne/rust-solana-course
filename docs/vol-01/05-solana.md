# 05 · Solana 为什么存在？

> 本章目标：理解 Solana 不是简单的“更快的 Ethereum”，而是对交易模型、状态访问、执行运行时与硬件利用方式的系统重构。读完后，你应该能清楚说明显式 Account 访问的意义、Program 与 Account 的分离、Sealevel 与 Consensus 的边界，以及 PoH 在系统中的真实角色。

前四章我们走完了一条清晰的路径：

```text
钱与账本
  → 去中心化共同记账
  → Bitcoin：去中心化价值转移（UTXO + PoW）
  → Ethereum：可编程共享状态机（Account + Smart Contract + Gas）
  → 新问题：如何在安全前提下更高效地执行？
```

现在来看 Solana 给出的答案。

---

## 5.1 先纠正一个最常见的理解

“Solana 是更快的 Ethereum。”

这句话可以帮助新人建立初步直觉，但如果停在这里，就会错过 Solana 最值得学习的部分。

Solana 的核心价值不在于某个局部函数跑得更快，而在于它从多个层面重新思考了区块链系统：

- 交易如何声明自己要访问的状态
- 状态如何被组织和寻址
- 执行如何发现依赖并尽可能并行
- 时间与顺序如何被高效表达
- 现代硬件的多核与高速资源如何被利用

它是一次**系统级的重新设计**，而不是在同一套模型上做简单加速。

---

## 5.2 性能问题的本质：状态依赖

假设系统同时收到两笔交易：

```text
Tx A 访问 {Alice, Bob}
Tx B 访问 {Charlie, David}
```

两笔交易的状态集合没有交集：

```text
{Alice, Bob} ∩ {Charlie, David} = ∅
```

从依赖分析角度，它们更适合并行执行。

反过来：

```text
Tx A 访问 {Alice, Bob}
Tx B 访问 {Bob, Charlie}
```

存在交集：

```text
{Alice, Bob} ∩ {Bob, Charlie} = {Bob}
```

如果两笔交易都写 Bob，就可能出现写-写冲突；如果一笔读 Bob、另一笔写 Bob，就可能出现读-写依赖。

这就是并行执行最核心的问题：

> **不是所有任务都能并行。系统首先必须知道任务之间的依赖关系。**

如果运行时在执行前对“这笔交易会碰哪些状态”一无所知，就很难安全地做调度。这直接决定了下一代系统的设计方向。

---

## 5.3 为什么 Solana 强调显式 Account 访问？

如果交易是一个完全黑盒的：

```text
execute(transaction)
```

运行时很难在执行前知道它到底会读取或写入哪些状态。依赖分析几乎无从下手。

Solana 的交易模型要求交易**明确提供**执行所需的 Accounts。于是运行时可以提前得到类似这样的信息：

```text
Tx A:
  read/write → Account A
  read/write → Account B

Tx B:
  read/write → Account C
  read/write → Account D
```

有了这些声明，运行时就有机会在执行前分析依赖关系，把互不冲突的交易调度到不同的执行路径上。

这是一项非常重要的设计决策：

> **状态访问本身成为交易的一部分，而不是完全隐藏在程序内部。**

对开发者而言，这意味着写交易时必须认真思考“我要碰哪些账户”；对运行时而言，这意味着并行调度有了可靠的输入。

---

## 5.4 Account：Solana 的状态基本单元

在 Solana 中，**Account** 是链上状态的重要基本单元。

可以先用下面这个抽象建立第一层模型：

```text
Account
├─ Address      （账户地址）
├─ Owner        （拥有者 Program）
├─ Lamports     （余额，以最小单位计）
├─ Data         （任意字节数据）
└─ Executable   （是否可执行）
```

这里只建立直觉，具体字段语义会在后续 Vol. 02 及以后章节逐一展开。

最重要的认知是：

> **Solana 的状态不是简单地藏在某个中心数据库的黑盒里，而是由链上大量的 Accounts 构成。**

交易通过声明自己要读写的 Accounts，把“状态访问范围”变成了可分析的信息。

---

## 5.5 Program 与 Account 的分离

Solana 中有一个非常清晰的模型：

```text
Program = Code（逻辑）
Account = State / Data（状态）
```

- **Program** 是执行逻辑（代码），本身通常是只读的可执行账户。
- **Account** 承载被操作的状态与数据。

执行路径可以简化为：

```text
Transaction
   ↓
Instruction（指令：调用哪个 Program、提供哪些 Accounts、附带什么参数）
   ↓
Program（执行逻辑）
   ↓
Accounts（被读写的状态）
   ↓
State Change
```

这和 Web2 的：

```text
Backend Code
   ↓
Database
```

有一定类比关系，但边界必须说清楚：

- Web2 中，后端代码和数据库通常由同一运营方控制，信任边界集中。
- Solana 中，Program 的执行结果必须可被网络验证，Accounts 的访问关系还要参与依赖分析与并行调度。

真正重要的工程后果是：

> **Accounts 的访问关系会直接参与交易依赖分析，从而影响能否并行。**

---

## 5.6 Sealevel：真正负责并行执行的是什么？

这里必须把两个概念严格分开：

### Consensus（共识）

回答的问题是：

> **网络最终接受什么历史和状态？**

### Execution / Runtime（执行 / 运行时）

回答的问题是：

> **已经确定需要处理的交易，应该如何执行？**

**Sealevel** 属于后者。

它可以先理解为 Solana 的并行运行时：根据交易所声明的 Account 访问关系识别依赖，并尽可能让互不冲突的交易并行执行。

因此：

```text
Consensus
   │
   └─ What?
      大家最终接受什么历史与状态？

Execution / Sealevel
   │
   └─ How?
      如何高效、安全地执行已确定的交易？
```

**Sealevel 不是 Solana 的共识算法。**

这是后续学习 Solana 内部原理时必须始终保持清楚的一条边界。把“并行执行运行时”和“共识机制”混为一谈，会导致大量概念混乱。

---

## 5.7 Proof of History（PoH）：为什么需要可验证的时间顺序？

分布式网络有一个天然困难：

> 消息什么时候发生？谁先发生？不同节点什么时候看到同一事件？

如果完全依赖传统网络时间或中心化时钟，节点之间需要大量额外协调，且难以形成可验证的先后关系。

**Proof of History（PoH）**可以先理解为一种帮助网络建立**可验证时间顺序**的机制。它让某些事件的先后关系能够以一种高效、可验证的方式被表达和检查。

但必须强调：

> **PoH 不等于“Solana 的共识”。**

PoH 是 Solana 系统中的时间与顺序机制之一，它为共识和其他组件提供有价值的输入，但共识本身是更大的问题（网络最终接受什么历史）。把 PoH 直接等同于共识，是另一个常见误解。

---

## 5.8 Solana 为什么强调现代硬件？

现代服务器并不是一颗单核 CPU：

```text
多核 CPU
大容量 Memory
高速 SSD
高速网络
（某些场景下的 GPU / 专用硬件）
```

传统偏向串行的执行模型很难充分利用这些资源。

Solana 的设计方向之一，就是让区块链的执行模型更适合现代硬件：

```text
区块链状态机
      ↓
识别状态依赖（借助显式 Account 访问）
      ↓
把互不冲突的工作拆出来
      ↓
利用并行计算资源
      ↓
提高单位时间处理能力
```

这并不意味着“所有交易都并行”。真正的目标是：

> **在安全规则允许的范围内，尽可能多地并行。**

安全永远优先于盲目的速度。

---

## 5.9 Solana 并不只是“并行执行”

如果只记住“Solana = parallel execution”，仍然过于简单。

它是一套相互配合的系统工程：

```text
Transaction Model
       ↓
Explicit Account Access（显式声明状态访问）
       ↓
State Dependency Analysis（依赖分析）
       ↓
Parallel Runtime（Sealevel）
       ↓
Network / Ordering / Consensus
       ↓
Modern Hardware Utilization
```

这些设计层层支撑，最终才形成 Solana 在吞吐、延迟与硬件利用上的特征。缺少任何一层，简单的“并行”都难以安全落地。

---

## 5.10 从 Web2 后端开发者角度重新理解

假设你正在设计一个传统 Web2 后端：

```text
HTTP Request
   ↓
API Server
   ↓
Business Logic
   ↓
Database
```

你很自然会问：

> “两个请求如果修改完全不同的数据，为什么不能并行处理？”

答案通常是：当然可以。数据库和应用服务器会做各种并发控制与优化。

Solana 把类似问题推进到了区块链协议和运行时层：

```text
Transaction
   ↓
Declared Accounts（明确声明要访问的状态）
   ↓
Dependency Analysis
   ↓
Parallel Execution
   ↓
State Update
```

因此，作为一个有后端经验的开发者学习 Solana，**认真理解 Account 访问关系**会比死记硬背术语更有价值。它直接决定了交易如何被调度、如何避免冲突、如何利用并行。

---

## 5.11 到这里，设计逻辑已经闭环

我们从最初的问题一路走下来：

```text
为什么需要钱？
  → 交换需要共同接受的价值媒介
为什么需要账本？
  → 必须记录谁拥有什么
为什么需要区块链？
  → 希望在没有中央维护者的情况下共同记账
Bitcoin
  → 解决去中心化数字价值转移
Ethereum
  → 把共享账本变成可编程状态机
新的问题
  → 程序越来越多，如何在安全前提下高效执行？
Solana
  → 重新设计状态访问、执行运行时与系统架构
  → 尽可能利用现代硬件进行并行处理
```

第一期的世界观地图到此完成。下一期我们将真正进入 Solana 的可操作对象：

```text
SOL → Lamports → Wallet → Address → Account → RPC → Transaction
```

这些概念将不再只是定义，而会逐步变成可以亲手操作的真实对象。

---

## 本章小结

1. Solana 不是简单的“更快的 Ethereum”，而是对交易模型、状态访问、执行与硬件利用的系统重构。
2. 并行执行的前提是知道交易之间的状态依赖；无冲突的交易更适合并行，有冲突的必须串行或协调。
3. Solana 要求交易显式声明要访问的 Accounts，使运行时能够在执行前做依赖分析。
4. Account 是状态基本单元；Program 是代码，Account 是状态，二者分离。
5. Sealevel 是并行执行运行时，解决“如何高效执行”；Consensus 解决“接受什么历史”。二者必须区分。
6. PoH 帮助建立可验证的时间顺序，但它不等于共识本身。
7. Solana 的设计目标是在安全规则允许的范围内，尽可能利用现代硬件进行并行处理。

---

## 思考题

1. 为什么说“Solana 是更快的 Ethereum”这个说法不够准确？它忽略了哪些设计层面的差异？
2. 请用两笔交易的例子说明：什么情况下适合并行，什么情况下存在依赖必须协调。
3. 显式 Account 访问解决了什么问题？如果交易是黑盒，运行时会面临什么困难？
4. Program 与 Account 的分离带来了什么工程好处？它和 Web2 的“代码 + 数据库”有何相似与不同？
5. Sealevel 与 Consensus 分别回答什么问题？为什么不能把它们混为一谈？
6. PoH 的主要作用是什么？为什么说它不等于 Solana 的共识？

---

## 本章术语

| 术语 | 含义 |
|------|------|
| Account | Solana 中链上状态的基本单元 |
| Program | 执行逻辑（代码），通常为可执行账户 |
| Instruction | 交易中的指令，指定调用的 Program、Accounts 与参数 |
| Sealevel | Solana 的并行执行运行时 |
| Proof of History (PoH) | 帮助建立可验证时间顺序的机制 |
| Explicit Account Access | 交易显式声明要访问的 Accounts |
| State Dependency | 状态依赖，交易因访问相同状态而产生的执行约束 |
| Parallel Runtime | 并行运行时，根据依赖关系调度交易执行的运行时 |

---

**第一期结束，下一期预告**：有了完整的世界观地图后，我们将进入 Vol. 02，真正开始操作 Solana：SOL 与 Lamports、Wallet 与 Address、Account 的具体字段、以及如何通过 RPC 与网络交互。理论将逐步变成可以运行的代码与可观察的状态。
