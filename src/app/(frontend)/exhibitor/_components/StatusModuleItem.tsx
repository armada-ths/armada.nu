import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sparkles } from "lucide-react"

export function StatusModuleItem({
  children,
  title
}: {
  children?: React.ReactNode
  title: string
}) {
  return (
    <div>
      <Alert className="mt-5">
        <Sparkles size={20} />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    </div>
  )
}
