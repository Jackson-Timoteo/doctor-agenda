'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const registerSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nome é obrigatório' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z.string().trim().min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
});

const SignUpForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    }, {
      onSuccess: () => {
        router.push('/dashboard');
      },
      onError: (ctx) => {
        if (ctx.error.code === 'USER_ALREADY_EXISTS') {
          toast.error("E-mail já cadastrado, utilize o login para acessar sua conta.");
          return
        }
        toast.error("Erro ao criar conta");
      },
    });
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Criar conta
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Criar uma conta para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 px-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite seu nome" 
                      type="text"
                      autoComplete="name"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    E-mail
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite seu e-mail" 
                      type="email"
                      autoComplete="email"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Senha
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite sua senha" 
                      type="password"
                      autoComplete="new-password"
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="px-6 pb-6">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Criar conta'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SignUpForm;

