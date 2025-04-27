<script setup>
import {onMounted, ref} from "vue";
import {addBookService, deleteBookService, getAllBookService, updateBookService} from "@/methods/book.js";
import SideView from "@/components/SideView.vue";
import HeaderView from "@/components/HeaderView.vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

const tableData = ref([]);

// 页面加载时获取所有书籍
onMounted(async () => {
  await getAllBooks();
})

// 获取所有书籍
const getAllBooks = async function () {
  loading.value = true;
  const result = await getAllBookService(condition.value);
  tableData.value = result.data;
  total.value = result.total;
  loading.value = false;
};

// 搜索条件
const condition = ref({
  bookName: null,
  author: null,
  isbn: null,
  number: 0,
  currentPage: 1,
  pageSize: 15,
});

// 是否加载中
const loading = ref(false);

// 结果总数
const total = ref(0)

// 分页大小变化
const handleSizeChange = (val) => {
  loading.value = true;
  condition.value.pageSize = val;
  getAllBooks();
  loading.value = false;
};

// 当前页数发生变化
const handleCurrentChange = (val) => {
  loading.value = true;
  condition.value.currentPage = val;
  getAllBooks();
  loading.value = false;
};

let detail = ref(false);

// 显示当前书籍详细信息
const showDetail = (row) => {
  detail.value = true;
  book.value = row;
}

// 关闭详细信息对话框
const closeDialog = async () => {
  detail.value = false;
  await getAllBooks();
}

//书籍信息
let book = ref({
  title: null,
  isbn: null,
  cover: null,
  introduction: null,
  number: 0,
  author: null
});


// 添加书籍的信息
let showAdd = ref(false);

const addBook = ref({
  title: null,
  isbn: null,
  cover: null,
  introduction: null,
  number: null,
  author: null
})

// 添加书籍
const addBookFunc = async () => {
  // console.log(addBook.value);

  await addBookService(addBook.value);
  ElMessage.success("添加成功!");
  showAdd.value = false;
  condition.value.bookName = addBook.value.title;
  await getAllBooks();
}

// 添加表单校验规则
const rules = {
  title: [
    {max: 30, message: '最多30个字符', trigger: ['blur', 'change']}
  ],
  isbn: [  // 新增校验规则 
    { required: true, message: 'ISBN不能为空', trigger: ['blur', 'change'] },
    { 
      pattern: /^(?:\d{13}|\d{10})$/,
      message: 'ISBN必须是10或13位数字',
      trigger: ['blur', 'change']
    }
  ],
  cover: [
    {max: 200, message: '最多200个字符', trigger: ['blur', 'change']}
  ],
  introduction: [
    {max: 400, message: '最多400个字符', trigger: ['blur', 'change']}
  ],
  number: [
    {type: 'number', min: 0, message: '必须是大于等于0的数字', trigger: ['blur', 'change']}
  ],
  author: [
    {max: 20, message: '最多20个字符', trigger: ['blur', 'change']}
  ]
};

// 删除书籍信息
const deleteBook = async (isbn) => {
  await deleteBookService(isbn);
  ElMessage.success('删除成功!');
  await getAllBooks();
}

// 修改书籍信息
const updateBook = async () => {
  console.log(book.value);
  await updateBookService(book.value);
  detail.value = false;
  ElMessage.success("已保存!");
}

</script>
<!-- --------------------------------------- 一条朴实的分割线 ----------------------------------------- -->
<template>
  <div>
    <el-container>
      <!--侧栏-->
      <el-aside width="200px">
        <side-view/>
      </el-aside>
      <el-container>
        <el-header>
          <header-view/>
        </el-header>
        <el-main>
          <el-row>
            <el-col :span="24">
              <!--搜索条件框-->
              <el-row>
                <!--添加书籍按钮-->
                <el-button @click="showAdd = true" :icon="Plus" size="large" type="success" circle :span="2"/>
                <el-col :span="1"/>
                <el-col :span="6">
                  <el-input @input="getAllBooks" v-model="condition.bookName" size="large" placeholder="书名"
                            clearable/>
                </el-col>
                <el-col :span="1"/>
                <el-col :span="6">
                  <el-input @input="getAllBooks" v-model="condition.author" size="large" placeholder="作者" clearable/>
                </el-col>
                <el-col :span="1"/>
                <el-col :span="6">
                  <el-input @input="getAllBooks" v-model="condition.isbn" size="large" placeholder="ISBN" clearable/>
                </el-col>
              </el-row>
              <br>

              <!--书籍表格-->
              <el-table style="width: 100%"
                        :data="tableData" v-loading="loading">
                <el-table-column prop="title" label="书名" width="200" align="center"/>
                <el-table-column prop="author" label="作者" width="160" align="center"/>
                <el-table-column prop="isbn" label="ISBN" width="220" align="center"/>
                <el-table-column sortable prop="number" label="库存量" width="140" align="center"/>

                <el-table-column label="操作" width="220">
                  <template #default="scope">
                    <el-button link type="primary" size="small"
                               @click="showDetail(scope.row)">修改详细信息
                    </el-button>
                    <el-popconfirm
                        confirm-button-text="Yes"
                        cancel-button-text="我再想想"
                        confirm-button-type="danger"
                        @confirm="deleteBook(scope.row.isbn)"
                        title="真的要删除这本书吗?">
                      <template #reference>
                        <el-button link type="danger" size="small">删除
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
              <br>
              <!--分页组件-->
              <div>
                <el-pagination
                    v-model:current-page="condition.currentPage"
                    v-model:page-size="condition.pageSize"
                    :page-sizes="[5,8,10,15,30,50,100]"
                    :background="true"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"/>
              </div>

              <!--详细信息表单,可以修改-->
              <el-dialog title="图书详细信息" width="40%" center align-center
                         v-model="detail" :before-close="closeDialog">
                <el-form :inline="true" :rules="rules" :model="book">
                  <el-form-item style="display: flex;" prop="cover">
                    <el-image style="width: 100px; height: 150px"
                              :preview-src-list="[book.cover]"
                              :src="book.cover" :fit="'fill'"/>
                  </el-form-item>

                  <el-form-item label="书名" prop="title" required>
                    <el-input v-model="book.title"/>
                  </el-form-item>

                  <el-form-item label="库存" prop="number" required>
                    <el-input v-model.number="book.number"/>
                  </el-form-item>

                  <el-form-item label="作者" prop="author">
                      <el-input v-model="book.author"
                                class="full-width-input"/>
                  </el-form-item>

                  <el-form-item label="ISBN" prop="isbn" required>
                    <el-input v-model="book.isbn"  :disabled="!book.isbn"  />
                  </el-form-item>
                  <el-form-item label="简介" prop="introduction">
                    <el-input v-model="book.introduction"
                              :autosize="{ minRows: 2, maxRows: 6 }"
                              type="textarea"/>
                  </el-form-item>
                </el-form>
                <!--保存-->
                <el-form>
                  <template #default>
                    <el-form-item>
                      <el-button type="primary" @click="updateBook">保存</el-button>
                      <el-button type="danger" @click="closeDialog">取消</el-button>
                    </el-form-item>
                  </template>
                </el-form>
              </el-dialog>

              <!--添加书籍表单-->
              <el-dialog v-model="showAdd" title="添加图书" width="30%" center align-center>
                <el-form :inline="true" :model="addBook" :rules="rules">
                  <el-form-item prop="title" required>
                    <el-input v-model="addBook.title" placeholder="书名"/>
                  </el-form-item>
                  <el-form-item prop="isbn" required>
                    <el-input v-model="addBook.isbn" placeholder="ISBN"/>
                  </el-form-item>
                  <el-form-item prop="number" required>
                    <el-input v-model.number="addBook.number" placeholder="库存"/>
                  </el-form-item>
                  <el-form-item prop="cover">
                    <el-input v-model="addBook.cover" placeholder="封面"/>
                  </el-form-item>
                  <el-form-item prop="author">
                    <el-input v-model="addBook.author" placeholder="作者"/>
                  </el-form-item>
                  <el-form-item prop="introduction">
                    <el-input placeholder="简介" type="textarea" v-model="addBook.introduction" clearable/>
                  </el-form-item>
                </el-form>

                <el-form>
                  <el-button type="primary" @click="addBookFunc">添加</el-button>
                  <el-button type="danger">取消</el-button>
                </el-form>

              </el-dialog>

            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<style scoped lang="scss">
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
 
$--primary-color: #409EFF;
$--success-color: #67C23A;
$--danger-color: #F56C6C;
$--background-color: #f5f7fa;
 
.el-container {
  width:70vw;
  min-height: 100vh;
  background: $--background-color;
  
  .el-aside {
    height: 100vh;
    background: #fff;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
  }
 
  .el-header {
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    z-index: 1;
  }
 
  .el-main {
    padding: 24px;
    background: transparent;
    
    .el-row {
      gap: 12px;
      margin-bottom: 20px;
      
      .el-col {
        .el-button {
          transition: all 0.3s ease;
          
          &--success {
            background: $--success-color;
            border-color: darken($--success-color, 5%);
            
            &:hover {
              transform: scale(1.05);
            }
          }
        }
        
        .el-input {
          .el-input__wrapper {
            border-radius: 8px;
            transition: box-shadow 0.3s ease;
            
            &:hover {
              box-shadow: 0 2px 8px rgba($--primary-color, 0.1);
            }
          }
        }
      }
    }
  }
}
 
.el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  &::before {
    display: none;
  }
  
  :deep(.el-table__header) {
    th {
      background: lighten($--primary-color, 40%);
      color: darken($--primary-color, 10%);
      font-weight: 600;
    }
  }
  
  &__row {
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .el-button {
      &--danger {
        color: $--danger-color;
        
        &:hover {
          color: darken($--danger-color, 10%);
        }
      }
    }
  }
}
 
.el-pagination {
  margin-top: 24px;
  justify-content: flex-end;
  
  :deep(.btn-prev),
  :deep(.btn-next),
  :deep(.number) {
    border-radius: 6px;
    transition: all 0.3s ease;
  }
  
  :deep(.is-active) {
    background: $--primary-color;
    color: #fff;
  }
}
 
.el-dialog {
  border-radius: 12px;
  
  &__header {
    border-bottom: 1px solid #eee;
    padding-bottom: 16px;
    margin-bottom: 24px;
    
    span {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .el-form {
    .el-form-item {
      margin-bottom: 20px;
      
      &__label {
        width: 80px;
        color: #666;
        font-weight: 500;
      }
      
      .el-input,
      .el-textarea {
        width: 280px;
        
        :deep(.el-input__inner),
        :deep(.el-textarea__inner) {
          border-radius: 6px;
          transition: border-color 0.3s ease;
        }
      }
      
      .el-image {
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
    }
  }
  
  .el-button {
    min-width: 100px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &--primary {
      background: $--primary-color;
      border-color: darken($--primary-color, 5%);
      
      &:hover {
        background: darken($--primary-color, 5%);
      }
    }
    
    &--danger {
      background: $--danger-color;
      border-color: darken($--danger-color, 5%);
      
      &:hover {
        background: darken($--danger-color, 5%);
      }
    }
  }
}
</style>