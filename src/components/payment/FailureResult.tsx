"use client";

import PaymentStatus from "@/components/movie-section/PaymentStatus";
import { useAppContext } from "@/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const FailurePage = () => {
    const { user } = useAppContext();
    const searchParams = useSearchParams();
    const tuuid = searchParams.get("tuuid");
    const router = useRouter();

    useEffect(() => {
        if (!tuuid) {
            router.replace("/");
        }
    }, [router, tuuid]);
    if (!tuuid) return null;
    const changePaymentStatus = async () => {
        try {
            const response = await fetch("/api/payment/verify-failure", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tuuid: tuuid }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
            }
        } catch (error) {
            console.error("Error in changePaymentStatus():", error);
        }
    };

    useEffect(() => {
        if (user) {
            changePaymentStatus();
        }
    }, [user]);
    return (
        <div>
            <PaymentStatus
                heading="Payment Unsuccessful"
                message="Oops! Your payment could not be processed. Please try again or contact support if the issue persists."
                image="/failure.jpg"
                ticket={false}
            />
        </div>
    );
};

export default FailurePage;
