<template>
  <CommonPage show-footer>
    <n-space size="large" mt-30>
      <n-card
        rounded-8
        mb-15
        v-for="(item, _index) in photosList"
        :key="item.id"
        :title="item.name"
      >
        <h5 mb20>{{ item.desc }}</h5>
        <n-space vertical>
          <n-progress
            style="width: 240px"
            type="line"
            :color="themeVars.successColor"
            :rail-color="changeColor(themeVars.successColor, { alpha: 0.2 })"
            :indicator-text-color="themeVars.successColor"
            :percentage="calculatePercentage(item)"
            :height="24"
          />
        </n-space>
      </n-card>
    </n-space>
  </CommonPage>
</template>

<script setup>
import { sleep } from '@/utils'
import { useThemeVars } from 'naive-ui'
import { changeColor } from 'seemly'
const themeVars = useThemeVars()
const percentage = ref(50)
const photosList = ref([
  {
    id: 1,
    name: '相册1',
    desc: '还将两行泪，泪流无限，别时天涯，未必相见',
    photo_nums: 20,
    contain_nums: 100,
  },
  {
    id: 2,
    name: '相册2',
    desc: '相思相见知何日，此时此夜难为情。',
    photo_nums: 10,
    contain_nums: 150,
  },
  {
    id: 3,
    name: '相册3',
    desc: 'Mocked description 3',
    photo_nums: 30,
    contain_nums: 75,
  },
  {
    id: 4,
    name: '相册4',
    desc: 'Mocked description 4',
    photo_nums: 5,
    contain_nums: 200,
  },
  {
    id: 5,
    name: '相册5',
    desc: 'Mocked description 5',
    photo_nums: 40,
    contain_nums: 50,
  },
])
const calculatePercentage = (item) => {
  const photo = photosList.value.find((photo) => photo.id === item.id)
  if (!photo) {
    return null
  }
  const percentage = (photo.photo_nums / photo.contain_nums) * 100
  return parseFloat(percentage.toFixed(1))
}
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
