<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-button type="primary" @click="openChapterDialog()">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterVideoList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}
                <span class="acts">
                    <el-button type="text">添加课时</el-button>
                    <el-button type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                </span>
            </p>
            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text" >编辑</el-button>
                            <el-button type="text" >删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>
    <div>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapterInfo" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapterInfo.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapterInfo.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from '@/api/chapter'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterVideoList: [],
      courseId: '',
      chapterInfo: {},
      dialogChapterFormVisible: false, // 章节弹框
    }
  },
  created() {
    // 获取路由中的参数值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 调用函数
      this.getChapterVideo()
    }

  },
  methods: {
    // 添加/更新
    saveOrUpdate() {
      if (!this.chapterInfo.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
      
    },

    // 添加章节
    addChapter(chapterInfo) {
      // 设置课程 id 到 chapterInfo 对象中
      this.chapterInfo.courseId = this.courseId
      chapter.addChapter(this.chapterInfo)
      .then(response => {
        // 添加完之后 --> 1.关闭弹窗, 2.添加提示信息, 3.刷新页面
        this.dialogChapterFormVisible = false
        this.$message({
          type: 'success',
          message: '添加章节成功'
        })
        this.getChapterVideo()
      })
    },

    // 修改章节信息
    updateChapter() {
      chapter.updateChapter(this.chapterInfo)
      .then(response => {
        // 修改完之后 --> 1.关闭弹窗, 2.添加提示信息, 3.刷新页面
        this.dialogChapterFormVisible = false
        this.$message({
          type: 'success',
          message: '章节信息已修改'
        })
        this.getChapterVideo()
      })
    },

    // 删除章节
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除章节记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // 消息类型，用于显示图标
        type: 'warning',
        // 是否使用圆角按钮
        roundButton: false
      }).then(() => {
        // 调用删除方法
        chapter.deleteChapter(chapterId)
        .then(response => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '删除成功!'
            });
          // 刷新页面
          this.getChapterVideo()
        })
        .catch(error => {
          console.log(error)
        })
      })
    },

    // 修改章节弹框数据回显
    openEditChapter(chapterId) {
      this.dialogChapterFormVisible = true
      chapter.getChapter(chapterId)
      .then(response => {
        this.chapterInfo = response.data.chapter
      })
    },

    // 根据课程 id 获取章节和小节数据列表
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId)
      .then(response => {
        this.chapterVideoList = response.data.allChapterVideo
      })
    },

    // 弹出添加章节页面
    openChapterDialog() {
      this.dialogChapterFormVisible = true
      this.chapterInfo = {}
    },

    // 上一步
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` })
    },
    // 下一步
    next() {
      console.log('next')
      this.$router.push({ path: `/course/publish/${this.courseId}` })
    }
  }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}
.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>