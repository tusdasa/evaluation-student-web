<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="载入中"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="课程编号" width="100">
        <template slot-scope="scope">
          {{ scope.row.courseId }}
        </template>
      </el-table-column>
      <el-table-column label="课程" width="400" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.courseName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button v-model="direction" type="primary" @click="evauationCourse(scope.row.courseId, scope.row.termId)">评价</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer :with-header="false" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <el-container>
        <el-main>
          <el-form ref="form" :model="form">
            <el-form-item v-for="(k, index) in kpiList" :key="k.thirdKpiId">
              <p><strong>{{ index + 1 }}、{{ k.thirdKpiContent }}</strong></p>
              <el-select v-model="form.kpi[index]" placeholder="请选择评价">
                <el-option label="很好" value="6" />
                <el-option label="较好" value="4" />
                <el-option label="一般" value="2" />
                <el-option label="较差" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item size="large">
              <el-button type="primary" @click="sumbitEvaluation">提交评价</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-drawer>

  </div>
</template>

<script>
import { getList, getKpiList, sendEvaluationData } from '@/api/table'
import { mapGetters } from 'vuex'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      // 课程数据
      list: null,
      listLoading: true,
      drawer: false,
      direction: 'rtl',
      // kpi
      kpiList: null,
      // 当前课程ID
      currentCourseId: null,
      form: {
        kpi: []
      }
    }
  },
  computed: {
    ...mapGetters(['role'])
  },
  created() {
    this.fetchData()
    this.fetchKpi()
  },
  methods: {
    evauationCourse(courseId, termId) {
      this.drawer = true
      this.currentCourseId = courseId
      this.termId = termId
    },
    sumbitEvaluation() {
      const courseEvaluation = {}
      const lists = []
      // this.form.kpi;
      if (this.form.kpi < this.kpiList.length) {
        this.$message.error('未完成')
        return
      }
      let flag = false
      for (let i = 0; i < this.form.kpi.length; i++) {
        const temp = {}
        temp.kid = this.kpiList[i].thirdKpiId
        temp.score = Number(this.form.kpi[i])
        if (temp.score === undefined || temp.score === null) {
          flag = true
          break
        }
        lists.push(temp)
      }
      if (flag) {
        this.$message.error('未完成')
        return
      } else {
        courseEvaluation.courseId = this.currentCourseId
        courseEvaluation.termId = this.termId
        courseEvaluation.kpiScoreList = lists
        sendEvaluationData(courseEvaluation).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '评价成功',
              type: 'success'
            })
            this.drawer = false
            location.reload()
          } else {
            this.$message.error('错误')
          }
        })
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        if (response.code === 200) {
          this.list = response.table
        } else {
          this.list = null
        }
        this.listLoading = false
      })
    },
    fetchKpi() {
      // @opened="fetchKpi"
      getKpiList().then(response => {
        this.kpiList = response.table
      })
    }
  }
}
</script>
<style>
.el-drawer.rtl{
  overflow: scroll
}
.nodisplay{
  display: none;
}
</style>
