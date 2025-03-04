<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:51:56
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage show-footer>
    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="apiClassPhoto.readDorm"
    >
      <MeQueryItem label="寝室号" :label-width="80">
        <n-input
          v-model:value="queryItems.dormitoryId"
          type="text"
          placeholder="请输入寝室号"
          clearable
          @keydown.enter="() => $table?.handleSearch()"
        />
      </MeQueryItem>
      <MeQueryItem label="导航标题" :label-width="80">
        <n-input
          v-model:value="queryItems.title"
          type="text"
          placeholder="请输入导航标题"
          clearable
          @keydown.enter="() => $table?.handleSearch()"
        />
      </MeQueryItem>
      <!-- <MeQueryItem label="状态" :label-width="50">
        <n-select
          v-model:value="queryItems.enable"
          clearable
          :options="[
            { label: '启用', value: 1 },
            { label: '停用', value: 0 },
          ]"
        />
      </MeQueryItem> -->
    </MeCrud>
    <MeModal rounded-12 ref="modalRef">
      <n-form
        ref="modalFormRef"
        :model="modalForm"
        :rules="rules"
        label-placement="left"
        label-align="left"
        :label-width="120"
      >
        <n-form-item path="title" label="导航标题">
          <n-input round v-model:value="modalForm.title" />
        </n-form-item>
        <n-form-item path="desc" label="宣传标语">
          <n-input round v-model:value="modalForm.desc" type="text" />
        </n-form-item>
        <n-form-item path="dormitoryId" label="寝室号">
          <!-- <n-input round  v-model:value="modalForm.dormitoryId" type="text" /> -->
          <n-select
            rounded-12
            clearable
            v-model:value="modalForm.dormitoryId"
            :loading="loading"
            placeholder="搜索寝室ID"
            :options="options"
          ></n-select>
        </n-form-item>
        <n-form-item path="swiper_list" label="轮播图URL地址">
          <n-input
            rounded-12
            round
            type="textarea"
            v-model:value="modalForm.swiper_list"
            placeholder="输入URL，一行一个"
          />
        </n-form-item>
      </n-form>
    </MeModal>
    <MeModal ref="$modal2" title="上一个弹窗提交的内容">
      <h2>{{ text }}</h2>
    </MeModal>
    <!-- <n-data-table :columns="columns" :data="data" :pagination="paginationReactive" /> -->
  </CommonPage>
</template>

<script setup>
import { MeModal, MeCrud, MeQueryItem } from '@/components'
import { ref, h, reactive } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'
import { apiClassPhoto } from '../api'
import { useCrud, useOptionsSearch } from '@/composables'

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

function submitCallback() {
  $message.success('Submit')
}

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
      trigger: ['input', 'blur'],
    },
  ],
  dormitoryId: [
    {
      required: true,
      message: '请输入寝室ID',
    },
  ],
  swiper_list: [
    {
      required: true,
      message: '请输入url链接，英文逗号隔开',
    },
  ],
}

const text = ref('')
const columns = [
  {
    title: '序号',
    key: 'id',
    align: 'center',
    render(row) {
      return '# ' + row.id
    },
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
    title: '寝室号',
    key: 'dormitoryId',
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px',
          },
          type: 'info',
          bordered: false,
        },
        {
          default: () => row.dormitoryId,
        }
      )
    },
  },
  {
    title: '轮播图url',
    key: 'swiper_list',
    align: 'center',
    width: 420,
    render(row) {
      return row.swiper_list.join(',')
    },
  },
  {
    title: '操作栏',
    key: 'actions',
    align: 'center',
    width: 320,
    fixed: 'right',

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
            icon: () => h('i', { class: 'i-fe:edit text-14' }),
          }
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
            icon: () => h('i', { class: 'i-fe:trash text-14' }),
          }
        ),
      ]
    },
  },
]
onMounted(() => {
  console.log('读取相册列表内容')
  // getAllPhotoList()
  // init()
  $table.value?.handleSearch()
})
const { options, loading } = useOptionsSearch()

// 解构增删改操作
const { modalRef, modalFormRef, modalAction, modalForm, handleAdd, handleDelete, handleEdit } =
  useCrud({
    name: '寝室',
    doCreate: apiClassPhoto.createRoom,
    doDelete: apiClassPhoto.deleteRoom,
    doUpdate: apiClassPhoto.updateRoom,
    initForm: { enable: true },
    refresh: () => $table.value?.handleSearch(),
  })

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
