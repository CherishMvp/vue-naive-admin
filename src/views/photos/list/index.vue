<template>
  <CommonPage show-footer>
    <n-space size="large" mt-30>
      <n-card title="相册总数">
        <h4>相册的总数量</h4>
        <n-space vertical>
    <n-progress
    w-200
      type="line"
      :percentage="50"
      :height="24"
      :border-radius="4"
      :fill-border-radius="0"
    />
    <n-progress
      type="line"
      status="error"
      :percentage="50"
      :height="24"
      border-radius="12px 12px 0 0"
      fill-border-radius="12px 0 12px 12px"
    >
      一种艺术
    </n-progress>
  </n-space>
    </n-card>
      </n-space>
  </CommonPage>
</template>

<script setup>
import { sleep } from '@/utils'
const handleDelete = function () {
  $dialog.confirm({
    content: '确认删除？',
    confirm() {
      $message.success('删除成功')
    },
    cancel() {
      $message.warning('已取消')
    },
  })
}

const loading = ref(false)
async function handleLogin() {
  loading.value = true
  $message.loading('登录中...', { key: 'login' })
  await sleep(2000)
  $message.error('登录失败', { key: 'login' })
  await sleep(500)
  $message.loading('正在尝试重新登录...', { key: 'login' })
  await sleep(2000)
  $message.success('登录成功', { key: 'login' })
  loading.value = false
}

function handleMultiMessage() {
  $message.error(['用户名不能为空！', '密码不能为空！', '密码必须大于6位！'])
}

function notify(type) {
  $notification[type]({
    content: '说点啥呢',
    meta: '想不出来',
    duration: 2500,
    keepAliveOnHover: true,
  })
}
</script>
