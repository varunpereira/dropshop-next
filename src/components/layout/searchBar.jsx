import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { SearchIcon, XIcon } from '@heroicons/react/solid'
import Link from 'next/link'

export default function component(props) {
  let [search, setSearch] = useState('')
  let [sort, setSort] = useState('')
  let [category, setCategory] = useState('')
  let router = useRouter()

  function handleCategory(e) {
    e.preventDefault()
    setCategory(e.target.value)
  }

  function searchResults(e) {
    e.preventDefault()
    router.push('/result?search=' + search)
  }
  // outermost is relative, search bar and list is absolute

  return (
    <div className="sm:absolute md:relative mr-5 max-h-min w-full min-w-min pb-2 shadow-md md:flex text-black">
      <div className="flex flex-col  bg-white pl-2 md:flex-row md:rounded-l-md">
        <div className="text-gray-800">
          <select
            className="custom-select mt-1"
            value={category}
            onChange={handleCategory}
          >
            <option value="all">All</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>
      <form className=" relative w-full " onSubmit={(e) => searchResults(e)}>
        <input
          value={search.trim()}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="focus:shadow-outline w-full min-w-max bg-white py-2  pl-3 text-sm leading-tight text-black focus:outline-none md:rounded-r-md"
          placeholder="search"
        />
        {search !== '' && (
          <button
            onClick={(e) => setSearch('')}
            className="absolute inset-y-0 right-10 w-10  max-w-min items-center justify-center"
            type="button"
          >
            <XIcon className="h-4 w-4 text-black" />
          </button>
        )}
        <button
          className="absolute inset-y-0 right-0 w-10 max-w-min  cursor-pointer items-center justify-center bg-white pr-3 md:rounded-r-md"
          type="submit"
        >
          <SearchIcon className="h-5 w-5 text-black" />
        </button>
      </form>
    </div>
  )
}
