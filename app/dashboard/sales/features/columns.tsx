"use client"

import ColumnFilter from "@/components/column-filter"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";
import Link from "next/link";
import type { Sale } from "@/lib/types"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ColumnsProps = {
  filters: Record<string, string>
  handleFilterChange: (key: string, value: string) => void
  onEdit: (item: Sale) => void
  onDelete: (item: Sale) => void
}
export const getColumns = ({ filters, handleFilterChange, onEdit, onDelete }: ColumnsProps): ColumnDef<Sale>[] => [
  {
    accessorKey: "invoice_number",
    header: () => <ColumnFilter
      label="Invoice Number"
      placeholder="Lọc theo số hóa đơn"
      value={filters.invoice_number || ""}
      onChange={(value) => handleFilterChange("invoice_number", value)}
      type={"text"} />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "customer_name",
    header: () => <ColumnFilter
      label="Customer Name"
      placeholder="Lọc theo tên khách hàng"
      value={filters.customer_name || ""}
      onChange={(value) => handleFilterChange("customer_name", value)}
      type={"text"} />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "date",
    header: () => (
      <ColumnFilter
        label="Date"
        placeholder="Filter date..."
        value={filters.date || ""}
        onChange={(val) => handleFilterChange("date", val)}
        type="date"
      />
    ),
    cell: (info) => {
      const date = info.getValue();

      return date ? format(new Date(date as string), "yyyy-MM-dd hh:mm a") : "N/A";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => {
              onEdit(row.original);
            }}
          >Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive"
            onClick={() => {
              onDelete(row.original);
            }}
          >Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu >
    ),
  },
]