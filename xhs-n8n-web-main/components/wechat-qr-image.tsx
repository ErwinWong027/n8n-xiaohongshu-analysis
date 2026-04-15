'use client'

export function WechatQrImage() {
  return (
    <img
      src="/wechat-qr.png"
      alt="微信收款码"
      className="w-full h-full object-contain"
      onError={(e) => {
        const el = e.currentTarget
        el.style.display = 'none'
        el.parentElement!.innerHTML =
          '<p class="text-xs text-gray-400 p-4">请将微信收款码<br/>图片放到<br/>public/wechat-qr.png</p>'
      }}
    />
  )
}
