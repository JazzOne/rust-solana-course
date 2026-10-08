# Rust × Solana

从加密新人到能做产品的实战课程。

从「钱与账本」出发，逐步走进 Solana、Rust、链上程序与真实产品。

## 在线阅读

- **站点**：https://rust-solana-course.netlify.app
- **仓库**：https://github.com/JazzOne/rust-solana-course

> 若站点尚未显示课程内容：请到 [Netlify 项目页](https://app.netlify.com/projects/rust-solana-course) → **Site configuration → Build & deploy → Continuous deployment**，将本 GitHub 仓库 `JazzOne/rust-solana-course` 连接到站点。连接后每次 push `main` 会自动构建 VitePress 并发布。

## 本地开发

```bash
npm install
npm run docs:dev
```

## 构建

```bash
npm run docs:build
```

发布目录：`docs/.vitepress/dist`（已在 `netlify.toml` 中配置）。

## 课程结构

- **Vol. 01**｜理解区块链：从 Bitcoin 到 Solana ✅
- Vol. 02｜SOL、Wallet 与 Account
- Vol. 03｜Transaction、RPC 与第一次链上交互
- Vol. 04｜Rust + Anchor：写出第一个 Solana Program
- Vol. 05｜PDA、CPI 与 Token
- Vol. 06｜从链上程序到 Payment Product
- Vol. 07｜Solana 安全工程
- Vol. 08｜Solana Runtime 与底层原理
- Vol. 09｜产品化、商业化与机会验证

## 技术栈

- [VitePress](https://vitepress.dev/) — 静态文档站点
- 部署：Netlify

## License

课程内容供学习使用。
