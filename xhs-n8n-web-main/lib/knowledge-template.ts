/**
 * 知识库模版（模版一）
 * 可在 AI 仿写对话框中选择使用，自动填充内容主题文本框。
 */

const TEMPLATE_ONE_DATA = {
  define_objective: {
    primary_goal: '构建一个面向应届生与高频求职者的AI求职自动化Agent',
    mission: '通过跨平台自动填写、智能匹配与进度追踪，实现求职流程全链路自动化与效率提升',
    success_metrics: ['减少90%以上重复填写时间', '提升投递效率最高60倍', '提高面试转化率'],
  },
  agent_config: {
    target_users: ['应届毕业生', '高频投递求职者', '职场转型者'],
  },
  components: {
    auto_apply_engine: {
      description: '跨平台ATS自动填写系统',
      capabilities: ['字段语义识别', '动态表单解析'],
    },
    jd_parsing_module: {
      description: '岗位JD语义解析模块',
      capabilities: ['关键词抽取', '技能权重识别'],
    },
    resume_optimization_module: {
      description: '基于JD的简历智能优化',
      capabilities: ['表达重构', 'ATS关键词强化'],
    },
    application_tracking_module: {
      description: '投递进度自动追踪系统',
      capabilities: ['状态抓取', '流程节点更新'],
    },
  },
  integrate_and_render: {
    execution_flow: ['解析用户目标', '筛选岗位', '计算匹配度', '优化简历', '执行自动填写', '提交申请', '更新进度看板'],
  },
}

export const TEMPLATE_ONE_TEXT = `## 产品/服务主题
${TEMPLATE_ONE_DATA.define_objective.primary_goal}

## 核心价值主张
${TEMPLATE_ONE_DATA.define_objective.mission}

## 目标用户群体
${TEMPLATE_ONE_DATA.agent_config.target_users.join('、')}

## 核心功能亮点
${Object.values(TEMPLATE_ONE_DATA.components).map(c => `- **${c.description}**：${c.capabilities.join('，')}`).join('\n')}

## 效果数据（可在笔记中引用）
${TEMPLATE_ONE_DATA.define_objective.success_metrics.map(m => `✅ ${m}`).join('\n')}

## 使用流程
${TEMPLATE_ONE_DATA.integrate_and_render.execution_flow.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## 仿写要求
请参考以上产品信息，创作一篇小红书风格的种草/推广笔记。语言要亲切自然，符合小红书用户表达习惯，突出产品解决的核心痛点和具体效果数据，结尾加入互动引导，适合目标用户群体阅读。`
