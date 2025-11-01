import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProp {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProp) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 rounded-md flex items-center p-2 tsxt-sm gap-x-2 text-emerald-500">
      <CheckCircledIcon />
      <p>{message}</p>
    </div>
  );
};
