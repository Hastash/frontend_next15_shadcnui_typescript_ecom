"use client"

import ColumnFilter from "@/components/column-filter"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import type { Product } from "@/lib/types"
import Image from "next/image"
import { ImageOff } from "lucide-react"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type ColumnsProps = {
  filters: Record<string, string>
  handleFilterChange: (key: string, value: string) => void
  onEdit: (item: Product) => void
  onDelete: (item: Product) => void
}
export const getColumns = ({ filters, handleFilterChange, onEdit, onDelete }: ColumnsProps): ColumnDef<Product>[] => [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const img = row.original.image as any | undefined
      const rawUrl = img?.formats?.thumbnail?.url ?? img?.url ?? null
      return (
        <div className="flex item-center justify-center">
          <div className="h-12 w-12 rounded overflow-hidden ">
            {rawUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${rawUrl}`}
              alt={row.original.name ?? "Không có hình ảnh"}
              width={50}
              height={50}
              className="object-cover"
            />
            ) : (
            <div className="flex h-12 w-12 items-center justify-center bg-gray-100 rounded">
              <ImageOff className="h-6 w-6 text-gray-400" />
            </div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "barcode",
    header: () => <ColumnFilter
      label="Barcode"
      placeholder="Lọc theo mã vạch"
      value={filters.barcode || ""}
      onChange={(value) => handleFilterChange("barcode", value)}
      type={"text"} />,
    cell: (info) => info.getValue(),
  },
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
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },

  // {
  //   accessorKey: "description",
  //   header: () => <ColumnFilter
  //     label="Description"
  //     placeholder="Lọc theo mô tả"
  //     value={filters.description || ""}
  //     onChange={(value) => handleFilterChange("description", value)}
  //     type={"text"} />,
  //   cell: (info) => (
  //     <div className="whitespace-normal break-words">
  //       {String(info.getValue())}
  //     </div>
  //   ),
  // },
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