<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:28:02
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage>
    <n-upload
      class="mx-auto w-[75%] p-20 text-center"
      :custom-request="handleUpload"
      :show-file-list="false"
      accept=".png,.jpg,.jpeg"
      @before-upload="onBeforeUpload"
    >
      <n-upload-dragger>
        <div class="h-150 f-c-c flex-col">
          <i class="i-mdi:upload mb-12 text-68 color-primary" />
          <n-text class="text-14 color-gray">点击或者拖动文件到该区域来上传</n-text>
        </div>
      </n-upload-dragger>
    </n-upload>
    <n-card v-if="imgList && imgList.length" class="mt-16 items-center">
      <n-image-group>
        <n-space justify="space-between" align="center">
          <n-card v-for="(item, index) in imgList" :key="index" class="w-280 hover:card-shadow">
            <div class="h-160 f-c-c">
              <n-image width="200" :src="item.url" />
            </div>
            <n-space class="mt-16" justify="space-evenly">
              <n-button dashed type="primary" @click="copy(item.url)">url</n-button>
              <n-button dashed type="primary" @click="copy(`![${item.fileName}](${item.url})`)">
                MD
              </n-button>
              <n-button
                dashed
                type="primary"
                @click="copy(`&lt;img src=&quot;${item.url}&quot; /&gt;`)"
              >
                img
              </n-button>
            </n-space>
          </n-card>
          <div v-for="i in 4" :key="i" class="w-280" />
        </n-space>
      </n-image-group>
    </n-card>
  </CommonPage>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import uploadFileToOSS from '@/composables/useUploadOss'
import { ref } from 'vue'

defineOptions({ name: 'ImgUpload' })

const { copy, copied } = useClipboard()

const imgList = reactive([
  { url: 'https://miniprogram.fancyzh.top/foods/dumplings-8.jpg' },
  { url: 'https://miniprogram.fancyzh.top/foods/dumplings-8.jpg' },
  { url: 'https://miniprogram.fancyzh.top/foods/dumplings-8.jpg' },
  { url: 'https://miniprogram.fancyzh.top/foods/dumplings-8.jpg' },
])

watch(copied, (val) => {
  val && $message.success('已复制到剪切板')
})

const handleFileChange = async ({ file }) => {
  console.log('eee==filefile', file)
  if (file) {
    console.log('file', file)
    uploadFileToOSS(file).then((imgInfo) => {
      console.log('imgInfo', imgInfo)
      imgList.push(imgInfo)
    })
  }
}
function onBeforeUpload({ file }) {
  if (!file.file?.type.startsWith('image/')) {
    $message.error('只能上传图片')
    return false
  }
  return true
}

async function handleUpload({ file, onFinish }) {
  console.log('图片信息', file)
  if (!file || !file.type) {
    $message.error('请选择文件')
  }
  // 真实上传
  // 模拟上传
  $message.loading('上传中...')
  setTimeout(async () => {
    $message.success('上传成功')
    await handleFileChange(file)
    // imgList.push({ fileName: file.name, url: URL.createObjectURL(file.file) })
    onFinish()
    console.log('imgList', imgList)
  }, 1500)
}
</script>
