// useOptionsSearch.js
import { ref, onMounted } from 'vue'
import { apiClassPhoto } from '@/views/photos/api' // 导入你的 API 模块

export function useOptionsSearch() {
  const options = ref([])
  const loading = ref(false)

  const handleOptionsSearch = async () => {
    loading.value = true
    const res = await apiClassPhoto.getAllRoomIds()
    options.value = res.data.map((item) => {
      return { label: item.dormitoryId + '-' + item.title, value: item.dormitoryId }
    })
    loading.value = false
  }

  onMounted(() => {
    handleOptionsSearch()
    console.log('options==hooks执行完毕', options.value)
  })

  return {
    options,
    loading,
    handleOptionsSearch,
  }
}
