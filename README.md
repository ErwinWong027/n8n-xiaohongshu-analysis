# n8n 小红书创作者分析工作流

基于 n8n 的小红书创作者数据分析工作流，自动抓取创作者数据并生成深度分析报告。

## 功能特性

- 📊 自动接收小红书创作者数据
- 🤖 AI 智能分析（DeepSeek 模型）
- 📝 生成 5 维度分析报告
- 💾 自动存储到 Supabase 数据库

## 工作流结构

```
接收小红书数据 → AI创作者分析 → 数据处理器 → 保存作者数据
                                              ↓
                                        笔记数据处理器 → 保存笔记数据 → 结果处理器
```

## 节点说明

### 1. 接收小红书数据 (Webhook)
- **类型**：Webhook 触发器
- **路径**：`xiaohongshu-analysis`
- **方法**：POST

### 2. AI创作者分析
- **模型**：OpenRouter DeepSeek
- **分析维度**：
  - 数据概览
  - 赛道分析
  - 标题风格分析
  - 笔记风格分析
  - 热门笔记分析

### 3. 数据处理器
- 解析 AI 分析结果
- 准备作者和笔记数据
- 计算其他笔记列表

### 4. 保存作者数据 (Supabase)
- 存储到 `authors` 表
- 包含完整分析报告

### 5. 笔记数据处理器
- 为笔记添加作者 ID
- 准备批量插入数据

### 6. 保存笔记数据 (Supabase)
- 存储到 `notes` 表
- 支持 top10 标记

### 7. 结果处理器
- 验证数据保存状态
- 返回执行结果

## 数据库表结构

### authors 表
| 字段 | 类型 | 说明 |
|------|------|------|
| user_name | TEXT | 用户名 |
| user_xhs_id | TEXT | 小红书 ID |
| subscribers | INTEGER | 订阅数 |
| followers | INTEGER | 粉丝数 |
| likes | INTEGER | 获赞数 |
| profile_url | TEXT | 档案地址 |
| other_notes | JSONB | 其他笔记列表 |
| report | TEXT | 分析报告 |

### notes 表
| 字段 | 类型 | 说明 |
|------|------|------|
| author_id | INTEGER | 作者 ID |
| title | TEXT | 笔记标题 |
| description | TEXT | 笔记描述 |
| likes | INTEGER | 点赞数 |
| collects | INTEGER | 收藏数 |
| is_top10 | BOOLEAN | 是否 top10 |
| raw_json | JSONB | 原始数据 |

## 使用方法

1. 在 n8n 中导入 `workflow*.json`
2. 配置 Supabase 节点连接
3. 配置 OpenRouter API 密钥
4. 触发 Webhook 发送数据
5. 查看执行结果

## API 示例

```bash
curl -X POST http://localhost:5678/webhook/xiaohongshu-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "测试用户",
    "userId": "test123",
    "subscribers": 1000,
    "followers": 5000,
    "likes": 10000,
    "profileUrl": "https://www.xiaohongshu.com/user/test123",
    "allTitles": ["标题1", "标题2", "标题3"],
    "top10Notes": [
      {
        "title": "热门笔记",
        "desc": "笔记描述",
        "like": 1000,
        "collect": 500
      }
    ]
  }'
```

## 依赖

- n8n
- Supabase
- OpenRouter (DeepSeek)

## 许可证

MIT
