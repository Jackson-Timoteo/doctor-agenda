import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertDoctor } from "@/actions/upsert-doctor";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { doctorsTable } from "@/db/schema";

import { medicalSpecialties } from "./_constants";


const formSchema = z
    .object({
        name: z.string().trim().min(1, {
            message: "Nome é obrigatório.",
        }),
        specialty: z.string().trim().min(1, {
            message: "Especialidade é obrigatória.",
        }),
        appointmentPrice: z.number().min(1, {
            message: "Preço da consulta é obrigatório.",
        }),
        availableFromWeekDay: z.string(),
        availableToWeekDay: z.string(),
        availableFromTime: z.string().min(1, {
            message: "Hora de início é obrigatória.",
        }),
        availableToTime: z.string().min(1, {
            message: "Hora de término é obrigatória.",
        }),
    })
    .refine(
        (data) => {
            return data.availableFromTime < data.availableToTime;
        },
        {
            message:
                "O horário de início não pode ser anterior ao horário de término.",
            path: ["availableToTime"],
        },
    );

interface UpsertDoctorFormProps {
    isOpen: boolean;
    doctor?: typeof doctorsTable.$inferSelect;
    onSuccess?: () => void;
}

// 2. Us
const UpsertDoctorForm = ({ isOpen, doctor, onSuccess }: UpsertDoctorFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        shouldUnregister: true,
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: doctor?.name ?? "",
            specialty: doctor?.specialty ?? "",
            appointmentPrice: doctor?.appointmentPriceInCents
                ? doctor.appointmentPriceInCents / 100
                : 0,
            availableFromWeekDay: doctor?.availableFromWeekDay?.toString() ?? "1",
            availableToWeekDay: doctor?.availableToWeekDay?.toString() ?? "5",
            availableFromTime: doctor?.availableFromTime ?? "",
            availableToTime: doctor?.availableToTime ?? "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: doctor?.name ?? "",
                specialty: doctor?.specialty ?? "",
                appointmentPrice: doctor?.appointmentPriceInCents
                    ? doctor.appointmentPriceInCents / 100
                    : 0,
                availableFromWeekDay: doctor?.availableFromWeekDay?.toString() ?? "1",
                availableToWeekDay: doctor?.availableToWeekDay?.toString() ?? "5",
                availableFromTime: doctor?.availableFromTime ?? "",
                availableToTime: doctor?.availableToTime ?? "",
            });
        }
    }, [isOpen, form, doctor]);




    const upsertDoctorAction = useAction(upsertDoctor, {
        onSuccess: () => {
            toast.success("Médico adicionado com sucesso.");
            onSuccess?.();
        },
        onError: () => {
            toast.error("Erro ao adicionar médico.");
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        upsertDoctorAction.execute({
            ...values,
            id: doctor?.id,
            availableFromWeekDay: parseInt(values.availableFromWeekDay),
            availableToWeekDay: parseInt(values.availableToWeekDay),
            appointmentPriceInCents: values.appointmentPrice * 100,
        });
    };

    return (
        <DialogContent className="mx-4 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-lg">{doctor ? doctor.name : "Adicionar médico"}</DialogTitle>
                <DialogDescription className="text-sm">
                    {doctor
                        ? "Edite as informações desse médico."
                        : "Adicione um novo médico."}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Nome</FormLabel>
                                <FormControl>
                                    <Input {...field} className="text-sm" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="specialty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Especialidade</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full text-sm">
                                            <SelectValue placeholder="Selecione uma especialidade" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-60">
                                        {medicalSpecialties.map((specialty) => (
                                            <SelectItem key={specialty.value} value={specialty.value} className="text-sm">
                                                {specialty.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="appointmentPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Preço da consulta</FormLabel>
                                <NumericFormat
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value.floatValue);
                                    }}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    decimalSeparator=","
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    thousandSeparator="."
                                    customInput={Input}
                                    prefix="R$"
                                    className="text-sm"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="availableFromWeekDay"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Dia inicial</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full text-sm">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="0" className="text-sm">Domingo</SelectItem>
                                            <SelectItem value="1" className="text-sm">Segunda</SelectItem>
                                            <SelectItem value="2" className="text-sm">Terça</SelectItem>
                                            <SelectItem value="3" className="text-sm">Quarta</SelectItem>
                                            <SelectItem value="4" className="text-sm">Quinta</SelectItem>
                                            <SelectItem value="5" className="text-sm">Sexta</SelectItem>
                                            <SelectItem value="6" className="text-sm">Sábado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="availableToWeekDay"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Dia final</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full text-sm">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="0" className="text-sm">Domingo</SelectItem>
                                            <SelectItem value="1" className="text-sm">Segunda</SelectItem>
                                            <SelectItem value="2" className="text-sm">Terça</SelectItem>
                                            <SelectItem value="3" className="text-sm">Quarta</SelectItem>
                                            <SelectItem value="4" className="text-sm">Quinta</SelectItem>
                                            <SelectItem value="5" className="text-sm">Sexta</SelectItem>
                                            <SelectItem value="6" className="text-sm">Sábado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="availableFromTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Horário inicial</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full text-sm">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-60">
                                            <SelectGroup>
                                                <SelectLabel>Manhã</SelectLabel>
                                                <SelectItem value="05:00:00" className="text-sm">05:00</SelectItem>
                                                <SelectItem value="05:30:00" className="text-sm">05:30</SelectItem>
                                                <SelectItem value="06:00:00" className="text-sm">06:00</SelectItem>
                                                <SelectItem value="06:30:00" className="text-sm">06:30</SelectItem>
                                                <SelectItem value="07:00:00" className="text-sm">07:00</SelectItem>
                                                <SelectItem value="07:30:00" className="text-sm">07:30</SelectItem>
                                                <SelectItem value="08:00:00" className="text-sm">08:00</SelectItem>
                                                <SelectItem value="08:30:00" className="text-sm">08:30</SelectItem>
                                                <SelectItem value="09:00:00" className="text-sm">09:00</SelectItem>
                                                <SelectItem value="09:30:00" className="text-sm">09:30</SelectItem>
                                                <SelectItem value="10:00:00" className="text-sm">10:00</SelectItem>
                                                <SelectItem value="10:30:00" className="text-sm">10:30</SelectItem>
                                                <SelectItem value="11:00:00" className="text-sm">11:00</SelectItem>
                                                <SelectItem value="11:30:00" className="text-sm">11:30</SelectItem>
                                                <SelectItem value="12:00:00" className="text-sm">12:00</SelectItem>
                                                <SelectItem value="12:30:00" className="text-sm">12:30</SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Tarde</SelectLabel>
                                                <SelectItem value="13:00:00" className="text-sm">13:00</SelectItem>
                                                <SelectItem value="13:30:00" className="text-sm">13:30</SelectItem>
                                                <SelectItem value="14:00:00" className="text-sm">14:00</SelectItem>
                                                <SelectItem value="14:30:00" className="text-sm">14:30</SelectItem>
                                                <SelectItem value="15:00:00" className="text-sm">15:00</SelectItem>
                                                <SelectItem value="15:30:00" className="text-sm">15:30</SelectItem>
                                                <SelectItem value="16:00:00" className="text-sm">16:00</SelectItem>
                                                <SelectItem value="16:30:00" className="text-sm">16:30</SelectItem>
                                                <SelectItem value="17:00:00" className="text-sm">17:00</SelectItem>
                                                <SelectItem value="17:30:00" className="text-sm">17:30</SelectItem>
                                                <SelectItem value="18:00:00" className="text-sm">18:00</SelectItem>
                                                <SelectItem value="18:30:00" className="text-sm">18:30</SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Noite</SelectLabel>
                                                <SelectItem value="19:00:00" className="text-sm">19:00</SelectItem>
                                                <SelectItem value="19:30:00" className="text-sm">19:30</SelectItem>
                                                <SelectItem value="20:00:00" className="text-sm">20:00</SelectItem>
                                                <SelectItem value="20:30:00" className="text-sm">20:30</SelectItem>
                                                <SelectItem value="21:00:00" className="text-sm">21:00</SelectItem>
                                                <SelectItem value="21:30:00" className="text-sm">21:30</SelectItem>
                                                <SelectItem value="22:00:00" className="text-sm">22:00</SelectItem>
                                                <SelectItem value="22:30:00" className="text-sm">22:30</SelectItem>
                                                <SelectItem value="23:00:00" className="text-sm">23:00</SelectItem>
                                                <SelectItem value="23:30:00" className="text-sm">23:30</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="availableToTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Horário final</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full text-sm">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-60">
                                            <SelectGroup>
                                                <SelectLabel>Manhã</SelectLabel>
                                                <SelectItem value="05:00:00" className="text-sm">05:00</SelectItem>
                                                <SelectItem value="05:30:00" className="text-sm">05:30</SelectItem>
                                                <SelectItem value="06:00:00" className="text-sm">06:00</SelectItem>
                                                <SelectItem value="06:30:00" className="text-sm">06:30</SelectItem>
                                                <SelectItem value="07:00:00" className="text-sm">07:00</SelectItem>
                                                <SelectItem value="07:30:00" className="text-sm">07:30</SelectItem>
                                                <SelectItem value="08:00:00" className="text-sm">08:00</SelectItem>
                                                <SelectItem value="08:30:00" className="text-sm">08:30</SelectItem>
                                                <SelectItem value="09:00:00" className="text-sm">09:00</SelectItem>
                                                <SelectItem value="09:30:00" className="text-sm">09:30</SelectItem>
                                                <SelectItem value="10:00:00" className="text-sm">10:00</SelectItem>
                                                <SelectItem value="10:30:00" className="text-sm">10:30</SelectItem>
                                                <SelectItem value="11:00:00" className="text-sm">11:00</SelectItem>
                                                <SelectItem value="11:30:00" className="text-sm">11:30</SelectItem>
                                                <SelectItem value="12:00:00" className="text-sm">12:00</SelectItem>
                                                <SelectItem value="12:30:00" className="text-sm">12:30</SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Tarde</SelectLabel>
                                                <SelectItem value="13:00:00" className="text-sm">13:00</SelectItem>
                                                <SelectItem value="13:30:00" className="text-sm">13:30</SelectItem>
                                                <SelectItem value="14:00:00" className="text-sm">14:00</SelectItem>
                                                <SelectItem value="14:30:00" className="text-sm">14:30</SelectItem>
                                                <SelectItem value="15:00:00" className="text-sm">15:00</SelectItem>
                                                <SelectItem value="15:30:00" className="text-sm">15:30</SelectItem>
                                                <SelectItem value="16:00:00" className="text-sm">16:00</SelectItem>
                                                <SelectItem value="16:30:00" className="text-sm">16:30</SelectItem>
                                                <SelectItem value="17:00:00" className="text-sm">17:00</SelectItem>
                                                <SelectItem value="17:30:00" className="text-sm">17:30</SelectItem>
                                                <SelectItem value="18:00:00" className="text-sm">18:00</SelectItem>
                                                <SelectItem value="18:30:00" className="text-sm">18:30</SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Noite</SelectLabel>
                                                <SelectItem value="19:00:00" className="text-sm">19:00</SelectItem>
                                                <SelectItem value="19:30:00" className="text-sm">19:30</SelectItem>
                                                <SelectItem value="20:00:00" className="text-sm">20:00</SelectItem>
                                                <SelectItem value="20:30:00" className="text-sm">20:30</SelectItem>
                                                <SelectItem value="21:00:00" className="text-sm">21:00</SelectItem>
                                                <SelectItem value="21:30:00" className="text-sm">21:30</SelectItem>
                                                <SelectItem value="22:00:00" className="text-sm">22:00</SelectItem>
                                                <SelectItem value="22:30:00" className="text-sm">22:30</SelectItem>
                                                <SelectItem value="23:00:00" className="text-sm">23:00</SelectItem>
                                                <SelectItem value="23:30:00" className="text-sm">23:30</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
                        <Button 
                            type="submit" 
                            disabled={upsertDoctorAction.isPending}
                            className="w-full sm:w-auto text-sm"
                        >
                            {upsertDoctorAction.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
};

export default UpsertDoctorForm;

