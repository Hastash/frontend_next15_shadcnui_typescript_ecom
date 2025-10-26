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
import type { Product } from "@/lib/types"


export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  type PaginationMeta = { page: number; pageSize: number; pageCount: number; total: number };
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({ name: "", description: "", barcode: "" });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);

  async function fetchData() {
    await fetch(`/api/products?${buildQuery()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data.map((data: Product) => data));
        setMeta(data.meta?.pagination);
      })
      .catch((error) => {
        console.log("Client: Lỗi lấy sản phẩm:", error);
      })
      .finally(() => setLoading(false));
  };


  const buildQuery = () => {
    const query = new URLSearchParams();
    console.log("query product : ", query.toString());
    query.set("pagination[page]", String(page));
    query.set("pagination[pageSize]", String(pageSize));
    query.set("populate[0]", "category");
    query.set("populate[1]", "image");
    if (filters.name) {
      query.set("filters[name][$contains]", filters.name);
    }
    if (filters.barcode) {
      query.set("filters[barcode][$eqi]", filters.barcode);
    }
    return query.toString();
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  }
  const handleDelete = async (item: Product) => {
    if (!confirm(`Bạn chắc chắn muốn xóa sản phẩm này? ${item.name}`)) return;
    try {
      const response = await fetch(`/api/products/${item.documentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Client: Xóa sản phẩm thất bại");
      }
      toast.success(<span>Đã xoá sản phẩm <b>{item.name}</b> thành công</span>);
      await fetchData();
    } catch (error) {
      console.error("Client: Lỗi xóa sản phẩm:", error);
      toast.error("Xóa sản phẩm thất bại.");
    }
  };
  const columns = getColumns({
    filters,
    handleFilterChange,
    onEdit: (item: Product) => {
      setSelectedItem(item);
      setSheetOpen(true);
    },
    onDelete: (item: Product) => {
      handleDelete(item);
    },
  });


  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?${buildQuery()}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data.data);
        setProducts(data.data);
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
          <CardTitle>Danh mục Sản phẩm</CardTitle>
          <CardDescription>Danh sách các Sản phẩm</CardDescription>

          <CardAction>
            <Button onClick={() => {
              setSelectedItem(null);
              setSheetOpen(true);
            }}>Thêm mới</Button>
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
            <DataTable data={products} columns={columns} />}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center mt-4 text-sm text-muted-foreground">
            {meta && (
              <>
                {products.length === 0
                  ? "Không có dữ liệu"
                  : `Hiện thị ${(meta.page - 1) * meta.pageSize + 1} - ${(meta.page - 1) * meta.pageSize + products.length} trên ${meta.total} bản ghi`}
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
            
            <span className="whitespace-nowrap">
              Trang {meta?.page} / {meta?.pageCount}
            </span>

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