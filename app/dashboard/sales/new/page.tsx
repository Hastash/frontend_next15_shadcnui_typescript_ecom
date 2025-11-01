"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Product, ProductInSale, Sale } from "@/lib/types";
import { saleSchema } from "@/lib/schemas";
import { handleApiError } from "@/lib/utils";


const DISCOUNT_RATE = 0.1; // 10% discount
const TAX_RATE = 0.08; // 8% tax

export default function NewInvoicePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeout = useRef<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      invoice_number: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      products: [],
      date: new Date(),
      notes: "",
    },
  });

  const watchedProducts = useWatch({
    control: form.control,
    name: "products",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  function formatDateTimeLocal(date: Date) {
    const pad = (n: number | string) => String(n).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = window.setTimeout(async () => {
      try {
        setLoading(true);
        const url = `/api/products?filters[name][$contains]=${searchTerm}&pagination[pageSize]=25`;
        const res = await fetch(url);
        const formattedProducts = await res.json();
        const products = formattedProducts.data.map((item: Product) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name,
          price: item.price,
          stock: item.stock,
        }));
        setSearchResults(products);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [searchTerm]);

  const handleSelectProduct = (product: Product) => {
    const productExists = form
      .getValues("products")
      .find((p) => p.productId === product.documentId);

    if (productExists) {
      toast.error("Product already added");
    } else {
      append({
        productId: product.documentId,
        name: product.name,
        quantity: 1,
        price: Number(product.price),
        stock: product.stock,
      });
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  const calculateAmount = (quantity: number, price: number) => {
    return quantity * price;
  };

  useEffect(() => {
    let newSubtotal = 0;
    fields.forEach((item) => {
      newSubtotal += calculateAmount(
        form.getValues(`products.${fields.indexOf(item)}.quantity`) as number,
        form.getValues(`products.${fields.indexOf(item)}.price`) as number
      );
    });

    setSubtotal(newSubtotal | 0);
    setDiscountAmount((newSubtotal * DISCOUNT_RATE) | 0);
    setTaxAmount(((newSubtotal - newSubtotal * DISCOUNT_RATE) * TAX_RATE) | 0);
    setTotal(
      (newSubtotal -
        newSubtotal * DISCOUNT_RATE +
        (newSubtotal - newSubtotal * DISCOUNT_RATE) * TAX_RATE) |
        0
    );
  }, [fields, watchedProducts]);

  async function onSubmit(data: Sale) {
    if (data.products.length === 0) {
      toast.error("At least one product is required.");
      return;
    }

    try {
      const salePayload = {
        customer_name: data.customer_name,
        invoice_number: data.invoice_number,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        date: data.date,
        notes: data.notes,
        products: data.products.map((item: ProductInSale) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        total,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sale-transactions`,
        {          
          method: "POST",
          body: JSON.stringify(salePayload),
        }
      );
      const saleResponse = await res.json();
      console.log("Sale created:", saleResponse);
      if (!saleResponse.data.id) {
        throw new Error("Failed to create sale.");
      }

      toast.success("Invoice and stock updated successfully!");
      router.push("/dashboard/sales");
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Transaction failed:", error);
      toast.error(
        `Transaction failed: ${errorMessage || "An error occurred."}`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full p-4 space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link href="/dashboard/sales">
                <ArrowLeftIcon className="mr-2" />
              </Link>
              Tạo hoá đơn mới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label className="mb-4 text-lg text-primary">Invoice details</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="invoice_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice number</FormLabel>
                    <FormControl>
                      <Input placeholder="Invoice number" type="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Date & time"
                        type="datetime-local"
                        {...field}
                        className="w-fit"
                        value={
                          field.value instanceof Date
                            ? formatDateTimeLocal(new Date(field.value))
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer name</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer name" type="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer email</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer email" type="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer phone" type="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <Label className="mb-4 text-lg text-primary">Product details</Label>
            <div>
              <Label className="mb-2">Search Products</Label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name..."
              />

              {loading && <p className="text-sm my-2">Searching...</p>}

              {searchResults.length > 0 && (
                <ScrollArea className="border rounded p-2 max-h-60 mt-2">
                  {searchResults.map((product: Product) => (
                    <div
                      key={product.documentId}
                      className="cursor-pointer p-2 hover:bg-muted rounded"
                      onClick={() => handleSelectProduct(product)}
                    >
                      {product.name} - ${product.price} - {product.stock} in
                      stock
                    </div>
                  ))}
                </ScrollArea>
              )}
            </div>

            {fields?.map((item, index) => (
              <div
                key={index}
                className="border p-3 rounded mb-2 grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
              >
                <div>
                  <Label className="mb-2">Product</Label>
                  <Input value={item.name} readOnly />
                </div>

                <div>
                  <Label className="mb-2">Quantity</Label>
                  <Input
                    type="number"
                    {...form.register(`products.${index}.quantity`, {
                      valueAsNumber: true,
                      min: 1,
                    })}
                    defaultValue={item.quantity as number || 0}
                  />
                </div>

                <div>
                  <Label className="mb-2">Price</Label>
                  <Input
                    type="number"
                    {...form.register(`products.${index}.price`, {
                      valueAsNumber: true,
                      min: 0,
                    })}
                    defaultValue={item.price as number || 0}
                  />
                </div>

                <div>
                  <Label className="mb-2">Amount</Label>
                  <Input
                    className="text-primary"
                    value={calculateAmount(
                      form.getValues(`products.${index}.quantity`) as number || 0,
                      form.getValues(`products.${index}.price`) as number || 0
                    )}
                    readOnly
                  />
                </div>

                <div className="pt-6">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Separator />

            <Label className="mb-4 text-lg text-primary">Invoice summary</Label>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl className="h-36">
                        <Textarea
                          placeholder="Additional notes"
                          {...field}
                          rows={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2 flex flex-col justify-end space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount ({DISCOUNT_RATE * 100}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({TAX_RATE * 100}%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 w-full items-center">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Submit Invoice"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/sales")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}