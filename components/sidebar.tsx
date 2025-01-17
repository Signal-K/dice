import { Star } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-16 border-r bg-white">
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="rounded-lg p-2 hover:bg-gray-100">
          <Star className="h-6 w-6 text-gray-700" />
        </div>
        <div className="rounded-full bg-emerald-500 p-2">
          <Star className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

