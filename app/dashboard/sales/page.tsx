"use client"
import { DataTable } from "./features/data-table"
import { getColumns } from "./features/columns"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Sale } from "@/lib/types"


export default function Page() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  type PaginationMeta = { page: number; pageSize: number; pageCount: number; total: number };
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Sale>({ invoice_number: "", customer_name: "", customer_email: "", customer_phone: "", date: "" } as Sale);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Sale | null>(null);

  async function fetchData() {
    await fetch(`/api/sales?${buildQuery()}`)
      .then((res) => res.json())
      .then((data) => {
        setSales(data.data.map((data: Sale) => data));
        setMeta(data.meta?.pagination);
      })
      .catch((error) => {
        console.log("Client: Lỗi lấy đơn hàng:", error);
      })
      .finally(() => setLoading(false));
  };


  const buildQuery = () => {
    const query = new URLSearchParams();
    query.set("pagination[page]", String(page));
    query.set("pagination[pageSize]", String(pageSize));
    if (filters.invoice_number) {
      query.set("filters[invoice_number][$eqi]", filters.invoice_number);
    }
    if (filters.customer_name) {
      query.set("filters[customer_name][$contains]", filters.customer_name);
    }
        if (filters.customer_email) {
      query.set("filters[customer_email][$contains]", filters.customer_email);
    }
    if (filters.customer_phone) {
      query.set("filters[customer_phone][$contains]", filters.customer_phone);
    }
    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setUTCHours(24, 0, 0, 0);

      query.set("filters[date][$gte]", startOfDay.toISOString());
      query.set("filters[date][$lt]", endOfDay.toISOString());
    }

    return query.toString();
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  }
  const handleDelete = async (item: Sale) => {
    if (!confirm(`Bạn chắc chắn muốn xóa Đơn hàng này? ${item.invoice_number}`)) return;
    try {
      const response = await fetch(`/api/sales/${item.documentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Client: Xóa Đơn hàng thất bại");
      }
      toast.success(<span>Đã xoá Đơn hàng <b>{item.invoice_number}</b> thành công</span>);
      await fetchData();
    } catch (error) {
      console.error("Client: Lỗi xóa Đơn hàng:", error);
      toast.error("Xóa Đơn hàng thất bại.");
    }
  };
  const columns = getColumns({
    filters,
    handleFilterChange,
    onEdit: (item: Sale) => {
      setSelectedItem(item);
      setSheetOpen(true);
    },
    onDelete: (item: Sale) => {
      handleDelete(item);
    },
  });


  useEffect(() => {
    setLoading(true);
    fetch(`/api/sales?${buildQuery()}`)
      .then((res) => res.json())
      .then((data) => {
        setSales(data.data);
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
          <CardTitle>Danh mục Đơn hàng</CardTitle>
          <CardDescription>Danh sách các Đơn hàng</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <div className="text-muted-foreground">Đang tải nội dung...</div> :
            <DataTable data={sales} columns={columns} />}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center mt-4 text-sm text-muted-foreground">
            {meta && (
              <>
                {sales.length === 0
                  ? "Không có dữ liệu"
                  : `Hiện thị ${(meta.page - 1) * meta.pageSize + 1} - ${(meta.page - 1) * meta.pageSize + sales.length} trên ${meta.total} bản ghi`}
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