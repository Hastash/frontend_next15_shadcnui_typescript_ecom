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
import { Category, Product } from "@/lib/types";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().gt(0, "Price is required"),
    stock: z.coerce.number().gt(0, "Stock is required"),
    barcode: z.string().min(1, "Barcode is required"),
    category: z.string().min(1, "Category is required"),
});
type NewCategoryProps = {
    item?: Product | null;
    onSuccess?: () => void;
    isOpen?: boolean;
};

export const New = ({ item = null, onSuccess, isOpen }: NewCategoryProps) => {
    const [isPending, startTransition] = useTransition();
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageId, setImageId] = useState<number | string | null>(null);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            barcode: "",
            category: "",
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            await fetch("/api/categories")
                .then((res) => res.json())
                .then((data) => setCategories(data.data))
                .catch((error) => {
                    toast.error("Danh sách Danh mục trống");
                })
                .finally(() => {
                    setCategoriesLoading(false);
                });
        };
        if (isOpen) fetchCategories();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        if (item) {
            form.reset({
                name: item.name || "",
                description: item.description || "",
                price: item.price || 0,
                stock: item.stock || 0,
                barcode: item.barcode || "",
                category: item.category?.documentId || "",
            });

            if (item.image) {
                setImagePreview(item.image.url);
                setImageId(item.image.id);
            } else {
                setImagePreview(null);
                setImageId(null);
            }
        } else {
            form.reset({
                name: "",
                description: "",
                price: 0,
                stock: 0,
                barcode: "",
                category: "",
            });
            setImagePreview(null);
            setImageId(null);
        }
    }, [item, isOpen]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("files", file);

        setUploading(true);
        setUploadProgress(0);

        try {
            const res = await fetch(`/api/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();

            const uploadedImage = data[0];
            setImagePreview(uploadedImage.url);
            setImageId(uploadedImage.id);
            toast.success("Tải ảnh lên thành công");
        } catch (error) {
            toast.error("Tải ảnh lên thất bại");
            console.log(error);
        } finally {
            setUploading(false);
        }
    };
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log("Submitting data: ", value);
        startTransition(async () => {
            if (item?.documentId) {
                await fetch(`/api/products/${item.documentId}`, {
                    method: "PUT",
                    body: JSON.stringify({
                            ...values,
                            category: values.category,
                            image: imageId ? imageId : null,
                    }),
                });
                toast.success("Cập nhật Sản phẩm thành công");
                (onSuccess)?.();
            } else {
                await fetch("/api/products", {
                    method: "POST",
                    body: JSON.stringify({
                            ...values,
                            category: values.category,
                            image: imageId ? imageId : null,
                    }),
                });
                toast.success("Tạo mới Sản phẩm thành công");
                (onSuccess)?.();
            }
        })
    };


    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>{item?.id ? "Chỉnh sửa Sản phẩm" : "Tạo mới Sản phẩm"}</SheetTitle>
                <SheetDescription>
                    Nhập thông tin chi tiết cho sản phẩm vào bên dưới.
                </SheetDescription>
            </SheetHeader>
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8 px-6 overflow-y-scroll"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Tên sản phẩm"
                                        type="text"
                                        {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    {categoriesLoading ? (
                                        <div className="flex items-center space-x-2 text-muted-foreground">
                                            <Loader2 className="animate-spin w-4 h-4" />
                                            <span>Loading categories...</span>
                                        </div>
                                    ) : (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat: Category) => (
                                                    <SelectItem key={cat.id} value={cat.documentId}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Đơn giá</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={typeof field.value === "number" ? field.value : ""}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        placeholder="Nhập giá sản phẩm"
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field}
                                        value={typeof field.value === "number" ? field.value : ""}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        placeholder="Nhập số lượng sản phẩm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                              <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode</FormLabel>
                <FormControl>
                  <Input placeholder="Product barcode" {...field} />
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
                                        placeholder="Product description"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-2">
                        <FormLabel>Image</FormLabel>
                        {imagePreview && (
                            <div className="relative w-full max-w-xs">
                                <Image
                                    src={process.env.NEXT_PUBLIC_STRAPI_URL + imagePreview}
                                    alt="Product Preview"
                                    width={500}
                                    height={500}
                                    className="object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setImageId(null);
                                    }}
                                    className="absolute top-1 right-1 bg-white/80 hover:bg-white p-1 rounded-full"
                                >
                                    <X className="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                        )}

                        <div>
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-primary hover:underline">
                                <UploadCloud className="w-4 h-4" />
                                Upload image
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>

                        {uploading && (
                            <div className="flex items-center gap-2 text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading... {uploadProgress}%
                            </div>
                        )}
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Đang lưu..." : "Xác nhận"}
                    </Button>
                </form>
            </Form>
        </SheetContent>
    )
};