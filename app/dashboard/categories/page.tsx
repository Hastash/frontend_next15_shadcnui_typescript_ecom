"use client"
import { DataTable } from "./features/data-table"
import { getColumns } from "./features/columns"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Sheet } from "@/components/ui/sheet"
import { New } from "./features/new"
import type { Category } from "@/lib/types"


export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  type PaginationMeta = { page: number; pageSize: number; pageCount: number; total: number };
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({ name: "", description: "" });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Category | null>(null);

  async function fetchData() {
    const url = `/api/categories?${buildQuery()}`;
  console.log("🔍 Fetching from URL:", url); // <-- in ra URL
    await fetch(`/api/categories?${buildQuery()}`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data.map(({
          id, name, description, documentId }: Category) => ({ id, name, description, documentId })));
        setMeta(data.meta?.pagination);
      })
      .catch((error) => {
        console.log("Client: Lỗi lấy danh mục:", error);
      })
      .finally(() => setLoading(false));
  };

  
  const buildQuery = () => {
    const query = new URLSearchParams();
    query.set("pagination[page]", String(page));
    query.set("pagination[pageSize]", String(pageSize));
    if (filters.name) {
      query.set("filters[name][$contains]", filters.name);
    }
    if (filters.description) {
      query.set("filters[description][$contains]", filters.description);
    }
    return query.toString();
  }
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  }
  const handleDelete = async (item: Category) => {
    if (!confirm(`Bạn chắc chắn muốn xóa danh mục này? ${item.name}`)) return;
    try {
      const response = await fetch(`/api/categories/${item.documentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Client: Xóa danh mục thất bại");
      }
      toast.success(<span>Đã xoá danh mục <b>{item.name}</b> thành công</span>);
      await fetchData();
    } catch (error) {
      console.error("Client: Lỗi xóa danh mục:", error);
      toast.error("Xóa danh mục thất bại.");
    }
  };
  const columns = getColumns({
    filters,
    handleFilterChange,
    onEdit: (item: Category) => {
      setSelectedItem(item);
      setSheetOpen(true);
    },
    onDelete: (item: Category) => {
      handleDelete(item);
    },
  });


  useEffect(() => {
    setLoading(true);
    fetch(`/api/categories?${buildQuery()}`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
        setMeta(data.meta?.pagination);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [page, pageSize, filters]);

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    setPage(1); // Reset về trang 1 khi thay đổi kích thước trang
  }

  return (
    <div className="py-4 md:py-6 px-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Danh mục Phân loại</CardTitle>
          <CardDescription>Danh sách các Phân loại</CardDescription>

          <CardAction>
            <Button onClick={() => setSheetOpen(true)}>Thêm mới</Button>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <New
                item={selectedItem}
                isOpen={sheetOpen}
                onSuccess={() => {
                  setSheetOpen(false);
                  fetchData();
                }} />
            </Sheet>
          </CardAction>
        </CardHeader>
        <CardContent>
          {loading ? <div className="text-muted-foreground">Đang tải nội dung...</div> :
            <DataTable data={categories} columns={columns} />}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center mt-4 text-sm text-muted-foreground">
            {meta && (
              <>
                {categories.length === 0
                  ? "Không có dữ liệu"
                  : `Hiện thị ${(meta.page - 1) * meta.pageSize + 1} - ${(meta.page - 1) * meta.pageSize + categories.length} trên ${meta.total} bản ghi`}
              </>
            )}
            <div className="flex items-center gap-2">
              <span>Tối đa</span>
              <Select
                value={String(pageSize)}
                onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>Bản ghi</span>
            </div>
            <span className="whitespace-nowrap">Trang {meta?.page} / {meta?.pageCount}</span>
            {/* Pagination button */}
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                «
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, meta?.pageCount || 1))
                }
                disabled={page === meta?.pageCount}
              >
                ›
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(Number(meta?.pageCount))}
                disabled={page === meta?.pageCount}
              >
                »
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}