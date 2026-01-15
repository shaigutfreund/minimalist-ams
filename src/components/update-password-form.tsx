'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
        // Example recovery URL:
        // http://localhost:3000/auth/update-password
        // #access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6IkxMSFBoMEpwM3VUYU1kdlMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2x3Y3JhcnlqcXFhaHBpZ2V1anlnLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzNDhiYzJlMi0zYTNlLTQzOTItODIwNi1kMmMxMWJlYzM1ZDYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzY4Mzk2Mzk2LCJpYXQiOjE3NjgzOTI3OTYsImVtYWlsIjoic2hhaS5ndXRmcmV1bmRAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzY4MzkyNzk2fV0sInNlc3Npb25faWQiOiJkMzkwZGIyYy1lYmExLTRiZTctYTg3ZC1kMzE5ZDcwZDRiZmIiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.ZiJeBE3NQWjUYSNdo95YafMndULCPX7D9R4u20oj4Jk&
        // expires_at=1768396396&
        // expires_in=3600&
        // refresh_token=huluqda23cqw&
        // token_type=bearer
        // &type=recovery

        // Extract access_token from URL hash
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const accessToken = params.get('access_token')

      console.log('Access Token:', accessToken);

      // Ensure the user is not denied by checking 'access_denied' param
      if (params.get('error') === 'access_denied') {
        throw new Error('Access denied. Unable to reset password.')
      }

      if (!accessToken) {
        throw new Error('Access token not found in URL')
      }

        // Set the access token for the current session
        const { data, error: sessionError } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: '' })

        if (sessionError) {
            console.error('Error setting session:', sessionError)
            throw sessionError
        }
        else if (!data.session){
            console.error('No session returned after setting access token')
            throw new Error('Failed to set session with provided access token')
        }
        console.log('Session set successfully:', data.session)

        // Now update the password
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push('/protected')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save new password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
