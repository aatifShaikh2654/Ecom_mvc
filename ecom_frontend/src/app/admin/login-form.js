'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { CheckCircle, Loader2 } from "lucide-react"
import { toast } from "@/lib/toast";
import { login } from "../api-integeration/auth"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}) {

  const { handleSubmit, register, watch, formState: { isSubmitting, errors } } = useForm()
  const router = useRouter()
  const onSubmit = async (data) => {
    const json = await login(data);
    console.log(json)
    if(json.success){
      toast.success(json.message)
      router.push("/admin/dashboard")
    } else {
      toast.warning(json.message)
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground !text-sm">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid">
                <Label htmlFor="email">Email</Label>
                <Input
                  className={"mt-1"}
                  id="email" type="email" placeholder="m@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })} />
                {errors.email && (
                  <p className="text-xs mb-0 text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-xs underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input className={"mt-1"} id="password" type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 3,
                      message: "Password must be at least 3 characters",
                    },
                  })} />
                {errors.password && (
                  <p className="text-xs mb-0 text-red-500">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
                {isSubmitting ? <Loader2 className=" animate-spin" /> : "Login"}
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
