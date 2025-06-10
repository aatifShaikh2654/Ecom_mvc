"use client";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import Image from "next/image";
import { addProduct, updateProduct } from "@/app/api-integeration/product";
import { toast } from "@/lib/toast";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";



const Add = ({ category, product, type = "add" }) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            available: product?.available || true,
            name: product?.name,
            category: product?.category?._id,
            price: product?.price,
            stock: product?.stock,
            description: product?.description,
            images: [], // only new images here
        }
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [imageError, setImageError] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (type === "edit" && product?.images?.length) {
            setExistingImages(product.images);
        }
    }, [product, type]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previews]);
        setValue("images", files);
    };

    const handleRemoveImage = (index, isExisting = false) => {
        if (isExisting) {
            const imageToDelete = existingImages[index];
            setDeletedImages(prev => [...prev, imageToDelete]);
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            const updated = watch("images")?.filter((_, i) => i !== index);
            setPreviewImages(prev => prev.filter((_, i) => i !== index));
            setValue("images", updated);
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key !== "images") {
                formData.append(key, value);
            }
        });

        if (data.images?.length > 0) {
            data.images.forEach((img) => formData.append("images", img));
        }

        if (deletedImages.length > 0) {
            formData.append("deletedImages", JSON.stringify(deletedImages))
        }

        if (type === "edit") {
            formData.append("productId", product._id);
        }

        const response = type === "add"
            ? await addProduct(formData)
            : await updateProduct(formData);

        if (response?.success) {
            toast.success(response.message);
            router.push("/admin/dashboard/products/");
        } else {
            toast.error(response?.message || "Something went wrong");
        }
    };

    return (
        <div className="w-full mx-auto p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="images">Images (max 5)</Label>
                    <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className="flex items-center gap-2">
                        {imageError && <p className="text-sm text-red-500">{imageError}</p>}
                        {existingImages.map((src, idx) => (
                            <div key={`exist-${idx}`} className="relative">
                                <Image src={process.env.IMAGE_URL + src} alt="Existing" width={130} height={130} />
                                <button
                                    type="button"
                                    className="absolute cursor-pointer right-1 top-1 bg-red-500 text-white p-1 rounded-full"
                                    onClick={() => handleRemoveImage(idx, true)}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {previewImages.map((src, idx) => (
                            <div key={`preview-${idx}`} className="relative">
                                <Image src={src} alt="New" width={130} height={130} />
                                <button
                                    type="button"
                                    className="absolute cursor-pointer right-1 top-1 bg-red-500 text-white p-1 rounded-full"
                                    onClick={() => handleRemoveImage(idx, false)}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name", { required: "Product name is required" })} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...register("price", { required: "Price is required" })}
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        type="number"
                        {...register("stock", { required: "Stock is required" })}
                    />
                    {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label>Category</Label>
                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: "Category is required" }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className={"w-full"}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {category.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.category && (
                        <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                </div>

                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        rows={4}
                        {...register("description", { required: "Description is required" })}
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500">{errors.description.message}</p>
                    )}
                </div>

                <div className="flex items-center space-x-2 md:col-span-2">
                    <Controller
                        name="available"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                id="available"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor="available">Available Always</Label>
                </div>

                <div className="md:col-span-2">
                    <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? <Loader2 className=" animate-spin" /> : type === "edit" ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Add;
