"use client";

import {
    CalendarIcon,
    ClockIcon,
    DollarSignIcon,
    TrashIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteDoctor } from "@/actions/delete-doctors";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { doctorsTable } from "@/db/schema";
import { formatCurrency } from "@/helpers/currency";

import { getAvailability } from "../_helpers/availability";
import UpsertDoctorForm from "./upsert-doctor-forms";

interface DoctorCardProps {
    doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
    const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
        useState(false);
    const deleteDoctorAction = useAction(deleteDoctor, {
        onSuccess: () => {
            toast.success("Médico deletado com sucesso.");
        },
        onError: () => {
            toast.error("Erro ao deletar médico.");
        },
    });
    const handleDeleteDoctorClick = () => {
        if (!doctor) return;
        deleteDoctorAction.execute({ id: doctor.id });
    };

    const doctorInitials = doctor.name
        .split(" ")
        .map((name) => name[0])
        .join("");
    const availability = getAvailability(doctor);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback>{doctorInitials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium truncate">{doctor.name}</h3>
                        <p className="text-muted-foreground text-sm truncate">{doctor.specialty}</p>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-2 py-3 flex-1">
                <Badge variant="outline" className="justify-start text-xs">
                    <CalendarIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                        {availability.from.format("dddd")} a {availability.to.format("dddd")}
                    </span>
                </Badge>
                <Badge variant="outline" className="justify-start text-xs">
                    <ClockIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                        {availability.from.format("HH:mm")} as{" "}
                        {availability.to.format("HH:mm")}
                    </span>
                </Badge>
                <Badge variant="outline" className="justify-start text-xs">
                    <DollarSignIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                        {formatCurrency(doctor.appointmentPriceInCents)}
                    </span>
                </Badge>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col gap-2 pt-3">
                <Dialog
                    open={isUpsertDoctorDialogOpen}
                    onOpenChange={setIsUpsertDoctorDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="w-full text-sm">Ver detalhes</Button>
                    </DialogTrigger>
                    <UpsertDoctorForm
                        isOpen={isUpsertDoctorDialogOpen}
                        doctor={{
                            ...doctor,
                            availableFromTime: availability.from.format("HH:mm:ss"),
                            availableToTime: availability.to.format("HH:mm:ss"),
                        }}
                        onSuccess={() => setIsUpsertDoctorDialogOpen(false)}
                    />
                </Dialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full text-sm">
                            <TrashIcon className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Deletar médico</span>
                            <span className="sm:hidden">Deletar</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="mx-4 max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-base">
                                Tem certeza que deseja deletar esse médico?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                                Essa ação não pode ser revertida. Isso irá deletar o médico e
                                todas as consultas agendadas.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDeleteDoctorClick}
                                className="w-full sm:w-auto"
                            >
                                Deletar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
};

export default DoctorCard;

