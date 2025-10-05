import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
    useState
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

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

type NewProps = {
    item?: {
        id?: string;
        name?: string;
        description?: string;
    } | null;
    onSuccess?: () => void;
    isOpen?: boolean;
};

export const New = ({item = null, onSuccess, isOpen}: NewProps) => {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: item?.name || "",
            description: item?.description || "",
        }
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        if (onSuccess) onSuccess();
    }

    
        return (
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{item?.id ? "Chỉnh sửa danh mục" : "Tạo mới danh mục"}</SheetTitle>
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
                        <Button type="submit">
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        )
    };