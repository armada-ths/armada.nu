"use client"
import { Page } from "@/components/shared/Page"
import Image from "next/image"
import { useState } from "react"

// ✅ Step 1: Define your data
const companies = [
  {
    name: "Afry",
    image: require("./img/afry.png"),
    description: "Afry is an international engineering, design and advisory company.",
  },
]

export default function AtFairPage() {
  const [selected, setSelected] = useState<null | typeof companies[0]>(null)

  return (
    <Page.Background withIndents>
        <Page.Boundary>
            <Page.Header>Companies at the Fair</Page.Header>

            {/* ✅ Step 2: Render list of companies */}
            <div className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
                    {companies.map((company) => (
                    <div
                        key={company.name}
                        className="cursor-pointer rounded-xl bg-black p-4 shadow-md hover:scale-105 transition"
                        onClick={() => setSelected(company)}
                    >
                        <Image
                        src={company.image}
                        alt={company.name}
                        width={120}
                        height={120}
                        className="mx-auto rounded-lg"
                        />
                        <p className="mt-3 text-center text-green-100">{company.name}</p>
                    </div>
                    ))}
                </div>
            </div>

            {/* ✅ Step 3: Popup (modal) */}
            {selected && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <h2 className="text-xl font-semibold mb-4">{selected.name}</h2>
                    <p className="mb-4 text-gray-700">{selected.description}</p>

                    <button
                    onClick={() => setSelected(null)}
                    className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                    Close
                    </button>
                </div>
                </div>
            )}
        </Page.Boundary>
    </Page.Background>
  )
}
