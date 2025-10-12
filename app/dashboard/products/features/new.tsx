import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
    useEffect,
    useState,
    useTransition
} from "react"
import {
    toast
} from "sonner"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import {
    set,
    z
} from "zod"
import {
    cn
} from "@/lib/utils"
import {
    Button
} from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Product } from "@/lib/types";

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

type NewCategoryProps = {
    item?: Product | null;
    onSuccess?: () => void;
    isOpen?: boolean;
};

export const New = ({ item = null, onSuccess, isOpen }: NewCategoryProps) => {
    const [isPending, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: item?.name || "",
            description: item?.description || "",
        }
    });

    useEffect(() => {
        if (!isOpen) return;
        if (item) {
            form.reset({
                name: item.name || "",
                description: item.description || "",
            });
        } else {
            form.reset({
                name: "",
                description: "",
            });
        }
    }, [item, isOpen]);

    async function onSubmit(value: z.infer<typeof formSchema>) {
        // console.log("Submitting data: ", value);
        startTransition(async () => {
            if (item?.documentId) {
                await fetch(`/api/categories/${item.documentId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(value),
                });
                toast.success("Cập nhật danh mục thành công");
                (onSuccess)?.();
            } else {
                await fetch("/api/categories", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(value),
                });
                toast.success("Tạo mới danh mục thành công");
                (onSuccess)?.();
            }
        })
    };


    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>{item?.id ? "Chỉnh sửa danh mục" : "Tạo mới danh mục"}</SheetTitle>
            <SheetDescription>
                Nhập thông tin chi tiết cho danh mục vào bên dưới.
            </SheetDescription>
            </SheetHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Category name"

                                        type=""
                                        {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Category Description"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Đang lưu..." : "Xác nhận"}
                    </Button>
                </form>
            </Form>
        </SheetContent>
    )
};