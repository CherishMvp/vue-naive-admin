<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:51:56
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage show-footer>
    <!-- <n-button type="primary" @click="openModal1">打开第一个弹个窗</n-button> -->
    <MeModal rounded-12 ref="$modal1">
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <n-form-item path="title" label="导航标题">
          <n-input round v-model:value="modelRef.title" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="desc" label="文本内容描述">
          <n-input round v-model:value="modelRef.desc" type="string" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="swiper_list" label="轮播图URL地址">
          <n-input
            rounded-12
            round
            type="textarea"
            v-model:value="modelRef.swiper_list"
            placeholder="输入URL，一行一个"
          />
        </n-form-item>
        <!-- <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button
                :disabled="modelRef.title === null"
                round
                type="primary"
                @click="handleValidateButtonClick"
              >
                验证
              </n-button>
            </div>
          </n-col>
        </n-row> -->
      </n-form>
    </MeModal>
    <MeModal ref="$modal2" title="上一个弹窗提交的内容">
      <h2>{{ text }}</h2>
    </MeModal>
    <n-data-table :columns="columns" :data="data" :pagination="paginationReactive" />
  </CommonPage>
</template>

<script setup>
import { MeModal } from '@/components'
import { sleep } from '@/utils'
import { useModal } from '@/composables'
import { ref, h, reactive } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'

const showModal = ref(false)
function cancelCallback() {
  $message.success('Cancel')
}
function submitCallback() {
  $message.success('Submit')
}
const formRef = ref(null)
const rPasswordFormItemRef = ref(null)
const modelRef = ref({
  title: undefined,
  desc: null,
  swiper_list: undefined,
})
const rules = {
  title: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('需要标题')
        } else if (value.length > 50) {
          return new Error('不能超过50个字符')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  desc: [
    {
      required: true,
      message: '请输入描述',
    },
  ],
  swiper_list: [
    {
      required: true,
      message: '请输入url链接，换行输入',
      trigger: ['input', 'blur'],
    },
  ],
}
function handleValidateButtonClick() {
  // e.preventDefault()
  return formRef.value?.validate((errors) => {
    if (!errors) {
      $message.success('验证成功')
      return true
    } else {
      console.log(errors)
      $message.error('验证失败')
      return false
    }
  })
}
const text = ref('')
const [$modal1, okLoading1] = useModal()
function openModal1(row) {
  console.log('row', row)
  const { key, ...rest } = row
  modelRef.value = rest
  $modal1.value?.open({
    title: '导航信息修改',
    width: '600px',
    okText: '确认修改',
    cancelText: '关闭',
    async onOk() {
      const res = await handleValidateButtonClick()
      if (res) {
        $message.error('请按要求填写内容')
        return false
      }
      console.log('res', res)
      console.log('校验后的参数', modelRef.value)
      okLoading1.value = true
      $message.loading('正在提交...', { key: 'modal1' })
      await sleep(1000)
      okLoading1.value = false
      $message.success('提交成功', { key: 'modal1' })
      // openModal2()
      $modal1.value?.close()
      return false // 默认关闭弹窗，返回false可让弹窗不关闭
    },
    onCancel(message) {
      $message.info(message ?? '已取消')
    },
  })
}

const [$modal2, okLoading2] = useModal()
function openModal2() {
  $modal2.value?.open({
    cancelText: '关闭当前',
    okText: '关闭所有弹窗',
    modalStyle: { width: '320px', padding: '12px', top: '100px' },
    async onOk() {
      okLoading2.value = true
      $message.loading('正在关闭...', { key: 'modal2' })
      await sleep(1000)
      okLoading2.value = false

      // 把modal1也关了
      $modal1.value?.close()
      $message.success('已关闭', { key: 'modal2' })
    },
  })
}
const columns = [
  {
    title: '序号',
    key: 'id',
    align: 'center',
  },
  {
    title: '导航标题',
    key: 'title',
    align: 'center',
  },

  {
    title: '文本内容描述',
    key: 'desc',
    align: 'center',
  },
  {
    title: '轮播图url',
    key: 'swiper_list',
    align: 'center',
  },
  {
    title: '操作栏',
    key: 'actions',
    align: 'center',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleEdit(row),
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          },
        ),
      ]
    },
  },
]
const handleEdit = (row) => {
  console.log('row', row)
  openModal1(row)
}
const handleDelete = (row) => {
  console.log('row', row)
}
const play = (row) => {
  console.log('row', row)
  $message.success('打开', row)
}
const data = Array.from({ length: 46 }).map((_, index) => ({
  key: index,
  title: `Edward King ${index}`,
  id: index,
  desc: `London, Park Lane no. ${index}`,
  swiper_list: `https://example.com/page-${index}\nhttps://example.com/page-${index + 1}\n`,
}))

const paginationReactive = reactive({
  page: 2,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [3, 5, 7],
  onChange: (page) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})
</script>
