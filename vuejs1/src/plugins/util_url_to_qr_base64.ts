import { AwesomeQR } from "awesome-qr"

// 生成文字PNG的dataURL（透明背景）
function create_text_logo(text: string, opt: { font?: string; color?: string; bg?: string; padding?: number } = {}) {
  const font = opt.font ?? "bold 18px sans-serif"
  const color = opt.color ?? "#000000"
  const padding = opt.padding ?? 6

  const c = document.createElement("canvas")
  const ctx = c.getContext("2d")!
  ctx.font = font
  const w = Math.ceil(ctx.measureText(text).width) + padding * 2
  const h = Math.ceil((ctx.measureText(text).actualBoundingBoxAscent || 14) + (ctx.measureText(text).actualBoundingBoxDescent || 4)) + padding * 2
  c.width = w
  c.height = h
  ctx.font = font
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  // 如需白底可开启：
  // ctx.fillStyle = opt.bg ?? 'rgba(255,255,255,0.9)'
  // ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = color
  ctx.fillText(text, w / 2, h / 2)
  return c.toDataURL("image/png")
}

// 生成中心带字的二维码（返回 dataURL）
export async function util_url_to_qr_base64({ url, text = "", size = 800 }: { url: string; text?: string; size?: number }): Promise<string> {
  const logo = create_text_logo(text, { font: "bold 18px sans-serif", color: "#000000" })
  const out = await new AwesomeQR({
    text: url,
    size: size,
    colorDark: "#000000",
    colorLight: "#FFFFFF",
    correctLevel: 3, // 高纠错，便于覆盖中心区域
    logoImage: logo, // 文字PNG作为logo
    logoScale: 0.3, // 调整文字块大小（0~1）
    logoMargin: 6, // 文字块四周留白
    // autoColor: false        // 需要时可关闭自动着色
  }).draw()

  // 浏览器中通常直接是 dataURL 字符串
  if (typeof out === "string") return out

  // 若返回的是 ArrayBuffer/Uint8Array，则转为 base64 dataURL
  const bytes = out instanceof ArrayBuffer ? new Uint8Array(out) : new Uint8Array(out as any)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  return `data:image/png;base64,${base64}`
}

// // 使用示例
// const data_url = await util_url_to_qr_base64("http://example.com", "我的测试二维码")
