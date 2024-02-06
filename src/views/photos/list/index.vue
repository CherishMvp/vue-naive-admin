<template>
  <CommonPage show-footer>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="mr-4 i-material-symbols:add text-18" />
        新增相册
      </n-button>
    </template>
    <n-flex justify="space-around" :vertical="false" :size="[30, 20]">
      <n-row>
        <n-col class="flex justify-center" span="12" v-for="(item, _index) in photosList" :key="item.id">
          <n-card style="width: 30vw" rounded-8 m20 :title="dormInfo(item.dormitoryId, item.title)">
            <template #header-extra>
              <h4>{{ item.photo_nums }}条</h4>
            </template>
            <h5 mb20>{{ item.desc }}</h5>
            <n-space vertical>
              <n-progress
                type="line"
                :color="themeVars.successColor"
                :rail-color="changeColor(themeVars.successColor, { alpha: 0.2 })"
                :indicator-text-color="themeVars.successColor"
                :percentage="calculatePercentage(item)"
                :height="24"
              />
            </n-space>
          </n-card>
        </n-col>
      </n-row>
    </n-flex>

    <!-- 新增相册modal -->
    <MeModal rounded-12 ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
      >
        <n-form-item
          label="导航标题"
          path="title"
          :rule="{
            required: true,
            message: '请输入导航标题（寝室名）',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.title" />
        </n-form-item>
        <n-form-item
          label="寝室号"
          path="dormitoryId"
          :rule="{
            required: true,
            message: '请输入寝室号',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.dormitoryId" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          label="描述"
          path="desc"
          :rule="{
            required: true,
            message: '请输入描述（宣传标语）',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.desc" />
        </n-form-item>
        <n-form-item
          label="轮播图"
          path="swiper_list"
          :rule="{
            required: true,
            message: '请输入轮播图链接（顶部展示）',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input type="textarea" v-model:value="modalForm.swiper_list" />
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { sleep } from '@/utils'
import { useThemeVars } from 'naive-ui'
import { changeColor } from 'seemly'
import { apiClassPhoto } from '../api'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'

const themeVars = useThemeVars()
const percentage = ref(50)
const contain_nums = ref(100)
// const photosList = ref([
//   {
//     id: 1,
//     name: '相册1',
//     desc: '还将两行泪，泪流无限，别时天涯，未必相见',
//     photo_nums: 20,
//     contain_nums: 100,
//   },
//   {
//     id: 2,
//     name: '相册2',
//     desc: '相思相见知何日，此时此夜难为情。',
//     photo_nums: 10,
//     contain_nums: 150,
//   },
//   {
//     id: 3,
//     name: '相册3',
//     desc: 'Mocked description 3',
//     photo_nums: 30,
//     contain_nums: 75,
//   },
//   {
//     id: 4,
//     name: '相册4',
//     desc: 'Mocked description 4',
//     photo_nums: 5,
//     contain_nums: 200,
//   },
//   {
//     id: 5,
//     name: '相册5',
//     desc: 'Mocked description 5',
//     photo_nums: 40,
//     contain_nums: 50,
//   },
// ])
const photosList = ref([])
const calculatePercentage = (item) => {
  const photo = photosList.value.find((photo) => photo.id === item.id)
  if (!photo) {
    return null
  }
  const percentage = (photo.photo_nums / contain_nums.value) * 100
  return parseFloat(percentage.toFixed(1))
}
const dormInfo = (id, title) => {
  return id + '-' + title
}
const getAllPhotoList = async () => {
  const res = await apiClassPhoto.getAllPhotos()
  console.log('res', res)
  photosList.value = res.data
}

onMounted(() => {
  console.log('读取相册列表内容')
  // getAllPhotoList()
  init()
})

// 解构增删改操作
const { modalRef, modalFormRef, modalAction, modalForm, handleAdd, handleDelete, handleEdit } =
  useCrud({
    name: '相册',
    doCreate: apiClassPhoto.createRoom,
    doDelete: apiClassPhoto.deleteRoom,
    doUpdate: apiClassPhoto.updateRoom,
    initForm: { enable: true },
    refresh: () => init(),
  })

const init = () => {
  apiClassPhoto.getAllPhotos().then(({ data = [] }) => {
    console.log('封装接口自动读取data', data)
    photosList.value = data
  })
}
</script>
