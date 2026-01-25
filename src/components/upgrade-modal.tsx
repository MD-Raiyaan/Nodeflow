"use client";

import { AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
 } from "@/components/ui/alert-dialog";
 import { authClient } from "@/lib/auth-client";

 interface upgradeModalProps{
    open:boolean,
    onOpenChange:(open:boolean)=>void
 }

 export const UpgradeModal = ({ open, onOpenChange }: upgradeModalProps) => {
    return(
        <AlertDialog open={open} onOpenChange={onOpenChange}>
           <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
                <AlertDialogDescription>
                    You need an active subscription to perform this action.Upgrade to Pro to unlock all features.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>authClient.checkout({slug:"Nodeflow_pro"})}>
                   Upgrade Now
                </AlertDialogAction>
            </AlertDialogFooter>
           </AlertDialogContent>
        </AlertDialog>
    );
 };