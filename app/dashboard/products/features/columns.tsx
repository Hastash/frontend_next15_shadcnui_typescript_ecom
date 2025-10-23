"use client"

import ColumnFilter from "@/components/column-filter"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import type { Product } from "@/lib/types"
import Image from "next/image"
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
        <div className="flex item-center justify-center">
          <div className="h-12 w-12 rounded overflow-hidden ">
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL} + ${row.original.image.formats.thumbnail.url}`}
              alt={row.original.name}
              width={50}
              height={50}
              className="object-cover"
            />
          </div>
        </div>
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