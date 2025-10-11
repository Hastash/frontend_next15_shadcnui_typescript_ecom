"use client"

import ColumnFilter from "@/components/column-filter"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import type { Category } from "@/lib/types"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ColumnsProps = {
  filters: Record<string, string>
  handleFilterChange: (key: string, value: string) => void
  onEdit: (item: Category) => void
}
export const getColumns = ({ filters, handleFilterChange, onEdit }: ColumnsProps): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: () => <ColumnFilter
      label="Name"
      placeholder="Lọc theo tên"
      value={filters.name || ""}
      onChange={(value) => handleFilterChange("name", value)}
      type={"text"} />,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "description",
    header: () => <ColumnFilter
      label="Description"
      placeholder="Lọc theo mô tả"
      value={filters.description || ""}
      onChange={(value) => handleFilterChange("description", value)}
      type={"text"} />,
    cell: (info) => info.getValue(),
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
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]