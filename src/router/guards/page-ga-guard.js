/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:25:00
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

const baseTitle = import.meta.env.VITE_TITLE

export function createPageGAGuard(router) {
  router.afterEach((to) => {
    trackPageView(to) // 添加谷歌分析代码
  })
}
function trackPageView(route) {
  // 发送页面浏览事件到谷歌分析
  gtag('config', 'G-8JYVM30T4P', { page_path: route.path }) // 替换 YOUR_ANALYTICS_ID 为你自己的谷歌分析 ID
}
