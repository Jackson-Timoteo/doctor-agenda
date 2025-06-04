"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertDoctorForms from "./upsert-doctor-forms";

const AddDoctorButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Adicionar médico
                </Button>
            </DialogTrigger>
            <UpsertDoctorForms />
        </Dialog>
    );
}

export default AddDoctorButton;