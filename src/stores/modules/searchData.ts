type SearchData = Record<string, unknown>

export const useSearchDataStore = defineStore('searchData', {
  state: (): { data: SearchData } => ({
    data: {},
  }),
  actions: {
    addData(newData: SearchData) {
      this.data = newData
    },
    deleteData() {
      this.data = {}
    },
  },
})
