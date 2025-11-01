import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 rounded-md p-2 flex items-center gap-3 tsxt-sm text-destructive">
      <ExclamationTriangleIcon />
      <p>{message}</p>
    </div>
  );
};
