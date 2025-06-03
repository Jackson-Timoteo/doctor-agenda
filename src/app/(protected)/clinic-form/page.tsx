import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import ClinicForm from "./_components/form";


const ClinicFormPage = () => {

    return (
        <Dialog open>
            <form>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Adicionar clínica</DialogTitle>
                        <DialogDescription>
                            Preencha os campos abaixo para adicionar uma nova clínica.
                        </DialogDescription>
                    </DialogHeader>
                    <ClinicForm />
                </DialogContent>
            </form>
        </Dialog>
    );
}

export default ClinicFormPage;