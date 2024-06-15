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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as z from 'zod';
import { apiService } from "@/lib/services/api"
import { Endpoints } from '@/lib/enums/endpoints';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(4)
});

type UserFormValue = z.infer<typeof formSchema>;

const defaultValues = {
  email: 'demo@gmail.com'
};

export default function UserAuthForm() {
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const navigate = useNavigate();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const login = useMutation({
    mutationFn: async (data: UserFormValue) => {
      await apiService.post(Endpoints.LOGIN, {
        email: data.email,
        password: data.password,
      })
      navigate(callbackUrl ?? "/dashboard")

    },
    onError: (error) => {
      console.error(error);
    }
  })

  const onSubmit = async (data: UserFormValue) => {
    login.mutate(data);
  };

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
