interface AuthErrorMessageProps {
  error?: string;
}

export const AuthErrorMessage = ({ error }: AuthErrorMessageProps) => {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 py-2 px-4 rounded mb-4 text-sm">
      {error}
    </div>
  );
};
export default AuthErrorMessage;
