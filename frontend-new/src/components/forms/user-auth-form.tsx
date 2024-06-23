import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as z from 'zod';
import { apiService } from "@/lib/services/api"
import { Endpoints } from '@/lib/enums/endpoints';
import { useMutation } from '@tanstack/react-query';
import { get } from 'lodash';
import { User } from '@/types/movies';
import { useUser } from '@/providers/user';
import { useEffect } from 'react';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(4)
});

type UserFormValue = z.infer<typeof formSchema>;

const defaultValues = {
  email: 'demo@gmail.com',
  password: ''
};

export default function UserAuthForm() {
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user])
  const login = useMutation({
    mutationFn: async (formData: UserFormValue) => {
      const { data } = await apiService.post(Endpoints.LOGIN, {
        email: formData.email,
        password: formData.password,
      })
      const token = get(data, 'accessToken')
      if (!token) throw new Error('Token not found')
      apiService.setToken(token)
      await apiService.get(Endpoints.PROFILE)
        .then(({ data }) => {
          setUser(data as User);
          navigate(callbackUrl ?? "/dashboard")
        })
        .catch((e) => {
          setUser(null);
        })
    },
    onError: (error) => {
      console.error(error);
    }
  })

  const onSubmit = async (data: UserFormValue) => login.mutate(data);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={login.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    disabled={login.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />         <Button disabled={login.isPending} className="ml-auto w-full" type="submit">
            Continue With Email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </>
  );
}
