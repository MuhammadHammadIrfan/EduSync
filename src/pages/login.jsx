"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")

  if (!role || !email || !password) {
    setError("Please fill in all fields and select a role")
    return
  }

  setIsLoading(true)

  const result = await signIn("credentials", {
    redirect: false,
    email,
    password,
    role,
  })

  if (result.ok) {
    router.push(`/${role}/dashboard`)
  } else {
    setError("Invalid credentials")
  }

  setIsLoading(false)
}


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Head>
        <title>Login - EduSync</title>
        <meta name="description" content="Login to your EduSync account" />
      </Head>

      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">EduSync</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" aria-label="Select role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
