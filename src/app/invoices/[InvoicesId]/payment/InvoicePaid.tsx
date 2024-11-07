import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function Component({ amount, date }: { amount: number; date?: string }) {
  return (
    <Card className="w-full max-w-sm bg-green-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Invoice Paid</CardTitle>
        <CheckCircle className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${(amount / 100).toFixed(2)}</div>
        <CardDescription>Paid on {date}</CardDescription>
      </CardContent>
    </Card>
  )
}