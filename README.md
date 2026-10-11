# CodeVar

中文 → 英文代码变量名生成器（Alfred 工作流）

在 Alfred 中输入中文，自动调用有道翻译 API 转为英文，并生成 5 种命名风格的代码变量，结果自动复制、粘贴上屏。

> 本仓库为改造版：有道翻译密钥可在配置中设置（Alfred 环境变量 / 配置文件），**无需修改源码**。
> 基于 [xudaolong/CodeVar](https://github.com/xudaolong/CodeVar) 改造，感谢原作者。

## 功能

- 5 种命名风格：小驼峰 / 大驼峰 / 下划线 / 常量 / 中划线
- 结果自动复制并粘贴上屏，无需手动操作
- 密钥免改源码，支持三种配置方式
- 未配置密钥时输出友好提示，不会报错崩溃

## 依赖

- Node.js 8+
- Alfred 3+（Alfred 4 / 5 兼容）

## 安装

1. 下载 `dist/CodeVar.alfredworkflow`（已内置全部依赖，离线可用）
2. 双击导入 Alfred，在 Preferences → Workflows 中可见 CodeVar

## 配置（有道翻译密钥）

翻译功能依赖有道智云文本翻译 API：

1. 注册 [ai.youdao.com](https://ai.youdao.com)，创建应用并开通「文本翻译」服务
2. 获取 `appKey` 和 `secretKey`（一般有免费额度，超出按量计费，以官网为准）

密钥按以下优先级自动读取，任选一种配置即可：

### 方式一：Alfred 工作流环境变量（推荐）

1. Alfred → Preferences → Workflows → 选中 CodeVar
2. 点击工作流右上角的环境变量配置面板
3. 填写 `CODEVAR_APP_KEY` 和 `CODEVAR_SECRET_KEY`

无需修改任何代码，保存后即可使用。

### 方式二：工作流根目录配置文件

在工作流根目录创建 `codevar.config.json`（格式参考 `codevar.config.example.json`）：

```json
{
  "appKey": "你的有道 appKey",
  "secretKey": "你的有道 secretKey"
}
```

### 方式三：用户主目录配置文件

在用户主目录创建 `~/.codevar.config.json`，格式同上。

> ⚠️ 密钥属敏感信息，请勿公开分享配置文件或工作流。

## 使用

| 关键词 | 命名风格 | 示例（输入「苹果」） |
|---|---|---|
| `xt` | 小驼峰 | `apple` |
| `dt` | 大驼峰 | `Apple` |
| `xh` | 下划线 | `apple`（多词如 `apple_pie`） |
| `cl` | 常量 | `APPLE` |
| `zh` | 中划线 | `apple`（多词如 `apple-pie`） |

在 Alfred 中输入 `xt 苹果`，结果即自动复制并上屏。

## 开发

```bash
npm install        # 安装依赖
node --check xt.js # 语法检查

# 重新打包 alfredworkflow（需先 npm install）
zip -r dist/CodeVar.alfredworkflow . -x "*.git*" -x ".DS_Store" -x "dist/*"
```

## 过滤规则

`src/config.js` 中的 `filter` 字段可自定义翻译结果的处理规则：

- `prep`：过滤虚词（如 and、or、the、a、at、of）
- `suffix`：过滤后缀（如 ing、ed、ly）
- `verb`：过滤动词（如 was）

## 许可证

MIT，见 [LICENSE](./LICENSE)。

基于 [xudaolong/CodeVar](https://github.com/xudaolong/CodeVar)（ISC）改造。
