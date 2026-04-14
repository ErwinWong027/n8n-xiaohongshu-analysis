import { Check, Sparkles, Zap, Infinity } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: '免费版',
    price: '免费',
    period: '',
    description: '体验 AI 仿写功能',
    limit: '每日 5 次',
    icon: <Zap className="w-6 h-6 text-gray-500" />,
    color: 'border-gray-200 dark:border-gray-700',
    headerBg: 'bg-gray-50 dark:bg-gray-800',
    features: [
      '每日 5 次 AI 仿写',
      '基础风格模仿',
      '支持 Emoji 生成',
      '复制导出内容',
    ],
    cta: null,
    ctaStyle: '',
  },
  {
    name: 'Pro',
    price: '9.9',
    period: '元/月',
    description: '创作更多优质内容',
    limit: '每日 30 次',
    icon: <Sparkles className="w-6 h-6 text-rose-500" />,
    color: 'border-rose-300 dark:border-rose-600 shadow-lg shadow-rose-100 dark:shadow-rose-900/30',
    headerBg: 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30',
    badge: '推荐',
    features: [
      '每日 30 次 AI 仿写',
      '高级风格模仿',
      '支持 Emoji 生成',
      '复制导出内容',
      '优先响应速度',
    ],
    cta: 'pro',
    ctaStyle: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white',
  },
  {
    name: 'Max',
    price: '39',
    period: '元/月',
    description: '无限创作，畅享全功能',
    limit: '每日无限次',
    icon: <Infinity className="w-6 h-6 text-amber-500" />,
    color: 'border-amber-300 dark:border-amber-600',
    headerBg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30',
    features: [
      '每日无限次 AI 仿写',
      '高级风格模仿',
      '支持 Emoji 生成',
      '复制导出内容',
      '优先响应速度',
      '新功能优先体验',
    ],
    cta: 'max',
    ctaStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white',
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-block text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-6 transition-colors"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            选择适合你的套餐
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            解锁更多 AI 创作次数，让灵感随时迸发
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 ${plan.color} overflow-hidden flex flex-col`}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className="bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className={`${plan.headerBg} p-6`}>
                <div className="flex items-center gap-3 mb-3">
                  {plan.icon}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  {plan.price === '免费' ? (
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">免费</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{plan.period}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-white/60 dark:bg-gray-900/40 rounded-full px-3 py-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{plan.limit}</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-6">
                  {plan.cta ? (
                    <WechatUpgradeButton plan={plan.cta} style={plan.ctaStyle} />
                  ) : (
                    <Link
                      href="/"
                      className="block w-full text-center py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      当前使用中
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WeChat payment section */}
        <WechatPaymentSection />

        {/* FAQ */}
        <div className="mt-16 text-center text-sm text-gray-400 dark:text-gray-500 space-y-1">
          <p>付款后账户通常在 24 小时内升级 · 如有问题请通过微信联系我们</p>
          <p>每月自动到期，不会自动续费</p>
        </div>
      </div>
    </main>
  )
}

function WechatUpgradeButton({ plan, style }: { plan: string; style: string }) {
  return (
    <a
      href="#wechat-payment"
      className={`block w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${style}`}
    >
      <Sparkles className="w-4 h-4 inline mr-1.5 -mt-0.5" />
      联系升级 {plan === 'pro' ? 'Pro' : 'Max'}
    </a>
  )
}

function WechatPaymentSection() {
  return (
    <div id="wechat-payment" className="mt-16 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center max-w-lg mx-auto">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">如何升级套餐</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        扫描下方微信二维码，备注您的<span className="font-semibold text-gray-700 dark:text-gray-300">注册邮箱</span>及套餐名称，完成付款后我们将在 <span className="font-semibold text-gray-700 dark:text-gray-300">24 小时内</span>为您升级账户。
      </p>

      {/* WeChat QR placeholder — replace public/wechat-qr.png with your actual QR code */}
      <div className="flex justify-center mb-4">
        <div className="w-48 h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wechat-qr.png"
            alt="微信收款码"
            className="w-full h-full object-contain"
            onError={(e) => {
              const el = e.currentTarget
              el.style.display = 'none'
              el.parentElement!.innerHTML = '<p class="text-xs text-gray-400 p-4">请将微信收款码<br/>图片放到<br/>public/wechat-qr.png</p>'
            }}
          />
        </div>
      </div>

      <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
        <p>Pro · 9.9元/月 · 每日 30 次</p>
        <p>Max · 39元/月 · 每日无限次</p>
      </div>
    </div>
  )
}
