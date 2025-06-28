"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertDoctorForm from "./upsert-doctor-forms";

const AddDoctorButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="text-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Adicionar médico</span>
                    <span className="sm:hidden">Adicionar</span>
                </Button>
            </DialogTrigger>
            <UpsertDoctorForm isOpen={isOpen} onSuccess={() => setIsOpen(false)} />
        </Dialog>
    );
};

export default AddDoctorButton;

