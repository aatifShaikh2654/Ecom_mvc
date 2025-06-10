'use client'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

const Search = () => {

    const router = useRouter()
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams?.get("search") || "")

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search)
        params.set("search", search)
        router.push(`?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSearch}>
            <Input
                placeholder="Filter name..."
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
                className="max-w-[400px]"
            />
        </form>
    )
}

export default Search
