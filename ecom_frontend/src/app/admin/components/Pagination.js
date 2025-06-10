'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"

export default function Pagination({ total, page, limit }) {
    const router = useRouter()

    const currentPage = parseInt(page || "1")
    const currentLimit = parseInt(limit || "10")

    const setQueryParam = (key, value) => {
        const params = new URLSearchParams(window.location.search)
        params.set(key, value)
        if (key !== "page") params.set("page", "1") // reset to page 1 on limit change
        router.push(`?${params.toString()}`)
    }

    const renderPageButtons = () => {
        const buttons = []

        for (let i = 1; i <= total; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQueryParam("page", i)}
                >
                    {i}
                </Button>
            )
        }

        return buttons
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={currentLimit.toString()} onValueChange={(val) => setQueryParam("limit", val)}>
                    <SelectTrigger className="w-[80px] h-8 text-sm">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 20, 50, 100].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                                {num}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setQueryParam("page", currentPage - 1)}
                >
                    Previous
                </Button>

                {renderPageButtons()}

                <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage >= total}
                    onClick={() => setQueryParam("page", currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
