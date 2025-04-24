// "use client"

// import { ExhibitorCard } from "@/app/student/exhibitors/_components/ExhibitorCard"
// import ExhibitorFilters from "@/app/student/exhibitors/_components/ExhibitorFilters"
// import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select"

// import { DateTime } from "luxon"
// import { useState } from "react"

// function getAllYears() {
//   const currentYear = DateTime.now().year
//   return new Array(currentYear - 2021).fill(0).map((_, i) => currentYear - i)
// }

// export function ExhibitorList({
//   exhibitorsByYear
// }: {
//   exhibitorsByYear: { year: string; exhibitors: Exhibitor[] }[]
// }) {
//   const [year, setYear] = useState(
//     DateTime.now().minus({ months: 6 }).year.toString()
//   )
//   const allYears = getAllYears()

//   function getExhibitorsForYear(year: string) {
//     return (
//       exhibitorsByYear.find(x => x.year === year)?.exhibitors ??
//       exhibitorsByYear[0].exhibitors
//     )
//   }

//   const exhibitors = getExhibitorsForYear(year)
//   const [filteredExhibitors, setFilteredExhibitors] = useState(exhibitors)

//   function onYearSelectChange(year: string) {
//     setYear(year)
//     setFilteredExhibitors(getExhibitorsForYear(year))
//   }

//   return (
//     <div className="mt-10">
//       <div className="flex justify-between">
//         <ExhibitorFilters
//           key={year} // reset filters when year changes
//           exhibitors={exhibitors}
//           onChange={setFilteredExhibitors}
//         />
//         <Select value={year} onValueChange={onYearSelectChange}>
//           <SelectTrigger className="mb-2 w-32">
//             <SelectValue placeholder="Fair Year" />
//           </SelectTrigger>
//           <SelectContent>
//             {allYears.map(year => (
//               <SelectItem key={year} value={year.toString()}>
//                 {year}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <p className="mt-8 text-stone-400">
//         Showing {filteredExhibitors.length} out of {exhibitors.length}
//       </p>

//       <div className="mt-4 grid auto-rows-[200px] grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
//         {filteredExhibitors.map(exhibitor => (
//           <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
//         ))}
//       </div>
//     </div>
//   )
// }
