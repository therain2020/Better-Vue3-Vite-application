<script setup>
import { onMounted, ref } from "vue";
import { getAllBookService } from "@/methods/book.js";
import SideView from "@/components/SideView.vue";
import HeaderView from "@/components/HeaderView.vue";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { borrowService } from "@/methods/borrow.js";

const tableData = ref([]);

// 页面加载时获取所有书籍
onMounted(async () => {
  loading.value = true;
  await getAllBooks();
  loading.value = false;
});

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

// 是否显示加载中动画
const loading = ref(false);

// 结果总数
const total = ref(0);

// 分页大小变化
const handleSizeChange = (val) => {
  condition.value.pageSize = val;
  getAllBooks();
};

// 当前页数发生变化
const handleCurrentChange = (val) => {
  condition.value.currentPage = val;
  getAllBooks();
};

let detail = ref(false);

// 显示当前书籍详细信息
const showDetail = (row) => {
  detail.value = true;
  book.value = row;
  console.log("detail:" + detail.value);
  console.log(row);
};

//书籍信息
let book = ref({
  title: null,
  isbn: null,
  cover: null,
  introduction: null,
  number: 0,
  author: null,
});

// 应该归还的日期
const dueDate = ref(new Date());
let showDrawer = ref(false);

//显示抽屉
const showBorrow = (row) => {
  showDrawer.value = true;
  book.value = row;
};

//借阅
const borrow = async () => {
  await borrowService(book.value.isbn, dueDate.value);
  ElMessage.success("借阅成功");
  showDrawer.value = false;
  //刷新表格
  await getAllBooks();
};

// 禁止选择当前日期之前的日期
const disabledDate = (time) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time.getTime() < today.getTime();
};
</script>
<!-- --------------------------------------- 一条朴实的分割线 ----------------------------------------- -->
<template>
    <div class="main-container">
        <el-container>
            <el-aside width="200px" class="aside-container">
                <side-view />
            </el-aside>
            <el-container class="main-content">
                <el-header class="header-container">
                    <header-view />
                </el-header>
                <el-main class="content-wrapper">
                    <el-row :gutter="20" class="search-section">
                        <el-col :span="24">
                            <div class="search-group">
                                <el-tooltip content="刷新数据" placement="top">
                                    <el-button
                                            @click="getAllBooks"
                                            :icon="Search"
                                            size="large"
                                            type="success"
                                            circle
                                            class="refresh-btn"
                                    />
                                </el-tooltip>
                                <el-input
                                        v-model="condition.bookName"
                                        size="large"
                                        placeholder="书名"
                                        clearable
                                        class="search-input"
                                        @input="getAllBooks"
                                />
                                <el-input
                                        v-model="condition.author"
                                        size="large"
                                        placeholder="作者"
                                        clearable
                                        class="search-input"
                                        @input="getAllBooks"
                                />
                                <el-input
                                        v-model="condition.isbn"
                                        size="large"
                                        placeholder="ISBN"
                                        clearable
                                        class="search-input"
                                        @input="getAllBooks"
                                />
                            </div>
                        </el-col>
                    </el-row>

                    <el-table
                            height="calc(100vh - 280px)"
                            :data="tableData"
                            stripe
                            highlight-current-row
                            class="book-table"
                            v-loading="loading"
                            element-loading-background="rgba(255, 255, 255, 0.8)"
                            element-loading-text="正在加载书籍数据..."
                    >
                        <el-table-column
                                prop="title"
                                label="书名"
                                width="200"
                                align="center"
                        />
                        <el-table-column
                                prop="author"
                                label="作者"
                                width="170"
                                align="center"
                        />
                        <el-table-column
                                prop="isbn"
                                label="ISBN"
                                width="220"
                                align="center"
                        />
                        <el-table-column
                                prop="number"
                                label="库存量"
                                width="140"
                                sortable
                                align="center"
                        >
                            <template #default="{row}">
                                <el-tag :type="row.number  > 0 ? 'success' : 'danger'">
                                    {{ row.number  }}
                                </el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" width="220" align="center">
                            <template #default="scope">
                                <el-space :spacer="spacer">
                                    <el-button
                                            type="primary"
                                            link
                                            size="small"
                                            @click="showDetail(scope.row)"
                                            class="action-btn"
                                    >详情</el-button>
                                    <el-button
                                            type="warning"
                                            link
                                            size="small"
                                            @click="showBorrow(scope.row)"
                                            :disabled="scope.row.number  === 0"
                                            class="action-btn"
                                    >借阅</el-button>
                                </el-space>
                            </template>
                        </el-table-column>
                    </el-table>

                    <!-- 分页组件 -->
                    <div class="pagination-container">
                        <el-pagination
                                v-model:current-page="condition.currentPage"
                                v-model:page-size="condition.pageSize"
                                :page-sizes="[5, 8, 10, 15, 30, 50, 100]"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="total"
                                :background="true"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                        />
                    </div>

                    <!-- 借阅抽屉 -->
                    <el-drawer
                            v-model="showDrawer"
                            title="图书借阅"
                            size="30%"
                            class="borrow-drawer"
                    >
                        <div class="drawer-content">
                            <el-image
                                    :src="book.cover"
                                    :preview-src-list="[book.cover]"
                                    class="book-cover"
                                    fit="contain"
                            />
                            <h3 class="book-title">{{ book.title  }}</h3>
                            <div class="date-picker-container">
                                <el-date-picker
                                        v-model="dueDate"
                                        type="date"
                                        placeholder="选择归还日期"
                                        :disabled-date="disabledDate"
                                        format="YYYY/MM/DD"
                                        value-format="YYYY-MM-DD"
                                        class="full-width-datepicker"
                                />
                            </div>
                        </div>
                        <template #footer>
                            <div class="drawer-footer">
                                <el-button @click="showDrawer = false">取消</el-button>
                                <el-button type="primary" @click="borrow">确认借阅</el-button>
                            </div>
                        </template>
                    </el-drawer>

                    <!-- 详情对话框 -->
                    <el-dialog
                            v-model="detail"
                            title="图书详情"
                            width="40%"
                            class="detail-dialog"
                    >
                        <div class="dialog-content">
                            <div class="book-info-header">
                                <el-image
                                        :src="book.cover"
                                        class="detail-cover"
                                        fit="contain"
                                />
                                <div class="title-section">
                                    <h2 class="book-title">{{ book.title  }}</h2>
                                    <div class="meta-info">
                                        <el-tag type="info">{{ book.author  }}</el-tag>
                                        <el-tag>{{ book.isbn  }}</el-tag>
                                        <el-tag :type="book.number  > 0 ? 'success' : 'danger'">
                                            库存: {{ book.number  }}
                                        </el-tag>
                                    </div>
                                </div>
                            </div>
                            <el-divider />
                            <div class="introduction-section">
                                <h3>内容简介</h3>
                                <el-scrollbar height="200px">
                                    <p class="book-intro">{{ book.introduction  }}</p>
                                </el-scrollbar>
                            </div>
                        </div>
                    </el-dialog>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="scss" scoped>
    .main-container {
        width:70vw;
        height: 100vh;
        background: #f5f7fa;
    }

    .aside-container {
        height: 100vh;
        background: #ffffff;
        box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
    }

    .header-container {
        background: #ffffff;
        border-bottom: 1px solid #ebeef5;
        padding: 0 20px;
    }

    .content-wrapper {
        padding: 20px;
        background: #f5f7fa;
    }

    .search-section {
        margin-bottom: 20px;
        .search-group {
            display: flex;
            align-items: center;
            gap: 15px;
            .search-input {
                flex: 1;
                max-width: 300px;
            }
        }
    }

    .book-table {
        width:100vw;
        height: 100vh;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        :deep(.el-table__header) th {
            background: #f8f9fc;
            font-weight: 600;
        }
    }

    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        background: white;
        padding: 15px;
        border-radius: 80px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .borrow-drawer {
        .drawer-content {
            padding: 20px;
            .book-cover {
                width: 200px;
                height: 280px;
                margin: 0 auto;
                display: block;
                border-radius: 6px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .book-title {
                text-align: center;
                margin: 20px 0;
            }
            .date-picker-container {
                margin-top: 30px;
            }
        }
        .drawer-footer {
            padding: 20px;
            text-align: right;
        }
    }

    .detail-dialog {
        .dialog-content {
            .book-info-header {
                display: flex;
                gap: 20px;
                .detail-cover {
                    width: 120px;
                    height: 180px;
                    border-radius: 4px;
                }
                .title-section {
                    flex: 1;
                    .book-title {
                        margin: 0 0 15px 0;
                        color: #303133;
                    }
                    .meta-info {
                        display: flex;
                        gap: 10px;
                        flex-wrap: wrap;
                    }
                }
            }
            .introduction-section {
                margin-top: 20px;
                h3 {
                    color: #606266;
                    margin-bottom: 10px;
                }
                .book-intro {
                    line-height: 1.8;
                    color: #909399;
                    white-space: pre-wrap;
                }
            }
        }
    }

    .full-width-datepicker {
        width: 100%;
    }

    .action-btn {
        transition: all 0.3s;
        &:hover {
            transform: translateY(-2px);
        }
    }
</style>
