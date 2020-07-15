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
                    <el-button type="text" @click="openVideo(chapter.id)">添加小节</el-button>
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
                            <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                            <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
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
    
    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="0">免费</el-radio>
            <el-radio :label="1">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import chapter from '@/api/chapter'
import video from '@/api/video'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterVideoList: [],
      courseId: '',
      chapterInfo: {},
      video: {},
      dialogChapterFormVisible: false, // 章节弹框
      dialogVideoFormVisible: false, // 小节弹框
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
//===========================================小节操作========================================
    // 添加小节弹框
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true
      this.video = {}
      // 设置章节 id
      this.video.chapterId = chapterId
      // 设置小节 id
      this.video.courseId = this.courseId
    },

    // 添加/更新小节
    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.addVideo()
      } else {
        this.updateVideo()
      }
    },

    // 更新小节信息
    updateVideo() {
      video.updateVideo(this.video)
      .then(response => {
        // 更新完之后 --> 1.关闭弹窗, 2.添加提示信息, 3.刷新页面
        this.dialogVideoFormVisible = false
        this.$message({
          type: 'success',
          message: '课时信息已更新'
        })
        this.getChapterVideo()
      })
    },

    // 添加小节
    addVideo() {
      video.addVideo(this.video)
      .then(response => {
        // 添加完之后 --> 1.关闭弹窗, 2.添加提示信息, 3.刷新页面
        this.dialogVideoFormVisible = false
        this.$message({
          type: 'success',
          message: '添加课时成功'
        })
        this.getChapterVideo()
      })
    },

    // 删除小节
    removeVideo(id) {
      this.$confirm('此操作将永久删除课时记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // 消息类型，用于显示图标
        type: 'warning',
        // 是否使用圆角按钮
        roundButton: false
      }).then(() => {
        // 调用删除方法
        video.deleteVideo(id)
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

    // 打开小节弹窗, 数据回显
    openEditVideo(id) {
      this.dialogVideoFormVisible = true
      video.getVideoInfo(id)
      .then(response => {
        this.video = response.data.video
      })
    },


//===========================================章节操作========================================
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