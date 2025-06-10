'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Trash2 } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { addCategory, updateCategory } from "@/app/api-integeration/product"
import { toast } from "@/lib/toast"
import { useRouter } from "next/navigation"


export function AddModal({ open, onOpenChange, type = "add", data = null }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const [previewImages, setPreviewImages] = useState(null);
    const [imageError, setImageError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (open && type === "edit" && data) {
            reset({
                name: data.name,
                // any other fields you want to prefill
            });

            console.log(data)

            if (data.image) {
                setPreviewImages(process.env.IMAGE_URL + data.image); // assuming you pass image URL
            }
        } else {
            reset(); // clear on open if not editing
            setPreviewImages(null);
        }
    }, [open, type, data, reset]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setImageError(null);
        setPreviewImages(preview);
        setValue("image", file);
    };

    const handleRemoveImage = () => {
        setPreviewImages(null);
        setValue("image", null);
    };

    const onSubmit = async (dataForm) => {

        const formData = new FormData();

        // Append all fields
        Object.keys(dataForm).forEach((key) => {
            if (dataForm[key]) {
                formData.append(key, dataForm[key]);
            }
        });

        let json;
        if (type === "add") {
            json = await addCategory(formData);
        } else {
            console.log(data?._id)
            formData.append("categoryId", data?.id)
            json = await updateCategory(formData);
        }

        if (json.success) {
            toast.success(json.message);
            router.refresh()
            onOpenChange(false)
            reset()
        } else {
            toast.error(json.message);
        }

    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{type === "add" ? "Add Category" : "Edit Category"}</DialogTitle>
                    <DialogDescription>Category</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="images">Image</Label>
                            <Input
                                id="images"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imageError && <p className="text-sm text-red-500">{imageError}</p>}
                            {previewImages && (
                                <div className="mt-3 flex gap-4 flex-wrap">
                                    <div className="w-fit max-h-[200px] h-fit rounded border relative overflow-hidden">
                                        <Image
                                            src={previewImages}
                                            alt="Preview"
                                            width={130}
                                            height={130}
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-1 top-1 z-10 bg-red-500 text-white p-1 rounded-full"
                                            onClick={handleRemoveImage}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter a name"
                                className={"mt-1"}
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button disabled={isSubmitting} type="submit">{isSubmitting ? <Loader2 className="animate-spin" /> : type === "add" ? "Add" : "Update"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
